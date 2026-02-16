const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ActivityLog = require('./models/ActivityLog');

dotenv.config();

const shouldReset = process.argv.includes('--reset');

const sampleActivities = [
  {
    action: 'page_view',
    resource: 'navigation',
    description: 'Viewed home page',
    details: { page: 'home' },
    severity: 'low',
    status: 'success'
  },
  {
    action: 'ui_click',
    resource: 'ui',
    description: 'Clicked Book Appointment',
    details: { label: 'Book Appointment', section: 'hero' },
    severity: 'low',
    status: 'success'
  },
  {
    action: 'search',
    resource: 'search',
    description: 'Searched for doctor',
    details: { query: 'Cardiology' },
    severity: 'low',
    status: 'success'
  },
  {
    action: 'navigation',
    resource: 'navigation',
    description: 'Opened Emergency page',
    details: { route: '/emergency' },
    severity: 'low',
    status: 'success'
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    if (shouldReset) {
      await ActivityLog.deleteMany({});
      console.log('Activity logs cleared.');
    }

    await ActivityLog.create(sampleActivities);
    console.log('Activity logs seeded.');
  } catch (error) {
    console.error('Activity seed failed:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
