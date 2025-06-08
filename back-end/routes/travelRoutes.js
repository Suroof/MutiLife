const express = require('express');
const router = express.Router();
const travelController = require('../controllers/travelController');

// 获取所有目的地
router.get('/destinations', travelController.getDestinations);

// 获取单个目的地详情
router.get('/destinations/:id', travelController.getDestinationById);

// 获取所有活动
router.get('/activities', travelController.getActivities);

// 获取所有信息卡片
router.get('/infocards', travelController.getInfoCards);

// 获取所有特色体验
router.get('/featured-experiences', travelController.getFeaturedExperiences);

// 获取单个特色体验详情
router.get('/featured-experiences/:id', travelController.getFeaturedExperienceById);

// 切换收藏状态
router.patch('/destinations/:id/bookmark', travelController.toggleBookmark);

module.exports = router;