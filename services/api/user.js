/**
 * 用户资料服务API
 * 处理用户配置文件和设置管理
 */

import request, { uploadFile } from './request';

/**
 * 获取用户资料
 * @returns {Promise} 用户资料
 */
export const getUserProfile = () => {
  return request.get('/users/profile', {}, true);
};

/**
 * 更新用户资料
 * @param {Object} profileData - 资料数据
 * @param {string} profileData.username - 用户名
 * @param {string} profileData.firstName - 名字
 * @param {string} profileData.lastName - 姓氏
 * @param {string} profileData.bio - 个人简介
 * @returns {Promise} 更新结果
 */
export const updateUserProfile = (profileData) => {
  return request.put('/users/profile', profileData, true);
};

/**
 * 更新用户偏好设置
 * @param {Object} preferences - 偏好设置
 * @param {string} preferences.theme - 主题偏好
 * @param {string} preferences.language - 语言偏好
 * @param {Object} preferences.notifications - 通知设置
 * @returns {Promise} 更新结果
 */
export const updateUserPreferences = (preferences) => {
  return request.put('/users/preferences', preferences, true);
};

/**
 * 修改用户密码
 * @param {Object} passwordData - 密码数据
 * @param {string} passwordData.currentPassword - 当前密码
 * @param {string} passwordData.newPassword - 新密码
 * @returns {Promise} 更新结果
 */
export const changePassword = (passwordData) => {
  return request.put('/users/change-password', passwordData, true);
};

/**
 * 上传用户头像
 * @param {string} filePath - 头像文件路径
 * @returns {Promise} 上传结果
 */
export const uploadAvatar = (filePath) => {
  return request.upload('/users/avatar', filePath, 'avatar');
};

/**
 * 获取用户统计信息
 * @returns {Promise} 用户统计信息
 */
export const getUserStats = () => {
  return request.get('/users/stats', {}, true);
};

/**
 * 获取用户资料 (通过ID)
 * @param {string} userId - 用户ID
 * @returns {Promise} 用户资料
 */
export const getUserById = (userId) => {
  // 添加详细的日志
  console.log('正在调用getUserById API, 用户ID:', userId);
  
  // 使用完整URL路径，确保前缀正确
  return request.get(`/users/${userId}`, {}, true)
    .then(response => {
      console.log('getUserById API返回结果:', response);
      return response;
    })
    .catch(error => {
      console.error('getUserById API错误:', error);
      throw error;
    });
};

/**
 * 获取附近的用户
 * @param {Object} params - 查询参数
 * @param {number} params.latitude - 纬度
 * @param {number} params.longitude - 经度
 * @param {number} params.radius - 半径 (km)
 * @param {string} params.gender - 性别过滤
 * @param {boolean} params.onlineOnly - 是否只看在线用户
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 * @returns {Promise} 附近用户列表
 */
export const getNearbyUsers = (params) => {
  return request.get('/users/nearby', params, true);
};

/**
 * 获取好友推荐
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 * @returns {Promise} 推荐好友列表
 */
export const getRecommendedFriends = (params) => {
  return request.get('/users/recommended', params, true);
};

export default {
  getUserProfile,
  updateUserProfile,
  updateUserPreferences,
  changePassword,
  uploadAvatar,
  getUserStats,
  getUserById,
  getNearbyUsers,
  getRecommendedFriends
};