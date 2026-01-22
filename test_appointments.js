const mongoose = require('./server/models/Appointment');

async function test() {
  try {
    await mongoose.connect('mongodb://localhost:27017/healthcare_db');
    const count = await mongoose.countDocuments();
    console.log('Current appointments in database:', count);

    const recent = await mongoose.find().sort({ createdAt: -1 }).limit(3);
    console.log('Recent appointments:', recent.map(a => ({
      id: a._id,
      patient: a.patient.name,
      doctor: a.doctor.name,
      date: a.appointmentDate,
      time: a.appointmentTime
    })));

    await mongoose.disconnect();
  } catch (err) {
    console.error('Database test error:', err.message);
  }
}

test();
