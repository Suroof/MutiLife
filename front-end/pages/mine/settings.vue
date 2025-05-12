<template>
	<view class="container">
		<view class="settings-container">
			<!-- 账号安全 -->
			<view class="settings-section">
				<view class="section-title">账号安全</view>
				<view class="settings-list">
					<view class="settings-item" @tap="navigateTo('/pages/profile/change-password')">
						<text class="settings-label">修改密码</text>
						<view class="settings-right">
							<text class="iconfont arrow-icon">&#xe603;</text>
						</view>
					</view>
					<view class="settings-item" @tap="navigateTo('/pages/profile/phone-bind')">
						<text class="settings-label">手机绑定</text>
						<view class="settings-right">
							<text class="settings-value">已绑定</text>
							<text class="iconfont arrow-icon">&#xe603;</text>
						</view>
					</view>
					<view class="settings-item" @tap="navigateTo('/pages/profile/account-security')">
						<text class="settings-label">账号安全</text>
						<view class="settings-right">
							<text class="iconfont arrow-icon">&#xe603;</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 通知设置 -->
			<view class="settings-section">
				<view class="section-title">通知设置</view>
				<view class="settings-list">
					<view class="settings-item">
						<text class="settings-label">新消息通知</text>
						<switch :checked="notificationSettings.messages" @change="toggleSetting('messages')" color="#FF6699" />
					</view>
					<view class="settings-item">
						<text class="settings-label">社交活动通知</text>
						<switch :checked="notificationSettings.social" @change="toggleSetting('social')" color="#FF6699" />
					</view>
					<view class="settings-item">
						<text class="settings-label">系统通知</text>
						<switch :checked="notificationSettings.system" @change="toggleSetting('system')" color="#FF6699" />
					</view>
				</view>
			</view>

			<!-- 通用设置 -->
			<view class="settings-section">
				<view class="section-title">通用设置</view>
				<view class="settings-list">
					<view class="settings-item" @tap="showThemeSelector">
						<text class="settings-label">主题颜色</text>
						<view class="settings-right">
							<view class="color-preview" :style="{backgroundColor: appTheme}"></view>
							<text class="iconfont arrow-icon">&#xe603;</text>
						</view>
					</view>
					<view class="settings-item" @tap="showFontSizeSelector">
						<text class="settings-label">字体大小</text>
						<view class="settings-right">
							<text class="settings-value">{{fontSizes[currentFontSize]}}</text>
							<text class="iconfont arrow-icon">&#xe603;</text>
						</view>
					</view>
					<view class="settings-item">
						<text class="settings-label">深色模式</text>
						<switch :checked="isDarkMode" @change="toggleDarkMode" color="#FF6699" />
					</view>
				</view>
			</view>

			<!-- 隐私设置 -->
			<view class="settings-section">
				<view class="section-title">隐私设置</view>
				<view class="settings-list">
					<view class="settings-item" @tap="navigateTo('/pages/profile/privacy')">
						<text class="settings-label">隐私管理</text>
						<view class="settings-right">
							<text class="iconfont arrow-icon">&#xe603;</text>
						</view>
					</view>
					<view class="settings-item">
						<text class="settings-label">允许陌生人查看我的资料</text>
						<switch :checked="privacySettings.allowProfileView" @change="togglePrivacy('allowProfileView')" color="#FF6699" />
					</view>
				</view>
			</view>

			<!-- 关于与帮助 -->
			<view class="settings-section">
				<view class="section-title">关于与帮助</view>
				<view class="settings-list">
					<view class="settings-item" @tap="navigateTo('/pages/profile/about')">
						<text class="settings-label">关于我们</text>
						<view class="settings-right">
							<text class="iconfont arrow-icon">&#xe603;</text>
						</view>
					</view>
					<view class="settings-item" @tap="navigateTo('/pages/profile/help')">
						<text class="settings-label">帮助中心</text>
						<view class="settings-right">
							<text class="iconfont arrow-icon">&#xe603;</text>
						</view>
					</view>
					<view class="settings-item" @tap="navigateTo('/pages/profile/feedback')">
						<text class="settings-label">意见反馈</text>
						<view class="settings-right">
							<text class="iconfont arrow-icon">&#xe603;</text>
						</view>
					</view>
					<view class="settings-item" @tap="checkUpdate">
						<text class="settings-label">检查更新</text>
						<view class="settings-right">
							<text class="settings-value">v1.0.0</text>
							<text class="iconfont arrow-icon">&#xe603;</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 清除缓存 -->
			<view class="settings-section">
				<view class="settings-list">
					<view class="settings-item" @tap="clearCache">
						<text class="settings-label">清除缓存</text>
						<view class="settings-right">
							<text class="settings-value">{{cacheSize}}MB</text>
							<text class="iconfont arrow-icon">&#xe603;</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 主题选择器弹窗 -->
		<view class="popup-mask" v-if="showThemePopup" @tap="closePopups"></view>
		<view class="popup-content" v-if="showThemePopup">
			<view class="popup-header">
				<text class="popup-title">选择主题色</text>
				<text class="iconfont close-icon" @tap="closePopups">&#xe600;</text>
			</view>
			<view class="theme-selector">
				<view
					class="theme-item"
					v-for="(color, index) in themeColors"
					:key="index"
					:style="{backgroundColor: color}"
					@tap="selectTheme(color)"
				>
					<text class="iconfont check-icon" v-if="appTheme === color">&#xe601;</text>
				</view>
			</view>
		</view>

		<!-- 字体大小选择器弹窗 -->
		<view class="popup-mask" v-if="showFontPopup" @tap="closePopups"></view>
		<view class="popup-content" v-if="showFontPopup">
			<view class="popup-header">
				<text class="popup-title">选择字体大小</text>
				<text class="iconfont close-icon" @tap="closePopups">&#xe600;</text>
			</view>
			<view class="font-selector">
				<view
					class="font-item"
					v-for="(size, index) in fontSizes"
					:key="index"
					:class="{'selected-font': currentFontSize === index}"
					@tap="selectFontSize(index)"
				>
					<text :style="{fontSize: 26 + index * 2 + 'rpx'}">{{size}}</text>
					<text class="iconfont check-icon" v-if="currentFontSize === index">&#xe601;</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 通知设置
				notificationSettings: {
					messages: true,
					social: true,
					system: true
				},

				// 隐私设置
				privacySettings: {
					allowProfileView: true,
					allowFriendRequest: true,
					showOnlineStatus: true
				},

				// 主题设置
				appTheme: '#FF6699', // 应用默认主题色
				showThemePopup: false,
				themeColors: [
					'#FF6699', '#5096FF', '#42CF94', '#FF9650', '#9D7FFF', '#FF5252'
				],

				// 字体设置
				currentFontSize: 1, // 默认中号字体
				showFontPopup: false,
				fontSizes: ['小', '中', '大', '特大'],

				// 深色模式
				isDarkMode: false,

				// 缓存大小
				cacheSize: '12.5'
			}
		},
		onLoad() {
			// 从本地存储加载设置
			this.loadSettings();
		},
		methods: {
			// 加载设置
			loadSettings() {
				const settings = uni.getStorageSync('app_settings');
				if (settings) {
					// 加载通知设置
					if (settings.notification) {
						this.notificationSettings = settings.notification;
					}

					// 加载隐私设置
					if (settings.privacy) {
						this.privacySettings = settings.privacy;
					}

					// 加载主题设置
					if (settings.theme) {
						this.appTheme = settings.theme;
					}

					// 加载字体大小设置
					if (settings.fontSize !== undefined) {
						this.currentFontSize = settings.fontSize;
					}

					// 加载深色模式设置
					if (settings.darkMode !== undefined) {
						this.isDarkMode = settings.darkMode;
					}
				}
			},

			// 保存设置
			saveSettings() {
				const settings = {
					notification: this.notificationSettings,
					privacy: this.privacySettings,
					theme: this.appTheme,
					fontSize: this.currentFontSize,
					darkMode: this.isDarkMode
				};

				uni.setStorageSync('app_settings', settings);

				// 通知应用更新主题
				getApp().globalData.themeColor = this.appTheme;
			},

			// 切换通知设置
			toggleSetting(type) {
				this.notificationSettings[type] = !this.notificationSettings[type];
				this.saveSettings();
			},

			// 切换隐私设置
			togglePrivacy(type) {
				this.privacySettings[type] = !this.privacySettings[type];
				this.saveSettings();
			},

			// 切换深色模式
			toggleDarkMode(e) {
				this.isDarkMode = e.detail.value;
				this.saveSettings();
				// 应用深色模式
				// 更复杂的实现需要在App.vue中对整体样式进行切换
			},

			// 显示主题选择器
			showThemeSelector() {
				this.showThemePopup = true;
			},

			// 显示字体大小选择器
			showFontSizeSelector() {
				this.showFontPopup = true;
			},

			// 关闭所有弹窗
			closePopups() {
				this.showThemePopup = false;
				this.showFontPopup = false;
			},

			// 选择主题色
			selectTheme(color) {
				this.appTheme = color;
				this.saveSettings();
				this.closePopups();
			},

			// 选择字体大小
			selectFontSize(index) {
				this.currentFontSize = index;
				this.saveSettings();
				this.closePopups();
			},

			// 检查更新
			checkUpdate() {
				uni.showLoading({
					title: '检查中...'
				});

				setTimeout(() => {
					uni.hideLoading();
					uni.showToast({
						title: '已是最新版本',
						icon: 'success'
					});
				}, 1500);
			},

			// 清除缓存
			clearCache() {
				uni.showModal({
					title: '提示',
					content: '确定要清除缓存吗？',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '清除中...'
							});

							setTimeout(() => {
								uni.hideLoading();
								this.cacheSize = '0.0';
								uni.showToast({
									title: '清除成功',
									icon: 'success'
								});
							}, 1500);
						}
					}
				});
			},

			// 页面导航
			navigateTo(url) {
				uni.navigateTo({
					url: url
				});
			}
		}
	}
