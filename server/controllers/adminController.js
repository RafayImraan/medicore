const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Billing = require('../models/Billing');
const Notification = require('../models/Notification');
const Incident = require('../models/Incident');
const Task = require('../models/Task');
const Report = require('../models/Report');
const ActivityLog = require('../models/ActivityLog');
const Feedback = require('../models/Feedback');
const Settings = require('../models/Settings');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      appointmentsToday,
      doctorsAvailable,
      newPatients,
      reportsGenerated,
      totalUsers,
      totalAppointments
    ] = await Promise.all([
      // Appointments today
      Appointment.countDocuments({
        date: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lt: new Date().setHours(23, 59, 59, 999)
        }
      }),
      
      // Doctors available
      Doctor.countDocuments(),
      
      // New patients this month
      Patient.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }),
      
      // Reports generated (placeholder - would need Report model)
      0, // Replace with actual report count when Report model is implemented
      
      // Total users
      User.countDocuments(),
      
      // Total appointments
      Appointment.countDocuments()
    ]);

    res.json({
      appointmentsToday,
      doctorsAvailable,
      newPatients,
      reportsGenerated,
      totalUsers,
      totalAppointments
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};

// Extended admin dashboard data
exports.getDashboardExtended = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysBack = 12;
    const startTrend = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (daysBack - 1));

    const [
      appointmentsToday,
      doctorsAvailable,
      newPatients,
      totalUsers,
      totalAppointments,
      billingToday,
      activityLogs,
      incidents,
      tasks,
      reports,
      notifications,
      feedback,
      patients,
      users,
      settings,
      appointmentsRecent,
      billingsRecent
    ] = await Promise.all([
      Appointment.countDocuments({ date: { $gte: startOfDay } }),
      Doctor.countDocuments(),
      Patient.countDocuments({ createdAt: { $gte: startOfMonth } }),
      User.countDocuments(),
      Appointment.countDocuments(),
      Billing.aggregate([
        { $match: { createdAt: { $gte: startOfDay } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      ActivityLog.find().sort({ timestamp: -1 }).limit(20).populate('userId', 'name role'),
      Incident.find().sort({ createdAt: -1 }).limit(10),
      Task.find().sort({ createdAt: -1 }).limit(10),
      Report.find().sort({ createdAt: -1 }).limit(10),
      Notification.find().sort({ timestamp: -1 }).limit(10),
      Feedback.find({ rating: { $exists: true, $ne: null } }).sort({ createdAt: -1 }).limit(12).populate('userId', 'name'),
      Patient.find().populate('userId', 'name'),
      User.find().select('name role createdAt').limit(50),
      Settings.findOne(),
      Appointment.find({ date: { $gte: startTrend } }),
      Billing.find({ createdAt: { $gte: startTrend } })
    ]);

    const revenueToday = billingToday[0]?.total || 0;

    const trendMap = new Map();
    for (let i = 0; i < daysBack; i += 1) {
      const d = new Date(startTrend.getFullYear(), startTrend.getMonth(), startTrend.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      trendMap.set(key, { date: key, appointments: 0, revenue: 0, satisfaction: 0 });
    }

    appointmentsRecent.forEach((apt) => {
      const key = new Date(apt.date).toISOString().slice(0, 10);
      if (trendMap.has(key)) {
        trendMap.get(key).appointments += 1;
      }
    });

    billingsRecent.forEach((bill) => {
      const key = new Date(bill.createdAt).toISOString().slice(0, 10);
      if (trendMap.has(key)) {
        trendMap.get(key).revenue += bill.totalAmount || 0;
      }
    });

    const feedbackAvg = feedback.length
      ? Math.round((feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length) * 10) / 10
      : 0;

    const trend = Array.from(trendMap.values());

    const staff = users
      .filter(u => u.role && u.role !== 'patient')
      .map(u => ({
        id: u._id,
        name: u.name,
        role: u.role,
        onCall: false,
        lastActive: u.createdAt,
        performance: null,
        certifications: null
      }));

    const accessLogs = activityLogs.map(log => ({
      time: log.timestamp,
      user: log.userId?.name || 'Unknown',
      action: log.action,
      ip: log.ipAddress || '',
      device: log.metadata?.device || ''
    }));

    const vipPatients = patients.slice(0, 10).map(p => ({
      id: p._id,
      name: p.userId?.name || 'Unknown',
      vipStatus: 'Gold',
      lastVisit: p.updatedAt || p.createdAt,
      conciergeServices: [],
      satisfaction: feedbackAvg
    }));

    const socialReviews = feedback.map(f => ({
      id: f._id,
      platform: f.category || 'Hospital App',
      author: f.userId?.name || 'Anonymous',
      rating: f.rating || 0,
      text: f.description,
      timestamp: f.createdAt
    }));

    const integrations = settings?.integrations || {
      lab: { status: 'online', uptime: 99.9, lastSync: now },
      pharmacy: { status: 'online', uptime: 99.8, lastSync: now },
      insurance: { status: 'online', uptime: 98.5, lastSync: now },
      ambulance: { status: 'online', uptime: 99.7, fleetSize: 25, available: 20 },
      privateJets: { status: 'online', uptime: 100, fleetSize: 3, available: 2 },
      concierge: { status: 'online', uptime: 99.9, activeRequests: 5 }
    };

    const bedMap = Array.from({ length: 4 }).map((_, row) => (
      Array.from({ length: 6 }).map((__, col) => {
        const index = row * 6 + col;
        const patient = patients[index];
        return {
          ward: `W-${row + 1}${col + 1}`,
          occupied: Boolean(patient),
          patient: patient?.userId?.name || null
        };
      })
    ));

    res.json({
      kpis: {
        appointmentsToday,
        doctorsAvailable,
        openBeds: Math.max(0, 24 - patients.length),
        revenueToday,
        patientSatisfaction: feedbackAvg,
        averageWaitTime: null,
        emergencyResponseTime: null,
        vipPatients: vipPatients.length
      },
      trend,
      staff,
      incidents,
      tasks,
      notifications,
      accessLogs,
      vipPatients,
      socialReviews,
      integrations,
      aiInsights: [],
      blockchainLogs: accessLogs.slice(0, 8),
      bedMap,
      auditLogs: accessLogs.slice(0, 8),
      reports
    });
  } catch (error) {
    console.error('Dashboard extended error:', error);
    res.status(500).json({ error: 'Failed to fetch extended dashboard data' });
  }
};

// Get all users with pagination
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments();

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    console.log('Updating user with ID:', req.params.id);
    console.log('Update user request body:', req.body);
    const { name, email, role } = req.body;
    
    // Check if user exists first
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      console.log('User not found for ID:', req.params.id);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('User found:', existingUser);
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      console.log('Failed to update user - no user returned from update');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User updated successfully:', updatedUser);

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update user error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Get system notifications
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ userId })
      .sort({ timestamp: -1 })
      .limit(50)
      .populate('resourceId', 'name email') // Populate related resource data if needed
      .lean();

    // Transform notifications to match expected format
    const transformedNotifications = notifications.map(notification => ({
      id: notification._id,
      title: notification.title,
      message: notification.description,
      type: notification.type,
      severity: notification.severity,
      read: notification.read,
      createdAt: notification.timestamp,
      metadata: notification.metadata
    }));

    res.json(transformedNotifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Get revenue analytics
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const bills = await Billing.find({
      createdAt: { $gte: start, $lte: end },
      status: 'paid'
    });

    const totalRevenue = bills.reduce((sum, bill) => sum + bill.amount, 0);
    const totalBills = bills.length;
    const averageBillAmount = totalBills > 0 ? totalRevenue / totalBills : 0;

    res.json({
      totalRevenue,
      totalBills,
      averageBillAmount: parseFloat(averageBillAmount.toFixed(2)),
      bills
    });
  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch revenue analytics' });
  }
};

