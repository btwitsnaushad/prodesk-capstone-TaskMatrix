const mongoose = require('mongoose');

// Defining the blueprint for our application's users
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required to create an account'],
      trim: true, // Automatically removes accidental spaces before or after the name
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true, // Prevents multiple accounts with the same email
      lowercase: true, // Converts email to lowercase to avoid case-sensitive duplicate bugs
    },
    password: {
      type: String,
      required: [true, 'Password is required for security'],
      minlength: [6, 'Password must be at least 6 characters long'], 
    }
  },
  {
    // Mongoose will automatically manage 'createdAt' and 'updatedAt' fields for us
    timestamps: true 
  }
);

module.exports = mongoose.model('User', userSchema);