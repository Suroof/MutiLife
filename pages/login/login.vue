<template>
	<view class="container">
		<view class="logo-container">
			<image class="logo" src="/static/logo.png" mode="aspectFit"></image>
			<text class="app-name">MutiLife</text>
		</view>

		<view class="login-form">
			<view class="input-group">
				<text class="iconfont icon">&#xe623;</text>
				<input class="input" type="text" v-model="username" placeholder="用户名/手机号" />
			</view>

			<view class="input-group">
				<text class="iconfont icon">&#xe624;</text>
				<input class="input" type="password" v-model="password" placeholder="密码" :password="isPassword" />
				<text class="iconfont eye-icon" @tap="togglePasswordVisibility">{{isPassword ? '&#xe629;' : '&#xe628;'}}</text>
			</view>

			<view class="login-options">
				<view class="remember-me">
					<checkbox :checked="rememberMe" @tap="rememberMe = !rememberMe" color="#FF6699" style="transform:scale(0.7)" />
					<text class="option-text">记住密码</text>
				</view>
				<text class="option-text forget-pwd" @tap="forgetPassword">忘记密码?</text>
			</view>

			<button class="login-btn" @tap="login">登录</button>

			<view class="quick-login">
				<view class="divider">
					<view class="line"></view>
					<text class="divider-text">or</text>
					<view class="line"></view>
				</view>

				<view class="social-login">
					<view class="social-icon wechat" @tap="socialLogin('wechat')">
						<text class="iconfont">&#xe616;</text>
					</view>
					<view class="social-icon qq" @tap="socialLogin('qq')">
						<text class="iconfont">&#xe617;</text>
					</view>
					<view class="social-icon weibo" @tap="socialLogin('weibo')">
						<text class="iconfont">&#xe618;</text>
					</view>
				</view>
			</view>
		</view>

		<view class="register-hint">
			<text class="hint-text">还没有账号?</text>
			<text class="register-link" @tap="goToRegister">立即注册</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '',
				password: '',
				isPassword: true,
				rememberMe: false
			}
		},
		methods: {
			togglePasswordVisibility() {
				this.isPassword = !this.isPassword;
			},
			login() {
				if (!this.username.trim()) {
					uni.showToast({
						title: '请输入用户名',
						icon: 'none'
					});
					return;
				}

				if (!this.password) {
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					});
					return;
				}

				// 模拟登录请求
				uni.showLoading({
					title: '登录中...'
				});

				setTimeout(() => {
					uni.hideLoading();

					// 模拟登录成功
					uni.setStorageSync('userInfo', {
						username: this.username,
						avatar: '/static/avatar.jpg'
					});

					uni.showToast({
						title: '登录成功',
						icon: 'success'
					});

					// 跳转到首页
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/index/index'
						});
					}, 1500);
				}, 2000);
			},
			forgetPassword() {
				uni.showToast({
					title: '忘记密码功能开发中',
					icon: 'none'
				});
			},
			socialLogin(type) {
				uni.showToast({
					title: type + '登录功能开发中',
					icon: 'none'
				});
			},
			goToRegister() {
				uni.navigateTo({
					url: '/pages/login/register'
				});
			}
		}
	}
</script>

