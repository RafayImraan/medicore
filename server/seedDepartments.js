const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Department = require('./models/Department');
const DepartmentAnalytics = require('./models/DepartmentAnalytics');
const DepartmentAnnouncement = require('./models/DepartmentAnnouncement');
const DepartmentHighlight = require('./models/DepartmentHighlight');
const DepartmentInsurance = require('./models/DepartmentInsurance');
const DepartmentSchedule = require('./models/DepartmentSchedule');
const DepartmentRecommendation = require('./models/DepartmentRecommendation');
const DepartmentReview = require('./models/DepartmentReview');

dotenv.config();

const reset = process.argv.includes('--reset');

const BASE_DEPARTMENTS = [
  {
    slug: 'cardiology',
    name: 'Cardiology',
    iconKey: 'HeartPulse',
    head: 'Dr. Ahsan Malik',
    description: 'Comprehensive heart care including ECG, angiography, cath lab & cardiac surgery.',
    timings: 'Mon-Sat: 09:00-17:00',
    phone: '+1 (212) 555-0101',
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
    phone: '+1 (212) 555-0102',
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
    phone: '+1 (212) 555-0103',
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
    phone: '+1 (212) 555-0104',
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
    phone: '+1 (212) 555-0105',
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
    phone: '+1 (212) 555-0106',
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
  },
  {
    slug: 'dermatology',
    name: 'Dermatology',
    iconKey: 'Stethoscope',
    head: 'Dr. Meera Das',
    description: 'Medical, surgical, and cosmetic dermatology with precision skin mapping.',
    timings: 'Mon-Sat: 09:00-17:00',
    phone: '+1 (212) 555-0107',
    location: 'Tower D, Level 2',
    category: 'Outpatient',
    services: ['Laser Therapy', 'Skin Mapping', 'Cosmetic Consults'],
    rating: 4.8,
    reviews: 214,
    badges: ['Boutique Care'],
    occupancy: 0.62,
    waitMins: 16,
    doctors: [
      { name: 'Dr. Sana Rizvi', role: 'Dermatologist', slots: ['10:00', '13:30'] }
    ]
  },
  {
    slug: 'pulmonology',
    name: 'Pulmonology',
    iconKey: 'Stethoscope',
    head: 'Dr. Arman Khalid',
    description: 'Respiratory care, sleep labs, and pulmonary rehabilitation.',
    timings: 'Mon-Fri: 09:00-16:00',
    phone: '+1 (212) 555-0108',
    location: 'Tower B, Level 5',
    category: 'Inpatient',
    services: ['Sleep Study', 'Pulmonary Rehab', 'COPD Clinic'],
    rating: 4.5,
    reviews: 166,
    badges: ['Sleep Lab'],
    occupancy: 0.67,
    waitMins: 21,
    doctors: [
      { name: 'Dr. Bilal Khan', role: 'Pulmonologist', slots: ['09:30', '14:00'] }
    ]
  },
  {
    slug: 'endocrinology',
    name: 'Endocrinology',
    iconKey: 'Thermometer',
    head: 'Dr. Naila Yousaf',
    description: 'Hormone, thyroid, and metabolic disorder management.',
    timings: 'Mon-Sat: 10:00-18:00',
    phone: '+1 (212) 555-0109',
    location: 'Tower A, Level 2',
    category: 'Outpatient',
    services: ['Diabetes Care', 'Thyroid Clinic', 'Metabolic Plans'],
    rating: 4.7,
    reviews: 145,
    badges: ['Metabolic Center'],
    occupancy: 0.52,
    waitMins: 17,
    doctors: [
      { name: 'Dr. Hooria Malik', role: 'Endocrinologist', slots: ['11:15', '15:45'] }
    ]
  },
  {
    slug: 'nephrology',
    name: 'Nephrology',
    iconKey: 'Stethoscope',
    head: 'Dr. Faraz Iqbal',
    description: 'Kidney care, dialysis planning, and transplant coordination.',
    timings: 'Mon-Fri: 08:30-16:30',
    phone: '+1 (212) 555-0110',
    location: 'Tower C, Level 4',
    category: 'Inpatient',
    services: ['Dialysis', 'Transplant Coordination', 'Renal Clinics'],
    rating: 4.6,
    reviews: 132,
    badges: ['Dialysis Hub'],
    occupancy: 0.74,
    waitMins: 26,
    doctors: [
      { name: 'Dr. Rana J.', role: 'Nephrologist', slots: ['09:45', '13:15'] }
    ]
  }
];

