const Settings = require('../models/Settings');

// Get all settings
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      // Create default settings if none exist
      settings = new Settings({
        hospitalName: 'Medicore Health Services',
        hospitalAddress: {
          street: 'Stadium Road',
          city: 'Karachi',
          state: 'Sindh',
          zipCode: '74800',
          country: 'Pakistan'
        },
        contactInfo: {
          phone: '+92 21 111 911 911',
          email: 'info@medicore.org',
          emergency: '+92 21 111 786 786'
        },
        accreditations: [
          {
            name: 'Joint Commission International',
            issuer: 'JCI',
            status: 'active'
          }
        ],
        supportSettings: {
          maxQueueLength: 50,
          averageResponseTime: 5,
          autoResponseEnabled: true,
          workingHoursOnly: true
        },
        chatbotSettings: {
          enabled: true,
          greetingMessage: 'Hi! I\'m MediBot 🤖. How can I help you today?',
          fallbackMessage: 'I\'m processing your request. A support agent will assist you shortly.',
          maxConversations: 10
        },
        features: {
          telemedicine: true,
          emergencyServices: true,
          onlineAppointments: true,
          multilingualSupport: true
        }
      });
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    // Fallback settings
    res.json({
      hospitalName: 'Medicore Health Services',
      hospitalAddress: {
        street: 'Stadium Road',
        city: 'Karachi',
        state: 'Sindh',
        zipCode: '74800',
        country: 'Pakistan'
      },
      contactInfo: {
        phone: '+92 21 111 911 911',
        email: 'info@medicore.org',
        emergency: '+92 21 111 786 786'
      },
      accreditations: [
        {
          name: 'Joint Commission International',
          issuer: 'JCI',
          status: 'active'
        }
      ],
      operatingHours: {
        monday: { open: '09:00', close: '17:00' },
        tuesday: { open: '09:00', close: '17:00' },
        wednesday: { open: '09:00', close: '17:00' },
        thursday: { open: '09:00', close: '17:00' },
        friday: { open: '09:00', close: '17:00' },
        saturday: { open: '09:00', close: '14:00' },
        sunday: { open: 'Closed', close: 'Closed' }
      },
      supportSettings: {
        maxQueueLength: 50,
        averageResponseTime: 5,
        autoResponseEnabled: true,
        workingHoursOnly: true
      },
      chatbotSettings: {
        enabled: true,
        greetingMessage: 'Hi! I\'m MediBot 🤖. How can I help you today?',
        fallbackMessage: 'I\'m processing your request. A support agent will assist you shortly.',
        maxConversations: 10
      },
      features: {
        telemedicine: true,
        emergencyServices: true,
        onlineAppointments: true,
        multilingualSupport: true
      }
    });
  }
};

// Update settings (admin only)
const updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings(updates);
    } else {
      Object.assign(settings, updates);
    }

    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get public settings (no sensitive data)
const getPublicSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();

    if (!settings) {
      return res.json({
        hospitalName: 'Medicore Health Services',
        contactInfo: {
          phone: '+92 21 111 911 911',
          email: 'info@medicore.org'
        },
        operatingHours: {
          monday: { open: '09:00', close: '17:00' },
          tuesday: { open: '09:00', close: '17:00' },
          wednesday: { open: '09:00', close: '17:00' },
          thursday: { open: '09:00', close: '17:00' },
          friday: { open: '09:00', close: '17:00' },
          saturday: { open: '09:00', close: '14:00' },
          sunday: { open: 'Closed', close: 'Closed' }
        },
        features: {
          telemedicine: true,
          emergencyServices: true,
          onlineAppointments: true,
          multilingualSupport: true
        }
      });
    }

    // Return only public data
    res.json({
      hospitalName: settings.hospitalName,
      contactInfo: settings.contactInfo,
      operatingHours: settings.operatingHours,
      features: settings.features,
      accreditations: settings.accreditations
    });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get accreditations
const getAccreditations = async (req, res) => {
  try {
    const settings = await Settings.findOne();

    if (!settings) {
      return res.json([
        {
          name: 'Joint Commission International',
          issuer: 'JCI',
          status: 'active'
        }
      ]);
    }

    res.json(settings.accreditations || []);
  } catch (error) {
    console.error('Error fetching accreditations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  getPublicSettings,
  getAccreditations
};
