const { z } = require('zod');

// Task Validation Schema
const taskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(100, "Title is too long"),
});

// Middleware function to validate req.body
const validateTask = (req, res, next) => {
  try {
    taskSchema.parse(req.body);
    next();
  } catch (error) {
    // Return 400 Bad Request for validation failures
    return res.status(400).json({
      message: "Validation Error",
      errors: error.errors.map(err => err.message)
    });
  }
};

module.exports = { validateTask };