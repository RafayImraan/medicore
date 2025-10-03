const Order = require('../models/Order');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { patientId, items, totalAmount } = req.body;

    if (!patientId || !items || !Array.isArray(items) || items.length === 0 || !totalAmount) {
      return res.status(400).json({ error: 'Invalid order data' });
    }

    const order = new Order({
      patientId,
      items,
      totalAmount,
      status: 'pending'
    });

    await order.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Server error while placing order' });
  }
};

// Get orders for a patient
exports.getOrdersByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const orders = await Order.find({ patientId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Server error while fetching orders' });
  }
};
