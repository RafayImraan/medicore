const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');

const User = require('./models/User');
const Feedback = require('./models/Feedback');

dotenv.config();

const connect = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_db';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};

const seed = async () => {
  const shouldReset = process.argv.includes('--reset');
  if (shouldReset) {
    await Feedback.deleteMany({});
    console.log('Cleared existing feedback');
  }

  const users = await User.find();
  if (!users.length) {
    console.log('No users found. Seed users first, then re-run this script.');
    return;
  }

  const categories = ['ui/ux', 'functionality', 'performance', 'security', 'billing', 'appointments', 'telehealth', 'other'];
  const types = ['general_feedback', 'praise', 'complaint', 'feature_request', 'bug_report'];

  const feedbackDocs = [];
  for (let i = 0; i < 30; i += 1) {
    const user = users[i % users.length];
    feedbackDocs.push({
      userId: user._id,
      type: types[i % types.length],
      category: categories[i % categories.length],
      title: faker.lorem.words(3),
      description: faker.lorem.sentences(2),
      priority: 'medium',
      status: 'open',
      rating: faker.number.int({ min: 3, max: 5 })
    });
  }

  await Feedback.insertMany(feedbackDocs);
  console.log(`Inserted ${feedbackDocs.length} feedback items.`);
};

connect()
  .then(seed)
  .catch((error) => {
    console.error('Feedback seed failed:', error);
  })
  .finally(() => {
    mongoose.disconnect();
  });
