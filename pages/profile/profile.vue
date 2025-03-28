<template>
	<view class="container">
		<!-- 顶部背景和个人信息 -->
		<view class="profile-header">
			<image class="header-bg" src="/static/profile-bg.jpg" mode="aspectFill"></image>
			<view class="user-info">
				<view class="avatar-container">
					<image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
					<view class="edit-avatar" @tap="changeAvatar">
						<text class="iconfont edit-icon">&#xe607;</text>
					</view>
				</view>
				<view class="user-details">
					<view class="user-name-row">
						<text class="user-name">{{userInfo.username}}</text>
						<view class="gender-icon" :class="userInfo.gender === 'male' ? 'male' : 'female'">
							<text class="iconfont">{{userInfo.gender === 'male' ? '&#xe615;' : '&#xe614;'}}</text>
						</view>
					</view>
					<view class="user-id">ID: {{userInfo.userId}}</view>
					<view class="user-signature">{{userInfo.signature || '这个人很懒，什么都没留下'}}</view>
				</view>
				<view class="edit-profile" @tap="editProfile">
					<text class="edit-text">编辑资料</text>
				</view>
			</view>
		</view>

		<!-- 统计数据 -->
		<view class="stats-container">
			<view class="stat-item" @tap="navigateTo('/pages/profile/followers')">
				<text class="stat-number">{{userInfo.followers}}</text>
				<text class="stat-label">粉丝</text>
			</view>
			<view class="divider"></view>
			<view class="stat-item" @tap="navigateTo('/pages/profile/following')">
				<text class="stat-number">{{userInfo.following}}</text>
				<text class="stat-label">关注</text>
			</view>
			<view class="divider"></view>
			<view class="stat-item" @tap="navigateTo('/pages/profile/likes')">
				<text class="stat-number">{{userInfo.likes}}</text>
				<text class="stat-label">获赞</text>
			</view>
		</view>

		<!-- 功能菜单 -->
		<view class="menu-container">
			<view class="menu-section">
				<view class="menu-item" @tap="navigateTo('/pages/profile/collections')">
					<view class="menu-icon-container">
						<text class="iconfont menu-icon">&#xe606;</text>
					</view>
					<text class="menu-title">我的收藏</text>
					<text class="iconfont arrow-icon">&#xe603;</text>
				</view>
				<view class="menu-item" @tap="navigateTo('/pages/planner/planner')">
					<view class="menu-icon-container">
						<text class="iconfont menu-icon">&#xe608;</text>
					</view>
					<text class="menu-title">我的计划</text>
					<text class="iconfont arrow-icon">&#xe603;</text>
				</view>
				<view class="menu-item" @tap="navigateTo('/pages/profile/history')">
					<view class="menu-icon-container">
						<text class="iconfont menu-icon">&#xe610;</text>
					</view>
					<text class="menu-title">浏览历史</text>
					<text class="iconfont arrow-icon">&#xe603;</text>
				</view>
			</view>

			<view class="menu-section">
				<view class="menu-item" @tap="navigateTo('/pages/profile/wallet')">
					<view class="menu-icon-container">
						<text class="iconfont menu-icon">&#xe604;</text>
					</view>
					<text class="menu-title">我的钱包</text>
					<text class="iconfont arrow-icon">&#xe603;</text>
				</view>
				<view class="menu-item" @tap="navigateTo('/pages/profile/settings')">
					<view class="menu-icon-container">
						<text class="iconfont menu-icon">&#xe602;</text>
					</view>
					<text class="menu-title">设置</text>
					<text class="iconfont arrow-icon">&#xe603;</text>
				</view>
			</view>
		</view>

		<!-- 底部操作区 -->
		<view class="bottom-actions">
			<button class="logout-btn" @tap="logout">退出登录</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {
					username: '张三',
					userId: '10086',
					avatar: '/static/avatar.jpg',
					gender: 'male',
					signature: '热爱生活，享受音乐',
					followers: 128,
					following: 85,
					likes: 366
				}
			}
		},
		onLoad() {
			// 获取用户信息
			this.getUserInfo();
		},
		methods: {
			getUserInfo() {
				// 获取本地存储的用户信息
				const userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					this.userInfo = {
						...this.userInfo,
						...userInfo
					};
				}
			},
			changeAvatar() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						// 更新头像
						const tempFilePath = res.tempFilePaths[0];
						// 这里应该上传图片到服务器
						// 暂时使用本地临时路径
						this.userInfo.avatar = tempFilePath;

						uni.showToast({
							title: '头像更新成功',
							icon: 'success'
						});
					}
				});
			},
			editProfile() {
				// 编辑个人资料
				uni.navigateTo({
					url: '/pages/profile/edit'
				});
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url
				});
			},
			logout() {
				uni.showModal({
					title: '提示',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							// 清除登录状态
							uni.removeStorageSync('userInfo');
							uni.removeStorageSync('token');

							// 返回登录页面
							uni.reLaunch({
								url: '/pages/login/login'
							});
						}
					}
				});
			}
		}
	}
