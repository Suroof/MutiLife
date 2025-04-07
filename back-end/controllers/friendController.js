const { validationResult } = require('express-validator');
const User = require('../models/User');
const Friendship = require('../models/Friendship');
const FriendRequest = require('../models/FriendRequest');
const Interaction = require('../models/Interaction');
const mongoose = require('mongoose');

/**
 * 获取好友列表
 * @route   GET /api/friends
 * @access  Private
 */
exports.getFriends = async (req, res) => {
  try {
    // 查找当前用户的所有好友关系
    const friendships = await Friendship.find({
      userId: req.user.id,
      status: 'accepted'
    });

    // 如果没有好友，返回空数组
    if (friendships.length === 0) {
      return res.json({ friends: [] });
    }

    // 提取好友ID
    const friendIds = friendships.map(f => f.friendId);

    // 获取所有好友的详细信息
    const friends = await User.find({ _id: { $in: friendIds } })
      .select('_id username name avatar bio location lastActive isOnline gender');

    // 整合好友信息和标签
    const friendsWithTags = friends.map(friend => {
      const friendship = friendships.find(f => 
        f.friendId.toString() === friend._id.toString()
      );
      
      return {
        _id: friend._id,
        username: friend.username,
        name: friend.name,
        avatar: friend.avatar,
        bio: friend.bio,
        location: friend.location,
        isOnline: friend.isOnline,
        lastActive: friend.lastActive,
        gender: friend.gender,
        tags: friendship ? friendship.tags : [],
        notes: friendship ? friendship.notes : '',
        lastInteraction: friendship ? friendship.lastInteractionDate : null
      };
    });

    res.json({ friends: friendsWithTags });
  } catch (err) {
    console.error('获取好友列表失败:', err.message);
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 获取好友请求列表
 * @route   GET /api/friends/requests
 * @access  Private
 */
exports.getFriendRequests = async (req, res) => {
  try {
    // 查找发送给当前用户的待处理请求
    const requests = await FriendRequest.find({
      receiverId: req.user.id,
      status: 'pending'
    }).sort({ createdAt: -1 });

    // 如果没有请求，返回空数组
    if (requests.length === 0) {
      return res.json({ requests: [] });
    }

    // 提取发送者ID
    const senderIds = requests.map(r => r.senderId);

    // 获取所有发送者的详细信息
    const senders = await User.find({ _id: { $in: senderIds } })
      .select('_id username name avatar bio');

    // 整合请求信息
    const requestsWithSenderInfo = requests.map(request => {
      const sender = senders.find(s => 
        s._id.toString() === request.senderId.toString()
      );
      
      return {
        _id: request._id,
        senderId: request.senderId,
        message: request.message,
        createdAt: request.createdAt,
        sender: sender ? {
          _id: sender._id,
          username: sender.username,
          name: sender.name,
          avatar: sender.avatar,
          bio: sender.bio
        } : null
      };
    });

    res.json({ requests: requestsWithSenderInfo });
  } catch (err) {
    console.error('获取好友请求失败:', err.message);
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 发送好友请求
 * @route   POST /api/friends/requests
 * @access  Private
 */
exports.sendFriendRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { receiverId, message } = req.body;

  try {
    // 确保不是发给自己
    if (receiverId === req.user.id) {
      return res.status(400).json({ message: '不能向自己发送好友请求' });
    }

    // 检查对方用户是否存在
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 检查是否已经是好友
    const existingFriendship = await Friendship.findOne({
      userId: req.user.id,
      friendId: receiverId,
      status: 'accepted'
    });

    if (existingFriendship) {
      return res.status(400).json({ message: '你们已经是好友了' });
    }

    // 检查是否已经发送过请求
    const canSend = await FriendRequest.canSendRequest(req.user.id, receiverId);
    if (!canSend) {
      return res.status(400).json({ 
        message: '你最近已经发送过请求，请等待对方回应或24小时后再试' 
      });
    }

    // 创建好友请求
    const friendRequest = new FriendRequest({
      senderId: req.user.id,
      receiverId,
      message: message || '我想加你为好友'
    });

    await friendRequest.save();

    // 记录互动
    const interaction = new Interaction({
      userId: req.user.id,
      targetId: receiverId,
      type: 'friend_request',
      content: '发送了好友请求'
    });

    await interaction.save();

    res.json({ success: true, message: '好友请求已发送' });
  } catch (err) {
    console.error('发送好友请求失败:', err.message);
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 接受好友请求
 * @route   PUT /api/friends/requests/:requestId/accept
 * @access  Private
 */
exports.acceptFriendRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    // 获取并检查请求
    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: '请求不存在' });
    }

    // 确认当前用户是接收者
    if (request.receiverId.toString() !== req.user.id) {
      return res.status(403).json({ message: '无权操作此请求' });
    }

    // 检查请求状态
    if (request.status !== 'pending') {
      return res.status(400).json({ message: '此请求已被处理' });
    }

    // 更新请求状态
    request.status = 'accepted';
    request.respondedAt = Date.now();
    await request.save();

    // 创建双向好友关系
    const friendship1 = new Friendship({
      userId: req.user.id,
      friendId: request.senderId,
      status: 'accepted'
    });

    const friendship2 = new Friendship({
      userId: request.senderId,
      friendId: req.user.id,
      status: 'accepted'
    });

    await friendship1.save();
    await friendship2.save();

    // 更新两个用户的好友计数
    await User.findByIdAndUpdate(req.user.id, { $inc: { friendsCount: 1 } });
    await User.findByIdAndUpdate(request.senderId, { $inc: { friendsCount: 1 } });

    // 记录互动
    const interaction = new Interaction({
      userId: req.user.id,
      targetId: request.senderId,
      type: 'friend_accept',
      content: '接受了好友请求'
    });

    await interaction.save();

    res.json({ success: true, message: '已添加为好友' });
  } catch (err) {
    console.error('接受好友请求失败:', err.message);
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 拒绝好友请求
 * @route   PUT /api/friends/requests/:requestId/reject
 * @access  Private
 */
exports.rejectFriendRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    // 获取并检查请求
    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: '请求不存在' });
    }

    // 确认当前用户是接收者
    if (request.receiverId.toString() !== req.user.id) {
      return res.status(403).json({ message: '无权操作此请求' });
    }

    // 检查请求状态
    if (request.status !== 'pending') {
      return res.status(400).json({ message: '此请求已被处理' });
    }

    // 更新请求状态
    request.status = 'rejected';
    request.respondedAt = Date.now();
    await request.save();

    res.json({ success: true, message: '已拒绝好友请求' });
  } catch (err) {
    console.error('拒绝好友请求失败:', err.message);
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 解除好友关系
 * @route   DELETE /api/friends/:friendId
 * @access  Private
 */
exports.removeFriend = async (req, res) => {
  const { friendId } = req.params;

  try {
    // 检查是否是好友
    const friendship = await Friendship.findOne({
      userId: req.user.id,
      friendId: friendId,
      status: 'accepted'
    });

    if (!friendship) {
      return res.status(404).json({ message: '好友关系不存在' });
    }

    // 删除双向好友关系
    await Friendship.deleteOne({
      userId: req.user.id,
      friendId: friendId
    });

    await Friendship.deleteOne({
      userId: friendId,
      friendId: req.user.id
    });

    // 更新两个用户的好友计数
    await User.findByIdAndUpdate(req.user.id, { $inc: { friendsCount: -1 } });
    await User.findByIdAndUpdate(friendId, { $inc: { friendsCount: -1 } });

    res.json({ success: true, message: '已解除好友关系' });
  } catch (err) {
    console.error('解除好友关系失败:', err.message);
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 更新好友标签或备注
 * @route   PUT /api/friends/:friendId
 * @access  Private
 */
exports.updateFriendInfo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { friendId } = req.params;
  const { tags, notes } = req.body;

  try {
    // 检查是否是好友
    const friendship = await Friendship.findOne({
      userId: req.user.id,
      friendId: friendId,
      status: 'accepted'
    });

    if (!friendship) {
      return res.status(404).json({ message: '好友关系不存在' });
    }

    // 更新标签和备注
    if (tags !== undefined) friendship.tags = tags;
    if (notes !== undefined) friendship.notes = notes;

    await friendship.save();

    res.json({ success: true, friendship });
  } catch (err) {
    console.error('更新好友信息失败:', err.message);
    res.status(500).json({ message: '服务器错误' });
  }
};
