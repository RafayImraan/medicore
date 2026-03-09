const mongoose = require('mongoose');
const HomeContent = require('./models/HomeContent');

const reset = process.argv.includes('--reset');

const CONTENT = {
  hero: {
    badge: 'Medicore Hospital Management System',
    title: 'Integrated hospital management for patients, clinicians, and operations.',
    subtitle:
      'Medicore connects appointments, departments, diagnostics, emergency response, and follow-up care in one hospital management platform.',
    searchPlaceholder: 'Search specialties, symptoms, doctors, and services',
    primaryActionLabel: 'Book Appointment',
    primaryActionHref: '/book-appointment',
    secondaryActionLabel: 'Find a Specialist',
    secondaryActionHref: '/doctors'
  },
  heroMedia: {
    eyebrow: 'Hospital system overview',
    title: 'A unified digital front door for hospital services and care coordination',
    description: 'Medicore presents hospital access, care pathways, and operational readiness through one structured interface.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1400&h=1000&fit=crop',
    videoUrl: '',
    poster: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1400&h=1000&fit=crop',
    ambientLabel: 'Executive care suite',
    metrics: [
      { id: 'hm-1', label: 'Rapid consult release', value: '24 min' },
      { id: 'hm-2', label: 'Premium recovery plans', value: '31 active' },
      { id: 'hm-3', label: 'Network coverage', value: '24 insurers' }
    ]
  },
  heroVariants: [
    {
      id: 'hv-1',
      role: 'guest',
      keywords: ['specialist', 'doctor', 'care', 'hospital', 'appointment'],
      badge: 'Designed for patient access and discovery',
      title: 'Choose the right care path with clarity, speed, and clinical confidence.',
      subtitle: 'Discover departments, compare specialists, and move into booking or support without losing context.',
      primaryActionLabel: 'Find a Specialist',
      primaryActionHref: '/doctors',
      secondaryActionLabel: 'Browse Departments',
      secondaryActionHref: '/departments',
      priority: 20,
      enabled: true
    },
    {
      id: 'hv-2',
      role: 'patient',
      keywords: ['lab', 'report', 'follow', 'prescription', 'recovery'],
      badge: 'Returning patient pathway',
      title: 'Continue your care journey without repeating the process.',
      subtitle: 'Move from follow-up to labs, medication, and recovery planning through one coordinated patient flow.',
      primaryActionLabel: 'Open Patient Dashboard',
      primaryActionHref: '/dashboard/patient',
      secondaryActionLabel: 'Check Lab Results',
      secondaryActionHref: '/dashboard/patient/lab-results',
      priority: 30,
      enabled: true
    },
    {
      id: 'hv-3',
      role: 'doctor',
      keywords: ['schedule', 'patient', 'clinical', 'roster', 'lab'],
      badge: 'Clinical workspace entrance',
      title: 'See today\'s patient load, lab flow, and clinical actions immediately.',
      subtitle: 'Give doctors a focused operational view instead of routing them through a generic public landing page.',
      primaryActionLabel: 'Open Doctor Dashboard',
      primaryActionHref: '/dashboard/doctor',
      secondaryActionLabel: 'Review Schedule',
      secondaryActionHref: '/dashboard/schedule',
      priority: 35,
      enabled: true
    },
    {
      id: 'hv-4',
      role: 'admin',
      keywords: ['analytics', 'revenue', 'operations', 'staffing', 'capacity'],
      badge: 'Administrative operations access',
      title: 'Move from the public system overview into hospital operations and oversight.',
      subtitle: 'For administrators, the homepage connects demand, staffing, revenue, and system health in one route.',
      primaryActionLabel: 'Open Admin Dashboard',
      primaryActionHref: '/dashboard/admin',
      secondaryActionLabel: 'Manage Homepage',
      secondaryActionHref: '/dashboard/admin',
      priority: 40,
      enabled: true
    }
  ],
  trustSignals: [
    { id: 'ts-1', label: 'Patient satisfaction', value: '98.2%', context: 'measured across discharge surveys', enabled: true },
    { id: 'ts-2', label: 'Specialists on roster', value: '64', context: 'across critical and elective care', enabled: true },
    { id: 'ts-3', label: 'Same-day appointments', value: '186', context: 'released across the network today', enabled: true },
    { id: 'ts-4', label: 'Insurance partners', value: '24', context: 'including corporate and family plans', enabled: true }
  ],
  intentPaths: [
    { id: 'ip-1', title: 'Need urgent help', description: 'Immediate routing to ER, trauma, and ambulance coordination.', href: '/emergency', metric: 'Response in 8-12 min', icon: 'alert', enabled: true },
    { id: 'ip-2', title: 'Book a specialist', description: 'Compare doctors, fees, ratings, and next available slots.', href: '/doctors', metric: '64 specialists available', icon: 'stethoscope', enabled: true },
    { id: 'ip-3', title: 'Arrange diagnostics', description: 'Secure imaging, pathology, and preventive screening quickly.', href: '/services', metric: '234 tests completed today', icon: 'activity', enabled: true },
    { id: 'ip-4', title: 'Recover at home', description: 'Transition safely with nursing, therapy, and post-op plans.', href: '/home-healthcare', metric: '6 home-care teams active', icon: 'shield', enabled: true }
  ],
  audiencePaths: [
    { id: 'ap-1', role: 'guest', eyebrow: 'First visit', title: 'Start with a clear care path', description: 'Find a doctor, compare departments, and book with minimal friction.', href: '/doctors', cta: 'Explore care options', enabled: true },
    { id: 'ap-2', role: 'patient', eyebrow: 'Returning patient', title: 'Continue your care journey', description: 'Jump back into labs, follow-ups, prescriptions, and upcoming appointments.', href: '/dashboard/patient', cta: 'Open patient dashboard', enabled: true },
    { id: 'ap-3', role: 'doctor', eyebrow: 'Clinical workspace', title: 'Review today\'s patient load', description: 'Move straight into schedule, labs, and clinical coordination tools.', href: '/dashboard/doctor', cta: 'Open doctor dashboard', enabled: true },
    { id: 'ap-4', role: 'admin', eyebrow: 'Operations control', title: 'Monitor system health and throughput', description: 'Go directly to executive oversight, staffing, and financial analytics.', href: '/dashboard/admin', cta: 'Open admin dashboard', enabled: true }
  ],
  symptomRouter: [
    { id: 'sr-1', label: 'Chest pain', keywords: ['chest pain', 'heart pain', 'palpitations', 'tightness'], title: 'Escalate to emergency cardiac review', description: 'This symptom set should prioritize ER and cardiac response flow.', href: '/emergency', urgency: 'high', department: 'Cardiology' },
    { id: 'sr-2', label: 'Headache or dizziness', keywords: ['headache', 'dizzy', 'dizziness', 'migraine', 'vertigo'], title: 'Route to neurology or urgent evaluation', description: 'Persistent neurological symptoms should be assessed quickly.', href: '/departments', urgency: 'medium', department: 'Neurology' },
    { id: 'sr-3', label: 'Fever and cough', keywords: ['fever', 'cough', 'flu', 'infection', 'cold'], title: 'Start with general medicine and diagnostics', description: 'Use virtual triage or internal medicine depending on severity.', href: '/services', urgency: 'medium', department: 'General Medicine' },
    { id: 'sr-4', label: 'Joint pain or injury', keywords: ['joint pain', 'knee pain', 'back pain', 'fracture', 'injury'], title: 'Open orthopedic evaluation', description: 'Orthopedic and mobility pathways are usually the best next step.', href: '/departments', urgency: 'low', department: 'Orthopedics' },
    { id: 'sr-5', label: 'Recovery at home', keywords: ['post surgery', 'recovery', 'home nurse', 'wound care', 'physio'], title: 'Transition into home healthcare', description: 'Best suited for post-op monitoring, therapy, and nurse visits.', href: '/home-healthcare', urgency: 'low', department: 'Home Healthcare' }
  ],
  quickActions: [
    { id: 'qa-1', label: 'Check ER status', description: 'Current emergency wait and trauma readiness.', href: '/emergency', icon: 'clock', accent: 'red', enabled: true },
    { id: 'qa-2', label: 'Browse departments', description: 'Explore live departments, timings, and doctors.', href: '/departments', icon: 'building', accent: 'blue', enabled: true },
    { id: 'qa-3', label: 'Start teleconsult', description: 'Route to video-friendly specialists and virtual care.', href: '/services', icon: 'video', accent: 'emerald', enabled: true },
    { id: 'qa-4', label: 'Talk to support', description: 'Get help with bookings, departments, and insurance guidance.', href: '/contact', icon: 'phone', accent: 'amber', enabled: true }
  ],
  operationalHighlights: [
    { id: 'oh-1', title: 'Triage throughput', value: '32 patients/hr', detail: 'above target across ER and urgent care', tone: 'emerald' },
    { id: 'oh-2', title: 'Imaging turnaround', value: '18 min', detail: 'median radiology report release time', tone: 'cyan' },
    { id: 'oh-3', title: 'Critical beds open', value: '12 beds', detail: 'ICU and HDU capacity visible in real time', tone: 'amber' }
  ],
  services: [
    { title: 'Cardiology', description: 'Advanced heart care with diagnostics, intervention, and monitored recovery.', icon: 'heart', features: ['Echo and ECG', 'Interventional procedures', 'Rehab pathways'], enabled: true },
    { title: 'Neurology', description: 'Stroke, seizure, and complex neuro consult pathways with fast escalation.', icon: 'activity', features: ['EEG diagnostics', 'Stroke response', 'Movement clinic'], enabled: true },
    { title: 'Pediatrics', description: 'Family-centered pediatric care with vaccination and urgent review slots.', icon: 'users', features: ['Wellness visits', 'Neonatal support', 'Vaccination plans'], enabled: true },
    { title: 'Orthopedics', description: 'Mobility and surgical recovery programs from diagnosis through rehab.', icon: 'stethoscope', features: ['Joint replacement', 'Sports injury care', 'Physio coordination'], enabled: true },
    { title: 'Executive Health', description: 'Structured assessments for leaders, professionals, and corporate teams.', icon: 'shield', features: ['Same-day screening', 'Priority scheduling', 'Risk reporting'], enabled: true },
    { title: 'Home Healthcare', description: 'Structured home nursing and therapy for safer post-discharge recovery.', icon: 'heart', features: ['Nursing visits', 'Post-op care', 'Vitals monitoring'], enabled: true }
  ],
  carePaths: [
    { id: 'cp-1', title: 'Emergency to ICU', description: 'Arrival, triage, imaging, intervention, and monitored bed placement.', duration: '0-90 min', outcome: 'Critical treatment started faster', href: '/emergency' },
    { id: 'cp-2', title: 'Specialist to Procedure', description: 'Consultation, diagnostics, procedure booking, and payment readiness.', duration: '24-72 hrs', outcome: 'Reduced patient drop-off', href: '/book-appointment' },
    { id: 'cp-3', title: 'Discharge to Home Recovery', description: 'Medication, nurse scheduling, therapy cadence, and family guidance.', duration: '7-30 days', outcome: 'Smoother post-op recovery', href: '/home-healthcare' }
  ],
  patientJourney: [
    { id: 'pj-1', step: '01', title: 'Triage the need', description: 'Urgent, elective, preventive, or recovery workflows route users immediately.', sla: 'Under 30 seconds' },
    { id: 'pj-2', step: '02', title: 'Match the right clinician', description: 'Specialty, language, availability, and fee fit are surfaced clearly.', sla: 'Real-time availability' },
    { id: 'pj-3', step: '03', title: 'Confirm tests and coverage', description: 'Diagnostics, insurance, and support are visible before booking decisions.', sla: 'Coverage shown upfront' },
    { id: 'pj-4', step: '04', title: 'Continue after the visit', description: 'Labs, medication, and home-care follow-through stay connected.', sla: 'Unified follow-up' }
  ],
  featuredCampaigns: [
    { id: 'fc-1', eyebrow: 'Seasonal program', title: 'Cardiac screening week', description: 'Priority heart screening appointments for patients who need early risk detection and follow-up planning.', metric: '48 slots left this week', href: '/services', enabled: true },
    { id: 'fc-2', eyebrow: 'Preventive care', title: 'Women wellness diagnostics program', description: 'Combined imaging, lab work, specialist consultation, and reporting in one structured pathway.', metric: '92% completion rate', href: '/services', enabled: true },
    { id: 'fc-3', eyebrow: 'Recovery support', title: 'Post-surgical home recovery program', description: 'Nursing visits, mobility tracking, and medication support for patients recovering at home.', metric: '31 active enrollments', href: '/home-healthcare', enabled: true }
  ],
  recommendationCards: [
    { id: 'rc-1', audience: 'guest', title: 'Compare specialists by availability', description: 'Ideal for visitors deciding between doctors, fees, and language fit.', href: '/doctors', metric: '64 specialists live', tag: 'Discovery', keywords: ['doctor', 'specialist', 'consultation'], scoreBoost: 10, enabled: true },
    { id: 'rc-2', audience: 'patient', title: 'Check follow-up and recovery flow', description: 'Resume labs, billing, appointments, and medication coordination.', href: '/dashboard/patient', metric: 'Unified patient view', tag: 'Continuity', keywords: ['lab', 'report', 'recovery', 'follow'], scoreBoost: 12, enabled: true },
    { id: 'rc-3', audience: 'doctor', title: 'Open lab and roster workspace', description: 'Best entry point for today\'s clinical coordination workload.', href: '/dashboard/doctor', metric: 'Realtime clinical ops', tag: 'Operations', keywords: ['schedule', 'patient', 'roster', 'clinical'], scoreBoost: 14, enabled: true },
    { id: 'rc-4', audience: 'admin', title: 'Review executive system health', description: 'Track demand, staffing, capacity, and financial movement.', href: '/dashboard/admin', metric: 'Executive visibility', tag: 'Oversight', keywords: ['analytics', 'operations', 'revenue', 'capacity'], scoreBoost: 16, enabled: true }
  ],
  urgentActions: [
    { id: 'ua-1', title: 'Emergency line', description: 'Ambulance dispatch, trauma bay, and ICU coordination.', href: '/emergency', tone: 'red', enabled: true },
    { id: 'ua-2', title: 'Find next available doctor', description: 'See specialists with near-term slots and booking-ready profiles.', href: '/doctors', tone: 'blue', enabled: true },
    { id: 'ua-3', title: 'Insurance and billing help', description: 'Support for network coverage, claims, and corporate plans.', href: '/contact', tone: 'amber', enabled: true }
  ],
  articles: [
    { id: 'art-1', title: 'Heart health basics for busy professionals', excerpt: 'A practical way to reduce risk without disrupting your routine.', image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=800&h=500&fit=crop', author: 'Medicore Team', authorAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop', readMinutes: 5, category: 'Cardiology', date: '2026-01-05', views: 1540, likes: 230 },
    { id: 'art-2', title: 'Managing stress before it impacts recovery', excerpt: 'The early signs of overload and what to do before it compounds.', image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&h=500&fit=crop', author: 'Wellness Desk', authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', readMinutes: 6, category: 'Wellness', date: '2026-01-12', views: 980, likes: 190 },
    { id: 'art-3', title: 'Diabetes care beyond the prescription', excerpt: 'How monitoring, diet, and follow-up change long-term outcomes.', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&h=500&fit=crop', author: 'Care Team', authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop', readMinutes: 7, category: 'Endocrinology', date: '2026-01-18', views: 1120, likes: 210 },
    { id: 'art-4', title: 'What patients expect from a modern hospital system', excerpt: 'Coordination, clarity, and fast escalation matter more than presentation alone.', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=500&fit=crop', author: 'Patient Experience Lab', authorAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop', readMinutes: 4, category: 'Operations', date: '2026-01-23', views: 1760, likes: 260 }
  ],
  testimonials: [
    { id: 't-1', name: 'Areesha Malik', quote: 'We got from specialist selection to procedure booking in one smooth flow.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', rating: 5, title: 'Patient Family', treatment: 'Cardiac Procedure', doctor: 'Dr. Sarah Johnson', date: '2026-01-20', verified: true, videoUrl: '' },
    { id: 't-2', name: 'Michael Chen', quote: 'The telehealth and in-person journey felt like one connected system.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop', rating: 5, title: 'Corporate Client', treatment: 'Executive Health', doctor: 'Dr. Zara Khan', date: '2026-01-22', verified: true, videoUrl: '' },
    { id: 't-3', name: 'Ariana Blake', quote: 'Post-operative recovery at home was coordinated better than expected.', avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200&fit=crop', rating: 5, title: 'Surgical Recovery Patient', treatment: 'Home Recovery', doctor: 'Dr. Amir Qureshi', date: '2026-01-29', verified: true, videoUrl: '' }
  ],
  insuranceProviders: [
    { id: 'ins-1', name: 'Blue Cross Blue Shield', logo: 'BCBS', coverage: 'Full', network: 'Nationwide' },
    { id: 'ins-2', name: 'UnitedHealthcare', logo: 'UHC', coverage: 'Partial', network: 'Regional' },
    { id: 'ins-3', name: 'Aetna', logo: 'Aetna', coverage: 'Full', network: 'Nationwide' },
    { id: 'ins-4', name: 'Cigna', logo: 'Cigna', coverage: 'Partial', network: 'Regional' },
    { id: 'ins-5', name: 'MetLife', logo: 'MetLife', coverage: 'Full', network: 'Nationwide' },
    { id: 'ins-6', name: 'Allianz Health', logo: 'Allianz', coverage: 'Full', network: 'International' }
  ],
  wellnessPrograms: [
    { id: 'wp-1', name: 'Heart Strong', description: 'Daily steps and nutrition focus.', duration: '4 weeks', points: 250, enrolled: 134, icon: 'heart' },
    { id: 'wp-2', name: 'Mindful Minutes', description: 'Guided mindfulness and sleep hygiene.', duration: '3 weeks', points: 180, enrolled: 98, icon: 'mind' },
    { id: 'wp-3', name: 'Sleep Reset', description: 'Circadian rhythm and recovery.', duration: '2 weeks', points: 120, enrolled: 210, icon: 'moon' }
  ],
  challenges: [
    { id: 'ch-1', name: '10K Steps Challenge', description: 'Walk 10K steps for 7 days.', participants: 84, reward: '300 pts', points: 50, daysLeft: 7, icon: 'steps' },
    { id: 'ch-2', name: 'Hydration Sprint', description: 'Drink 8 glasses daily.', participants: 62, reward: '150 pts', points: 30, daysLeft: 14, icon: 'water' }
  ],
  leaderboard: [
    { id: 'lb-1', rank: 1, name: 'Ayesha Noor', avatar: 'https://i.pravatar.cc/40?img=12', points: 5400, badges: 8, streak: 12 },
    { id: 'lb-2', rank: 2, name: 'Kamal Rizvi', avatar: 'https://i.pravatar.cc/40?img=24', points: 4800, badges: 7, streak: 9 },
    { id: 'lb-3', rank: 3, name: 'Hina Sheikh', avatar: 'https://i.pravatar.cc/40?img=36', points: 4300, badges: 6, streak: 8 }
  ],
  researchStudies: [
    { id: 'rs-1', title: 'Post-op recovery study', status: 'Recruiting', participants: 45, target: 80 },
    { id: 'rs-2', title: 'Cardiac rehab outcomes', status: 'Active', participants: 70, target: 100 },
    { id: 'rs-3', title: 'Sleep optimization trial', status: 'Recruiting', participants: 22, target: 60 }
  ],
  emergencyServices: [
    { id: 'es-1', name: 'Ambulance Dispatch', icon: 'ambulance', number: '1122', responseTime: '8-12 min', units: 6 },
    { id: 'es-2', name: 'Trauma Unit', icon: 'alert', number: '021-34930051', responseTime: 'Immediate triage', units: 2 },
    { id: 'es-3', name: 'ICU Capacity', icon: 'icu', number: '12 beds open', responseTime: 'Live monitored', beds: 12 }
  ],
  liveStats: {
    beds: 42,
    doctors: 64,
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
  ],
  ctaBanner: {
    eyebrow: 'Need a guided next step?',
    title: 'Move from search to care without losing context.',
    description: 'Our booking, support, and recovery teams are coordinated around one patient record and one operational flow.',
    primaryActionLabel: 'Start booking',
    primaryActionHref: '/book-appointment',
    secondaryActionLabel: 'Talk to support',
    secondaryActionHref: '/contact'
  }
};

const connect = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_db';
  await mongoose.connect(uri);
};

const seed = async () => {
  if (reset) {
    await HomeContent.deleteMany({});
  }

  const existing = await HomeContent.findOne().sort({ createdAt: -1 });

  if (!existing) {
    await HomeContent.create(CONTENT);
    return;
  }

  Object.assign(existing, CONTENT);
  await existing.save();
};

const run = async () => {
  await connect();
  await seed();
  await mongoose.disconnect();
  console.log('OK: Home content seed completed');
};

if (require.main === module) {
  run().catch(async (error) => {
    console.error('ERROR: Home content seed failed:', error);
    try {
      await mongoose.disconnect();
    } catch {}
    process.exit(1);
  });
}

module.exports = { CONTENT, connect, seed, run };
