const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Patient = require('./models/Patient');
const LabResult = require('./models/LabResult');
const Prescription = require('./models/Prescription');
const Billing = require('./models/Billing');
const Doctor = require('./models/Doctor');

async function seedMedicalData() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/healthcare_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB for seeding medical data');

    // Get all existing patients
    const allPatients = await Patient.find();
    console.log(`Found ${allPatients.length} patients`);

    // Seed lab results, prescriptions, and billing for each patient
    console.log('Seeding lab results, prescriptions, and billing for patients...');
    for (const patient of allPatients) {
      // Check if patient already has data
      const existingLabResults = await LabResult.find({ patientId: patient._id });
      const existingPrescriptions = await Prescription.find({ patientId: patient._id });
      const existingBilling = await Billing.find({ patientId: patient._id });

      if (existingLabResults.length === 0) {
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
        console.log(`Created ${labResultsCount} lab results for patient ${patient._id}`);
      }

      if (existingPrescriptions.length === 0) {
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
        console.log(`Created ${prescriptionsCount} prescriptions for patient ${patient._id}`);
      }

      if (existingBilling.length === 0) {
        // Billing
        const billingCount = faker.number.int({ min: 1, max: 3 });
        for (let i = 0; i < billingCount; i++) {
          // Randomly pick a doctor for billing
          const doctor = await Doctor.findOne().skip(faker.number.int({ min: 0, max: 19 }));
          const subtotal = faker.number.int({ min: 500, max: 5000 });
          const billing = new Billing({
            patientId: patient._id,
            appointmentId: new mongoose.Types.ObjectId(), // Fake appointment ID
            doctorId: doctor ? doctor._id : null,
            items: [{
              description: faker.helpers.arrayElement(['Consultation', 'Lab Test', 'Medication', 'Procedure']),
              quantity: 1,
              unitPrice: subtotal,
              totalPrice: subtotal
            }],
            subtotal: subtotal,
            totalAmount: subtotal,
            paymentStatus: faker.helpers.arrayElement(['Paid', 'Pending']),
            createdAt: faker.date.past(0.5),
          });
          await billing.save();
        }
        console.log(`Created ${billingCount} billing records for patient ${patient._id}`);
      }
    }
    console.log('Medical data seeding completed successfully');

  } catch (error) {
    console.error('Error seeding medical data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedMedicalData();
