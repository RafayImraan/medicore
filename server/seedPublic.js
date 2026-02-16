const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');

const Department = require('./models/Department');
const PharmacyItem = require('./models/PharmacyItem');

dotenv.config();

const DEPARTMENTS = [
  {
    slug: 'cardiology',
    name: 'Cardiology',
    iconKey: 'HeartPulse',
    head: 'Dr. Ahsan Malik',
    description: 'Comprehensive heart care including ECG, angiography, cath lab & cardiac surgery.',
    timings: 'Mon-Sat: 09:00-17:00',
    phone: '+92 21 111 900 100',
    location: 'Tower A, Level 4',
    category: 'Inpatient',
    services: ['ECG & Echo', 'Angiography', 'Angioplasty', 'Cardiac Rehab'],
    rating: 4.8,
    reviews: 238,
    badges: ['Most Visited', '24/7 Triage'],
    occupancy: 0.72,
    waitMins: 18,
    doctors: [
      { name: 'Dr. Zara Khan', role: 'Interventional Cardiologist', slots: ['10:30', '11:15', '15:00'] },
      { name: 'Dr. Usman Ali', role: 'Cardiac Surgeon', slots: ['12:00', '16:30'] }
    ]
  },
  {
    slug: 'neurology',
    name: 'Neurology',
    iconKey: 'Brain',
    head: 'Dr. Sara Khan',
    description: 'Diagnosis & treatment of brain, spine and nerve disorders including stroke & epilepsy.',
    timings: 'Mon-Fri: 10:00-16:00',
    phone: '+92 21 111 900 200',
    location: 'Tower B, Level 3',
    category: 'Outpatient',
    services: ['EEG', 'Stroke Clinic', 'Neuromuscular Clinic'],
    rating: 4.7,
    reviews: 154,
    badges: ['Stroke Ready'],
    occupancy: 0.61,
    waitMins: 25,
    doctors: [
      { name: 'Dr. Imran Noor', role: 'Neurologist', slots: ['09:30', '13:00'] },
      { name: 'Dr. Maryam J.', role: 'Neurosurgeon', slots: ['11:45', '15:15'] }
    ]
  },
  {
    slug: 'pediatrics',
    name: 'Pediatrics',
    iconKey: 'Baby',
    head: 'Dr. Imran Siddiqui',
    description: 'Comprehensive child care: immunizations, growth monitoring & pediatric emergencies.',
    timings: 'Daily: 08:00-18:00',
    phone: '+92 21 111 900 300',
    location: "Children's Wing",
    category: 'Outpatient',
    services: ['Well-baby Clinic', 'NICU Consult', 'Vaccine Center'],
    rating: 4.6,
    reviews: 310,
    badges: ['Family Friendly'],
    occupancy: 0.58,
    waitMins: 12,
    doctors: [
      { name: 'Dr. Hiba Farooq', role: 'Pediatrician', slots: ['10:15', '12:45', '16:00'] }
    ]
  },
  {
    slug: 'radiology',
    name: 'Radiology',
    iconKey: 'Radiation',
    head: 'Dr. Nida Ahmed',
    description: 'Advanced imaging: Digital X-ray, MRI, CT scan & Ultrasound - 24/7 reporting.',
    timings: 'Mon-Sat: 08:00-20:00',
    phone: '+92 21 111 900 400',
    location: 'Diagnostics Block',
    category: 'Diagnostics',
    services: ['MRI', 'CT', 'Ultrasound', 'X-ray'],
    rating: 4.5,
    reviews: 192,
    badges: ['Fast Reports'],
    occupancy: 0.81,
    waitMins: 30,
    doctors: [
      { name: 'Dr. Hamza Qureshi', role: 'Radiologist', slots: ['09:00', '14:30'] }
    ]
  },
  {
    slug: 'oncology',
    name: 'Oncology',
    iconKey: 'Syringe',
    head: 'Dr. Faisal Raza',
    description: 'Cancer diagnosis, chemotherapy, radiation therapy & palliative care.',
    timings: 'Mon-Fri: 09:00-15:00',
    phone: '+92 21 111 900 500',
    location: 'Tower C, Level 2',
    category: 'Inpatient',
    services: ['Chemo Suite', 'Radiation', 'Tumor Board'],
    rating: 4.7,
    reviews: 121,
    badges: ['Tumor Board'],
    occupancy: 0.69,
    waitMins: 20,
    doctors: [
      { name: 'Dr. Hira Sajid', role: 'Oncologist', slots: ['10:45', '12:30'] }
    ]
  },
  {
    slug: 'orthopedics',
    name: 'Orthopedics',
    iconKey: 'Bone',
    head: 'Dr. Rabia Shah',
    description: 'Bone & joint care: fractures, arthritis, arthroscopy & joint replacement.',
    timings: 'Mon-Sat: 10:00-18:00',
    phone: '+92 21 111 900 600',
    location: 'Surgical Block',
    category: 'Surgery',
    services: ['Fracture Clinic', 'Sports Injury', 'Joint Replacement'],
    rating: 4.6,
    reviews: 176,
    badges: ['Rehab Linked'],
    occupancy: 0.55,
    waitMins: 22,
    doctors: [
      { name: 'Dr. Danish R.', role: 'Orthopedic Surgeon', slots: ['11:00', '12:15', '17:30'] }
    ]
  }
];

