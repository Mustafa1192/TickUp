import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    trim: true,
    default: '',
  },

  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },

  deadline: {
    type: Date,
    default: null,
  },

  collaborators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: []
    }
  ],
  pendingInvites: {
    type: [
      {
        email: { type: String },
        token: { type: String }
      }
    ],
    default: []
  },
  activityLog: {
  type: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      message: String,
      at: { type: Date, default: Date.now }
    }
  ],
  default: []
},

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  important: {
    type: Boolean,
    default: false,
  },

  deleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // <-- enables createdAt and updatedAt
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
