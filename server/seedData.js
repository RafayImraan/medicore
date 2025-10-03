const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/healthcare_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB for seeding');

    // Clear existing fake data if needed (optional, comment out if you want to keep)
    // await User.deleteMany({ email: { $regex: /^(doctor|patient)\d+@example\.com$/ } });
    // await Doctor.deleteMany({});
    // await Patient.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Seed 20 doctors
    console.log('Seeding 20 doctors...');
    const specialties = ['Cardiology', 'Neurology', 'Orthopedics', 'Dermatology', 'Pediatrics', 'Gynecology', 'Ophthalmology', 'Psychiatry', 'Radiology', 'Surgery'];
    for (let i = 1; i <= 20; i++) {
      const name = faker.person.fullName();
      const email = `doctor${i}@example.com`;

      // Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({
          name,
          email,
          password: hashedPassword,
          role: 'doctor',
        });
        await user.save();
      }

      const doctor = new Doctor({
        userId: user._id,
        specialization: faker.helpers.arrayElement(specialties),
        licenseNumber: `DOC${faker.string.alphanumeric(6).toUpperCase()}`,
        experience: faker.number.int({ min: 5, max: 30 }),
        education: [
          {
            degree: 'MBBS',
            institution: faker.company.name(),
            year: faker.number.int({ min: 1990, max: 2010 }),
          },
          {
            degree: 'MD',
            institution: faker.company.name(),
            year: faker.number.int({ min: 2010, max: 2020 }),
          },
        ],
        hospital: {
          name: faker.company.name(),
          address: faker.location.streetAddress(),
        },
        consultationFee: faker.number.int({ min: 50, max: 200 }),
        availability: [
          { day: 'Monday', startTime: '09:00', endTime: '17:00', maxPatients: 10 },
          { day: 'Tuesday', startTime: '09:00', endTime: '17:00', maxPatients: 10 },
          { day: 'Wednesday', startTime: '09:00', endTime: '17:00', maxPatients: 10 },
          { day: 'Thursday', startTime: '09:00', endTime: '17:00', maxPatients: 10 },
          { day: 'Friday', startTime: '09:00', endTime: '17:00', maxPatients: 10 },
        ],
        featured: i % 4 === 0, // Mark every 4th doctor as featured for variety
      });
      await doctor.save();
    }
    console.log('20 doctors seeded successfully');

    // Seed 50 patients
    console.log('Seeding 50 patients...');
    for (let i = 1; i <= 50; i++) {
      const name = faker.person.fullName();
      const email = `patient${i}@example.com`;

      // Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({
          name,
          email,
          password: hashedPassword,
          role: 'patient',
        });
        await user.save();
      }

      const patient = new Patient({
        userId: user._id,
        dateOfBirth: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }),
        gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
        bloodGroup: faker.helpers.arrayElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
        phone: faker.phone.number(),
        address: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode(),
          country: 'India',
        },
        emergencyContact: {
          name: faker.person.fullName(),
          phone: faker.phone.number(),
          relationship: faker.helpers.arrayElement(['Spouse', 'Parent', 'Sibling', 'Friend']),
        },
        medicalHistory: [
          {
            condition: faker.helpers.arrayElement(['Hypertension', 'Diabetes', 'Asthma', 'Arthritis', 'Migraine']),
            diagnosisDate: faker.date.past({ years: 10 }),
            status: faker.helpers.arrayElement(['Active', 'Resolved', 'Chronic']),
          },
        ],
        allergies: faker.helpers.arrayElements(['Penicillin', 'Nuts', 'Dust', 'Pollen'], { min: 0, max: 2 }),
        insurance: {
          provider: faker.company.name(),
          policyNumber: faker.string.alphanumeric(10).toUpperCase(),
          validTill: faker.date.future({ years: 2 }),
        },
      });
      await patient.save();
    }
    console.log('50 patients seeded successfully');

    console.log('Seeding completed successfully');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedData();
