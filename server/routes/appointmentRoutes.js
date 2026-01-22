const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");
const User = require("../models/User");

// Create new appointment (public for booking)
const createAppointment = async (req, res) => {
  try {
    // Validate required fields
    const { doctor, slot, type, patient, reason, insurance, fee } = req.body;

    if (!doctor || !slot || !type || !patient || !patient.name || !reason || fee === undefined) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["doctor", "slot", "type", "patient.name", "reason", "fee"],
        message: "Please provide all required information to book an appointment"
      });
    }

    // Validate doctor information
    if (!doctor.id || !doctor.name || !doctor.specialization) {
      return res.status(400).json({
        error: "Invalid doctor information",
        message: "Doctor details are incomplete. Please select a valid doctor."
      });
    }

    // Validate patient information
    if (!patient.email) {
      return res.status(400).json({
        error: "Invalid patient information",
        message: "Patient email is required for appointment booking"
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(patient.email)) {
      return res.status(400).json({
        error: "Invalid email format",
        message: "Please provide a valid email address"
      });
    }

    // Validate slot is a valid date
    const slotDate = new Date(slot);
    if (isNaN(slotDate.getTime())) {
      return res.status(400).json({
        error: "Invalid appointment slot",
        message: "Please select a valid date and time for your appointment"
      });
    }

    // Check if slot is in the past
    const now = new Date();
    if (slotDate <= now) {
      return res.status(400).json({
        error: "Invalid appointment time",
        message: "Appointment time must be in the future"
      });
    }

    // Validate fee is a positive number
    if (typeof fee !== 'number' || fee <= 0) {
      return res.status(400).json({
        error: "Invalid consultation fee",
        message: "Consultation fee must be a positive number"
      });
    }

    // Parse slot ISO to date and time
    const appointmentDate = slotDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const appointmentTime = slotDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // HH:MM

    const appointmentData = {
      patient: {
        name: patient.name,
        phone: patient.phone,
        email: patient.email,
        insurance: {
          provider: insurance?.provider || '',
          number: insurance?.number || ''
        }
      },
      doctor: {
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        experience: doctor.experience,
        rating: doctor.rating,
        fee: doctor.fee,
        languages: doctor.languages,
        clinic: doctor.clinic
      },
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      type,
      reason,
      consultationFee: fee
    };

    const newAppointment = new Appointment(appointmentData);
    const saved = await newAppointment.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: saved
    });
  } catch (err) {
    console.error('Appointment creation error:', err);

    // Handle MongoDB validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        error: "Validation failed",
        message: "Please check your input data",
        details: errors
      });
    }

    // Handle MongoDB duplicate key errors
    if (err.code === 11000) {
      return res.status(409).json({
        error: "Appointment conflict",
        message: "An appointment already exists at this time slot"
      });
    }

    res.status(500).json({
      error: "Failed to create appointment",
      message: "An internal server error occurred. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// POST route for creating appointment is handled in index.js as public

// Get all appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ appointmentDate: -1 });
    res.json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({
      error: "Failed to fetch appointments",
      message: "An internal server error occurred while retrieving appointments. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get appointments by patient ID
router.get("/patient/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    // Validate patientId format (MongoDB ObjectId)
    if (!patientId || !/^[0-9a-fA-F]{24}$/.test(patientId)) {
      return res.status(400).json({
        error: "Invalid patient ID",
        message: "Please provide a valid patient ID"
      });
    }

    const appointments = await Appointment.find({ patientId }).sort({ appointmentDate: -1 });
    res.json(appointments);
  } catch (err) {
    console.error('Error fetching patient appointments:', err);
    res.status(500).json({
      error: "Failed to fetch patient appointments",
      message: "An internal server error occurred while retrieving patient appointments. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get appointments by doctor ID
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Validate doctorId format (MongoDB ObjectId)
    if (!doctorId || !/^[0-9a-fA-F]{24}$/.test(doctorId)) {
      return res.status(400).json({
        error: "Invalid doctor ID",
        message: "Please provide a valid doctor ID"
      });
    }

    const appointments = await Appointment.find({ "doctor.id": doctorId }).sort({ appointmentDate: -1 });
    res.json(appointments);
  } catch (err) {
    console.error('Error fetching doctor appointments:', err);
    res.status(500).json({
      error: "Failed to fetch doctor appointments",
      message: "An internal server error occurred while retrieving doctor appointments. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get single appointment by ID (optional)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate appointment ID format (MongoDB ObjectId)
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        error: "Invalid appointment ID",
        message: "Please provide a valid appointment ID"
      });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        error: "Appointment not found",
        message: "The requested appointment does not exist"
      });
    }

    res.json(appointment);
  } catch (err) {
    console.error('Error fetching appointment:', err);
    res.status(500).json({
      error: "Failed to fetch appointment",
      message: "An internal server error occurred while retrieving the appointment. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Update status (for Admin)
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate appointment ID format (MongoDB ObjectId)
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        error: "Invalid appointment ID",
        message: "Please provide a valid appointment ID"
      });
    }

    // Validate status field
    if (!status) {
      return res.status(400).json({
        error: "Missing status",
        message: "Please provide the new status for the appointment"
      });
    }

    // Validate status value (assuming valid statuses are: pending, confirmed, completed, cancelled)
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status",
        message: `Status must be one of: ${validStatuses.join(', ')}`,
        validStatuses
      });
    }

    // Find the appointment first to check if it exists and get the old status
    const existingAppointment = await Appointment.findById(id);
    if (!existingAppointment) {
      return res.status(404).json({
        error: "Appointment not found",
        message: "The requested appointment does not exist"
      });
    }

    // Check if status is already the same
    if (existingAppointment.status === status) {
      return res.status(200).json({
        message: "Appointment status is already set to the requested value",
        appointment: existingAppointment
      });
    }

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (updated) {
      // Create notification for status update
      try {
        const adminUsers = await User.find({ role: 'admin' });
        for (const admin of adminUsers) {
          const notification = await Notification.createNotification({
            title: 'Appointment Status Updated',
            description: `Appointment status changed to ${status}`,
            type: 'appointment',
            severity: 'low',
            userId: admin._id,
            resourceId: updated._id,
            resourceType: 'Appointment',
            metadata: {
              oldStatus: existingAppointment.status,
              newStatus: status,
              appointmentDate: updated.appointmentDate,
              appointmentTime: updated.appointmentTime
            }
          });

          // Emit real-time notification
          if (global.emitNotification) {
            global.emitNotification(admin._id.toString(), notification);
          }
        }
      } catch (notificationError) {
        console.error('Notification creation failed:', notificationError);
        // Notification creation failed, but appointment update succeeded
      }
    }

    res.json(updated);
  } catch (err) {
    console.error('Error updating appointment status:', err);
    res.status(500).json({
      error: "Failed to update appointment status",
      message: "An internal server error occurred while updating the appointment status. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = { router, createAppointment };
