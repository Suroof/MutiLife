const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const friendController = require('../controllers/friendController');
const auth = require('../middleware/auth');

// @route    GET /api/friends
// @desc     获取用户的好友列表
// @access   Private
router.get('/', auth, friendController.getFriends);

// @route    GET /api/friends/requests
// @desc     获取好友请求列表
// @access   Private
router.get('/requests', auth, friendController.getFriendRequests);

// @route    POST /api/friends/requests
// @desc     发送好友请求
// @access   Private
router.post(
  '/requests',
  [
    auth,
    body('receiverId', '接收者ID不能为空').notEmpty(),
    body('message', '消息不能超过200个字符').optional().isLength({ max: 200 })
  ],
  friendController.sendFriendRequest
);

// @route    PUT /api/friends/requests/:requestId/accept
// @desc     接受好友请求
// @access   Private
router.put(
  '/requests/:requestId/accept', 
  [
    auth,
    param('requestId', '无效的请求ID').isMongoId()
  ],
  friendController.acceptFriendRequest
);

// @route    PUT /api/friends/requests/:requestId/reject
// @desc     拒绝好友请求
// @access   Private
router.put(
  '/requests/:requestId/reject', 
  [
    auth,
    param('requestId', '无效的请求ID').isMongoId()
  ],
  friendController.rejectFriendRequest
);

// @route    DELETE /api/friends/:friendId
// @desc     解除好友关系
// @access   Private
router.delete(
  '/:friendId', 
  [
    auth,
    param('friendId', '无效的好友ID').isMongoId()
  ],
  friendController.removeFriend
);

// @route    PUT /api/friends/:friendId
// @desc     更新好友标签或备注
// @access   Private
router.put(
  '/:friendId',
  [
    auth,
    param('friendId', '无效的好友ID').isMongoId(),
    body('tags', '标签必须是字符串数组').optional().isArray(),
    body('notes', '备注不能超过200个字符').optional().isLength({ max: 200 })
  ],
  friendController.updateFriendInfo
);

module.exports = router;
