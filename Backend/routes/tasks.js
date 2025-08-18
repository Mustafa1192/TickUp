import express from 'express';
import Task from '../models/Task.js';
import auth from '../middleware/Auth.js';
import User from '../models/user.js';
import sendInviteEmail from '../utils/sendInviteEmail.js';
import crypto from 'crypto';

const router = express.Router();

// Helper function to format due date
const formatDueDate = (dueDate) => {
  if (!dueDate) return 'No due date set';
  const dateObj = new Date(dueDate);
  if (isNaN(dateObj)) return 'No due date set';
  return dateObj.toDateString();
};

// ----------------------
// Create a task
// ----------------------
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status, deadline } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ message: 'Task title is required' });
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
      user: req.userId,
      collaborators: [],
      important: false,
      deleted: false,
      pendingInvites: [],
      activityLog: [
        { user: req.userId, message: 'Task created' }
      ]
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ----------------------
// Get task stats
// ----------------------
router.get('/stats', auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      deleted: { $ne: true },
      $or: [
        { user: req.userId },
        { collaborators: req.userId }
      ]
    });

    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      pending: tasks.filter(t => t.status === 'pending').length
    };
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// ----------------------
// Get all active tasks
// ----------------------
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      deleted: { $ne: true },
      $or: [
        { user: req.userId },
        { collaborators: req.userId }
      ]
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ----------------------
// Important tasks
// ----------------------
router.get('/important', auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      deleted: { $ne: true },
      important: true,
      $or: [
        { user: req.userId },
        { collaborators: req.userId }
      ]
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ----------------------
// Recycle bin tasks
// ----------------------
router.get('/recycle', auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.userId,
      deleted: true
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ----------------------
// Restore all
// ----------------------
router.put('/restore-all', auth, async (req, res) => {
  try {
    const result = await Task.updateMany(
      { user: req.userId, deleted: true },
      { $set: { deleted: false } }
    );

    await Task.updateMany(
      { user: req.userId, deleted: false },
      { $push: { activityLog: { user: req.userId, message: 'Task restored' } } }
    );

    res.json({ message: `${result.modifiedCount} tasks restored` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ----------------------
// ✅ Empty recycle bin
// ----------------------
router.delete('/empty-bin', auth, async (req, res) => {
  try {
    const result = await Task.deleteMany({ user: req.userId, deleted: true });
    res.json({ message: `${result.deletedCount} tasks permanently deleted` });
  } catch (error) {
    console.error('Error emptying recycle bin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ----------------------
// Restore one
// ----------------------
router.put('/:id/restore', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { deleted: false },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.activityLog.push({ user: req.userId, message: 'Task restored' });
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ----------------------
// Get single task (with clean activity log)
// ----------------------
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      deleted: { $ne: true },
      $or: [
        { user: req.userId },
        { collaborators: req.userId }
      ]
    })
    .populate('collaborators', 'email username')
    .populate('activityLog.user', 'username');

    if (!task) return res.status(404).json({ message: 'Task not found' });

    const formattedActivityLog = task.activityLog.map(log => ({
      message: `${log.user?.username || 'Unknown'} — ${log.message}`,
      at: log.at
    }));

    res.json({ ...task.toObject(), activityLog: formattedActivityLog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ----------------------
// Get a single deleted task by ID (for recycle bin)
// ----------------------
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

// ----------------------
// Update task (owner only)
// ----------------------
router.patch('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.activityLog.push({ user: req.userId, message: 'Task updated' });
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ----------------------
// Update status (collaborator)
// ----------------------
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status required' });

    const task = await Task.findOne({ _id: req.params.id, deleted: false })
      .populate('collaborators', '_id');

    if (!task) return res.status(404).json({ message: 'Task not found' });

    const userIdStr = req.userId.toString();
    const isCollaborator = task.collaborators.some(c => c._id.toString() === userIdStr);

    if (!isCollaborator) return res.status(403).json({ message: 'Not authorized' });

    task.status = status;
    task.activityLog.push({ user: req.userId, message: `Status changed to "${status}"` });
    await task.save();

    res.json(task);
  } catch (err) {
    console.error('Collaborator status update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ----------------------
// Soft delete (owner only)
// ----------------------
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { deleted: true },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.activityLog.push({ user: req.userId, message: 'Task moved to recycle bin' });
    await task.save();

    res.json({ message: 'Task moved to recycle bin', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ----------------------
// Invite user to task
// ----------------------
router.post('/:taskId/invite', auth, async (req, res) => {
  const { email } = req.body;
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const inviter = req.user.username || req.user.email;
    const formattedDueDate = formatDueDate(task.deadline);

    let collaborator = await User.findOne({ email: email.trim() });

    if (collaborator) {
      if (!task.collaborators.includes(collaborator._id)) {
        task.collaborators.push(collaborator._id);
      }
      task.activityLog.push({ user: req.userId, message: `Invite sent to ${email}` });
      await task.save();

      const joinLink = `${process.env.BACKEND_URL}/api/tasks/${task._id}/auto-accept?email=${collaborator.email}`;
      await sendInviteEmail(collaborator.email, task.title, task.description || 'No description', formattedDueDate, inviter, joinLink);

      return res.json({ message: 'Invite sent to existing user' });
    } else {
      const token = crypto.randomBytes(20).toString('hex');
      task.pendingInvites.push({ email, token });
      task.activityLog.push({ user: req.userId, message: `Invite sent to ${email}` });
      await task.save();

      const signupLink = `${process.env.FRONTEND_URL}/signup?invite=${token}&taskId=${task._id}`;
      await sendInviteEmail(email, task.title, task.description || 'No description', formattedDueDate, inviter, signupLink);

      return res.json({ message: 'Invite sent to new email' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ----------------------
// Auto-accept invite
// ----------------------
router.get('/:taskId/auto-accept', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { email } = req.query;

    const user = await User.findOne({ email });
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/signup?inviteTask=${taskId}&email=${email}`);
    }

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).send('Task not found');

    if (!task.collaborators.includes(user._id)) {
      task.collaborators.push(user._id);
      task.activityLog.push({ user: user._id, message: 'Joined task via invite link' });
      await task.save();
    }

    return res.redirect(`${process.env.FRONTEND_URL}/tasks/${taskId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

export default router;
