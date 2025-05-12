const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: false,
    unique: false, // 先关闭唯一索引
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  bio: {
    type: String,
    maxlength: 500
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  // 社交功能所需字段
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'male'
  },
  birthday: {
    type: Date
  },
  location: {
    type: String,
    trim: true
  },
  friendsCount: {
    type: Number,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  coverImage: {
    type: String,
    default: 'default-cover.jpg'
  },
  tags: {
    type: [String],
    default: []
  },
  privacySettings: {
    showLocation: {
      type: Boolean,
      default: true
    },
    showOnlineStatus: {
      type: Boolean,
      default: true
    },
    allowFriendRequests: {
      type: Boolean,
      default: true
    }
  },
  socialPreferences: {
    interestedIn: {
      type: [String],
      default: []
    },
    lookingFor: {
      type: String,
      default: '交友'
    },
    languages: {
      type: [String],
      default: ['中文']
    }
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'zh'
    }
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// 设置username为唯一索引
UserSchema.index({ username: 1 }, { unique: true });

// 设置email为可选的、稀疏的唯一索引
// 稀疏索引只会索引存在该字段的文档，null/undefined值不会被索引
UserSchema.index({ email: 1 }, { unique: true, sparse: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', UserSchema);