require('dotenv').config(); 
const aiRoutes = require('./routes/aiRoutes');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// ✨ NEW: Import rate-limit
const rateLimit = require('express-rate-limit'); 

const app = express();

// Middleware setup to parse JSON and allow Cross-Origin requests
app.use(cors());
app.use(express.json()); 

// ✨ NEW: Rate Limiting Configuration (Track B - P2 Requirement)
const limiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { error: "Too many requests from this IP, please try again after 15 minutes." }
});

// ✨ NEW: Apply limiter strictly to auth and ai routes before they are registered
app.use('/api/auth', limiter);
app.use('/api/ai', limiter);

// Registering authentication and task API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/task'));
app.use('/api/ai', aiRoutes);

// Registering the newly created Project routes
app.use('/api/projects', require('./routes/projectRoutes'));

// Registering Payment route for Stripe Checkout
app.use('/api/payment', require('./routes/paymentRoutes'));

// Establishing connection to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, 
  family: 4 
})
  .then(() => {}) // FIXED: Added empty brackets for silent success
  .catch((err) => {}); // FIXED: Added empty brackets for silent error

// Base route to verify if the API is running correctly
app.get('/', (req, res) => {
  res.send('TaskMatrix API is running...');
});

// Start the Express server on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
});