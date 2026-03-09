const mongoose = require('mongoose');
const EmergencyHospital = require('./models/EmergencyHospital');
const EmergencyIncident = require('./models/EmergencyIncident');
const EmergencyMetric = require('./models/EmergencyMetric');
const EmergencyChecklist = require('./models/EmergencyChecklist');

const reset = process.argv.includes('--reset');

const HOSPITALS = [
  { name: 'Medicore Central Emergency', distanceKm: 2.4, etaMin: 7, bedsAvailable: 6, icuAvailable: true },
  { name: 'Medicore Trauma and Surgical Unit', distanceKm: 4.1, etaMin: 11, bedsAvailable: 3, icuAvailable: true },
  { name: 'Medicore North Critical Care', distanceKm: 6.8, etaMin: 16, bedsAvailable: 2, icuAvailable: false },
  { name: 'Medicore Rapid Access Clinic', distanceKm: 8.2, etaMin: 18, bedsAvailable: 5, icuAvailable: false }
];

const INCIDENTS = [
  { text: 'Road traffic trauma case routed to Medicore Central Emergency with orthopedic standby.', level: 'critical', occurredAt: new Date(Date.now() - 8 * 60 * 1000) },
  { text: 'Chest pain escalation received from home healthcare line, ambulance dispatched.', level: 'urgent', occurredAt: new Date(Date.now() - 16 * 60 * 1000) },
  { text: 'Pediatric fever and seizure alert received, neurology support notified.', level: 'urgent', occurredAt: new Date(Date.now() - 24 * 60 * 1000) },
  { text: 'Trauma bay cleared and prepared for incoming industrial injury case.', level: 'info', occurredAt: new Date(Date.now() - 31 * 60 * 1000) },
  { text: 'ICU bed reassigned after post-surgical deterioration alert.', level: 'critical', occurredAt: new Date(Date.now() - 44 * 60 * 1000) },
  { text: 'Burn unit received transfer request from regional clinic.', level: 'urgent', occurredAt: new Date(Date.now() - 58 * 60 * 1000) }
];

const METRIC = {
  erQueueWaiting: 14,
  erWaitMins: 12,
  erBeds: 9,
  icuBeds: 4,
  ventilators: 11,
  isolation: 3,
  workloadTrend: [
    { period: 'Now', visits: 22 },
    { period: '+1h', visits: 18 },
    { period: '+2h', visits: 20 },
    { period: '+3h', visits: 24 },
    { period: '+4h', visits: 19 },
    { period: '+5h', visits: 16 },
    { period: '+6h', visits: 14 }
  ]
};

const CHECKLISTS = [
  {
    language: 'en',
    items: [
      'Call emergency services immediately for chest pain, collapse, or severe bleeding.',
      'Bring current medications, allergies, and known conditions if available.',
      'Do not give food or drink before trauma or emergency surgery review.',
      'Keep one family contact available for hospital coordination updates.',
      'Carry previous test reports if transfer is coming from another facility.'
    ]
  },
  {
    language: 'ur',
    items: [
      'Severe bleeding, chest pain, ya behoshi ki surat mein foran emergency call karein.',
      'Agar mumkin ho to dawaiyon aur allergies ki maloomat saath laayein.',
      'Emergency review se pehle patient ko khana ya pani na dein.',
      'Hospital coordination ke liye aik family contact available rakhein.'
    ]
  }
];

const connect = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_db';
  await mongoose.connect(uri);
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

  await Promise.all([
    EmergencyHospital.insertMany(HOSPITALS),
    EmergencyIncident.insertMany(INCIDENTS),
    EmergencyMetric.create(METRIC),
    EmergencyChecklist.insertMany(CHECKLISTS)
  ]);
};

const run = async () => {
  await connect();
  await seed();
  await mongoose.disconnect();
  console.log('OK: Emergency data seed completed');
};

if (require.main === module) {
  run().catch(async (error) => {
    console.error('ERROR: Emergency data seed failed:', error);
    try {
      await mongoose.disconnect();
    } catch {}
    process.exit(1);
  });
}

module.exports = { connect, seed, run };
