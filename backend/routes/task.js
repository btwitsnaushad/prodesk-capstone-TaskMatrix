const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware'); // Bringing in our security guard

const router = express.Router();

// ==========================================
// ROUTE: POST /api/tasks
// GOAL: Allow a logged-in user to create a new task.
// ==========================================
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    // Step 1: Validate the input. A task must have at least a title.
    if (!title) {
      return res.status(400).json({ error: 'Please provide a title for your task.' });
    }

    // Step 2: Build the new task. 
    // Notice how we grab the 'req.user' that our authMiddleware securely provided.
    // This ensures the task is permanently linked to the specific person who created it.
    const newTask = new Task({
      user: req.user, 
      title,
      description,
      dueDate
    });

    // Step 3: Save it to the database
    await newTask.save();

    // Step 4: Send the newly created task back to the frontend
    res.status(201).json({
      message: 'Task created successfully!',
      task: newTask
    });

  } catch (error) {
    console.error('Task Creation Error:', error.message);
    res.status(500).json({ error: 'Failed to create the task due to a server error.' });
  }
});

// ==========================================
// ROUTE: GET /api/tasks
// GOAL: Fetch all tasks belonging exclusively to the logged-in user.
// ==========================================
router.get('/', authMiddleware, async (req, res) => {
  try {
    // We ONLY find tasks where the 'user' matches our currently authenticated user.
    // We also sort them by 'createdAt' in descending order (-1) so the newest tasks appear at the top.
    const tasks = await Task.find({ user: req.user }).sort({ createdAt: -1 });
    
    res.status(200).json({
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error('Fetch Tasks Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch your tasks. Please try again.' });
  }
});

module.exports = router;