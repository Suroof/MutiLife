// back-end/scripts/seed-travel-data.js
const mongoose = require('mongoose');
const Destination = require('../models/Destination');
const Activity = require('../models/Activity');
const InfoCard = require('../models/InfoCard');
const FeaturedExperience = require('../models/FeaturedExperience');

// 直接连接到 MongoDB，不依赖于环境变量
const connectToDatabase = async () => {
  try {
    // 直接使用连接字符串
    const mongoURL = 'mongodb://localhost:27017/mutilife';
    console.log('尝试连接到 MongoDB:', mongoURL);

    // 设置 strictQuery 选项以消除警告
    mongoose.set('strictQuery', false);

    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB 连接成功');
    return true;
  } catch (err) {
    console.error('MongoDB 连接失败:', err);
    return false;
  }
};

// 活动数据
const activities = [
  {
    name: 'KAYAKING',
    icon: '/static/icons/kayak.png',
    iconBackground: '#FFEEE6'
  },
  {
    name: 'BALLOONING',
    icon: '/static/icons/balloon.png',
    iconBackground: '#F0F9FF'
  },
  {
    name: 'HIKING',
    icon: '/static/icons/hiking.png',
    iconBackground: '#EDF9F0'
  },
  {
    name: 'SNORKELING',
    icon: '/static/icons/snorkel.png',
    iconBackground: '#F0F5FF'
  },
  {
    name: 'CAMPING',
    icon: '/static/icons/camping.png',
    iconBackground: '#FFF6E6'
  },
  {
    name: 'SURFING',
    icon: '/static/icons/surfing.png',
    iconBackground: '#F5F0FF'
  }
];

// 目的地数据
const destinations = [
  {
    name: 'Kayaking at the village Gudvangen',
    mainImage: '/static/kayaking.jpg',
    country: 'Norway',
    description: '挪威峡湾的皮划艇体验，感受壮丽的自然风光和宁静的水域冒险。',
    shortDescription: '峡湾皮划艇体验',
    popularityScore: 85,
    rating: 4.8,
    reviewCount: 120,
    isBookmarked: true
  },
  {
    name: 'Breathtaking Antelope Canyon Tour',
    mainImage: '/static/canyon.jpg',
    country: 'Arizona, USA',
    description: '探索世界著名的羚羊峡谷，欣赏令人惊叹的岩石形态和光影变化。',
    shortDescription: '神秘峡谷探索',
    popularityScore: 92,
    rating: 4.9,
    reviewCount: 150,
    isBookmarked: false
  },
  {
    name: 'Northern Lights Experience',
    mainImage: '/static/northern-lights.jpg',
    country: 'Iceland',
    description: '冰岛北极光观赏之旅，体验大自然最神奇的灯光秀。',
    shortDescription: '北极光观赏',
    popularityScore: 88,
    rating: 4.7,
    reviewCount: 95,
    isBookmarked: false
  },
  {
    name: 'Safari Adventure in Serengeti',
    mainImage: '/static/safari.jpg',
    country: 'Tanzania',
    description: '塞伦盖蒂国家公园的野生动物观赏之旅，近距离接触非洲大五兽。',
    shortDescription: '野生动物探险',
    popularityScore: 90,
    rating: 4.8,
    reviewCount: 110,
    isBookmarked: true
  }
];

// 信息卡片数据
const infoCards = [
  {
    title: 'Travel Preparation',
    subtitle: '旅行前准备',
    content: '出行前的必要准备工作，包括行李打包、预订住宿和规划行程。',
    image: '/static/info/preparation.jpg',
    icon: '/static/icons/preparation.png',
    type: 'info',
    priority: 1,
    active: true
  },
  {
    title: 'Required Documentation',
    subtitle: '必备证件',
    content: '旅行所需的重要证件，包括护照、签证和国际驾照等。',
    image: '/static/info/documentation.jpg',
    icon: '/static/icons/document.png',
    type: 'warning',
    priority: 2,
    active: true
  },
  {
    title: 'Travel Insurance',
    subtitle: '旅行保险',
    content: '关于旅行保险的重要信息，如何选择最适合你的保险计划。',
    image: '/static/info/insurance.jpg',
    icon: '/static/icons/insurance.png',
    type: 'info',
    priority: 3,
    active: true
  }
];

