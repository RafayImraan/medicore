 const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

async function debugLogin() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/khaan');
    console.log('Connected to MongoDB');

    // Test finding a user
    const user = await User.findOne({ email: 'admin@example.com' });
    console.log('Found user:', user);

    if (user) {
      // Test password comparison
      const isMatch = await bcrypt.compare('admin123', user.password);
      console.log('Password match:', isMatch);
      
      if (isMatch) {
        console.log('Login should work!');
      } else {
        console.log('Password does not match');
      }
    } else {
      console.log('User not found');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Debug error:', error);
  }
}

debugLogin();
