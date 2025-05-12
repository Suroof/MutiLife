<template>
  <view class="welcome-container">
    <view class="content">
      <text class="title">MUTILIFE</text>

      <view class="buttons">
        <button class="btn login-btn" @click="navigateToLogin">LOG IN</button>
        <button class="btn signup-btn" @click="navigateToSignup">SIGN UP</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  onLoad() {
    // 检查用户是否已登录的逻辑已移除
    // 现在欢迎页将始终显示，不会自动跳转
    console.log('欢迎页已加载');
  },
  methods: {
    navigateToLogin() {
      uni.navigateTo({
        url: '/pages/login/login'
      });
    },
    navigateToSignup() {
      uni.navigateTo({
        url: '/pages/login/register'
      });
    }
  }
};
</script>

<style>
.welcome-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-image: url('/static/background.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}

.content {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 0 50rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 60rpx;
  font-weight: bold;
  color: #FFFFFF;
  letter-spacing: 5rpx;
  margin-bottom: 120rpx;
}

.buttons {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.btn {
  width: 100%;
  height: 90rpx;
  border-radius: 45rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 500;
  letter-spacing: 2rpx;
}

.login-btn {
  background-color: #3DD1C9;
  color: #FFFFFF;
  border: none;
}

.signup-btn {
  background-color: #FFFFFF;
  color: #333333;
  border: 1px solid #E5E5E5;
}
</style>