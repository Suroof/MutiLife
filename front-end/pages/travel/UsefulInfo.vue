<template>
  <view class="container">
    <view class="Info-card">
      <view class="title">Useful Information</view>
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
  data() {},
  onLoad(options) {
    this.destinationId = options.id;
    this.fetchDestinationDetail();
  },
  methods: {},
};
</script>

<style lang="less">
.container {
  padding: 40rpx;
  background-image: linear-gradient(to bottom, #f7c3ad, #f3bebe);
  min-height: 100vh;
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
</style>
