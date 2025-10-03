const express = require("express");
const router = express.Router();
const { getCertifications } = require("../controllers/certificationController");

// GET /api/certifications - Get all certifications
router.get("/", getCertifications);

module.exports = router;
