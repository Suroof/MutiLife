const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const mongoose = require('mongoose');

// @route   GET api/planner/tasks
// @desc    Get all tasks for the logged in user
// @access  Private
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/planner/tasks/:id
// @desc    Get a specific task
// @access  Private
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(task);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @route   POST api/planner/tasks
// @desc    Create a new task
// @access  Private
exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, dueDate, category, priority, status } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      category,
      priority: priority || 'medium',
      status: status || 'pending',
      user: req.user.id
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/planner/tasks/:id
// @desc    Update a task
// @access  Private
exports.updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, dueDate, category, priority, status } = req.body;

  // Build task object
  const taskFields = {};
  if (title) taskFields.title = title;
  if (description) taskFields.description = description;
  if (dueDate) taskFields.dueDate = dueDate;
  if (category) taskFields.category = category;
  if (priority) taskFields.priority = priority;
  if (status) taskFields.status = status;

  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskFields },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @route   DELETE api/planner/tasks/:id
// @desc    Delete a task
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Task.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @route   GET api/planner/categories
// @desc    Get all task categories for the user
// @access  Private
exports.getCategories = async (req, res) => {
  try {
    // Find all distinct categories for the user
    const categories = await Task.distinct('category', { user: req.user.id });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST api/planner/categories
// @desc    Create a new category (though in MongoDB this is just a task with a new category)
// @access  Private
exports.createCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name } = req.body;

  try {
    // Check if this category already exists for the user
    const existingCategories = await Task.distinct('category', { user: req.user.id });

    if (existingCategories.includes(name)) {
      return res.status(400).json({ msg: 'Category already exists' });
    }

    // For MongoDB, we don't need a separate categories collection
    // We can just return the new category name
    res.json({ name });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/planner/stats
// @desc    Get task statistics (counts by status, priority, etc.)
// @access  Private
exports.getTaskStats = async (req, res) => {
  try {
    const statusCounts = await Task.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const priorityCounts = await Task.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const categoryCounts = await Task.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const upcomingTasks = await Task.find({
      user: req.user.id,
      status: { $ne: 'completed' },
      dueDate: { $gte: new Date() }
    }).sort({ dueDate: 1 }).limit(5);

    res.json({
      status: statusCounts,
      priority: priorityCounts,
      category: categoryCounts,
      upcoming: upcomingTasks
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
