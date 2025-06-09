<template>
  <view class="container">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="nav-bar">
        <view class="nav-left" @click="goBack">
          <text class="back-icon">‹</text>
        </view>
        <view class="nav-title">我的收藏</view>
        <view class="nav-right"></view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 空状态 -->
    <view v-else-if="favorites.length === 0" class="empty-container">
      <image class="empty-image" src="../../static/empty-tasks.png" mode="aspectFit"></image>
      <text class="empty-text">暂无收藏</text>
      <view class="empty-button" @click="goToTravel">
        <text class="button-text">去发现旅游目的地</text>
      </view>
    </view>

    <!-- 收藏列表 -->
    <scroll-view
      v-else
      class="scroll-container"
      scroll-y
      @scrolltolower="onLoadMore"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
    >
      <view class="favorites-list">
        <view
          v-for="item in favorites"
          :key="item._id"
          class="favorite-item"
          @click="viewDetail(item._id)"
        >
          <view class="item-card">
            <image class="item-image" :src="item.image" mode="aspectFill"></image>
            <view class="item-content">
              <view class="item-header">
                <text class="item-title">{{ item.title }}</text>
                <view class="item-rating">
                  <text class="rating-text">{{ item.rating || '暂无评分' }}</text>
                </view>
              </view>
              <text class="item-desc">点击查看详情</text>
              <view class="item-tags">
                <view class="tag tag-type">
                  <text class="tag-text">{{ item.type || "旅游景点" }}</text>
                </view>
                <view class="tag tag-time">
                  <text class="tag-text">收藏时间：{{ formatTime(item.bookmarkedAt) }}</text>
                </view>
              </view>
              <view class="item-actions">
                <view class="action-button remove-btn" @click.stop="removeFromFavorites(item._id)">
                  <text class="action-text">取消收藏</text>
                </view>
                <view class="action-button share-btn" @click.stop="shareItem(item)">
                  <text class="action-text">分享</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 加载更多 -->
      <view v-if="loadingList" class="loading-more">
        <text class="loading-more-text">加载中...</text>
      </view>
      
      <!-- 没有更多 -->
      <view v-if="finished && favorites.length > 0" class="no-more">
        <text class="no-more-text">没有更多了</text>
      </view>
    </scroll-view>

    <!-- 底部统计 -->
    <view class="footer-stats">
      <view class="stats-badge">
        <text class="stats-count">{{ favorites.length > 99 ? '99+' : favorites.length }}</text>
      </view>
      <text class="stats-text">当前收藏总数</text>
    </view>
  </view>
</template>

<script>
import request, { isAuthenticated } from "@/services/api/request.js";

export default {
  data() {
    return {
      loading: true,
      favorites: [],
      error: null,
      refreshing: false,
      loadingList: false,
      finished: false,
      page: 1,
      pageSize: 10
    };
  },

  onLoad() {
    this.checkAuthAndLoadFavorites();
  },

  onShow() {
    // 页面显示时只有在数据为空时才重新加载
    if (this.favorites.length === 0) {
      this.checkAuthAndLoadFavorites();
    }
  },

  methods: {
    // 检查认证状态并加载收藏
    checkAuthAndLoadFavorites() {
      if (!isAuthenticated()) {
        uni.showModal({
          title: "提示",
          content: "请先登录后查看收藏",
          confirmText: "去登录",
          cancelText: "取消",
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({
                url: "/pages/login/login",
              });
            } else {
              uni.navigateBack();
            }
          },
        });
        return;
      }
      this.loadFavorites();
    },

    // 加载收藏列表
    async loadFavorites(reset = true) {
      if (reset) {
        this.page = 1;
        this.favorites = [];
        this.finished = false;
      }
      
      this.loadingList = true;
      try {
        const response = await request.get("/travel/favorites", {
          params: {
            page: this.page,
            pageSize: this.pageSize
          }
        });
        
        if (response.success) {
          const newFavorites = response.data || [];
          
          // 数据去重：基于 _id 字段去重
          const existingIds = new Set(this.favorites.map(item => item._id));
          const uniqueNewFavorites = newFavorites.filter(item => !existingIds.has(item._id));
          
          this.favorites = [...this.favorites, ...uniqueNewFavorites];
          
          // 如果没有更多数据
          if (newFavorites.length < this.pageSize) {
            this.finished = true;
          }
          
          this.page++;
        } else {
          this.error = response.message || "加载收藏失败";
          uni.showToast({
            title: this.error,
            icon: "none",
          });
        }
      } catch (error) {
        console.error("加载收藏失败:", error);
        this.error = "网络错误，请稍后重试";
        uni.showToast({
          title: this.error,
          icon: "none",
        });
      } finally {
        this.loading = false;
        this.loadingList = false;
        this.refreshing = false;
      }
    },

    // 下拉刷新
    onRefresh() {
      this.loadFavorites(true);
    },

    // 上拉加载更多
    onLoadMore() {
      if (!this.finished && !this.loadingList) {
        this.loadFavorites(false);
      }
    },

    // 返回上一页
    goBack() {
      uni.navigateBack();
    },

    // 去旅游页面
    goToTravel() {
      uni.switchTab({
        url: "/pages/travel/travel",
      });
    },

    // 查看详情
    viewDetail(id) {
      uni.navigateTo({
        url: `/pages/travel/FeatureDetail?id=${id}`,
      });
    },

    // 从收藏中移除
    async removeFromFavorites(id) {
      uni.showModal({
        title: "确认",
        content: "确定要取消收藏吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              const response = await request.patch(
                `/travel/featured-experiences/${id}/bookmark`
              );
              if (response.success) {
                // 从本地列表中移除
                this.favorites = this.favorites.filter(
                  (item) => item._id !== id
                );
                uni.showToast({
                  title: "已取消收藏",
                  icon: "success",
                });
                // 触发震动反馈
                uni.vibrateShort();
              } else {
                uni.showToast({
                  title: "操作失败",
                  icon: "none",
                });
              }
            } catch (error) {
              console.error("取消收藏失败:", error);
              uni.showToast({
                title: "网络错误",
                icon: "none",
              });
            }
          }
        },
      });
    },

    // 分享项目
    shareItem(item) {
      uni.showActionSheet({
        itemList: ["复制链接", "分享到微信", "分享到朋友圈"],
        success: (res) => {
          switch (res.tapIndex) {
            case 0:
              // 复制链接
              uni.setClipboardData({
                data: `${item.title} - 来自MutiLife旅游推荐`,
                success: () => {
                  uni.showToast({
                    title: "链接已复制",
                    icon: "success",
                  });
                },
              });
              break;
            case 1:
            case 2:
              uni.showToast({
                title: "分享功能开发中",
                icon: "none",
              });
              break;
          }
        },
      });
    },

    // 格式化时间
    formatTime(timeString) {
      if (!timeString) return "未知时间";
      const date = new Date(timeString);
      const now = new Date();
      const diff = now - date;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (days === 0) {
        return "今天";
      } else if (days === 1) {
        return "昨天";
      } else if (days < 7) {
        return `${days}天前`;
      } else {
        return `${date.getMonth() + 1}月${date.getDate()}日`;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  background-color: #f5f7fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 顶部导航 */
.header {
  background-color: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 30rpx;
  padding-top: var(--status-bar-height);
}

.nav-left {
  width: 80rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 40rpx;
  color: #333;
  font-weight: bold;
}

.nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.nav-right {
  width: 80rpx;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 200rpx 0;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #f3f3f3;
  border-top: 4rpx solid #007aff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20rpx;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 28rpx;
  color: #666;
}

/* 空状态 */
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 60rpx;
}

.empty-image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 40rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #999;
  margin-bottom: 60rpx;
}