const MEDICINES = [
  { name: 'Paracetamol 500mg', category: 'Pain Relief', price: 2.5, type: 'Tablet' },
  { name: 'Ibuprofen 400mg', category: 'Pain Relief', price: 3.0, type: 'Tablet' },
  { name: 'Aspirin 75mg', category: 'Cardiovascular', price: 1.5, type: 'Tablet' },
  { name: 'Naproxen 250mg', category: 'Pain Relief', price: 4.0, type: 'Tablet' },
  { name: 'Loratadine 10mg', category: 'Allergy', price: 3.5, type: 'Tablet' },
  { name: 'Cetirizine 10mg', category: 'Allergy', price: 2.5, type: 'Tablet' },
  { name: 'Fexofenadine 180mg', category: 'Allergy', price: 5.0, type: 'Tablet' },
  { name: 'Antacid Tablets', category: 'Digestive', price: 2.0, type: 'Tablet' },
  { name: 'Omeprazole 20mg', category: 'Digestive', price: 3.5, type: 'Capsule' },
  { name: 'ORS Solution', category: 'Digestive', price: 1.5, type: 'Powder' },
  { name: 'Amoxicillin 500mg', category: 'Antibiotic', price: 5.0, type: 'Capsule' },
  { name: 'Azithromycin 500mg', category: 'Antibiotic', price: 8.0, type: 'Tablet' },
  { name: 'Ciprofloxacin 500mg', category: 'Antibiotic', price: 4.5, type: 'Tablet' },
  { name: 'Metformin 500mg', category: 'Diabetes', price: 2.0, type: 'Tablet' },
  { name: 'Glimepiride 2mg', category: 'Diabetes', price: 3.5, type: 'Tablet' },
  { name: 'Insulin Injection', category: 'Diabetes', price: 15.0, type: 'Injection' },
  { name: 'Amlodipine 5mg', category: 'Cardiovascular', price: 2.5, type: 'Tablet' },
  { name: 'Losartan 50mg', category: 'Cardiovascular', price: 3.0, type: 'Tablet' },
  { name: 'Atorvastatin 10mg', category: 'Cardiovascular', price: 4.0, type: 'Tablet' },
  { name: 'Salbutamol Inhaler', category: 'Respiratory', price: 12.0, type: 'Inhaler' },
  { name: 'Cough Syrup', category: 'Respiratory', price: 6.0, type: 'Syrup' },
  { name: 'Nasal Spray', category: 'Respiratory', price: 5.0, type: 'Spray' },
  { name: 'Multivitamin Tablets', category: 'Vitamins', price: 6.0, type: 'Tablet' },
  { name: 'Vitamin D3 Capsules', category: 'Vitamins', price: 5.5, type: 'Capsule' },
  { name: 'Vitamin C Tablets', category: 'Vitamins', price: 4.0, type: 'Tablet' },
  { name: 'Calcium Tablets', category: 'Vitamins', price: 4.5, type: 'Tablet' },
  { name: 'Iron Supplements', category: 'Supplements', price: 3.5, type: 'Tablet' },
  { name: 'Omega-3 Capsules', category: 'Supplements', price: 7.5, type: 'Capsule' },
  { name: 'Protein Powder', category: 'Supplements', price: 25.0, type: 'Powder' },
  { name: 'Baby Diapers', category: 'Baby Care', price: 12.0, type: 'Powder' },
  { name: 'Baby Lotion', category: 'Baby Care', price: 5.0, type: 'Lotion' },
  { name: 'Rash Cream', category: 'Baby Care', price: 4.5, type: 'Cream' },
  { name: 'Bandages Pack', category: 'First Aid', price: 2.0, type: 'Gel' },
  { name: 'Antiseptic Cream', category: 'First Aid', price: 3.5, type: 'Cream' },
  { name: 'Hand Sanitizer', category: 'First Aid', price: 3.0, type: 'Gel' },
  { name: 'Moisturizer', category: 'Skin Care', price: 8.0, type: 'Cream' },
  { name: 'Sunscreen', category: 'Skin Care', price: 10.0, type: 'Cream' },
  { name: 'Acne Cream', category: 'Skin Care', price: 6.5, type: 'Cream' },
  { name: 'Digital Thermometer', category: 'Medical Equipment', price: 8.0, type: 'Tablet' },
  { name: 'Blood Pressure Monitor', category: 'Medical Equipment', price: 35.0, type: 'Tablet' },
  { name: 'Face Masks Pack', category: 'Medical Equipment', price: 8.0, type: 'Gel' }
];

