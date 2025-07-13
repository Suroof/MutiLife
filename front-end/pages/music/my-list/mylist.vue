<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="iconfont icon-back"></text>
      </view>
      <view class="title">我的歌单</view>
      <view class="menu-btn" @click="showMenu">
        <text class="iconfont icon-menu"></text>
      </view>
    </view>

    <!-- 用户信息区域 -->
    <view class="user-info">
      <image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
      <view class="user-details">
        <text class="username">{{ userInfo.nickname }}</text>
        <text class="user-stats">{{ playlistCount }}个歌单 · {{ followCount }}关注 · {{ fanCount }}粉丝</text>
      </view>
    </view>

    <!-- 分类标签 -->
    <view class="category-tabs">
      <view 
        class="tab-item" 
        :class="{ active: currentTab === index }"
        v-for="(tab, index) in tabs" 
        :key="index"
        @click="switchTab(index)"
      >
        <text>{{ tab.name }}</text>
        <text class="count">({{ tab.count }})</text>
      </view>
    </view>

    <!-- 歌单列表 -->
    <scroll-view class="playlist-container" scroll-y="true">
      <!-- 创建歌单按钮 -->
      <view class="create-playlist" @click="createPlaylist" v-if="currentTab === 0">
        <view class="create-icon">
          <text class="iconfont icon-add"></text>
        </view>
        <text class="create-text">创建歌单</text>
      </view>

      <!-- 歌单网格 -->
      <view class="playlist-grid">
        <view 
          class="playlist-item" 
          v-for="playlist in currentPlaylists" 
          :key="playlist.id"
          @click="goToPlaylist(playlist.id)"
        >
          <view class="playlist-cover-wrapper">
            <image class="playlist-cover" :src="playlist.coverImg" mode="aspectFill"></image>
            <view class="play-count">
              <text class="iconfont icon-play"></text>
              <text>{{ formatPlayCount(playlist.playCount) }}</text>
            </view>
          </view>
          <text class="playlist-name">{{ playlist.name }}</text>
          <text class="track-count">{{ playlist.trackCount }}首</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'MyList',
  data() {
    return {
      currentTab: 0,
      userInfo: {
        nickname: '音乐爱好者',
        avatar: '/static/images/default-avatar.png'
      },
      playlistCount: 12,
      followCount: 88,
      fanCount: 156,
      tabs: [
        { name: '创建的歌单', count: 8 },
        { name: '收藏的歌单', count: 24 }
      ],
      createdPlaylists: [
        {
          id: 1,
          name: '我喜欢的音乐',
          coverImg: '/static/images/playlist1.jpg',
          playCount: 12800,
          trackCount: 156
        },
        {
          id: 2,
          name: '深夜听歌',
          coverImg: '/static/images/playlist2.jpg',
          playCount: 5600,
          trackCount: 88
        }
      ],
      collectedPlaylists: [
        {
          id: 3,
          name: '华语流行精选',
          coverImg: '/static/images/playlist3.jpg',
          playCount: 89000,
          trackCount: 200
        }
      ]
    }
  },
  computed: {
    currentPlaylists() {
      return this.currentTab === 0 ? this.createdPlaylists : this.collectedPlaylists
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    showMenu() {
      // 显示菜单
    },
    switchTab(index) {
      this.currentTab = index
    },
    createPlaylist() {
      // 创建歌单逻辑
    },
    goToPlaylist(id) {
      uni.navigateTo({
        url: `/pages/music/playlist/playlist?id=${id}`
      })
    },
    formatPlayCount(count) {
      if (count >= 10000) {
        return Math.floor(count / 10000) + '万'
      }
      return count.toString()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f5f5 0%, #ffffff 40%);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  padding-top: calc(var(--status-bar-height) + 20rpx);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20rpx);
  
  .back-btn, .menu-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.05);
  }
  
  .title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
  }
}

.user-info {
  display: flex;
  align-items: center;
  padding: 40rpx 30rpx;
  
  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 60rpx;
    margin-right: 30rpx;
  }
  
  .user-details {
    display: flex;
    flex-direction: column;
    
    .username {
      font-size: 38rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 10rpx;
    }
    
    .user-stats {
      font-size: 26rpx;
      color: #999;
    }
  }
}

.category-tabs {
  display: flex;
  padding: 0 30rpx;
  margin-bottom: 30rpx;
  
  .tab-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20rpx 0;
    border-bottom: 4rpx solid transparent;
    
    &.active {
      border-bottom-color: #d32f2f;
      
      text {
        color: #d32f2f;
        font-weight: 600;
      }
    }
    
    text {
      color: #666;
      font-size: 28rpx;
    }
    
    .count {
      margin-left: 8rpx;
      font-size: 24rpx;
      color: #999;
    }
  }
}

.playlist-container {
  height: calc(100vh - 400rpx);
  padding: 0 30rpx;
}

.create-playlist {
  display: flex;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  margin-bottom: 30rpx;
  
  .create-icon {
    width: 80rpx;
    height: 80rpx;
    border: 2rpx dashed #d32f2f;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20rpx;
    
    text {
      color: #d32f2f;
      font-size: 32rpx;
    }
  }
  
  .create-text {
    color: #d32f2f;
    font-size: 30rpx;
    font-weight: 500;
  }
}

.playlist-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.playlist-item {
  width: 48%;
  margin-bottom: 40rpx;
  
  .playlist-cover-wrapper {
    position: relative;
    width: 100%;
    height: 320rpx;
    border-radius: 16rpx;
    overflow: hidden;
    
    .playlist-cover {
      width: 100%;
      height: 100%;
    }
    
    .play-count {
      position: absolute;
      top: 10rpx;
      right: 10rpx;
      display: flex;
      align-items: center;
      padding: 4rpx 8rpx;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 20rpx;
      
      text {
        color: white;
        font-size: 20rpx;
        
        &:first-child {
          margin-right: 4rpx;
        }
      }
    }
  }
  
  .playlist-name {
    display: block;
    font-size: 28rpx;
    color: #333;
    margin-top: 16rpx;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .track-count {
    display: block;
    font-size: 24rpx;
    color: #999;
    margin-top: 8rpx;
  }
}

.iconfont {
  font-family: 'iconfont';
}
</style>
