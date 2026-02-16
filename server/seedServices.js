const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('./models/Service');
const ServiceAnalytics = require('./models/ServiceAnalytics');

dotenv.config();

const reset = process.argv.includes('--reset');

const baseServices = [
  {
    title: 'Executive Health Concierge',
    description: 'White‑glove health management for executives with same‑day access.',
    badge: 'Signature',
    category: 'Concierge',
    available: '24/7',
    rating: 4.9,
    price: 'Premium',
    startingPrice: 150,
    stats: '5,200+ executives served',
    duration: '60-90 mins',
    deliverables: ['Consultation', 'Diagnostics', 'Care Plan'],
    skillStack: ['Telemedicine', 'Preventive', 'Data‑Driven'],
    specialBadge: 'Most Trusted',
    features: ['Dedicated Care Manager', 'Priority Scheduling', 'Home Visits'],
    useCases: ['Executive Physicals', 'Chronic Care', 'Preventive Planning'],
    timeline: 'Same‑day access with monthly follow‑ups',
    faq: [
      { q: 'Is this available internationally?', a: 'Yes, concierge travel care is available on request.' },
      { q: 'Can I include family members?', a: 'Yes, family plans are available.' }
    ],
    portfolio: ['Reduced executive downtime by 38%'],
    reviews: [
      { name: 'Ava R.', rating: 5, comment: 'Fast, discreet, and highly coordinated.' },
      { name: 'Liam K.', rating: 5, comment: 'A true white‑glove health experience.' }
    ],
    pricingBreakdown: [{ plan: 'Premier', price: 150 }, { plan: 'Elite', price: 320 }],
    techStack: ['React', 'Node.js', 'Secure EHR'],
    testimonials: [{ text: 'Exceptional coordination', author: 'Board Member', video: '' }],
    caseStudies: ['Reduced missed workdays by 28%'],
    clientLogos: ['Fortune 100 Co', 'Global Holdings'],
    certifications: ['HIPAA Compliant', 'JCI Accredited'],
    sla: '99.9% availability',
    beforeAfter: { before: 'Fragmented care', after: 'Single concierge pathway' }
  },
  {
    title: 'Telemedicine Elite',
    description: 'Premium virtual care with specialists and instant prescriptions.',
    badge: 'Popular',
    category: 'Telemedicine',
    available: 'Mon - Sun',
    rating: 4.8,
    price: 'Free',
    startingPrice: 0,
    stats: '25,000+ virtual consults',
    duration: '15-45 mins',
    deliverables: ['Video Visit', 'Prescription', 'Follow-up'],
    skillStack: ['Telemedicine', 'Patient Care'],
    specialBadge: 'Fastest Access',
    features: ['HD Video', 'Secure Chat', 'Rapid RX'],
    useCases: ['Routine Checkups', 'Follow-ups', 'Second Opinion'],
    timeline: 'Same‑day slots available',
    faq: [
      { q: 'Can I book outside business hours?', a: 'Yes, 24/7 care is available.' }
    ],
    portfolio: ['Reduced no‑show rate by 22%'],
    reviews: [
      { name: 'Noah M.', rating: 5, comment: 'Smooth and reliable.' }
    ],
    pricingBreakdown: [{ plan: 'Free', price: 0 }, { plan: 'Priority', price: 30 }],
    techStack: ['WebRTC', 'E2E Encryption'],
    testimonials: [{ text: 'Best virtual care I’ve used', author: 'Patient', video: '' }],
    caseStudies: ['Virtual care scaled to 10k/month'],
    clientLogos: ['City Clinic'],
    certifications: ['HIPAA Compliant'],
    sla: '99.5% uptime',
    beforeAfter: { before: 'Long wait times', after: 'Instant access' }
  },
  {
    title: 'Advanced Diagnostics Suite',
    description: 'High‑precision labs and imaging with fast turnaround.',
    badge: 'Enterprise',
    category: 'Diagnostics',
    available: 'Mon - Sat',
    rating: 4.9,
    price: '$',
    startingPrice: 25,
    stats: '120,000+ tests completed',
    duration: '20-60 mins',
    deliverables: ['Lab Results', 'Radiology Report'],
    skillStack: ['Imaging', 'Pathology'],
    specialBadge: '48h Turnaround',
    features: ['MRI', 'CT', 'Genetic Testing'],
    useCases: ['Annual Physicals', 'Specialty Diagnostics'],
    timeline: '24-48 hour turnaround',
    faq: [
      { q: 'Do you provide home collection?', a: 'Yes, home collection is available.' }
    ],
    portfolio: ['Reduced report wait times by 35%'],
    reviews: [
      { name: 'Emma P.', rating: 5, comment: 'Fast and accurate results.' }
    ],
    pricingBreakdown: [{ plan: 'Basic', price: 25 }, { plan: 'Premium', price: 120 }],
    techStack: ['HL7', 'LIMS'],
    testimonials: [{ text: 'Trustworthy diagnostics', author: 'Physician', video: '' }],
    caseStudies: ['Improved diagnostic accuracy by 18%'],
    clientLogos: ['Regional Hospital'],
    certifications: ['CAP Accredited'],
    sla: '48h report guarantee'
  },
  {
    title: 'Cardiac Performance Lab',
    description: 'Advanced cardiac imaging, stress testing, and AI‑powered risk profiling.',
    badge: 'Clinical Excellence',
    category: 'Cardiology',
    available: 'Mon - Fri',
    rating: 4.9,
    price: '$$',
    startingPrice: 80,
    stats: '18,000+ assessments',
    duration: '45-90 mins',
    deliverables: ['Cardiac Report', 'Risk Profile'],
    skillStack: ['Cardiology', 'Imaging'],
    specialBadge: 'AI Risk Index',
    features: ['Stress Test', 'Echo', 'AI Risk'],
    useCases: ['Executive Physicals', 'Pre‑op Clearance'],
    timeline: 'Same‑week results',
    faq: [{ q: 'Do I need fasting?', a: 'Only for specific panels.' }],
    portfolio: ['Reduced adverse events by 12%'],
    reviews: [{ name: 'Zoe T.', rating: 5, comment: 'Thorough and fast.' }],
    pricingBreakdown: [{ plan: 'Standard', price: 80 }, { plan: 'Advanced', price: 190 }],
    techStack: ['AI Models', 'EHR'],
    testimonials: [{ text: 'Outstanding care', author: 'Patient', video: '' }],
    caseStudies: ['Improved risk stratification by 20%'],
    clientLogos: ['Heart Institute'],
    certifications: ['JCI Accredited'],
    sla: '72h report guarantee'
  },
  {
    title: 'Neurology Center of Excellence',
    description: 'Comprehensive neuro diagnostics and treatment plans.',
    badge: 'Specialist',
    category: 'Neurology',
    available: 'Mon - Sat',
    rating: 4.8,
    price: '$$',
    startingPrice: 70,
    stats: '9,500+ neuro consults',
    duration: '40-70 mins',
    deliverables: ['Neurology Report', 'Care Plan'],
    skillStack: ['Neurology'],
    features: ['EEG', 'MRI', 'Cognitive Testing'],
    useCases: ['Headache', 'Stroke Risk', 'Memory Care'],
    timeline: '3-5 days',
    reviews: [{ name: 'Omar H.', rating: 5, comment: 'Precise and caring.' }],
    pricingBreakdown: [{ plan: 'Core', price: 70 }, { plan: 'Advanced', price: 150 }],
    certifications: ['HIPAA Compliant'],
    sla: '5 day turnaround'
  },
  {
    title: 'Orthopedic Recovery Studio',
    description: 'Rehab, mobility, and sports injury recovery programs.',
    badge: 'Performance',
    category: 'Orthopedics',
    available: 'Mon - Sun',
    rating: 4.7,
    price: '$',
    startingPrice: 40,
    stats: '14,000+ rehab sessions',
    duration: '30-60 mins',
    deliverables: ['Mobility Plan', 'Physio Sessions'],
    skillStack: ['Physiotherapy'],
    features: ['Sports Rehab', 'Joint Care'],
    useCases: ['Post‑op Recovery', 'Sports Injuries'],
    timeline: 'Weekly sessions',
    reviews: [{ name: 'Amir S.', rating: 5, comment: 'Back on my feet fast.' }]
  },
  {
    title: 'Precision Dermatology',
    description: 'Medical dermatology and premium aesthetic services.',
    badge: 'Boutique',
    category: 'Dermatology',
    available: 'Mon - Fri',
    rating: 4.6,
    price: '$$',
    startingPrice: 60,
    stats: '7,800+ treatments',
    duration: '20-45 mins',
    deliverables: ['Treatment Plan', 'Follow‑up'],
    features: ['Laser', 'Skin Mapping'],
    useCases: ['Acne', 'Anti‑Aging', 'Skin Health']
  },
  {
    title: 'Oncology Care Pathway',
    description: 'Comprehensive oncology consultation and care coordination.',
    badge: 'Care Pathway',
    category: 'Oncology',
    available: 'Mon - Sat',
    rating: 4.8,
    price: '$$$',
    startingPrice: 120,
    stats: '3,600+ care plans',
    duration: '60-90 mins',
    deliverables: ['Care Plan', 'Treatment Coordination'],
    features: ['Tumor Board', 'Second Opinion'],
    useCases: ['Diagnosis', 'Treatment Planning']
  },
  {
    title: 'Pediatric Wellness Club',
    description: 'Preventive pediatric care and growth monitoring.',
    badge: 'Family',
    category: 'Pediatrics',
    available: 'Mon - Sat',
    rating: 4.9,
    price: '$',
    startingPrice: 25,
    stats: '22,000+ visits',
    duration: '20-40 mins',
    deliverables: ['Checkup', 'Vaccinations'],
    features: ['Growth Tracking', 'Parent Guidance'],
    useCases: ['Routine Checkups', 'Vaccinations']
  },
  {
    title: 'Home Healthcare Plus',
    description: 'Skilled nursing and therapy at home.',
    badge: 'Home Care',
    category: 'Home Care',
    available: '24/7',
    rating: 4.8,
    price: '$$',
    startingPrice: 75,
    stats: '6,200+ home visits',
    duration: '60 mins',
    deliverables: ['Home Visit', 'Care Notes'],
    features: ['Nursing', 'Physio', 'Tele‑follow‑up'],
    useCases: ['Elder Care', 'Post‑op Care']
  },
  {
    title: 'Mental Wellness Studio',
    description: 'Therapy, counseling, and psychiatry pathways.',
    badge: 'Confidential',
    category: 'Mental Health',
    available: 'Mon - Sun',
    rating: 4.7,
    price: '$$',
    startingPrice: 60,
    stats: '9,200+ sessions',
    duration: '50 mins',
    deliverables: ['Therapy Session', 'Care Plan'],
    features: ['CBT', 'Medication', 'Mindfulness'],
    useCases: ['Anxiety', 'Stress', 'Sleep']
  }
];

