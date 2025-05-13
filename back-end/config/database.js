const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectMongoDB = async () => {
  try {
    // 检查MongoDB URL是否存在
    const mongodbUrl = process.env.MONGODB_URL;
    if (!mongodbUrl) {
      console.error('MongoDB URL未定义，请在.env文件中设置MONGODB_URL');
      return;
    }

    console.log('尝试连接到MongoDB...');

    // 连接到MongoDB
    const conn = await mongoose.connect(mongodbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`数据库连接成功! 连接到: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('数据库连接失败:', error.message);
    console.error('错误详情:', error);

    // 在生产环境中不要立即结束进程
    if (process.env.NODE_ENV === 'production') {
      console.error('生产环境中DB连接失败，但服务继续运行');
    } else {
      // 开发环境可以选择退出进程
      // process.exit(1);
    }
  }
};

module.exports = { connectMongoDB };