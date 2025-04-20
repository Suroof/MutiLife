// 创建文件：d:\Work\MutiLife\back-end\scripts\seedMusicData.js
const mongoose = require('mongoose');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Song = require('../models/Song');
const Playlist = require('../models/Playlist');
const MV = require('../models/MV');
const { connectMongoDB } = require('../config/database');

// 测试数据
const artists = [
  {
    name: '周杰伦',
    avatar: '/static/images/artists/jay_chou.jpg',
    biography: '华语流行乐坛知名歌手、音乐人、词曲创作人...',
    region: '中国台湾',
    fansCount: 1000000
  },
  {
    name: '林俊杰',
    avatar: '/static/images/artists/jj_lin.jpg',
    biography: '新加坡华语流行乐男歌手、音乐人、词曲创作人...',
    region: '新加坡',
    fansCount: 800000
  },
  {
    name: '邓紫棋',
    avatar: '/static/images/artists/g_em.jpg',
    biography: '中国香港创作型女歌手...',
    region: '中国香港',
    fansCount: 750000
  }
];

const albums = [
  {
    name: '叶惠美',
    artist: '周杰伦',
    coverImg: '/static/images/albums/yehuimei.jpg',
    releaseDate: new Date('2003-07-31')
  },
  {
    name: '范特西',
    artist: '周杰伦',
    coverImg: '/static/images/albums/fantasy.jpg',
    releaseDate: new Date('2001-09-14')
  },
  {
    name: '她说',
    artist: '林俊杰',
    coverImg: '/static/images/albums/she_says.jpg',
    releaseDate: new Date('2010-12-08')
  },
  {
    name: 'G.E.M.',
    artist: '邓紫棋',
    coverImg: '/static/images/albums/gem.jpg',
    releaseDate: new Date('2012-08-03')
  }
];

const songs = [
  {
    name: '晴天',
    artist: '周杰伦',
    album: '叶惠美',
    duration: 269,
    coverImg: '/static/images/albums/yehuimei.jpg',
    url: '/static/music/qingtian.mp3',
    lyrics: '[00:00.00]晴天 - 周杰伦\n[00:04.01]词：周杰伦\n[00:08.02]曲：周杰伦...'
  },
  {
    name: '七里香',
    artist: '周杰伦',
    album: '七里香',
    duration: 258,
    coverImg: '/static/images/albums/qilixiang.jpg',
    url: '/static/music/qilixiang.mp3',
    lyrics: '[00:00.00]七里香 - 周杰伦\n[00:04.01]词：周杰伦\n[00:08.02]曲：周杰伦...'
  },
  {
    name: '她说',
    artist: '林俊杰',
    album: '她说',
    duration: 275,
    coverImg: '/static/images/albums/she_says.jpg',
    url: '/static/music/tashou.mp3',
    lyrics: '[00:00.00]她说 - 林俊杰\n[00:04.01]词：简迷离\n[00:08.02]曲：林俊杰...'
  },
  {
    name: '泡沫',
    artist: '邓紫棋',
    album: 'G.E.M.',
    duration: 243,
    coverImg: '/static/images/albums/gem.jpg',
    url: '/static/music/paomo.mp3',
    lyrics: '[00:00.00]泡沫 - 邓紫棋\n[00:04.01]词：邓紫棋\n[00:08.02]曲：邓紫棋...'
  }
];

