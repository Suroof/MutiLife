<template>
  <view class="playlist-detail-container">
    <!-- 顶部信息区域 -->
    <view
      class="header-area"
      :style="{ backgroundImage: `url(${playlist.cover})` }"
    >
      <view class="header-mask"></view>

      <!-- 返回按钮 -->
      <view class="back-button" @tap="goBack">
        <image
          src="/static/icons/返回.png"
          class="action-icon"
          mode="aspectFit"
        ></image>
      </view>

      <!-- 歌单信息 -->
      <view class="playlist-info">
        <image
          class="playlist-cover"
          :src="playlist.coverImg"
          mode="aspectFill"
        ></image>
        <view class="playlist-data">
          <text class="playlist-name">{{ playlist.name || "歌单详情" }}</text>
          <view class="creator-info">
            <image
              class="creator-avatar"
              :src="playlist.creatorImg"
              mode="aspectFill"
            ></image>
            <text class="creator-name">{{
              playlist.creator || "未知用户"
            }}</text>
          </view>
          <view class="playlist-stats">
            <text class="stat-item">{{ playlist.songCount || 0 }}首</text>
            <text class="stat-item"
              >播放{{ formatPlayCount(playlist.playCount || 0) }}</text
            >
          </view>
          <view
            class="playlist-tags"
            v-if="playlist.tags && playlist.tags.length"
          >
            <text
              class="tag-item"
              v-for="(tag, index) in playlist.tags"
              :key="index"
              >#{{ tag }}</text
            >
          </view>
        </view>
      </view>

      <!-- 操作按钮区 -->
      <view class="action-bar">
        <view class="action-item">
          <image
            src="/static/icons/点赞.png"
            class="action-icon"
            mode="aspectFit"
          ></image>
          <text class="action-text">收藏</text>
        </view>
        <view class="action-item">
          <image
            src="/static/icons/评论.png"
            class="action-icon"
            mode="aspectFit"
          ></image>
          <text class="action-text">评论</text>
        </view>
        <view class="action-item">
          <image
            src="/static/icons/歌单分享.png"
            class="action-icon"
            mode="aspectFit"
          ></image>
          <text class="action-text">分享</text>
        </view>
      </view>
    </view>

    <!-- 歌曲列表区域 -->
    <view class="song-list-container">
      <!-- 列表头部 -->
      <view class="list-header">
        <view class="play-all-button" @tap="playAll">
          <text class="iconfont play-icon">▶</text>
          <text class="play-all-text">播放全部</text>
          <text class="song-count"
            >({{ playlist.songs ? playlist.songs.length : 0 }})</text
          >
        </view>

        <view class="multi-select-button">
          <text class="select-text">多选</text>
        </view>
      </view>

      <!-- 歌曲列表 -->
      <view class="song-list">
        <view
          class="song-item"
          v-for="(song, index) in playlist.songs"
          :key="song._id"
          @tap="playSong(song)"
        >
          <text class="song-index">{{ index + 1 }}</text>
          <view class="song-content">
            <view class="song-main-info">
              <text class="song-name">{{ song.name }}</text>
              <view class="song-badges" v-if="song.badge">
                <text
                  class="song-badge"
                  v-for="(badge, i) in song.badge"
                  :key="i"
                  >{{ badge }}</text
                >
              </view>
            </view>
            <view class="song-sub-info">
              <text class="song-artist">{{ song.artist }}</text>
              <text class="song-album" v-if="song.album"
                >- {{ song.album }}</text
              >
            </view>
          </view>
          <view class="song-actions">
            <text class="iconfont action-icon">⋯</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="loading-container" v-if="loading">
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 错误提示 -->
    <view class="error-container" v-if="error">
      <text class="error-text">{{ error }}</text>
      <view class="retry-button" @tap="loadPlaylistDetail">重试</view>
    </view>
  </view>
</template>

