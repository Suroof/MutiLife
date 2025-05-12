const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false); // 解决弃用警告

const connectMongoDB = async () => {
  try {
    const mongoURL = process.env.MONGODB_URL;

    if (!mongoURL) {
      console.error('MongoDB URL未定义，请在.env文件中设置MONGODB_URL');
      return;
    }

    await mongoose.connect(mongoURL);
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