.empty-button {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 24rpx 48rpx;
  border-radius: 50rpx;
  box-shadow: 0 8rpx 20rpx rgba(255, 107, 107, 0.3);
}

.button-text {
  font-size: 28rpx;
  color: white;
}

/* 滚动容器 */
.scroll-container {
  flex: 1;
  padding: 20rpx;
}

.favorites-list {
  padding-bottom: 20rpx;
}

/* 收藏项 */
.favorite-item {
  margin-bottom: 30rpx;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.item-card {
  display: flex;
  padding: 30rpx;
}

.item-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
  margin-right: 30rpx;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16rpx;
}

.item-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  flex: 1;
  margin-right: 20rpx;
}

.item-rating {
  background-color: #f8f9fa;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
}

.rating-text {
  font-size: 24rpx;
  color: #666;
}

.item-desc {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 20rpx;
}

.item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 30rpx;
}

.tag {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  border: 2rpx solid;
}

.tag-type {
  border-color: #ff6b6b;
  background-color: rgba(255, 107, 107, 0.1);
}

.tag-time {
  border-color: #007aff;
  background-color: rgba(0, 122, 255, 0.1);
}

.tag-text {
  font-size: 22rpx;
  color: inherit;
}

.tag-type .tag-text {
  color: #ff6b6b;
}

.tag-time .tag-text {
  color: #007aff;
}

.item-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
}

.action-button {
  padding: 16rpx 32rpx;
  border-radius: 30rpx;
  border: 2rpx solid;
}

.remove-btn {
  border-color: #ff6b6b;
  background-color: rgba(255, 107, 107, 0.1);
}

.share-btn {
  border-color: #007aff;
  background-color: rgba(0, 122, 255, 0.1);
}

.action-text {
  font-size: 24rpx;
}

.remove-btn .action-text {
  color: #ff6b6b;
}

.share-btn .action-text {
  color: #007aff;
}

/* 加载更多 */
.loading-more {
  display: flex;
  justify-content: center;
  padding: 40rpx 0;
}

.loading-more-text {
  font-size: 28rpx;
  color: #999;
}

.no-more {
  display: flex;
  justify-content: center;
  padding: 40rpx 0;
}

.no-more-text {
  font-size: 28rpx;
  color: #ccc;
}

/* 底部统计 */
.footer-stats {
  background-color: #fff;
  padding: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 2rpx solid #f0f0f0;
  position: relative;
}

.stats-badge {
  position: absolute;
  right: 30rpx;
  top: 20rpx;
  background-color: #ff6b6b;
  color: white;
  border-radius: 20rpx;
  min-width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12rpx;
}

.stats-count {
  font-size: 22rpx;
  color: white;
}

.stats-text {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}
</style>