const mongoose = require('mongoose');

// Defining the blueprint for our User data in MongoDB
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // We missed this field earlier! Adding username to the schema.
  username: {
    type: String,
    required: true,
    unique: true, // This enforces the unique index rule in MongoDB
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);