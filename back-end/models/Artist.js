const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: '/static/images/music/default-artist.jpg'
  },
  coverImg: {
    type: String,
    default: '/static/images/music/default-artist-cover.jpg'
  },
  cover: {
    type: String,
    default: '/static/images/music/default-artist-cover.jpg'
  },
  biography: {
    type: String,
    default: ''
  },
  region: {
    type: String,
    default: '未知'
  },
  birthday: {
    type: Date,
    default: null
  },
  fansCount: {
    type: Number,
    default: 0
  },
  style: {
    type: String,
    default: '流行'
  },
  albums: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  }],
  hotSongs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }],
  mvs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MV'
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted'],
    default: 'active'
  }
}, { timestamps: true });

// 添加索引以提高搜索性能
ArtistSchema.index({ name: 'text' });
ArtistSchema.index({ fansCount: -1 });
ArtistSchema.index({ region: 1 });

module.exports = mongoose.model('Artist', ArtistSchema);
