const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  artist: {
    type: String,
    required: true,
    trim: true
  },
  coverImg: {
    type: String,
    default: '/static/images/music/default-album.jpg'
  },
  description: {
    type: String,
    default: ''
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }],
  playCount: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ['专辑', 'EP', '单曲', '合集'],
    default: '专辑'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted'],
    default: 'active'
  }
}, { timestamps: true });

// 添加索引以提高搜索性能
AlbumSchema.index({ name: 'text', description: 'text' });
AlbumSchema.index({ artistId: 1 });
AlbumSchema.index({ releaseDate: -1 });
AlbumSchema.index({ playCount: -1 });

module.exports = mongoose.model('Album', AlbumSchema);
