const express = require('express');
const { check } = require('express-validator');
const musicController = require('../controllers/musicController');
const auth = require('../middleware/auth');

const router = express.Router();

// 所有音乐相关的路由都需要用户身份验证
router.use(auth);

// 获取每日推荐歌曲
router.get('/daily-recommendations', musicController.getDailyRecommendations);

// 获取热门歌单
router.get('/playlists/hot', musicController.getHotPlaylists);

// 获取推荐艺术家
router.get('/artists/recommended', musicController.getRecommendedArtists);

// 获取歌单详情
router.get('/playlists/:playlistId', musicController.getPlaylistDetail);

// 获取歌曲详情
router.get('/songs/:songId', musicController.getSongDetail);

// 获取歌曲播放URL
router.get('/songs/:songId/url', musicController.getSongUrl);

// 获取歌词
router.get('/songs/:songId/lyrics', musicController.getLyrics);

// 搜索音乐
router.get('/search', musicController.searchMusic);

// 获取艺术家详情
router.get('/artists/:artistId', musicController.getArtistDetail);

// 获取用户收藏的歌单
router.get('/user/playlists', musicController.getUserPlaylists);

// 创建歌单
router.post('/playlists', [
  check('name', '歌单名称不能为空').not().isEmpty(),
], musicController.createPlaylist);

// 收藏/取消收藏歌单
router.post('/playlists/:playlistId/favorite', [
  check('like', '请指定是否收藏').isBoolean(),
], musicController.favoritePlaylist);

// 收藏/取消收藏歌曲
router.post('/songs/:songId/favorite', [
  check('like', '请指定是否收藏').isBoolean(),
], musicController.favoriteSong);

// 添加歌曲到播放历史
router.post('/history', [
  check('songId', '歌曲ID不能为空').not().isEmpty(),
], musicController.addToHistory);

// 获取播放历史
router.get('/history', musicController.getPlayHistory);

// 关注/取消关注艺术家
router.post('/artists/:artistId/follow', [
  check('follow', '请指定是否关注').isBoolean(),
], musicController.followArtist);

module.exports = router;
