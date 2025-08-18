import Task from '../models/Task.js';

export const attachPendingTasks = async (user) => {
  try {
    const tasks = await Task.find({ 'pendingInvites.email': user.email });

    for (const task of tasks) {
      if (!task.collaborators.includes(user._id)) {
        task.collaborators.push(user._id);
      }

      task.pendingInvites = task.pendingInvites.filter(pi => pi.email !== user.email);
      await task.save();
    }
  } catch (err) {
    console.error('Error attaching pending tasks:', err);
  }
};
