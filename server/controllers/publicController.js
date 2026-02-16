const Department = require('../models/Department');
const PharmacyItem = require('../models/PharmacyItem');
const Doctor = require('../models/Doctor');

const analyticsSeries = (ratingCount = 0) => Array.from({ length: 12 }).map((_, i) => ({
  x: `P${i + 1}`,
  v: Math.max(1, Math.round((ratingCount || 12) / (i + 1)))
}));

const buildSlots = (availability = []) => {
  const days = 7;
  const result = [];
  const dayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
  };

  for (let i = 0; i < days; i += 1) {
    const base = new Date();
    base.setDate(base.getDate() + i);
    const dayName = Object.keys(dayMap).find(key => dayMap[key] === base.getDay());
    const dayAvailability = availability.find(a => a.day === dayName);

    if (!dayAvailability?.startTime || !dayAvailability?.endTime) {
      result.push({ date: base.toISOString().split('T')[0], times: [] });
      continue;
    }

    const [startH] = dayAvailability.startTime.split(':');
    const [endH] = dayAvailability.endTime.split(':');
    const startHour = parseInt(startH, 10) || 9;
    const endHour = parseInt(endH, 10) || 17;
    const times = [];

    for (let hour = startHour; hour < endHour; hour += 1) {
      times.push(`${base.toISOString().split('T')[0]}T${String(hour).padStart(2, '0')}:00`);
    }

    result.push({
      date: base.toISOString().split('T')[0],
      times
    });
  }

  return result;
};

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 }).lean();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load departments' });
  }
};

exports.getPharmacyItems = async (req, res) => {
  try {
    const items = await PharmacyItem.find().sort({ name: 1 }).lean();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load pharmacy items' });
  }
};

exports.getDoctorsDirectory = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('userId', 'name email').lean();

    const directory = doctors.map((doc, index) => {
      const name = doc.userId?.name || 'Doctor';
      const rating = doc.rating?.average || 0;
      const reviewCount = doc.rating?.count || 0;
      const reviews = [];

      return {
        id: doc._id.toString(),
        name: `Dr. ${name}`,
        specialization: doc.specialization,
        experience: doc.experience || 0,
        rating: +rating.toFixed(1),
        reviews,
        available: Array.isArray(doc.availability) && doc.availability.length > 0,
        languages: doc.languages?.length ? doc.languages : ['English'],
        fees: doc.consultationFee || 0,
        intro: doc.specialization ? `${doc.specialization} specialist with ${doc.experience || 0} years of experience.` : 'Specialist on staff.',
        badges: doc.featured ? ['Top Doctor', 'Verified'] : [],
        slots: buildSlots(doc.availability),
        analytics: analyticsSeries(reviewCount),
        bio: doc.specialization ? `${doc.specialization} specialist focused on patient-centered care.` : '',
        phone: ''
      };
    });

    res.json(directory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load doctors directory' });
  }
};
