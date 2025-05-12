<template>
	<view class="container">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @tap="goBack">
				<text class="iconfont back-icon">&#xe602;</text>
			</view>
			<view class="nav-title">
				<text>好友请求</text>
			</view>
			<view class="nav-right">
				<!-- 占位 -->
			</view>
		</view>

		<!-- 顶部切换 -->
		<view class="tab-header">
			<view
				class="tab-item"
				:class="{ active: activeTab === 0 }"
				@tap="switchTab(0)"
			>
				<text>收到的请求</text>
				<view class="tab-badge" v-if="receivedRequests.length > 0">{{receivedRequests.length}}</view>
			</view>
			<view
				class="tab-item"
				:class="{ active: activeTab === 1 }"
				@tap="switchTab(1)"
			>
				<text>发出的请求</text>
			</view>
		</view>

		<!-- 收到的请求 -->
		<view class="request-list" v-if="activeTab === 0">
			<view v-if="receivedRequests.length === 0" class="empty-tip">
				<image src="/static/images/empty-state.png" mode="aspectFit" class="empty-image"></image>
				<text class="empty-text">暂无收到的好友请求</text>
			</view>

			<view v-else class="request-items">
				<view class="request-item" v-for="(item, index) in receivedRequests" :key="index">
					<view class="user-info" @tap="viewProfile(item)">
						<image class="avatar" :src="item.avatar" mode="aspectFill"></image>
						<view class="user-details">
							<text class="nickname">{{item.nickname}}</text>
							<view class="request-source">
								<text class="source-label">{{getSourceText(item.source)}}</text>
								<text class="time">{{item.time}}</text>
							</view>
							<text class="greeting" v-if="item.message">{{item.message}}</text>
						</view>
					</view>

					<view class="action-buttons">
						<button
							class="action-btn reject-btn"
							hover-class="btn-hover"
							@tap="rejectRequest(item, index)"
						>拒绝</button>
						<button
							class="action-btn accept-btn"
							hover-class="btn-hover"
							@tap="acceptRequest(item, index)"
						>接受</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 发出的请求 -->
		<view class="request-list" v-if="activeTab === 1">
			<view v-if="sentRequests.length === 0" class="empty-tip">
				<image src="/static/images/empty-state.png" mode="aspectFit" class="empty-image"></image>
				<text class="empty-text">暂无发出的好友请求</text>
			</view>

			<view v-else class="request-items">
				<view class="request-item" v-for="(item, index) in sentRequests" :key="index">
					<view class="user-info" @tap="viewProfile(item)">
						<image class="avatar" :src="item.avatar" mode="aspectFill"></image>
						<view class="user-details">
							<text class="nickname">{{item.nickname}}</text>
							<view class="request-source">
								<text class="source-label">{{getSourceText(item.source)}}</text>
								<text class="time">{{item.time}}</text>
							</view>
							<text class="greeting" v-if="item.message">发送：{{item.message}}</text>
						</view>
					</view>

					<view class="action-buttons">
						<text class="status-text" v-if="item.status === 'pending'">等待验证</text>
						<text class="status-text success" v-else-if="item.status === 'accepted'">已添加</text>
						<text class="status-text rejected" v-else-if="item.status === 'rejected'">已拒绝</text>
						<button
							class="action-btn cancel-btn"
							hover-class="btn-hover"
							@tap="cancelRequest(item, index)"
							v-if="item.status === 'pending'"
						>取消</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="add-friend-btn" @tap="addNewFriend">
			<text class="iconfont add-icon">&#xe61c;</text>
			<text class="add-text">添加好友</text>
		</view>
		<view class="bottom-btns">
			<view class="bottom-btn" @tap="goToChat">
				<text class="iconfont chat-icon">&#xe61d;</text>
				<text class="btn-text">聊天</text>
			</view>
			<view class="bottom-btn" @tap="goToMoments">
				<text class="iconfont moments-icon">&#xe61e;</text>
				<text class="btn-text">朋友圈</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { getFriendRequests, acceptFriendRequest, rejectFriendRequest } from '@/services/api/friend.js';
	import moment from 'moment';

	export default {
		data() {
			return {
				activeTab: 0, // 0: 收到的请求, 1: 发出的请求
				loading: false,
				refreshing: false,
				receivedRequests: [],
				sentRequests: [],
				error: null
			};
		},
		onLoad() {
			this.loadFriendRequests();
		},
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},

			// 切换标签
			switchTab(index) {
				this.activeTab = index;
				// 首次切换到发出的请求标签时加载数据
				if (index === 1 && this.sentRequests.length === 0) {
					// 这里可以添加加载发出请求的API
				}
			},

			// 加载好友请求
			async loadFriendRequests() {
				this.loading = true;
				this.error = null;

				try {
					const response = await getFriendRequests();

					if (response && response.requests) {
						// 处理请求数据，添加格式化的时间
						this.receivedRequests = response.requests.map(request => {
							const createdTime = moment(request.createdAt);
							return {
								id: request._id,
								userId: request.sender._id,
								nickname: request.sender.name || request.sender.username,
								avatar: request.sender.avatar || '/static/images/avatar/default.jpg',
								message: request.message,
								source: 'search', // 默认来源
								time: createdTime.fromNow(), // 相对时间
								createdAt: request.createdAt
							};
						});
					}
				} catch (error) {
					console.error('加载好友请求失败:', error);
					this.error = '加载失败，请检查网络连接';

					uni.showToast({
						title: '加载失败，请稍后重试',
						icon: 'none'
					});
				} finally {
					this.loading = false;
					this.refreshing = false;
				}
			},

			// 下拉刷新
			onRefresh() {
				this.refreshing = true;
				this.loadFriendRequests();
			},

			// 获取来源描述
			getSourceText(source) {
				const sourceMap = {
					'search': '搜索添加',
					'nearby': '附近的人',
					'recommend': '可能认识的人',
					'moments': '朋友圈',
					'qrcode': '扫码添加',
					'group': '群聊中添加'
				};

				return sourceMap[source] || '未知来源';
			},

			// 查看用户资料
			viewProfile(user) {
				uni.navigateTo({
					url: `/pages/social/friend-profile?id=${user.userId}`
				});
			},

			// 接受好友请求
			async acceptRequest(request, index) {
				try {
					uni.showLoading({
						title: '处理中...'
					});

					const response = await acceptFriendRequest(request.id);

					if (response && response.success) {
						// 从列表中移除此请求
						this.receivedRequests.splice(index, 1);

						uni.showToast({
							title: '已添加好友',
							icon: 'success'
						});
					}
				} catch (error) {
					console.error('接受好友请求失败:', error);
					uni.showToast({
						title: '添加失败，请稍后重试',
						icon: 'none'
					});
				} finally {
					uni.hideLoading();
				}
			},

			// 拒绝好友请求
			async rejectRequest(request, index) {
				try {
					uni.showLoading({
						title: '处理中...'
					});

					const response = await rejectFriendRequest(request.id);

					if (response && response.success) {
						// 从列表中移除此请求
						this.receivedRequests.splice(index, 1);

						uni.showToast({
							title: '已拒绝请求',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('拒绝好友请求失败:', error);
					uni.showToast({
						title: '操作失败，请稍后重试',
						icon: 'none'
					});
				} finally {
					uni.hideLoading();
				}
			},

			// 取消发送的好友请求
			cancelRequest(request, index) {
				uni.showModal({
					title: '取消请求',
					content: `确定取消向 ${request.nickname} 发送的好友请求吗？`,
					success: (res) => {
						if (res.confirm) {
							// 模拟取消请求
							this.sentRequests.splice(index, 1);
							uni.showToast({
								title: '已取消请求',
								icon: 'none'
							});
						}
					}
				});
			},

			// 添加新好友
			addNewFriend() {
				uni.showActionSheet({
					itemList: ['搜索添加', '扫一扫', '附近的人', '面对面添加'],
					success: (res) => {
						switch(res.tapIndex) {
							case 0:
								// 搜索添加
								uni.navigateTo({
									url: '/pages/social/friend-search'
								});
								break;
							case 1:
								// 扫一扫
								uni.scanCode({
									success: (res) => {
										// 处理扫码结果
										uni.showToast({
											title: '扫码成功: ' + res.result,
											icon: 'none'
										});
									}
								});
								break;
							case 2:
								// 附近的人
								uni.navigateTo({
									url: '/pages/social/nearby'
								});
								break;
							case 3:
								// 面对面添加
								uni.navigateTo({
									url: '/pages/social/face-to-face'
								});
								break;
						}
					}
				});
			},

			// 导航到聊天页面
			goToChat() {
				uni.navigateTo({
					url: '/pages/social/chat'
				});
			},

			// 导航到朋友圈
			goToMoments() {
				uni.navigateTo({
					url: '/pages/social/moments'
				});
			}
		}
	}
</script>

<style>
@font-face {
	font-family: "iconfont";
	src: url('data:font/woff2;charset=utf-8;base64,d09GMgABAAAAAAQEAAsAAAAACHQAAAO3AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDHAqELINSATYCJAMQCwoABCAFhGcHRhtfB8gekiSQQAEFABQUyoE8PI/9+H3OzLz/EHuX0KhaqpJoJBohQSVUIoTGYmEm7Ybs/+G53SfQSdQYuF7FZlHBytDOG+yUzMLww98dO5PMbDYTJmxSfJsLVKCiEuqhc9n8f/2LnwVt/5dj1kvnA5trUC51AUYDDqjXjEIKXSCfYHgNL+pgAgP7TKF5fGKWgL6stQnQXGYzAfpZGKWAvnCuMmCg1a5kYQ0drdXV5RFgrXp/+Yd80CdRaWyLU7MjE+D1y28o6v+PQpcdCHU6B7RNaKAPkMG8Um8GvQr6PGjgfUanFmDgPyX6Vfnt2G+C/o+JWFQNGNilP3hEkVQkGtumBczD52s32K88IvGr4IjCr+KjDN8QVALp77oAA+gDvASSqv5i8mJ43kWapgS1Vlba0Y6LreWJ6JVkzVq/aGy0hZo1LqwHyV6tn7UlVmdtjdbZO2PNxo1edXP9ej9fXL3WH12zwS+2uvoF1KoN/sKqNf6+yLoBtpXR6EzCGb87w6W48+7Ow5Gek1lp8tsvPPjkNBu7h/lHnCG/j04/yzz0YnVxgZ0TzLBTxq4zTW3OMy2yXKojJK8D8sKgbPDahY1vOhq5OLkS29jLJnKxlzzMxF5yIMde8PGM3IYN8DwPc3E7VsNzFMtpIUgObqHzc3JwNQ9zcBWWIr6A2NkQ5/gWgsZ4a9aaKrN6JvEKDAAKx44l1vK2jrJsvJrR1VVVV3H4JMa6yMh4e/KqPV+4jMt3QFrWGEn5f/9+oYLK/9ev0+4zBFUIa3xg5vvvqvJ4ILx1UcVE0fXrl6j6OJwMzPKB5yZLbv4PwMIf+vK5qKNyR8QALPx/qKsC6mLGwNdlX5EvkFbmraSrDlTuL9BWUdgD6L/ZFfKN/A5N4avXGwn/NRbxN768H1W2KsLrL0phBBhYRYP9Z5kNYFAfRr6o2fmPFFUHRFFjh6GSdkKt0QcZex+qQVtojV1gMFeyvW2IGgQZ3gP2bAMIe94g2fESaj0/kLEPUY36D621h8HAWTuzbdgGpYUY0CMcMdFDpZRKoQsN5BnGbrtBsQwLZQltI+pE4LBgMYYWUWVpLWKUQXRFOGJ0wAjDEFdTplJRymA4KhWxKZiGoXSrC3BEZ+UQjpXBY2JAmkAw0EMohKEeSEkRFQV1QQPSr5yx1hYokYXFB1hC9CNkCgIOWshYEq2vktWXWogmBqJLBI4w6sBQGOA0aGSl1KFoGBSHElUhZLzrUJTUVjkFXF+hPeIV2Md+ICmiiiZW8lSP5W48VXGKsVQfJpZ5eAAA');
	font-weight: normal;
	font-style: normal;
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
	background-color: #F5F5F5;
	min-height: 100vh;
}

/* 导航栏 */
.nav-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 90rpx;
	background-color: #FFFFFF;
	padding: 0 20rpx;
}

