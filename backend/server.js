require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const aiRoutes = require('./routes/aiRoutes');

const app = express();

// Trust the first proxy in production (Render)
app.set('trust proxy', 1);

// Allow requests only from the live Vercel frontend
app.use(cors({
  origin: 'https://prodesk-capstone-task-matrix-rosy.vercel.app'
}));

// Parse JSON request bodies
app.use(express.json());

// Rate limiter for Authentication and AI APIs
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

// Apply rate limiting
app.use('/api/auth', limiter);
app.use('/api/ai', limiter);

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/task'));
app.use('/api/ai', aiRoutes);
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  family: 4
})
  .then(() => {})
  .catch((err) => {});

// Base API Route
app.get('/', (req, res) => {
  res.send('TaskMatrix API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {});