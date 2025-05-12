const mongoose = require('mongoose');

const UserMusicSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // 收藏的歌曲
  favoriteSongs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }],
  // 收藏的歌单
  favoritePlaylists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist'
  }],
  // 收藏的专辑
  favoriteAlbums: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  }],
  // 关注的艺术家
  followingArtists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
  }],
  // 播放历史
  playHistory: [{
    song: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song'
    },
    playedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // 用户创建的歌单
  playlists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist'
  }]
}, { timestamps: true });

// 添加索引以提高查询性能
UserMusicSchema.index({ userId: 1 });
UserMusicSchema.index({ 'playHistory.playedAt': -1 });

module.exports = mongoose.model('UserMusic', UserMusicSchema);
