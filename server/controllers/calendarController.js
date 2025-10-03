const CalendarEvent = require('../models/CalendarEvent');
const User = require('../models/User');

// Create calendar event
exports.createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    eventData.createdBy = req.user._id;

    const event = new CalendarEvent(eventData);
    await event.save();

    res.status(201).json({
      message: 'Calendar event created successfully',
      event
    });
  } catch (error) {
    console.error('Create calendar event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get events for a user
exports.getUserEvents = async (req, res) => {
  try {
    const { userId } = req.params;
    const { start, end } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const query = {
      $or: [
        { createdBy: userId },
        { assignedTo: userId }
      ]
    };

    if (start && end) {
      query.startTime = { $gte: new Date(start) };
      query.endTime = { $lte: new Date(end) };
    }

    const events = await CalendarEvent.find(query).sort({ startTime: 1 });

    res.json({ events });
  } catch (error) {
    console.error('Get user events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update calendar event
exports.updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const updates = req.body;

    const event = await CalendarEvent.findByIdAndUpdate(eventId, updates, { new: true });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      message: 'Calendar event updated successfully',
      event
    });
  } catch (error) {
    console.error('Update calendar event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete calendar event
exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await CalendarEvent.findByIdAndDelete(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Calendar event deleted successfully' });
  } catch (error) {
    console.error('Delete calendar event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