</script>

<style>
@font-face {
	font-family: "iconfont";
	src: url('data:font/woff2;charset=utf-8;base64,d09GMgABAAAAAAR8AAsAAAAACPAAAAQvAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDMgqFBIRVATYCJAMUCwwABCAFhGcHShtSB8gOJUHBwAAAAAHxEA+f+v3aO/NmZvfbiIFEokk0TZZIJCKRSELRKoVC0q3M/F/2zL+1JJUQtS2pSFAqzYJi81TQyUMhb6GzOvcg3MLtJvcAUJUKHaqQoQ9VKQuxasQO7MwO7P//bjV/YL7YvIvLNS86wDiggOKaFUgCOZAC0YK4hWe9TqDbhJn0zuquB0alISsQl83EEIylpJSshrahVbQt1GKyaKC1zZ70BOApfn38gy0YSZMZOXPtyToa5n8/fPG0/79WaC6A158Z2CwyrgOFuG61nLODl69jdKd1D7cb0NZKmt+Pz3/x9P//M5LDiObEzX88siiyQqKhkdUR3UM9aeX3g7SCBCsy5Mj5DcvBXzEBfkMFxGnAN4QEK34B6vguDJatyayBdj+9WmWDnEg8wR0Gn9qtBfF4Mm5Kp5ORjx/nPHpkeviw7NGj3MePCx4/Lrxz58MhV3+tWY+f3P0QTz5/VfTi5yxcNixd8nz2+dj0TLQOmkc3Lp81LuPc7/Pm/Z47+/fc8MuT/2NHztkQUZGRwwkh/VZnvT7m8ujcjTPvbXk2a2PkytmP5+6oPn9/dPG+asPpbz7oOz/X5nnfAoIZYfMIglk45Hkm/aNTwLdvkZGJ/dCBV18Q91djPTl54D6G6OvD3/zn1Tpr//lVT0+cQYuYqL7A4PbwcCdvhLs78fRERpIH5rSfjI0/Oic9s8u/KP7J4c5Hjw7dCn68mHjM6UUlV24k9VhCjRVeChYG+Fj3Gl9ejwuvD7uFRnHBvSKXRmyFhrk6f3rXZTJ3+0PaYaVwZLK72xnx1m3YsAXSO7ZicxG+SAdV0I16uVJXp0NWdyg54xvvGdxkuT4NwCfjLeBjSCiAD4UEgA9aKnOvNcO+o/6X/OPYP/2JR3++Mf3u/7G5HH+TaR/gX+l2sfr+RalIEJNgipNqlIlbSFWxVPWUafaokgZNPH2qukF3xELUbliOpJ2DrLWKLNzr0OjRj1Zrgt1uY2TrjnERcB1iBGHcFiQj3kI27j2ycL9A48xfaI3HgG53kez2WAzNxiwDkUIdcg8alZ1MrVVN8jPUHxdj7sST8QXKKgUcE9EV4oScoK+5EosYZFjQMW5CEARxXMZaYUrsGVmWnJh1nFbJhLKqp9KQJUMhA4hIQTqI9UBGiR0ZNatSk74/g7QPS2LcEd+LL0CxFAUwjC/mCmIJeQR61Vo1IaMUgRbQLMYZIRAQCA5DYTVB19FniBmLnKCZYXR7pYRCWZTVUH1N5fYrMt2RZ9RRVPiKxREpSI3zYdQPbj6gqyA+HgAAAA==');
}

