const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

async function createDoctorUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/healthcare_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if doctor user already exists
    const existingDoctor = await User.findOne({ email: 'doctor@example.com' });
    if (existingDoctor) {
      console.log('Doctor user already exists:', existingDoctor.email);
      return;
    }

    // Create doctor user
    const hashedPassword = await bcrypt.hash('doctor123', 10);
    const doctorUser = new User({
      name: 'Dr. John Smith',
      email: 'doctor@example.com',
      password: hashedPassword,
      role: 'doctor',
    });

    const savedUser = await doctorUser.save();
    console.log('Doctor user created successfully:');
    console.log('Email: doctor@example.com');
    console.log('Password: doctor123');
    console.log('Role: doctor');

    // Create corresponding doctor profile
    const doctorProfile = new Doctor({
      userId: savedUser._id,
      specialization: 'General Medicine',
      licenseNumber: 'DOC123456',
      experience: 10,
      education: [{ degree: 'MBBS', institution: 'Medical College', year: 2010 }],
      hospital: { name: 'City Hospital', address: '123 Main St' },
      availability: [{
        day: 'Monday',
        startTime: '09:00',
        endTime: '17:00',
        maxPatients: 20
      }],
      consultationFee: 100,
      featured: true,
    });

    await doctorProfile.save();
    console.log('Doctor profile created successfully');

  } catch (error) {
    console.error('Error creating doctor user:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

createDoctorUser();
