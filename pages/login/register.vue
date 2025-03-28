<template>
	<view class="container">
		<view class="header">
			<view class="back-btn" @tap="goBack">
				<text class="iconfont">&#xe625;</text>
			</view>
			<text class="page-title">用户注册</text>
			<view class="placeholder"></view>
		</view>

		<view class="register-form">
			<view class="input-group">
				<text class="input-label">手机号码</text>
				<view class="input-wrapper">
					<input class="input" type="number" v-model="phone" placeholder="请输入手机号码" maxlength="11" />
				</view>
			</view>

			<view class="input-group verification">
				<text class="input-label">验证码</text>
				<view class="input-wrapper with-button">
					<input class="input" type="number" v-model="verifyCode" placeholder="请输入验证码" maxlength="6" />
					<button class="verify-btn" @tap="sendVerifyCode" :disabled="isCounting">
						{{verifyBtnText}}
					</button>
				</view>
			</view>

			<view class="input-group">
				<text class="input-label">用户名</text>
				<view class="input-wrapper">
					<input class="input" type="text" v-model="username" placeholder="请设置用户名" />
				</view>
			</view>

			<view class="input-group">
				<text class="input-label">密码</text>
				<view class="input-wrapper">
					<input class="input" :type="isPassword ? 'password' : 'text'" v-model="password" placeholder="请设置6-20位密码" />
					<text class="iconfont eye-icon" @tap="togglePasswordVisibility">{{isPassword ? '&#xe629;' : '&#xe628;'}}</text>
				</view>
			</view>

			<view class="agreement">
				<checkbox :checked="agreeTerms" @tap="agreeTerms = !agreeTerms" color="#FF6699" style="transform:scale(0.7)" />
				<text class="agreement-text">我已阅读并同意</text>
				<text class="agreement-link" @tap="viewTerms">《用户协议》</text>
				<text class="agreement-text">和</text>
				<text class="agreement-link" @tap="viewPrivacy">《隐私政策》</text>
			</view>

			<button class="register-btn" @tap="register" :disabled="!canRegister">注册</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone: '',
				verifyCode: '',
				username: '',
				password: '',
				isPassword: true,
				agreeTerms: false,
				countdown: 60,
				isCounting: false,
				timer: null
			}
		},
		computed: {
			verifyBtnText() {
				return this.isCounting ? this.countdown + 's' : '获取验证码';
			},
			canRegister() {
				return this.phone && this.verifyCode && this.username && this.password && this.agreeTerms;
			}
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			togglePasswordVisibility() {
				this.isPassword = !this.isPassword;
			},
			sendVerifyCode() {
				// 验证手机号格式
				if (!/^1\d{10}$/.test(this.phone)) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					});
					return;
				}

				// 开始倒计时
				this.isCounting = true;
				this.countdown = 60;

				// 模拟发送验证码
				uni.showToast({
					title: '验证码已发送',
					icon: 'success'
				});

				this.timer = setInterval(() => {
					if (this.countdown > 1) {
						this.countdown--;
					} else {
						this.isCounting = false;
						clearInterval(this.timer);
					}
				}, 1000);
			},
			register() {
				// 验证手机号
				if (!/^1\d{10}$/.test(this.phone)) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					});
					return;
				}

				// 验证验证码
				if (!/^\d{6}$/.test(this.verifyCode)) {
					uni.showToast({
						title: '请输入6位验证码',
						icon: 'none'
					});
					return;
				}

				// 验证用户名
				if (this.username.length < 2) {
					uni.showToast({
						title: '用户名至少需要2个字符',
						icon: 'none'
					});
					return;
				}

				// 验证密码
				if (this.password.length < 6 || this.password.length > 20) {
					uni.showToast({
						title: '密码长度为6-20位',
						icon: 'none'
					});
					return;
				}

				// 验证协议勾选
				if (!this.agreeTerms) {
					uni.showToast({
						title: '请阅读并同意用户协议',
						icon: 'none'
					});
					return;
				}

				// 模拟注册请求
				uni.showLoading({
					title: '注册中...'
				});

				setTimeout(() => {
					uni.hideLoading();

					uni.showToast({
						title: '注册成功',
						icon: 'success'
					});

					// 存储用户信息
					uni.setStorageSync('userInfo', {
						username: this.username,
						phone: this.phone,
						avatar: '/static/avatar.jpg'
					});

					// 跳转到首页
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/index/index'
						});
					}, 1500);
				}, 2000);
			},
			viewTerms() {
				uni.showToast({
					title: '用户协议页面开发中',
					icon: 'none'
				});
			},
			viewPrivacy() {
				uni.showToast({
					title: '隐私政策页面开发中',
					icon: 'none'
				});
			}
		},
		onUnload() {
			// 清除定时器
			if (this.timer) {
				clearInterval(this.timer);
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
	background-color: #FFFFFF;
	min-height: 100vh;
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 30rpx;
	border-bottom: 1rpx solid #F5F5F5;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	background-color: #FFFFFF;
	z-index: 10;
}

.back-btn {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.page-title {
	font-size: 36rpx;
	font-weight: 500;
	color: #333;
}

.placeholder {
	width: 60rpx;
	height: 60rpx;
}

.register-form {
	padding: 120rpx 40rpx 40rpx;
}

.input-group {
	margin-bottom: 40rpx;
}

.input-label {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 20rpx;
	display: block;
}

.input-wrapper {
	border-bottom: 1rpx solid #EEEEEE;
	display: flex;
	align-items: center;
	padding-bottom: 20rpx;
}

.with-button {
	justify-content: space-between;
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

.verify-btn {
	background-color: #FF6699;
	color: #FFFFFF;
	font-size: 24rpx;
	padding: 0 20rpx;
	height: 60rpx;
	border-radius: 30rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border: none;
	margin: 0;
}

.verify-btn[disabled] {
	background-color: #F8F8F8;
	color: #999;
}

.agreement {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	margin-bottom: 60rpx;
}

.agreement-text {
	font-size: 26rpx;
	color: #666;
}

.agreement-link {
	font-size: 26rpx;
	color: #FF6699;
}

.register-btn {
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
	border: none;
}

.register-btn[disabled] {
	background-color: #FFCCE0;
}
</style>