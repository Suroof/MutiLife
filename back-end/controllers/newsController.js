const { validationResult } = require('express-validator');
const News = require('../models/News');
const NewsComment = require('../models/NewsComment');
const mongoose = require('mongoose');

// 获取新闻列表
exports.getNewsList = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      tag, 
      recommended, 
      hot, 
      search 
    } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    let query = { isPublished: true, status: 'active' };
    
    // 按分类筛选
    if (category) {
      query.category = category;
    }
    
    // 按标签筛选
    if (tag) {
      query.tags = tag;
    }
    
    // 推荐新闻
    if (recommended === 'true') {
      query.isRecommended = true;
    }
    
    // 热门新闻
    if (hot === 'true') {
      query.isHot = true;
    }
    
    // 搜索功能
    if (search) {
      query.$text = { $search: search };
    }
    
    // 获取总数
    const total = await News.countDocuments(query);
    
    // 获取分页数据
    const news = await News.find(query)
      .sort({ publishDate: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .select('title summary category coverImage viewCount publishDate');
    
    res.json({
      success: true,
      data: {
        list: news,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (err) {
    console.error('获取新闻列表失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取新闻详情
exports.getNewsById = async (req, res) => {
  try {
    const newsId = req.params.id;
    
    // 检查ID格式
    if (!mongoose.Types.ObjectId.isValid(newsId)) {
      return res.status(400).json({ message: '无效的新闻ID' });
    }
    
    // 查找新闻
    const news = await News.findById(newsId);
    
    if (!news) {
      return res.status(404).json({ message: '新闻不存在' });
    }
    
    if (news.status !== 'active' || !news.isPublished) {
      return res.status(403).json({ message: '该新闻不可访问' });
    }
    
    // 增加浏览次数
    news.viewCount += 1;
    await news.save();
    
    res.json({
      success: true,
      data: news
    });
  } catch (err) {
    console.error('获取新闻详情失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取推荐新闻
exports.getRecommendedNews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const recommendedNews = await News.find({ 
      isPublished: true, 
      status: 'active',
      isRecommended: true 
    })
    .sort({ publishDate: -1 })
    .limit(limit)
    .select('title summary category coverImage viewCount publishDate');
    
    res.json({
      success: true,
      data: recommendedNews
    });
  } catch (err) {
    console.error('获取推荐新闻失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取热门新闻
exports.getHotNews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const hotNews = await News.find({ 
      isPublished: true, 
      status: 'active',
      isHot: true 
    })
    .sort({ viewCount: -1 })
    .limit(limit)
    .select('title summary category coverImage viewCount publishDate');
    
    res.json({
      success: true,
      data: hotNews
    });
  } catch (err) {
    console.error('获取热门新闻失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取新闻评论
exports.getNewsComments = async (req, res) => {
  try {
    const newsId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // 检查ID格式
    if (!mongoose.Types.ObjectId.isValid(newsId)) {
      return res.status(400).json({ message: '无效的新闻ID' });
    }
    
    // 查找新闻是否存在
    const newsExists = await News.exists({ _id: newsId });
    
    if (!newsExists) {
      return res.status(404).json({ message: '新闻不存在' });
    }
    
    // 查找顶级评论
    const comments = await NewsComment.find({ 
      newsId, 
      parentId: null,
      status: 'active'
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('userId', 'username name avatar');
    
    // 对于每个顶级评论，获取其回复
    const commentsWithReplies = await Promise.all(comments.map(async (comment) => {
      const replies = await NewsComment.find({ 
        parentId: comment._id,
        status: 'active'
      })
      .sort({ createdAt: 1 })
      .populate('userId', 'username name avatar')
      .populate('replyTo', 'username name');
      
      return {
        ...comment.toObject(),
        replies
      };
    }));
    
    // 获取总评论数
    const totalComments = await NewsComment.countDocuments({ 
      newsId, 
      parentId: null,
      status: 'active'
    });
    
    res.json({
      success: true,
      data: {
        comments: commentsWithReplies,
        pagination: {
          total: totalComments,
          page,
          limit,
          pages: Math.ceil(totalComments / limit)
        }
      }
    });
  } catch (err) {
    console.error('获取新闻评论失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 添加评论
exports.addComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const newsId = req.params.id;
    const { content, parentId, replyTo } = req.body;
    
    // 检查ID格式
    if (!mongoose.Types.ObjectId.isValid(newsId)) {
      return res.status(400).json({ message: '无效的新闻ID' });
    }
    
    // 检查新闻是否存在
    const news = await News.findById(newsId);
    
    if (!news) {
      return res.status(404).json({ message: '新闻不存在' });
    }
    
    // 检查父评论是否存在（如果有）
    if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({ message: '无效的父评论ID' });
    }
    
    if (parentId) {
      const parentComment = await NewsComment.findById(parentId);
      if (!parentComment) {
        return res.status(404).json({ message: '父评论不存在' });
      }
    }
    
    // 创建新评论
    const newComment = new NewsComment({
      newsId,
      userId: req.user.id,
      content,
      parentId: parentId || null,
      replyTo: replyTo || null
    });
    
    await newComment.save();
    
    // 更新新闻评论计数
    news.commentCount += 1;
    await news.save();
    
    // 获取包含用户信息的完整评论
    const populatedComment = await NewsComment.findById(newComment._id)
      .populate('userId', 'username name avatar')
      .populate('replyTo', 'username name');
    
    res.status(201).json({
      success: true,
      data: populatedComment
    });
  } catch (err) {
    console.error('添加评论失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 点赞新闻
exports.likeNews = async (req, res) => {
  try {
    const newsId = req.params.id;
    
    // 检查ID格式
    if (!mongoose.Types.ObjectId.isValid(newsId)) {
      return res.status(400).json({ message: '无效的新闻ID' });
    }
    
    // 查找新闻
    const news = await News.findById(newsId);
    
    if (!news) {
      return res.status(404).json({ message: '新闻不存在' });
    }
    
    // 增加点赞数
    news.likeCount += 1;
    await news.save();
    
    res.json({
      success: true,
      message: '点赞成功',
      likeCount: news.likeCount
    });
  } catch (err) {
    console.error('点赞新闻失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取新闻分类列表
exports.getCategories = async (req, res) => {
  try {
    const categories = [
      '社会', '科技', '娱乐', '体育', '健康', '教育', '其他'
    ];
    
    res.json({
      success: true,
      data: categories
    });
  } catch (err) {
    console.error('获取新闻分类失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取热门标签
exports.getHotTags = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // 聚合查询找出最常用的标签
    const tags = await News.aggregate([
      { $match: { isPublished: true, status: 'active' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);
    
    res.json({
      success: true,
      data: tags.map(tag => tag._id)
    });
  } catch (err) {
    console.error('获取热门标签失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};
