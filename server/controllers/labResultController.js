const LabResult = require('../models/LabResult');
const Patient = require('../models/Patient');

const buildDateFilter = (dateFrom, dateTo) => {
  if (!dateFrom && !dateTo) return null;
  const dateFilter = {};
  if (dateFrom) {
    const from = new Date(dateFrom);
    if (!isNaN(from.getTime())) {
      dateFilter.$gte = from;
    }
  }
  if (dateTo) {
    const to = new Date(dateTo);
    if (!isNaN(to.getTime())) {
      dateFilter.$lte = to;
    }
  }
  return Object.keys(dateFilter).length ? dateFilter : null;
};

exports.getLabResults = async (req, res) => {
  try {
    const {
      test,
      status,
      doctor,
      severity,
      language,
      dateFrom,
      dateTo,
      patientId,
      userId,
      page = 1,
      limit = 100
    } = req.query;

    const query = {};

    if (test && test !== 'All') query.testName = test;
    if (status && status !== 'All') query.status = status;
    if (doctor && doctor !== 'All') query.doctorName = doctor;
    if (severity && severity !== 'All') query.severity = severity;
    if (language && language !== 'All') query.language = language;

    const dateFilter = buildDateFilter(dateFrom, dateTo);
    if (dateFilter) query.date = dateFilter;

    if (patientId) {
      query.patientId = patientId;
    } else if (userId) {
      const patient = await Patient.findOne({ userId });
      if (!patient) {
        return res.json([]);
      }
      query.patientId = patient._id;
    }

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 500);
    const skip = (pageNumber - 1) * limitNumber;

    const [items, total] = await Promise.all([
      LabResult.find(query).sort({ date: -1, createdAt: -1 }).skip(skip).limit(limitNumber),
      LabResult.countDocuments(query)
    ]);

    res.json({
      items,
      total,
      page: pageNumber,
      limit: limitNumber
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLabResultStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Ready', 'Pending', 'Reviewed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updated = await LabResult.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Lab result not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
