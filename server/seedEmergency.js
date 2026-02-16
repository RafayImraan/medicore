const mongoose = require('mongoose');
const EmergencyHospital = require('./models/EmergencyHospital');
const EmergencyIncident = require('./models/EmergencyIncident');
const EmergencyMetric = require('./models/EmergencyMetric');
const EmergencyChecklist = require('./models/EmergencyChecklist');

const reset = process.argv.includes('--reset');

const HOSPITALS = [
  { name: 'City Central Hospital', distanceKm: 2.1, etaMin: 8, bedsAvailable: 6, icuAvailable: true },
  { name: 'Riverside Medical', distanceKm: 4.5, etaMin: 12, bedsAvailable: 3, icuAvailable: true },
  { name: 'Northbridge Clinic', distanceKm: 6.2, etaMin: 18, bedsAvailable: 1, icuAvailable: false },
  { name: 'Westside Trauma Center', distanceKm: 9.8, etaMin: 24, bedsAvailable: 0, icuAvailable: true }
];

const INCIDENTS = [
  { text: 'Multi-vehicle collision, North Bridge - 8 patients', level: 'critical' },
  { text: 'Firework burn injuries, Central Market - 3 patients', level: 'urgent' },
  { text: 'Heat exhaustion reported near Stadium Road', level: 'info' }
];

const METRIC = {
  erQueueWaiting: 12,
  erWaitMins: 18,
  erBeds: 9,
  icuBeds: 3,
  ventilators: 6,
  isolation: 4,
  workloadTrend: Array.from({ length: 12 }).map((_, i) => ({
    period: `H${i + 1}`,
    visits: Math.max(5, 38 - i * 2)
  }))
};

const CHECKLISTS = [
  {
    language: 'en',
    items: [
      'Call emergency number immediately',
      'If safe, move victim to a safe area',
      'Provide basic first aid (control bleeding, CPR if needed)',
      'Keep patient warm and monitor breathing',
      'Bring ID and medication list to hospital'
    ]
  },
  {
    language: 'ur',
    items: [
      'فوری طور پر ایمبولینس کو کال کریں',
      'اگر محفوظ ہو تو مریض کو محفوظ جگہ پر منتقل کریں',
      'بنیادی فرسٹ ایڈ فراہم کریں',
      'مریض کو گرم رکھیں اور سانس کی نگرانی کریں',
      'شناختی دستاویزات اور ادویات کی فہرست ساتھ رکھیں'
    ]
  }
];

const connect = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_db';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};

const seed = async () => {
  if (reset) {
    await Promise.all([
      EmergencyHospital.deleteMany({}),
      EmergencyIncident.deleteMany({}),
      EmergencyMetric.deleteMany({}),
      EmergencyChecklist.deleteMany({})
    ]);
  }

  if ((await EmergencyHospital.countDocuments()) === 0) await EmergencyHospital.insertMany(HOSPITALS);
  if ((await EmergencyIncident.countDocuments()) === 0) await EmergencyIncident.insertMany(INCIDENTS);
  if ((await EmergencyMetric.countDocuments()) === 0) await EmergencyMetric.create(METRIC);
  if ((await EmergencyChecklist.countDocuments()) === 0) await EmergencyChecklist.insertMany(CHECKLISTS);
};

connect()
  .then(seed)
  .then(() => {
    console.log('OK: Emergency seed completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('ERROR: Emergency seed failed:', error);
    process.exit(1);
  });
