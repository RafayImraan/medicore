const EmergencyHospital = require('../models/EmergencyHospital');
const EmergencyIncident = require('../models/EmergencyIncident');
const EmergencyMetric = require('../models/EmergencyMetric');
const EmergencyChecklist = require('../models/EmergencyChecklist');

const getEmergencyData = async (req, res) => {
  try {
    const [hospitals, incidents, metrics, checklists] = await Promise.all([
      EmergencyHospital.find().sort({ distanceKm: 1 }).lean(),
      EmergencyIncident.find().sort({ occurredAt: -1 }).limit(8).lean(),
      EmergencyMetric.find().sort({ createdAt: -1 }).limit(1).lean(),
      EmergencyChecklist.find().lean()
    ]);

    const metric = metrics[0] || {};
    res.json({
      hospitals,
      incidents,
      metrics: {
        erQueueWaiting: metric.erQueueWaiting || 0,
        erWaitMins: metric.erWaitMins || 0,
        erBeds: metric.erBeds || 0,
        icuBeds: metric.icuBeds || 0,
        ventilators: metric.ventilators || 0,
        isolation: metric.isolation || 0,
        workloadTrend: metric.workloadTrend || []
      },
      checklists
    });
  } catch (error) {
    console.error('Error fetching emergency data:', error);
    res.status(500).json({ error: 'Failed to load emergency data' });
  }
};

module.exports = {
  getEmergencyData
};
