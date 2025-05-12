const mongoose = require('mongoose');
const News = require('../models/News');
const NewsComment = require('../models/NewsComment');
const { connectMongoDB } = require('../config/database');

// 测试数据 - 新闻列表
const newsData = [
  {
    title: '人工智能新突破：自动驾驶技术获重大进展',
    summary: '最新研究显示，自动驾驶技术正在朝着无人监管方向发展，全球多家科技公司宣布重大技术突破。',
    content: `<p>近日，多家科技巨头宣布在自动驾驶技术领域取得突破性进展。这些新技术能够在复杂路况下实现更高精度的导航和决策，大幅提升了自动驾驶汽车的安全性和可靠性。</p>
    
    <p>据报道，这一技术突破主要来自于深度学习算法的改进和更先进的传感器融合技术。新系统能够在毫秒级别内处理大量传感器数据，并做出精准判断，即使在极端天气条件下也能保持高效运行。</p>
    
    <p>专家认为，这一进展将加速自动驾驶汽车的商业化进程，预计未来3-5年内，L4级别的自动驾驶汽车将在特定区域开始规模化运营。</p>
    
    <p>然而，监管机构也表示，尽管技术取得进步，但在全面推广前，仍需建立更完善的法律法规和安全标准。"技术发展速度惊人，但安全永远是首要考虑因素，"一位监管官员这样表示。</p>`,
    author: '王科技',
    category: '科技',
    coverImage: 'https://th.bing.com/th/id/OIP.Nzr7Qb6kCf3v9xtut9HktAHaDt?w=313&h=175&c=7&r=0&o=5&dpr=1.3&pid=1.7',
    images: [
      'https://th.bing.com/th/id/OIP.Nzr7Qb6kCf3v9xtut9HktAHaDt?w=313&h=175&c=7&r=0&o=5&dpr=1.3&pid=1.7',
      'https://th.bing.com/th/id/OIP.MW01N4tohXAolhuJdx6qdwHaEA?w=291&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
    ],
    tags: ['人工智能', '自动驾驶', '科技创新'],
    viewCount: 2356,
    likeCount: 432,
    commentCount: 56,
    isPublished: true,
    isRecommended: true,
    isHot: true,
    publishDate: new Date('2025-04-05T08:30:00')
  },
  {
    title: '全球气候变化：极端天气事件频发引发关注',
    summary: '今年以来，全球多地出现极端天气事件，科学家警告气候变化速度超出预期。',
    content: `<p>近几个月来，全球多个地区接连遭遇极端天气事件，包括史无前例的热浪、洪水和干旱。气候科学家表示，这些现象表明气候变化的速度和影响正在超出此前的预期。</p>
    
    <p>在亚洲，季风降雨强度创下历史新高，导致多国遭遇严重洪灾；而在欧洲南部，持续高温和干旱则引发了大规模森林火灾。北美地区也经历了温度波动剧烈的异常天气模式。</p>
    
    <p>联合国最新报告指出，若不采取更激进的减排措施，全球平均气温上升幅度可能在本世纪中叶就达到临界值。"我们正处于一个关键转折点，"一位气候科学家说，"现在的行动将决定未来几代人的生存环境。"</p>
    
    <p>各国政府正在加速调整气候政策，但专家认为，仅靠政府行动是不够的，企业和个人也需承担相应责任，共同应对这一全球性挑战。</p>`,
    author: '李环境',
    category: '社会',
    coverImage: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.oXJGATwq7Sa0GyNRvVrIZgHaEx?w=288&h=186&c=7&r=0&o=5&dpr=1.3&pid=1.7',
    images: [
      'https://th.bing.com/th/id/OIP.jX9TvwGcnV-zBGJIXxOfNQHaE7?w=256&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
      'https://th.bing.com/th/id/OIP.7TmE4KVg_IDc-3J7PBr32gHaEK?w=301&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
    ],
    tags: ['气候变化', '极端天气', '环保'],
    viewCount: 3245,
    likeCount: 567,
    commentCount: 123,
    isPublished: true,
    isRecommended: true,
    isHot: true,
    publishDate: new Date('2025-04-07T10:15:00')
  },
  {
    title: '国内体育盛事：青少年篮球联赛开幕，吸引万名学生参与',
    summary: '全国青少年篮球联赛昨日正式开幕，共有来自32个省市的500多支队伍参赛，引发全国关注。',
    content: `<p>昨日，2025年全国青少年篮球联赛在北京国家体育馆正式拉开帷幕。本届赛事规模空前，共有来自全国32个省市自治区的500多支队伍、超过1万名青少年球员参赛。</p>
    
    <p>开幕式上，多位篮球明星现身助阵，与年轻球员互动交流，分享职业经验。国家体育总局负责人表示，举办这样大规模的青少年体育赛事，旨在培养年轻一代的团队精神和健康生活方式，同时为国家篮球事业发掘新秀。</p>
    
    <p>据悉，本届联赛将持续三个月，比赛将在全国多个城市轮流举行。除常规比赛外，组委会还设置了技巧挑战赛、三分球大赛等多个专项竞赛，全方位展示青少年球员的篮球才华。</p>
    
    <p>多位教育专家认为，大型体育赛事对青少年的全面发展具有积极意义。"体育不仅锻炼身体，更能培养意志品质和团队合作精神，"一位教育学者如是说。</p>`,
    author: '张体育',
    category: '体育',
    coverImage: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.qP2M-IkMcaz3P_dWaNrp_QHaE7?w=306&h=204&c=7&r=0&o=5&dpr=1.3&pid=1.7',
    images: [
      'https://th.bing.com/th/id/OIP.OSpGHjzb9oKFUg_pi3DdZwHaE7?w=284&h=189&c=7&r=0&o=5&dpr=1.3&pid=1.7',
      'https://th.bing.com/th/id/OIP.oo-GLcPFj6CrCywH9G3sUQHaEA?w=297&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
    ],
    tags: ['篮球', '青少年', '体育赛事'],
    viewCount: 1890,
    likeCount: 345,
    commentCount: 78,
    isPublished: true,
    isRecommended: false,
    isHot: true,
    publishDate: new Date('2025-04-08T16:45:00')
  },
  {
    title: '健康饮食新研究：坚持地中海饮食或延长寿命',
    summary: '最新医学研究表明，长期坚持地中海饮食模式的人群平均寿命可能延长5-7年，并降低多种慢性疾病风险。',
    content: `<p>近期发表在国际顶尖医学期刊上的一项长达20年的跟踪研究显示，坚持地中海饮食模式的人群平均寿命可能比普通人群延长5-7年，同时患心脏病、糖尿病和某些癌症的风险显著降低。</p>
    
    <p>地中海饮食以橄榄油、坚果、水果、蔬菜、全谷物和鱼类为主，同时限制红肉和加工食品的摄入。研究者发现，这种饮食模式能够有效降低体内炎症水平，改善肠道菌群结构，并优化多项代谢指标。</p>
    
    <p>"我们的研究首次在分子水平上揭示了地中海饮食对健康的长期影响，"该研究的首席科学家表示，"这不仅是关于寿命的延长，更是关于生活质量的提升。"</p>
    
    <p>专家建议，即使无法完全转换为地中海饮食，在日常饮食中增加橄榄油、坚果和蔬菜水果的比例，减少加工食品的摄入，也能在一定程度上获得健康益处。</p>`,
    author: '陈健康',
    category: '健康',
    coverImage: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.u8QXomNCICq3pmzNGVEK_QHaE8?w=276&h=184&c=7&r=0&o=5&dpr=1.3&pid=1.7',
    images: [
      'https://th.bing.com/th/id/OIP.TnbzbUAXLzq_0ufaNU-AcQHaE8?w=297&h=198&c=7&r=0&o=5&dpr=1.3&pid=1.7',
      'https://th.bing.com/th/id/OIP.x4jrfK0qqjjzkN5XYv7n4wHaE7?w=230&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
    ],
    tags: ['健康饮食', '长寿', '地中海饮食'],
    viewCount: 4567,
    likeCount: 789,
    commentCount: 134,
    isPublished: true,
    isRecommended: true,
    isHot: false,
    publishDate: new Date('2025-04-06T09:20:00')
  },
  {
    title: '教育改革：多地试点"无作业日"，引发家长热议',
    summary: '全国多个城市开始试行每周"无作业日"政策，旨在减轻学生课业负担，培养多元兴趣，但家长意见不一。',
    content: `<p>从本学期开始，全国多个城市的中小学校开始试行每周"无作业日"政策。在"无作业日"，学校不布置书面家庭作业，鼓励学生参与体育活动、艺术实践或社会实践，旨在减轻课业负担，培养全面发展的能力。</p>
    
    <p>对于这一政策，教育部门表示，这是深化教育改革、促进素质教育的重要举措。"我们希望通过这种方式，让孩子们有更多时间发展个人兴趣，进行有意义的活动，而不仅仅是完成作业。"一位教育局负责人解释道。</p>
    
    <p>然而，家长们对此反应不一。支持者认为这给了孩子喘息和发展其他能力的空间，而反对者则担忧这可能导致学习退步。"作为家长，我们当然希望孩子能够全面发展，但在当前的教育评价体系下，学业成绩仍然是最重要的标准，"一位家长表达了自己的担忧。</p>
    
    <p>教育专家建议，"无作业日"政策需要配套措施，包括改革评价体系、提供优质的课外活动资源等，才能真正达到预期效果。</p>`,
    author: '赵教育',
    category: '教育',
    coverImage: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.tH2TmhnEwaL6moKhBhWqNwHaE8?w=284&h=188&c=7&r=0&o=5&dpr=1.3&pid=1.7',
    images: [
      'https://th.bing.com/th/id/OIP.dRLjMm772_YTYKUZUvHVzwHaEK?w=325&h=183&c=7&r=0&o=5&dpr=1.3&pid=1.7',
      'https://th.bing.com/th/id/OIP.E9tJ0J6MxxnpI9NPvkwAlAHaEJ?w=295&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
    ],
    tags: ['教育改革', '素质教育', '减负'],
    viewCount: 2789,
    likeCount: 456,
    commentCount: 210,
    isPublished: true,
    isRecommended: false,
    isHot: false,
    publishDate: new Date('2025-04-04T14:30:00')
  },
  {
    title: '娱乐圈新动向：年轻演员崛起，实力派成主流',
    summary: '近年来，一批年轻实力派演员在影视剧中崭露头角，观众和业内人士普遍认为娱乐圈正在回归作品和演技至上。',
    content: `<p>近两年来，国内影视圈呈现出明显的新趋势：一批年轻实力派演员凭借扎实的演技和优质作品崭露头角，而单纯依靠外貌和流量的明星则逐渐失去市场。这一变化被业内人士视为娱乐行业健康发展的积极信号。</p>
    
    <p>在最近几部热播剧和高票房电影中，主演多为科班出身、表演功底扎实的年轻演员。他们不仅在作品中展现了令人印象深刻的表演，也在采访和社交媒体上展示了对艺术的理解和专业态度，赢得了观众的认可。</p>
    
    <p>"现在的观众越来越成熟，他们关注的是角色塑造和故事讲述，而不仅仅是明星的外表，"一位资深导演表示，"这迫使整个行业重新思考什么才是真正有价值的。"</p>
    
    <p>与此同时，影视制作公司也开始调整策略，更加注重剧本质量和演员表演，而非简单堆砌明星。业内人士预测，这种以内容和专业为导向的趋势将在未来几年持续发展。</p>`,
    author: '孙娱乐',
    category: '娱乐',
    coverImage: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.JAJUAVrwN8yeNsMi-mdFRwHaNK?w=182&h=324&c=7&r=0&o=5&dpr=1.3&pid=1.7',
    images: [
      'https://th.bing.com/th/id/OIP.wyFAFaO06mXcHE7pROeT3wHaNL?w=182&h=324&c=7&r=0&o=5&dpr=1.3&pid=1.7',
      'https://th.bing.com/th/id/OIP.NW5XVpWFsMv9BqQT0aIPbwHaNK?w=182&h=324&c=7&r=0&o=5&dpr=1.3&pid=1.7'
    ],
    tags: ['娱乐圈', '演员', '影视剧'],
    viewCount: 5678,
    likeCount: 876,
    commentCount: 321,
    isPublished: true,
    isRecommended: true,
    isHot: true,
    publishDate: new Date('2025-04-09T11:00:00')
  }
];

