const mongoose = require('mongoose');
const Patient = require('./models/Patient');
const User = require('./models/User');

async function createPatientDirect2() {
  try {
    await mongoose.connect('mongodb://localhost:27017/healthcare_db');
    console.log('Connected to MongoDB');

    // Find the test user
    const user = await User.findOne({ email: 'testpatient2@example.com' });
    if (!user) {
      console.log('Test user not found');
      return;
    }

    console.log('Found user:', user._id);

    // Check if patient already exists
    const existingPatient = await Patient.findOne({ userId: user._id });
    if (existingPatient) {
      console.log('Patient already exists');
      return;
    }

    // Create patient
    const patient = new Patient({
      userId: user._id,
      dateOfBirth: new Date('1990-01-01'),
      gender: 'Male',
      phone: '1234567890'
    });

    const savedPatient = await patient.save();
    console.log('Patient created successfully:', savedPatient);

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error creating patient:', error);
    console.error('Error stack:', error.stack);
  }
}

createPatientDirect2();
