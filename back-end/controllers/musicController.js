const { validationResult } = require('express-validator');
const Song = require('../models/Song');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Playlist = require('../models/Playlist');
const MV = require('../models/MV');
const UserMusic = require('../models/UserMusic');
const User = require('../models/User');
const mongoose = require('mongoose');

// 获取每日推荐歌曲
exports.getDailyRecommendations = async (req, res) => {
  try {
    console.log('开始获取每日推荐歌曲...');
    const limit = parseInt(req.query.limit) || 10;
    
    // 简化逻辑，直接从数据库获取歌曲
    const recommendedSongs = await Song.find({ status: 'active' })
      .sort({ playCount: -1, _id: -1 })
      .limit(limit);
    
    console.log(`获取了${recommendedSongs.length}首每日推荐歌曲`);
    return res.json(recommendedSongs);
  } catch (err) {
    console.error('获取每日推荐歌曲失败:', err);
    res.status(500).json({ message: '服务器错误', error: err.message });
  }
};

// 获取热门歌单
exports.getHotPlaylists = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    // 改进查询逻辑，不再依赖creator必须存在
    const hotPlaylists = await Playlist.find({ status: 'active' })
      .sort({ playCount: -1 })
      .limit(limit)
      .populate({
        path: 'creator',
        select: 'nickname avatar',
      });
    
    res.json(hotPlaylists);
  } catch (err) {
    console.error('获取热门歌单失败:', err);
    res.status(500).json({ message: '服务器错误', error: err.message });
  }
};

// 获取歌单详情
exports.getPlaylistDetail = async (req, res) => {
  try {
    console.log('获取歌单详情, ID:', req.params.playlistId);
    
    const playlist = await Playlist.findById(req.params.playlistId)
      .populate({
        path: 'creator',
        select: 'nickname avatar',
        // 允许creator为null
        match: { $exists: true }
      })
      .populate({
        path: 'songs',
        select: 'name artist album duration cover url plays badge'
      });
    
    if (!playlist) {
      console.log('歌单不存在:', req.params.playlistId);
      return res.status(404).json({ message: '歌单不存在' });
    }
    
    console.log('歌单详情获取成功');
    res.json(playlist);
  } catch (err) {
    console.error('获取歌单详情失败:', err);
    res.status(500).json({ message: '服务器错误', error: err.message });
  }
};

