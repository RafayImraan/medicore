const Service = require('../models/Service');
const ServiceAnalytics = require('../models/ServiceAnalytics');

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json(service);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getServiceAnalytics = async (req, res) => {
  try {
    const analytics = await ServiceAnalytics.findOne({ serviceId: req.params.id });
    res.json(analytics || { views: 0, compares: 0, bookings: 0 });
  } catch (error) {
    console.error('Get service analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
