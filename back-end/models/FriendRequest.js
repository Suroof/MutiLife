const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * 好友请求模型
 * 用于管理用户之间的好友请求
 */
const FriendRequestSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    default: '',
    maxlength: 200
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'canceled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: {
    type: Date
  }
}, { timestamps: true });

// 创建复合索引确保不会有重复的好友请求
FriendRequestSchema.index({ senderId: 1, receiverId: 1, status: 1 }, { unique: true });

// 限制同一发送者在指定时间内（如24小时）向同一接收者重复发送请求
FriendRequestSchema.statics.canSendRequest = async function(senderId, receiverId) {
  // 查找最近24小时内该发送者向该接收者发送的请求
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentRequest = await this.findOne({
    senderId,
    receiverId,
    createdAt: { $gte: oneDayAgo },
    status: { $in: ['pending', 'rejected'] }
  });
  
  return !recentRequest;
};

module.exports = mongoose.model('FriendRequest', FriendRequestSchema);