.iconfont {
	font-family: "iconfont" !important;
	font-size: 24px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.container {
	padding: 0;
	background-color: #F8F8F8;
	min-height: 100vh;
}

.settings-container {
	padding: 20rpx 0;
}

.settings-section {
	margin-bottom: 20rpx;
}

.section-title {
	padding: 20rpx 30rpx;
	font-size: 28rpx;
	color: #999;
}

.settings-list {
	background-color: #FFFFFF;
}

.settings-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1px solid #F5F5F5;
}

.settings-item:last-child {
	border-bottom: none;
}

.settings-label {
	font-size: 30rpx;
	color: #333;
}

.settings-right {
	display: flex;
	align-items: center;
}

.settings-value {
	font-size: 28rpx;
	color: #999;
	margin-right: 10rpx;
}

.arrow-icon {
	font-size: 30rpx;
	color: #CCCCCC;
}

.color-preview {
	width: 40rpx;
	height: 40rpx;
	border-radius: 20rpx;
	margin-right: 10rpx;
}

/* 弹窗样式 */
.popup-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 100;
}

.popup-content {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #FFFFFF;
	border-radius: 20rpx 20rpx 0 0;
	padding: 30rpx;
	z-index: 101;
	animation: slide-up 0.3s ease;
}

@keyframes slide-up {
	from {
		transform: translateY(100%);
	}
	to {
		transform: translateY(0);
	}
}

.popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.close-icon {
	font-size: 36rpx;
	color: #999;
}

/* 主题选择器 */
.theme-selector {
	display: flex;
	flex-wrap: wrap;
	padding: 20rpx 0 40rpx;
}

.theme-item {
	width: 80rpx;
	height: 80rpx;
	border-radius: 40rpx;
	margin: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.check-icon {
	color: #FFFFFF;
	font-size: 40rpx;
}

/* 字体大小选择器 */
.font-selector {
	padding: 20rpx 0 40rpx;
}

.font-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1px solid #F5F5F5;
}

.font-item:last-child {
	border-bottom: none;
}

.selected-font {
	background-color: #f0f0f0;
}
</style>