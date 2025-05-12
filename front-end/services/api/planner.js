/**
 * 任务规划器服务API
 * 处理任务的创建、更新、删除和查询
 */

import request from './request';

// API路径前缀
const API_PREFIX = '/planner';

/**
 * 获取所有任务
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 * @param {string} params.status - 任务状态筛选
 * @param {string} params.priority - 优先级筛选
 * @param {string} params.category - 类别筛选
 * @returns {Promise} 任务列表
 */
export const getTasks = (params = {}) => {
  return request.get(`${API_PREFIX}/tasks`, params, true);
};

/**
 * 获取任务详情
 * @param {string} taskId - 任务ID
 * @returns {Promise} 任务详情
 */
export const getTaskById = (taskId) => {
  return request.get(`${API_PREFIX}/tasks/${taskId}`, {}, true);
};

/**
 * 创建新任务
 * @param {Object} taskData - 任务数据
 * @param {string} taskData.title - 任务标题
 * @param {string} taskData.description - 任务描述
 * @param {Date} taskData.dueDate - 截止日期
 * @param {string} taskData.category - 任务类别
 * @param {string} taskData.priority - 优先级
 * @param {string} taskData.status - 任务状态
 * @returns {Promise} 创建结果
 */
export const createTask = (taskData) => {
  return request.post(`${API_PREFIX}/tasks`, taskData, true);
};

/**
 * 更新任务
 * @param {string} taskId - 任务ID
 * @param {Object} taskData - 更新的任务数据
 * @returns {Promise} 更新结果
 */
export const updateTask = (taskId, taskData) => {
  return request.put(`${API_PREFIX}/tasks/${taskId}`, taskData, true);
};

/**
 * 删除任务
 * @param {string} taskId - 任务ID
 * @returns {Promise} 删除结果
 */
export const deleteTask = (taskId) => {
  return request.delete(`${API_PREFIX}/tasks/${taskId}`, {}, true);
};

/**
 * 更新任务状态
 * @param {string} taskId - 任务ID
 * @param {string} status - 新状态
 * @returns {Promise} 更新结果
 */
export const updateTaskStatus = (taskId, status) => {
  return request.put(`${API_PREFIX}/tasks/${taskId}/status`, { status }, true);
};

/**
 * 获取任务统计信息
 * @returns {Promise} 任务统计信息
 */
export const getTaskStats = () => {
  return request.get(`${API_PREFIX}/stats`, {}, true);
};

/**
 * 获取任务分类列表
 * @returns {Promise} 分类列表
 */
export const getCategories = () => {
  return request.get(`${API_PREFIX}/categories`, {}, true);
};

/**
 * 创建新分类
 * @param {Object} categoryData - 分类数据
 * @param {string} categoryData.name - 分类名称
 * @returns {Promise} 创建结果
 */
export const createCategory = (categoryData) => {
  return request.post(`${API_PREFIX}/categories`, categoryData, true);
};

/**
 * 获取今日任务
 * @returns {Promise} 今日任务列表
 */
export const getTodayTasks = () => {
  return request.get(`${API_PREFIX}/tasks/today`, {}, true);
};

/**
 * 获取即将到期任务
 * @param {number} days - 天数范围（可选，默认7天）
 * @returns {Promise} 即将到期任务列表
 */
export const getUpcomingTasks = (days = 7) => {
  return request.get(`${API_PREFIX}/tasks/upcoming`, { days }, true);
};

export default {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getTaskStats,
  getCategories,
  createCategory,
  getTodayTasks,
  getUpcomingTasks
};