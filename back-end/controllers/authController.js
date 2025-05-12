const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const config = require('../config');

/**
 * 用户注册
 * @route POST /api/auth/register
 * @access Public
 */
exports.register = async (req, res) => {
  // 验证请求
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { username, password, name } = req.body;

  try {
    // 检查用户名是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: '用户名已被使用' });
    }

    // 创建新用户
    const user = new User({
      username,
      password, // 密码会在模型的pre save钩子中自动加密
      name: name || username,
      isVerified: true // 跳过验证步骤
    });

    await user.save();

    // 生成JWT令牌
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          token,
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    console.error('注册错误:', err.message);
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 用户登录
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = async (req, res) => {
  // 验证请求
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { username, password } = req.body;

  // 添加调试日志
  console.log('登录尝试:', { username });

  try {
    // 查找用户
    const user = await User.findOne({ username });

    console.log('用户查询结果:', user ? '找到用户' : '未找到用户');

    if (!user) {
      console.log('登录失败: 用户不存在');
      return res.status(401).json({ message: '用户名或密码不正确' });
    }

    // 密码验证 - 直接使用bcrypt比较
    console.log('开始验证密码');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('密码验证结果:', isMatch ? '密码匹配' : '密码不匹配');

    if (!isMatch) {
      console.log('登录失败: 密码不匹配');
      return res.status(401).json({ message: '用户名或密码不正确' });
    }

    console.log('登录成功: 用户ID =', user.id);

    // 更新最后登录时间
    user.lastLogin = Date.now();
    await user.save();

    // 生成JWT令牌
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn },
      (err, token) => {
        if (err) {
          console.error('JWT生成错误:', err);
          throw err;
        }
        console.log('JWT令牌已生成');
        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    console.error('登录错误:', err.message);
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 获取当前用户
 * @route GET /api/auth/me
 * @access Private
 */
exports.getMe = async (req, res) => {
  try {
    // req.user.id 来自 auth 中间件
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json(user);
  } catch (err) {
    console.error('获取用户错误:', err.message);
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 刷新令牌
 * @route POST /api/auth/refresh
 * @access Private
 */
exports.refreshToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 生成新的令牌
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('刷新令牌错误:', err.message);
    res.status(500).json({ message: '服务器错误' });
  }
};