</script>

<style>
@font-face {
	font-family: "iconfont";
	src: url('data:font/woff2;charset=utf-8;base64,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');
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
	padding-bottom: 40rpx;
}

.profile-header {
	position: relative;
	height: 400rpx;
	width: 100%;
	overflow: hidden;
}

.header-bg {
	width: 100%;
	height: 100%;
	filter: brightness(0.8);
}

.user-info {
	position: absolute;
	bottom: 30rpx;
	left: 0;
	right: 0;
	padding: 0 30rpx;
	display: flex;
	flex-direction: row;
	align-items: flex-end;
}

.avatar-container {
	position: relative;
	width: 150rpx;
	height: 150rpx;
	border-radius: 75rpx;
	border: 4rpx solid #FFFFFF;
	overflow: hidden;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.2);
	margin-right: 20rpx;
}

.avatar {
	width: 100%;
	height: 100%;
}

.edit-avatar {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 50rpx;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
}

.edit-icon {
	color: #FFFFFF;
	font-size: 28rpx;
}

.user-details {
	flex: 1;
}

.user-name-row {
	display: flex;
	align-items: center;
}

.user-name {
	font-size: 36rpx;
	font-weight: bold;
	color: #FFFFFF;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
	margin-right: 10rpx;
}

.gender-icon {
	width: 40rpx;
	height: 40rpx;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.male {
	background-color: #5096FF;
}

.female {
	background-color: #FF6699;
}

.gender-icon .iconfont {
	color: #FFFFFF;
	font-size: 24rpx;
}

.user-id {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
	margin: 6rpx 0;
}

.user-signature {
	font-size: 26rpx;
	color: #FFFFFF;
	margin-top: 10rpx;
	line-height: 1.4;
	max-width: 400rpx;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.edit-profile {
	padding: 10rpx 24rpx;
	background-color: rgba(255, 255, 255, 0.3);
	border-radius: 30rpx;
	align-self: flex-start;
	margin-top: 10rpx;
}

.edit-text {
	font-size: 24rpx;
	color: #FFFFFF;
}

.stats-container {
	display: flex;
	flex-direction: row;
	background-color: #FFFFFF;
	margin: 20rpx 30rpx;
	border-radius: 12rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
	padding: 20rpx 0;
}

.stat-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 10rpx 0;
}

.stat-number {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 4rpx;
}

.stat-label {
	font-size: 24rpx;
	color: #999;
}

.divider {
	width: 1px;
	background-color: #EEEEEE;
	margin: 10rpx 0;
}

.menu-container {
	padding: 0 30rpx;
}

.menu-section {
	background-color: #FFFFFF;
	border-radius: 12rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
	margin-bottom: 20rpx;
	overflow: hidden;
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1px solid #F5F5F5;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-icon-container {
	width: 60rpx;
	height: 60rpx;
	background-color: #F8F8F8;
	border-radius: 30rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
}

.menu-icon {
	font-size: 36rpx;
	color: #FF6699;
}

.menu-title {
	flex: 1;
	font-size: 30rpx;
	color: #333;
}

.arrow-icon {
	font-size: 30rpx;
	color: #CCCCCC;
}

.bottom-actions {
	padding: 40rpx 30rpx 0;
}

.logout-btn {
	width: 100%;
	height: 90rpx;
	background-color: #FFFFFF;
	color: #FF6699;
	font-size: 32rpx;
	font-weight: 500;
	border-radius: 45rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px solid #FF6699;
}
</style>