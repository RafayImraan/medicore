const express = require('express');
const Appointment = require('../models/Appointment');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { date, status, limit = 200 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status.toLowerCase();
    }

    if (date) {
      const start = new Date(date);
      if (!Number.isNaN(start.getTime())) {
        const end = new Date(start);
        end.setDate(start.getDate() + 1);
        query.appointmentDate = { $gte: start, $lt: end };
      }
    }

    const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 200, 1), 500);
    const appointments = await Appointment.find(query)
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .limit(limitNumber);

    const items = appointments.map((appt) => ({
      id: appt._id,
      patient: appt.patient?.name || 'Patient',
      doctor: appt.doctor?.name || 'Doctor',
      test: appt.type || 'Consultation',
      status: appt.status ? appt.status.charAt(0).toUpperCase() + appt.status.slice(1) : 'Pending',
      priority: appt.priority || 'Medium',
      recurring: Boolean(appt.recurring),
      time: appt.appointmentTime || '',
      date: appt.appointmentDate || appt.slot || appt.createdAt,
      videoLink: appt.videoLink || ''
    }));

    res.json({ items });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ error: 'Failed to load schedule' });
  }
});

module.exports = router;
