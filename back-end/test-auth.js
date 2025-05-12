const express = require('express');
const cors = require('cors');
const app = express();

// 启用CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// 解析JSON请求体
app.use(express.json());

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('请求体:', req.body);
  next();
});

// 根路由
app.get('/', (req, res) => {
  res.json({ message: 'Auth测试服务器运行正常' });
});

// 登录路由
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  console.log('登录请求:', { username, password });

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

// 注册路由
app.post('/api/auth/register', (req, res) => {
  const { username, password, name } = req.body;
  console.log('注册请求:', { username, password, name });

  res.status(201).json({
    success: true,
    token: 'test-token-12345',
    user: {
      id: '2',
      username: username,
      name: name || username,
      role: 'user'
    }
  });
});

// 获取用户信息
app.get('/api/auth/me', (req, res) => {
  // 简单模拟认证
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未授权' });
  }

  res.json({
    id: '1',
    username: 'admin',
    name: 'Test User',
    role: 'user',
    email: 'test@example.com'
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ message: '资源不存在' });
});

// 启动服务器
const PORT = 9600;
app.listen(PORT, () => {
  console.log(`Auth测试服务器运行在端口 ${PORT}`);
  console.log(`尝试访问 http://localhost:${PORT}/api/auth/login 测试登录`);
});