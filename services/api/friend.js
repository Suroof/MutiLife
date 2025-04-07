/**
 * 好友相关 API 服务
 * 处理好友关系和请求管理
 */

import request from './request';

/**
 * 获取好友列表
 * @returns {Promise} 好友列表
 */
export const getFriends = () => {
  return request.get('/friends', {}, true);
};

/**
 * 获取好友请求列表
 * @returns {Promise} 好友请求列表
 */
export const getFriendRequests = () => {
  return request.get('/friends/requests', {}, true);
};

/**
 * 发送好友请求
 * @param {Object} data - 请求数据
 * @param {string} data.receiverId - 接收者ID
 * @param {string} data.message - 请求消息
 * @returns {Promise} 发送结果
 */
export const sendFriendRequest = (data) => {
  return request.post('/friends/requests', data, true);
};

/**
 * 接受好友请求
 * @param {string} requestId - 请求ID
 * @returns {Promise} 操作结果
 */
export const acceptFriendRequest = (requestId) => {
  return request.put(`/friends/requests/${requestId}/accept`, {}, true);
};

/**
 * 拒绝好友请求
 * @param {string} requestId - 请求ID
 * @returns {Promise} 操作结果
 */
export const rejectFriendRequest = (requestId) => {
  return request.put(`/friends/requests/${requestId}/reject`, {}, true);
};

/**
 * 获取与指定好友的关系信息
 * @param {string} friendId - 好友ID
 * @returns {Promise} 好友关系信息
 */
export const getFriendship = (friendId) => {
  console.log('正在获取好友关系数据，好友ID:', friendId);
  return request.get(`/friends/${friendId}/relationship`, {}, true)
    .then(response => {
      console.log('获取好友关系成功:', response);
      return response;
    })
    .catch(error => {
      console.error('获取好友关系失败:', error);
      throw error;
    });
};

/**
 * 删除好友
 * @param {string} friendId - 好友ID
 * @returns {Promise} 操作结果
 */
export const removeFriend = (friendId) => {
  return request.delete(`/friends/${friendId}`, {}, true);
};

/**
 * 更新好友信息（标签、备注）
 * @param {string} friendId - 好友ID
 * @param {Object} data - 更新数据
 * @param {Array} data.tags - 标签数组
 * @param {string} data.notes - 备注
 * @returns {Promise} 操作结果
 */
export const updateFriendInfo = (friendId, data) => {
  return request.put(`/friends/${friendId}`, data, true);
};

export default {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  updateFriendInfo,
  getFriendship
};
