<template>
  <view class="register-container">
    <view class="background-image"></view>

    <view class="content">
      <text class="title">MUTILIFE</text>

      <view class="register-card">

        <view class="input-group">
          <text class="label">PASSWORD</text>
          <input
            class="input"
            :type="isPassword ? 'password' : 'text'"
            v-model="password"
            placeholder=""
          />
          <text class="show-link" @click="togglePasswordVisibility">
            {{ isPassword ? "Show" : "Hide" }} 
          </text>
        </view>

        <view class="input-group">
          <text class="label">USERNAME</text>
          <input class="input" type="text" v-model="username" placeholder="" />
        </view>

        <button class="signup-btn" @click="register">SIGN UP</button>

        <view class="divider">
          <text class="divider-text">OR Sign up with</text>
        </view>

        <view class="social-login">
          <view class="social-icon google">G</view>
          <view class="social-icon facebook">f</view>
          <view class="social-icon twitter">t</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { register as authRegister } from "@/services/api/auth.js";

export default {
  data() {
    return {
      username: "",
      password: "",
      isPassword: true,
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.isPassword = !this.isPassword;
    },
    register() {
      if (!this.username.trim()) {
        uni.showToast({
          title: "Please enter your username",
          icon: "none",
        });
        return;
      }

      if (!this.password || this.password.length < 6) {
        uni.showToast({
          title: "Password must be at least 6 characters",
          icon: "none",
        });
        return;
      }

      uni.showLoading({
        title: "Signing up...",
      });

      authRegister({
        username: this.username,
        password: this.password,
        name: this.username,
      })
        .then((response) => {
          uni.hideLoading();
          console.log("Registration successful:", response);

          uni.showToast({
            title: "Registration successful",
            icon: "success",
          });

          setTimeout(() => {
            uni.navigateTo({
              url: "/pages/login/login",
            });
          }, 1500);
        })
        .catch((error) => {
          uni.hideLoading();
          console.error("Registration error:", error);

          uni.showToast({
            title: error.message || "Registration failed, please try again",
            icon: "none",
          });
        });
    }
  },
};
</script>

<style>
.register-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/static/background.jpg');
  background-size: cover;
  background-position: center;
  filter: brightness(0.8);
}

.content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 100rpx 40rpx;
}

.title {
  font-size: 60rpx;
  font-weight: bold;
  color: #FFFFFF;
  letter-spacing: 5rpx;
  margin-bottom: 50rpx;
}

.register-card {
  width: 100%;
  max-width: 640rpx;
  background-color: #FFFFFF;
  border-radius: 30rpx;
  padding: 50rpx 40rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
}

.input-group {
  position: relative;
  margin-bottom: 40rpx;
}

.label {
  font-size: 24rpx;
  color: #999999;
  margin-bottom: 10rpx;
  display: block;
}

.input {
  width: 100%;
  height: 80rpx;
  border: none;
  border-bottom: 1px solid #E5E5E5;
  font-size: 28rpx;
  color: #333333;
  padding: 10rpx 0;
}

.show-link {
  position: absolute;
  right: 10rpx;
  bottom: 20rpx;
  font-size: 24rpx;
  color: #3DD1C9;
  cursor: pointer; /* 添加鼠标指针样式以增强交互性 */
}

.signup-btn {
  width: 100%;
  height: 90rpx;
  background-color: #3DD1C9;
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: 500;
  letter-spacing: 2rpx;
  border-radius: 45rpx;
  margin: 60rpx 0 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.divider {
  position: relative;
  width: 100%;
  text-align: center;
  margin: 30rpx 0;
  height: 1px;
  background-color: #E5E5E5;
}

.divider-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #FFFFFF;
  padding: 0 20rpx;
  font-size: 24rpx;
  color: #999999;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 40rpx;
  margin-top: 20rpx;
}

.social-icon {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: bold;
}

.google {
  color: #4285F4;
  border: 1px solid #E5E5E5;
}

.facebook {
  color: #3B5998;
  border: 1px solid #E5E5E5;
}

.twitter {
  color: #1DA1F2;
  border: 1px solid #E5E5E5;
}
</style>