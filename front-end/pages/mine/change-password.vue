<template>
	<view class="container">
		<view class="header">
			<view class="back-btn" hover-class="btn-hover" @tap="goBack">
				<text class="iconfont back-icon">&#xe603;</text>
			</view>
			<view class="title">修改密码</view>
			<view class="placeholder"></view>
		</view>

		<view class="form-container">
			<view class="form-item">
				<text class="label">原密码</text>
				<view class="input-wrapper" :class="{'input-focus': oldPasswordFocus}">
					<input
						:type="oldPasswordVisible ? 'text' : 'password'"
						v-model="oldPassword"
						placeholder="请输入原密码"
						@focus="oldPasswordFocus = true"
						@blur="oldPasswordFocus = false" />
					<text class="iconfont eye-icon" @tap="toggleOldPasswordVisibility">{{oldPasswordVisible ? '&#xe628;' : '&#xe629;'}}</text>
				</view>
			</view>

			<view class="form-item">
				<text class="label">新密码</text>
				<view class="input-wrapper" :class="{'input-focus': newPasswordFocus}">
					<input
						:type="newPasswordVisible ? 'text' : 'password'"
						v-model="newPassword"
						placeholder="请输入新密码"
						@focus="newPasswordFocus = true"
						@blur="newPasswordFocus = false" />
					<text class="iconfont eye-icon" @tap="toggleNewPasswordVisibility">{{newPasswordVisible ? '&#xe628;' : '&#xe629;'}}</text>
				</view>

				<!-- 密码强度指示器 -->
				<view class="password-strength" v-if="newPassword" :class="{'strength-animate': newPassword}">
					<view class="strength-label">密码强度：</view>
					<view class="strength-bars">
						<view class="strength-bar" :class="{'active': passwordStrength >= 1}"></view>
						<view class="strength-bar" :class="{'active': passwordStrength >= 2}"></view>
						<view class="strength-bar" :class="{'active': passwordStrength >= 3}"></view>
					</view>
					<text class="strength-text" :class="{
						'strength-weak': passwordStrength === 1,
						'strength-medium': passwordStrength === 2,
						'strength-strong': passwordStrength === 3
					}">{{strengthText}}</text>
				</view>
			</view>

			<view class="form-item">
				<text class="label">确认密码</text>
				<view class="input-wrapper" :class="{'input-focus': confirmPasswordFocus}">
					<input
						:type="confirmPasswordVisible ? 'text' : 'password'"
						v-model="confirmPassword"
						placeholder="请再次输入新密码"
						@focus="confirmPasswordFocus = true"
						@blur="confirmPasswordFocus = false" />
					<text class="iconfont eye-icon" @tap="toggleConfirmPasswordVisibility">{{confirmPasswordVisible ? '&#xe628;' : '&#xe629;'}}</text>
				</view>
				<view class="password-match" v-if="newPassword && confirmPassword" :class="{'match-animate': newPassword && confirmPassword}">
					<text class="match-icon" :class="{'match': passwordsMatch}">{{passwordsMatch ? '✓' : '✗'}}</text>
					<text class="match-text" :class="{'match': passwordsMatch}">{{passwordsMatch ? '密码匹配' : '密码不匹配'}}</text>
				</view>
			</view>

			<view class="tips">
				<text class="tips-title">密码要求：</text>
				<view class="tips-list">
					<view class="tips-item" :class="{'tips-valid': newPassword.length >= 8}">
						<text class="tips-icon">{{newPassword.length >= 8 ? '✓' : '•'}}</text>
						<text>长度至少为8位</text>
					</view>
					<view class="tips-item" :class="{'tips-valid': /[a-z]/.test(newPassword)}">
						<text class="tips-icon">{{/[a-z]/.test(newPassword) ? '✓' : '•'}}</text>
						<text>包含小写字母</text>
					</view>
					<view class="tips-item" :class="{'tips-valid': /[A-Z]/.test(newPassword)}">
						<text class="tips-icon">{{/[A-Z]/.test(newPassword) ? '✓' : '•'}}</text>
						<text>包含大写字母</text>
					</view>
					<view class="tips-item" :class="{'tips-valid': /\d/.test(newPassword)}">
						<text class="tips-icon">{{/\d/.test(newPassword) ? '✓' : '•'}}</text>
						<text>包含数字</text>
					</view>
					<view class="tips-item" :class="{'tips-valid': /[^a-zA-Z0-9]/.test(newPassword)}">
						<text class="tips-icon">{{/[^a-zA-Z0-9]/.test(newPassword) ? '✓' : '•'}}</text>
						<text>包含特殊字符</text>
					</view>
				</view>
			</view>

			<button
				class="submit-btn"
				:disabled="!isFormValid"
				:class="{'btn-active': isFormValid}"
				:style="buttonStyle"
				hover-class="btn-hover"
				@tap="changePassword">确认修改</button>

			<view class="forgot-password" hover-class="link-hover" @tap="forgotPassword">忘记原密码？</view>
		</view>

		<!-- 成功提示弹窗 -->
		<view class="popup-mask" v-if="showSuccessPopup" @tap="completeChange"></view>
		<view class="success-popup" v-if="showSuccessPopup">
			<view class="success-content">
				<view class="success-icon">
					<text class="check-mark">✓</text>
				</view>
				<view class="success-title">密码修改成功</view>
				<view class="success-desc">您的账号密码已更新</view>
				<button class="success-btn" hover-class="btn-hover" @tap="completeChange">完成</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oldPassword: '',
				newPassword: '',
				confirmPassword: '',
				oldPasswordVisible: false,
				newPasswordVisible: false,
				confirmPasswordVisible: false,
				showSuccessPopup: false,
				oldPasswordFocus: false,
				newPasswordFocus: false,
				confirmPasswordFocus: false,
				buttonAngle: 45
			}
		},
		computed: {
			passwordStrength() {
				let strength = 0;
				const password = this.newPassword;

				if (password.length >= 8) {
					strength++;

					// 检查是否包含字母和数字
					if (/[a-zA-Z]/.test(password) && /\d/.test(password)) {
						strength++;

						// 检查是否包含大小写字母和特殊字符
						if (/[a-z]/.test(password) && /[A-Z]/.test(password) && /[^a-zA-Z0-9]/.test(password)) {
							strength++;
						}
					}
				}

				return strength;
			},
			strengthText() {
				switch(this.passwordStrength) {
					case 1: return '弱';
					case 2: return '中';
					case 3: return '强';
					default: return '弱';
				}
			},
			passwordsMatch() {
				return this.newPassword && this.confirmPassword && this.newPassword === this.confirmPassword;
			},
			isFormValid() {
				return this.oldPassword
					&& this.newPassword.length >= 8
					&& /[a-zA-Z]/.test(this.newPassword)
					&& /\d/.test(this.newPassword)
					&& this.passwordsMatch;
			},
			buttonStyle() {
				if (!this.isFormValid) return {};

				return {
					'background': `linear-gradient(${this.buttonAngle}deg, #FF6699, #FF9B82)`
				};
			}
		},
		mounted() {
			// 按钮渐变角度动画
			this.startButtonAnimation();
		},
		methods: {
			startButtonAnimation() {
				let increasing = true;
				setInterval(() => {
					if (increasing) {
						this.buttonAngle += 1;
						if (this.buttonAngle >= 135) increasing = false;
					} else {
						this.buttonAngle -= 1;
						if (this.buttonAngle <= 45) increasing = true;
					}
				}, 100);
			},
			goBack() {
				uni.navigateBack();
			},
			toggleOldPasswordVisibility() {
				this.oldPasswordVisible = !this.oldPasswordVisible;
			},
			toggleNewPasswordVisibility() {
				this.newPasswordVisible = !this.newPasswordVisible;
			},
			toggleConfirmPasswordVisibility() {
				this.confirmPasswordVisible = !this.confirmPasswordVisible;
			},
			forgotPassword() {
				uni.showToast({
					title: '请联系客服重置密码',
					icon: 'none'
				});
			},
			changePassword() {
				// 检查表单
				if (!this.isFormValid) {
					return;
				}

				// 显示加载中
				uni.showLoading({
					title: '修改中...'
				});

				// 模拟请求
				setTimeout(() => {
					uni.hideLoading();
					this.showSuccessPopup = true;
				}, 1500);
			},
			completeChange() {
				this.showSuccessPopup = false;
				setTimeout(() => {
					uni.navigateBack();
				}, 300);
			},
			showToast(title) {
				uni.showToast({
					title: title,
					icon: 'none'
				});
			}
		}
	}