// 特色体验数据
const featuredExperiences = [
  {
    title: 'Mountain Hiking',
    description: '专业向导带领的山地徒步体验，攀登壮丽的山峰，欣赏令人叹为观止的自然风光。',
    image: '/static/examples/featured1.jpg',
    price: 149.99,
    duration: '6小时',
    location: {
      city: 'Interlaken',
      country: 'Switzerland'
    },
    rating: 4.8,
    reviewCount: 124,
    category: '户外冒险',
    tags: ['徒步', '山地', '自然风光'],
    isFeatured: true
  },
  {
    title: 'Scuba Diving',
    description: '探索五彩斑斓的水下世界，与热带鱼和珊瑚礁亲密接触的潜水体验。',
    image: '/static/examples/featured2.jpg',
    price: 199.99,
    duration: '4小时',
    location: {
      city: 'Phuket',
      country: 'Thailand'
    },
    rating: 4.7,
    reviewCount: 89,
    category: '水上活动',
    tags: ['潜水', '海洋生物', '珊瑚礁'],
    isFeatured: true
  },
  {
    title: 'Cultural Tours',
    description: '深入了解当地文化和历史的导览之旅，参观古迹和博物馆，品尝传统美食。',
    image: '/static/examples/featured3.jpg',
    price: 89.99,
    duration: '5小时',
    location: {
      city: 'Kyoto',
      country: 'Japan'
    },
    rating: 4.9,
    reviewCount: 56,
    category: '文化体验',
    tags: ['历史', '导览', '传统'],
    isFeatured: true
  },
  {
    title: 'Food Exploration',
    description: '品尝当地特色美食的美食之旅，探索街头小吃和传统餐厅。',
    image: '/static/examples/featured4.jpg',
    price: 79.99,
    duration: '3小时',
    location: {
      city: 'Bangkok',
      country: 'Thailand'
    },
    rating: 4.6,
    reviewCount: 112,
    category: '美食',
    tags: ['美食', '街头小吃', '烹饪'],
    isFeatured: true
  }
];

// 连接数据库并添加数据
const seedData = async () => {
  try {
    // 连接到数据库
    const connected = await connectToDatabase();
    if (!connected) {
      console.error('无法连接到数据库，退出');
      process.exit(1);
    }

    console.log('开始添加旅游种子数据');

    // 清除现有数据
    await Destination.deleteMany({});
    await Activity.deleteMany({});
    await InfoCard.deleteMany({});
    await FeaturedExperience.deleteMany({});

    console.log('现有旅游数据已清除');

    // 添加活动
    const createdActivities = await Activity.insertMany(activities);
    console.log(`已添加 ${createdActivities.length} 个活动`);

    // 添加目的地（关联活动ID）
    const destinationsWithActivities = destinations.map(destination => {
      // 随机选择2-4个活动关联到目的地
      const randomActivities = createdActivities
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 2);

      return {
        ...destination,
        activities: randomActivities.map(activity => activity._id)
      };
    });

    const createdDestinations = await Destination.insertMany(destinationsWithActivities);
    console.log(`已添加 ${createdDestinations.length} 个目的地`);

    // 添加信息卡片
    const createdInfoCards = await InfoCard.insertMany(infoCards);
    console.log(`已添加 ${createdInfoCards.length} 个信息卡片`);

    // 添加特色体验
    const createdExperiences = await FeaturedExperience.insertMany(featuredExperiences);
    console.log(`已添加 ${createdExperiences.length} 个特色体验`);

    // 更新活动相关的目的地信息（类似于音乐数据中更新艺术家的热门歌曲）
    for (const activity of createdActivities) {
      try {
        // 查找包含该活动的所有目的地
        const relatedDestinations = await Destination.find({ activities: activity._id });

        // 这里可以记录每个活动关联了哪些目的地，如果需要的话
        console.log(`活动 ${activity.name} 关联了 ${relatedDestinations.length} 个目的地`);
      } catch (err) {
        console.log(`更新活动 ${activity.name} 的相关目的地失败:`, err.message);
      }
    }

    console.log('旅游数据添加完成!');
    process.exit(0);
  } catch (error) {
    console.error('添加旅游数据失败:', error);
    process.exit(1);
  }
};

// 执行数据填充
seedData();