const generateService = (base, tierIndex, variantIndex) => {
  const tierLabels = ['Essential', 'Advanced', 'Executive', 'Premier', 'Elite'];
  const tierLabel = tierLabels[tierIndex % tierLabels.length];
  const priceMultiplier = 1 + tierIndex * 0.35 + variantIndex * 0.05;
  const startingPrice = Math.max(0, Math.round((base.startingPrice || 0) * priceMultiplier));

  return {
    ...base,
    title: `${base.title} ${tierLabel} ${variantIndex + 1}`,
    badge: variantIndex % 3 === 0 ? base.badge : null,
    rating: Math.min(5, Number((base.rating - 0.2 + Math.random() * 0.4).toFixed(1))),
    startingPrice,
    price: startingPrice === 0 ? 'Free' : `$${startingPrice}`,
    stats: `${(variantIndex + 1) * 1200 + tierIndex * 800}+ members served`,
    duration: base.duration || '30-60 mins',
    timeline: base.timeline || 'Flexible scheduling',
    reviews: base.reviews?.map((review) => ({
      ...review,
      comment: `${review.comment} (${tierLabel} tier)`
    })) || [],
  };
};

const services = [
  ...baseServices,
  ...baseServices.flatMap((service, serviceIndex) =>
    Array.from({ length: 6 }, (_, tierIndex) =>
      generateService(service, tierIndex, serviceIndex)
    )
  )
];

const connect = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_db';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};

const seed = async () => {
  if (reset) {
    await Service.deleteMany({});
    await ServiceAnalytics.deleteMany({});
  }

  const existing = await Service.countDocuments();
  if (existing === 0) {
    const created = await Service.create(services);
    await ServiceAnalytics.insertMany(
      created.map((s, idx) => ({
        serviceId: s._id,
        views: 80 + idx * 12,
        compares: 5 + (idx % 6),
        bookings: 2 + (idx % 4)
      }))
    );
  }
};

connect()
  .then(seed)
  .then(() => {
    console.log('OK: Services seed completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('ERROR: Services seed failed:', error);
    process.exit(1);
  });
