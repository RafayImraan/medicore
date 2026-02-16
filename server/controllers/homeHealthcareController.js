const HomeHealthcareTeam = require('../models/HomeHealthcareTeam');
const HomeHealthcareService = require('../models/HomeHealthcareService');
const HomeHealthcarePackage = require('../models/HomeHealthcarePackage');
const HomeHealthcareCertification = require('../models/HomeHealthcareCertification');
const HomeHealthcarePartner = require('../models/HomeHealthcarePartner');
const HomeHealthcareBlogPost = require('../models/HomeHealthcareBlogPost');
const HomeHealthcareAward = require('../models/HomeHealthcareAward');
const HomeHealthcarePress = require('../models/HomeHealthcarePress');
const HomeHealthcareStory = require('../models/HomeHealthcareStory');

const getHomeHealthcare = async (req, res) => {
  try {
    const [
      team,
      services,
      packages,
      certifications,
      partners,
      blogPosts,
      awards,
      press,
      stories
    ] = await Promise.all([
      HomeHealthcareTeam.find().sort({ createdAt: -1 }).lean(),
      HomeHealthcareService.find().sort({ createdAt: 1 }).lean(),
      HomeHealthcarePackage.find().sort({ price: 1 }).lean(),
      HomeHealthcareCertification.find().sort({ createdAt: 1 }).lean(),
      HomeHealthcarePartner.find().sort({ createdAt: 1 }).lean(),
      HomeHealthcareBlogPost.find().sort({ createdAt: -1 }).lean(),
      HomeHealthcareAward.find().sort({ year: -1 }).lean(),
      HomeHealthcarePress.find().sort({ createdAt: -1 }).lean(),
      HomeHealthcareStory.find().sort({ createdAt: -1 }).lean()
    ]);

    res.json({
      team,
      services,
      packages,
      certifications,
      partners,
      blogPosts,
      awards,
      press,
      stories
    });
  } catch (error) {
    console.error('Error fetching home healthcare content:', error);
    res.status(500).json({ error: 'Failed to load home healthcare content' });
  }
};

module.exports = {
  getHomeHealthcare
};
