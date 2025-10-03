const Billing = require('../models/Billing');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// Create new bill
exports.createBill = async (req, res) => {
  try {
    const { patientId, appointmentId, doctorId, items, paymentMethod, insuranceClaim } = req.body;

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const tax = subtotal * 0.18; // 18% GST
    const discount = req.body.discount || 0;
    const totalAmount = subtotal + tax - discount;

    const bill = new Billing({
      patientId,
      appointmentId,
      doctorId,
      items,
      subtotal,
      tax,
      discount,
      totalAmount,
      paymentMethod,
      insuranceClaim
    });

    await bill.save();
    
    // Populate related data
    await bill.populate('patientId', 'userId');
    await bill.populate('doctorId', 'userId specialization');
    await bill.populate('appointmentId');

    res.status(201).json({ message: 'Bill created successfully', bill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get bill by ID
exports.getBill = async (req, res) => {
  try {
    const bill = await Billing.findById(req.params.id)
      .populate('patientId', 'userId')
      .populate('doctorId', 'userId specialization')
      .populate('appointmentId');

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.json(bill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get bills for a patient
exports.getPatientBills = async (req, res) => {
  try {
    const bills = await Billing.find({ patientId: req.params.patientId })
      .populate('doctorId', 'userId specialization')
      .sort({ createdAt: -1 });

    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get bills for a doctor
exports.getDoctorBills = async (req, res) => {
  try {
    const bills = await Billing.find({ doctorId: req.params.doctorId })
      .populate('patientId', 'userId')
      .sort({ createdAt: -1 });

    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const bill = await Billing.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, updatedAt: Date.now() },
      { new: true }
    );

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.json({ message: 'Payment status updated successfully', bill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get pending bills
exports.getPendingBills = async (req, res) => {
  try {
    const bills = await Billing.find({ paymentStatus: 'Pending' })
      .populate('patientId', 'userId')
      .populate('doctorId', 'userId specialization')
      .sort({ createdAt: -1 });

    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get revenue analytics
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchStage = {
      paymentStatus: 'Paid'
    };

    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const analytics = await Billing.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalBills: { $sum: 1 },
          averageBillAmount: { $avg: '$totalAmount' }
        }
      }
    ]);

    res.json(analytics[0] || { totalRevenue: 0, totalBills: 0, averageBillAmount: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