.nav-left, .nav-right {
	width: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-icon {
	font-size: 44rpx;
	color: #333333;
}

.nav-title {
	flex: 1;
	text-align: center;
}

.nav-title text {
	font-size: 34rpx;
	color: #333333;
	font-weight: 500;
}

/* 标签切换 */
.tab-header {
	display: flex;
	justify-content: space-around;
	background-color: #FFFFFF;
	border-bottom: 1rpx solid #EEEEEE;
}

.tab-item {
	flex: 1;
	height: 90rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	font-size: 30rpx;
	color: #666666;
}

.tab-item.active {
	color: #FF6699;
	font-weight: 500;
}

.tab-item.active::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 60rpx;
	height: 6rpx;
	background-color: #FF6699;
	border-radius: 3rpx;
}

.tab-badge {
	min-width: 32rpx;
	height: 32rpx;
	border-radius: 16rpx;
	background-color: #FF6699;
	color: #FFFFFF;
	font-size: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 18rpx;
	margin-left: 110rpx;
	padding: 0 6rpx;
}

/* 请求列表 */
.request-list {
	flex: 1;
}

.empty-tip {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 100rpx 0;
}

.empty-image {
	width: 300rpx;
	height: 300rpx;
	margin-bottom: 30rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #999999;
}

.request-items {
	padding: 0 20rpx;
}

