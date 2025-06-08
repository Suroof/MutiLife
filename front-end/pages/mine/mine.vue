<template>
  <view class="mine-container">
    <!-- 顶部渐变背景 -->
    <view class="header-background"></view>

    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="avatar-wrapper">
        <view class="avatar-container">
          <image class="avatar" :src="userInfo.avatar || '/static/avatar-default.png'" mode="aspectFill"></image>
        </view>
        <view class="avatar-badge">
          <text class="badge-text">Lv.3</text>
        </view>
      </view>
      <view class="user-info">
        <text class="username">{{ userInfo.username || '未登录' }}</text>
        <text class="user-id">ID: {{ userInfo.id || '----' }}</text>
      </view>
      <view class="edit-profile" @tap="navigateToProfile">
        <text class="edit-text">编辑资料</text>
        <text class="icon-arrow">〉</text>
      </view>
    </view>

    <!-- 用户数据统计 -->
    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-value">52</text>
        <text class="stat-label">收藏</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">128</text>
        <text class="stat-label">关注</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">96</text>
        <text class="stat-label">粉丝</text>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="menu-list">
      <view class="menu-section">
        <view class="section-title">
          <text class="title-text">个人与账户</text>
        </view>

        <view class="menu-item ripple" @tap="navigateToSettings">
          <view class="menu-icon settings-icon">
            <text class="iconfont">⚙️</text>
          </view>
          <view class="menu-content">
            <text class="menu-text">系统设置</text>
            <text class="menu-desc">隐私、通知、账号安全</text>
          </view>
          <text class="icon-arrow">〉</text>
        </view>

        <view class="menu-item ripple" @tap="navigateToFavorites">
          <view class="menu-icon favorites-icon">
            <text class="iconfont">❤️</text>
          </view>
          <view class="menu-content">
            <text class="menu-text">我的收藏</text>
            <text class="menu-desc">查看您收藏的内容</text>
          </view>
          <text class="icon-arrow">〉</text>
        </view>

        <view class="menu-item ripple" @tap="navigateToHistory">
          <view class="menu-icon history-icon">
            <text class="iconfont">🕒</text>
          </view>
          <view class="menu-content">
            <text class="menu-text">浏览历史</text>
            <text class="menu-desc">查看最近浏览记录</text>
          </view>
          <text class="icon-arrow">〉</text>
        </view>
      </view>

      <view class="menu-section">
        <view class="section-title">
          <text class="title-text">支持与反馈</text>
        </view>

        <view class="menu-item ripple" @tap="navigateToAbout">
          <view class="menu-icon about-icon">
            <text class="iconfont">ℹ️</text>
          </view>
          <view class="menu-content">
            <text class="menu-text">关于我们</text>
            <text class="menu-desc">了解MutiLife的故事</text>
          </view>
          <text class="icon-arrow">〉</text>
        </view>

        <view class="menu-item ripple" @tap="navigateToHelp">
          <view class="menu-icon help-icon">
            <text class="iconfont">❓</text>
          </view>
          <view class="menu-content">
            <text class="menu-text">帮助中心</text>
            <text class="menu-desc">常见问题解答</text>
          </view>
          <text class="icon-arrow">〉</text>
        </view>
      </view>

      <!-- 退出登录按钮 -->
      <view class="logout-section">
        <button class="logout-button" @tap="showLogoutConfirm">退出登录</button>
      </view>
    </view>

    <!-- 自定义TabBar -->
    <CustomTabBar />
  </view>
</template>

<script>
import CustomTabBar from '@/components/CustomTabBar.vue'

export default {
  components: {
    CustomTabBar
  },
  data() {
    return {
      userInfo: {}
    }
  },
  onShow() {
    // 每次页面显示时重新获取用户信息
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      try {
        const userInfo = uni.getStorageSync('userInfo');
        if (userInfo) {
          this.userInfo = userInfo;
        } else {
          // 用户未登录，跳转到登录页
          this.navigateToLogin();
        }
      } catch (e) {
        console.error('获取用户信息失败:', e);
      }
    },
    navigateToProfile() {
      uni.navigateTo({
        url: '/pages/mine/profile'
      });
    },
    navigateToSettings() {
      uni.navigateTo({
        url: '/pages/mine/settings'
      });
    },
    navigateToFavorites() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      });
    },
    navigateToHistory() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      });
    },
    navigateToAbout() {
      uni.navigateTo({
        url: '/pages/mine/about'
      });
    },
    navigateToHelp() {
      uni.navigateTo({
        url: '/pages/mine/profile'
      });
    },
    navigateToLogin() {
      uni.navigateTo({
        url: '/pages/mine/change-password'
      });
    },
    showLogoutConfirm() {
      uni.showModal({
        title: '确认退出',
        content: '是否确认退出登录？',
        success: (res) => {
          if (res.confirm) {
            this.logout();
          }
        }
      });
    },
    logout() {
      try {
        // 清除用户登录信息
        uni.removeStorageSync('userInfo');
        uni.removeStorageSync('token');

        // 显示退出成功提示
        uni.showToast({
          title: '退出成功',
          icon: 'success',
          success: () => {
            // 退出后跳转到欢迎页或登录页
            setTimeout(() => {
              uni.reLaunch({
                url: '/pages/welcome/index'
              });
            }, 1500);
          }
        });
      } catch (e) {
        console.error('退出登录失败:', e);
        uni.showToast({
          title: '退出失败，请重试',
          icon: 'none'
        });
      }
    }
  }
}
</script>