</script>

<style>
.container {
	padding: 0;
	background-color: #f8f8f8;
	min-height: 100vh;
}

.header {
	height: 100rpx;
	background-color: #fff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 30rpx;
	position: relative;
	border-bottom: 1px solid #f0f0f0;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.back-btn {
	width: 80rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 30rpx;
	transition: all 0.2s;
}

.btn-hover {
	opacity: 0.7;
	transform: scale(0.95);
}

.link-hover {
	opacity: 0.7;
}

.back-icon {
	font-size: 38rpx;
	color: #333;
	transform: rotate(180deg);
}

.title {
	font-size: 36rpx;
	font-weight: 600;
	color: #333;
}

.placeholder {
	width: 80rpx;
}

.form-container {
	padding: 40rpx 30rpx;
}

.form-item {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.05);
	transition: all 0.3s;
}

.form-item:hover {
	transform: translateY(-2rpx);
	box-shadow: 0 4rpx 25rpx rgba(0, 0, 0, 0.08);
}

.label {
	font-size: 30rpx;
	color: #333;
	margin-bottom: 20rpx;
	display: block;
	font-weight: 500;
}

.input-wrapper {
	position: relative;
	display: flex;
	align-items: center;
	border-bottom: 1rpx solid #eee;
	transition: all 0.3s;
}

