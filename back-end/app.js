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

// 初始化express应用
const app = express();

// 设置静态文件服务 - 移到最前面确保优先级
console.log('配置静态文件目录:', path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));

// 解析JSON请求体 - 在CORS之前确保能处理请求体
app.use(express.json({ extended: false }));

// 允许的前端来源
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:8080',
  'http://localhost:3000',
  'https://www.mutilife.fun',
  'https://mutilife.fun',
  'https://static-mp-6d87654f-232c-4315-a526-4bc5b0650787.next.bspapp.com'
];

// 增强CORS配置 - 使用origin函数更精确控制
app.use(cors({
  origin: function (origin, callback) {
    // 允许Postman等无来源的请求
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS拒绝来源:', origin);
      callback(new Error('不允许的来源'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 204
}));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - 来源: ${req.headers.origin || '无来源'}`);
  if (req.method === 'POST') {
    console.log('请求体:', req.body);
  }
  next();
});

// ===================== 连接数据库 =====================
connectMongoDB()
  .then(() => console.log('数据库连接成功!'))
  .catch(err => console.error('数据库连接失败:', err));

// 安全性中间件 - 配置Helmet (允许CORS)
app.use(helmet({
  contentSecurityPolicy: false, // 禁用CSP
  crossOriginResourcePolicy: { policy: "cross-origin" }, // 允许跨域资源
  crossOriginOpenerPolicy: false // 禁用opener策略
}));

// 使用Morgan进行HTTP请求日志记录
app.use(morgan('combined', { stream: logger.stream }));

// API限速
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每IP限制100个请求
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: '请求过于频繁，请稍后再试' }
});
app.use('/api', limiter);

// 根路径处理程序
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'MutiLife API服务器正在运行',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 添加诊断路由 - 数据库连接检查
app.get('/api/debug/db', async (req, res) => {
  try {
    const mongoose = require('mongoose');

    // 检查连接状态
    const connectionState = ['断开连接', '已连接', '正在连接', '正在断开连接'];

    // 尝试简单查询以验证连接
    let queryResult = '未测试';
    if (mongoose.connection.readyState === 1) {
      try {
        // 获取所有集合名称
        const collections = await mongoose.connection.db.listCollections().toArray();
        queryResult = `成功! 发现 ${collections.length} 个集合: ${collections.map(c => c.name).join(', ')}`;
      } catch (queryErr) {
        queryResult = `查询失败: ${queryErr.message}`;
      }
    }

    res.json({
      dbState: mongoose.connection.readyState,
      dbStateDesc: connectionState[mongoose.connection.readyState] || '未知状态',
      dbUrl: process.env.MONGODB_URL ? '已设置 (隐藏敏感信息)' : '未设置',
      mongooseVersion: mongoose.version,
      nodeEnv: process.env.NODE_ENV || '未设置',
      queryTest: queryResult,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('数据库调试路由错误:', err);
    res.status(500).json({
      error: err.message,
      stack: process.env.NODE_ENV === 'production' ? '在生产环境中隐藏' : err.stack
    });
  }
});

// 简单的测试数据路由
app.get('/api/test-data', async (req, res) => {
  try {
    res.json({
      success: true,
      message: '测试数据路由成功',
      data: {
        testItems: [
          { id: 1, name: '测试项目1' },
          { id: 2, name: '测试项目2' }
        ]
      },
      env: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('测试数据路由错误:', err);
    res.status(500).json({ error: err.message });
  }
});

// 添加直接测试路由 - 不依赖路由文件
app.post('/direct-login', (req, res) => {
  console.log('收到直接登录请求:', req.body);
  res.json({
    success: true,
    message: '直接登录测试成功',
    body: req.body
  });
});

// 直接在主服务器中添加登录路由作为备份
app.post('/api/direct-auth/login', (req, res) => {
  const { username, password } = req.body;
  console.log('直接登录请求:', { username, password });

  // 简单的用户验证
  if (username === 'admin' && password === 'password') {
    res.json({
      success: true,
      token: 'test-token-12345',
      user: {
        id: '1',
        username: username,
        name: 'Test User',
        role: 'user'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: '用户名或密码不正确'
    });
  }
});

// 添加CORS测试端点
app.get('/api/test-cors', (req, res) => {
  res.json({
    message: 'CORS配置测试成功',
    origin: req.headers.origin || '未知',
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// 加载路由文件并处理潜在错误
console.log('===== 开始加载路由文件 =====');

// 定义路由 - 使用绝对路径并添加错误处理
try {
  console.log('加载auth路由...');
  const authRoutes = require(path.join(__dirname, 'routes', 'authRoutes.js'));
  app.use('/api/auth', authRoutes);
  console.log('auth路由加载成功');
} catch (err) {
  console.error('加载auth路由失败:', err);
  // 如果auth路由加载失败，使用备用auth路由
  const express = require('express');
  const backupAuthRouter = express.Router();

  backupAuthRouter.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('备用登录请求:', { username, password });

    res.json({
      success: true,
      token: 'backup-token-12345',
      message: '使用备用路由登录成功',
      user: {
        id: '999',
        username: username || 'backup-user',
        name: 'Backup User',
        role: 'user'
      }
    });
  });

  app.use('/api/auth', backupAuthRouter);
  console.log('已加载备用auth路由');
}

try {
  console.log('加载users路由...');
  const userRoutes = require(path.join(__dirname, 'routes', 'userRoutes.js'));
  app.use('/api/users', userRoutes);
  console.log('users路由加载成功');
} catch (err) {
  console.error('加载users路由失败:', err);
}

try {
  console.log('加载travel路由...');
  const userRoutes = require(path.join(__dirname, 'routes', 'travelRoutes.js'));
  app.use('/api/travel', userRoutes);
  console.log('travel路由加载成功');
} catch (err) {
  console.error('加载travel路由失败:', err);
}

try {
  console.log('加载planner路由...');
  const plannerRoutes = require(path.join(__dirname, 'routes', 'plannerRoutes.js'));
  app.use('/api/planner', plannerRoutes);
  console.log('planner路由加载成功');
} catch (err) {
  console.error('加载planner路由失败:', err);
}

try {
  console.log('加载friends路由...');
  const friendRoutes = require(path.join(__dirname, 'routes', 'friendRoutes.js'));
  app.use('/api/friends', friendRoutes);
  console.log('friends路由加载成功');
} catch (err) {
  console.error('加载friends路由失败:', err);
}

try {
  console.log('加载location路由...');
  const locationRoutes = require(path.join(__dirname, 'routes', 'locationRoutes.js'));
  app.use('/api/location', locationRoutes);
  console.log('location路由加载成功');
} catch (err) {
  console.error('加载location路由失败:', err);
}

try {
  console.log('加载music路由...');
  const musicRoutes = require(path.join(__dirname, 'routes', 'musicRoutes.js'));
  app.use('/api/music', musicRoutes);
  console.log('music路由加载成功');
} catch (err) {
  console.error('加载music路由失败:', err);
}

try {
  console.log('加载news路由...');
  const newsRoutes = require(path.join(__dirname, 'routes', 'newsRoutes.js'));
  app.use('/api/news', newsRoutes);
  console.log('news路由加载成功');
} catch (err) {
  console.error('加载news路由失败:', err);
}

console.log('===== 路由文件加载完成 =====');

// 提供静态资源（上传文件）
// 检测是否运行在Vercel或其他无服务器环境中
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

// 在无服务器环境中使用/tmp目录，否则使用相对路径
const uploadDirBase = isServerless ? '/tmp' : __dirname;
const uploadPath = process.env.UPLOAD_PATH || './uploads';
const uploadDir = path.join(uploadDirBase, uploadPath.replace(/^\.\//, ''));

app.use('/uploads', express.static(uploadDir));

// 创建上传目录（如果不存在）
const fs = require('fs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`创建上传目录: ${uploadDir}`);
}

// 健康检查路由
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'MutiLife API服务正常运行'
  });
});

// 处理404错误 - 必须在所有路由之后，全局错误处理之前
app.use((req, res, next) => {
  console.log(`404未找到: ${req.method} ${req.path}`);

  // 如果是OPTIONS请求，返回204而不是404
  if (req.method === 'OPTIONS') {
    // 此处明确设置CORS头以确保预检请求能正确处理
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Max-Age', '86400'); // 24小时
      return res.sendStatus(204);
    }
  }

  // 其他请求返回404
  res.status(404).json({
    message: '请求的资源不存在',
    path: req.path
  });
});

// 全局错误处理
app.use(errorHandler);

// 启动服务器
const PORT = process.env.PORT || 9500;
const server = app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`前端可以通过 http://localhost:${PORT} 访问API`);
  console.log(`打开浏览器访问 http://localhost:${PORT}/test.html 测试CORS`);
  console.log(`测试直接登录: http://localhost:${PORT}/direct-login (POST)`);
  console.log(`测试备用登录: http://localhost:${PORT}/api/direct-auth/login (POST)`);
  console.log(`允许的前端来源:`, allowedOrigins);
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