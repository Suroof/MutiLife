<template>
  <view class="container">
    <!-- 返回按钮 -->
    <view class="back-button" @tap="goBack">← 返回</view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <view class="loading-spinner"></view>
    </view>

    <!-- 错误提示 -->
    <view v-else-if="error" class="error-message">
      {{ error }}
    </view>

    <!-- 详情内容 -->
    <view v-else class="detail-card">
      <!-- 封面图 -->
      <image
        :src="destination.mainImage || destination.image"
        mode="aspectFill"
        class="detail-image"
      />

      <!-- 收藏按钮 -->
      <view
        class="bookmark-badge"
        @tap.stop="toggleBookmark"
        :class="{ bookmarked: destination.isBookmarked }"
      >
        <text class="icon-heart">&#x2764;</text>
      </view>

      <!-- 内容区域 -->
      <view class="card-content">
        <!-- 标题 -->
        <text class="title">{{ destination.name || destination.title }}</text>

        <!-- 国家/地区 -->
        <text v-if="destination.country" class="location">
          📍 {{ destination.country }}
        </text>

        <!-- 描述 -->
        <text v-if="destination.description" class="description">
          {{ destination.description }}
        </text>

        <!-- 评分 -->
        <view class="rating-section">
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
            >
              ★
            </text>
          </view>
          <text v-if="destination.reviewCount" class="rating-count">
            {{ destination.rating }} ({{ destination.reviewCount }}条评论)
          </text>
        </view>

        <!-- 其他信息 -->
        <view v-if="destination.activities" class="info-section">
          <view class="info-item">
            <text class="label">推荐活动:</text>
            <text class="value">{{ destination.activities.join("、") }}</text>
          </view>

          <view v-if="destination.bestSeason" class="info-item">
            <text class="label">最佳季节:</text>
            <text class="value">{{ destination.bestSeason }}</text>
          </view>
        </view>
      </view>

      <!-- 底部操作按钮 -->
      <view class="action-buttons">
        <view class="action-button primary"> 立即体验 </view>
        <view class="action-button secondary"> 分享给朋友 </view>
      </view>
    </view>
  </view>
</template>
<script>
import request from "@/services/api/request.js";

export default {
  data() {
    return {
      loading: true,
      error: null,
      destinationId: null,
      destination: {},
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
        // 先尝试从destinations获取
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

    // 切换收藏状态
    async toggleBookmark() {
      try {
        const response = await request.patch(
          `/travel/destinations/${this.destinationId}/bookmark`
        );
        if (response.success) {
          this.destination.isBookmarked = !this.destination.isBookmarked;
          uni.showToast({
            title: this.destination.isBookmarked ? "已收藏" : "已取消收藏",
            icon: "success",
          });
        }
      } catch (err) {
        uni.showToast({
          title: "操作失败",
          icon: "none",
        });
      }
    },
  },
};
</script>

<style lang="less">
.container {
  padding: 40rpx;
  background-color: #f3f5f7;
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
}

.detail-image {
  width: 100%;
  height: 450rpx;
  position: relative;
  z-index: 1;
}

.card-content {
  padding: 40rpx 30rpx 20rpx;
}

.bookmark-badge {
  position: absolute;
  top: 30rpx;
  right: 30rpx;
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36rpx;
  z-index: 2;
  transition: all 0.3s ease;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);

  &.bookmarked {
    background: #ff5533;
    color: white;
  }
}

.icon-heart {
  transition: transform 0.3s ease;

  &.bookmarked {
    transform: scale(1.2);
  }
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
  line-height: 1.3;
}

.location {
  font-size: 28rpx;
  color: #888;
  margin-bottom: 30rpx;
  display: block;
}

.description {
  font-size: 28rpx;
  color: #555;
  line-height: 1.6;
  margin-bottom: 40rpx;
}

.rating-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 30rpx;
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

.info-section {
  margin-top: 20rpx;
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
  padding: 20rpx 40rpx 40rpx;
  display: flex;
  gap: 30rpx;
}

.action-button {
  flex: 1;
  text-align: center;
  padding: 24rpx 0;
  border-radius: 40rpx;
  font-size: 30rpx;
  font-weight: bold;
  transition: all 0.3s ease;

  &.primary {
    background-color: #ff5533;
    color: white;
    box-shadow: 0 6rpx 16rpx rgba(255, 85, 51, 0.4);
  }

  &.secondary {
    background-color: rgba(255, 85, 51, 0.1);
    color: #ff5533;
    border: 2rpx solid #ff5533;
  }

  &:active {
    opacity: 0.8;
  }
}

/* 加载动画 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #f0f0f0;
  border-top-color: #ff5533;
  border-radius: 50%;
  animation: spinner 0.8s linear infinite;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
</style>