.input-focus {
	border-bottom: 1rpx solid #FF6699;
}

input {
	flex: 1;
	height: 90rpx;
	font-size: 32rpx;
	color: #333;
	padding-right: 60rpx;
}

.eye-icon {
	position: absolute;
	right: 10rpx;
	font-size: 40rpx;
	color: #999;
	transition: all 0.3s;
}

.eye-icon:active {
	transform: scale(0.9);
}

.password-strength {
	margin-top: 20rpx;
	display: flex;
	align-items: center;
	opacity: 0;
	transform: translateY(10rpx);
	animation: fadeInUp 0.5s forwards;
}

.strength-animate {
	animation: fadeInUp 0.5s forwards;
}

.strength-label {
	font-size: 26rpx;
	color: #666;
	margin-right: 10rpx;
}

.strength-bars {
	display: flex;
	margin-right: 10rpx;
}

.strength-bar {
	width: 40rpx;
	height: 10rpx;
	background-color: #EEEEEE;
	margin-right: 5rpx;
	border-radius: 5rpx;
	transition: all 0.3s;
}

.strength-bar.active:nth-child(1) {
	background-color: #FF6666;
}

.strength-bar.active:nth-child(2) {
	background-color: #FFAA00;
}

.strength-bar.active:nth-child(3) {
	background-color: #00CC66;
}

.strength-text {
	font-size: 26rpx;
	transition: all 0.3s;
}

.strength-weak {
	color: #FF6666;
}

.strength-medium {
	color: #FFAA00;
}

.strength-strong {
	color: #00CC66;
}

.password-match {
	margin-top: 20rpx;
	display: flex;
	align-items: center;
	opacity: 0;
	transform: translateY(10rpx);
}

.match-animate {
	animation: fadeInUp 0.5s forwards;
}

.match-icon {
	margin-right: 10rpx;
	color: #FF6666;
}

.match-icon.match {
	color: #00CC66;
}

.match-text {
	font-size: 26rpx;
	color: #FF6666;
}

.match-text.match {
	color: #00CC66;
}

