const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

async function checkAndCreateDoctor() {
  try {
    await mongoose.connect('mongodb://localhost:27017/healthcare_db');
    const user = await User.findOne({ email: 'doctor@example.com' });
    if (!user) {
      console.log('User not found');
      return;
    }
    console.log('User ID:', user._id);
    const doctor = await Doctor.findOne({ userId: user._id });
    if (doctor) {
      console.log('Doctor profile exists');
    } else {
      const newDoctor = new Doctor({
        userId: user._id,
        specialization: 'General Medicine',
        licenseNumber: 'DOC123456',
        experience: 10,
        qualifications: ['MBBS', 'MD'],
        availability: {
          monday: { start: '09:00', end: '17:00' },
          tuesday: { start: '09:00', end: '17:00' },
          wednesday: { start: '09:00', end: '17:00' },
          thursday: { start: '09:00', end: '17:00' },
          friday: { start: '09:00', end: '17:00' },
        },
        consultationFee: 100,
      });
      await newDoctor.save();
      console.log('Doctor profile created');
    }
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.connection.close();
  }
}
checkAndCreateDoctor();