// ==================== INCIDENT MANAGEMENT ====================

// Get all incidents
exports.getIncidents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.severity) filter.severity = req.query.severity;
    if (req.query.type) filter.type = req.query.type;

    const incidents = await Incident.find(filter)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalIncidents = await Incident.countDocuments(filter);

    res.json({
      incidents,
      currentPage: page,
      totalPages: Math.ceil(totalIncidents / limit),
      totalIncidents
    });
  } catch (error) {
    console.error('Get incidents error:', error);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
};

// Get incident by ID
exports.getIncidentById = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('resolvedBy', 'name email');

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    res.json(incident);
  } catch (error) {
    console.error('Get incident error:', error);
    res.status(500).json({ error: 'Failed to fetch incident' });
  }
};

// Create incident
exports.createIncident = async (req, res) => {
  try {
    const { type, severity, title, description, location, category, tags } = req.body;

    const incident = new Incident({
      type,
      severity,
      title,
      description,
      location,
      category,
      tags,
      reportedBy: req.user._id
    });

    await incident.save();

    // Populate the created incident
    await incident.populate('reportedBy', 'name email');

    res.status(201).json({
      message: 'Incident created successfully',
      incident
    });
  } catch (error) {
    console.error('Create incident error:', error);
    res.status(500).json({ error: 'Failed to create incident' });
  }
};

