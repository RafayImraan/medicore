const BillingIntegration = require('../models/BillingIntegration');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

// Mock payment processor (in production, integrate with Stripe, PayPal, etc.)
const processPayment = async (billingData) => {
  // Simulate payment processing
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 95% success rate for demo
      const success = Math.random() > 0.05;
      if (success) {
        resolve({
          transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'paid'
        });
      } else {
        reject(new Error('Payment processing failed'));
      }
    }, 2000); // Simulate 2 second processing time
  });
};

// Create billing record
exports.createBilling = async (req, res) => {
  try {
    const { appointmentId, serviceType, amount, paymentMethod, insuranceProvider, insurancePolicyNumber, notes } = req.body;

    // Verify appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Verify patient exists
    const patient = await Patient.findById(appointment.patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Create billing record
    const billing = new BillingIntegration({
      patientId: appointment.patientId,
      appointmentId,
      serviceType,
      amount,
      paymentMethod,
      insuranceProvider,
      insurancePolicyNumber,
      notes
    });

    await billing.save();

    res.status(201).json({
      message: 'Billing record created successfully',
      billing
    });
  } catch (error) {
    console.error('Create billing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Process payment
exports.processPayment = async (req, res) => {
  try {
    const { billingId } = req.params;

    const billing = await BillingIntegration.findById(billingId);
    if (!billing) {
      return res.status(404).json({ error: 'Billing record not found' });
    }

    if (billing.status === 'paid') {
      return res.status(400).json({ error: 'Payment already processed' });
    }

    // Process payment
    const paymentResult = await processPayment(billing);

    // Update billing record
    billing.status = paymentResult.status;
    billing.transactionId = paymentResult.transactionId;
    await billing.save();

    res.json({
      message: 'Payment processed successfully',
      billing,
      transactionId: paymentResult.transactionId
    });
  } catch (error) {
    console.error('Process payment error:', error);

    // Update billing status to failed
    if (req.params.billingId) {
      await BillingIntegration.findByIdAndUpdate(req.params.billingId, { status: 'failed' });
    }

    res.status(500).json({ error: error.message || 'Payment processing failed' });
  }
};

// Get billing records for a patient
exports.getPatientBilling = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { patientId };
    if (status) {
      query.status = status;
    }

    const billingRecords = await BillingIntegration.find(query)
      .populate('appointmentId', 'date time type')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await BillingIntegration.countDocuments(query);

    res.json({
      billingRecords,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get patient billing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get billing statistics
exports.getBillingStats = async (req, res) => {
  try {
    const stats = await BillingIntegration.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const totalRevenue = await BillingIntegration.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      stats,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Get billing stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update billing record
exports.updateBilling = async (req, res) => {
  try {
    const { billingId } = req.params;
    const updates = req.body;

    const billing = await BillingIntegration.findByIdAndUpdate(
      billingId,
      { ...updates, updatedAt: Date.now() },
      { new: true }
    );

    if (!billing) {
      return res.status(404).json({ error: 'Billing record not found' });
    }

    res.json({
      message: 'Billing record updated successfully',
      billing
    });
  } catch (error) {
    console.error('Update billing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete billing record
exports.deleteBilling = async (req, res) => {
  try {
    const { billingId } = req.params;

    const billing = await BillingIntegration.findByIdAndDelete(billingId);

    if (!billing) {
      return res.status(404).json({ error: 'Billing record not found' });
    }

    res.json({ message: 'Billing record deleted successfully' });
  } catch (error) {
    console.error('Delete billing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
