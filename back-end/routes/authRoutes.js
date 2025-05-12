const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// 允许的前端来源（与主服务器保持一致）
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:8080',
  'http://localhost:3000'
];

// 为整个路由器添加OPTIONS处理
router.options('*', (req, res) => {
  console.log('Auth路由处理OPTIONS请求:', req.path);

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400'); // 24小时
  }

  res.sendStatus(204);
});

// 添加测试路由 - 不依赖控制器
router.post('/direct-test', (req, res) => {
  console.log('Auth直接测试路由收到请求:', req.body);
  res.json({
    success: true,
    message: 'Auth路由直接测试成功',
    body: req.body
  });
});

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
// @desc
// @access   Private
router.get('/me', auth, authController.getMe);

// @route    POST /api/auth/refresh
// @desc     刷新访问令牌
// @access   Private
router.post('/refresh', auth, authController.refreshToken);

module.exports = router;