const mongoose = require('mongoose');

// ==========================================
// SCHEMA: Task Model
// GOAL: Define the blueprint for every task created in the application.
// ==========================================
const taskSchema = new mongoose.Schema(
  {
    // Linking to the User: 
    // This ensures every task is permanently tied to the specific person who created it.
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
    },
    
    // The core details of the task
    title: {
      type: String,
      required: [true, 'A task must have a title to be created.'],
      trim: true, // Automatically cleans up accidental spaces
    },
    description: {
      type: String,
      trim: true,
    },
    
    // Tracking the progress
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'], 
      default: 'pending', // By default, every new task starts as pending
    },
    
    dueDate: {
      type: Date,
    }
  },
  {
    // Automatically manages 'createdAt' and 'updatedAt' timestamps
    timestamps: true 
  }
);

module.exports = mongoose.model('Task', taskSchema);