<style>
@font-face {
	font-family: "iconfont";
	src: url('data:font/woff2;charset=utf-8;base64,d09GMgABAAAAAAUwAAsAAAAACqAAAATiAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDXgqHeIZ1ATYCJAMcCxAABCAFhGcHXBskCRFVnM/Ifhy4sdOITd1RC4OD8QBseAqhxZQTni/82/r7Tmbn3ckzSTwkImk6iURoJDshRPJfSeA/19K+BBSTsTWwtrbFMlxluIqrMFQdVaSl5cW5dzy5NyUdT4EAeHje5urd9wQpk6MQoG3tPAQpcisC8q8xc1nhRJwX6BhXJvCmAgTAI78/1JNlkoDyY29znEPWILLhf3QvDNUnrZbaQvuB21Kbavr1ORGmEk2EJkL4JKZILBIhhEQoFGoldmZ0ShwmUC/fuLxbP3tMAMqoCTB4enIKKBw6KaD31PQEqJwoZA8UQeXyzOkZcAaKKndkXwZwav1+/IcsUYBk5kDf9fBoAobfqV97aHH94riWI4DhbmDbbhiwAGiQybzRIwg6vIAy9Ws6R4CGStkV+m59P/v99vs3vs71P5c27n+zUFQCshxDuZrwj+eAIgNIHLBUQEi5KnrY8U4gMPyu1+8YhNDvc3B4Mhk0fTI2OKd8QwTv1CJQDGADcgFZW04WpMILfcPdzTNxj5wP7S4IHImfm/fN35g/Mfbr5bvq+2SClwAJlYRQy8Y0S0JY0zSbNq9ZDMnGG5Nt8oZoVe2yYTm0NV4p2exbpXN9+/yz6rN33/RP1VZX0+RlK1asrBb1Jyuu2itXr5hOQzEzUV0/VbyaQvFaHFfTnMqrRQupWhQIUlz+Lk7t2FqBIXrm4cXyOoHB+KXFyB8FGufrF+DPU5N8qaBFTm6KfHZ6QdvYeRXNc1sk51U0zY1dMJvz44XlwpLM6JqZjvbTc/PzzDlMGFo+dXr7WrwgSJid0bbueGEJxVnz2xdlyYsnpuY1tlXVnFOHoYN8ybz5+dCGX71kJw/Fz7/mV4/++Y25+YL1+czTuTX9F0p1VPdSvf8mxXSUZ63aR5+Uvt4NXOVdDt+aZvXBzGnZXA65lDmsNzLIBpR9yUizH92ZQHrkhEa5BRpWbrj0hhQMvOEjKtv1QjNDXJjCUDCoaQdDCuFKO2lozN7QDc0KM6A6SsPAAoa6VBQRkbJFw0ZVDHTzRp2vFRGhVMvWBWNH4cP6nwljvJFjDp6zNVjS0K47Nnq/KmdCMzQHO3ZorP5rXFwT6wIZCVp13BRhfPwEvnD+Yhw/PnGqBpvBjbF9owN//DvQQnrFRDXZbmyC8e4eBxiSt9ZPG60uu75IWl7a9Xf5zcbGyuq2f4FMFPYW1r9h9E5hJpg5OJKVQVJQAbC/2OVOVM7vLsC+iXUfgPcP/wHAH4Xo3TvobhMKCo9ixgO8UhfNkbJvbDZJfeMv1ZBf8Icp9cQcU3OTKgoJsABqDI4Aa53/53AZyD4O3TgL5FFYBTKVcTCKClDBsoKksgyKenPWjWZkCBGUgDnOAYQeVyDpcQtZj1swim/Kyt1B0uMPlPWEpYV6xsAyZh7aqYaGDGfYLBwg7oZTa2ZIcsFBfUMzUTCMU7Q33GMCseO81G/sICpGWFCupxwARWQRPVmAIzRMaFQJezQu05Wm5EoPOHWe7WFGIAcwFRl4JXsB4ZzBqUNMIYlXrDn8DZKRJAxGE8qDsW/QmEAMvyVN+kYdEBRGMLkYL5cXA4DI8Mygj1gAG0gzIQNRWpBx0fhkRclRnwjQ+dKw+fJl/h8BtbE+wFqNARkKZGhQQWmNKsxFZkVfpI2FMhJe2CnDFTbLJD+qJVGm'));
}

.iconfont {
	font-family: "iconfont" !important;
	font-size: 24px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
	background-color: #FFFFFF;
	padding: 40rpx;
}

.logo-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 60rpx;
}

.logo {
	width: 150rpx;
	height: 150rpx;
	margin-bottom: 20rpx;
}

.app-name {
	font-size: 48rpx;
	font-weight: bold;
	color: #333;
}

.login-form {
	width: 100%;
}

.input-group {
	display: flex;
	align-items: center;
	background-color: #F8F8F8;
	border-radius: 12rpx;
	padding: 20rpx 30rpx;
	margin-bottom: 30rpx;
}

.icon {
	font-size: 40rpx;
	color: #999;
	margin-right: 20rpx;
}

.input {
	flex: 1;
	height: 60rpx;
	font-size: 30rpx;
	color: #333;
}

.eye-icon {
	font-size: 40rpx;
	color: #999;
}

.login-options {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 40rpx;
}

.remember-me {
	display: flex;
	align-items: center;
}

.option-text {
	font-size: 26rpx;
	color: #666;
}

.forget-pwd {
	color: #FF6699;
}

.login-btn {
	width: 100%;
	height: 90rpx;
	background-color: #FF6699;
	color: #FFFFFF;
	font-size: 32rpx;
	font-weight: 500;
	border-radius: 45rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 40rpx;
	border: none;
}

.quick-login {
	width: 100%;
}

.divider {
	display: flex;
	align-items: center;
	margin-bottom: 40rpx;
}

.line {
	flex: 1;
	height: 1px;
	background-color: #EEEEEE;
}

.divider-text {
	padding: 0 20rpx;
	font-size: 26rpx;
	color: #999;
}

.social-login {
	display: flex;
	justify-content: center;
}

.social-icon {
	width: 90rpx;
	height: 90rpx;
	border-radius: 45rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 30rpx;
}

.wechat {
	background-color: #09BB07;
}

.qq {
	background-color: #12B7F5;
}

.weibo {
	background-color: #E6162D;
}

.social-icon .iconfont {
	color: #FFFFFF;
	font-size: 50rpx;
}

.register-hint {
	display: flex;
	margin-top: 60rpx;
}

.hint-text {
	font-size: 28rpx;
	color: #666;
	margin-right: 10rpx;
}

.register-link {
	font-size: 28rpx;
	color: #FF6699;
	font-weight: 500;
}
</style>