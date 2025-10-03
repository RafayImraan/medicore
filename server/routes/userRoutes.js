const express = require("express");
const router = express.Router();
const { verifyToken, requireAnyAuthenticated } = require("../middleware/auth");
const { getUserPoints, updateUserPoints } = require("../controllers/userController");

// GET /api/user/points - Get current user's points
router.get("/points", verifyToken, requireAnyAuthenticated, getUserPoints);

// PUT /api/user/points - Update current user's points
router.put("/points", verifyToken, requireAnyAuthenticated, updateUserPoints);

module.exports = router;
