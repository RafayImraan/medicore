const mongoose = require('mongoose');
const Agent = require('./models/Agent');

const reset = process.argv.includes('--reset');

const AGENTS = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@medicore.org',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    available: true,
    specialization: 'General',
    languages: ['English', 'Urdu'],
    experience: 6,
    rating: 4.8,
    totalChats: 120,
    activeChats: 2
  },
  {
    name: 'Ahmed Khan',
    email: 'ahmed.khan@medicore.org',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
    available: true,
    specialization: 'Technical',
    languages: ['English', 'Urdu', 'Sindhi'],
    experience: 4,
    rating: 4.6,
    totalChats: 98,
    activeChats: 1
  },
  {
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@medicore.org',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    available: false,
    specialization: 'Billing',
    languages: ['English', 'Spanish'],
    experience: 7,
    rating: 4.9,
    totalChats: 140,
    activeChats: 0
  }
];

const connect = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_db';
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const seed = async () => {
  if (reset) {
    await Agent.deleteMany({});
  }

  const existing = await Agent.countDocuments();
  if (existing === 0) {
    await Agent.insertMany(AGENTS);
  }
};

connect()
  .then(seed)
  .then(() => {
    console.log('OK: Agents seed completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('ERROR: Agents seed failed:', error);
    process.exit(1);
  });
