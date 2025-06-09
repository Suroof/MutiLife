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
router.patch('/featured-experiences/:id/bookmark', travelController.toggleBookmark);

// 获取用户收藏列表
router.get('/favorites', travelController.getFavorites);

// 清空用户收藏列表
router.delete('/favorites/clear', travelController.clearFavorites);

// 获取用户收藏数量
router.get('/favorites/count', travelController.getFavoritesCount);

module.exports = router;