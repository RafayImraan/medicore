const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // General Settings
  hospitalName: {
    type: String,
    default: 'Medicore Health Services',
    trim: true
  },
  hospitalAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'Pakistan'
    }
  },
  contactInfo: {
    phone: {
      type: String,
      default: '+92 21 111 911 911'
    },
    email: {
      type: String,
      default: 'info@medicore.org'
    },
    emergency: {
      type: String,
      default: '+92 21 111 786 786'
    }
  },

  // Accreditation and Certifications
  accreditations: [{
    name: String,
    issuer: String,
    validUntil: Date,
    status: {
      type: String,
      enum: ['active', 'expired', 'pending'],
      default: 'active'
    }
  }],

  // Operating Hours
  operatingHours: {
    monday: { open: { type: String, default: '09:00' }, close: { type: String, default: '17:00' } },
    tuesday: { open: { type: String, default: '09:00' }, close: { type: String, default: '17:00' } },
    wednesday: { open: { type: String, default: '09:00' }, close: { type: String, default: '17:00' } },
    thursday: { open: { type: String, default: '09:00' }, close: { type: String, default: '17:00' } },
    friday: { open: { type: String, default: '09:00' }, close: { type: String, default: '17:00' } },
    saturday: { open: { type: String, default: '09:00' }, close: { type: String, default: '14:00' } },
    sunday: { open: { type: String, default: 'Closed' }, close: { type: String, default: 'Closed' } }
  },

  // Support Settings
  supportSettings: {
    maxQueueLength: {
      type: Number,
      default: 50,
      min: 1
    },
    averageResponseTime: {
      type: Number,
      default: 5,
      min: 1
    },
    autoResponseEnabled: {
      type: Boolean,
      default: true
    },
    workingHoursOnly: {
      type: Boolean,
      default: true
    }
  },

  // Chatbot Settings
  chatbotSettings: {
    enabled: {
      type: Boolean,
      default: true
    },
    greetingMessage: {
      type: String,
      default: 'Hi! I\'m MediBot 🤖. How can I help you today?'
    },
    fallbackMessage: {
      type: String,
      default: 'I\'m processing your request. A support agent will assist you shortly.'
    },
    maxConversations: {
      type: Number,
      default: 10
    }
  },

  // Features
  features: {
    telemedicine: {
      type: Boolean,
      default: true
    },
    emergencyServices: {
      type: Boolean,
      default: true
    },
    onlineAppointments: {
      type: Boolean,
      default: true
    },
    multilingualSupport: {
      type: Boolean,
      default: true
    }
  },

  // Social Media Links
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    youtube: String
  },

  // Maintenance Mode
  maintenance: {
    enabled: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'We are currently undergoing maintenance. Please check back soon.'
    }
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.pre('save', async function(next) {
  if (this.isNew) {
    const existing = await this.constructor.findOne();
    if (existing) {
      throw new Error('Only one settings document can exist');
    }
  }
  next();
});

module.exports = mongoose.model('Settings', settingsSchema);
