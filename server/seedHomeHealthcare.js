const mongoose = require('mongoose');
const HomeHealthcareTeam = require('./models/HomeHealthcareTeam');
const HomeHealthcareService = require('./models/HomeHealthcareService');
const HomeHealthcarePackage = require('./models/HomeHealthcarePackage');
const HomeHealthcareCertification = require('./models/HomeHealthcareCertification');
const HomeHealthcarePartner = require('./models/HomeHealthcarePartner');
const HomeHealthcareBlogPost = require('./models/HomeHealthcareBlogPost');
const HomeHealthcareAward = require('./models/HomeHealthcareAward');
const HomeHealthcarePress = require('./models/HomeHealthcarePress');
const HomeHealthcareStory = require('./models/HomeHealthcareStory');

const reset = process.argv.includes('--reset');

const TEAM = [
  { name: 'Amelia Carter', role: 'Registered Nurse', years: 12, specialty: 'Elderly Care', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop' },
  { name: 'David Lin', role: 'Physical Therapist', years: 8, specialty: 'Post-surgical Rehab', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
  { name: 'Lina Noor', role: 'Occupational Therapist', years: 6, specialty: 'Chronic Disease Mgmt', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
  { name: 'Omar Rahman', role: 'Care Coordinator', years: 10, specialty: 'Care Planning', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop' }
];

const SERVICES = [
  { title: 'Skilled Nursing Care', description: 'Professional nursing services delivered at home.', features: ['Wound care', 'Medication administration', 'Vitals monitoring'] },
  { title: 'Therapies', description: 'Physical, Occupational, and Speech therapy programs.', features: ['Mobility training', 'ADL support', 'Speech rehab'] },
  { title: 'Personal Care', description: 'Daily assistance and companionship.', features: ['Bathing & grooming', 'Meal prep', 'Light housekeeping'] },
  { title: 'Chronic Disease Mgmt', description: 'Evidence-based care plans for long-term conditions.', features: ['Diabetes care', 'COPD support', 'Cardiac rehab'] },
  { title: 'Post-Surgical Care', description: 'Safe recovery at home with close monitoring.', features: ['Pain management', 'Dressing changes', 'Mobility progression'] },
  { title: '24/7 Support', description: 'On-call triage and emergency response guidance.', features: ['Hotline', 'Care escalation', 'Tele-support'] }
];

const PACKAGES = [
  { name: 'Basic', price: 49, perks: ['Weekly nurse check-in', 'Vitals tracking', 'Care hotline'], cta: 'Choose Basic' },
  { name: 'Standard', price: 99, highlight: true, perks: ['2 nurse visits / week', 'Personalized care plan', 'Therapy guidance'], cta: 'Choose Standard' },
  { name: 'Premium', price: 179, perks: ['Daily nurse tele-check', '3 visits / week', '24/7 support & escalation'], cta: 'Choose Premium' },
  { name: 'Enterprise', price: 299, perks: ['Dedicated care coordinator', 'Advanced telemedicine', 'Priority scheduling', 'Custom care protocols'], cta: 'Choose Enterprise' }
];

const CERTIFICATIONS = [
  'Joint Commission Accredited',
  'Certified Home Health Agency',
  'Licensed & Insured Professionals',
  'HIPAA Compliance & Patient Safety'
];

const PARTNERS = [
  { name: 'Blue Cross Blue Shield', logo: 'https://via.placeholder.com/80x50/0066cc/white?text=BCBS' },
  { name: 'UnitedHealthcare', logo: 'https://via.placeholder.com/80x50/00a651/white?text=UHC' },
  { name: 'Aetna', logo: 'https://via.placeholder.com/80x50/7d3f98/white?text=Aetna' },
  { name: 'Cigna', logo: 'https://via.placeholder.com/80x50/004b87/white?text=Cigna' }
];

const BLOG_POSTS = [
  { title: 'Home Recovery Checklist', excerpt: 'Steps to prepare your home for safe recovery.', slug: 'home-recovery-checklist', image: 'https://picsum.photos/seed/blog-1/600/400' },
  { title: 'Managing Chronic Conditions', excerpt: 'Daily habits that keep you on track.', slug: 'managing-chronic-conditions', image: 'https://picsum.photos/seed/blog-2/600/400' },
  { title: 'Family Caregiver Guide', excerpt: 'Supporting loved ones without burnout.', slug: 'family-caregiver-guide', image: 'https://picsum.photos/seed/blog-3/600/400' }
];

const AWARDS = [
  { year: 2025, title: 'Top Home Care Provider', organization: 'Healthcare Excellence Board' },
  { year: 2024, title: 'Patient Safety Excellence', organization: 'National Care Council' },
  { year: 2023, title: 'Innovation in Telehealth', organization: 'Digital Health Forum' }
];

const PRESS = [
  { outlet: 'Health Daily', headline: 'Medicore expands home care across the city', link: '#' },
  { outlet: 'Care Weekly', headline: 'New mobile nursing units launch this spring', link: '#' }
];

const STORIES = [
  { patient: 'Jasmin', photo: 'https://picsum.photos/seed/patient-1/300/300', story: 'Recovered mobility with consistent therapy at home.', outcome: 'Regained mobility' },
  { patient: 'Theo', photo: 'https://picsum.photos/seed/patient-2/300/300', story: 'Avoided rehospitalization through daily monitoring.', outcome: 'Reduced rehospitalization' }
];

const connect = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_db';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};

const seed = async () => {
  if (reset) {
    await Promise.all([
      HomeHealthcareTeam.deleteMany({}),
      HomeHealthcareService.deleteMany({}),
      HomeHealthcarePackage.deleteMany({}),
      HomeHealthcareCertification.deleteMany({}),
      HomeHealthcarePartner.deleteMany({}),
      HomeHealthcareBlogPost.deleteMany({}),
      HomeHealthcareAward.deleteMany({}),
      HomeHealthcarePress.deleteMany({}),
      HomeHealthcareStory.deleteMany({})
    ]);
  }

  if ((await HomeHealthcareTeam.countDocuments()) === 0) await HomeHealthcareTeam.insertMany(TEAM);
  if ((await HomeHealthcareService.countDocuments()) === 0) await HomeHealthcareService.insertMany(SERVICES);
  if ((await HomeHealthcarePackage.countDocuments()) === 0) await HomeHealthcarePackage.insertMany(PACKAGES);
  if ((await HomeHealthcareCertification.countDocuments()) === 0) await HomeHealthcareCertification.insertMany(CERTIFICATIONS.map(title => ({ title })));
  if ((await HomeHealthcarePartner.countDocuments()) === 0) await HomeHealthcarePartner.insertMany(PARTNERS);
  if ((await HomeHealthcareBlogPost.countDocuments()) === 0) await HomeHealthcareBlogPost.insertMany(BLOG_POSTS);
  if ((await HomeHealthcareAward.countDocuments()) === 0) await HomeHealthcareAward.insertMany(AWARDS);
  if ((await HomeHealthcarePress.countDocuments()) === 0) await HomeHealthcarePress.insertMany(PRESS);
  if ((await HomeHealthcareStory.countDocuments()) === 0) await HomeHealthcareStory.insertMany(STORIES);
};

connect()
  .then(seed)
  .then(() => {
    console.log('OK: Home healthcare seed completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('ERROR: Home healthcare seed failed:', error);
    process.exit(1);
  });
