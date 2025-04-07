/**
 * 认证服务API
 * 处理用户注册、登录、刷新令牌等功能
 */

import request, { setToken, clearToken, getToken } from './request';

/**
 * 用户注册
 * @param {Object} userData - 用户注册数据
 * @param {string} userData.username - 用户名
 * @param {string} userData.password - 密码
 * @param {string} [userData.name] - 显示名称 (可选)
 * @returns {Promise} 注册结果
 */
export const register = (userData) => {
  return request.post('/auth/register', userData);
};

/**
 * 用户登录
 * @param {Object} credentials - 登录凭证
 * @param {string} credentials.username - 用户名
 * @param {string} credentials.password - 密码
 * @returns {Promise} 登录结果，包含令牌
 */
export const login = async (credentials) => {
  try {
    console.log('发送登录请求:', {
      username: credentials.username,
      passwordLength: credentials.password.length
    });

    // 确保我们的请求是完整的
    if (!credentials.username || !credentials.password) {
      throw new Error('用户名和密码不能为空');
    }

    const response = await request.post('/auth/login', credentials);
    console.log('登录响应:', response);

    // 保存返回的令牌
    if (response && response.token) {
      console.log('设置令牌');
      setToken(response.token);
    } else {
      console.warn('未收到令牌');
    }

    return response;
  } catch (error) {
    console.error('登录失败:', error);
    // 添加详细的错误信息
    const errorMessage = error.message || '登录失败，请稍后再试';
    throw new Error(errorMessage);
  }
};

/**
 * 用户登出
 * 清除本地存储的令牌
 */
export const logout = () => {
  clearToken();
  // 可以在这里添加其他清理操作
};

/**
 * 刷新认证令牌
 * @returns {Promise} 新的令牌
 */
export const refreshToken = async () => {
  const currentToken = getToken();

  if (!currentToken) {
    throw new Error('无令牌可刷新');
  }

  try {
    const response = await request.post('/auth/refresh', {}, true);

    if (response && response.token) {
      setToken(response.token);
    }

    return response;
  } catch (error) {
    clearToken();
    throw error;
  }
};

/**
 * 获取当前登录用户信息
 * @returns {Promise} 用户信息
 */
export const getCurrentUser = () => {
  return request.get('/auth/me', {}, true);
};

export default {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser
};