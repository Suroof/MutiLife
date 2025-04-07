const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${req.user.id}-${uniqueSuffix}${ext}`);
  }
});

// File filter for avatar uploads
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件 (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max size
});

// @route    GET /api/users/profile
// @desc     Get user profile
// @access   Private
router.get('/profile', auth, userController.getUserProfile);

// @route    PUT /api/users/profile
// @desc     Update user profile
// @access   Private
router.put(
  '/profile',
  [
    auth,
    body('name', '名称不能超过50个字符').optional().isLength({ max: 50 }),
    body('bio', '简介不能超过500个字符').optional().isLength({ max: 500 }),
    body('phoneNumber', '请输入有效的电话号码').optional().isMobilePhone('zh-CN')
  ],
  userController.updateUserProfile
);

// @route    PUT /api/users/preferences
// @desc     Update user preferences
// @access   Private
router.put('/preferences', auth, userController.updateUserPreferences);

// @route    PUT /api/users/change-password
// @desc     Change user password
// @access   Private
router.put(
  '/change-password',
  [
    auth,
    body('currentPassword', '当前密码不能为空').notEmpty(),
    body('newPassword', '新密码必须至少6个字符').isLength({ min: 6 })
  ],
  userController.changePassword
);

// @route    PUT /api/users/avatar
// @desc     Update user avatar
// @access   Private
router.put('/avatar', auth, upload.single('avatar'), userController.updateAvatar);

// @route    GET /api/users/nearby
// @desc     Get nearby users
// @access   Private
router.get('/nearby', auth, userController.getNearbyUsers);

// @route    GET /api/users/recommended
// @desc     Get recommended friends
// @access   Private
router.get('/recommended', auth, userController.getRecommendedFriends);

// @route    GET /api/users/:userId
// @desc     Get user by ID
// @access   Private
router.get('/:userId', auth, userController.getUserById);

module.exports = router;
