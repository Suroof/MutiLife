<template>
	<view class="container">
		<!-- 顶部导航栏 -->
		<view class="header">
			<view class="menu-icon">
				<text class="icon-line"></text>
				<text class="icon-line"></text>
				<text class="icon-line"></text>
			</view>
			<view class="avatar-container">
				<image class="avatar" src="/static/avatar.jpg" mode="aspectFill"></image>
			</view>
		</view>

		<!-- 主标题 -->
		<view class="title-section">
			<text class="page-title">Discover</text>
		</view>

		<!-- 搜索栏 -->
		<view class="search-section">
			<view class="search-bar">
				<text class="search-icon">🔍</text>
				<input type="text" placeholder="Search destinations" class="search-input" />
			</view>
		</view>

		<!-- 分类导航 -->
		<view class="categories-nav">
			<view class="category-item active">
				<text class="category-text">Experiences</text>
				<view class="active-dot"></view>
			</view>
			<view class="category-item">
				<text class="category-text">Places</text>
			</view>
			<view class="category-item">
				<text class="category-text">Housings</text>
			</view>
		</view>

		<!-- 探索卡片区域 -->
		<scroll-view class="discover-scroll" scroll-x="true" show-scrollbar="false">
			<view class="discover-card">
				<image class="discover-image" src="/static/kayaking.jpg" mode="aspectFill"></image>
				<view class="bookmark-icon">📍</view>
				<view class="card-content">
					<text class="card-title">Kayaking at the village Gudvangen</text>
					<view class="location">
						<text class="location-icon">📍</text>
						<text class="location-text">Norway</text>
					</view>
				</view>
			</view>

			<view class="discover-card">
				<image class="discover-image" src="/static/canyon.jpg" mode="aspectFill"></image>
				<view class="bookmark-icon"></view>
				<view class="card-content">
					<text class="card-title">Breathtaking Antelope Canyon Tour</text>
					<view class="location">
						<text class="location-icon">📍</text>
						<text class="location-text">Arizona, USA</text>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 冒险模式 -->
		<view class="mood-section">
			<view class="section-header">
				<text class="section-title">Adventurous Mood?</text>
				<text class="view-all">Show all</text>
			</view>

			<scroll-view class="activities-scroll" scroll-x="true" show-scrollbar="false">
				<view class="activity-item">
					<view class="activity-icon kayaking">
						<image src="/static/icons/kayak.png" mode="aspectFit" class="activity-icon-image"></image>
					</view>
					<text class="activity-name">KAYAKING</text>
				</view>
				<view class="activity-item">
					<view class="activity-icon ballooning">
						<image src="/static/icons/balloon.png" mode="aspectFit" class="activity-icon-image"></image>
					</view>
					<text class="activity-name">BALLOONING</text>
				</view>
				<view class="activity-item">
					<view class="activity-icon hiking">
						<image src="/static/icons/hiking.png" mode="aspectFit" class="activity-icon-image"></image>
					</view>
					<text class="activity-name">HIKING</text>
				</view>
				<view class="activity-item">
					<view class="activity-icon snorkeling">
						<image src="/static/icons/snorkel.png" mode="aspectFit" class="activity-icon-image"></image>
					</view>
					<text class="activity-name">SNORKELING</text>
				</view>
			</scroll-view>
		</view>

		<!-- 实用信息 -->
		<view class="info-section">
			<view class="section-header">
				<text class="section-title">Useful Information</text>
				<view class="pagination-dots">
					<view class="dot active"></view>
					<view class="dot"></view>
					<view class="dot"></view>
				</view>
			</view>

			<scroll-view class="info-scroll" scroll-x="true" show-scrollbar="false">
				<view class="info-card">
					<image class="info-image" src="/static/info/preparation.jpg" mode="aspectFill"></image>
					<view class="info-button">Preparation</view>
				</view>
				<view class="info-card">
					<image class="info-image" src="/static/info/documentation.jpg" mode="aspectFill"></image>
					<view class="info-button">Documentation</view>
				</view>
			</scroll-view>
		</view>

		<!-- 特色体验 -->
		<view class="featured-section">
			<view class="section-header">
				<text class="section-title">Featured Experiences</text>
				<text class="view-all">View all</text>
			</view>

			<view class="featured-grid">
				<view class="featured-card">
					<image class="featured-image" src="/static/examples/featured1.jpg" mode="aspectFill"></image>
					<view class="featured-content">
						<text class="featured-title">Mountain hiking</text>
						<view class="featured-rating">
							<text class="rating-stars">★★★★★</text>
							<text class="rating-count">4.8</text>
						</view>
					</view>
				</view>

				<view class="featured-card">
					<image class="featured-image" src="/static/examples/featured2.jpg" mode="aspectFill"></image>
					<view class="featured-content">
						<text class="featured-title">Scuba diving</text>
						<view class="featured-rating">
							<text class="rating-stars">★★★★★</text>
							<text class="rating-count">4.7</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- Padding at bottom to account for tab bar -->
		<view style="height: 150rpx;"></view>
	</view>

	<!-- 自定义底部导航栏 -->
	<CustomTabBar />
</template>

<script>
	import CustomTabBar from '@/components/CustomTabBar.vue'
	import { isAuthenticated } from '@/services/api/request.js'

	export default {
		components: {
			CustomTabBar
		},
		data() {
			return {
				// 数据可以根据需要添加
			}
		},
		onLoad() {
			// 检查用户是否已登录，如果未登录则重定向到登录页面
			if (!isAuthenticated()) {
				uni.navigateTo({
					url: '/pages/login/login'
				});
			}
		},
		methods: {
			// 方法可以根据需要添加
		}
	}