<style>
.mine-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #F8F9FC;
  padding-bottom: 140rpx;
  position: relative;
}

/* 顶部渐变背景 */
.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 360rpx;
  background: linear-gradient(135deg, #FF6B6B, #FF9D70);
  border-bottom-left-radius: 40rpx;
  border-bottom-right-radius: 40rpx;
  z-index: 0;
}

/* 添加装饰圆点 */
.header-background::before {
  content: '';
  position: absolute;
  top: 30rpx;
  right: 40rpx;
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
}

.header-background::after {
  content: '';
  position: absolute;
  top: 180rpx;
  left: 60rpx;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

/* 用户信息卡片样式 */
.user-card {
  position: relative;
  z-index: 1;
  background-color: #FFFFFF;
  margin: 80rpx 30rpx 0;
  padding: 40rpx 30rpx;
  display: flex;
  align-items: center;
  border-radius: 20rpx;
  box-shadow: 0 15rpx 35rpx rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.avatar-wrapper {
  position: relative;
}

.avatar-container {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 30rpx;
  border: 6rpx solid #FFFFFF;
  box-shadow: 0 8rpx 20rpx rgba(255,107,107,0.25);
  transition: all 0.3s;
}

.avatar-container:active {
  transform: scale(0.95);
}

.avatar-badge {
  position: absolute;
  right: 20rpx;
  bottom: 0;
  background: linear-gradient(135deg, #FFD27D, #FFAA5C);
  border-radius: 15rpx;
  padding: 4rpx 10rpx;
  border: 2rpx solid #FFFFFF;
  box-shadow: 0 4rpx 8rpx rgba(255, 170, 92, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
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

.badge-text {
  font-size: 20rpx;
  color: #FFFFFF;
  font-weight: bold;
}

.avatar {
  width: 100%;
  height: 100%;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.username {
  font-size: 40rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 10rpx;
}

.user-id {
  font-size: 24rpx;
  color: #999999;
}

.edit-profile {
  display: flex;
  align-items: center;
  background-color: #F8F9FC;
  padding: 12rpx 20rpx;
  border-radius: 30rpx;
}

.edit-text {
  font-size: 28rpx;
  color: #FF6B6B;
  font-weight: 500;
}

.icon-arrow {
  font-size: 24rpx;
  color: #FF6B6B;
  margin-left: 6rpx;
}

/* 用户数据统计 */
.stats-card {
  position: relative;
  z-index: 1;
  background-color: #FFFFFF;
  margin: 30rpx 30rpx;
  border-radius: 20rpx;
  padding: 30rpx 0;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 10rpx 25rpx rgba(0,0,0,0.07);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  transition: transform 0.3s;
}

.stat-item:active {
  transform: scale(0.95);
}

.stat-value {
  font-size: 40rpx;
  font-weight: bold;
  background: linear-gradient(135deg, #FF6B6B, #FF9D70);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 26rpx;
  color: #999999;
}

.stat-divider {
  width: 2rpx;
  background-color: #EEEEEE;
  margin: 10rpx 0;
}

/* 菜单列表样式 */
.menu-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 0 30rpx;
}

.section-title {
  margin: 30rpx 20rpx 20rpx;
}

.title-text {
  font-size: 28rpx;
  color: #999999;
  font-weight: 500;
}

.menu-section {
  background-color: #FFFFFF;
  margin-bottom: 30rpx;
  border-radius: 20rpx;
  box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.04);
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #F5F5F5;
  position: relative;
  transition: all 0.3s;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background-color: #FAFAFA;
  transform: translateX(10rpx);
}

.menu-icon {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20rpx;
  border-radius: 16rpx;
  transition: all 0.3s;
}

.menu-item:active .menu-icon {
  transform: scale(0.9) rotate(-5deg);
}

.settings-icon {
  background-color: #EFF9FF;
}

.favorites-icon {
  background-color: #FFF2F2;
}

.history-icon {
  background-color: #F0F9F0;
}

.about-icon {
  background-color: #F2F2FF;
}

.help-icon {
  background-color: #FFF9EF;
}

.iconfont {
  font-size: 42rpx;
}

.menu-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.menu-text {
  font-size: 32rpx;
  color: #333333;
  font-weight: 500;
  margin-bottom: 6rpx;
}

.menu-desc {
  font-size: 24rpx;
  color: #999999;
}

/* 波纹效果 */
.ripple {
  position: relative;
  overflow: hidden;
}

.ripple::after {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, #7777 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10, 10);
  opacity: 0;
  transition: transform 0.5s, opacity 0.5s;
}

.ripple:active::after {
  transform: scale(0, 0);
  opacity: 0.3;
  transition: 0s;
}

/* 退出登录按钮样式 */
.logout-section {
  margin-top: 40rpx;
  margin-bottom: -80rpx;
  padding: 0 20rpx;
}

.logout-button {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  background: linear-gradient(to right, #FF7979, #FF5E5E);
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: 500;
  border-radius: 45rpx;
  border: none;
  box-shadow: 0 10rpx 25rpx rgba(255,94,94,0.3);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  margin-bottom:50px;
}

.logout-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%);
  transition: all 0.8s;
}

.logout-button:active::before {
  left: 100%;
}

.logout-button:active {
  transform: scale(0.98);
  box-shadow: 0 5rpx 15rpx rgba(255,94,94,0.2);
}
</style>