// 获取歌曲详情
exports.getSongDetail = async (req, res) => {
  try {
    const song = await Song.findById(req.params.songId)
      .populate('artistId', 'name avatar');
    
    if (!song) {
      return res.status(404).json({ message: '歌曲不存在' });
    }
    
    res.json(song);
  } catch (err) {
    console.error('获取歌曲详情失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取歌曲播放URL
exports.getSongUrl = async (req, res) => {
  try {
    const song = await Song.findById(req.params.songId);
    
    if (!song) {
      return res.status(404).json({ message: '歌曲不存在' });
    }
    
    // 记录播放次数
    song.playCount += 1;
    await song.save();
    
    res.json({ url: song.url });
  } catch (err) {
    console.error('获取歌曲URL失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取歌词
exports.getLyrics = async (req, res) => {
  try {
    const song = await Song.findById(req.params.songId);
    
    if (!song) {
      return res.status(404).json({ message: '歌曲不存在' });
    }
    
    res.json({ lyrics: song.lyrics });
  } catch (err) {
    console.error('获取歌词失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 搜索音乐
exports.searchMusic = async (req, res) => {
  try {
    const { keyword, type = 'song', limit = 20 } = req.query;
    
    if (!keyword) {
      return res.status(400).json({ message: '请提供搜索关键词' });
    }
    
    const searchRegex = new RegExp(keyword, 'i');
    let results = [];
    
    switch (type) {
      case 'song':
        results = await Song.find({
          $or: [
            { name: searchRegex },
            { artist: searchRegex }
          ],
          status: 'active'
        })
        .limit(parseInt(limit))
        .populate('artistId', 'name avatar');
        break;
        
      case 'artist':
        results = await Artist.find({
          name: searchRegex,
          status: 'active'
        })
        .limit(parseInt(limit));
        break;
        
      case 'album':
        results = await Album.find({
          name: searchRegex,
          status: 'active'
        })
        .limit(parseInt(limit))
        .populate('artistId', 'name avatar');
        break;
        
      case 'playlist':
        results = await Playlist.find({
          name: searchRegex,
          status: 'active'
        })
        .limit(parseInt(limit))
        .populate('createdBy', 'name avatar');
        break;
        
      default:
        return res.status(400).json({ message: '无效的搜索类型' });
    }
    
    res.json({ results });
  } catch (err) {
    console.error('搜索音乐失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取艺术家详情
exports.getArtistDetail = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.artistId);
    
    if (!artist) {
      return res.status(404).json({ message: '艺术家不存在' });
    }
    
    // 获取艺术家的热门歌曲
    const hotSongs = await Song.find({ artistId: artist._id, status: 'active' })
      .sort({ playCount: -1 })
      .limit(10);
    
    // 获取艺术家的专辑
    const albums = await Album.find({ artistId: artist._id, status: 'active' })
      .sort({ releaseDate: -1 });
    
    // 获取艺术家的MV
    const mvs = await MV.find({ artistId: artist._id, status: 'active' })
      .sort({ releaseDate: -1 })
      .limit(5);
    
    res.json({
      artist,
      hotSongs,
      albums,
      mvs
    });
  } catch (err) {
    console.error('获取艺术家详情失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取推荐艺术家
exports.getRecommendedArtists = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    // 获取粉丝数最多的艺术家作为推荐
    const recommendedArtists = await Artist.find({ status: 'active' })
      .sort({ fansCount: -1 })
      .limit(limit);
    
    console.log(`获取了${recommendedArtists.length}个推荐艺术家`);
    res.json(recommendedArtists);
  } catch (err) {
    console.error('获取推荐艺术家失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取用户收藏的歌单
exports.getUserPlaylists = async (req, res) => {
  try {
    // 查找用户的UserMusic记录
    const userMusic = await UserMusic.findOne({ userId: req.user.id });
    
    if (!userMusic) {
      return res.json([]);
    }
    
    // 查找用户创建的歌单
    const createdPlaylists = await Playlist.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 });
    
    // 查找用户收藏的歌单
    const favoritePlaylists = await Playlist.find({
      _id: { $in: userMusic.favoritePlaylists },
      createdBy: { $ne: req.user.id } // 排除自己创建的歌单
    })
    .populate('createdBy', 'name avatar')
    .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: {
        created: createdPlaylists,
        favorited: favoritePlaylists
      }
    });
  } catch (err) {
    console.error('获取用户歌单失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 创建歌单
exports.createPlaylist = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, description, isPrivate } = req.body;
    
    // 创建新歌单
    const newPlaylist = new Playlist({
      name,
      description: description || '',
      createdBy: req.user.id,
      isPrivate: !!isPrivate
    });
    
    await newPlaylist.save();
    
    // 添加到用户的歌单列表
    await UserMusic.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { playlists: newPlaylist._id } },
      { upsert: true }
    );
    
    res.status(201).json({
      success: true,
      data: newPlaylist
    });
  } catch (err) {
    console.error('创建歌单失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 收藏/取消收藏歌单
exports.favoritePlaylist = async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    const { like } = req.body;
    
    // 检查ID格式
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
      return res.status(400).json({ message: '无效的歌单ID' });
    }
    
    // 查找歌单
    const playlist = await Playlist.findById(playlistId);
    
    if (!playlist) {
      return res.status(404).json({ message: '歌单不存在' });
    }
    
    // 获取用户的UserMusic记录，如果不存在则创建
    let userMusic = await UserMusic.findOne({ userId: req.user.id });
    if (!userMusic) {
      userMusic = new UserMusic({ userId: req.user.id });
    }
    
    let message = '';
    
    if (like) {
      // 添加到收藏
      if (!userMusic.favoritePlaylists.includes(playlistId)) {
        userMusic.favoritePlaylists.push(playlistId);
        playlist.favoriteCount += 1;
        message = '歌单收藏成功';
      } else {
        message = '歌单已经收藏过了';
      }
    } else {
      // 取消收藏
      if (userMusic.favoritePlaylists.includes(playlistId)) {
        userMusic.favoritePlaylists = userMusic.favoritePlaylists.filter(
          id => id.toString() !== playlistId
        );
        if (playlist.favoriteCount > 0) {
          playlist.favoriteCount -= 1;
        }
        message = '取消收藏成功';
      } else {
        message = '歌单未收藏过';
      }
    }
    
    await userMusic.save();
    await playlist.save();
    
    res.json({
      success: true,
      message,
      favoriteCount: playlist.favoriteCount
    });
  } catch (err) {
    console.error('收藏/取消收藏歌单失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 添加歌曲到播放历史
exports.addToHistory = async (req, res) => {
  try {
    const { songId } = req.body;
    
    // 检查ID格式
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ message: '无效的歌曲ID' });
    }
    
    // 查找歌曲
    const song = await Song.findById(songId);
    
    if (!song) {
      return res.status(404).json({ message: '歌曲不存在' });
    }
    
    // 添加到用户播放历史
    await UserMusic.findOneAndUpdate(
      { userId: req.user.id },
      { 
        $push: { 
          playHistory: { 
            $each: [{ song: songId, playedAt: new Date() }],
            $position: 0,
            $slice: 100 // 只保留最近的100首歌曲
          } 
        } 
      },
      { upsert: true, new: true }
    );
    
    res.json({
      success: true,
      message: '已添加到播放历史'
    });
  } catch (err) {
    console.error('添加到播放历史失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取播放历史
exports.getPlayHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    
    // 查找用户的UserMusic记录
    const userMusic = await UserMusic.findOne({ userId: req.user.id })
      .populate({
        path: 'playHistory.song',
        select: 'name artist album duration coverImg url isExclusive'
      });
    
    if (!userMusic || !userMusic.playHistory || userMusic.playHistory.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    // 格式化播放历史
    const playHistory = userMusic.playHistory
      .filter(entry => entry.song) // 过滤掉无效的歌曲引用
      .slice(0, limit)
      .map(entry => ({
        id: entry.song._id,
        name: entry.song.name,
        artist: entry.song.artist,
        album: entry.song.album,
        duration: entry.song.duration,
        coverImg: entry.song.coverImg,
        url: entry.song.url,
        isExclusive: entry.song.isExclusive,
        playedAt: entry.playedAt
      }));
    
    res.json({
      success: true,
      data: playHistory
    });
  } catch (err) {
    console.error('获取播放历史失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 收藏/取消收藏歌曲
exports.favoriteSong = async (req, res) => {
  try {
    const songId = req.params.songId;
    const { like } = req.body;
    
    // 检查ID格式
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ message: '无效的歌曲ID' });
    }
    
    // 查找歌曲
    const song = await Song.findById(songId);
    
    if (!song) {
      return res.status(404).json({ message: '歌曲不存在' });
    }
    
    // 获取用户的UserMusic记录，如果不存在则创建
    let userMusic = await UserMusic.findOne({ userId: req.user.id });
    if (!userMusic) {
      userMusic = new UserMusic({ userId: req.user.id });
    }
    
    let message = '';
    
    if (like) {
      // 添加到收藏
      if (!userMusic.favoriteSongs.includes(songId)) {
        userMusic.favoriteSongs.push(songId);
        message = '歌曲收藏成功';
      } else {
        message = '歌曲已经收藏过了';
      }
    } else {
      // 取消收藏
      if (userMusic.favoriteSongs.includes(songId)) {
        userMusic.favoriteSongs = userMusic.favoriteSongs.filter(
          id => id.toString() !== songId
        );
        message = '取消收藏成功';
      } else {
        message = '歌曲未收藏过';
      }
    }
    
    await userMusic.save();
    
    res.json({
      success: true,
      message
    });
  } catch (err) {
    console.error('收藏/取消收藏歌曲失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 关注/取消关注艺术家
exports.followArtist = async (req, res) => {
  try {
    const artistId = req.params.artistId;
    const { follow } = req.body;
    
    // 检查ID格式
    if (!mongoose.Types.ObjectId.isValid(artistId)) {
      return res.status(400).json({ message: '无效的艺术家ID' });
    }
    
    // 查找艺术家
    const artist = await Artist.findById(artistId);
    
    if (!artist) {
      return res.status(404).json({ message: '艺术家不存在' });
    }
    
    // 获取用户的UserMusic记录，如果不存在则创建
    let userMusic = await UserMusic.findOne({ userId: req.user.id });
    if (!userMusic) {
      userMusic = new UserMusic({ userId: req.user.id });
    }
    
    let message = '';
    
    if (follow) {
      // 添加到关注
      if (!userMusic.followingArtists.includes(artistId)) {
        userMusic.followingArtists.push(artistId);
        artist.fansCount += 1;
        message = '关注艺术家成功';
      } else {
        message = '已经关注过该艺术家';
      }
    } else {
      // 取消关注
      if (userMusic.followingArtists.includes(artistId)) {
        userMusic.followingArtists = userMusic.followingArtists.filter(
          id => id.toString() !== artistId
        );
        if (artist.fansCount > 0) {
          artist.fansCount -= 1;
        }
        message = '取消关注成功';
      } else {
        message = '未关注过该艺术家';
      }
    }
    
    await userMusic.save();
    await artist.save();
    
    res.json({
      success: true,
      message,
      fansCount: artist.fansCount
    });
  } catch (err) {
    console.error('关注/取消关注艺术家失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};