// 连接数据库并添加数据
async function seedData() {
  try {
    await connectMongoDB();
    console.log('Connected to MongoDB');
    
    // 清除现有数据
    await Artist.deleteMany({});
    await Album.deleteMany({});
    await Song.deleteMany({});
    await Playlist.deleteMany({});
    await MV.deleteMany({});
    
    console.log('现有音乐数据已清除');
    
    // 添加艺术家
    const createdArtists = await Artist.insertMany(artists);
    console.log(`已添加 ${createdArtists.length} 个艺术家`);
    
    // 添加专辑 (关联艺术家ID)
    const albumsWithArtistIds = await Promise.all(albums.map(async (album) => {
      const artist = await Artist.findOne({ name: album.artist });
      return {
        ...album,
        artistId: artist._id
      };
    }));
    
    const createdAlbums = await Album.insertMany(albumsWithArtistIds);
    console.log(`已添加 ${createdAlbums.length} 个专辑`);
    
    // 添加歌曲 (关联艺术家ID和专辑ID)
    const songsWithIds = await Promise.all(songs.map(async (song) => {
      const artist = await Artist.findOne({ name: song.artist });
      const album = await Album.findOne({ name: song.album });
      return {
        ...song,
        artistId: artist ? artist._id : null,
        albumId: album ? album._id : null
      };
    }));
    
    const createdSongs = await Song.insertMany(songsWithIds);
    console.log(`已添加 ${createdSongs.length} 首歌曲`);
    
    // 更新艺术家的热门歌曲
    for (const artist of createdArtists) {
      const artistSongs = await Song.find({ artistId: artist._id }).limit(10);
      artist.hotSongs = artistSongs.map(song => song._id);
      await artist.save();
    }
    
    // 更新专辑的歌曲列表
    for (const album of createdAlbums) {
      const albumSongs = await Song.find({ albumId: album._id });
      album.songs = albumSongs.map(song => song._id);
      await album.save();
    }
    
    // 创建一个虚拟的创建者ID (因为Playlist模型需要creator字段)
    const creatorId = new mongoose.Types.ObjectId();
    
    // 创建一些示例歌单
    const playlists = [
      {
        name: '流行热歌',
        description: '最热门的流行歌曲集合',
        coverImg: '/static/images/playlists/hot_songs.jpg',
        songs: createdSongs.slice(0, 10).map(song => song._id),
        playCount: 5000,
        favoriteCount: 1200,
        isPrivate: false,
        creator: creatorId  // 添加创建者ID
      },
      {
        name: '周杰伦精选',
        description: '周杰伦热门歌曲集合',
        coverImg: '/static/images/playlists/jay_chou.jpg',
        songs: createdSongs.filter(song => song.artist === '周杰伦').map(song => song._id),
        playCount: 3500,
        favoriteCount: 900,
        isPrivate: false,
        creator: creatorId  // 添加创建者ID
      },
      {
        name: '华语经典',
        description: '经典华语歌曲合集',
        coverImg: '/static/images/playlists/chinese_classics.jpg',
        songs: createdSongs.map(song => song._id),
        playCount: 4200,
        favoriteCount: 1050,
        isPrivate: false,
        creator: creatorId  // 添加创建者ID
      }
    ];
    
    const createdPlaylists = await Playlist.insertMany(playlists);
    console.log(`已添加 ${createdPlaylists.length} 个歌单`);
    
    // 创建几个MV (音乐视频)
    const mvs = [
      {
        name: '晴天MV',
        artist: '周杰伦',
        artistId: createdArtists.find(a => a.name === '周杰伦')._id,
        songId: createdSongs.find(s => s.name === '晴天')._id,
        coverImg: '/static/images/mvs/qingtian.jpg',
        videoUrl: '/static/videos/qingtian.mp4',
        duration: 300,
        description: '《晴天》官方音乐录影带',
        releaseDate: new Date('2003-07-31'),
        playCount: 2000000,
        likeCount: 150000
      },
      {
        name: '她说MV',
        artist: '林俊杰',
        artistId: createdArtists.find(a => a.name === '林俊杰')._id,
        songId: createdSongs.find(s => s.name === '她说')._id,
        coverImg: '/static/images/mvs/she_says.jpg',
        videoUrl: '/static/videos/she_says.mp4',
        duration: 285,
        description: '《她说》官方音乐录影带',
        releaseDate: new Date('2010-12-08'),
        playCount: 1500000,
        likeCount: 120000
      }
    ];
    
    const createdMVs = await MV.insertMany(mvs);
    console.log(`已添加 ${createdMVs.length} 个MV`);
    
    // 更新艺术家的MV列表
    for (const artist of createdArtists) {
      const artistMVs = await MV.find({ artistId: artist._id });
      artist.mvs = artistMVs.map(mv => mv._id);
      await artist.save();
    }
    
    console.log('音乐数据添加完成!');
    process.exit(0);
  } catch (error) {
    console.error('添加音乐数据失败:', error);
    process.exit(1);
  }
}

seedData();