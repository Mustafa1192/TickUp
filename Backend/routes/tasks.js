const express = require('express');
const Task = require('../models/Task'); 
const auth = require('../middleware/Auth');
const router = express.Router();

// Create a task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status, deadline, collaborators } = req.body;

    // Basic validations
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ message: 'Task title is required' });
    }

    if (collaborators && !Array.isArray(collaborators)) {
      return res.status(400).json({ message: 'Collaborators must be an array' });
    }

    if (collaborators && collaborators.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for (const email of collaborators) {
        if (!emailRegex.test(email)) {
          return res.status(400).json({ message: `Invalid collaborator email: ${email}` });
        }
      }
    }

    let parsedDeadline = null;
    if (deadline) {
      const dateObj = new Date(deadline);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ message: 'Invalid deadline date' });
      }
      parsedDeadline = dateObj;
    }

    const task = new Task({
      title: title.trim(),
      description: description || '',
      status: status || 'pending',
      deadline: parsedDeadline,
      collaborators: collaborators || [],
      user: req.userId
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get task stats
router.get('/stats', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const tasks = await Task.find({ user: req.user.id });
    const stats = {
      total: tasks.length,
      completed: tasks.filter(task => task.status === 'completed').length,
      inProgress: tasks.filter(task => task.status === 'in-progress').length,
      pending: tasks.filter(task => task.status === 'pending').length
    };
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get all tasks for the user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single task by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a task
router.patch('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
