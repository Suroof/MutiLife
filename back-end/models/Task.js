const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  dueDate: {
    type: Date
  },
  category: {
    type: String,
    default: 'General'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  completedAt: {
    type: Date
  },
  reminders: [
    {
      time: {
        type: Date,
        required: true
      },
      sent: {
        type: Boolean,
        default: false
      }
    }
  ],
  color: {
    type: String,
    default: '#4A90E2' // Default blue color
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
TaskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Set completedAt when status changes to 'completed'
TaskSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = Date.now();
  }
  next();
});

// Add indexes for better query performance
TaskSchema.index({ user: 1, dueDate: 1 });
TaskSchema.index({ user: 1, status: 1 });
TaskSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('task', TaskSchema);