const tierLabels = ['Essential', 'Signature', 'Premier', 'Elite', 'Executive'];
const categoryVariants = ['Inpatient', 'Outpatient', 'Diagnostics', 'Surgery', 'Rehab', 'Wellness'];

const createVariant = (base, tierIndex, variantIndex) => {
  const tier = tierLabels[tierIndex % tierLabels.length];
  const variant = {
    ...base,
    slug: `${base.slug}-${tier.toLowerCase()}-${variantIndex + 1}`,
    name: `${base.name} ${tier} Unit ${variantIndex + 1}`,
    category: categoryVariants[(tierIndex + variantIndex) % categoryVariants.length],
    rating: Math.min(5, Number((base.rating - 0.3 + Math.random() * 0.6).toFixed(1))),
    reviews: base.reviews + (variantIndex + 1) * 45,
    occupancy: Math.max(0.35, Math.min(0.92, +(base.occupancy + (Math.random() * 0.2 - 0.1)).toFixed(2))),
    waitMins: Math.max(8, Math.min(45, base.waitMins + Math.floor(Math.random() * 10 - 5))),
    badges: Array.from(new Set([...(base.badges || []), tier])),
    services: Array.from(new Set([...(base.services || []), `${tier} Protocol`, 'Priority Triage']))
  };

  return variant;
};

const departments = [
  ...BASE_DEPARTMENTS,
  ...BASE_DEPARTMENTS.flatMap((dept, index) =>
    Array.from({ length: 5 }, (_, tierIndex) => createVariant(dept, tierIndex, index))
  )
];

const connect = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_db';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};

