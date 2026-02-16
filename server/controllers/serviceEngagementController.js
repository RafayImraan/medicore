const ServiceAnalytics = require('../models/ServiceAnalytics');
const ServiceFavorite = require('../models/ServiceFavorite');
const ServiceCompare = require('../models/ServiceCompare');
const ServiceReview = require('../models/ServiceReview');
const ServiceQuizResult = require('../models/ServiceQuizResult');
const PricingCalcResult = require('../models/PricingCalcResult');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const OfferClaim = require('../models/OfferClaim');

const getUserId = (req) => req.user?._id || null;

const upsertAnalytics = async (serviceId, field) => {
  await ServiceAnalytics.updateOne(
    { serviceId },
    { $inc: { [field]: 1 } },
    { upsert: true }
  );
};

exports.logView = async (req, res) => {
  try {
    const { serviceId } = req.body;
    await upsertAnalytics(serviceId, 'views');
    res.json({ success: true });
  } catch (error) {
    console.error('Log view error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.logCompare = async (req, res) => {
  try {
    const { serviceId } = req.body;
    await ServiceCompare.create({ userId: getUserId(req), serviceId });
    await upsertAnalytics(serviceId, 'compares');
    res.json({ success: true });
  } catch (error) {
    console.error('Log compare error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.logFavorite = async (req, res) => {
  try {
    const { serviceId } = req.body;
    await ServiceFavorite.create({ userId: getUserId(req), serviceId });
    res.json({ success: true });
  } catch (error) {
    console.error('Log favorite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.submitReview = async (req, res) => {
  try {
    const { serviceId, name, rating, comment } = req.body;
    const review = await ServiceReview.create({
      serviceId,
      userId: getUserId(req),
      name,
      rating,
      comment
    });
    res.json(review);
  } catch (error) {
    console.error('Review submit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { answers, recommendedCategory } = req.body;
    const result = await ServiceQuizResult.create({
      userId: getUserId(req),
      answers,
      recommendedCategory
    });
    res.json(result);
  } catch (error) {
    console.error('Quiz submit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.submitPricingCalc = async (req, res) => {
  try {
    const result = await PricingCalcResult.create({
      userId: getUserId(req),
      ...req.body
    });
    res.json(result);
  } catch (error) {
    console.error('Pricing calc submit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = await NewsletterSubscriber.create({ email, source: 'services' });
    res.json(subscriber);
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.claimOffer = async (req, res) => {
  try {
    const { code } = req.body;
    const claim = await OfferClaim.create({ userId: getUserId(req), code, source: 'services' });
    res.json(claim);
  } catch (error) {
    console.error('Offer claim error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