// Update incident
exports.updateIncident = async (req, res) => {
  try {
    const { status, assignedTo, resolution, category, tags } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (resolution) {
      updateData.resolution = resolution;
      updateData.resolvedAt = new Date();
      updateData.resolvedBy = req.user._id;
    }
    if (category) updateData.category = category;
    if (tags) updateData.tags = tags;

    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('reportedBy', 'name email')
    .populate('assignedTo', 'name email')
    .populate('resolvedBy', 'name email');

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    res.json({
      message: 'Incident updated successfully',
      incident
    });
  } catch (error) {
    console.error('Update incident error:', error);
    res.status(500).json({ error: 'Failed to update incident' });
  }
};

// Delete incident
exports.deleteIncident = async (req, res) => {
  try {
    const incident = await Incident.findByIdAndDelete(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    res.json({ message: 'Incident deleted successfully' });
  } catch (error) {
    console.error('Delete incident error:', error);
    res.status(500).json({ error: 'Failed to delete incident' });
  }
};

// ==================== TASK MANAGEMENT ====================

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('completedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTasks = await Task.countDocuments(filter);

    res.json({
      tasks,
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
      totalTasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('completedBy', 'name email')
      .populate('comments.author', 'name email');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

// Create task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, category, assignedTo, dueDate, department, tags } = req.body;

    const task = new Task({
      title,
      description,
      priority,
      category,
      assignedTo,
      dueDate,
      department,
      tags,
      createdBy: req.user._id
    });

    await task.save();

    // Populate the created task
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, assignedTo, dueDate, department, tags } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status) {
      updateData.status = status;
      if (status === 'completed') {
        updateData.completedAt = new Date();
        updateData.completedBy = req.user._id;
      }
    }
    if (priority) updateData.priority = priority;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (dueDate) updateData.dueDate = dueDate;
    if (department) updateData.department = department;
    if (tags) updateData.tags = tags;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('completedBy', 'name email');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

// Add comment to task
exports.addTaskComment = async (req, res) => {
  try {
    const { text } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.comments.push({
      text,
      author: req.user._id,
      createdAt: new Date()
    });

    await task.save();
    await task.populate('comments.author', 'name email');

    res.json({
      message: 'Comment added successfully',
      task
    });
  } catch (error) {
    console.error('Add task comment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// ==================== REPORT MANAGEMENT ====================

// Get all reports
exports.getReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;
    filter.generatedBy = req.user._id; // Users can only see their own reports

    const reports = await Report.find(filter)
      .populate('generatedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReports = await Report.countDocuments(filter);

    res.json({
      reports,
      currentPage: page,
      totalPages: Math.ceil(totalReports / limit),
      totalReports
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

// Generate report
exports.generateReport = async (req, res) => {
  try {
    const { type, format, parameters } = req.body;

    // Create report record
    const report = new Report({
      type,
      format,
      parameters,
      generatedBy: req.user._id,
      status: 'processing'
    });

    await report.save();

    // Start report generation in background (simplified version)
    // In production, this would be handled by a job queue
    setTimeout(async () => {
      try {
        const reportData = await generateReportData(type, parameters);
        const csvContent = convertToCSV(reportData);
        const fileName = `report_${type}_${Date.now()}.csv`;
        const fileUrl = `/uploads/reports/${fileName}`;

        // In production, save file to storage and update report
        await report.complete(fileUrl, csvContent.length);

        console.log(`Report ${report._id} generated successfully`);
      } catch (error) {
        console.error(`Report generation failed for ${report._id}:`, error);
        await report.fail(error.message);
      }
    }, 1000);

    res.status(201).json({
      message: 'Report generation started',
      report
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ error: 'Failed to start report generation' });
  }
};

// Download report
exports.downloadReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    if (report.generatedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (report.status !== 'completed') {
      return res.status(400).json({ error: 'Report is not ready for download' });
    }

    // Increment download count
    await report.incrementDownload();

    // In production, stream file from storage
    // For now, return the report data
    const reportData = await generateReportData(report.type, report.parameters);
    const csvContent = convertToCSV(reportData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${report.type}_report.csv"`);
    res.send(csvContent);
  } catch (error) {
    console.error('Download report error:', error);
    res.status(500).json({ error: 'Failed to download report' });
  }
};

// ==================== HELPER FUNCTIONS ====================

// Generate report data based on type
async function generateReportData(type, parameters = {}) {
  switch (type) {
    case 'dashboard':
      const stats = await getDashboardStatsForReport();
      return [
        ['Metric', 'Value'],
        ['Appointments Today', stats.appointmentsToday],
        ['Doctors Available', stats.doctorsAvailable],
        ['New Patients', stats.newPatients],
        ['Total Users', stats.totalUsers],
        ['Total Appointments', stats.totalAppointments]
      ];

    case 'appointments':
      const appointments = await Appointment.find()
        .populate('patientId', 'name')
        .populate('doctorId', 'name')
        .limit(1000);
      return [
        ['Date', 'Patient', 'Doctor', 'Status', 'Type'],
        ...appointments.map(apt => [
          apt.date.toISOString().split('T')[0],
          apt.patientId?.name || 'Unknown',
          apt.doctorId?.name || 'Unknown',
          apt.status,
          apt.type
        ])
      ];

    case 'revenue':
      const bills = await Billing.find({ status: 'paid' })
        .populate('patientId', 'name')
        .limit(1000);
      return [
        ['Date', 'Patient', 'Amount', 'Status'],
        ...bills.map(bill => [
          bill.createdAt.toISOString().split('T')[0],
          bill.patientId?.name || 'Unknown',
          bill.amount,
          bill.status
        ])
      ];

    case 'patients':
      const patients = await Patient.find().limit(1000);
      return [
        ['Name', 'Email', 'Phone', 'Date of Birth', 'Created'],
        ...patients.map(patient => [
          patient.name,
          patient.email,
          patient.phone,
          patient.dateOfBirth?.toISOString().split('T')[0] || '',
          patient.createdAt.toISOString().split('T')[0]
        ])
      ];

    default:
      return [['Error', 'Unknown report type']];
  }
}

// Get dashboard stats for reports
async function getDashboardStatsForReport() {
  const [
    appointmentsToday,
    doctorsAvailable,
    newPatients,
    totalUsers,
    totalAppointments
  ] = await Promise.all([
    Appointment.countDocuments({
      date: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999)
      }
    }),
    Doctor.countDocuments({ onLeave: false }),
    Patient.countDocuments({
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    }),
    User.countDocuments(),
    Appointment.countDocuments()
  ]);

  return {
    appointmentsToday,
    doctorsAvailable,
    newPatients,
    totalUsers,
    totalAppointments
  };
}

// Convert array data to CSV string
function convertToCSV(data) {
  return data.map(row =>
    row.map(field => `"${field}"`).join(',')
  ).join('\n');
}
