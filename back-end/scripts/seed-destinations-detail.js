// back-end/scripts/seed-destinations-detail.js
const mongoose = require('mongoose');
const Destination = require('../models/Destination');
const DestinationDetail = require('../models/DestinationsDetail');

// 直接连接数据库
const connectToDatabase = async () => {
  try {
    const mongoURL = 'mongodb://127.0.0.1:27017/mutilife';
    console.log('尝试连接到 MongoDB:', mongoURL);
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

// 生成随机目的地详情数据
const generateDestinationDetails = (destinations) => {
  const details = [];

  destinations.forEach(dest => {
    const detail = {
      destinationId: dest._id,
      description: generateDescription(dest.name, dest.country),
      bestSeason: pickRandom([
        '春季（3月 - 5月）',
        '夏季（6月 - 8月）',
        '秋季（9月 - 11月）',
        '冬季（12月 - 2月）'
      ]),
      climate: pickRandom([
        '温带海洋性气候',
        '地中海气候',
        '热带季风气候',
        '高原山地气候',
        '极地气候'
      ]),
      tips: pickMultiple([
        '提前预订住宿以获得更好价格',
        '携带适合天气的衣物',
        '尊重当地文化和习俗',
        '购买旅行保险',
        '随身携带护照复印件',
        '注意饮食卫生安全'
      ], 3),
      images: [
        `/static/details/${dest.name.toLowerCase().replace(/[^a-z]/g, '')}-1.jpg`,
        `/static/details/${dest.name.toLowerCase().replace(/[^a-z]/g, '')}-2.jpg`,
        `/static/details/${dest.name.toLowerCase().replace(/[^a-z]/g, '')}-3.jpg`
      ],
      activities: pickMultiple([
        '徒步旅行',
        '摄影',
        '美食探索',
        '文化导览',
        '潜水体验',
        '滑雪',
        '骑行',
        '露营'
      ], Math.floor(Math.random() * 3) + 2)
    };

    details.push(detail);
  });

  return details;
};

// 辅助函数：随机选取一个元素
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 辅助函数：随机选取多个不重复元素
function pickMultiple(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// 生成描述文本（模拟）
function generateDescription(name, country) {
  const adjectives = ['壮丽的', '神秘的', '迷人的', '宁静的', '历史悠久的'];
  const nouns = ['自然风光', '文化遗产', '城市风貌', '美食之旅', '冒险乐园'];
  const verbs = ['探索', '沉浸于', '感受', '发现', '体验'];

  return `${pickRandom(adjectives)} ${country} ${name} 是一次绝佳机会来 ${pickRandom(verbs)} ${
    pickRandom(nouns)
  }。这里不仅有令人惊叹的风景，还有丰富的历史和独特的文化等待你的发掘。`;
}

// 主程序
const seedDestinationDetails = async () => {
  try {
    const connected = await connectToDatabase();
    if (!connected) {
      console.error('无法连接到数据库，退出');
      process.exit(1);
    }

    console.log('开始添加目的地详情数据');

    // 清除旧数据
    await DestinationDetail.deleteMany({});
    console.log('已清除原有目的地详情数据');

    // 获取所有目的地
    const destinations = await Destination.find({}, '_id name country');
    if (!destinations.length) {
      console.error('没有可用的目的地基础数据，请先运行 seed-travel-data.js');
      process.exit(1);
    }

    // 生成详情数据
    const destinationDetails = generateDestinationDetails(destinations);

    // 插入数据
    const createdDetails = await DestinationDetail.insertMany(destinationDetails);
    console.log(`已添加 ${createdDetails.length} 条目的地详情`);

    console.log('目的地详情数据添加完成!');
    process.exit(0);
  } catch (error) {
    console.error('添加目的地详情失败:', error);
    process.exit(1);
  }
};

// 执行脚本
seedDestinationDetails();