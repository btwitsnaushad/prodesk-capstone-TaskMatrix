const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware setup to parse JSON and allow Cross-Origin requests
app.use(cors());
app.use(express.json()); 

// Registering authentication and task API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/task'));

// Registering the newly created Project routes
app.use('/api/projects', require('./routes/projectRoutes'));

// Registering Payment route for Stripe Checkout
app.use('/api/payment', require('./routes/paymentRoutes'));

// Establishing connection to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, 
  family: 4 
})
  .then(() => console.log('MongoDB Database Connected Successfully!'))
  .catch((err) => console.log('Database connection error: ', err.message));

// Base route to verify if the API is running correctly
app.get('/', (req, res) => {
  res.send('TaskMatrix API is running...');
});

// Start the Express server on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});