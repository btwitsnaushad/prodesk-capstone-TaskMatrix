const express = require('express');
const router = express.Router();
const { createProject, getProjects, updateProject, deleteProject } = require('../controllers/projectController');

// Import your JWT protection middleware
const auth = require('../middleware/authMiddleware');

// Secure all endpoints with JWT protection middleware
router.route('/')
  .get(auth, getProjects)
  .post(auth, createProject);

router.route('/:id')
  .put(auth, updateProject)
  .delete(auth, deleteProject);

module.exports = router;