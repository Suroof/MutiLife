<template>
	<view class="container">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @tap="goBack">
				<text class="iconfont back-icon">&#xe602;</text>
			</view>
			<view class="nav-title">
				<text>关于我们</text>
			</view>
			<view class="nav-right">
			</view>
		</view>

		<!-- 应用信息 -->
		<view class="about-content">
			<view class="app-logo">
				<image src="/static/logo.png" mode="aspectFit"></image>
			</view>

			<view class="app-name">MutiLife</view>
			<view class="app-version">v1.0.0</view>

			<view class="app-desc">
				MutiLife 是一款集合社交、音乐、新闻和规划功能于一体的生活服务应用。我们致力于为用户提供高品质的内容和便捷的功能，让您的生活更加丰富多彩。
			</view>

			<view class="feature-list">
				<view class="feature-item">
					<view class="feature-icon">
						<text class="iconfont">&#xe607;</text>
					</view>
					<view class="feature-info">
						<view class="feature-title">社交互动</view>
						<view class="feature-desc">与好友保持联系，分享生活点滴</view>
					</view>
				</view>

				<view class="feature-item">
					<view class="feature-icon">
						<text class="iconfont">&#610;</text>
					</view>
					<view class="feature-info">
						<view class="feature-title">音乐播放</view>
						<view class="feature-desc">海量曲库，畅享高品质音乐</view>
					</view>
				</view>

				<view class="feature-item">
					<view class="feature-icon">
						<text class="iconfont">&#xe609;</text>
					</view>
					<view class="feature-info">
						<view class="feature-title">新闻资讯</view>
						<view class="feature-desc">及时获取热点资讯，了解世界动态</view>
					</view>
				</view>

				<view class="feature-item">
					<view class="feature-icon">
						<text class="iconfont">&#xe608;</text>
					</view>
					<view class="feature-info">
						<view class="feature-title">生活规划</view>
						<view class="feature-desc">高效管理时间，科学规划生活</view>
					</view>
				</view>
			</view>

			<view class="contact-us">
				<view class="section-title">联系我们</view>
				<view class="contact-item">
					<text class="contact-label">官方网站：</text>
					<text class="contact-value">www.mutilife.com</text>
				</view>
				<view class="contact-item">
					<text class="contact-label">客服邮箱：</text>
					<text class="contact-value">support@mutilife.com</text>
				</view>
				<view class="contact-item">
					<text class="contact-label">官方微信：</text>
					<text class="contact-value">MutiLife_Official</text>
				</view>
			</view>

			<view class="cooperation">
				<view class="section-title">商务合作</view>
				<view class="cooperation-desc">
					如果您有商务合作需求，请发送邮件至 business@mutilife.com，我们将尽快与您联系。
				</view>
			</view>

			<view class="copyright">
				<text>© 2023-2024 MutiLife. All Rights Reserved.</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			goBack() {
				uni.navigateBack();
			}
		}
	}
</script>

