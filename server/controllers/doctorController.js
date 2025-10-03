const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// Create doctor profile
exports.createDoctor = async (req, res) => {
  try {
    const { userId, specialization, licenseNumber, experience, education, hospital, consultationFee, availability } = req.body;

    // Validate required fields
    if (!userId || !specialization || !licenseNumber) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["userId", "specialization", "licenseNumber"],
        message: "Please provide all required information to create a doctor profile"
      });
    }

    // Validate userId format (MongoDB ObjectId)
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      return res.status(400).json({
        error: "Invalid user ID",
        message: "Please provide a valid user ID"
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "The specified user does not exist"
      });
    }

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ userId });
    if (existingDoctor) {
      return res.status(409).json({
        error: "Doctor profile already exists",
        message: "A doctor profile already exists for this user"
      });
    }

    // Check if license number is unique
    const existingLicense = await Doctor.findOne({ licenseNumber });
    if (existingLicense) {
      return res.status(409).json({
        error: "License number already exists",
        message: "This license number is already registered to another doctor"
      });
    }

    // Validate consultation fee
    if (consultationFee !== undefined && (typeof consultationFee !== 'number' || consultationFee < 0)) {
      return res.status(400).json({
        error: "Invalid consultation fee",
        message: "Consultation fee must be a positive number"
      });
    }

    const doctor = new Doctor({
      userId,
      specialization,
      licenseNumber,
      experience,
      education,
      hospital,
      consultationFee,
      availability
    });

    await doctor.save();
    res.status(201).json({
      message: "Doctor profile created successfully",
      doctor
    });
  } catch (error) {
    console.error('Error creating doctor profile:', error);
    res.status(500).json({
      error: "Failed to create doctor profile",
      message: "An internal server error occurred while creating the doctor profile. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get doctor profile
exports.getDoctor = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId format (MongoDB ObjectId)
    if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
      return res.status(400).json({
        error: "Invalid user ID",
        message: "Please provide a valid user ID"
      });
    }

    const doctor = await Doctor.findOne({ userId }).populate('userId', 'name email');
    if (!doctor) {
      return res.status(404).json({
        error: "Doctor not found",
        message: "No doctor profile found for this user"
      });
    }

    res.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    res.status(500).json({
      error: "Failed to fetch doctor profile",
      message: "An internal server error occurred while retrieving the doctor profile. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('userId', 'name email');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update doctor profile
exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.params.userId },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).populate('userId', 'name email');

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get doctors by specialization
exports.getDoctorsBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;
    const doctors = await Doctor.find({ specialization }).populate('userId', 'name email');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update doctor availability
exports.updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.params.userId },
      { availability, updatedAt: Date.now() },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get featured doctor with rotation
exports.getFeaturedDoctor = async (req, res) => {
  try {
    const featuredDoctors = await Doctor.find({ featured: true }).populate('userId', 'name email');
    if (featuredDoctors.length === 0) {
      return res.status(404).json({
        error: "No featured doctors found",
        message: "No doctors are currently marked as featured"
      });
    }

    // Rotation logic: change doctor every 4 hours
    const now = new Date();
    const hour = now.getHours();
    const rotationIndex = Math.floor(hour / 4) % featuredDoctors.length;
    const selectedDoctor = featuredDoctors[rotationIndex];

    res.json(selectedDoctor);
  } catch (error) {
    console.error('Error fetching featured doctor:', error);
    res.status(500).json({
      error: "Failed to fetch featured doctor",
      message: "An internal server error occurred while retrieving the featured doctor. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get patient queue for a doctor
exports.getPatientQueue = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Get today's appointments for this doctor
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({
      doctorId,
      date: {
        $gte: today,
        $lt: tomorrow
      },
      status: { $in: ['confirmed', 'in-progress'] }
    })
    .populate('patientId', 'name age gender')
    .sort({ time: 1 });

    // Format for dashboard display
    const queue = appointments.map(appointment => ({
      id: appointment._id,
      patientName: appointment.patientId?.name || 'Unknown Patient',
      age: appointment.patientId?.age || 'N/A',
      gender: appointment.patientId?.gender || 'N/A',
      time: appointment.time,
      status: appointment.status,
      priority: appointment.priority || 'normal'
    }));

    res.json(queue);
  } catch (error) {
    console.error('Error fetching patient queue:', error);
    res.status(500).json({ error: 'Error fetching patient queue' });
  }
};
