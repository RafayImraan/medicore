const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  badge: { type: String, trim: true },
  category: { type: String, trim: true },
  available: { type: String, trim: true },
  rating: { type: Number, default: 4.5 },
  price: { type: String, trim: true },
  startingPrice: { type: Number, default: 0 },
  stats: { type: String, trim: true },
  duration: { type: String, trim: true },
  deliverables: { type: [String], default: [] },
  skillStack: { type: [String], default: [] },
  specialBadge: { type: String, trim: true },
  features: { type: [String], default: [] },
  useCases: { type: [String], default: [] },
  timeline: { type: String, trim: true },
  faq: { type: [{ q: String, a: String }], default: [] },
  portfolio: { type: [String], default: [] },
  reviews: { type: [{ name: String, rating: Number, comment: String }], default: [] },
  pricingBreakdown: { type: [{ plan: String, price: Number }], default: [] },
  techStack: { type: [String], default: [] },
  testimonials: { type: [{ text: String, author: String, video: String }], default: [] },
  caseStudies: { type: [String], default: [] },
  clientLogos: { type: [String], default: [] },
  certifications: { type: [String], default: [] },
  sla: { type: String, trim: true },
  beforeAfter: { type: { before: String, after: String }, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
