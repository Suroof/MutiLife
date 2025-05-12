const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const locationController = require('../controllers/locationController');
const auth = require('../middleware/auth');

// @route    PUT /api/location
// @desc     更新用户位置
// @access   Private
router.put(
  '/',
  [
    auth,
    body('longitude', '经度不能为空').notEmpty(),
    body('latitude', '纬度不能为空').notEmpty(),
    body('city', '城市名称不能超过50个字符').optional().isLength({ max: 50 }),
    body('address', '地址不能超过200个字符').optional().isLength({ max: 200 }),
    body('accuracy', '精度必须是数字').optional().isNumeric(),
    body('isVisible', '可见性必须是布尔值').optional().isBoolean()
  ],
  locationController.updateLocation
);

// @route    GET /api/location/nearby
// @desc     获取附近的用户
// @access   Private
router.get(
  '/nearby',
  [
    auth,
    query('radius', '半径必须是数字').optional().isNumeric(),
    query('limit', '限制数量必须是数字').optional().isNumeric(),
    query('page', '页码必须是数字').optional().isNumeric(),
    query('gender', '性别无效').optional().isIn(['male', 'female', 'other', 'all']),
    query('onlineOnly', '在线状态必须是布尔值').optional().isBoolean()
  ],
  locationController.getNearbyUsers
);

module.exports = router;
