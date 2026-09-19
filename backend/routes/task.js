const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware'); // Bringing in our security guard

const router = express.Router();

// ==========================================
// ROUTE: POST /api/tasks
// ==========================================
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Please provide a title for your task.' });
    }

    // FIX: Using req.user.userId instead of just req.user to pass only the ID string
    const newTask = new Task({
      user: req.user.userId, 
      title,
      description,
      dueDate
    });

    await newTask.save();

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
// ==========================================
router.get('/', authMiddleware, async (req, res) => {
  try {
    // FIX: Match against req.user.userId
    const tasks = await Task.find({ user: req.user.userId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error('Fetch Tasks Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch your tasks. Please try again.' });
  }
});

// ==========================================
// ROUTE: PUT /api/tasks/:id
// ==========================================
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    // FIX: Compare task.user with req.user.userId
    if (task.user.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied. You do not own this task.' });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (dueDate) task.dueDate = dueDate;

    await task.save();
    
    res.status(200).json({ 
      message: 'Task updated successfully', 
      task 
    });

  } catch (error) {
    console.error('Update Task Error:', error.message);
    res.status(500).json({ error: 'Our servers experienced an issue while updating the task.' });
  }
});

// ==========================================
// ROUTE: DELETE /api/tasks/:id
// ==========================================
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    // FIX: Compare task.user with req.user.userId
    if (task.user.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied. You do not own this task.' });
    }

    await task.deleteOne();
    
    res.status(200).json({ message: 'Task deleted successfully.' });

  } catch (error) {
    console.error('Delete Task Error:', error.message);
    res.status(500).json({ error: 'Our servers experienced an issue while deleting the task.' });
  }
});

module.exports = router;