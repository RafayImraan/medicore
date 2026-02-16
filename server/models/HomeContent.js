const mongoose = require('mongoose');

const homeContentSchema = new mongoose.Schema({
  services: [{
    title: String,
    description: String,
    icon: String,
    features: [String]
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
  }]
}, { timestamps: true });

module.exports = mongoose.model('HomeContent', homeContentSchema);
