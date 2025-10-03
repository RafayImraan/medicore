const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
const LabResult = require('./models/LabResult');
const Prescription = require('./models/Prescription');
const Billing = require('./models/Billing');

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/healthcare_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB for seeding');

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
    const allPatients = [];
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
      allPatients.push(patient);
    }
    console.log('50 patients seeded successfully');

    // Seed lab results, prescriptions, and billing for each patient
    console.log('Seeding lab results, prescriptions, and billing for patients...');
    for (const patient of allPatients) {
      // Lab Results
      const labTests = ['CBC', 'Lipid Panel', 'HbA1c', 'Chest X-Ray', 'Urinalysis'];
      const labResultsCount = faker.number.int({ min: 1, max: 5 });
      for (let i = 0; i < labResultsCount; i++) {
        const labResult = new LabResult({
          patientId: patient._id,
          testName: faker.helpers.arrayElement(labTests),
          date: faker.date.past(1),
          result: faker.helpers.arrayElement(['Normal', 'Abnormal', 'Borderline']),
          status: faker.helpers.arrayElement(['Ready', 'Pending', 'Reviewed']),
        });
        await labResult.save();
      }

      // Prescriptions
      const medications = ['Amlodipine', 'Metformin', 'Lisinopril', 'Atorvastatin', 'Omeprazole'];
      const prescriptionsCount = faker.number.int({ min: 1, max: 3 });
      for (let i = 0; i < prescriptionsCount; i++) {
        // Randomly pick a doctor to assign as prescribedBy
        const doctor = await Doctor.findOne().skip(faker.number.int({ min: 0, max: 19 }));
        const prescription = new Prescription({
          patientId: patient._id,
          medication: faker.helpers.arrayElement(medications),
          dosage: `${faker.number.int({ min: 5, max: 500 })} mg`,
          frequency: faker.helpers.arrayElement(['Once daily', 'Twice daily', 'Every 8 hours']),
          prescribedBy: doctor ? doctor.userId : null,
          date: faker.date.past(0.5),
          status: faker.helpers.arrayElement(['Active', 'Completed', 'Cancelled']),
        });
        await prescription.save();
      }

      // Billing
      const billingCount = faker.number.int({ min: 1, max: 3 });
      for (let i = 0; i < billingCount; i++) {
        const billing = new Billing({
          patientId: patient._id,
          invoice: `INV-${faker.number.int({ min: 1000, max: 9999 })}`,
          totalAmount: faker.number.int({ min: 500, max: 5000 }),
          paymentStatus: faker.helpers.arrayElement(['Paid', 'Pending']),
          createdAt: faker.date.past(0.5),
        });
        await billing.save();
      }
    }
    console.log('Lab results, prescriptions, and billing seeded successfully');

    console.log('Seeding completed successfully');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedData();
