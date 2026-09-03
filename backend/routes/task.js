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

// ==========================================
// ROUTE: PUT /api/tasks/:id
// GOAL: Update an existing task (e.g., mark as completed)
// ==========================================
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    // Step 1: Find the task using the ID passed in the URL
    let task = await Task.findById(req.params.id);

    // If the task doesn't exist, tell the client cleanly
    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    // Step 2: Security Check! (Crucial for real-world apps)
    // Ensure the person trying to update the task is the actual owner.
    // We convert task.user (an ObjectId) to a string to safely compare it with req.user.
    if (task.user.toString() !== req.user) {
      return res.status(403).json({ error: 'Access denied. You do not own this task.' });
    }

    // Step 3: Apply the updates if new data was provided
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (dueDate) task.dueDate = dueDate;

    // Step 4: Save the changes to MongoDB
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
// GOAL: Permanently remove a task from the database
// ==========================================
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Step 1: Locate the task
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    // Step 2: Ownership Security Check
    if (task.user.toString() !== req.user) {
      return res.status(403).json({ error: 'Access denied. You do not own this task.' });
    }

    // Step 3: Permanently delete the task
    // Note: We use deleteOne() as it is the standard method in modern Mongoose
    await task.deleteOne();
    
    res.status(200).json({ message: 'Task deleted successfully.' });

  } catch (error) {
    console.error('Delete Task Error:', error.message);
    res.status(500).json({ error: 'Our servers experienced an issue while deleting the task.' });
  }
});

module.exports = router;