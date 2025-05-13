/**
 * 简化版CORS测试服务器
 * 只包含基础的CORS配置和API路由
 */
const express = require('express');
const cors = require('cors');
const path = require('path');

// 创建Express应用
const app = express();

// 允许跨域的前端地址
const allowedOrigins = [
  'http://localhost:5173',  // Vite 默认开发服务器
  'http://127.0.0.1:5173',
  'http://localhost:8080',
  'http://localhost:3000',
  'https://www.mutilife.fun',
  'https://mutilife.netlify.app',
  'https://static-mp-6d87654f-232c-4315-a526-4bc5b0650787.next.bspapp.com'
];

// CORS配置（单独配置以便于调试）
const corsOptions = {
  origin: function (origin, callback) {
    // 允许没有来源的请求（比如Postman）
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS拒绝:', origin);
      // 不返回错误以防止客户端出现报错，只是不发送允许头
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// 配置JSON解析 - 在CORS之前确保能处理请求体
app.use(express.json());

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 配置CORS中间件
app.use(cors(corsOptions));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - 来源: ${req.headers.origin || '无来源'}`);
  if (req.method === 'POST') {
    console.log('请求体:', req.body);
  }
  next();
});

// 手动处理OPTIONS预检请求
app.options('*', (req, res) => {
  console.log('处理OPTIONS请求:', req.path);
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400'); // 24小时
  }

  res.status(204).end();
});

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器运行正常', cors: '启用' });
});

// CORS测试端点
app.get('/api/test-cors', (req, res) => {
  const origin = req.headers.origin || '无来源';
  console.log('CORS测试请求来源:', origin);

  // 明确设置CORS头以确保正确响应
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  res.json({
    message: 'CORS配置正确',
    origin: origin,
    success: true,
    timestamp: new Date().toISOString()
  });
});

// 测试登录端点
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  console.log('登录尝试:', username, password?.length);

  // 明确设置CORS头以确保正确响应
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  if (username && password) {
    res.json({
      success: true,
      message: '登录成功',
      token: 'test-token-123',
      user: { id: 1, username, role: 'user', name: '测试用户' }
    });
  } else {
    res.status(400).json({ success: false, message: '用户名或密码缺失' });
  }
});

// 直接登录端点
app.post('/direct-login', (req, res) => {
  const { username, password } = req.body;
  console.log('直接登录尝试:', username, password?.length);

  // 明确设置CORS头以确保正确响应
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  if (username && password) {
    res.json({
      success: true,
      message: '直接登录成功',
      token: 'direct-token-123',
      user: { id: 1, username, role: 'user', name: '测试用户' }
    });
  } else {
    res.status(400).json({ success: false, message: '用户名或密码缺失' });
  }
});

// 添加模拟音乐API端点
app.get('/api/music/artists/recommended', (req, res) => {
  console.log('接收到推荐艺术家请求');
  console.log('请求头:', JSON.stringify(req.headers, null, 2));

  // 检查授权头部
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: '未提供授权令牌',
      headers: req.headers,
      authHeader
    });
  }

  // 模拟推荐艺术家数据
  const artists = [
    { id: 1, name: '周杰伦', avatar: '/static/artists/jay.jpg', fansCount: 10000000 },
    { id: 2, name: '林俊杰', avatar: '/static/artists/jj.jpg', fansCount: 8000000 },
    { id: 3, name: '陈奕迅', avatar: '/static/artists/eason.jpg', fansCount: 9000000 },
    { id: 4, name: '李荣浩', avatar: '/static/artists/ronghao.jpg', fansCount: 7000000 },
    { id: 5, name: '邓紫棋', avatar: '/static/artists/gem.jpg', fansCount: 8500000 },
    { id: 6, name: '王力宏', avatar: '/static/artists/leehom.jpg', fansCount: 7500000 }
  ];

  // 添加CORS响应头
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  res.json(artists);
});

// 404处理
app.use((req, res) => {
  console.log('404未找到:', req.method, req.path);

  // 如果是OPTIONS请求，返回204
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      res.header('Access-Control-Allow-Credentials', 'true');
    }
    return res.status(204).end();
  }

  res.status(404).json({ message: '未找到请求的资源', path: req.path });
});

// 启动服务器
const PORT = 9500;
app.listen(PORT, () => {
  console.log(`CORS测试服务器运行在 http://localhost:${PORT}`);
  console.log(`测试页面: http://localhost:${PORT}/test.html`);
  console.log(`允许的前端来源:`, allowedOrigins);
  console.log(`访问 http://localhost:${PORT}/api/test-cors 测试CORS配置`);
  console.log(`发送POST请求到 http://localhost:${PORT}/api/auth/login 测试登录`);
});