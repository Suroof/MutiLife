const express = require('express');
const { body } = require('express-validator');
const plannerController = require('../controllers/plannerController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validate task input
const taskValidation = [
  body('title').not().isEmpty().withMessage('Task title is required'),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
  body('category').optional().isString().withMessage('Category must be a string'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('status').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('Status must be pending, in-progress, or completed')
];

// @route   GET api/planner/tasks
// @desc    Get all tasks for the logged in user
// @access  Private
router.get('/tasks', auth, plannerController.getAllTasks);

// @route   GET api/planner/tasks/:id
// @desc    Get a specific task
// @access  Private
router.get('/tasks/:id', auth, plannerController.getTaskById);

// @route   POST api/planner/tasks
// @desc    Create a new task
// @access  Private
router.post('/tasks', auth, taskValidation, plannerController.createTask);

// @route   PUT api/planner/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/tasks/:id', auth, taskValidation, plannerController.updateTask);

// @route   DELETE api/planner/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/tasks/:id', auth, plannerController.deleteTask);

// @route   GET api/planner/categories
// @desc    Get all task categories for the user
// @access  Private
router.get('/categories', auth, plannerController.getCategories);

// @route   POST api/planner/categories
// @desc    Create a new category
// @access  Private
router.post('/categories',
  auth,
  [body('name').not().isEmpty().withMessage('Category name is required')],
  plannerController.createCategory
);

// @route   GET api/planner/stats
// @desc    Get task statistics (counts by status, priority, etc.)
// @access  Private
router.get('/stats', auth, plannerController.getTaskStats);

module.exports = router;
