const { validationResult } = require('express-validator');
const UserLocation = require('../models/UserLocation');
const User = require('../models/User');

/**
 * 更新用户位置
 * @route   PUT /api/location
 * @access  Private
 */
exports.updateLocation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { longitude, latitude, city, address, accuracy, isVisible } = req.body;

  try {
    // 验证经纬度
    if (!longitude || !latitude) {
      return res.status(400).json({ message: '经纬度不能为空' });
    }

    // 查找并更新用户位置，如果不存在则创建
    const userLocation = await UserLocation.findOneAndUpdate(
      { userId: req.user.id },
      {
        coordinates: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        },
        city: city || '',
        address: address || '',
        accuracy: accuracy || 0,
        isVisible: isVisible === undefined ? true : isVisible,
        lastUpdated: Date.now()
      },
      { upsert: true, new: true }
    );

    // 更新用户的位置信息
    if (city) {
      await User.findByIdAndUpdate(req.user.id, { location: city });
    }

    res.json({ success: true, location: userLocation });
  } catch (err) {
    console.error('更新位置失败:', err.message);
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 获取附近的用户
 * @route   GET /api/location/nearby
 * @access  Private
 */
exports.getNearbyUsers = async (req, res) => {
  try {
    const { radius = 10, limit = 20, page = 1, gender, onlineOnly } = req.query;
    
    // 先获取当前用户的位置
    const userLocation = await UserLocation.findOne({ userId: req.user.id });
    
    if (!userLocation || !userLocation.coordinates) {
      return res.status(400).json({ message: '请先更新您的位置' });
    }
    
    // 构建查询条件
    const query = { 
      userId: { $ne: req.user.id }, // 排除自己
      isVisible: true // 只查询可见的用户
    };
    
    // 添加位置查询条件
    query.coordinates = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: userLocation.coordinates.coordinates
        },
        $maxDistance: parseInt(radius) * 1000 // 转换为米
      }
    };
    
    // 用户筛选条件
    const userFilter = {};
    
    if (gender && gender !== 'all') {
      userFilter.gender = gender;
    }
    
    if (onlineOnly === 'true') {
      userFilter.isOnline = true;
    }
    
    // 获取附近的用户位置
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const nearbyLocations = await UserLocation.find(query)
      .skip(skip)
      .limit(parseInt(limit));
    
    // 获取对应用户ID
    const userIds = nearbyLocations.map(location => location.userId);
    
    // 获取用户信息
    const users = await User.find({ 
      _id: { $in: userIds },
      ...userFilter
    }).select('_id username name avatar bio gender lastActive isOnline location');
    
    // 计算距离并整合数据
    const nearbyUsers = users.map(user => {
      const location = nearbyLocations.find(loc => 
        loc.userId.toString() === user._id.toString()
      );
      
      // 计算距离（米）
      const distance = location ? 
        calculateDistance(
          userLocation.coordinates.coordinates,
          location.coordinates.coordinates
        ) : null;
      
      // 格式化距离
      let distanceText;
      if (distance !== null) {
        if (distance < 1000) {
          distanceText = `${Math.round(distance)}米`;
        } else {
          distanceText = `${(distance / 1000).toFixed(1)}公里`;
        }
      } else {
        distanceText = '未知距离';
      }
      
      // 计算最后活跃时间
      let lastActiveText = '最近在线';
      if (user.lastActive) {
        const now = new Date();
        const lastActive = new Date(user.lastActive);
        const diffMinutes = Math.floor((now - lastActive) / (1000 * 60));
        
        if (diffMinutes < 1) {
          lastActiveText = '刚刚在线';
        } else if (diffMinutes < 60) {
          lastActiveText = `${diffMinutes}分钟前`;
        } else if (diffMinutes < 24 * 60) {
          lastActiveText = `${Math.floor(diffMinutes / 60)}小时前`;
        } else {
          lastActiveText = `${Math.floor(diffMinutes / (60 * 24))}天前`;
        }
      }
      
      return {
        userId: user._id,
        username: user.username,
        nickname: user.name || user.username,
        avatar: user.avatar,
        gender: user.gender,
        bio: user.bio,
        location: user.location,
        isOnline: user.isOnline,
        distance: distanceText,
        lastActive: lastActiveText
      };
    });
    
    // 计算总数
    const total = await UserLocation.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        users: nearbyUsers,
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

/**
 * 辅助函数 - 计算两点之间的距离（米）
 */
function calculateDistance(coords1, coords2) {
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;
  
  const R = 6371e3; // 地球半径（米）
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // 距离（米）
};
