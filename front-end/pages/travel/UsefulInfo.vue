<template>
  <view class="container">
    <view class="back-button" @tap="goBack">← 返回</view>
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <view class="loading-spinner"></view>
    </view>

    <view v-else-if="error" class="error-message">
      {{ error }}
    </view>

    <view v-else class="Info-card">
      <!-- 标题 -->
      <text class="title">{{ infocards.title }}</text>
      <!-- 图片 -->
      <image :src="infocards.image" mode="aspectFill" class="detail-image" />
      <!-- 信息区域 -->
      <view class="info-section">
        <text class="info-item">
          <text>{{ infocards.info }}</text>
        </text>
      </view>

      <!-- 按钮操作区 -->
      <view class="info-buttons">
        <view class="info-button secondary" @tap="shareExperience">
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
      infocardsId: null,
      infocards: {},
    };
  },
  onLoad(options) {
    this.infocardsId = options.id;
    this.fetchUsefulInfoDetail();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },

    isAuthenticated,
    clearToken,

    async fetchUsefulInfoDetail() {
      this.loading = true;
      try {
        let response = await request.get(
          `/travel/infocards/${this.infocardsId}`
        );
        if (response.success) {
          this.infocards = response.data;
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

    async toggleBookmark() {
      // 防止重复点击
      if (this.bookmarkLoading) {
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
  padding: 40rpx;
  background-image: linear-gradient(to bottom, #f7c3ad, #f3bebe);
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

.info-section {
  margin: 20rpx 0;
  padding: 20rpx;
  background-color: #f9f9f9;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

  .info-item {
    display: flex;
    align-items: center;
    margin-bottom: 10rpx;
    padding: 10rpx 0;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }

    .info-label {
      font-size: 28rpx;
      color: #666;
      width: 200rpx;
      font-weight: bold;
    }

    .info-value {
      font-size: 28rpx;
      color: #333;
      flex: 1;
    }
  }
}

.detail-image {
  width: 100%;
  height: 300rpx;
  border-radius: 10rpx;
  margin: 20rpx 0;
}

.Info-card {
  position: relative;
  background-color: white;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
  margin-bottom: 40rpx;
  padding: 30rpx;
}

.title {
  font-size: 36rpx;
}

.info-buttons {
  display: flex;
  gap: 30rpx;
  margin-top: 40rpx;
}

.info-button {
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
</style>
