const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  creator: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  coverImg: {
    type: String,
    default: '/static/images/music/default-playlist.jpg'
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }],
  playCount: {
    type: Number,
    default: 0
  },
  favoriteCount: {
    type: Number,
    default: 0
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted'],
    default: 'active'
  }
}, { timestamps: true });

// 添加索引以提高搜索性能
PlaylistSchema.index({ name: 'text', description: 'text' });
PlaylistSchema.index({ creator: 1 });
PlaylistSchema.index({ playCount: -1 });
PlaylistSchema.index({ favoriteCount: -1 });
PlaylistSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Playlist', PlaylistSchema);
