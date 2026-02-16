const mongoose = require('mongoose');
const Department = require('../models/Department');
const DepartmentAnnouncement = require('../models/DepartmentAnnouncement');
const DepartmentHighlight = require('../models/DepartmentHighlight');
const DepartmentInsurance = require('../models/DepartmentInsurance');
const DepartmentSchedule = require('../models/DepartmentSchedule');
const DepartmentRecommendation = require('../models/DepartmentRecommendation');
const DepartmentReview = require('../models/DepartmentReview');
const DepartmentAnalytics = require('../models/DepartmentAnalytics');
const InsuranceView = require('../models/InsuranceView');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const mapZone = (location = '') => {
  const lower = location.toLowerCase();
  if (lower.includes('tower a')) return 'Tower A';
  if (lower.includes('tower b')) return 'Tower B';
  if (lower.includes('tower c')) return 'Tower C';
  if (lower.includes('tower d')) return 'Tower D';
  if (lower.includes("children")) return "Children's Wing";
  if (lower.includes('diagnostics')) return 'Diagnostics';
  if (lower.includes('surgical')) return 'Surgical Block';
  return 'Central';
};

exports.getAnnouncements = async (req, res) => {
  try {
    const now = new Date();
    const items = await DepartmentAnnouncement.find({
      $and: [
        { $or: [{ startAt: null }, { startAt: { $lte: now } }] },
        { $or: [{ endAt: null }, { endAt: { $gte: now } }] }
      ]
    }).sort({ priority: -1, startAt: -1 }).limit(12).lean();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load announcements' });
  }
};

exports.getHighlights = async (req, res) => {
  try {
    const items = await DepartmentHighlight.find().sort({ createdAt: -1 }).limit(30).lean();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load highlights' });
  }
};

exports.getInsurers = async (req, res) => {
  try {
    const departmentId = req.query.departmentId;
    const filter = departmentId && isValidObjectId(departmentId) ? { departmentId } : {};
    const items = await DepartmentInsurance.find(filter).sort({ name: 1 }).limit(300).lean();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load insurers' });
  }
};

exports.getSchedules = async (req, res) => {
  try {
    const departmentId = req.query.departmentId;
    const filter = departmentId && isValidObjectId(departmentId) ? { departmentId } : {};
    const items = await DepartmentSchedule.find(filter).lean();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load schedules' });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const top = await DepartmentAnalytics.find()
      .sort({ views: -1 })
      .limit(8)
      .populate('departmentId', 'name slug category rating waitMins location')
      .lean();

    if (top.length > 0) {
      const mapped = top.map((row, index) => ({
        id: row._id,
        departmentId: row.departmentId?._id,
        title: `${row.departmentId?.name || 'Department'} Priority Access`,
        reason: row.departmentId
          ? `High demand with ${row.departmentId.waitMins || 12} min average waits.`
          : 'High demand across the hospital network.',
        score: Math.max(60, 95 - index * 3),
        tags: ['concierge', row.departmentId?.category || 'premium']
      }));
      res.json(mapped);
      return;
    }

    const fallback = await Department.find().sort({ rating: -1 }).limit(8).lean();
    res.json(fallback.map((dept, index) => ({
      id: dept._id,
      departmentId: dept._id,
      title: `${dept.name} Concierge Track`,
      reason: `Top-rated care with ${dept.reviews || 0} reviews.`,
      score: 90 - index * 2,
      tags: ['featured']
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load recommendations' });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const departmentId = req.query.departmentId;
    const filter = departmentId && isValidObjectId(departmentId) ? { departmentId } : {};
    const items = await DepartmentReview.find(filter).sort({ createdAt: -1 }).limit(200).lean();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load reviews' });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { departmentId, name, rating, comment } = req.body || {};
    if (!departmentId || !isValidObjectId(departmentId)) {
      return res.status(400).json({ error: 'Invalid departmentId' });
    }
    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment are required' });
    }

    const review = await DepartmentReview.create({
      departmentId,
      name: name || 'Anonymous',
      rating,
      comment
    });

    const department = await Department.findById(departmentId);
    let updatedDepartment = null;
    if (department) {
      const count = department.reviews || 0;
      const currentRating = department.rating || 0;
      const newCount = count + 1;
      const newRating = Number(((currentRating * count + rating) / newCount).toFixed(1));
      department.reviews = newCount;
      department.rating = newRating;
      await department.save();
      updatedDepartment = { id: department._id, rating: newRating, reviews: newCount };
    }

    res.json({ review, department: updatedDepartment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save review' });
  }
};

exports.logInsuranceView = async (req, res) => {
  try {
    const { insuranceId, name, network, coverage, departmentId } = req.body || {};
    await InsuranceView.create({
      userId: req.user?._id || null,
      insuranceId,
      name,
      network,
      coverage,
      departmentId: isValidObjectId(departmentId) ? departmentId : null,
      source: 'departments'
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log insurance view' });
  }
};

exports.getHeatmap = async (req, res) => {
  try {
    const departments = await Department.find().lean();
    const zones = {};

    departments.forEach((dept) => {
      const zone = mapZone(dept.location);
      if (!zones[zone]) {
        zones[zone] = { zone, count: 0, occupancy: 0, wait: 0 };
      }
      zones[zone].count += 1;
      zones[zone].occupancy += dept.occupancy || 0;
      zones[zone].wait += dept.waitMins || 0;
    });

    const result = Object.values(zones).map((z) => ({
      zone: z.zone,
      count: z.count,
      occupancy: z.count ? Number((z.occupancy / z.count).toFixed(2)) : 0,
      wait: z.count ? Math.round(z.wait / z.count) : 0
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load heatmap' });
  }
};
