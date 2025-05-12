/**
 * 端口测试服务器
 * 在9501端口上运行一个基本的API服务器
 */
const express = require('express');
const cors = require('cors');

// 创建Express应用
const app = express();

// 允许所有跨域请求
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// 解析JSON请求体
app.use(express.json());

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('请求头:', JSON.stringify(req.headers, null, 2));
  next();
});

// 测试端点
app.get('/api/test', (req, res) => {
  res.json({
    message: '测试成功',
    port: 9501,
    headers: req.headers,
    timestamp: new Date().toISOString()
  });
});

// 模拟音乐API端点
app.get('/api/music/artists/recommended', (req, res) => {
  console.log('接收到推荐艺术家请求');

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

  res.json(artists);
});

// 处理OPTIONS请求
app.options('*', (req, res) => {
  res.status(204).end();
});

// 处理404错误
app.use((req, res) => {
  res.status(404).json({ message: '资源不存在', path: req.path });
});

// 启动服务器
const PORT = 9501;
app.listen(PORT, () => {
  console.log(`测试服务器运行在 http://localhost:${PORT}`);
  console.log(`测试端点: http://localhost:${PORT}/api/test`);
  console.log(`音乐API: http://localhost:${PORT}/api/music/artists/recommended`);
});