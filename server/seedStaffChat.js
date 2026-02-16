const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const StaffMessage = require('./models/StaffMessage');

const reset = process.argv.includes('--reset');

const departments = ['Radiology', 'Emergency', 'ICU', 'Admin', 'Pharmacy', 'Cardiology', 'Pediatrics'];
const roles = ['Doctor', 'Nurse', 'Lab Tech', 'Receptionist', 'Admin', 'Pharmacist'];
const messageTemplates = [
  'Please check the patient in room 302.',
  'Shift handover at 8 PM sharp.',
  'Medication delivery delayed 15 minutes.',
  'Urgent lab result needs review.',
  'Can someone confirm tomorrow\\'s rota?',
  'Patient needs wheelchair assistance.',
  'Emergency code red - all available staff to ER.',
  'MRI room maintenance scheduled at 3 PM.',
  'Prescriptions ready for pickup.',
  'Audit trail update complete. Review logs.',
  'Lunch break delayed. Cafeteria closed until 2.',
  'Has anyone seen the portable ECG unit?',
  'Patient requested a discharge summary.',
  'Lab samples must reach before 1 PM.',
  'Can you update the records in EMR?',
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
    await StaffMessage.deleteMany({});
  }

  const messages = Array.from({ length: 40 }).map(() => ({
    senderName: faker.person.fullName(),
    role: faker.helpers.arrayElement(roles),
    department: faker.helpers.arrayElement(departments),
    message: faker.helpers.arrayElement(messageTemplates),
    status: faker.helpers.arrayElement(['Sent', 'Delivered', 'Seen']),
    createdAt: faker.date.recent({ days: 3 })
  }));

  await StaffMessage.insertMany(messages);
};

connect()
  .then(seed)
  .then(() => {
    console.log('OK: Staff chat seed completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('ERROR: Staff chat seed failed:', error);
    process.exit(1);
  });
