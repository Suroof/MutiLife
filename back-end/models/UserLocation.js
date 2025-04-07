const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * 用户位置信息模型
 * 用于"附近的人"功能，存储用户的地理位置信息
 */
const UserLocationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [经度, 纬度]
      required: true
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  accuracy: {
    type: Number, // 精度（米）
    default: 0
  },
  city: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// 创建地理空间索引
UserLocationSchema.index({ coordinates: '2dsphere' });
UserLocationSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('UserLocation', UserLocationSchema);
