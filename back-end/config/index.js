require('dotenv').config();

module.exports = {
  // Server settings
  port: process.env.PORT || 9500,
  env: process.env.NODE_ENV || 'development',

  // JWT settings
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  },

  // Database settings
  db: {
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '3306',
    database: process.env.DB_NAME || 'mutilife',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  },

  // File upload settings
  upload: {
    baseUrl: process.env.UPLOAD_BASE_URL || 'http://localhost:5000/uploads/',
    directory: process.env.UPLOAD_DIRECTORY || 'uploads',
  },
};