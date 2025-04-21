const express = require('express');
const { body } = require('express-validator');
const plannerController = require('../controllers/plannerController');
const auth = require('../middleware/auth');

const router = express.Router();

// 验证任务输入
const taskValidation = [
  body('title').not().isEmpty().withMessage('任务标题是必填项'),
  body('dueDate').optional().isISO8601().withMessage('日期格式无效'),
  body('category').optional().isString().withMessage('分类必须是字符串'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('优先级必须是 low、medium 或 high'),
  body('status').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('状态必须是 pending、in-progress 或 completed')
];

// @route   GET api/planner/tasks
// @desc    获取当前登录用户的所有任务
// @access  私有
router.get('/tasks', auth, plannerController.getAllTasks);

// @route   GET api/planner/tasks/:id
// @desc    获取特定任务
// @access  私有
router.get('/tasks/:id', auth, plannerController.getTaskById);

// @route   POST api/planner/tasks
// @desc    创建新任务
// @access  私有
router.post('/tasks', auth, taskValidation, plannerController.createTask);

// @route   PUT api/planner/tasks/:id
// @desc    更新任务
// @access  私有
router.put('/tasks/:id', auth, taskValidation, plannerController.updateTask);

// @route   DELETE api/planner/tasks/:id
// @desc    删除任务
// @access  私有
router.delete('/tasks/:id', auth, plannerController.deleteTask);

// @route   GET api/planner/categories
// @desc    获取用户的任务分类列表
// @access  私有
router.get('/categories', auth, plannerController.getCategories);

// @route   POST api/planner/categories
// @desc    创建新分类
// @access  私有
router.post('/categories',
  auth,
  [body('name').not().isEmpty().withMessage('分类名称是必填项')],
  plannerController.createCategory
);

// @route   GET api/planner/stats
// @desc    获取任务统计信息（按状态、优先级等计数）
// @access  私有
router.get('/stats', auth, plannerController.getTaskStats);

module.exports = router;