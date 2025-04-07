const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Task = require('./models/Task');
require('dotenv').config();
const logger = require('./utils/logger');

// 连接到数据库
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  logger.info('MongoDB 已连接，开始添加种子数据...');

  try {
    // 清空集合
    await User.deleteMany({});
    await Task.deleteMany({});

    // 创建管理员用户
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      name: '管理员',
      role: 'admin',
      isVerified: true,
      preferences: {
        theme: 'dark',
        notifications: true,
        language: 'zh'
      }
    });

    logger.info(`管理员用户已创建: ${admin.email}`);

    // 创建测试用户
    const userPassword = await bcrypt.hash('user123', salt);
    const user = await User.create({
      username: 'testuser',
      email: 'user@example.com',
      password: userPassword,
      name: '测试用户',
      role: 'user',
      isVerified: true,
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'zh'
      }
    });

    logger.info(`测试用户已创建: ${user.email}`);

    // 创建任务
    const tasks = [
      {
        title: '完成项目文档',
        description: '编写MutiLife项目的详细文档',
        dueDate: new Date('2025-04-05'),
        category: '工作',
        priority: 'high',
        status: 'completed',
        completedAt: new Date(),
        user: admin._id,
        color: '#4A90E2'
      },
      {
        title: '前端开发',
        description: '实现用户界面和交互功能',
        dueDate: new Date('2025-04-15'),
        category: '开发',
        priority: 'medium',
        status: 'in-progress',
        user: admin._id,
        color: '#50E3C2'
      },
      {
        title: '后端API测试',
        description: '测试所有后端API接口',
        dueDate: new Date('2025-04-20'),
        category: '测试',
        priority: 'medium',
        status: 'pending',
        user: admin._id,
        color: '#F5A623'
      },
      {
        title: '准备周会',
        description: '整理本周工作进度报告',
        dueDate: new Date('2025-04-08'),
        category: '会议',
        priority: 'low',
        status: 'pending',
        user: user._id,
        color: '#D0021B'
      },
      {
        title: '学习React',
        description: '完成React基础教程',
        dueDate: new Date('2025-04-25'),
        category: '学习',
        priority: 'high',
        status: 'pending',
        user: user._id,
        color: '#9013FE'
      }
    ];

    await Task.insertMany(tasks);

    logger.info(`已添加 ${tasks.length} 个任务`);
    logger.info('种子数据添加完成！');

  } catch (error) {
    logger.error('添加种子数据时出错:', error);
  } finally {
    mongoose.disconnect();
    logger.info('MongoDB 连接已关闭');
  }
});