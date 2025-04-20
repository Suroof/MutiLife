const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectMongoDB } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
require('dotenv').config();

// 设置限速
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每IP限制100个请求
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: '请求过于频繁，请稍后再试' }
});

// 初始化express应用
const app = express();

// 连接到数据库
connectMongoDB();

// 安全性中间件
app.use(helmet());

// 基础中间件
app.use(express.json({ extended: false }));
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Auth-Token'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400  // 预检请求缓存24小时
}));

// 使用Morgan进行HTTP请求日志记录，结合Winston
app.use(morgan('combined', { stream: logger.stream }));

// API限速应用到所有请求
app.use('/api', limiter);

// 为OPTIONS请求添加特殊处理
app.options('*', cors());

// 根路径处理程序
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'MutiLife API服务器正在运行',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 定义路由
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/planner', require('./routes/plannerRoutes'));
app.use('/api/friends', require('./routes/friendRoutes'));
app.use('/api/location', require('./routes/locationRoutes'));
app.use('/api/music', require('./routes/musicRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));

// 提供静态资源（上传文件）
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_PATH || './uploads')));

// 创建上传目录（如果不存在）
const fs = require('fs');
const uploadDir = path.join(__dirname, process.env.UPLOAD_PATH || './uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 健康检查路由
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'MutiLife API服务正常运行'
  });
});

// 添加一个测试CORS配置的端点
app.get('/api/test-cors', (req, res) => {
  res.json({
    message: 'CORS配置测试成功',
    headers: req.headers,
    timestamp: new Date().toISOString()
  });
});

// 生产环境中提供静态资源
if (process.env.NODE_ENV === 'production') {
  // 设置静态文件夹
  app.use(express.static('client/build'));

  // 任何未定义的路由交由React应用处理
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// 全局错误处理中间件（必须在所有路由之后）
app.use(errorHandler);

// 定义端口 - 确保与前端请求匹配
const PORT = process.env.PORT || 9500;  // 修改为9500

// 启动服务器
const server = app.listen(PORT, () => {
  logger.info(`服务器运行在端口 ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  logger.info(`CORS已配置，允许来源: http://localhost:5173`);
});

// 处理未捕获的Promise拒绝
process.on('unhandledRejection', (err) => {
  logger.error(`未处理的Promise拒绝: ${err.message}`);
  logger.error(err.stack);
  // 优雅地关闭服务器
  server.close(() => {
    process.exit(1);
  });
});

// 处理未捕获的异常
process.on('uncaughtException', (err) => {
  logger.error(`未捕获的异常: ${err.message}`);
  logger.error(err.stack);
  // 优雅地关闭服务器
  server.close(() => {
    process.exit(1);
  });
});