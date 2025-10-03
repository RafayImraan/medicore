const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function createTestUser() {
  try {
    await mongoose.connect('mongodb://localhost:27017/healthcare_db');
    console.log('Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'testpatient@example.com' });
    if (existingUser) {
      console.log('Test user already exists:', existingUser.email);
      return;
    }

    // Create test patient user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUser = new User({
      name: 'Test Patient',
      email: 'testpatient@example.com',
      password: hashedPassword,
      role: 'patient',
    });

    const savedUser = await testUser.save();
    console.log('Test patient user created successfully:');
    console.log('Email: testpatient@example.com');
    console.log('Password: password123');
    console.log('Role: patient');
    console.log('ID:', savedUser._id);

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

createTestUser();
