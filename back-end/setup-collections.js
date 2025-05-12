/**
 * 快速创建MongoDB集合的辅助脚本
 * 运行方法: node setup-collections.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// 导入所有模型
require('./models/User');
require('./models/Friendship');
require('./models/FriendRequest');
require('./models/Interaction');
require('./models/UserLocation');

// 连接到MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mutilife')
  .then(() => {
    console.log('已连接到MongoDB');
    setupCollections().then(() => {
      console.log('所有集合设置完成！');
      mongoose.disconnect();
    });
  })
  .catch(err => {
    console.error('连接MongoDB失败:', err);
    process.exit(1);
  });

async function setupCollections() {
  const collections = [
    'users',
    'friendships', 
    'friendrequests',
    'interactions',
    'userlocations'
  ];
  
  console.log('开始创建集合...');
  
  for (const collName of collections) {
    try {
      // 检查集合是否存在
      const exists = await mongoose.connection.db
        .listCollections({ name: collName })
        .hasNext();
      
      if (!exists) {
        // 创建集合
        await mongoose.connection.db.createCollection(collName);
        console.log(`✅ 创建集合成功: ${collName}`);
      } else {
        console.log(`ℹ️ 集合已存在: ${collName}`);
      }
      
      // 创建索引（根据模型中定义的）
      if (collName === 'friendships') {
        await mongoose.connection.db.collection(collName)
          .createIndex({ userId: 1, friendId: 1 }, { unique: true });
        console.log(`✅ 创建索引成功: userId_friendId on ${collName}`);
      }
      
      if (collName === 'userlocations') {
        await mongoose.connection.db.collection(collName)
          .createIndex({ coordinates: '2dsphere' });
        console.log(`✅ 创建地理索引成功: coordinates on ${collName}`);
        
        await mongoose.connection.db.collection(collName)
          .createIndex({ userId: 1 }, { unique: true });
        console.log(`✅ 创建索引成功: userId on ${collName}`);
      }
      
      if (collName === 'interactions') {
        await mongoose.connection.db.collection(collName)
          .createIndex({ userId: 1, createdAt: -1 });
        await mongoose.connection.db.collection(collName)
          .createIndex({ targetId: 1, createdAt: -1 });
        console.log(`✅ 创建索引成功: interactions 索引`);
      }
      
      if (collName === 'friendrequests') {
        await mongoose.connection.db.collection(collName)
          .createIndex({ senderId: 1, receiverId: 1, status: 1 }, { unique: true });
        console.log(`✅ 创建索引成功: friendrequests 复合索引`);
      }
      
    } catch (err) {
      console.error(`❌ 创建集合失败 ${collName}:`, err);
    }
  }
}
