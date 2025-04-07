/**
 * API服务主入口
 * 导出所有API服务
 */

import config from './config';
import request, {
  getToken,
  setToken,
  clearToken,
  isAuthenticated,
  createAuthHeaders
} from './request';
import authService from './auth';
import userService from './user';
import plannerService from './planner';

// 创建API服务集合
const api = {
  // 配置
  config,

  // 核心请求方法
  request,

  // 认证工具
  auth: {
    ...authService,
    getToken,
    setToken,
    clearToken,
    isAuthenticated,
    createAuthHeaders
  },

  // 用户服务
  user: userService,

  // 任务规划器服务
  planner: plannerService
};

/**
 * API服务初始化
 * 可以在应用启动时调用，进行初始化配置
 * @param {Object} options - 初始化选项
 * @param {string} options.baseURL - 可选，API基础URL
 * @param {number} options.timeout - 可选，请求超时时间
 * @returns {Object} API服务实例
 */
export const initAPI = (options = {}) => {
  // 更新配置
  if (options.baseURL) {
    config.baseURL = options.baseURL;
  }

  if (options.timeout) {
    config.timeout = options.timeout;
  }

  return api;
};

export default api;