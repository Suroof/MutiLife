<template>
	<view class="container">
		<view class="welcome-text">
			<text class="app-name">MutiLife</text>
			<text class="tagline">探索您的多彩生活</text>
		</view>

		<view class="module-circles">
			<view class="circle-item" @tap="navigateTo('/pages/travel/travel')">
				<view class="circle travel">
					<image src="/static/tabbar/旅游.png" mode="aspectFit" class="circle-icon"></image>
				</view>
				<text class="circle-text">旅游</text>
			</view>

			<view class="circle-item" @tap="navigateTo('/pages/social/social')">
				<view class="circle social">
					<image src="/static/tabbar/social-active.png" mode="aspectFit" class="circle-icon"></image>
				</view>
				<text class="circle-text">交友</text>
			</view>

			<view class="circle-item" @tap="navigateTo('/pages/music/music')">
				<view class="circle music">
					<image src="/static/tabbar/music.png" mode="aspectFit" class="circle-icon"></image>
				</view>
				<text class="circle-text">听歌</text>
			</view>

			<view class="circle-item" @tap="navigateTo('/pages/planner/planner')">
				<view class="circle planner">
					<image src="/static/tabbar/planner-active.png" mode="aspectFit" class="circle-icon"></image>
				</view>
				<text class="circle-text">规划</text>
			</view>

			<view class="circle-item" @tap="navigateTo('/pages/news/news')">
				<view class="circle news">
					<image src="/static/tabbar/news-active.png" mode="aspectFit" class="circle-icon"></image>
				</view>
				<text class="circle-text">新闻</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		navigateTo(url) {
			uni.switchTab({
				url: url,
				fail: (err) => {
					console.error('导航失败:', err);
					// 如果switchTab失败，尝试使用navigateTo
					uni.navigateTo({
						url: url,
						fail: (navigateErr) => {
							console.error('navigateTo也失败了:', navigateErr);
							uni.showToast({
								title: '页面导航失败',
								icon: 'none'
							});
						}
					});
				}
			});
		}
	}
}
</script>

<style>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
	padding: 40rpx;
	background-color: #F8F8F8;
}

.welcome-text {
	margin-bottom: 80rpx;
	text-align: center;
}

.app-name {
	font-size: 60rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 20rpx;
}

.tagline {
	font-size: 32rpx;
	color: #666;
}

.module-circles {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 40rpx;
}

.circle-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 180rpx;
}

.circle {
	width: 140rpx;
	height: 140rpx;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 20rpx;
	box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.1);
	transition: transform 0.3s ease;
}

.circle:active {
	transform: scale(0.95);
}

.circle-icon {
	width: 70rpx;
	height: 70rpx;
}

.circle-text {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

/* 不同模块的颜色 */
.travel {
	background: linear-gradient(135deg, #56CCF2, #2F80ED);
}

.social {
	background: linear-gradient(135deg, #FF9966, #FF5E62);
}

.music {
	background: linear-gradient(135deg, #FF7043, #FF5533);
}

.planner {
	background: linear-gradient(135deg, #6AC44E, #38A169);
}

.news {
	background: linear-gradient(135deg, #9E55FF, #6B46C1);
}

/* 白色图标 */
.travel .circle-icon,
.social .circle-icon,
.music .circle-icon,
.planner .circle-icon,
.news .circle-icon {
	filter: brightness(20) contrast(1);
}
</style>