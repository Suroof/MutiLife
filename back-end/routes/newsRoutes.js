const express = require('express');
const { check } = require('express-validator');
const newsController = require('../controllers/newsController');
const auth = require('../middleware/auth');

const router = express.Router();

// 公开路由 - 不需要认证
router.get('/list', newsController.getNewsList);
router.get('/recommended', newsController.getRecommendedNews);
router.get('/hot', newsController.getHotNews);
router.get('/categories', newsController.getCategories);
router.get('/tags/hot', newsController.getHotTags);
router.get('/:id', newsController.getNewsById);
router.get('/:id/comments', newsController.getNewsComments);

// 需要认证的路由
router.post('/:id/like', auth, newsController.likeNews);
router.post('/:id/comments', [
  auth,
  check('content', '评论内容不能为空').not().isEmpty(),
], newsController.addComment);

module.exports = router;
