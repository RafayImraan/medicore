const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');

const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const LabResult = require('./models/LabResult');

dotenv.config();

const TESTS = [
  'Complete Blood Count',
  'Lipid Panel',
  'Metabolic Panel',
  'Thyroid Panel',
  'HbA1c',
  'Urine Analysis',
  'Chest X-Ray',
  'MRI Brain',
  'CT Abdomen',
  'Vitamin D'
];

const DEPARTMENTS = ['Hematology', 'Radiology', 'Pathology', 'Cardiology', 'Oncology'];
const LANGUAGES = ['English', 'Urdu', 'Arabic'];
const SEVERITIES = ['Low', 'Moderate', 'High'];
const ANATOMY = ['Chest', 'Abdomen', 'Brain', 'Limbs', 'Heart'];
const STATUSES = ['Pending', 'Ready', 'Reviewed'];

const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const buildReferenceRange = (testName) => {
  if (testName === 'HbA1c') return '4.0 - 5.6 %';
  if (testName === 'Lipid Panel') return 'Total Cholesterol 125 - 200 mg/dL';
  if (testName === 'Complete Blood Count') return 'WBC 4.0 - 11.0 x10^9/L';
  return '70 - 120 mg/dL';
};

const connect = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_db';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};

const seed = async () => {
  const shouldReset = process.argv.includes('--reset');

  if (shouldReset) {
    await LabResult.deleteMany({});
    console.log('Cleared existing lab results');
  }

  const patients = await Patient.find().populate('userId', 'name');
  if (!patients.length) {
    console.log('No patients found. Seed patients first, then re-run this script.');
    return;
  }

  const doctors = await Doctor.find().populate('userId', 'name');
  const doctorNames = doctors
    .map(d => d.userId?.name)
    .filter(Boolean);

  const labResults = [];

  for (const patient of patients) {
    const count = faker.number.int({ min: 2, max: 6 });
    for (let i = 0; i < count; i += 1) {
      const testName = randomPick(TESTS);
      const date = faker.date.recent({ days: 30 });

      labResults.push({
        patientId: patient._id,
        patientName: patient.userId?.name || 'Unknown',
        testName,
        doctorName: doctorNames.length ? randomPick(doctorNames) : faker.person.fullName(),
        technicianName: faker.person.fullName(),
        severity: randomPick(SEVERITIES),
        recurring: faker.datatype.boolean(),
        flaggedForFollowUp: faker.datatype.boolean(),
        referenceRange: buildReferenceRange(testName),
        anatomyRegion: randomPick(ANATOMY),
        notes: faker.lorem.sentence(),
        version: faker.string.alphanumeric({ length: 6 }).toUpperCase(),
        department: randomPick(DEPARTMENTS),
        language: randomPick(LANGUAGES),
        date,
        result: faker.helpers.arrayElement(['Normal', 'Abnormal', 'Borderline']),
        status: randomPick(STATUSES),
        createdAt: date,
        updatedAt: date
      });
    }
  }

  if (!labResults.length) {
    console.log('No lab results to insert.');
    return;
  }

  await LabResult.insertMany(labResults);
  console.log(`Inserted ${labResults.length} lab results.`);
};

connect()
  .then(seed)
  .catch((error) => {
    console.error('Lab results seed failed:', error);
  })
  .finally(() => {
    mongoose.disconnect();
  });