// 新闻评论测试数据
const generateComments = (newsIds, userIds) => {
  const comments = [];
  
  // 为每条新闻创建3-8条随机评论
  newsIds.forEach(newsId => {
    const commentCount = Math.floor(Math.random() * 6) + 3; // 3-8条评论
    
    for (let i = 0; i < commentCount; i++) {
      // 随机选择一个用户ID
      const randomUserIndex = Math.floor(Math.random() * userIds.length);
      const userId = userIds[randomUserIndex];
      
      const comment = {
        newsId,
        userId,
        content: `这是一条测试评论，编号 ${i + 1}。评论内容可能包含对文章的看法、提问或补充信息。`,
        likeCount: Math.floor(Math.random() * 50),
        parentId: null,
        replyTo: null,
        status: 'active',
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000) // 随机1-7天内
      };
      
      comments.push(comment);
    }
  });
  
  return comments;
};

// 连接数据库并添加数据
async function seedNewsData() {
  try {
    await connectMongoDB();
    console.log('MongoDB连接成功');
    
    // 清除现有数据
    await News.deleteMany({});
    await NewsComment.deleteMany({});
    
    console.log('现有新闻数据已清除');
    
    // 添加新闻
    const createdNews = await News.insertMany(newsData);
    console.log(`已添加 ${createdNews.length} 条新闻`);
    
    // 收集新闻ID
    const newsIds = createdNews.map(news => news._id);
    
    // 尝试获取一些用户ID
    let userIds = [];
    try {
      const User = require('../models/User');
      const users = await User.find().limit(5);
      userIds = users.map(user => user._id);
    } catch (error) {
      console.log('无法获取用户，使用虚拟ID');
      // 如果没有用户，创建虚拟用户ID
      for (let i = 0; i < 5; i++) {
        userIds.push(new mongoose.Types.ObjectId());
      }
    }
    
    // 为新闻生成评论
    const comments = generateComments(newsIds, userIds);
    
    // 添加评论
    const createdComments = await NewsComment.insertMany(comments);
    console.log(`已添加 ${createdComments.length} 条评论`);
    
    // 创建一些回复评论
    const replies = [];
    const topLevelComments = createdComments.filter(c => c.parentId === null);
    
    // 为一半的顶级评论添加回复
    for (let i = 0; i < Math.floor(topLevelComments.length / 2); i++) {
      const parentComment = topLevelComments[i];
      const replyCount = Math.floor(Math.random() * 3) + 1; // 1-3条回复
      
      for (let j = 0; j < replyCount; j++) {
        // 随机选择用户
        const randomUserIndex = Math.floor(Math.random() * userIds.length);
        
        const reply = {
          newsId: parentComment.newsId,
          userId: userIds[randomUserIndex],
          content: `这是对评论的回复，回复编号 ${j + 1}。`,
          likeCount: Math.floor(Math.random() * 20),
          parentId: parentComment._id,
          replyTo: parentComment.userId,
          status: 'active',
          createdAt: new Date(parentComment.createdAt.getTime() + (86400000 * Math.random())) // 评论后1天内的随机时间
        };
        
        replies.push(reply);
      }
    }
    
    // 添加回复评论
    if (replies.length > 0) {
      const createdReplies = await NewsComment.insertMany(replies);
      console.log(`已添加 ${createdReplies.length} 条回复评论`);
    }
    
    // 更新新闻的评论计数
    for (const newsId of newsIds) {
      const commentCount = await NewsComment.countDocuments({ newsId });
      await News.findByIdAndUpdate(newsId, { commentCount });
    }
    
    console.log('新闻数据添加完成!');
    process.exit(0);
  } catch (error) {
    console.error('添加新闻数据失败:', error);
    process.exit(1);
  }
}

seedNewsData();