<style>
@font-face {
	font-family: "iconfont";
	src: url('data:font/woff2;charset=utf-8;base64,d09GMgABAAAAAATcAAsAAAAACZwAAASPAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDSAqGCIUwATYCJAMYCw4ABCAFhGcHUBu9CMgekiRFQgQUUAEFFEABPPy3H+2+mZn9ESCJ1reOJ5YIiXhoJDQSIUKhkUQzZML/a9r+TMJEQmxC01onazc0k2Y1rawV4doKtZNOOJxwOuWEpecbGA5Mw9YClufdzK2TNunY0VhgHFCgY05uNexKoADlgrGbCB7E8wQG5huBHZy7lEB5gfYKxHNdDKC8UJQaSkOvUC+YW8RnoFebtGau3AN85n6fftAryoFGT6C7HV6cmsHkd/S7ZvH/i+HUCnD9mYFxFEiwF8hEPAk0PCM0gh1o3F8wOQT06qXhu/qufNd+1/7/TyIni86a5h9eaDQkRAXaNgJ7SbzBO3JF4btyueC7bnmK777lGUihnrGZYT8QnYAfiKZGt1QqbX1wGHrY/v6JPcflpPOFw9zwOZdL4nzKFenJ65V7cOCZcPToiePHnx52up7J+YLuoMsNJV3BhMPhVzs5/YrN6XTK3UG5EOSFUijwMa/H5Q6JheBL4SuR3cdz+eGXdsdLt+eVx/vS73/u9Z6KM1/BECdXmJtfLBCXTixQLKqXC+TLS1OLhDU84fKy1IvypWWJXIEEkl8uji0QxhB5CrnwOVMknl+WJM6/fEmTNcvl0qVS6aJYUhKJ5bPzOeGMLCPxXWeMzXclcOHs+WTi/0O8vWhoGb0gQpG9BmfnogJo8jt6XW7+QVHoMMd1mcthk+Hbly4dkrzIwYOH4+N5HMKd0+s1LRLCIo7E5PQMnfmjyPJHl/0i20N5fqaI4+PsI3zmkHMo7zqPfpnHkjikDgGHlOCdO4JkJQfu3EkEyZxEJBLfUalvvC/4XwLFqyYc379nz/GNRYqgH9Wz9qzZw4DjK3iKQu/KmAFoNaE+UgY9aQQ9LdOj0ujAT6fR6DdA9JimQb5nDv4rqgaIXt1/iD6IZsb0ojbRJqmHHnREk9EUu0QdGj0a/g/R2dHiONGi0ZfmqaoGDt9RU23C/ULND9bLSqsvLVXXZdwsqwV/U0VvPV/T3vAPzYqWpH9qVCUl/Vc88r4pK7mKFt8T1F9r6GGD1R/K1e/7Wf9rUl16p6jw+wGZbYP+R7rUNmzg2sPGDK1rqYLaOUO6m3Dv1TTUqvkZ7ZGmfZCJhnH0EGiYYAoyGsbBZHo7MkH2QldYDL36/WCwS7fjwSQRCL0WAejsBRrDfEDS2YdM0EPkhP0PXedgaEwPw2C7LsPeYJcVUBSMA0wHWotKLqpynElXCyM96bFGFcWYs9SMrYWNVoKTQFvIkpQxVk9zjJBJ2GCMVBUbDT6f0oMNSg/WGRNGmxj9ZPvGBiY1B1NRBCWhwAFQHFBaoRQuVMrh+PxqwaS88GgtVVAYf+8y1RitCmZE6Uk6NGTRmDIpxl4fzWGIDBIzMIxIJeGChnwP0gUzkHQvnGMUw6AnJnh+R5MVWJiUw7KqNdMnjsJtgIH5LVJEihxFKnTF4FXIKjTHiBlNZRYilb7WEFkZydYAAAA=');
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
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background-color: #FFFFFF;
}

/* 导航栏 */
.nav-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 90rpx;
	background-color: #FFFFFF;
	border-bottom: 1rpx solid #EEEEEE;
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
	font-size: 32rpx;
	color: #333333;
	font-weight: 500;
}

/* 应用信息 */
.about-content {
	padding: 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.app-logo {
	width: 200rpx;
	height: 200rpx;
	margin-bottom: 30rpx;
}

.app-logo image {
	width: 100%;
	height: 100%;
}

.app-name {
	font-size: 44rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 10rpx;
}

.app-version {
	font-size: 28rpx;
	color: #999999;
	margin-bottom: 40rpx;
}

.app-desc {
	font-size: 30rpx;
	color: #666666;
	text-align: center;
	line-height: 1.6;
	margin-bottom: 60rpx;
}

/* 功能特点 */
.feature-list {
	width: 100%;
	margin-bottom: 60rpx;
}

.feature-item {
	display: flex;
	margin-bottom: 40rpx;
	align-items: center;
}

.feature-icon {
	width: 80rpx;
	height: 80rpx;
	background: linear-gradient(135deg, #FF6699 0%, #FF9999 100%);
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
}

.feature-icon .iconfont {
	color: #FFFFFF;
	font-size: 40rpx;
}

.feature-info {
	flex: 1;
}

.feature-title {
	font-size: 32rpx;
	color: #333333;
	font-weight: 500;
	margin-bottom: 8rpx;
}

.feature-desc {
	font-size: 28rpx;
	color: #666666;
}

/* 联系我们 */
.contact-us, .cooperation {
	width: 100%;
	margin-bottom: 40rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 500;
	color: #333333;
	margin-bottom: 20rpx;
	position: relative;
	padding-left: 20rpx;
}

.section-title::before {
	content: '';
	position: absolute;
	left: 0;
	top: 6rpx;
	bottom: 6rpx;
	width: 6rpx;
	background-color: #FF6699;
	border-radius: 3rpx;
}

.contact-item {
	font-size: 28rpx;
	color: #666666;
	margin-bottom: 15rpx;
}

.contact-label {
	color: #333333;
}

.cooperation-desc {
	font-size: 28rpx;
	color: #666666;
	line-height: 1.6;
}

/* 版权信息 */
.copyright {
	margin-top: 60rpx;
	margin-bottom: 40rpx;
	text-align: center;
}

.copyright text {
	font-size: 24rpx;
	color: #999999;
}
</style>