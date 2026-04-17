const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ADD product (protected)
router.post('/', auth, async (req, res) => {
  const product = new Product(req.body);
  const saved = await product.save();
  res.json(saved);
});

module.exports = router;