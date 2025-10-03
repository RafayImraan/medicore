const Certification = require("../models/Certification");

// Fake mode preloaded certifications
const fakeCertifications = [
  { name: "ISO", expiryDate: new Date("2099-12-31"), status: "active" },
  { name: "NABH", expiryDate: new Date("2099-12-31"), status: "active" },
  { name: "SehatCard", expiryDate: new Date("2099-12-31"), status: "active" },
];

// Get all certifications
const getCertifications = async (req, res) => {
  try {
    // Check for fake mode (e.g., via query param or env)
    const isFakeMode = process.env.FAKE_MODE === "true" || req.query.fake === "true";

    if (isFakeMode) {
      // Return fake data
      return res.json(fakeCertifications);
    } else {
      // Query from DB
      const certifications = await Certification.find();
      res.json(certifications);
    }
  } catch (error) {
    console.error("Error fetching certifications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getCertifications,
};
