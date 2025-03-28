<template>
  <view class="custom-tab-bar">
    <!-- Home Tab -->
    <view class="tab-item" :class="{ active: currentTab === 0 }" @tap="switchTab('/pages/index/index', 0)">
      <image class="tab-icon" :src="currentTab === 0 ? '/static/tabbar/home-active.png' : '/static/tabbar/home.png'" mode="aspectFit"></image>
      <text class="tab-text">首页</text>
    </view>

    <!-- Social Tab -->
    <view class="tab-item" :class="{ active: currentTab === 1 }" @tap="switchTab('/pages/social/social', 1)">
      <image class="tab-icon" :src="currentTab === 1 ? '/static/tabbar/social-active.png' : '/static/tabbar/social.png'" mode="aspectFit"></image>
      <text class="tab-text">交友</text>
    </view>

    <!-- Music Tab (Special Styling) -->
    <view class="tab-item music-tab" :class="{ active: currentTab === 2 }" @tap="switchTab('/pages/music/music', 2)">
      <view class="music-button">
        <image class="music-icon" src="/static/tabbar/music.png" mode="aspectFit"></image>
      </view>
      <text class="tab-text">听歌</text>
    </view>

    <!-- Planner Tab -->
    <view class="tab-item" :class="{ active: currentTab === 3 }" @tap="switchTab('/pages/planner/planner', 3)">
      <image class="tab-icon" :src="currentTab === 3 ? '/static/tabbar/planner-active.png' : '/static/tabbar/planner.png'" mode="aspectFit"></image>
      <text class="tab-text">规划</text>
    </view>

    <!-- News Tab -->
    <view class="tab-item" :class="{ active: currentTab === 4 }" @tap="switchTab('/pages/news/news', 4)">
      <image class="tab-icon" :src="currentTab === 4 ? '/static/tabbar/news-active.png' : '/static/tabbar/news.png'" mode="aspectFit"></image>
      <text class="tab-text">新闻</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CustomTabBar',
  data() {
    return {
      currentTab: 0
    };
  },
  created() {
    // 获取当前页面路由
    const pages = getCurrentPages();
    if (pages && pages.length > 0) {
      const currentPage = pages[pages.length - 1];
      const currentRoute = `/${currentPage.route}`;

      // Map routes to tab indexes
      const routeToIndex = {
        '/pages/index/index': 0,
        '/pages/social/social': 1,
        '/pages/music/music': 2,
        '/pages/planner/planner': 3,
        '/pages/news/news': 4
      };

      if (routeToIndex[currentRoute] !== undefined) {
        this.currentTab = routeToIndex[currentRoute];
      }
    }
  },
  methods: {
    switchTab(url, index) {
      if (this.currentTab === index) return;
      this.currentTab = index;
      uni.switchTab({
        url: url
      });
    }
  }
}
</script>

<style>
.custom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-shadow: 0 -5rpx 15rpx rgba(0, 0, 0, 0.04);
  z-index: 999;
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1rpx solid rgba(0, 0, 0, 0.03);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
  padding: 5rpx 0;
}

.tab-icon {
  width: 50rpx;
  height: 50rpx;
  margin-bottom: 6rpx;
}

.music-button {
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF7043 0%, #FF5533 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 6rpx 20rpx rgba(255, 85, 51, 0.35);
  margin-top: -25rpx;
  margin-bottom: 6rpx;
  border: 4rpx solid #FFFFFF;
}

.music-icon {
  width: 45rpx;
  height: 45rpx;
  /* Force white icon */
  filter: brightness(20) contrast(1);
}

.tab-text {
  font-size: 24rpx;
  color: #999;
  font-weight: 400;
}

.active .tab-text {
  color: #FF5533;
  font-weight: 500;
}

.music-tab .tab-text {
  margin-top: 4rpx;
}

.music-tab.active .tab-text {
  color: #FF5533;
}
</style>