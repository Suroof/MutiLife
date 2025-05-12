const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: String,
    required: true,
    trim: true
  },
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  album: {
    type: String,
    required: true,
    trim: true
  },
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    default: null
  },
  duration: {
    type: Number,
    required: true
  },
  coverImg: {
    type: String,
    default: '/static/images/music/default-song-cover.jpg'
  },
  url: {
    type: String,
    required: true
  },
  lyrics: {
    type: String,
    default: ''
  },
  playCount: {
    type: Number,
    default: 0
  },
  isExclusive: {
    type: Boolean,
    default: false
  },
  tags: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  __v: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// 添加索引以提高搜索性能
SongSchema.index({ name: 'text', artist: 'text', album: 'text' });
SongSchema.index({ artistId: 1 });
SongSchema.index({ albumId: 1 });
SongSchema.index({ playCount: -1 });
SongSchema.index({ releaseDate: -1 });

module.exports = mongoose.model('Song', SongSchema);
