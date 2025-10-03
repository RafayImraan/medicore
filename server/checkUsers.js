const mongoose = require('mongoose');
const User = require('./models/User');
const Patient = require('./models/Patient');

async function checkUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/healthcare_db');
    console.log('Connected to MongoDB');

    const users = await User.find({}, 'name email role');
    console.log('All users:');
    for (const user of users) {
      const patient = await Patient.findOne({ userId: user._id });
      console.log(`  ${user.email} (${user.role}) - Patient profile: ${patient ? 'YES' : 'NO'}`);
    }

    console.log('\nUsers without patient profiles:');
    for (const user of users) {
      const patient = await Patient.findOne({ userId: user._id });
      if (!patient && user.role === 'patient') {
        console.log(`  ${user.email}`);
      }
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUsers();
