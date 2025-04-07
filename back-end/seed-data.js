/**
 * 向各集合插入示例数据的脚本
 * 这会自动创建所有定义的字段
 * 运行方法: node seed-data.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// 导入所有模型
const User = require('./models/User');
const Friendship = require('./models/Friendship');
const FriendRequest = require('./models/FriendRequest');
const Interaction = require('./models/Interaction');
const UserLocation = require('./models/UserLocation');

// 连接到MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mutilife')
  .then(() => {
    console.log('已连接到MongoDB');
    seedData().then(() => {
      console.log('数据填充完成！现在可以在MongoDB Compass中查看表结构');
      mongoose.disconnect();
    });
  })
  .catch(err => {
    console.error('连接MongoDB失败:', err);
    process.exit(1);
  });

async function seedData() {
  // 清空现有示例数据（可选）
  const isFirstRun = true;
  if (isFirstRun) {
    try {
      // 不要删除所有用户，可能有真实用户数据
      // 仅删除示例用户
      await User.deleteMany({ username: { $in: ['demo1', 'demo2', 'demo3'] } });
      
      // 清除示例数据
      await Friendship.deleteMany({});
      await FriendRequest.deleteMany({});
      await Interaction.deleteMany({});
      await UserLocation.deleteMany({});
      
      console.log('✅ 已清除旧的示例数据');
    } catch (err) {
      console.error('清除数据时出错:', err);
      return;
    }
  }

  // 创建示例用户
  console.log('创建示例用户...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = await User.create([
    {
      username: 'demo1',
      email: 'demo1@example.com',
      password: hashedPassword,
      name: '张小明',
      avatar: 'avatar1.jpg',
      bio: '爱音乐，爱旅行，爱生活',
      gender: 'male',
      birthday: new Date('1995-05-15'),
      location: '北京市朝阳区',
      isOnline: true,
      lastActive: new Date(),
      privacySettings: {
        showLocation: true,
        showOnlineStatus: true,
        allowFriendRequests: true
      },
      socialPreferences: {
        interestedIn: ['音乐', '旅行', '摄影'],
        lookingFor: '交友',
        languages: ['中文', '英语']
      },
      tags: ['音乐爱好者', '旅行达人']
    },
    {
      username: 'demo2',
      email: 'demo2@example.com',
      password: hashedPassword,
      name: '李娜',
      avatar: 'avatar2.jpg',
      bio: '生活不止眼前的代码，还有诗和远方',
      gender: 'female',
      birthday: new Date('1998-08-20'),
      location: '上海市静安区',
      isOnline: false,
      lastActive: new Date(Date.now() - 86400000), // 1天前
      privacySettings: {
        showLocation: true,
        showOnlineStatus: true,
        allowFriendRequests: true
      },
      socialPreferences: {
        interestedIn: ['读书', '编程', '电影'],
        lookingFor: '学习',
        languages: ['中文']
      },
      tags: ['程序媛', '读书达人']
    },
    {
      username: 'demo3',
      email: 'demo3@example.com',
      password: hashedPassword,
      name: '王刚',
      avatar: 'avatar3.jpg',
      bio: '热爱运动，享受健康生活',
      gender: 'male',
      birthday: new Date('1990-03-10'),
      location: '广州市天河区',
      isOnline: true,
      lastActive: new Date(),
      privacySettings: {
        showLocation: false,
        showOnlineStatus: true,
        allowFriendRequests: true
      },
      socialPreferences: {
        interestedIn: ['健身', '足球', '户外'],
        lookingFor: '运动伙伴',
        languages: ['中文', '粤语']
      },
      tags: ['运动达人', '足球爱好者']
    }
  ]);
  
  console.log(`✅ 创建了 ${users.length} 个示例用户`);
  
  // 用户ID映射
  const userIds = {};
  users.forEach(user => {
    userIds[user.username] = user._id;
  });
  
  // 创建好友关系
  console.log('创建好友关系...');
  const friendships = await Friendship.create([
    {
      userId: userIds['demo1'],
      friendId: userIds['demo2'],
      status: 'accepted',
      tags: ['同事', '好友'],
      notes: '在公司认识的同事',
      lastInteractionDate: new Date()
    },
    {
      userId: userIds['demo2'],
      friendId: userIds['demo1'],
      status: 'accepted',
      tags: ['同事'],
      notes: '张小明，技术部门同事',
      lastInteractionDate: new Date()
    }
  ]);
  
  console.log(`✅ 创建了 ${friendships.length} 条好友关系`);
  
  // 创建好友请求
  console.log('创建好友请求...');
  const friendRequests = await FriendRequest.create([
    {
      senderId: userIds['demo3'],
      receiverId: userIds['demo1'],
      message: '我是王刚，我们一起打球吧！',
      status: 'pending',
      createdAt: new Date()
    }
  ]);
  
  console.log(`✅ 创建了 ${friendRequests.length} 条好友请求`);
  
  // 创建互动记录
  console.log('创建互动记录...');
  const interactions = await Interaction.create([
    {
      userId: userIds['demo1'],
      targetId: userIds['demo2'],
      type: 'chat',
      content: '聊天了30分钟',
      metadata: { duration: 30, messages: 15 }
    },
    {
      userId: userIds['demo2'],
      targetId: userIds['demo1'],
      type: 'like',
      content: '赞了照片',
      resourceId: mongoose.Types.ObjectId(),
      resourceModel: 'Moment'
    },
    {
      userId: userIds['demo3'],
      targetId: userIds['demo1'],
      type: 'visit',
      content: '查看了个人资料'
    }
  ]);
  
  console.log(`✅ 创建了 ${interactions.length} 条互动记录`);
  
  // 创建用户位置
  console.log('创建用户位置...');
  const userLocations = await UserLocation.create([
    {
      userId: userIds['demo1'],
      coordinates: {
        type: 'Point',
        coordinates: [116.407526, 39.904030] // 北京
      },
      city: '北京市',
      address: '朝阳区三里屯',
      accuracy: 10,
      isVisible: true
    },
    {
      userId: userIds['demo2'],
      coordinates: {
        type: 'Point',
        coordinates: [121.473701, 31.230416] // 上海
      },
      city: '上海市',
      address: '静安区南京西路',
      accuracy: 15,
      isVisible: true
    },
    {
      userId: userIds['demo3'],
      coordinates: {
        type: 'Point',
        coordinates: [113.330948, 23.120533] // 广州
      },
      city: '广州市',
      address: '天河区珠江新城',
      accuracy: 5,
      isVisible: false
    }
  ]);
  
  console.log(`✅ 创建了 ${userLocations.length} 条位置信息`);
  
  console.log('🎉 所有示例数据创建完成！');
}
