const Destination = require('../models/Destination');
const Activity = require('../models/Activity');
const InfoCard = require('../models/InfoCard');
const FeaturedExperience = require('../models/FeaturedExperience');

// @route   GET api/travel/destinations
// @desc    获取所有目的地
// @access  Public
exports.getDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ createdAt: -1 });
    res.json({ success: true, data: destinations });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取目的地失败', error: error.message });
  }
};

// @route   GET api/travel/destinations/:id
// @desc    获取单个目的地详情
// @access  Public
exports.getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: '目的地不存在' });
    }
    res.json({ success: true, data: destination });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取目的地详情失败', error: error.message });
  }
};

// @route   GET api/travel/activities
// @desc    获取所有活动
// @access  Public
exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 });
    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取活动失败', error: error.message });
  }
};

// @route   GET api/travel/infocards
// @desc    获取所有信息卡片
// @access  Public
exports.getInfoCards = async (req, res) => {
  try {
    const infoCards = await InfoCard.find().sort({ createdAt: -1 });
    res.json({ success: true, data: infoCards });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取信息卡片失败', error: error.message });
  }
};

// @route   GET api/travel/featured-experiences
// @desc    获取所有特色体验
// @access  Public
exports.getFeaturedExperiences = async (req, res) => {
  try {
    const featuredExperiences = await FeaturedExperience.find().sort({ rating: -1 });
    res.json({ success: true, data: featuredExperiences });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取特色体验失败', error: error.message });
  }
};

// @route   GET api/travel/featured-experiences/:id
// @desc    获取单个特色体验详情
// @access  Public
exports.getFeaturedExperienceById = async (req, res) => {
  try {
    const featuredExperience = await FeaturedExperience.findById(req.params.id);
    if (!featuredExperience) {
      return res.status(404).json({ success: false, message: '特色体验不存在' });
    }
    res.json({ success: true, data: featuredExperience });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取特色体验详情失败', error: error.message });
  }
};

// @route   PATCH api/travel/destinations/:id/bookmark
// @desc    切换目的地收藏状态
// @access  Public
exports.toggleBookmark = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: '目的地不存在' });
    }
    
    destination.isBookmarked = !destination.isBookmarked;
    await destination.save();
    
    res.json({ success: true, data: destination });
  } catch (error) {
    res.status(500).json({ success: false, message: '更新收藏状态失败', error: error.message });
  }
};