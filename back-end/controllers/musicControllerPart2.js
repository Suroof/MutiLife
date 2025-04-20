// 获取艺术家详情
exports.getArtistDetail = async (req, res) => {
  try {
    const artistId = req.params.artistId;
    
    // 检查ID格式
    if (!mongoose.Types.ObjectId.isValid(artistId)) {
      return res.status(400).json({ message: '无效的艺术家ID' });
    }
    
    // 查找艺术家
    const artist = await Artist.findById(artistId)
      .populate('hotSongs')
      .populate('albums')
      .populate('mvs');
    
    if (!artist) {
      return res.status(404).json({ message: '艺术家不存在' });
    }
    
    // 检查用户是否关注该艺术家
    const userMusic = await UserMusic.findOne({ userId: req.user.id });
    const isFollowed = userMusic && userMusic.followingArtists.includes(artistId);
    
    // 格式化响应数据
    const responseData = {
      id: artist._id,
      name: artist.name,
      avatar: artist.avatar,
      coverImg: artist.coverImg,
      biography: artist.biography,
      region: artist.region,
      birthday: artist.birthday,
      fansCount: artist.fansCount,
      style: artist.style,
      hotSongs: artist.hotSongs.map(song => ({
        id: song._id,
        name: song.name,
        album: song.album,
        duration: song.duration,
        coverImg: song.coverImg,
        url: song.url,
        isExclusive: song.isExclusive
      })),
      albums: artist.albums.map(album => ({
        id: album._id,
        name: album.name,
        coverImg: album.coverImg,
        releaseDate: album.releaseDate
      })),
      mvs: artist.mvs.map(mv => ({
        id: mv._id,
        name: mv.name,
        coverImg: mv.coverImg,
        duration: mv.duration
      })),
      isFollowed
    };
    
    res.json({ success: true, data: responseData });
  } catch (err) {
    console.error('获取艺术家详情失败:', err);
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
    const createdPlaylists = await Playlist.find({ creator: req.user.id })
      .sort({ createdAt: -1 });
    
    // 查找用户收藏的歌单
    const favoritePlaylists = await Playlist.find({
      _id: { $in: userMusic.favoritePlaylists },
      creator: { $ne: req.user.id } // 排除自己创建的歌单
    })
    .populate('creator', 'username name avatar')
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
      creator: req.user.id,
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
