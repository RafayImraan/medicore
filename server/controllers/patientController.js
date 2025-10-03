const Patient = require('../models/Patient');
const User = require('../models/User');
const LabResult = require('../models/LabResult');
const Prescription = require('../models/Prescription');
const Billing = require('../models/Billing');
const Notification = require('../models/Notification');
const Appointment = require('../models/Appointment');

// Create new patient profile
exports.createPatient = async (req, res) => {
  try {
    const { userEmail, dateOfBirth, gender, bloodGroup, phone, address, emergencyContact, medicalHistory, allergies, insurance } = req.body;

    // Validate required fields
    if (!userEmail) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["userEmail"],
        message: "Please provide the user email to create a patient profile"
      });
    }

    // Check if user exists by email
    console.log('Looking for user with email:', userEmail);
    const user = await User.findOne({ email: userEmail });
    console.log('Found user:', user ? user._id : 'null');
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "The specified user does not exist"
      });
    }

    // Check if patient already exists
    const existingPatient = await Patient.findOne({ userId: user._id });
    if (existingPatient) {
      return res.status(409).json({
        error: "Patient profile already exists",
        message: "A patient profile already exists for this user"
      });
    }

    // Validate date of birth if provided
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      if (isNaN(dob.getTime())) {
        return res.status(400).json({
          error: "Invalid date of birth",
          message: "Please provide a valid date of birth"
        });
      }

      // Check if date of birth is not in the future
      const now = new Date();
      if (dob > now) {
        return res.status(400).json({
          error: "Invalid date of birth",
          message: "Date of birth cannot be in the future"
        });
      }
    }

    // Validate gender if provided
    if (gender && !['Male', 'Female', 'Other'].includes(gender)) {
      return res.status(400).json({
        error: "Invalid gender",
        message: "Gender must be one of: Male, Female, Other"
      });
    }

    const patient = new Patient({
      userId: user._id,
      dateOfBirth,
      gender: gender ? gender.toLowerCase() : gender,
      bloodGroup,
      phone,
      address,
      emergencyContact,
      medicalHistory,
      allergies,
      insurance
    });

    await patient.save();
    res.status(201).json({
      message: "Patient profile created successfully",
      patient
    });
  } catch (error) {
    console.error('Error creating patient profile:', error);
    console.error('Error stack:', error.stack);
    console.error('Request body:', req.body);
    res.status(500).json({
      error: "Failed to create patient profile",
      message: "An internal server error occurred while creating the patient profile. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get patient profile
exports.getPatient = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId format (MongoDB ObjectId)
    if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
      return res.status(400).json({
        error: "Invalid user ID",
        message: "Please provide a valid user ID"
      });
    }

    const patient = await Patient.findOne({ userId }).populate('userId', 'name email');
    if (!patient) {
      return res.status(404).json({
        error: "Patient not found",
        message: "No patient profile found for this user"
      });
    }

    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    res.status(500).json({
      error: "Failed to fetch patient profile",
      message: "An internal server error occurred while retrieving the patient profile. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update patient profile
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      { userId: req.params.userId },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).populate('userId', 'name email');

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all patients (for doctors/admins)
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate('userId', 'name email');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add medical history entry
exports.addMedicalHistory = async (req, res) => {
  try {
    const { condition, diagnosisDate, status } = req.body;
    const patient = await Patient.findOneAndUpdate(
      { userId: req.params.userId },
      {
        $push: { medicalHistory: { condition, diagnosisDate, status } },
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get lab results for a patient
exports.getLabResults = async (req, res) => {
  try {
    const { userId } = req.params;
    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    const labResults = await LabResult.find({ patientId: patient._id }).sort({ date: -1 });
    res.json(labResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get prescriptions for a patient
exports.getPrescriptions = async (req, res) => {
  try {
    const { userId } = req.params;
    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    const prescriptions = await Prescription.find({ patientId: patient._id }).populate('prescribedBy', 'name').sort({ date: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get billing for a patient
exports.getBilling = async (req, res) => {
  try {
    const { userId } = req.params;
    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    const billing = await Billing.find({ patientId: patient._id }).sort({ createdAt: -1 });
    res.json(billing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get notifications for a patient
exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId }).sort({ timestamp: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit bill payment
exports.submitBill = async (req, res) => {
  try {
    const { userId, billingId } = req.params;
    const { paymentMethod } = req.body;
    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    const billing = await Billing.findOneAndUpdate(
      { _id: billingId, patientId: patient._id },
      {
        paymentStatus: 'Paid',
        paymentMethod,
        updatedAt: Date.now()
      },
      { new: true }
    );
    if (!billing) {
      return res.status(404).json({ error: 'Billing record not found' });
    }
    res.json(billing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get appointments for a patient
exports.getAppointments = async (req, res) => {
  try {
    const { userId } = req.params;
    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    const appointments = await Appointment.find({ patientId: patient._id }).populate('doctorId', 'name').sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
