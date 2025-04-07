const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// 为每个路由添加OPTIONS处理
const handleOptions = (req, res) => {
  console.log('Handling auth OPTIONS request');
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204);
};

// 为每个路由添加OPTIONS处理
router.options('/login', handleOptions);
router.options('/register', handleOptions);
router.options('/me', handleOptions);
router.options('/refresh', handleOptions);

// @route    POST /api/auth/register
// @desc     注册新用户
// @access   Public
router.post(
  '/register',
  [
    body('username', '用户名必须至少3个字符').isLength({ min: 3 }),
    body('password', '密码必须至少6个字符').isLength({ min: 6 }),
    body('name', '名称字段').optional()
  ],
  authController.register
);

// @route    POST /api/auth/login
// @desc     用户登录
// @access   Public
router.post(
  '/login',
  [
    body('username', '请输入用户名').notEmpty(),
    body('password', '请输入密码').exists()
  ],
  authController.login
);

// @route    GET /api/auth/me
// @desc     获取当前用户信息
// @access   Private
router.get('/me', auth, authController.getMe);

// @route    POST /api/auth/refresh
// @desc     刷新访问令牌
// @access   Private
router.post('/refresh', auth, authController.refreshToken);

module.exports = router;