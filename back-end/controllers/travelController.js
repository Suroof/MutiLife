const Destination = require("../models/Destination");
const Activity = require("../models/Activity");
const InfoCard = require("../models/InfoCard");
const FeaturedExperience = require("../models/FeaturedExperience");

// @route   GET api/travel/destinations
// @desc    获取所有目的地
// @access  Public
exports.getDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ createdAt: -1 });
    res.json({ success: true, data: destinations });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "获取目的地失败",
      error: error.message,
    });
  }
};

// @route   GET api/travel/destinations/:id
// @desc    获取单个目的地详情
// @access  Public
exports.getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: "目的地不存在" });
    }
    res.json({ success: true, data: destination });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "获取目的地详情失败",
      error: error.message,
    });
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
    res
      .status(500)
      .json({ success: false, message: "获取活动失败", error: error.message });
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
    res.status(500).json({
      success: false,
      message: "获取信息卡片失败",
      error: error.message,
    });
  }
};

// @route   GET api/travel/infocards/:id
// @desc    获取单个信息卡片详情
// @access  Public
exports.getInfoCardById = async (req, res) => {
  try {
    const infoCard = await InfoCard.findById(req.params.id);
    if (!infoCard) {
      return res
        .status(404)
        .json({ success: false, message: "信息卡片不存在" });
    }
    res.json({ success: true, data: infoCard });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "获取信息卡片详情失败",
    });
  }
};

// @route   GET api/travel/featured-experiences
// @desc    获取所有特色体验
// @access  Public
exports.getFeaturedExperiences = async (req, res) => {
  try {
    const featuredExperiences = await FeaturedExperience.find().sort({
      rating: -1,
    });
    res.json({ success: true, data: featuredExperiences });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "获取特色体验失败",
      error: error.message,
    });
  }
};

// @route   GET api/travel/featured-experiences/:id
// @desc    获取单个特色体验详情
// @access  Public
exports.getFeaturedExperienceById = async (req, res) => {
  try {
    const featuredExperience = await FeaturedExperience.findById(req.params.id);
    if (!featuredExperience) {
      return res
        .status(404)
        .json({ success: false, message: "特色体验不存在" });
    }
    res.json({ success: true, data: featuredExperience });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "获取特色体验详情失败",
      error: error.message,
    });
  }
};

// @route   GET api/travel/favorites
// @desc    获取用户收藏的目的地和特色体验列表
// @access  Public
exports.getFavorites = async (req, res) => {
  try {
    // 获取所有已收藏的目的地，按收藏时间倒序排列
    const destinations = await Destination.find({ isBookmarked: true }).sort({
      bookmarkedAt: -1,
    });

    // 获取所有已收藏的特色体验，按收藏时间倒序排列
    const featuredExperiences = await FeaturedExperience.find({
      isBookmarked: true,
    }).sort({ bookmarkedAt: -1 });

    // 合并并按收藏时间排序
    const allFavorites = [...destinations, ...featuredExperiences].sort(
      (a, b) => new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt)
    );

    res.json({ success: true, data: allFavorites });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "获取收藏列表失败",
      error: error.message,
    });
  }
};

// @route   DELETE api/travel/favorites/clear
// @desc    清空用户收藏列表
// @access  Public
exports.clearFavorites = async (req, res) => {
  try {
    // 清空目的地收藏
    await Destination.updateMany(
      { isBookmarked: true },
      { isBookmarked: false, bookmarkedAt: null }
    );

    // 清空特色体验收藏
    await FeaturedExperience.updateMany(
      { isBookmarked: true },
      { isBookmarked: false, bookmarkedAt: null }
    );

    res.json({ success: true, message: "收藏列表已清空" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "清空收藏列表失败",
      error: error.message,
    });
  }
};

// @route   PATCH api/travel/featured-experiences/:id/bookmark
// @desc    切换目的地收藏状态
// @access  Public
exports.toggleBookmark = async (req, res) => {
  try {
    const featuredExperience = await FeaturedExperience.findById(req.params.id);
    if (!featuredExperience) {
      return res
        .status(404)
        .json({ success: false, message: "特色体验不存在" });
    }

    // 切换收藏状态
    featuredExperience.isBookmarked = !featuredExperience.isBookmarked;

    // 如果是收藏操作，记录收藏时间
    if (featuredExperience.isBookmarked) {
      featuredExperience.bookmarkedAt = new Date();
    } else {
      featuredExperience.bookmarkedAt = null;
    }

    await featuredExperience.save();

    res.json({
      success: true,
      message: featuredExperience.isBookmarked ? "已添加收藏" : "已取消收藏",
      data: featuredExperience,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "收藏操作失败", error: error.message });
  }
};

// @route   GET api/travel/favorites/count
// @desc    获取用户收藏数量
// @access  Public
exports.getFavoritesCount = async (req, res) => {
  try {
    const destinationCount = await Destination.countDocuments({
      isBookmarked: true,
    });
    const featuredExperienceCount = await FeaturedExperience.countDocuments({
      isBookmarked: true,
    });
    const totalCount = destinationCount + featuredExperienceCount;

    res.json({ success: true, data: { count: totalCount } });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "获取收藏数量失败",
      error: error.message,
    });
  }
};
