const mongoose = require('mongoose');

const homeContentSchema = new mongoose.Schema({
  hero: {
    badge: String,
    title: String,
    subtitle: String,
    searchPlaceholder: String,
    primaryActionLabel: String,
    primaryActionHref: String,
    secondaryActionLabel: String,
    secondaryActionHref: String
  },
  heroMedia: {
    eyebrow: String,
    title: String,
    description: String,
    image: String,
    videoUrl: String,
    poster: String,
    ambientLabel: String,
    metrics: [{
      id: String,
      label: String,
      value: String
    }]
  },
  heroVariants: [{
    id: String,
    role: String,
    keywords: [String],
    badge: String,
    title: String,
    subtitle: String,
    primaryActionLabel: String,
    primaryActionHref: String,
    secondaryActionLabel: String,
    secondaryActionHref: String,
    priority: Number,
    enabled: { type: Boolean, default: true }
  }],
  trustSignals: [{
    id: String,
    label: String,
    value: String,
    context: String,
    enabled: { type: Boolean, default: true }
  }],
  intentPaths: [{
    id: String,
    title: String,
    description: String,
    href: String,
    metric: String,
    icon: String,
    enabled: { type: Boolean, default: true }
  }],
  audiencePaths: [{
    id: String,
    role: String,
    eyebrow: String,
    title: String,
    description: String,
    href: String,
    cta: String,
    enabled: { type: Boolean, default: true }
  }],
  symptomRouter: [{
    id: String,
    label: String,
    keywords: [String],
    title: String,
    description: String,
    href: String,
    urgency: String,
    department: String
  }],
  quickActions: [{
    id: String,
    label: String,
    description: String,
    href: String,
    icon: String,
    accent: String,
    enabled: { type: Boolean, default: true }
  }],
  operationalHighlights: [{
    id: String,
    title: String,
    value: String,
    detail: String,
    tone: String
  }],
  services: [{
    title: String,
    description: String,
    icon: String,
    features: [String],
    enabled: { type: Boolean, default: true }
  }],
  articles: [{
    id: String,
    title: String,
    excerpt: String,
    image: String,
    author: String,
    authorAvatar: String,
    readMinutes: Number,
    category: String,
    date: String,
    views: Number,
    likes: Number
  }],
  testimonials: [{
    id: String,
    name: String,
    quote: String,
    avatar: String,
    rating: Number,
    title: String,
    treatment: String,
    doctor: String,
    date: String,
    verified: Boolean,
    videoUrl: String
  }],
  insuranceProviders: [{
    id: String,
    name: String,
    logo: String,
    coverage: String,
    network: String
  }],
  wellnessPrograms: [{
    id: String,
    name: String,
    description: String,
    duration: String,
    points: Number,
    enrolled: Number,
    icon: String
  }],
  challenges: [{
    id: String,
    name: String,
    description: String,
    participants: Number,
    reward: String,
    points: Number,
    daysLeft: Number,
    icon: String
  }],
  leaderboard: [{
    id: String,
    rank: Number,
    name: String,
    avatar: String,
    points: Number,
    badges: Number,
    streak: Number
  }],
  researchStudies: [{
    id: String,
    title: String,
    status: String,
    participants: Number,
    target: Number
  }],
  carePaths: [{
    id: String,
    title: String,
    description: String,
    duration: String,
    outcome: String,
    href: String
  }],
  patientJourney: [{
    id: String,
    step: String,
    title: String,
    description: String,
    sla: String
  }],
  featuredCampaigns: [{
    id: String,
    eyebrow: String,
    title: String,
    description: String,
    metric: String,
    href: String,
    enabled: { type: Boolean, default: true }
  }],
  recommendationCards: [{
    id: String,
    audience: String,
    title: String,
    description: String,
    href: String,
    metric: String,
    tag: String,
    keywords: [String],
    scoreBoost: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true }
  }],
  urgentActions: [{
    id: String,
    title: String,
    description: String,
    href: String,
    tone: String,
    enabled: { type: Boolean, default: true }
  }],
  emergencyServices: [{
    id: String,
    name: String,
    icon: String,
    number: String,
    responseTime: String,
    units: Number,
    beds: Number
  }],
  liveStats: {
    beds: Number,
    doctors: Number,
    erWait: Number,
    surgeries: Number,
    alerts: Number,
    patientsToday: Number,
    appointmentsToday: Number,
    labTestsCompleted: Number
  },
  insights: {
    erWaitForecast: [Number],
    bedOccupancyTrend: [Number],
    readmissionRisk: Number,
    surgeryVolume: [Number]
  },
  patients: [{
    id: String,
    name: String,
    age: Number,
    gender: String,
    condition: String
  }],
  appointments: [{
    id: String,
    patientName: String,
    doctorName: String,
    date: String,
    time: String,
    status: String
  }],
  labResults: [{
    id: String,
    testName: String,
    date: String,
    status: String
  }],
  medications: [{
    id: String,
    name: String,
    dosage: String,
    frequency: String
  }],
  equipment: [{
    id: String,
    name: String,
    status: String,
    location: String
  }],
  rooms: [{
    id: String,
    number: String,
    type: { type: String },
    status: String
  }],
  staff: [{
    id: String,
    name: String,
    role: String,
    department: String
  }],
  ctaBanner: {
    eyebrow: String,
    title: String,
    description: String,
    primaryActionLabel: String,
    primaryActionHref: String,
    secondaryActionLabel: String,
    secondaryActionHref: String
  }
}, { timestamps: true });

module.exports = mongoose.model('HomeContent', homeContentSchema);
