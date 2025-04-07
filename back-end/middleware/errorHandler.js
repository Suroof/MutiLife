/**
 * 全局错误处理中间件
 * 捕获并格式化应用程序中的错误响应
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // 判断错误类型
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // 处理Mongoose错误
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = '资源不存在';
  }

  // 处理Mongoose验证错误
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // 处理重复键错误
  if (err.code === 11000) {
    statusCode = 400;
    message = '该数据已存在，请勿重复添加';

    // 尝试提取重复的字段名
    const field = Object.keys(err.keyValue)[0];
    if (field) {
      message = `${field} 已被使用`;
    }
  }

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;