</script>

<style>
	.container {
		padding: 40rpx 30rpx;
		background-color: #FFFFFF;
		min-height: 100vh;
		box-sizing: border-box;
	}

	/* 顶部导航栏 */
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.menu-icon {
		width: 40rpx;
		height: 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.icon-line {
		width: 100%;
		height: 3rpx;
		background-color: #000;
	}

	.avatar-container {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		overflow: hidden;
	}

	.avatar {
		width: 100%;
		height: 100%;
	}

	/* 主标题 */
	.title-section {
		margin-bottom: 20rpx;
	}

	.page-title {
		font-size: 48rpx;
		font-weight: bold;
		color: #000;
	}

	/* 搜索栏 */
	.search-section {
		margin-bottom: 30rpx;
	}

	.search-bar {
		display: flex;
		align-items: center;
		height: 80rpx;
		background-color: #F5F5F5;
		border-radius: 40rpx;
		padding: 0 30rpx;
	}

	.search-icon {
		margin-right: 10rpx;
		font-size: 32rpx;
		color: #999;
	}

	.search-input {
		flex: 1;
		height: 80rpx;
		font-size: 28rpx;
		color: #333;
	}

	/* 分类导航 */
	.categories-nav {
		display: flex;
		margin-bottom: 30rpx;
	}

	.category-item {
		margin-right: 40rpx;
		position: relative;
		padding-bottom: 10rpx;
	}

	.category-text {
		font-size: 28rpx;
		color: #999;
	}

	.active .category-text {
		color: #FF5533;
		font-weight: 500;
	}

	.active-dot {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 8rpx;
		height: 8rpx;
		border-radius: 50%;
		background-color: #FF5533;
	}

	/* 探索卡片 */
	.discover-scroll {
		white-space: nowrap;
		margin: 0 -30rpx;
		padding: 0 30rpx;
		margin-bottom: 40rpx;
	}

	.discover-card {
		display: inline-block;
		width: 500rpx;
		height: 300rpx;
		border-radius: 20rpx;
		margin-right: 20rpx;
		position: relative;
		overflow: hidden;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.discover-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.bookmark-icon {
		position: absolute;
		top: 0;
		right: 30rpx;
		width: 30rpx;
		height: 50rpx;
		background-color: #FF5533;
		border-bottom-left-radius: 5rpx;
		border-bottom-right-radius: 5rpx;
	}

	.card-content {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 20rpx;
		background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
	}

	.card-title {
		font-size: 32rpx;
		color: #FFFFFF;
		font-weight: bold;
		margin-bottom: 10rpx;
		display: block;
	}

	.location {
		display: flex;
		align-items: center;
	}

	.location-icon {
		font-size: 24rpx;
		margin-right: 8rpx;
	}

	.location-text {
		font-size: 24rpx;
		color: #FFFFFF;
	}

	/* 冒险模式 */
	.mood-section {
		margin-bottom: 40rpx;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 25rpx;
	}

	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.view-all {
		font-size: 24rpx;
		color: #999;
	}

	.activities-scroll {
		white-space: nowrap;
		margin: 0 -30rpx;
		padding: 0 30rpx;
	}

	.activity-item {
		display: inline-block;
		flex-direction: column;
		align-items: center;
		margin-right: 40rpx;
		text-align: center;
	}

	.activity-icon {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin-bottom: 10rpx;
		background-color: #FFEEE6;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 2rpx 8rpx rgba(255, 85, 51, 0.15);
	}

	.activity-icon-image {
		width: 50%;
		height: 50%;
	}

	.activity-name {
		font-size: 20rpx;
		color: #999;
	}

	/* 实用信息 */
	.info-section {
		margin-bottom: 40rpx;
	}

	.pagination-dots {
		display: flex;
	}

	.dot {
		width: 20rpx;
		height: 6rpx;
		background-color: #DDD;
		margin-right: 5rpx;
		border-radius: 3rpx;
	}

	.dot.active {
		background-color: #FF5533;
		width: 30rpx;
	}

	.info-scroll {
		white-space: nowrap;
		margin: 0 -30rpx;
		padding: 0 30rpx;
	}

	.info-card {
		display: inline-block;
		width: 400rpx;
		height: 240rpx;
		border-radius: 16rpx;
		margin-right: 20rpx;
		position: relative;
		overflow: hidden;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.info-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: brightness(0.85);
	}

	.info-button {
		position: absolute;
		bottom: 30rpx;
		left: 50%;
		transform: translateX(-50%);
		background-color: #FF5533;
		color: white;
		font-size: 28rpx;
		font-weight: 500;
		padding: 12rpx 30rpx;
		border-radius: 30rpx;
		text-align: center;
		min-width: 180rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
	}

	/* 特色体验 */
	.featured-section {
		margin-bottom: 40rpx;
	}

	.featured-grid {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.featured-card {
		width: 48%;
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		margin-bottom: 20rpx;
	}

	.featured-image {
		width: 100%;
		height: 180rpx;
		object-fit: cover;
	}

	.featured-content {
		padding: 15rpx;
	}

	.featured-title {
		font-size: 28rpx;
		font-weight: 500;
		color: #333;
		margin-bottom: 8rpx;
		display: block;
	}

	.featured-rating {
		display: flex;
		align-items: center;
	}

	.rating-stars {
		color: #FF5533;
		font-size: 24rpx;
		margin-right: 8rpx;
	}

	.rating-count {
		font-size: 24rpx;
		color: #999;
	}
	.app-container {
		padding: 40rpx 30rpx;
		background-color: #FFFFFF;
		min-height: 100vh;
		box-sizing: border-box;
	}

</style>
