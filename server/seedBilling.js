const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');

const Billing = require('./models/Billing');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const User = require('./models/User');

dotenv.config();

const SERVICES = ['MRI Scan', 'X-Ray', 'CT Scan', 'Blood Test', 'Consultation'];
const PAYMENT_METHODS = ['Cash', 'Card', 'Insurance', 'UPI', 'Net Banking'];
const PAYMENT_STATUSES = ['Pending', 'Paid', 'Partial', 'Cancelled'];

const connect = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_db';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};

const seed = async () => {
  const shouldReset = process.argv.includes('--reset');

  if (shouldReset) {
    await Billing.deleteMany({});
    console.log('Cleared existing bills');
  }

  const patients = await Patient.find().populate('userId', 'name email');
  const doctors = await Doctor.find().populate('userId', 'name email');

  if (!patients.length || !doctors.length) {
    console.log('Need patients and doctors to seed billing data.');
    return;
  }

  const bills = [];

  for (let i = 0; i < 25; i += 1) {
    const patient = faker.helpers.arrayElement(patients);
    const doctor = faker.helpers.arrayElement(doctors);
    const user = patient.userId || (await User.findById(patient.userId));

    const slotDate = faker.date.recent({ days: 40 });
    const appointmentDate = slotDate.toISOString().split('T')[0];
    const appointmentTime = slotDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const appointment = new Appointment({
      patient: {
        name: user?.name || 'Patient',
        phone: patient.phone,
        email: user?.email || 'patient@example.com',
        insurance: {
          provider: patient.insurance?.provider || '',
          number: patient.insurance?.policyNumber || ''
        }
      },
      doctor: {
        id: doctor._id.toString(),
        name: `Dr. ${doctor.userId?.name || 'Doctor'}`,
        specialization: doctor.specialization,
        experience: doctor.experience,
        rating: doctor.rating?.average || 4.5,
        fee: doctor.consultationFee,
        languages: doctor.languages || [],
        clinic: doctor.hospital?.name || 'Clinic'
      },
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      slot: slotDate,
      type: faker.helpers.arrayElement(['in-person', 'video', 'phone']),
      reason: faker.lorem.sentence(),
      consultationFee: doctor.consultationFee
    });

    await appointment.save();

    const itemCount = faker.number.int({ min: 1, max: 3 });
    const items = Array.from({ length: itemCount }).map(() => {
      const unitPrice = faker.number.int({ min: 500, max: 3000 });
      const quantity = faker.number.int({ min: 1, max: 2 });
      return {
        description: faker.helpers.arrayElement(SERVICES),
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = Math.round(subtotal * 0.05);
    const discount = faker.datatype.boolean() ? faker.number.int({ min: 100, max: 500 }) : 0;
    const totalAmount = subtotal + tax - discount;

    bills.push({
      patientId: patient._id,
      appointmentId: appointment._id,
      doctorId: doctor._id,
      items,
      subtotal,
      tax,
      discount,
      totalAmount,
      paymentMethod: faker.helpers.arrayElement(PAYMENT_METHODS),
      paymentStatus: faker.helpers.arrayElement(PAYMENT_STATUSES),
      createdAt: slotDate,
      updatedAt: slotDate
    });
  }

  if (bills.length) {
    await Billing.insertMany(bills);
    console.log(`Inserted ${bills.length} bills.`);
  }
};

connect()
  .then(seed)
  .catch((error) => {
    console.error('Billing seed failed:', error);
  })
  .finally(() => {
    mongoose.disconnect();
  });
