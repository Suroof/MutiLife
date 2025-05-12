/**
 * 位置相关 API 服务
 * 处理用户位置和附近的人功能
 */

import request from './request';

/**
 * 更新用户位置
 * @param {Object} data - 位置数据
 * @param {number} data.longitude - 经度
 * @param {number} data.latitude - 纬度
 * @param {string} data.city - 城市名
 * @param {string} data.address - 详细地址
 * @param {number} data.accuracy - 精度（米）
 * @param {boolean} data.isVisible - 是否可见
 * @returns {Promise} 更新结果
 */
export const updateLocation = (data) => {
  return request.put('/location', data, true);
};

/**
 * 获取附近的用户
 * @param {Object} params - 查询参数
 * @param {number} params.radius - 半径（千米）
 * @param {number} params.limit - 每页数量
 * @param {number} params.page - 页码
 * @param {string} params.gender - 性别筛选
 * @param {boolean} params.onlineOnly - 是否只看在线用户
 * @returns {Promise} 附近用户列表
 */
export const getNearbyUsers = (params) => {
  return request.get('/location/nearby', params, true);
};

export default {
  updateLocation,
  getNearbyUsers
};
