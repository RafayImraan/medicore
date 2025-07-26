const Report = require('../models/Report');

// Get report by testId
exports.getReportByTestId = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findOne({ testId: id });
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching report' });
  }
};
