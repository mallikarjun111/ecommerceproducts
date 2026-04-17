const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/orders
 * @desc    Create new order
 */
router.post('/', auth, async (req, res) => {
  try {
    const { products, totalAmount } = req.body;

    // validation
    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Products are required" });
    }

    if (!totalAmount) {
      return res.status(400).json({ message: "Total amount is required" });
    }

    const order = new Order({
      userId: req.user.id,
      products,
      totalAmount
    });

    const savedOrder = await order.save();

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * @route   GET /api/orders
 * @desc    Get logged-in user orders
 */
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });

    res.json({
      count: orders.length,
      orders
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;