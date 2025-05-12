const { validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, bio, phoneNumber } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // Update fields
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
exports.updateUserPreferences = async (req, res) => {
  const { theme, notifications, language } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // Update preferences
    if (theme) user.preferences.theme = theme;
    if (notifications !== undefined) user.preferences.notifications = notifications;
    if (language) user.preferences.language = language;

    await user.save();
    res.json(user.preferences);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '当前密码不正确' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: '密码已成功更新' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    Update avatar
// @route   PUT /api/users/avatar
// @access  Private
exports.updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '请上传头像文件' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // Update avatar
    user.avatar = req.file.filename;
    await user.save();

    res.json({ avatar: user.avatar });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:userId
// @access  Private
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .select('-__v');

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 构建响应数据，添加必要字段
    const userData = {
      id: user._id,
      username: user.username,
      nickname: user.name || user.username,
      avatar: user.avatar ? `/uploads/${user.avatar}` : '/static/images/avatar/default.jpg',
      coverImage: user.coverImage ? `/uploads/${user.coverImage}` : '/static/images/cover/default.jpg',
      location: user.location || '',
      birthday: user.birthday || '',
      joinDate: user.createdAt,
      bio: user.bio || '',
      friendSince: '', // 这应该从朋友关系集合中获取
      tags: user.tags || []
    };

    res.json({ success: true, data: userData });
  } catch (err) {
    console.error('获取用户资料失败:', err.message);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    Get nearby users
// @route   GET /api/users/nearby
// @access  Private
exports.getNearbyUsers = async (req, res) => {
  try {
    const { latitude, longitude, radius = 50, gender, onlineOnly, page = 1, limit = 10 } = req.query;

    // 验证必要参数
    if (!latitude || !longitude) {
      return res.status(400).json({ message: '缺少位置信息' });
    }

    // 构建查询条件
    const query = { _id: { $ne: req.user.id } }; // 排除当前用户

    if (gender && gender !== 'all') {
      query.gender = gender;
    }

    if (onlineOnly === 'true') {
      query.isOnline = true;
    }

    // 地理位置查询 (如果MongoDB配置了地理索引)
    // 这里是一个简化的实现，实际应该使用MongoDB的地理空间查询

    // 分页
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 查询用户
    const users = await User.find(query)
      .select('_id username name avatar gender location lastActive createdAt bio')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ lastActive: -1 });

    // 获取总数
    const total = await User.countDocuments(query);

    // 转换为前端需要的格式
    const formattedUsers = users.map(user => {
      // 计算随机距离 (实际应该基于真实坐标计算)
      const distance = (Math.random() * 10).toFixed(1) + 'km';

      // 计算最后活跃时间
      const now = new Date();
      const lastActive = user.lastActive ? user.lastActive : user.createdAt;
      const diffInMinutes = Math.floor((now - lastActive) / (1000 * 60));

      let lastActiveText;
      if (diffInMinutes < 5) {
        lastActiveText = '刚刚';
      } else if (diffInMinutes < 60) {
        lastActiveText = `${diffInMinutes}分钟前`;
      } else if (diffInMinutes < 1440) {
        lastActiveText = `${Math.floor(diffInMinutes / 60)}小时前`;
      } else {
        lastActiveText = `${Math.floor(diffInMinutes / 1440)}天前`;
      }

      return {
        userId: user._id,
        nickname: user.name || user.username,
        avatar: user.avatar ? `/uploads/${user.avatar}` : '/static/images/avatar/default.jpg',
        gender: user.gender || 'male',
        distance,
        statusText: user.bio || '想认识新朋友',
        online: (diffInMinutes < 15), // 15分钟内活跃视为在线
        lastActive: lastActiveText,
        isFriend: false // 实际应该检查朋友关系
      };
    });

    res.json({
      success: true,
      data: {
        users: formattedUsers,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('获取附近用户失败:', err.message);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    Get recommended friends
// @route   GET /api/users/recommended
// @access  Private
exports.getRecommendedFriends = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // 构建查询条件
    const query = { _id: { $ne: req.user.id } }; // 排除当前用户

    // 这里应该有更复杂的推荐算法，比如基于兴趣、位置、共同好友等
    // 简化实现，随机推荐用户

    // 分页
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 查询用户
    const users = await User.find(query)
      .select('_id username name avatar gender location bio')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // 获取总数
    const total = await User.countDocuments(query);

    // 转换为前端需要的格式
    const formattedUsers = users.map(user => {
      // 随机相似度
      const similarity = Math.floor(Math.random() * 5) + 1;
      const reasons = [
        '可能认识的人',
        '有共同爱好',
        '位置相近',
        '推荐好友',
        '新用户'
      ];

      return {
        userId: user._id,
        nickname: user.name || user.username,
        avatar: user.avatar ? `/uploads/${user.avatar}` : '/static/images/avatar/default.jpg',
        gender: user.gender || 'male',
        bio: user.bio || '想认识新朋友',
        similarity, // 相似度星级 1-5
        reason: reasons[Math.floor(Math.random() * reasons.length)]
      };
    });

    res.json({
      success: true,
      data: {
        users: formattedUsers,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('获取推荐好友失败:', err.message);
    res.status(500).json({ message: '服务器错误' });
  }
};
