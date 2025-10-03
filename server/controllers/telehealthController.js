const TelehealthSession = require('../models/TelehealthSession');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const crypto = require('crypto');

// Generate unique session and room IDs
const generateSessionId = () => `session_${crypto.randomBytes(8).toString('hex')}`;
const generateRoomId = () => `room_${crypto.randomBytes(8).toString('hex')}`;

// Create telehealth session
exports.createSession = async (req, res) => {
  try {
    const { appointmentId, platform = 'custom' } = req.body;

    // Verify appointment exists
    const appointment = await Appointment.findById(appointmentId)
      .populate('patientId')
      .populate('doctorId');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check if session already exists for this appointment
    const existingSession = await TelehealthSession.findOne({ appointmentId });
    if (existingSession) {
      return res.status(400).json({ error: 'Telehealth session already exists for this appointment' });
    }

    // Create telehealth session
    const session = new TelehealthSession({
      appointmentId,
      patientId: appointment.patientId._id,
      doctorId: appointment.doctorId._id,
      sessionId: generateSessionId(),
      roomId: generateRoomId(),
      startTime: appointment.date,
      platform,
      meetingUrl: platform === 'custom' ? `https://medicore-telehealth.com/${generateRoomId()}` : null
    });

    await session.save();

    res.status(201).json({
      message: 'Telehealth session created successfully',
      session
    });
  } catch (error) {
    console.error('Create telehealth session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get session by ID
exports.getSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await TelehealthSession.findOne({ sessionId })
      .populate('appointmentId')
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email specialization')
      .populate('participants.userId', 'name role');

    if (!session) {
      return res.status(404).json({ error: 'Telehealth session not found' });
    }

    res.json({ session });
  } catch (error) {
    console.error('Get telehealth session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get sessions for a user (patient or doctor)
exports.getUserSessions = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let query = {};
    if (user.role === 'patient') {
      query.patientId = userId;
    } else if (user.role === 'doctor') {
      query.doctorId = userId;
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (status) {
      query.status = status;
    }

    const sessions = await TelehealthSession.find(query)
      .populate('appointmentId', 'date time type')
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email specialization')
      .sort({ startTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await TelehealthSession.countDocuments(query);

    res.json({
      sessions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get user sessions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Join telehealth session
exports.joinSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.body;

    const session = await TelehealthSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Check if user is authorized to join
    const isAuthorized = session.patientId.equals(userId) ||
                        session.doctorId.equals(userId) ||
                        session.participants.some(p => p.userId.equals(userId));

    if (!isAuthorized) {
      return res.status(403).json({ error: 'Not authorized to join this session' });
    }

    // Update session status if starting
    if (session.status === 'scheduled') {
      session.status = 'in_progress';
      await session.save();
    }

    // Add participant if not already present
    const existingParticipant = session.participants.find(p => p.userId.equals(userId));
    if (!existingParticipant) {
      session.participants.push({
        userId,
        joinedAt: new Date()
      });
      await session.save();
    }

    res.json({
      message: 'Successfully joined session',
      session
    });
  } catch (error) {
    console.error('Join session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Leave telehealth session
exports.leaveSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.body;

    const session = await TelehealthSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Update participant left time
    const participant = session.participants.find(p => p.userId.equals(userId));
    if (participant) {
      participant.leftAt = new Date();
      await session.save();
    }

    // Check if session should end (no active participants)
    const activeParticipants = session.participants.filter(p => !p.leftAt);
    if (activeParticipants.length === 0 && session.status === 'in_progress') {
      session.status = 'completed';
      session.endTime = new Date();
      session.calculateDuration();
      await session.save();
    }

    res.json({
      message: 'Successfully left session',
      session
    });
  } catch (error) {
    console.error('Leave session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// End telehealth session
exports.endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await TelehealthSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    session.status = 'completed';
    session.endTime = new Date();
    session.calculateDuration();

    // Mark all participants as left
    session.participants.forEach(participant => {
      if (!participant.leftAt) {
        participant.leftAt = new Date();
      }
    });

    await session.save();

    res.json({
      message: 'Session ended successfully',
      session
    });
  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Report technical issue
exports.reportIssue = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { issue } = req.body;

    const session = await TelehealthSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    session.technicalIssues.push({
      issue,
      resolved: false
    });

    await session.save();

    res.json({
      message: 'Technical issue reported successfully',
      session
    });
  } catch (error) {
    console.error('Report issue error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get telehealth statistics
exports.getStats = async (req, res) => {
  try {
    const stats = await TelehealthSession.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalDuration: { $sum: '$duration' }
        }
      }
    ]);

    const totalSessions = await TelehealthSession.countDocuments();
    const completedSessions = await TelehealthSession.countDocuments({ status: 'completed' });

    res.json({
      stats,
      totalSessions,
      completedSessions,
      completionRate: totalSessions > 0 ? (completedSessions / totalSessions * 100).toFixed(2) : 0
    });
  } catch (error) {
    console.error('Get telehealth stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