const buildItem = (item) => ({
  name: item.name,
  category: item.category,
  price: item.price,
  type: item.type,
  quantity: faker.number.int({ min: 5, max: 150 }),
  expiry: faker.date.future({ years: 2 }),
  supplier: faker.company.name(),
  description: faker.lorem.sentence(),
  image: 'https://mgx-backend-cdn.metadl.com/generate/images/920366/2026-01-20/8880561c-baf1-4391-9570-888e6472e25a.png',
  batchNumber: `BATCH-${faker.string.alphanumeric(8).toUpperCase()}`,
  dosage: `${faker.number.int({ min: 1, max: 3 })} times daily`,
  sideEffects: [faker.lorem.words(3), faker.lorem.words(3), faker.lorem.words(3)],
  interactions: [faker.lorem.words(4), faker.lorem.words(4)],
  rating: faker.number.float({ min: 3.5, max: 5, precision: 0.1 }),
  reviews: faker.number.int({ min: 10, max: 500 }),
  isPopular: faker.datatype.boolean(),
  isNew: faker.datatype.boolean(),
  discount: faker.helpers.arrayElement([0, 5, 10, 15, 20])
});

const connect = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_db';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};

const seed = async () => {
  const shouldReset = process.argv.includes('--reset');

  if (shouldReset) {
    await Department.deleteMany({});
    await PharmacyItem.deleteMany({});
  }

  if ((await Department.countDocuments()) === 0) {
    await Department.insertMany(DEPARTMENTS);
  }

  if ((await PharmacyItem.countDocuments()) === 0) {
    await PharmacyItem.insertMany(MEDICINES.map(buildItem));
  }

  console.log('Public data seeded.');
};

connect()
  .then(seed)
  .catch((error) => {
    console.error('Public seed failed:', error);
  })
  .finally(() => {
    mongoose.disconnect();
  });
