/**
 * Moment.js包装器，解决ES模块兼容性问题
 */

// 导入原始的moment库 
const moment = require('../common/moment.min.js');

// 为了兼容ES模块导入，将moment作为默认导出
export default moment;