.request-item {
	background-color: #FFFFFF;
	border-radius: 12rpx;
	padding: 30rpx;
	margin-top: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.user-info {
	display: flex;
	margin-bottom: 20rpx;
}

.avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	margin-right: 20rpx;
}

.user-details {
	flex: 1;
}

.nickname {
	font-size: 32rpx;
	font-weight: 500;
	color: #333333;
	margin-bottom: 8rpx;
	display: block;
}

.request-source {
	display: flex;
	align-items: center;
	margin-bottom: 12rpx;
}

.source-label {
	font-size: 24rpx;
	color: #999999;
}

.time {
	font-size: 24rpx;
	color: #999999;
	margin-left: 10rpx;
}

.greeting {
	font-size: 28rpx;
	color: #666666;
	line-height: 1.4;
	display: block;
	background-color: #F8F8F8;
	padding: 16rpx;
	border-radius: 8rpx;
}

.action-buttons {
	display: flex;
	justify-content: flex-end;
	align-items: center;
}

.action-btn {
	min-width: 140rpx;
	height: 70rpx;
	line-height: 70rpx;
	text-align: center;
	font-size: 28rpx;
	border-radius: 35rpx;
	margin-left: 20rpx;
}

.reject-btn {
	background-color: #FFFFFF;
	color: #666666;
	border: 1rpx solid #DDDDDD;
}

