<template>
	<view class="container">
		<!-- 顶部搜索 -->
		<view class="search-container">
			<view class="search-box" @tap="goToFriendSearch">
				<text class="iconfont search-icon">🔍</text>
				<input type="text" class="search-input" placeholder="搜索好友" disabled />
			</view>
			<view class="filter-btn" @tap="showSocialFeatures">
				<text class="iconfont filter-icon">•</text>
			</view>
		</view>

		<!-- 功能快捷入口 -->
		<view class="features-section" v-if="showFeatures">
			<view class="features-grid">
				<view class="feature-item" @tap="goToChat">
					<view class="feature-icon">💬</view>
					<text class="feature-text">聊天列表</text>
				</view>
				<view class="feature-item" @tap="goToGroupChat">
					<view class="feature-icon">👥</view>
					<text class="feature-text">群聊</text>
				</view>
				<view class="feature-item" @tap="goToMoments">
					<view class="feature-icon">📱</view>
					<text class="feature-text">朋友圈</text>
				</view>
				<view class="feature-item" @tap="goToNearby">
					<view class="feature-icon">📍</view>
					<text class="feature-text">附近的人</text>
				</view>
				<view class="feature-item" @tap="goToFriendRequests">
					<view class="feature-icon">👋</view>
					<text class="feature-text">好友请求</text>
				</view>
				<view class="feature-item" @tap="goToFriendSearch">
					<view class="feature-icon">🔍</view>
					<text class="feature-text">查找好友</text>
				</view>
			</view>
		</view>

		<!-- 推荐好友 -->
		<view class="section">
			<view class=".section-recommended">
				<text class="section-title">推荐好友</text>
				<text class="view-all" @tap="goToFriendSearch">查看更多</text>
			</view>

			<scroll-view class="scroll-view-x" scroll-x="true" show-scrollbar="false">
				<view class="friend-item" v-for="(item, index) in recommendFriends" :key="index" @tap="viewProfile(item)">
					<image class="friend-avatar" :src="item.avatar" mode="aspectFill"></image>
					<text class="friend-name">{{item.name}}</text>
					<text class="friend-info">{{item.info}}</text>
					<view class="add-friend-btn" @tap.stop="addFriend(item)">
						<text class="btn-text">加好友</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 我的好友 -->
		<view class="section">
			<view class="section-header">
				<text class="section-title">我的好友</text>
				<text class="view-all" @tap="goToChat">查看全部</text>
			</view>

			<view class="my-friends-list">
				<view class="my-friend-item" v-for="(item, index) in myFriends" :key="index" @tap="chatWithFriend(item)">
					<image class="my-friend-avatar" :src="item.avatar" mode="aspectFill"></image>
					<view class="my-friend-info">
						<view class="my-friend-header">
							<text class="my-friend-name">{{item.name}}</text>
							<text class="my-friend-time">{{item.lastTime}}</text>
						</view>
						<text class="my-friend-msg">{{item.lastMsg}}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 附近的人 -->
		<view class="section">
			<view class="section-header">
				<text class="section-title">附近的人</text>
				<text class="view-all" @tap="goToNearby">查看全部</text>
			</view>

			<view class="nearby-list">
				<view class="nearby-item" v-for="(item, index) in nearbyUsers" :key="index" @tap="viewProfile(item)">
					<image class="nearby-avatar" :src="item.avatar" mode="aspectFill"></image>
					<view class="nearby-info">
						<view class="nearby-header">
							<text class="nearby-name">{{item.name}}</text>
							<text class="nearby-distance">{{item.distance}}</text>
						</view>
						<text class="nearby-sign">{{item.sign}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>

	<!-- 自定义底部导航栏 -->
	<CustomTabBar />
</template>

<script>
	import CustomTabBar from '@/components/CustomTabBar.vue'

	export default {
		components: {
			CustomTabBar
		},
		data() {
			return {
				showFeatures: false,
				recommendFriends: [
					{
						id: 1,
						name: '张三',
						avatar: '/static/avatar/avatar1.jpg',
						info: '爱好旅游、摄影',
					},
					{
						id: 2,
						name: '李四',
						avatar: '/static/avatar/avatar2.jpg',
						info: '音乐爱好者',
					},
					{
						id: 3,
						name: '王五',
						avatar: '/static/avatar/avatar3.jpg',
						info: '设计师，创意无限',
					},
					{
						id: 4,
						name: '赵六',
						avatar: '/static/avatar/avatar4.jpg',
						info: '健身达人',
					}
				],
				myFriends: [
					{
						id: 1,
						name: '小明',
						avatar: '/static/avatar/avatar5.jpg',
						lastMsg: '今天天气真不错，要不要出去玩？',
						lastTime: '10:30'
					},
					{
						id: 2,
						name: '小红',
						avatar: '/static/avatar/avatar6.jpg',
						lastMsg: '作业做完了吗？',
						lastTime: '昨天'
					},
					{
						id: 3,
						name: '小刚',
						avatar: '/static/avatar/avatar7.jpg',
						lastMsg: '[图片]',
						lastTime: '星期一'
					}
				],
				nearbyUsers: [
					{
						id: 1,
						name: '阿珍',
						avatar: '/static/avatar/avatar8.jpg',
						distance: '500m',
						sign: '生活不止眼前的苟且，还有诗和远方'
					},
					{
						id: 2,
						name: '阿强',
						avatar: '/static/avatar/avatar9.jpg',
						distance: '1.2km',
						sign: '热爱生活，热爱coding'
					},
					{
						id: 3,
						name: '小丽',
						avatar: '/static/avatar/avatar10.jpg',
						distance: '1.5km',
						sign: '不负韶华，不负自己'
					}
				]
			}
		},
		methods: {
			viewProfile(item) {
				// 兼容不同数据结构，确保正确获取用户ID
				const userId = item.userId || item.id || item._id;
				if (!userId) {
					uni.showToast({
						title: '无法获取用户信息',
						icon: 'none'
					});
					return;
				}

				uni.navigateTo({
					url: `/pages/social/friend-profile?id=${userId}`
				});
			},
			chatWithFriend(item) {
				uni.navigateTo({
					url: `/pages/social/chat?id=${item.id}&name=${item.name}`
				})
			},
			showSocialFeatures() {
				this.showFeatures = !this.showFeatures;
			},
			addFriend(item) {
				uni.showModal({
					title: '添加好友',
					content: `确认添加 ${item.name} 为好友？`,
					success: (res) => {
						if (res.confirm) {
							uni.showToast({
								title: '已发送好友请求',
								icon: 'success'
							})
						}
					}
				})
			},
			goToChat() {
				uni.navigateTo({
					url: '/pages/social/chat'
				})
			},
			goToGroupChat() {
				uni.navigateTo({
					url: '/pages/social/group-chat'
				})
			},
			goToFriendSearch() {
				uni.navigateTo({
					url: '/pages/social/friend-search'
				})
			},
			goToFriendRequests() {
				uni.navigateTo({
					url: '/pages/social/friend-requests'
				})
			},
			goToNearby() {
				uni.navigateTo({
					url: '/pages/social/nearby'
				})
			},
			goToMoments() {
				uni.navigateTo({
					url: '/pages/social/moments'
				})
			}
		}
	}
</script>

<style>
	@font-face {
		font-family: "iconfont";
		src: url('data:font/woff2;charset=utf-8;base64,d09GMgABAAAAAAQsAAsAAAAACQAAAAPeAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDMgqEWIQlATYCJAMUCwwABCAFhGcHUBtmB8gOJcHAwAAAAADiIR77Y+7u7hIaIIkW88h0eoIkWqNYCVqhezJx+LNJ/Pty2nsSHkCdqoyqXbvw7HKWVRXvZOGhjIdHJnECnyMB1JtQbNgOQAEz4WsGCAD85v7X0+w/WCcvmzxyLqoKbBf+F8oFGgiMsf/NOl0arUm8AQrQ3hjbou5CnE8g2TRTOJ9TUAWuCnQpEA/bLQauJqIauEIPXdlbLKx4qaFnepoeAV6E3x//YBFXSZpMP/XwJOsE5T/tP1WVf5WLAZHHc0N7kbEBFOJJpeceCsIbKJLMv9bswM/QSz7tp/3/X0ZQK+0fHiGyRDRCp0fxIaG5/mkfDZ/2CYQTpEpSk71UUjI3gR+AvAf8QOUdYTI1ItsRcTWMV5+9EyfXM5Ph7PgRvLBzXVDk+2yVtaO9swKC/aXYNtZPnDy9Qjg52eLEoQnVj5V4OI3m4XTVt0FT3+ZxmLPNI78erRvNg1OTHUr6NbP35jk3jpUxvBrH8Oqsm+WtxqC989y9Zj60y2TQXRwZc7PxG9A+Vj4ELn7r1xw0xKmunhjz1XBMOzdOxvHk+Cqax6fxPDaBYd/eMXtnTw+P9xZN78OZ+5vT9C7MvCsmH85gbx1dMcHHgX07uxvsfJsb2F4cbRzdx+GhpZnT3Vy1cnH7v7Dkgx3YW2btsVnAj3Ky8aTEHDHv/wj0ZdH/WXSuN+1WXG9JfQG20bKQ43p7z5gzlN1v3IW5AxH5HwAKH6oGnNw9J98Eir2/bfIAOLcn/0/zZ3HuL/iiAgAkiDH/pfZrz4uu9BbSUoTFi24ggAGAJ+wKCz6Zt3VBUoUAKO6huhJWcV1Z5E/T6XADfkMSepD0LCHrmUfd2A3QM7AFrZ4DSLYutL/HT6QoClYtANa8AwhzV5BMvUU29wV1Y39Az8IfaJkHIrllPTvmeLJYqRgFOYb+QJPJKtbGCvkDYx0jtDw+Er4hZ/ahs6ZuuEdOsY/tKnM0UUZUcAavg/tImkaSYzSIo7rRtszlfj+9TK5iJZE5CBiL3E7QiImVsNawEvm8PRrK50cEecMXpZrJQ44a9dCboxxFfjHbSmYxDjVCKUQJnAHTgX0RaRSRLt4xMhCHVKeQVky67Hy6v7z2vBWQazsRKXLUaBhjQsbJUTZJy3Qpxo6lDQAA') format('woff2');
	}

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 24px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.container {
		padding: 30rpx;
		background-color: #F8F9FC;
	}

	.search-container {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.search-box {
		flex: 1;
		display: flex;
		align-items: center;
		background-color: #FFFFFF;
		height: 80rpx;
		border-radius: 40rpx;
		padding: 0 25rpx;
		box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.05);
		transition: all 0.3s;
	}

	.search-box:active {
		background-color: #F5F5F5;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);
	}

	.search-icon {
		font-size: 36rpx;
		color: #999;
		margin-right: 15rpx;
	}

	.search-input {
		flex: 1;
		height: 60rpx;
		font-size: 28rpx;
	}

	.filter-btn {
		width: 80rpx;
		height: 80rpx;
		background: linear-gradient(135deg, #FF6699, #FF8CB4);
		border-radius: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 20rpx;
		box-shadow: 0 6rpx 20rpx rgba(255, 102, 153, 0.3);
		transition: all 0.3s;
	}

	.filter-btn:active {
		transform: scale(0.95);
		box-shadow: 0 4rpx 10rpx rgba(255, 102, 153, 0.2);
	}

	.filter-icon {
		color: #FFFFFF;
		font-size: 30rpx;
		font-weight: bold;
	}

	.section {
		margin-bottom: 40rpx;
	}

	.section-recommended {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		height: 50rpx;
		padding: 0 20rpx;
	}


	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		padding: 0 10rpx;
	}

	.section-title {
		font-size: 34rpx;
		font-weight: bold;
		color: #333;
		position: relative;
	}

	.section-title::after {
		content: '';
		position: absolute;
		bottom: -8rpx;
		left: 0;
		width: 40rpx;
		height: 6rpx;
		background: linear-gradient(to right, #FF6699, #FF8CB4);
		border-radius: 3rpx;
	}

	.view-all {
		font-size: 26rpx;
		color: #999;
		transition: all 0.3s;
	}

	.view-all:active {
		color: #FF6699;
		transform: scale(0.95);
	}

	.scroll-view-x {
		white-space: nowrap;
		width: 100%;
	}

	.friend-item {
		display: inline-block;
		width: 200rpx;
		margin-right: 20rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
		padding: 20rpx;
		text-align: center;
		transition: all 0.3s;
	}

	.friend-item:active {
		transform: translateY(-5rpx);
		box-shadow: 0 10rpx 25rpx rgba(0, 0, 0, 0.12);
	}

	.friend-avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 60rpx;
		margin-bottom: 15rpx;
		border: 4rpx solid #FFFFFF;
		box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
	}

	.friend-name {
		font-size: 28rpx;
		font-weight: 600;
		color: #333;
		display: block;
		margin-bottom: 8rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.friend-info {
		font-size: 24rpx;
		color: #999;
		display: block;
		margin-bottom: 15rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.add-friend-btn {
		background: linear-gradient(to right, #FFE8EE, #FFF0F5);
		border-radius: 30rpx;
		padding: 10rpx 20rpx;
		display: inline-block;
		transition: all 0.3s;
	}

	.add-friend-btn:active {
		transform: scale(0.95);
		background: linear-gradient(to right, #FFD0E0, #FFDBEA);
	}

	.btn-text {
		font-size: 24rpx;
		color: #FF6699;
		font-weight: 500;
	}

	.my-friends-list {
		background-color: #FFFFFF;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
	}

	.my-friend-item {
		display: flex;
		padding: 25rpx;
		border-bottom: 1px solid #F5F5F5;
		transition: all 0.3s;
	}

	.my-friend-item:active {
		background-color: #F8F9FC;
	}

	.my-friend-avatar {
		width: 90rpx;
		height: 90rpx;
		border-radius: 45rpx;
		margin-right: 20rpx;
		border: 3rpx solid #FFFFFF;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
	}

	.my-friend-info {
		flex: 1;
	}

	.my-friend-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 6rpx;
	}

	.my-friend-name {
		font-size: 30rpx;
		font-weight: 600;
		color: #333;
	}

	.my-friend-time {
		font-size: 24rpx;
		color: #999;
	}

	.my-friend-msg {
		font-size: 26rpx;
		color: #666;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.nearby-list {
		background-color: #FFFFFF;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
	}

	.nearby-item {
		display: flex;
		padding: 25rpx;
		border-bottom: 1px solid #F5F5F5;
		transition: all 0.3s;
	}

	.nearby-item:active {
		background-color: #F8F9FC;
	}

	.nearby-avatar {
		width: 90rpx;
		height: 90rpx;
		border-radius: 45rpx;
		margin-right: 20rpx;
		border: 3rpx solid #FFFFFF;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
	}

	.nearby-info {
		flex: 1;
	}

	.nearby-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 6rpx;
	}

	.nearby-name {
		font-size: 30rpx;
		font-weight: 600;
		color: #333;
	}

	.nearby-distance {
		font-size: 24rpx;
		color: #FF6699;
		font-weight: 500;
	}

	.nearby-sign {
		font-size: 26rpx;
		color: #666;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.features-section {
		background-color: #FFFFFF;
		border-radius: 20rpx;
		padding: 25rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.06);
		animation: fadeIn 0.3s ease-out;
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(-20rpx); }
		to { opacity: 1; transform: translateY(0); }
	}

	.features-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.feature-item {
		width: 32%;
		height: 170rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 20rpx;
		background: linear-gradient(to bottom, #FFFFFF, #F9F9F9);
		border-radius: 16rpx;
		box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.05);
		transition: all 0.3s;
	}

	.feature-item:active {
		transform: scale(0.95);
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
	}

	.feature-icon {
		font-size: 50rpx;
		margin-bottom: 15rpx;
	}

	.feature-text {
		font-size: 26rpx;
		color: #666666;
		font-weight: 500;
	}
</style>