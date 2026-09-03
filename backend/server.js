const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json()); 

// Registering our API routes
app.use('/api/auth', require('./routes/auth'));

app.use('/api/tasks', require('./routes/task'));

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, 
  family: 4 
})
  .then(() => console.log('MongoDB Database Connected Successfully!'))
  .catch((err) => console.log('Database connection error: ', err.message));

app.get('/', (req, res) => {
  res.send('TaskMatrix API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});