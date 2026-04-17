const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

// Connect DB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// ✅ Import routes properly
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// 🔍 Debug (VERY IMPORTANT - remove later)
console.log('authRoutes:', typeof authRoutes);
console.log('productRoutes:', typeof productRoutes);
console.log('orderRoutes:', typeof orderRoutes);

// ❗ Safety check (prevents your crash)
if (typeof authRoutes !== 'function') {
  throw new Error('authRoutes is not a router function');
}
if (typeof productRoutes !== 'function') {
  throw new Error('productRoutes is not a router function');
}
if (typeof orderRoutes !== 'function') {
  throw new Error('orderRoutes is not a router function');
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Default route (optional)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});