<template>
  <view class="custom-tab-bar" v-if="!isHomePage">
    <!-- Travel Tab -->
    <view class="tab-item" :class="{ active: currentTab === 1 }" @tap="switchTab('/pages/travel/travel', 1)">
      <image class="tab-icon" :src="currentTab === 1 ? '/static/tabbar/旅游.png' : '/static/tabbar/旅游2.png'" mode="aspectFit"></image>
      <text class="tab-text">旅游</text>
    </view>

    <!-- Social Tab -->
    <view class="tab-item" :class="{ active: currentTab === 2 }" @tap="switchTab('/pages/social/social', 2)">
      <image class="tab-icon" :src="currentTab === 2 ? '/static/tabbar/social-active.png' : '/static/tabbar/social.png'" mode="aspectFit"></image>
      <text class="tab-text">交友</text>
    </view>

    <!-- Music Tab (Special Styling) -->
    <view class="tab-item music-tab" :class="{ active: currentTab === 3 }" @tap="switchTab('/pages/music/music', 3)">
      <view class="music-button">
        <image class="music-icon" src="/static/tabbar/music.png" mode="aspectFit"></image>
      </view>
      <text class="tab-text">听歌</text>
    </view>

    <!-- Planner Tab -->
    <view class="tab-item" :class="{ active: currentTab === 4 }" @tap="switchTab('/pages/planner/planner', 4)">
      <image class="tab-icon" :src="currentTab === 4 ? '/static/tabbar/planner-active.png' : '/static/tabbar/planner.png'" mode="aspectFit"></image>
      <text class="tab-text">规划</text>
    </view>

    <!-- News Tab -->
    <view class="tab-item" :class="{ active: currentTab === 5 }" @tap="switchTab('/pages/news/news', 5)">
      <image class="tab-icon" :src="currentTab === 5 ? '/static/tabbar/news-active.png' : '/static/tabbar/news.png'" mode="aspectFit"></image>
      <text class="tab-text">新闻</text>
    </view>

    <!-- Mine Tab -->
    <view class="tab-item" :class="{ active: currentTab === 6 }" @tap="switchTab('/pages/mine/mine', 6)">
      <image class="tab-icon" :src="currentTab === 6 ? '/static/tabbar/我的2.png' : '/static/tabbar/我的.png'" mode="aspectFit"></image>
      <text class="tab-text">我的</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CustomTabBar',
  data() {
    return {
      currentTab: 0,
      isHomePage: false
    };
  },
  created() {
    this.checkCurrentPage();
  },
  methods: {
    checkCurrentPage() {
      // 获取当前页面路由
      const pages = getCurrentPages();
      if (pages && pages.length > 0) {
        const currentPage = pages[pages.length - 1];
        const currentRoute = `/${currentPage.route}`;

        // 判断是否在首页
        this.isHomePage = currentRoute === '/pages/index/index';

        // Map routes to tab indexes
        const routeToIndex = {
          '/pages/travel/travel': 1,
          '/pages/social/social': 2,
          '/pages/music/music': 3,
          '/pages/planner/planner': 4,
          '/pages/news/news': 5,
          '/pages/mine/mine': 6
        };

        if (routeToIndex[currentRoute] !== undefined) {
          this.currentTab = routeToIndex[currentRoute];
        }
      }
    },
    switchTab(url, index) {
      if (this.currentTab === index) return;

      console.log('TabBar导航到:', url);
      this.currentTab = index;

      // 尝试使用switchTab（适用于tabBar页面）
      uni.switchTab({
        url: url,
        success: () => {
          // 导航成功后，延迟检查当前页面（确保页面已经切换）
          setTimeout(() => {
            this.checkCurrentPage();
          }, 100);
        },
        fail: (err) => {
          console.error('switchTab失败:', err);
          // 如果switchTab失败，尝试使用navigateTo
          uni.navigateTo({
            url: url,
            success: () => {
              setTimeout(() => {
                this.checkCurrentPage();
              }, 100);
            },
            fail: (navigateErr) => {
              console.error('navigateTo也失败了:', navigateErr);
              uni.showToast({
                title: '导航失败',
                icon: 'none'
              });
            }
          });
        }
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
  justify-content: space-around;
  box-shadow: 0 -5rpx 15rpx rgba(0, 0, 0, 0.05);
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
  transition: all 0.3s;
}

.tab-item:active {
  transform: scale(0.95);
}

.tab-icon {
  width: 50rpx;
  height: 50rpx;
  margin-bottom: 8rpx;
  transition: all 0.3s;
}

.active .tab-icon {
  transform: scale(1.1);
}

.music-button {
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF7043 0%, #FF5533 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8rpx 20rpx rgba(255, 85, 51, 0.35);
  margin-top: -25rpx;
  margin-bottom: 6rpx;
  border: 4rpx solid #FFFFFF;
  transition: all 0.3s;
}

.music-button:active {
  transform: scale(0.95);
  box-shadow: 0 5rpx 15rpx rgba(255, 85, 51, 0.25);
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
  transition: all 0.3s;
}

.active .tab-text {
  background: linear-gradient(to right, #FF5533, #FF7755);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
  transform: scale(1.05);
}

.music-tab .tab-text {
  margin-top: 4rpx;
}

.music-tab.active .tab-text {
  background: linear-gradient(to right, #FF5533, #FF7755);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 添加指示点 */
.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 15rpx;
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: linear-gradient(to right, #FF5533, #FF7755);
  opacity: 0.7;
  box-shadow: 0 0 10rpx rgba(255, 85, 51, 0.5);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.5;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.7;
  }
}
</style>