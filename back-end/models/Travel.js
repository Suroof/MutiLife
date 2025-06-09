// 以下是MongoDB模型结构示例

// 1. 探索卡片模型
const DestinationSchema = new Schema({
  title: String,
  image: String,
  country: String,
  isBookmarked: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// 2. 活动类型模型
const ActivitySchema = new Schema({
  name: String,
  icon: String, // 存储图标路径
  iconBackground: String, // 存储背景色
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// 3. 信息卡片模型
const InfoCardSchema = new Schema({
  title: String,
  image: String,
  buttonText: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// 4. 特色体验模型
const FeaturedExperienceSchema = new Schema({
  title: String,
  image: String,
  rating: Number,
  reviewCount: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