<script lang="ts">
import request from "@/services/api/request";
import { isAuthenticated } from "@/services/api/request";
export default {
  data() {
    return {
      playlistId: "", // 歌单ID
      playlist: {}, // 歌单详情
      loading: true, // 加载状态
      error: "", // 错误信息
      defaultCover: "/static/images/default_cover.png", // 默认封面
    };
  },
  onLoad(options) {
    // 获取传递的歌单ID
    if (options && options.id) {
      this.playlistId = options.id;
      // 加载歌单详情
      this.loadPlaylistDetail();
    } else {
      this.error = "无效的歌单ID";
      this.loading = false;
    }

    // 设置页面标题
    uni.setNavigationBarTitle({
      title: "歌单详情",
    });
  },
  methods: {
    // 加载歌单详情
    async loadPlaylistDetail() {
      if (!this.playlistId) return;

      this.loading = true;
      this.error = "";

      try {
        const response = await request.get(
          `/music/playlists/${this.playlistId}`,
          {},
          true
        );
        console.log("歌单详情响应:", response);

        if (response) {
          this.playlist = response;

          // 更新页面标题
          uni.setNavigationBarTitle({
            title: this.playlist.name || "歌单详情",
          });
        } else {
          this.error = "获取歌单详情失败";
        }
      } catch (error) {
        console.error("加载歌单详情出错:", error);
        this.error = "加载歌单详情失败，请稍后再试";
      } finally {
        this.loading = false;
      }
    },

    // 返回上一页
    goBack() {
      uni.navigateBack();
    },

    // 播放全部歌曲
    playAll() {
      if (!this.playlist.songs || this.playlist.songs.length === 0) {
        uni.showToast({
          title: "歌单中没有歌曲",
          icon: "none",
        });
        return;
      }

      // 播放第一首歌曲
      this.playSong(this.playlist.songs[0]);

      // 可以在这里设置播放列表的全局状态
      // 例如：设置当前播放列表为这个歌单的所有歌曲
      uni.$emit("setPlayList", {
        playList: this.playlist.songs,
        currentIndex: 0,
      });
    },

    // 播放单首歌曲
    async playSong(song) {
      if (!song || !song._id) {
        uni.showToast({
          title: "无法播放此歌曲",
          icon: "none",
        });
        return;
      }

      // 发布播放事件，让全局的播放器响应
      uni.$emit("playSong", song);

      // 可以在这里设置播放列表的全局状态
      // 例如：设置当前播放列表为这个歌单的所有歌曲，并设置当前播放的歌曲索引
      const currentIndex = this.playlist.songs.findIndex(
        (item) => item._id === song._id
      );
      uni.$emit("setPlayList", {
        playList: this.playlist.songs,
        currentIndex: currentIndex >= 0 ? currentIndex : 0,
      });
    },

    // 格式化播放次数
    formatPlayCount(count) {
      if (count < 10000) {
        return count.toString();
      } else if (count < 100000000) {
        return (count / 10000).toFixed(1) + "万";
      } else {
        return (count / 100000000).toFixed(1) + "亿";
      }
    },
  },
};
</script>

<style>
.playlist-detail-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 顶部信息区域样式 */
.header-area {
  position: relative;
  width: 100%;
  height: 500rpx;
  background-size: cover;
  background-position: center;
  padding-top: var(--status-bar-height);
}

.header-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.5),
    rgba(0, 0, 0, 0.8)
  );
  z-index: 1;
}

.back-button {
  position: relative;
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.playlist-info {
  position: relative;
  display: flex;
  padding: 30rpx;
  z-index: 2;
}

.playlist-cover {
  width: 240rpx;
  height: 240rpx;
  border-radius: 12rpx;
  box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.2);
}

.playlist-data {
  flex: 1;
  margin-left: 30rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.playlist-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 20rpx;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.creator-info {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.creator-avatar {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  margin-right: 16rpx;
}

.creator-name {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
}

.playlist-stats {
  display: flex;
  margin-bottom: 16rpx;
}

.stat-item {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
  margin-right: 20rpx;
}

.playlist-tags {
  display: flex;
  flex-wrap: wrap;
}

.tag-item {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
  background-color: rgba(255, 255, 255, 0.2);
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  margin-right: 16rpx;
  margin-bottom: 10rpx;
}

.action-bar {
  position: relative;
  display: flex;
  justify-content: space-around;
  padding: 20rpx 30rpx;
  z-index: 2;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-icon {
  width: 40rpx;
  height: 40rpx;
  margin-bottom: 8rpx;
}

.action-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

/* 歌曲列表区域样式 */
.song-list-container {
  position: relative;
  margin-top: -50rpx;
  border-radius: 30rpx 30rpx 0 0;
  background-color: #ffffff;
  padding: 30rpx;
  z-index: 5;
  min-height: 600rpx;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #e5e5e5;
}

.play-all-button {
  display: flex;
  align-items: center;
}

.play-icon {
  font-size: 36rpx;
  color: #333;
  margin-right: 16rpx;
}

.play-all-text {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
}

.song-count {
  font-size: 24rpx;
  color: #999;
  margin-left: 8rpx;
}

.multi-select-button {
  padding: 6rpx 20rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 30rpx;
}

.select-text {
  font-size: 24rpx;
  color: #666;
}

.song-list {
  padding: 20rpx 0;
}

.song-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.song-index {
  width: 60rpx;
  font-size: 28rpx;
  color: #999;
  text-align: center;
}

.song-content {
  flex: 1;
  overflow: hidden;
  margin: 0 20rpx;
}

.song-main-info {
  display: flex;
  align-items: center;
  margin-bottom: 6rpx;
}

.song-name {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-badges {
  display: flex;
  margin-left: 16rpx;
}

.song-badge {
  font-size: 20rpx;
  color: #ff6699;
  background-color: rgba(255, 102, 153, 0.1);
  border: 1rpx solid rgba(255, 102, 153, 0.3);
  border-radius: 10rpx;
  padding: 0 10rpx;
  margin-right: 8rpx;
}

.song-sub-info {
  font-size: 24rpx;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  margin-right: 8rpx;
}

.song-actions {
  width: 80rpx;
  display: flex;
  justify-content: center;
}

/* 加载和错误提示样式 */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.loading-text,
.error-text {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 20rpx;
}

.retry-button {
  padding: 12rpx 40rpx;
  background-color: #ff6699;
  color: #ffffff;
  font-size: 28rpx;
  border-radius: 40rpx;
}
</style>
