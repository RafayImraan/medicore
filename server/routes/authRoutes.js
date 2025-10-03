const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 1000, // 15 seconds
  max: process.env.NODE_ENV === 'test' ? 1000 : 5, // Allow 5 requests in test environment, 5 otherwise
  message: {
    error: "Too many authentication attempts",
    message: "Too many authentication attempts from this IP, please try again after 15 seconds."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// REGISTER ROUTE
router.post("/register", authLimiter, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["name", "email", "password"],
        message: "Please provide all required fields for registration"
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
        message: "Please provide a valid email address"
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password too weak",
        message: "Password must be at least 6 characters long"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        error: "User already exists",
        message: "An account with this email already exists. Please try logging in instead."
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'patient', // Default to patient role
    });

    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({
      error: "Registration failed",
      message: "An internal server error occurred during registration. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// LOGIN ROUTE
router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: "Missing credentials",
        required: ["email", "password"],
        message: "Please provide both email and password"
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
        message: "Please provide a valid email address"
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "No account found with this email address"
      });
    }

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Incorrect password. Please try again."
      });
    }

    // Check if JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        error: "Authentication configuration error",
        message: "Server configuration issue. Please contact support."
      });
    }

    // Handle points based on mode
    const pointsMode = process.env.POINTS_MODE || 'fake'; // 'fake' or 'real'
    let userPoints = user.points;

    if (pointsMode === 'fake') {
      // Assign random points on login
      userPoints = Math.floor(Math.random() * 151); // 0-150
      // Update user with new points
      await User.findByIdAndUpdate(user._id, { points: userPoints });
    }
    // In 'real' mode, use existing points from DB

    // Generate JWT tokens
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const refreshToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Return tokens and user data
    res.status(200).json({
      message: "Login successful",
      token,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: userPoints,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: "Login failed",
      message: "An internal server error occurred during login. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const { token } = req.body;

    // Validate required fields
    if (!token) {
      return res.status(401).json({
        error: "Missing refresh token",
        message: "Please provide a refresh token"
      });
    }

    // Check if JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        error: "Authentication configuration error",
        message: "Server configuration issue. Please contact support."
      });
    }

    // Verify the refresh token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          error: "Invalid refresh token",
          message: "The refresh token is invalid or expired. Please log in again."
        });
      }

      const newToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(200).json({
        message: "Token refreshed successfully",
        token: newToken
      });
    });
  } catch (err) {
    res.status(500).json({
      error: "Token refresh failed",
      message: "An internal server error occurred while refreshing the token. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;
