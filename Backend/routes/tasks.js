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
      user: req.userId,
      important: false,
      deleted: false
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get task stats (excluding deleted tasks)
router.get('/stats', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const tasks = await Task.find({
      user: req.user.id,
      deleted: { $ne: true } // show old tasks with undefined deleted too
    });

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

// Get all active tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.userId,
      deleted: { $ne: true }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get important tasks
router.get('/important', auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.userId,
      important: true,
      deleted: { $ne: true }
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching important tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get deleted/recycled tasks
router.get('/recycle', auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.userId,
      deleted: true
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching recycled tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Restore all tasks from recycle bin
router.put('/restore-all', auth, async (req, res) => {
  try {
    const result = await Task.updateMany(
      { user: req.userId, deleted: true },
      { $set: { deleted: false, deletedAt: null } }
    );
    res.json({ message: `${result.modifiedCount} tasks restored` });
  } catch (error) {
    console.error('Error restoring all tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Empty recycle bin (permanently delete all deleted tasks)
router.delete('/empty-bin', auth, async (req, res) => {
  try {
    const result = await Task.deleteMany({ user: req.userId, deleted: true });
    res.json({ message: `${result.deletedCount} tasks permanently deleted` });
  } catch (error) {
    console.error('Error emptying recycle bin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Restore a deleted task
router.put('/:id/restore', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { deleted: false },
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error restoring task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single deleted task by ID (for recycle bin)
router.get('/recycle/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId,
      deleted: true
    });
    if (!task) {
      return res.status(404).json({ message: 'Deleted task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error('Error fetching deleted task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single task by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId,
      deleted: { $ne: true }
    });
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

// Soft delete (move to recycle bin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { deleted: true },
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task moved to recycle bin', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
