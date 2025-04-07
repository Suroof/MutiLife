/**
 * API服务配置
 * 包含API的基础URL和请求超时设置
 */

// 获取当前环境
const isDevelopment = process.env.NODE_ENV !== 'production';

// 调试信息
console.log('API配置初始化', {
  环境: isDevelopment ? '开发环境' : '生产环境',
  NODE_ENV: process.env.NODE_ENV
});

const config = {
  // API基础URL，根据环境变量进行区分
  baseURL: isDevelopment
    ? 'http://localhost:9500/api'  // 开发环境API地址
    : 'https://your-production-api.com/api',  // 生产环境API地址

  // 请求超时时间（毫秒）
  timeout: 15000, // 15秒

  // 请求头设置
  headers: {
    'Content-Type': 'application/json'
  },

  // 上传文件的请求头设置
  uploadHeaders: {
    'Content-Type': 'multipart/form-data'
  },

  // Token存储键名
  tokenKey: 'mutilife_token',

  // 刷新Token路径
  refreshTokenPath: '/auth/refresh'
};

// 输出最终配置
console.log('API最终配置:', {
  baseURL: config.baseURL,
  timeout: config.timeout
});

export default config;