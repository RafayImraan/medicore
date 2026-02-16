const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');

const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const User = require('./models/User');
const Vitals = require('./models/Vitals');

dotenv.config();

const connect = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_db';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};

const seed = async () => {
  const shouldReset = process.argv.includes('--reset');
  if (shouldReset) {
    await Vitals.deleteMany({});
    console.log('Cleared existing vitals');
  }

  const patients = await Patient.find();
  const doctors = await Doctor.find();
  const users = await User.find();
  if (!patients.length) {
    console.log('No patients found. Seed patients first, then re-run this script.');
    return;
  }
  if (!doctors.length || !users.length) {
    console.log('No doctors/users found. Seed doctors/users first, then re-run this script.');
    return;
  }

  const vitalsDocs = [];
  const now = new Date();

  for (const patient of patients) {
    const count = faker.number.int({ min: 5, max: 12 });
    for (let i = 0; i < count; i += 1) {
      const ts = new Date(now.getTime() - i * 6 * 60 * 60 * 1000);
      const systolic = faker.number.int({ min: 100, max: 150 });
      const diastolic = faker.number.int({ min: 60, max: 95 });
      const doctor = doctors[(i + patient._id.toString().length) % doctors.length];
      const recorder = users[(i + 3) % users.length];

      vitalsDocs.push({
        patientId: patient._id,
        doctorId: doctor._id,
        bloodPressure: { systolic, diastolic },
        heartRate: faker.number.int({ min: 60, max: 110 }),
        temperature: faker.number.float({ min: 97, max: 99.5, fractionDigits: 1 }),
        bloodSugar: faker.number.int({ min: 80, max: 180 }),
        oxygenSaturation: faker.number.int({ min: 94, max: 100 }),
        respiratoryRate: faker.number.int({ min: 12, max: 20 }),
        recordedAt: ts,
        recordedBy: recorder._id,
        createdAt: ts
      });
    }
  }

  if (!vitalsDocs.length) {
    console.log('No vitals to insert.');
    return;
  }

  await Vitals.insertMany(vitalsDocs);
  console.log(`Inserted ${vitalsDocs.length} vitals records.`);
};

connect()
  .then(seed)
  .catch((error) => {
    console.error('Vitals seed failed:', error);
  })
  .finally(() => {
    mongoose.disconnect();
  });