.accept-btn {
	background-color: #FF6699;
	color: #FFFFFF;
	border: none;
}

.cancel-btn {
	background-color: #FFFFFF;
	color: #666666;
	border: 1rpx solid #DDDDDD;
}

.btn-hover {
	opacity: 0.8;
}

.status-text {
	font-size: 28rpx;
	color: #999999;
}

.status-text.success {
	color: #52C41A;
}

.status-text.rejected {
	color: #FF5252;
}

/* 底部添加好友按钮 */
.add-friend-btn {
	position: fixed;
	bottom: calc(60rpx + env(safe-area-inset-bottom));
	right: 40rpx;
	width: 220rpx;
	height: 80rpx;
	background-color: #FF6699;
	border-radius: 40rpx;
	color: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 16rpx rgba(255, 102, 153, 0.3);
}

.add-icon {
	font-size: 36rpx;
	margin-right: 10rpx;
}

.add-text {
	font-size: 28rpx;
}

.bottom-btns {
	position: fixed;
	bottom: calc(60rpx + env(safe-area-inset-bottom));
	left: 0;
	right: 0;
	height: 100rpx;
	background-color: #FFFFFF;
	border-top: 1rpx solid #EEEEEE;
	display: flex;
	align-items: center;
	justify-content: space-around;
	padding: 0 40rpx;
}

.bottom-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.chat-icon, .moments-icon {
	font-size: 40rpx;
	margin-bottom: 10rpx;
}

.btn-text {
	font-size: 24rpx;
	color: #666666;
}
</style>