const Project = require('../models/Project');

// CREATE A PROJECT (POST)
const createProject = async (req, res) => {
  try {
    const newProject = new Project({
      title: req.body.title,
      description: req.body.description,
      // Inject the authenticated user's ID directly from the JWT token
      authorId: req.user.id 
    });
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// GET ALL PROJECTS (GET)
const getProjects = async (req, res) => {
  try {
    // Only fetch projects that belong to the currently logged-in user
    const projects = await Project.find({ authorId: req.user.id });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// UPDATE A PROJECT (PUT)
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Data Ownership Check: Verify if the user owns this document
    if (project.authorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You do not own this project' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// DELETE A PROJECT (DELETE)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Data Ownership Check: Verify if the user owns this document before deleting
    if (project.authorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You do not own this project' });
    }

    await project.deleteOne();
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { createProject, getProjects, updateProject, deleteProject };