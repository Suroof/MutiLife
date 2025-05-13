/**
 * API服务配置
 * 包含API的基础URL和请求超时设置
 */

// 获取当前环境
const isDevelopment = process.env.NODE_ENV !== 'production';


const config = {
  // API基础URL，根据环境变量进行区分
  baseURL: isDevelopment
    ? 'https://www.mutilife.fun/api'  // 开发环境API地址
    : 'https://www.mutilife.fun/api',  // 生产环境API地址

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



export default config;