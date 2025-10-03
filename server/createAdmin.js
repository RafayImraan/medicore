const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function createAdmin() {
  try {
    await mongoose.connect('mongodb://localhost:27017/healthcare_db');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    });

    const savedAdmin = await adminUser.save();
    console.log('Admin user created successfully:');
    console.log('Email: admin@example.com');
    console.log('Password: password123');
    console.log('Role: admin');
    console.log('ID:', savedAdmin._id);

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdmin();
