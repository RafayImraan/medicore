const FavoriteDoctor = require('../models/FavoriteDoctor');
const ArticleRead = require('../models/ArticleRead');
const WellnessEnrollment = require('../models/WellnessEnrollment');
const ChallengeJoin = require('../models/ChallengeJoin');
const MedicationRefillRequest = require('../models/MedicationRefillRequest');
const MoodLog = require('../models/MoodLog');
const SymptomCheck = require('../models/SymptomCheck');
const ReminderLog = require('../models/ReminderLog');
const InsuranceView = require('../models/InsuranceView');

const getUserId = (req) => req.user?._id || null;

const createWithKey = (Model, key) => async (req, res) => {
  try {
    const payload = { ...req.body, userId: getUserId(req) };
    const doc = await Model.create(payload);
    if (global.io && key) {
      global.io.emit('engagementUpdate', { key, delta: 1 });
    }
    res.json(doc);
  } catch (error) {
    console.error('Engagement create error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createFavoriteDoctor = createWithKey(FavoriteDoctor, 'favorites');
exports.createArticleRead = createWithKey(ArticleRead, 'articleReads');
exports.createWellnessEnrollment = createWithKey(WellnessEnrollment, 'wellnessEnrollments');
exports.createChallengeJoin = createWithKey(ChallengeJoin, 'challengeJoins');
exports.createMedicationRefill = createWithKey(MedicationRefillRequest, 'medicationRefills');
exports.createMoodLog = createWithKey(MoodLog, 'moodLogs');
exports.createSymptomCheck = createWithKey(SymptomCheck, 'symptomChecks');
exports.createReminderLog = createWithKey(ReminderLog, 'reminderLogs');
exports.createInsuranceView = createWithKey(InsuranceView, 'insuranceViews');

exports.getEngagementStats = async (req, res) => {
  try {
    const [
      favorites,
      articleReads,
      wellnessEnrollments,
      challengeJoins,
      medicationRefills,
      moodLogs,
      symptomChecks,
      reminderLogs,
      insuranceViews
    ] = await Promise.all([
      FavoriteDoctor.countDocuments(),
      ArticleRead.countDocuments(),
      WellnessEnrollment.countDocuments(),
      ChallengeJoin.countDocuments(),
      MedicationRefillRequest.countDocuments(),
      MoodLog.countDocuments(),
      SymptomCheck.countDocuments(),
      ReminderLog.countDocuments(),
      InsuranceView.countDocuments()
    ]);

    res.json({
      favorites,
      articleReads,
      wellnessEnrollments,
      challengeJoins,
      medicationRefills,
      moodLogs,
      symptomChecks,
      reminderLogs,
      insuranceViews
    });
  } catch (error) {
    console.error('Engagement stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
