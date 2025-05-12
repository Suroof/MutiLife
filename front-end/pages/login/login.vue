<template>
  <view class="login-container">
    <view class="background-image"></view>

    <view class="content">
      <text class="title">MUTILIFE</text>

      <view class="login-card">
        <text class="welcome-text">Welcome!</text>

        <view class="input-group">
          <text class="label">USERNAME</text>
          <input class="input" type="text" v-model="username" placeholder="" />
        </view>

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

        <button class="login-btn" @click="login">LOG IN</button>

        <view class="divider">
          <text class="divider-text">OR log in with</text>
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
import { login as authLogin } from "@/services/api/auth.js";

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
    login() {
      if (!this.username.trim()) {
        uni.showToast({
          title: "Please enter your username",
          icon: "none",
        });
        return;
      }

      if (!this.password) {
        uni.showToast({
          title: "Please enter your password",
          icon: "none",
        });
        return;
      }

      uni.showLoading({
        title: "Logging in...",
      });

      authLogin({
        username: this.username,
        password: this.password,
      })
        .then((response) => {
          uni.hideLoading();
          console.log("Login successful:", JSON.stringify(response));

          if (response && response.user) {
            try {
              uni.setStorageSync("userInfo", response.user);
            } catch (e) {
              console.error("Failed to save user info:", e);
            }
          }

          uni.showToast({
            title: "Login successful",
            icon: "success",
          });

          setTimeout(() => {
            uni.navigateTo({
              url: "/pages/index/index",
              fail: (err) => {
                console.error("导航到首页失败:", err);
                uni.reLaunch({
                  url: "/pages/index/index"
                });
              }
            });
          }, 1500);
        })
        .catch((error) => {
          uni.hideLoading();
          console.error("Login error:", error);

          let errorMessage = "Login failed";
          if (error.message) {
            errorMessage = error.message;
          } else if (typeof error === "string") {
            errorMessage = error;
          } else {
            errorMessage =
              "Could not connect to server, please check your network";
          }

          uni.showToast({
            title: errorMessage,
            icon: "none",
            duration: 3000,
          });
        });
    },
  },
};
</script>

<style>
.login-container {
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
  background-image: url("/static/background.jpg");
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
  color: #ffffff;
  letter-spacing: 5rpx;
  margin-bottom: 50rpx;
}

.login-card {
  width: 100%;
  max-width: 640rpx;
  background-color: #ffffff;
  border-radius: 30rpx;
  padding: 50rpx 40rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
}

.welcome-text {
  font-size: 36rpx;
  font-weight: 500;
  color: #3dd1c9;
  margin-bottom: 50rpx;
  text-align: center;
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
  border-bottom: 1px solid #e5e5e5;
  font-size: 28rpx;
  color: #333333;
  padding: 10rpx 0;
}

.show-link {
  position: absolute;
  right: 10rpx;
  bottom: 20rpx;
  font-size: 24rpx;
  color: #3dd1c9;
}

.login-btn {
  width: 100%;
  height: 90rpx;
  background-color: #3dd1c9;
  color: #ffffff;
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
  background-color: #e5e5e5;
}

.divider-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
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
  color: #4285f4;
  border: 1px solid #e5e5e5;
}

.facebook {
  color: #3b5998;
  border: 1px solid #e5e5e5;
}

.twitter {
  color: #1da1f2;
  border: 1px solid #e5e5e5;
}
</style>
