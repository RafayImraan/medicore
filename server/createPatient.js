const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Patient = require('./models/Patient');

async function createPatientUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/healthcare_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if patient user already exists
    const existingPatient = await User.findOne({ email: 'patient@example.com' });
    if (existingPatient) {
      console.log('Patient user already exists:', existingPatient.email);
      return;
    }

    // Create patient user
    const hashedPassword = await bcrypt.hash('patient123', 10);
    const patientUser = new User({
      name: 'John Doe',
      email: 'patient@example.com',
      password: hashedPassword,
      role: 'patient',
    });

    const savedUser = await patientUser.save();
    console.log('Patient user created successfully:');
    console.log('Email: patient@example.com');
    console.log('Password: patient123');
    console.log('Role: patient');

    // Create corresponding patient profile
    const patientProfile = new Patient({
      userId: savedUser._id,
      dateOfBirth: new Date('1990-01-01'),
      gender: 'Male',
      bloodGroup: 'O+',
      phone: '+1234567890',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345'
      },
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1234567891'
      },
      medicalHistory: [
        {
          condition: 'Hypertension',
          diagnosisDate: new Date('2020-01-01'),
          status: 'Active'
        }
      ],
      allergies: ['Penicillin'],
      insurance: {
        provider: 'Health Insurance Co',
        policyNumber: 'POL123456',
        groupNumber: 'GRP789'
      }
    });

    await patientProfile.save();
    console.log('Patient profile created successfully');

  } catch (error) {
    console.error('Error creating patient user:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

createPatientUser();
