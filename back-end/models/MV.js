const mongoose = require('mongoose');

const MVSchema = new mongoose.Schema({
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
  songId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
    default: null
  },
  coverImg: {
    type: String,
    default: '/static/images/music/default-mv.jpg'
  },
  videoUrl: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    default: 0
  },
  description: {
    type: String,
    default: ''
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  playCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted'],
    default: 'active'
  }
}, { timestamps: true });

// 添加索引以提高搜索性能
MVSchema.index({ name: 'text', description: 'text' });
MVSchema.index({ artistId: 1 });
MVSchema.index({ songId: 1 });
MVSchema.index({ releaseDate: -1 });
MVSchema.index({ playCount: -1 });
MVSchema.index({ likeCount: -1 });

module.exports = mongoose.model('MV', MVSchema);
