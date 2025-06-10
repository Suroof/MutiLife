<template>
  <view
    class="container"
    :style="{ backgroundImage: 'url(' + destination.image + ')' }"
  >
    <!-- 返回按钮 -->
    <view class="back-button" @tap="goBack">← 返回</view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <view class="loading-spinner"></view>
    </view>

    <!-- 错误提示 -->
    <view v-else-if="error" class="error-message">{{ error }}</view>

    <!-- 详情内容 -->
    <view v-else class="detail-card">
      <!-- 封面图 -->
      <image :src="destination.image" mode="aspectFill" class="detail-image" />

      <!-- 标题 -->
      <text class="title">{{ destination.title }}</text>

      <!-- 评分区域 -->
      <view class="rating-section">
        <text class="rating-label">评分:</text>
        <view class="star-rating">
          <text
            v-for="(star, index) in 5"
            :key="index"
            class="star"
            :class="{
              full: index < Math.floor(destination.rating),
              half:
                index === Math.floor(destination.rating) &&
                destination.rating % 1 > 0,
              empty: index > Math.floor(destination.rating),
            }"
            >★</text
          >
        </view>
        <text class="rating-count"
          >{{ destination.rating }} ({{ destination.reviewCount }}条评论)</text
        >
      </view>

      <!-- 创建时间 -->
      <view class="info-item">
        <text class="label">发布时间:</text>
        <text class="value">{{ formatTime(destination.createdAt) }}</text>
      </view>

      <!-- 更新时间 -->
      <view class="info-item">
        <text class="label">最后更新:</text>
        <text class="value">{{ formatTime(destination.updatedAt) }}</text>
      </view>

      <!-- 版本号 -->
      <view class="info-item">
        <text class="label">版本:</text>
        <text class="value">v{{ destination.__v }}</text>
      </view>

      <!-- 按钮操作区 -->
      <view class="action-buttons">
        <view
          class="action-button primary"
          :class="{
            bookmarked: destination.isBookmarked,
            loading: bookmarkLoading,
          }"
          @tap="toggleBookmark"
        >
          <text v-if="!bookmarkLoading">
            {{ destination.isBookmarked ? "取消收藏" : "添加收藏" }}
          </text>
          <text v-else>处理中...</text>
        </view>
        <view class="action-button secondary" @tap="shareExperience">
          分享给朋友
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import request, {
  isAuthenticated,
  clearToken,
} from "@/services/api/request.js";
export default {
  data() {
    return {
      loading: true,
      error: null,
      destinationId: null,
      destination: {},
      bookmarkLoading: false, // 收藏操作加载状态
    };
  },
  onLoad(options) {
    // 获取路由参数
    this.destinationId = options.id;
    this.fetchDestinationDetail();
  },
  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },

    // 获取详情数据
    async fetchDestinationDetail() {
      this.loading = true;
      try {
        let response;
        try {
          response = await request.get(
            `/travel/featured-experiences/${this.destinationId}`
          );
        } catch (destError) {
          console.error("无法从destinations获取详情:", destError);
        }

        if (response.success) {
          this.destination = response.data;
        } else {
          this.error = "无法加载详情";
        }
      } catch (err) {
        console.error("获取详情失败:", err);
        this.error = "网络错误，请稍后再试";
      } finally {
        this.loading = false;
      }
    },

    // 时间格式化方法
    formatTime(timeString) {
      const date = new Date(timeString);
      return `${date.getFullYear()}年${
        date.getMonth() + 1
      }月${date.getDate()}日`;
    },

    // 检查用户认证状态
    isAuthenticated,

    // 清除认证token
    clearToken,

    // 切换收藏状态
    async toggleBookmark() {
      // 防止重复点击
      if (this.bookmarkLoading) {
        return;
      }

      // 检查用户是否已登录
      if (!isAuthenticated()) {
        uni.showModal({
          title: "提示",
          content: "请先登录后再收藏",
          confirmText: "去登录",
          cancelText: "取消",
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({
                url: "/pages/login/login",
              });
            }
          },
        });
        return;
      }

      this.bookmarkLoading = true;
      const originalBookmarkState = this.destination.isBookmarked;

      // 乐观更新UI
      this.destination.isBookmarked = !this.destination.isBookmarked;

      try {
        const response = await request.patch(
          `/travel/featured-experiences/${this.destinationId}/bookmark`,
          {},
          true
        );

        if (response.success) {
          // 更新本地数据
          this.destination = { ...this.destination, ...response.data };

          // 更新本地收藏缓存
          this.updateLocalBookmarkCache();

          // 显示成功提示
          uni.showToast({
            title: this.destination.isBookmarked ? "已添加收藏" : "已取消收藏",
            icon: "success",
            duration: 1500,
          });

          // 震动反馈
          uni.vibrateShort();
        } else {
          // 恢复原状态
          this.destination.isBookmarked = originalBookmarkState;
          uni.showToast({
            title: response.message || "操作失败",
            icon: "none",
          });
        }
      } catch (error) {
        console.error("收藏操作失败:", error);

        // 恢复原状态
        this.destination.isBookmarked = originalBookmarkState;

        // 根据错误类型显示不同提示
        let errorMessage = "网络异常，请检查网络连接";
        if (error.statusCode === 401) {
          errorMessage = "登录已过期，请重新登录";
          // 清除过期token并跳转登录
          clearToken();
          setTimeout(() => {
            uni.navigateTo({
              url: "/pages/login/login",
            });
          }, 1500);
        } else if (error.statusCode === 404) {
          errorMessage = "目的地不存在";
        } else if (error.statusCode >= 500) {
          errorMessage = "服务器异常，请稍后重试";
        }

        uni.showToast({
          title: errorMessage,
          icon: "none",
          duration: 2000,
        });
      } finally {
        this.bookmarkLoading = false;
      }
    },

    // 更新本地收藏缓存
    updateLocalBookmarkCache() {
      try {
        const bookmarkedDestinations =
          uni.getStorageSync("bookmarkedDestinations") || [];

        if (this.destination.isBookmarked) {
          // 添加到收藏
          const existingIndex = bookmarkedDestinations.findIndex(
            (item) => item._id === this.destination._id
          );
          if (existingIndex === -1) {
            bookmarkedDestinations.unshift({
              _id: this.destination._id,
              title: this.destination.title,
              image: this.destination.image,
              rating: this.destination.rating,
              bookmarkedAt: new Date().toISOString(),
            });

            // 限制缓存大小，最多保存100个
            if (bookmarkedDestinations.length > 100) {
              bookmarkedDestinations.splice(100);
            }
          }
        } else {
          // 从收藏中移除
          const filteredDestinations = bookmarkedDestinations.filter(
            (item) => item._id !== this.destination._id
          );
          uni.setStorageSync("bookmarkedDestinations", filteredDestinations);
          return;
        }

        uni.setStorageSync("bookmarkedDestinations", bookmarkedDestinations);
      } catch (error) {
        console.error("更新本地收藏缓存失败:", error);
      }
    },

    // 模拟分享体验
    shareExperience() {
      uni.showToast({
        title: "已复制链接到剪贴板",
        icon: "none",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  position:relative;
  padding: 40rpx;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
}


.back-button {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 30rpx;
  display: inline-block;
  padding: 10rpx 20rpx;
  border-radius: 40rpx;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.detail-card {
  position: relative;
  background-color: white;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
  margin-bottom: 40rpx;
  padding: 30rpx;
}

.detail-image {
  width: 100%;
  height: 450rpx;
  border-radius: 20rpx;
  margin-bottom: 30rpx;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.rating-section {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.rating-label {
  font-size: 28rpx;
  color: #666;
  margin-right: 20rpx;
}

.star-rating {
  display: flex;
  margin-right: 20rpx;

  .star {
    font-size: 32rpx;
    margin-right: 6rpx;

    &.full {
      color: #ff9933;
    }
    &.half {
      color: #ffd700;
      opacity: 0.6;
    }
    &.empty {
      color: #ccc;
    }
  }
}

.rating-count {
  font-size: 26rpx;
  color: #999;
}

.info-item {
  display: flex;
  margin-bottom: 25rpx;
}

.label {
  font-weight: bold;
  color: #666;
  width: 140rpx;
  flex-shrink: 0;
}

.value {
  color: #333;
  flex: 1;
}

.action-buttons {
  display: flex;
  gap: 30rpx;
  margin-top: 40rpx;
}

.action-button {
  flex: 1;
  text-align: center;
  padding: 24rpx 0;
  border-radius: 40rpx;
  font-size: 30rpx;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: none;
  outline: none;

  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 8rpx 30rpx rgba(102, 126, 234, 0.4);
  }

  &.primary:hover:not(.loading) {
    transform: translateY(-4rpx);
    box-shadow: 0 12rpx 40rpx rgba(102, 126, 234, 0.5);
  }

  &.primary.bookmarked {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    box-shadow: 0 8rpx 30rpx rgba(255, 107, 107, 0.4);
    animation: bookmarkSuccess 0.6s ease;
  }

  &.primary.bookmarked:hover:not(.loading) {
    box-shadow: 0 12rpx 40rpx rgba(255, 107, 107, 0.5);
  }

  &.primary.loading {
    background: #cccccc;
    box-shadow: none;
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.7;
  }

  &.secondary {
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    border: 2rpx solid #e0e0e0;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  }

  &.secondary:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-4rpx);
    box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.15);
  }

  &:active {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
}

@keyframes bookmarkSuccess {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>