.tips {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 40rpx;
	box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.05);
}

.tips-title {
	font-size: 30rpx;
	color: #333;
	margin-bottom: 20rpx;
	display: block;
	font-weight: 500;
}

.tips-list {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.tips-item {
	display: flex;
	align-items: center;
	font-size: 28rpx;
	color: #666;
	transition: all 0.3s;
}

.tips-valid {
	color: #00CC66;
}

.tips-icon {
	width: 40rpx;
	display: inline-block;
	color: inherit;
	transition: all 0.3s;
}

.submit-btn {
	width: 100%;
	height: 90rpx;
	line-height: 90rpx;
	background-color: #DDDDDD;
	color: #fff;
	font-size: 32rpx;
	border-radius: 45rpx;
	margin-bottom: 30rpx;
	transition: all 0.3s;
	position: relative;
	overflow: hidden;
}

.submit-btn.btn-active {
	background-color: #FF6699;
	box-shadow: 0 8rpx 20rpx rgba(255, 102, 153, 0.3);
	transform: translateY(-2rpx);
}

.submit-btn.btn-active:after {
	content: "";
	position: absolute;
	top: -50%;
	left: -50%;
	width: 200%;
	height: 200%;
	background: rgba(255, 255, 255, 0.1);
	transform: rotate(30deg);
	animation: shimmer 3s infinite linear;
}

.forgot-password {
	text-align: center;
	font-size: 28rpx;
	color: #FF6699;
	text-decoration: underline;
	padding: 10rpx;
	transition: all 0.3s;
}

.popup-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.6);
	z-index: 999;
	opacity: 0;
	animation: fadeIn 0.3s forwards;
}

.success-popup {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%) scale(0.9);
	z-index: 1000;
	width: 560rpx;
	animation: popIn 0.3s forwards;
}

.success-content {
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 50rpx 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.15);
}

.success-icon {
	width: 120rpx;
	height: 120rpx;
	background: linear-gradient(135deg, #FF6699, #FF9B82);
	color: #FFFFFF;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 70rpx;
	margin-bottom: 30rpx;
	position: relative;
	box-shadow: 0 10rpx 20rpx rgba(255, 102, 153, 0.3);
}

.check-mark {
	position: relative;
	animation: checkmark 0.5s ease-in-out 0.3s forwards;
	opacity: 0;
	transform: scale(0);
}

.success-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 15rpx;
}

.success-desc {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 40rpx;
}

