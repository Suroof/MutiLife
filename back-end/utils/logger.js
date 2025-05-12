const winston = require('winston');
const path = require('path');
const fs = require('fs');

// 检测是否运行在Vercel或其他无服务器环境中
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

// 确保日志目录存在
// 在无服务器环境中使用/tmp目录，否则使用相对路径
const logDir = isServerless
  ? path.join('/tmp', 'logs')
  : path.join(__dirname, '../logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 日志格式定义
const logFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
});

// 创建Winston logger实例
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    logFormat
  ),
  defaultMeta: { service: 'mutilife-api' },
  transports: [
    // 写入所有日志到控制台
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    })
  ],
  exitOnError: false
});

// 如果不是在无服务器环境中运行，添加文件传输
if (!isServerless) {
  // 写入所有日志到combined.log
  logger.add(new winston.transports.File({
    filename: path.join(logDir, 'combined.log'),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }));

  // 只写入错误日志到error.log
  logger.add(new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }));
} else {
  // 在无服务器环境中，可以选择使用文件传输到/tmp目录
  // 但请注意，这些日志在函数执行结束后可能会丢失
  logger.add(new winston.transports.File({
    filename: path.join(logDir, 'combined.log'),
    maxsize: 5242880, // 5MB
    maxFiles: 1,
  }));

  logger.add(new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 1,
  }));
}

// 用于HTTP请求的简化记录器
logger.stream = {
  write: function(message) {
    logger.info(message.trim());
  }
};

module.exports = logger;