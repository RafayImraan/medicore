const User = require('../models/User');

// Get user points
exports.getUserPoints = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    const user = await User.findById(userId).select('points');
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "The specified user does not exist"
      });
    }

    res.json({ points: user.points });
  } catch (error) {
    console.error('Error fetching user points:', error);
    res.status(500).json({
      error: "Failed to fetch user points",
      message: "An internal server error occurred while retrieving user points. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update user points
exports.updateUserPoints = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { points } = req.body;

    if (typeof points !== 'number' || points < 0) {
      return res.status(400).json({
        error: "Invalid points value",
        message: "Points must be a non-negative number"
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { points },
      { new: true, select: 'points' }
    );

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "The specified user does not exist"
      });
    }

    res.json({ points: user.points });
  } catch (error) {
    console.error('Error updating user points:', error);
    res.status(500).json({
      error: "Failed to update user points",
      message: "An internal server error occurred while updating user points. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
