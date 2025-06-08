<template>
    <view class="container">
      <!-- 返回按钮 -->
      <view class="back-button" @tap="goBack">
        ← 返回
      </view>
  
      <!-- 加载状态 -->
      <view v-if="loading" class="loading-container">
        <view class="loading-spinner"></view>
      </view>
  
      <!-- 错误提示 -->
      <view v-else-if="error" class="error-message">
        {{ error }}
      </view>
  
      <!-- 详情内容 -->
      <view v-else class="detail-content">
        <!-- 封面图 -->
        <image :src="destination.mainImage" mode="aspectFill" class="detail-image" />
  
        <!-- 标题 -->
        <text class="title">{{ destination.name }}</text>
  
        <!-- 国家/地区 -->
        <text class="location">📍 {{ destination.country }}</text>
  
        <!-- 描述 -->
        <text class="description">{{ destination.description }}</text>
  
        <!-- 评分 -->
        <view class="rating-section">
          <text class="rating-stars">★★★★★</text>
          <text class="rating-count"> {{ destination.rating }} ({{ destination.reviewCount }}条评论)</text>
        </view>
  
        <!-- 其他信息 -->
        <view class="info-section">
          <text>推荐活动: {{ destination.activities.join('、') }}</text>
          <text>最佳季节: {{ destination.bestSeason }}</text>
        </view>
  
        <!-- 收藏按钮 -->
        <view class="bookmark-button" @tap="toggleBookmark">
          {{ destination.isBookmarked ? '取消收藏' : '添加收藏' }}
        </view>
      </view>
    </view>
  </template>
  
  <script>
  import request from '@/services/api/request.js';
  
  export default {
    data() {
      return {
        loading: true,
        error: null,
        destinationId: null,
        destination: {}
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
          const response = await request.get(`/travel/destinations/${this.destinationId}`);
          if (response.success) {
            this.destination = response.data;
          } else {
            this.error = '无法加载目的地详情';
          }
        } catch (err) {
          console.error('获取详情失败:', err);
          this.error = '网络错误，请稍后再试';
        } finally {
          this.loading = false;
        }
      },
  
      // 切换收藏状态
      async toggleBookmark() {
        try {
          const response = await request.patch(`/travel/destinations/${this.destinationId}/bookmark`);
          if (response.success) {
            this.destination.isBookmarked = !this.destination.isBookmarked;
            uni.showToast({
              title: this.destination.isBookmarked ? '已收藏' : '已取消收藏',
              icon: 'success'
            });
          }
        } catch (err) {
          uni.showToast({
            title: '操作失败',
            icon: 'none'
          });
        }
      }
    }
  };
  </script>
  
  <style>
  .container {
    padding: 40rpx;
    background-color: #f9f9f9;
    min-height: 100vh;
  }
  
  .back-button {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 30rpx;
  }
  
  .detail-image {
    width: 100%;
    height: 400rpx;
    border-radius: 20rpx;
    margin-bottom: 40rpx;
  }
  
  .title {
    font-size: 48rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
    display: block;
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
    margin-bottom: 30rpx;
  }
  
  .rating-stars {
    color: #ff5533;
    font-size: 32rpx;
    margin-right: 10rpx;
  }
  
  .rating-count {
    font-size: 26rpx;
    color: #999;
  }
  
  .info-section text {
    display: block;
    margin-bottom: 20rpx;
    font-size: 28rpx;
    color: #666;
  }
  
  .bookmark-button {
    margin-top: 50rpx;
    padding: 20rpx;
    background-color: #ff5533;
    color: white;
    text-align: center;
    font-size: 30rpx;
    border-radius: 40rpx;
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