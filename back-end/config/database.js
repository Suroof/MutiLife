const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false); // 解决弃用警告

const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error('MongoDB URI未定义，请在.env文件中设置MONGODB_URI');
      return;
    }

    await mongoose.connect(mongoURI);
    console.log('MongoDB连接成功');
  } catch (err) {
    console.error('MongoDB连接失败:', err.message);
    // 不要立即退出进程，让服务器继续运行
    // process.exit(1);
  }
};

module.exports = {
  connectMongoDB
};
