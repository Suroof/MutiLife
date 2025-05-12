// 创建文件：d:\Work\MutiLife\back-end\scripts\seedMusicData.js
const mongoose = require('mongoose');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Song = require('../models/Song');
const Playlist = require('../models/Playlist');
const MV = require('../models/MV');

// 直接连接到 MongoDB，不依赖于环境变量
const connectToDatabase = async () => {
  try {
    // 直接使用连接字符串
    const mongoURI = 'mongodb://localhost:27017/mutilife';
    console.log('尝试连接到 MongoDB:', mongoURI);

    // 设置 strictQuery 选项以消除警告
    mongoose.set('strictQuery', false);

    await mongoose.connect(mongoURI, {
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

const artists = [
  {
    name: 'Kanye West',
    avatar: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.EKoP2JY6MexrueKhe6MTWwHaFE?w=233&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
    biography: '华语流行乐坛知名歌手、音乐人、词曲创作人...',
    region: '美国',
    fansCount: 1000000,
    cover: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.EKoP2JY6MexrueKhe6MTWwHaFE?w=233&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
  },
  {
    name: 'JCole',
    avatar: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.ecjvrrKX7KlS2V5NI4gaRAHaEK?w=321&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
    biography: '新加坡华语流行乐男歌手、音乐人、词曲创作人...',
    region: '美国',
    fansCount: 800000,
    cover: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.ziDsUJ_nNkcCc1tZBr_ZHAHaEc?w=307&h=184&c=7&r=0&o=5&dpr=1.3&pid=1.7'
  },
  {
    name: '方大同',
    avatar: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.fUniXsti-XkbaHTPTpiYzgHaE7?w=271&h=185&c=7&r=0&o=5&dpr=1.3&pid=1.7',
    biography: '中国创作型男歌手...',
    region: '中国大陆',
    fansCount: 750000,
    cover: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.JIbUwR5UVFdqMZ_oWKU4xgAAAA?w=269&h=176&c=7&r=0&o=5&dpr=1.3&pid=1.7'
  },
  {
    name: 'Post Malone',
    avatar: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.oe9FXtWTGdJWJO8gMpKf0AHaDt?w=286&h=175&c=7&r=0&o=5&dpr=1.3&pid=1.7',
    biography: '中国创作型男歌手...',
    region: '美国',
    fansCount: 750000,
    cover: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.5-ue2Z3__iKDliUwMLIjzgHaE8?w=233&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
  }
];

const albums = [
  {
    name: 'Bad News',
    artist: 'Kanye West',
    coverImg: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/4d/75/2d/4d752db1-022d-f65d-40a1-a2390f01427a/13UAEIM26465.rgb.jpg/600x600bb.jpg',
    releaseDate: new Date('2003-07-31')
  },
  {
    name: 'Donda',
    artist: 'Justin Bieber',
    coverImg: '/static/images/albums/fantasy.jpg',
    releaseDate: new Date('2001-09-14')
  },
  {
    name: 'Hollywood\'s Bleeding',
    artist: 'Post Malone',
    coverImg: '/static/images/albums/she_says.jpg',
    releaseDate: new Date('2010-12-08')
  },
  {
    name: 'KOD',
    artist: 'JCole',
    coverImg: '/static/images/albums/gem.jpg',
    releaseDate: new Date('2012-08-03')
  }
];

const songs = [
  {
    name: 'Sunflower',
    artist: 'Post Malone',
    album: 'Spider Man',
    duration: 269,
    coverImg: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/4b/30/2c/4b302cb6-7a14-5464-4e97-0577e9d0be49/18UMGIM82277.rgb.jpg/600x600bb.jpg',
    url: '/static/music/qingtian.mp3',
    lyrics: '[00:00.00]晴天 - 周杰伦\n[00:04.01]词：周杰伦\n[00:08.02]曲：周杰伦...'
  },
  {
    name: 'Ghost Town',
    artist: 'Kanye West',
    album: '808',
    duration: 258,
    coverImg: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/4d/75/2d/4d752db1-022d-f65d-40a1-a2390f01427a/13UAEIM26465.rgb.jpg/600x600bb.jpg',
    url: '/static/music/GhostTown.mp3',
    lyrics: '[00:00.00]七里香 - 周杰伦\n[00:04.01]词：周杰伦\n[00:08.02]曲：周杰伦...'
  },
  {
    name: 'Pull Up(Explicit)',
    artist: 'Luh Kel',
    album: 'Pull Up',
    duration: 275,
    coverImg: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/13/31/56/13315607-32d2-f03a-3c0c-f715df4efda8/00193483985152_Cover.jpg/600x600bb.jpg',
    url: '/static/music/tashou.mp3',
    lyrics: '[00:00.00]她说 - 林俊杰\n[00:04.01]词：简迷离\n[00:08.02]曲：林俊杰...'
  },
  {
    name: 'Hold On',
    artist: 'Justin Bieber',
    album: 'Hold On',
    duration: 243,
    coverImg: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/f5/7a/9e/f57a9e6a-31c8-0784-dfbd-4a0120bfd4af/21UMGIM17517.rgb.jpg/600x600bb.jpg',
    url: '/static/music/paomo.mp3',
    lyrics: '[00:00.00]泡沫 - 邓紫棋\n[00:04.01]词：邓紫棋\n[00:08.02]曲：邓紫棋...'
  }
];

// 连接数据库并添加数据
const seedData = async () => {
  try {
    // 连接到数据库
    const connected = await connectToDatabase();
    if (!connected) {
      console.error('无法连接到数据库，退出');
      process.exit(1);
    }

    console.log('开始添加种子数据');

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
      if (!artist) {
        console.log(`未找到艺术家: ${album.artist}`);
        // 使用占位符ID或第一个艺术家的ID
        const defaultArtist = createdArtists[0];
        return {
          ...album,
          artistId: defaultArtist._id
        };
      }
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
      
      if (!artist) {
        console.log(`未找到艺术家: ${song.artist}`);
        // 使用占位符ID或第一个艺术家的ID
        const defaultArtist = createdArtists[0];
        return {
          ...song,
          artistId: defaultArtist._id,
          albumId: album ? album._id : null,
          status: 'active'
        };
      }
      
      return {
        ...song,
        artistId: artist._id,
        albumId: album ? album._id : null,
        status: 'active'
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

    // // 创建一个虚拟的创建者ID (因为Playlist模型需要creator字段)
    // const creatorId = new mongoose.Types.ObjectId();

    //歌单
    const playlists = [
      {
        name: '欧美流行',
        description: '最热门的流行歌曲集合',
        coverImg: 'https://is1-ssl.mzstatic.com/image/thumb/Music20/v4/72/36/2f/72362fb2-ccec-5686-cf98-24dc58395390/075679908933.jpg/600x600bb.jpg',
        songs: createdSongs.slice(0, 10).map(song => song._id),
        playCount: 5000,
        favoriteCount: 1200,
        isPrivate: false,
        creator: '好酷'  
      },
      {
        name: '学习 工作 家务',
        description: '周杰伦热门歌曲集合',
        coverImg: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.DYudcjwTZ-nv2GEdpSKEEAHaE7?w=303&h=202&c=7&r=0&o=5&dpr=1.3&pid=1.7',
        songs: createdSongs.filter(song => song.artist === '周杰伦').map(song => song._id),
        playCount: 3500,
        favoriteCount: 900,
        isPrivate: false,
         creator: '一个'
      },
      {
        name: '华语经典',
        description: '经典华语歌曲合集',
        coverImg: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.vGmEcAzRTdNtQJk_N5AtXwHaEN?w=311&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
        songs: createdSongs.map(song => song._id),
        playCount: 4200,
        favoriteCount: 1050,
        isPrivate: false,
        creator: '巅峰'
      },
      {
        name: '纯音乐',
        description: '纯音乐歌曲合集',
        coverImg: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.O1-Y2djqjqL7YkFbAXEODwHaEK?w=292&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
        songs: createdSongs.map(song => song._id),
        playCount: 4200,
        favoriteCount: 1050,
        isPrivate: false,
         creator: '不吃'
      }
    ];

    const createdPlaylists = await Playlist.insertMany(playlists);
    console.log(`已添加 ${createdPlaylists.length} 个歌单`);

    // 创建几个MV (音乐视频)
    const mvs = [
      {
        name: 'Ghost Town',
        artist: 'Kanye West',
        coverImg: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.fUniXsti-XkbaHTPTpiYzgHaE7?w=271&h=185&c=7&r=0&o=5&dpr=1.3&pid=1.7',
        videoUrl: 'https://www.youtube.com/watch?v=qAsHVwl-MU4',
        releaseDate: new Date('2018-06-01'),
        duration: 288,
        description: '《Ghost Town》是Kanye West的热门歌曲...',
        playCount: 150000,
        likeCount: 130000
      },
      {
        name: 'Sunflower',
        artist: 'Post Malone',
        coverImg: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.ecjvrrKX7KlS2V5NI4gaRAHaEK?w=321&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
        videoUrl: 'https://www.youtube.com/watch?v=ApXoWvfEYVU',
        releaseDate: new Date('2018-10-18'),
        duration: 158,
        description: '《Sunflower》是Post Malone为电影《蜘蛛侠：平行宇宙》创作的歌曲...',
        playCount: 140000,
        likeCount: 120000
      }
    ];
    
    // 为每个MV添加艺术家ID
    const mvsWithArtistIds = await Promise.all(mvs.map(async (mv) => {
      // 查找艺术家
      const artist = await Artist.findOne({ name: mv.artist });
      
      if (!artist) {
        console.log(`未找到MV对应的艺术家: ${mv.artist}，使用默认艺术家`);
        // 使用占位符ID或第一个艺术家的ID
        const defaultArtist = createdArtists[0];
        return {
          ...mv,
          artistId: defaultArtist._id,
          status: 'active'
        };
      }
      
      return {
        ...mv,
        artistId: artist._id,
        status: 'active'
      };
    }));

    const createdMVs = await MV.insertMany(mvsWithArtistIds);
    console.log(`已添加 ${createdMVs.length} 个MV`);

    // 更新艺术家的MV列表
    for (const artist of createdArtists) {
      try {
        const artistMVs = await MV.find({ artistId: artist._id });
        artist.mvs = artistMVs.map(mv => mv._id);
        await artist.save();
      } catch (err) {
        console.log(`更新艺术家 ${artist.name} 的MV列表失败:`, err.message);
      }
    }

    console.log('音乐数据添加完成!');
    process.exit(0);
  } catch (error) {
    console.error('添加音乐数据失败:', error);
    process.exit(1);
  }
}

seedData();