.success-btn {
	width: 320rpx;
	height: 80rpx;
	line-height: 80rpx;
	background: linear-gradient(135deg, #FF6699, #FF9B82);
	color: #FFFFFF;
	font-size: 30rpx;
	border-radius: 40rpx;
	box-shadow: 0 8rpx 16rpx rgba(255, 102, 153, 0.3);
	transition: all 0.3s;
}

.success-btn:active {
	transform: scale(0.95);
}

/* 动画 */
@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(10rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes popIn {
	from {
		opacity: 0;
		transform: translate(-50%, -50%) scale(0.9);
	}
	to {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
	}
}

@keyframes shimmer {
	0% {
		transform: rotate(30deg) translateX(-100%);
	}
	100% {
		transform: rotate(30deg) translateX(100%);
	}
}

@keyframes checkmark {
	0% {
		opacity: 0;
		transform: scale(0);
	}
	50% {
		opacity: 1;
		transform: scale(1.2);
	}
	100% {
		opacity: 1;
		transform: scale(1);
	}
}

/* 图标字体 */
@font-face {
	font-family: "iconfont";
	src: url('data:font/woff2;charset=utf-8;base64,d09GMgABAAAAAAUwAAsAAAAACqAAAATiAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDXgqHeIZ1ATYCJAMcCxAABCAFhGcHXBskCRFVnM/Ifhy4sdOITd1RC4OD8QBseAqhxZQTni/82/r7Tmbn3ckzSTwkImk6iURoJDshRPJfSeA/19K+BBSTsTWwtrbFMlxluIqrMFQdVaSl5cW5dzy5NyUdT4EAeHje5urd9wQpk6MQoG3tPAQpcisC8q8xc1nhRJwX6BhXJvCmAgTAI78/1JNlkoDyY29znEPWILLhf3QvDNUnrZbaQvuB21Kbavr1ORGmEk2EJkL4JKZILBIhhEQoFGoldmZ0ShwmUC/fuLxbP3tMAMqoCTB4enIKKBw6KaD31PQEqJwoZA8UQeXyzOkZcAaKKndkXwZwav1+/IcsUYBk5kDf9fBoAobfqV97aHH94riWI4DhbmDbbhiwAGiQybzRIwg6vIAy9Ws6R4CGStkV+m59P/v99vs3vs71P5c27n+zUFQCshxDuZrwj+eAIgNIHLBUQEi5KnrY8U4gMPyu1+8YhNDvc3B4Mhk0fTI2OKd8QwTv1CJQDGADcgFZW04WpMILfcPdzTNxj5wP7S4IHImfm/fN35g/Mfbr5bvq+2SClwAJlYRQy8Y0S0JY0zSbNq9ZDMnGG5Nt8oZoVe2yYTm0NV4p2exbpXN9+/yz6rN33/RP1VZX0+RlK1asrBb1Jyuu2itXr5hOQzEzUV0/VbyaQvFaHFfTnMqrRQupWhQIUlz+Lk7t2FqBIXrm4cXyOoHB+KXFyB8FGufrF+DPU5N8qaBFTm6KfHZ6QdvYeRXNc1sk51U0zY1dMJvz44XlwpLM6JqZjvbTc/PzzDlMGFo+dXr7WrwgSJid0bbueGEJxVnz2xdlyYsnpuY1tlXVnFOHoYN8ybz5+dCGX71kJw/Fz7/mV4/++Y25+YL1+czTuTX9F0p1VPdSvf8mxXSUZ63aR5+Uvt4NXOVdDt+aZvXBzGnZXA65lDmsNzLIBpR9yUizH92ZQHrkhEa5BRpWbrj0hhQMvOEjKtv1QjNDXJjCUDCoaQdDCuFKO2lozN7QDc0KM6A6SsPAAoa6VBQRkbJFw0ZVDHTzRp2vFRGhVMvWBWNH4cP6nwljvJFjDp6zNVjS0K47Nnq/KmdCMzQHO3ZorP5rXFwT6wIZCVp13BRhfPwEvnD+Yhw/PnGqBpvBjbF9owN//DvQQnrFRDXZbmyC8e4eBxiSt9ZPG60uu75IWl7a9Xf5zcbGyuq2f4FMFPYW1r9h9E5hJpg5OJKVQVJQAbC/2OVOVM7vLsC+iXUfgPcP/wHAH4Xo3TvobhMKCo9ixgO8UhfNkbJvbDZJfeMv1ZBf8Icp9cQcU3OTKgoJsABqDI4Aa53/53AZyD4O3TgL5FFYBTKVcTCKClDBsoKksgyKenPWjWZkCBGUgDnOAYQeVyDpcQtZj1swim/Kyt1B0uMPlPWEpYV6xsAyZh7aqYaGDGfYLBwg7oZTa2ZIcsFBfUMzUTCMU7Q33GMCseO81G/sICpGWFCupxwARWQRPVmAIzRMaFQJezQu05Wm5EoPOHWe7WFGIAcwFRl4JXsB4ZzBqUNMIYlXrDn8DZKRJAxGE8qDsW/QmEAMvyVN+kYdEBRGMLkYL5cXA4DI8Mygj1gAG0gzIQNRWpBx0fhkRclRnwjQ+dKw+fJl/h8BtbE+wFqNARkKZGhQQWmNKsxFZkVfpI2FMhJe2CnDFTbLJD+qJVGm');
	font-weight: normal;
	font-style: normal;
}

.iconfont {
	font-family: "iconfont" !important;
	font-size: 16px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
</style>
