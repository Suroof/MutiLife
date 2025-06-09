/**
 * API请求工具
 * 封装请求方法，处理错误和认证
 */

import config from "./config";

/**
 * 获取存储的认证令牌
 * @returns {string|null} 认证令牌或null
 */
export const getToken = () => {
  return uni.getStorageSync(config.tokenKey);
};

/**
 * 设置认证令牌到本地存储
 * @param {string} token - JWT令牌
 */
export const setToken = (token) => {
  uni.setStorageSync(config.tokenKey, token);
};

/**
 * 清除认证令牌
 */
export const clearToken = () => {
  uni.removeStorageSync(config.tokenKey);
};

/**
 * 检查是否有认证令牌
 * @returns {boolean} 是否已认证
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * 创建带认证头的请求头
 * @param {Object} headers - 额外的请求头
 * @returns {Object} 合并后的请求头
 */
export const createAuthHeaders = (headers = {}) => {
  const token = getToken();
  if (token) {
    return {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return headers;
};

/**
 * 请求错误处理
 * @param {Object} error - 错误对象
 * @throws {Error} 统一格式的错误
 */
const handleRequestError = (error) => {
  console.error('API请求错误:', error);

  const errorMessage = error?.data?.message || error.errMsg || "请求失败";

  // 处理网络连接错误
  if (error.errMsg && error.errMsg.includes('request:fail')) {
    uni.showToast({
      title: "无法连接到服务器，请检查网络连接",
      icon: "none",
      duration: 3000
    });
    throw new Error("无法连接到服务器，请检查网络连接");
  }

  // 处理未授权错误（401）
  if (error.statusCode === 401) {
    // 清除令牌并跳转到登录页
    clearToken();
    uni.showToast({
      title: "登录已过期，请重新登录",
      icon: "none",
    });

    // 延迟跳转，让用户有时间看到提示
    setTimeout(() => {
      uni.reLaunch({
        url: "/pages/login/login",
      });
    }, 1500);
  } else {
    // 显示错误消息
    uni.showToast({
      title: errorMessage,
      icon: "none",
    });
  }

  throw new Error(errorMessage);
};

/**
 * 通用请求方法
 * @param {Object} options - 请求选项
 * @returns {Promise} 请求结果Promise
 */
export const request = (options) => {
  return new Promise((resolve, reject) => {
    const { url, method = "GET", data, headers = {}, auth = false } = options;

    // 设置请求头
    const requestHeaders = auth
      ? createAuthHeaders({
          ...config.headers,
          ...headers,
        })
      : {
          ...config.headers,
          ...headers,
        };

    // 发起请求
    uni.request({
      url: `${config.baseURL}${url}`,
      method,
      data,
      header: requestHeaders,
      timeout: config.timeout,
      withCredentials: true,  // 明确启用跨域凭证
      success: (res) => {
        // 处理成功响应
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          reject({
            statusCode: res.statusCode,
            data: res.data,
          });
        }
      },
      fail: (err) => {
        reject({
          statusCode: 0,
          errMsg: err.errMsg,
        });
      },
    });
  }).catch(handleRequestError);
};

/**
 * 文件上传方法
 * @param {Object} options - 上传选项
 * @returns {Promise} 上传结果Promise
 */
export const uploadFile = (options) => {
  return new Promise((resolve, reject) => {
    const { url, filePath, name, formData = {}, auth = true } = options;

    // 设置请求头
    const requestHeaders = auth
      ? createAuthHeaders({
          ...config.uploadHeaders,
        })
      : {
          ...config.uploadHeaders,
        };

    // 发起上传请求
    uni.uploadFile({
      url: `${config.baseURL}${url}`,
      filePath,
      name,
      formData,
      header: requestHeaders,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 解析响应JSON
          try {
            const data = JSON.parse(res.data);
            resolve(data);
          } catch (e) {
            resolve(res.data);
          }
        } else {
          reject({
            statusCode: res.statusCode,
            data: res.data,
          });
        }
      },
      fail: (err) => {
        reject({
          statusCode: 0,
          errMsg: err.errMsg,
        });
      },
    });
  }).catch(handleRequestError);
};

// 导出便捷请求方法
export default {
  /**
   * GET请求
   * @param {string} url - 请求路径
   * @param {Object} params - 查询参数
   * @param {boolean} auth - 是否需要认证
   * @returns {Promise} 请求结果Promise
   */
  get: (url, params = {}, auth = false) => {
    return request({
      url: params ? `${url}?${new URLSearchParams(params)}` : url,
      method: "GET",
      auth,
    });
  },

  /**
   * POST请求
   * @param {string} url - 请求路径
   * @param {Object} data - 请求数据
   * @param {boolean} auth - 是否需要认证
   * @returns {Promise} 请求结果Promise
   */
  post: (url, data = {}, auth = false) => {
    return request({
      url,
      method: "POST",
      data,
      auth,
    });
  },

  /**
   * PUT请求
   * @param {string} url - 请求路径
   * @param {Object} data - 请求数据
   * @param {boolean} auth - 是否需要认证
   * @returns {Promise} 请求结果Promise
   */
  put: (url, data = {}, auth = false) => {
    return request({
      url,
      method: "PUT",
      data,
      auth,
    });
  },

  /**
   * PATCH请求
   * @param {string} url - 请求路径
   * @param {Object} data - 请求数据
   * @param {boolean} auth - 是否需要认证
   * @returns {Promise} 请求结果Promise
   */
  patch: (url, data = {}, auth = false) => {
    return request({
      url,
      method: "PATCH",
      data,
      auth,
    });
  },

  /**
   * DELETE请求
   * @param {string} url - 请求路径
   * @param {Object} data - 请求数据
   * @param {boolean} auth - 是否需要认证
   * @returns {Promise} 请求结果Promise
   */
  delete: (url, data = {}, auth = false) => {
    return request({
      url,
      method: "DELETE",
      data,
      auth,
    });
  },

  /**
   * 上传文件
   * @param {string} url - 上传路径
   * @param {string} filePath - 文件路径
   * @param {string} name - 文件字段名
   * @param {Object} formData - 额外表单数据
   * @param {boolean} auth - 是否需要认证
   * @returns {Promise} 上传结果Promise
   */
  upload: (url, filePath, name = "file", formData = {}, auth = true) => {
    return uploadFile({
      url,
      filePath,
      name,
      formData,
      auth,
    });
  },
};
