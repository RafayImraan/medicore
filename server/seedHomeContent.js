const mongoose = require('mongoose');
const HomeContent = require('./models/HomeContent');

const reset = process.argv.includes('--reset');

const CONTENT = {
  services: [
    { title: 'Cardiology', description: 'Advanced heart care with diagnostics and interventions.', icon: 'Heart', features: ['ECG', 'Echo', 'Rehab'] },
    { title: 'Neurology', description: 'Comprehensive brain and nerve care.', icon: 'Brain', features: ['EEG', 'Stroke Clinic'] },
    { title: 'Pediatrics', description: 'Specialized care for children and infants.', icon: 'Baby', features: ['Wellness', 'Vaccines'] },
    { title: 'Orthopedics', description: 'Joint care, sports injuries, and mobility.', icon: 'Stethoscope', features: ['Arthroscopy', 'Joint Replacement'] },
    { title: 'Oncology', description: 'Comprehensive cancer diagnostics and therapy.', icon: 'Activity', features: ['Chemo', 'Radiation'] },
    { title: 'Dermatology', description: 'Skin health, aesthetics, and advanced care.', icon: 'ShieldCheck', features: ['Laser', 'Cosmetic'] },
    { title: 'Psychiatry', description: 'Mental health support and counseling.', icon: 'Brain', features: ['Therapy', 'Medication'] },
    { title: 'Radiology', description: 'High‑precision imaging and diagnostics.', icon: 'Stethoscope', features: ['MRI', 'CT'] },
    { title: 'Emergency', description: '24/7 critical care and trauma response.', icon: 'Heart', features: ['Trauma', 'ICU'] }
  ],
  articles: [
    {
      id: 'art-1',
      title: 'Heart Health Basics',
      excerpt: 'Simple steps to protect your heart.',
      image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=800&h=500&fit=crop',
      author: 'Medicore Team',
      authorAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop',
      readMinutes: 5,
      category: 'Cardiology',
      date: '2026-01-05',
      views: 1540,
      likes: 230
    },
    {
      id: 'art-2',
      title: 'Managing Stress',
      excerpt: 'Mindfulness techniques for daily life.',
      image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&h=500&fit=crop',
      author: 'Wellness Desk',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      readMinutes: 6,
      category: 'Wellness',
      date: '2026-01-12',
      views: 980,
      likes: 190
    },
    {
      id: 'art-3',
      title: 'Diabetes Care',
      excerpt: 'How to keep glucose stable.',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&h=500&fit=crop',
      author: 'Care Team',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      readMinutes: 7,
      category: 'Endocrinology',
      date: '2026-01-18',
      views: 1120,
      likes: 210
    },
    {
      id: 'art-4',
      title: 'Sleep & Recovery',
      excerpt: 'Optimize deep sleep and recovery cycles.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=500&fit=crop',
      author: 'Wellness Desk',
      authorAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop',
      readMinutes: 6,
      category: 'Sleep',
      date: '2026-01-23',
      views: 1760,
      likes: 260
    },
    {
      id: 'art-5',
      title: 'Preventive Screening Guide',
      excerpt: 'Key screenings by age and risk.',
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&h=500&fit=crop',
      author: 'Medicore Team',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      readMinutes: 8,
      category: 'Preventive',
      date: '2026-01-28',
      views: 1460,
      likes: 240
    },
    {
      id: 'art-6',
      title: 'Nutrition for Performance',
      excerpt: 'Fueling your body for peak output.',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=500&fit=crop',
      author: 'Nutrition Lab',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      readMinutes: 5,
      category: 'Nutrition',
      date: '2026-02-01',
      views: 1940,
      likes: 310
    }
  ],
  testimonials: [
    {
      id: 't-1',
      name: 'Dr. Sarah Johnson',
      quote: 'Medicore home care keeps outcomes strong and patients safe.',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop',
      rating: 5,
      title: 'Chief of Cardiology',
      treatment: 'Cardiac Rehabilitation',
      doctor: 'Dr. Sarah Johnson',
      date: '2026-01-20',
      verified: true,
      videoUrl: ''
    },
    {
      id: 't-2',
      name: 'Michael Chen',
      quote: 'The telehealth flow is seamless for our family.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      rating: 5,
      title: 'CEO, Chen Enterprises',
      treatment: 'Telemedicine Follow-up',
      doctor: 'Dr. Zara Khan',
      date: '2026-01-22',
      verified: true,
      videoUrl: ''
    },
    {
      id: 't-3',
      name: 'Dr. Emily Rodriguez',
      quote: 'Data-driven care planning improves every visit.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      rating: 5,
      title: 'Director of Patient Care',
      treatment: 'Care Planning',
      doctor: 'Dr. Emily Rodriguez',
      date: '2026-01-25',
      verified: true,
      videoUrl: ''
    },
    {
      id: 't-4',
      name: 'Ariana Blake',
      quote: 'The premium concierge care made recovery effortless.',
      avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200&fit=crop',
      rating: 5,
      title: 'Founder, Nova Health',
      treatment: 'Post-Op Recovery',
      doctor: 'Dr. Amir Qureshi',
      date: '2026-01-29',
      verified: true,
      videoUrl: ''
    },
    {
      id: 't-5',
      name: 'James Carter',
      quote: 'Scheduling, labs, and follow-ups were seamless.',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
      rating: 5,
      title: 'Operations Director',
      treatment: 'Executive Health',
      doctor: 'Dr. Nadia Ali',
      date: '2026-02-02',
      verified: true,
      videoUrl: ''
    }
  ],
  insuranceProviders: [
    { id: 'ins-1', name: 'Blue Cross Blue Shield', logo: 'BCBS', coverage: 'Full', network: 'Nationwide' },
    { id: 'ins-2', name: 'UnitedHealthcare', logo: 'UHC', coverage: 'Partial', network: 'Regional' },
    { id: 'ins-3', name: 'Aetna', logo: 'Aetna', coverage: 'Full', network: 'Nationwide' },
    { id: 'ins-4', name: 'Cigna', logo: 'Cigna', coverage: 'Partial', network: 'Regional' },
    { id: 'ins-5', name: 'Humana', logo: 'Humana', coverage: 'Full', network: 'Regional' },
    { id: 'ins-6', name: 'Kaiser Permanente', logo: 'KP', coverage: 'Partial', network: 'Metro' },
    { id: 'ins-7', name: 'MetLife', logo: 'MetLife', coverage: 'Full', network: 'Nationwide' },
    { id: 'ins-8', name: 'Allianz Health', logo: 'Allianz', coverage: 'Full', network: 'International' }
  ],
  wellnessPrograms: [
    { id: "wp-1", name: "Heart Strong", description: "Daily steps and nutrition focus.", duration: "4 weeks", points: 250, enrolled: 134, icon: "heart" },
    { id: "wp-2", name: "Mindful Minutes", description: "Guided mindfulness and sleep hygiene.", duration: "3 weeks", points: 180, enrolled: 98, icon: "mind" },
    { id: "wp-3", name: "Sleep Reset", description: "Circadian rhythm and recovery.", duration: "2 weeks", points: 120, enrolled: 210, icon: "moon" },
    { id: "wp-4", name: "Metabolic Boost", description: "Nutrition + movement plan.", duration: "6 weeks", points: 300, enrolled: 88, icon: "leaf" },
    { id: "wp-5", name: "Stress Armor", description: "Breathing and resilience training.", duration: "4 weeks", points: 200, enrolled: 156, icon: "shield" }
  ],
  challenges: [
    { id: "ch-1", name: "10K Steps Challenge", description: "Walk 10K steps for 7 days.", participants: 84, reward: "300 pts", points: 50, daysLeft: 7, icon: "steps" },
    { id: "ch-2", name: "Hydration Sprint", description: "Drink 8 glasses daily.", participants: 62, reward: "150 pts", points: 30, daysLeft: 14, icon: "water" },
    { id: "ch-3", name: "Mindful Mornings", description: "10 min meditation daily.", participants: 45, reward: "120 pts", points: 20, daysLeft: 10, icon: "sunrise" },
    { id: "ch-4", name: "Sleep 7+", description: "Sleep at least 7 hours.", participants: 73, reward: "180 pts", points: 35, daysLeft: 12, icon: "sleep" },
    { id: "ch-5", name: "Sugar Cut", description: "No added sugar for 5 days.", participants: 58, reward: "160 pts", points: 30, daysLeft: 5, icon: "sugar" }
  ],
  leaderboard: [
    { id: "lb-1", rank: 1, name: "Ayesha Noor", avatar: "https://i.pravatar.cc/40?img=12", points: 5400, badges: 8, streak: 12 },
    { id: "lb-2", rank: 2, name: "Kamal Rizvi", avatar: "https://i.pravatar.cc/40?img=24", points: 4800, badges: 7, streak: 9 },
    { id: "lb-3", rank: 3, name: "Hina Sheikh", avatar: "https://i.pravatar.cc/40?img=36", points: 4300, badges: 6, streak: 8 },
    { id: "lb-4", rank: 4, name: "Samir Iqbal", avatar: "https://i.pravatar.cc/40?img=48", points: 3950, badges: 5, streak: 6 }
  ],
  researchStudies: [
    { id: "rs-1", title: "Post-Op Recovery Study", status: "Recruiting", participants: 45, target: 80 },
    { id: "rs-2", title: "Cardiac Rehab Outcomes", status: "Active", participants: 70, target: 100 },
    { id: "rs-3", title: "Sleep Optimization Trial", status: "Recruiting", participants: 22, target: 60 },
    { id: "rs-4", title: "Diabetes Lifestyle Cohort", status: "Active", participants: 58, target: 120 }
  ],
  emergencyServices: [
    { id: "es-1", name: "Ambulance", icon: "ambulance", number: "1122", responseTime: "8-12 min" },
    { id: "es-2", name: "Trauma Unit", icon: "alert", number: "021-34930051" },
    { id: "es-3", name: "ICU Beds", icon: "icu", beds: 12 }
  ],
  liveStats: {
    beds: 42,
    doctors: 18,
    erWait: 15,
    surgeries: 4,
    alerts: 2,
    patientsToday: 156,
    appointmentsToday: 89,
    labTestsCompleted: 234
  },
  insights: {
    erWaitForecast: [12, 10, 15, 18, 16, 13, 12, 14, 11, 9, 10, 12],
    bedOccupancyTrend: [60, 62, 65, 63, 67, 70, 68, 72, 75, 73, 70, 68],
    readmissionRisk: 8,
    surgeryVolume: [8, 10, 12, 9, 11, 13, 12]
  },
  patients: [
    { id: 'p-1', name: 'Hassan Ali', age: 54, gender: 'Male', condition: 'Hypertension' },
    { id: 'p-2', name: 'Sara Khan', age: 43, gender: 'Female', condition: 'Diabetes' }
  ],
  appointments: [
    { id: 'a-1', patientName: 'Hassan Ali', doctorName: 'Dr. Zara Khan', date: '2026-02-05', time: '10:00', status: 'Confirmed' },
    { id: 'a-2', patientName: 'Sara Khan', doctorName: 'Dr. Imran Noor', date: '2026-02-06', time: '11:30', status: 'Pending' }
  ],
  labResults: [
    { id: 'lr-1', testName: 'CBC', date: '2026-02-01', status: 'Reviewed' },
    { id: 'lr-2', testName: 'HbA1c', date: '2026-01-29', status: 'Ready' }
  ],
  medications: [
    { id: 'm-1', name: 'Amlodipine', dosage: '5mg', frequency: 'Daily' },
    { id: 'm-2', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' }
  ],
  equipment: [
    { id: 'eq-1', name: 'ECG Monitor', status: 'Operational', location: 'ICU' },
    { id: 'eq-2', name: 'Infusion Pump', status: 'Operational', location: 'Ward 2' }
  ],
  rooms: [
    { id: 'r-1', number: '201', type: 'Private', status: 'Available' },
    { id: 'r-2', number: '305', type: 'ICU', status: 'Occupied' }
  ],
  staff: [
    { id: 's-1', name: 'Nida Ahmed', role: 'Nurse', department: 'ICU' },
    { id: 's-2', name: 'Hamza Qureshi', role: 'Technician', department: 'Radiology' }
  ]
};

const connect = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_db';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};

const seed = async () => {
  if (reset) {
    await HomeContent.deleteMany({});
  }

  const existing = await HomeContent.countDocuments();
  if (existing === 0) {
    await HomeContent.create(CONTENT);
  }
};

connect()
  .then(seed)
  .then(() => {
    console.log('OK: Home content seed completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('ERROR: Home content seed failed:', error);
    process.exit(1);
  });