const seed = async () => {
  if (reset) {
    await Department.deleteMany({});
    await DepartmentAnalytics.deleteMany({});
    await DepartmentAnnouncement.deleteMany({});
    await DepartmentHighlight.deleteMany({});
    await DepartmentInsurance.deleteMany({});
    await DepartmentSchedule.deleteMany({});
    await DepartmentRecommendation.deleteMany({});
    await DepartmentReview.deleteMany({});
  }

  const existing = await Department.countDocuments();
  if (existing === 0) {
    const created = await Department.create(departments);
    await DepartmentAnalytics.insertMany(
      created.map((dept, idx) => ({
        departmentId: dept._id,
        views: 120 + idx * 8,
        compares: 6 + (idx % 5),
        favorites: 4 + (idx % 6),
        contacts: 3 + (idx % 4),
        directions: 2 + (idx % 3),
        bookings: 5 + (idx % 7),
        searches: 10 + (idx % 8),
        chats: 1 + (idx % 3)
      }))
    );

    const weeklyTemplate = [
      { day: 'Monday', startTime: '09:00', endTime: '17:00', walkIn: true },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00', walkIn: true },
      { day: 'Wednesday', startTime: '10:00', endTime: '18:00', walkIn: true },
      { day: 'Thursday', startTime: '09:30', endTime: '17:30', walkIn: true },
      { day: 'Friday', startTime: '09:00', endTime: '16:00', walkIn: false },
      { day: 'Saturday', startTime: '10:00', endTime: '14:00', walkIn: true },
      { day: 'Sunday', startTime: '', endTime: '', walkIn: false }
    ];

    await DepartmentSchedule.insertMany(
      created.map((dept, idx) => ({
        departmentId: dept._id,
        weekly: weeklyTemplate.map((row, dayIndex) => ({
          ...row,
          telehealth: (idx + dayIndex) % 3 === 0
        })),
        notes: idx % 3 === 0 ? 'Priority access for concierge members.' : 'Appointments recommended for best experience.'
      }))
    );

    const highlightLabels = ['Patient Satisfaction', 'Avg Wait Time', 'Care Specialists', 'Beds Available'];
    const highlights = created.flatMap((dept, idx) => [
      {
        departmentId: dept._id,
        label: highlightLabels[0],
        value: `${92 + (idx % 7)}%`,
        trend: 'up',
        delta: `+${2 + (idx % 3)}%`,
        iconKey: 'Sparkles'
      },
      {
        departmentId: dept._id,
        label: highlightLabels[1],
        value: `${Math.max(10, dept.waitMins - (idx % 4))} min`,
        trend: idx % 2 === 0 ? 'down' : 'stable',
        delta: idx % 2 === 0 ? '-3 min' : 'stable',
        iconKey: 'Activity'
      },
      {
        departmentId: dept._id,
        label: highlightLabels[2],
        value: `${5 + (idx % 6)} on duty`,
        trend: 'up',
        delta: `+${1 + (idx % 2)}`,
        iconKey: 'Users'
      },
      {
        departmentId: dept._id,
        label: highlightLabels[3],
        value: `${12 + (idx % 8)}`,
        trend: 'stable',
        delta: 'steady',
        iconKey: 'CalendarClock'
      }
    ]);
    await DepartmentHighlight.insertMany(highlights);

    const announcements = created.slice(0, 10).map((dept, idx) => ({
      departmentId: dept._id,
      title: `${dept.name} Concierge Hours`,
      message: `Extended slots available this week with ${dept.waitMins} min average wait.`,
      priority: idx % 2 === 0 ? 'high' : 'medium',
      startAt: new Date(Date.now() - 86400000),
      endAt: new Date(Date.now() + 7 * 86400000),
      tags: ['featured', dept.category]
    }));
    announcements.push({
      title: 'Enterprise Care Upgrade',
      message: 'Priority scheduling and executive lounges now available for premium members.',
      priority: 'high',
      startAt: new Date(Date.now() - 86400000),
      endAt: new Date(Date.now() + 14 * 86400000),
      tags: ['concierge', 'premium']
    });
    await DepartmentAnnouncement.insertMany(announcements);

    const insurerNames = ['Aetna', 'BlueCross', 'Cigna', 'United', 'Humana', 'Kaiser'];
    const insuranceDocs = created.flatMap((dept, idx) =>
      insurerNames.slice(0, 3 + (idx % 3)).map((name, i) => ({
        departmentId: dept._id,
        insurerId: `${name.toLowerCase()}-${idx}-${i}`,
        name,
        plan: ['Gold', 'Platinum', 'Elite'][i % 3],
        network: i % 2 === 0 ? 'In-Network' : 'Preferred',
        coverage: i % 2 === 0 ? '80-90% coverage' : '70-85% coverage',
        copay: `$${25 + (i * 10)}`,
        preAuthRequired: i % 2 === 1,
        phone: '+1 (800) 555-0199',
        notes: 'Concierge desk assists with prior authorizations.'
      }))
    );
    await DepartmentInsurance.insertMany(insuranceDocs);

    const reviewNames = ['Amelia', 'Liam', 'Noah', 'Olivia', 'Ava', 'Lucas', 'Mia', 'Ethan'];
    const reviewComments = [
      'Exceptional coordination and concierge-level care throughout the visit.',
      'Premium facilities with clear communication and fast triage.',
      'Specialists were attentive and the care plan felt tailored.',
      'Wait time was shorter than expected and the team was very kind.',
      'Loved the calm atmosphere and detailed explanations from staff.'
    ];

    const reviewDocs = created.flatMap((dept, idx) =>
      Array.from({ length: 3 }, (_, i) => ({
        departmentId: dept._id,
        name: reviewNames[(idx + i) % reviewNames.length],
        rating: 4 + (i % 2) * 0.5,
        comment: reviewComments[(idx + i) % reviewComments.length]
      }))
    );
    await DepartmentReview.insertMany(reviewDocs);

    const recommendationDocs = created.slice(0, 18).map((dept, idx) => ({
      departmentId: dept._id,
      title: `${dept.name} Priority Access`,
      reason: `High demand with ${dept.waitMins} min average waits. Reserve concierge slots.`,
      score: 95 - idx,
      tags: ['priority', dept.category]
    }));
    await DepartmentRecommendation.insertMany(recommendationDocs);
  }
};

connect()
  .then(seed)
  .then(() => {
    console.log('OK: Departments seed completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('ERROR: Departments seed failed:', error);
    process.exit(1);
  });
