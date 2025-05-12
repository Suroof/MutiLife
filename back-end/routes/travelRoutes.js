// back-end/routes/travelRoutes.js
const express = require('express');
const router = express.Router();
const travelController = require('../controllers/travelController');

// 获取目的地
router.get('/destinations', travelController.getDestinations);

// 获取活动
router.get('/activities', travelController.getActivities);

// 获取信息卡片
router.get('/infocards', travelController.getInfoCards);

// 获取特色体验
router.get('/featured-experiences', travelController.getFeaturedExperiences);

// 切换收藏状态
router.patch('/destinations/:id/bookmark', travelController.toggleBookmark);

module.exports = router;