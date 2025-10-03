const Cart = require('../models/Cart');

// Get cart for a patient
exports.getCart = async (req, res) => {
  try {
    const { patientId } = req.params;
    const cart = await Cart.findOne({ patientId }).populate('patientId');
    if (!cart) {
      return res.json({ items: [] });
    }
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Server error while fetching cart' });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { patientId, medicineId, name, quantity, price } = req.body;

    if (!patientId || !medicineId || !name || !quantity || !price) {
      return res.status(400).json({ error: 'Invalid cart item data' });
    }

    let cart = await Cart.findOne({ patientId });

    if (!cart) {
      cart = new Cart({ patientId, items: [] });
    }

    const existingItem = cart.items.find(item => item.medicineId === medicineId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ medicineId, name, quantity, price });
    }

    cart.updatedAt = new Date();
    await cart.save();

    res.status(200).json({ message: 'Item added to cart', cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Server error while adding to cart' });
  }
};

// Update item quantity in cart
exports.updateQuantity = async (req, res) => {
  try {
    const { patientId, medicineId, quantity } = req.body;

    if (!patientId || !medicineId || quantity < 1) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const cart = await Cart.findOne({ patientId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.find(item => item.medicineId === medicineId);

    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    item.quantity = quantity;
    cart.updatedAt = new Date();
    await cart.save();

    res.json({ message: 'Quantity updated', cart });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ error: 'Server error while updating quantity' });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { patientId, medicineId } = req.params;

    const cart = await Cart.findOne({ patientId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.medicineId !== medicineId);
    cart.updatedAt = new Date();
    await cart.save();

    res.json({ message: 'Item removed from cart', cart });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Server error while removing from cart' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const { patientId } = req.params;

    await Cart.findOneAndDelete({ patientId });

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Server error while clearing cart' });
  }
};
