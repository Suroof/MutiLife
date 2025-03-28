<template>
	<view class="container">
		<!-- 顶部分类切换 -->
		<view class="category-tabs">
			<scroll-view scroll-x="true" class="scroll-view-x" show-scrollbar="false">
				<view
					class="tab-item"
					v-for="(item, index) in categories"
					:key="index"
					:class="{'active-tab': currentCategory === index}"
					@tap="switchCategory(index)"
				>
					<text class="tab-text">{{item.name}}</text>
				</view>
			</scroll-view>
		</view>

		<!-- 轮播图 -->
		<swiper class="banner-swiper" indicator-dots="true" autoplay="true" interval="3000" duration="500" circular="true">
			<swiper-item v-for="(item, index) in banners" :key="index" @tap="openNewsDetail(item)">
				<view class="banner-item">
					<image class="banner-image" :src="item.image" mode="aspectFill"></image>
					<view class="banner-title-box">
						<text class="banner-title">{{item.title}}</text>
					</view>
				</view>
			</swiper-item>
		</swiper>

		<!-- 推荐新闻 -->
		<view class="section" v-if="currentCategory === 0">
			<view class="section-header">
				<text class="section-title">热门推荐</text>
				<text class="view-all" @tap="viewAllHot">更多</text>
			</view>

			<view class="hot-news-grid">
				<view class="hot-news-item" v-for="(item, index) in hotNews" :key="index" @tap="openNewsDetail(item)">
					<image class="hot-news-image" :src="item.image" mode="aspectFill"></image>
					<text class="hot-news-title">{{item.title}}</text>
				</view>
			</view>
		</view>

		<!-- 新闻列表 -->
		<view class="news-list-container">
			<!-- 下拉刷新加载中提示 -->
			<view class="loading-hint" v-if="isRefreshing">
				<view class="loading-icon"></view>
				<text class="loading-text">加载中...</text>
			</view>

			<!-- 新闻列表 -->
			<view class="news-list">
				<view class="news-item" v-for="(item, index) in newsList" :key="index" @tap="openNewsDetail(item)">
					<view class="news-image-container" v-if="item.image">
						<image class="news-image" :src="item.image" mode="aspectFill"></image>
					</view>
					<view class="news-content" :class="{'full-width': !item.image}">
						<text class="news-title">{{item.title}}</text>
						<view class="news-info">
							<text class="news-source">{{item.source}}</text>
							<text class="news-time">{{item.time}}</text>
							<text class="news-comments">{{item.comments}}评论</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 加载更多提示 -->
			<view class="load-more" v-if="newsList.length > 0" @tap="loadMoreNews">
				<text class="load-more-text">{{hasMore ? '加载更多' : '已显示全部内容'}}</text>
			</view>
		</view>

		<!-- 回到顶部按钮 -->
		<view class="back-to-top" v-if="showBackToTop" @tap="scrollToTop">
			<text class="iconfont top-icon">&#xe612;</text>
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
				// 分类数据
				categories: [
					{ name: '推荐' },
					{ name: '热点' },
					{ name: '科技' },
					{ name: '财经' },
					{ name: '体育' },
					{ name: '娱乐' },
					{ name: '健康' },
					{ name: '教育' }
				],
				currentCategory: 0,

				// 轮播图数据
				banners: [
					{
						id: 1,
						title: '人工智能再进化，日常生活将迎来哪些改变？',
						image: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.eZUbrF5ICvANJ9v1sbV4BAHaDt?w=339&h=174&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					},
					{
						id: 2,
						title: '全球首个！我国量子计算研究取得重大突破',
						image: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.ffAqlrZ58k5-CI-dvEKhJwHaE4?w=259&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					},
					{
						id: 3,
						title: '五星连珠天象奇观今晚上演，错过再等几十年',
						image: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.B9Lvu2RGfX-OJ3GxO-G79AHaFy?w=227&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					}
				],

				// 热门推荐新闻
				hotNews: [
					{
						id: 101,
						title: '地球上首次发现"宇宙尘埃"，科学家：或能解开生命起源之谜',
						image: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.0JrLQnq56rOz-O_l1ZlRlAHaFs?w=254&h=195&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					},
					{
						id: 102,
						title: '最新研究发现：每天喝咖啡可能延长寿命，但需控制这些因素',
						image: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.3XbS6UCrtMewmnj_CxE1twHaE8?w=290&h=194&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					},
					{
						id: 103,
						title: '经济学专家预测：下半年房地产市场或迎来这些变化',
						image: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.4Fw_ZRWw3QeNutwG31ZgoAHaE7?w=301&h=200&c=7&r=0&o=5&dpr=1.3&pid=1.7https://tse3-mm.cn.bing.net/th/id/OIP-C.4Fw_ZRWw3QeNutwG31ZgoAHaE7?w=301&h=200&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					},
					{
						id: 104,
						title: '超级稻新突破：单产创新高，有望解决粮食安全问题',
						image: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.4m27QUj9j3g6uYaXhtmdQwHaEl?w=249&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					}
				],

				// 新闻列表
				newsList: [
					{
						id: 201,
						title: '全国多地启动生育补贴新政策，最高可领1万元',
						source: '健康时报',
						time: '10分钟前',
						comments: 235,
						image: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.J9p8rg1cGarNG5R4Zc03mQHaEv?w=290&h=186&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					},
					{
						id: 202,
						title: '专家：每天坚持"三个20分钟"，健康长寿不是梦',
						source: '科学生活',
						time: '32分钟前',
						comments: 189,
						image: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.TFlXh64aOTTqU-n_kWwCiAHaE8?w=264&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					},
					{
						id: 203,
						title: '2023年度最受欢迎手机榜单出炉，国产品牌占据半壁江山',
						source: '数码评测',
						time: '1小时前',
						comments: 523,
						image: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.jRyi1yJ9wZRYo9sZMpObkgHaHa?w=191&h=191&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					},
					{
						id: 204,
						title: '重磅！银行利率进行新一轮调整，这些人将受益',
						source: '财经早报',
						time: '2小时前',
						comments: 421,
						image: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.cwxtYX8xV9t-GapQTA4cSwHaEY?w=281&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					},
					{
						id: 205,
						title: '今年高考作文题全国卷公布，专家解读命题思路',
						source: '教育新闻',
						time: '3小时前',
						comments: 354,
						image: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.VPKnFJaqWmlY-ipiqkQcMQHaE7?w=239&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					},
					{
						id: 206,
						title: '暑期即将来临，专家提醒家长注意儿童这些安全隐患',
						source: '安全生活',
						time: '4小时前',
						comments: 156,
						image: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.mMQiGKjU3MhwVF1xLB6evQHaEo?w=290&h=181&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					}
				],

				// 状态控制
				isRefreshing: false,
				hasMore: true,
				showBackToTop: false,
				page: 1
			}
		},
		onPageScroll(e) {
			// 滚动距离超过 500 显示回到顶部按钮
			this.showBackToTop = e.scrollTop > 500;
		},
		onPullDownRefresh() {
			// 下拉刷新
			this.refreshNews();
		},
		onReachBottom() {
			// 触底加载更多
			this.loadMoreNews();
		},
		methods: {
			// 切换分类
			switchCategory(index) {
				this.currentCategory = index;
				this.refreshNews();
			},

			// 刷新新闻
			refreshNews() {
				this.isRefreshing = true;
				this.page = 1;

				// 模拟请求延迟
				setTimeout(() => {
					// 这里应该是请求对应分类的新闻数据
					// 这里为了演示，使用模拟数据

					this.isRefreshing = false;
					// 下拉刷新的时候，重新展示所有数据
					uni.stopPullDownRefresh();
				}, 1000);
			},

			// 加载更多新闻
			loadMoreNews() {
				if (!this.hasMore) return;

				// 模拟请求更多数据
				setTimeout(() => {
					// 这里应该请求下一页数据
					// 这里为了演示，判断分页加载
					this.page++;

					if (this.page > 3) {
						this.hasMore = false;
					} else {
						// 模拟加载更多新闻
						const moreNews = [
							{
								id: 207 + (this.page - 2) * 3,
								title: '全球首款可降解手机外壳问世，有望减少电子垃圾',
								source: '环保科技',
								time: '5小时前',
								comments: 98,
								image: '/static/news6.jpg'
							},
							{
								id: 208 + (this.page - 2) * 3,
								title: '新研究表明：超过这个时间看手机对眼睛伤害最大',
								source: '健康卫视',
								time: '6小时前',
								comments: 187,
								image: ''
							},
							{
								id: 209 + (this.page - 2) * 3,
								title: '重要通知：这些地区将迎来大范围降雨，请做好防范',
								source: '天气频道',
								time: '7小时前',
								comments: 145,
								image: '/static/news7.jpg'
							}
						];

						this.newsList = [...this.newsList, ...moreNews];
					}
				}, 800);
			},

			// 查看热门新闻列表
			viewAllHot() {
				uni.showToast({
					title: '查看全部热门新闻',
					icon: 'none'
				});
			},

			// 打开新闻详情
			openNewsDetail(item) {
				uni.navigateTo({
					url: `/pages/news/detail?id=${item.id}`
				});
			},

			// 滚动到顶部
			scrollToTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
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
	background-color: #F8F8F8;
	padding-bottom: 20rpx;
}

.category-tabs {
	position: sticky;
	top: 0;
	background-color: #FFFFFF;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	z-index: 10;
}

.scroll-view-x {
	white-space: nowrap;
	width: 100%;
	height: 80rpx;
}

.tab-item {
	display: inline-block;
	padding: 0 30rpx;
	height: 80rpx;
	line-height: 80rpx;
	position: relative;
}

.tab-text {
	font-size: 28rpx;
	color: #666;
}

.active-tab {
	color: #FF6699;
}

.active-tab .tab-text {
	color: #FF6699;
	font-weight: bold;
}

.active-tab::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 40rpx;
	height: 6rpx;
	background-color: #FF6699;
	border-radius: 3rpx;
}

.banner-swiper {
	width: 100%;
	height: 360rpx;
}

.banner-item {
	position: relative;
	width: 100%;
	height: 100%;
}

.banner-image {
	width: 100%;
	height: 100%;
}

.banner-title-box {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20rpx 30rpx;
	background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
}

.banner-title {
	color: #FFFFFF;
	font-size: 32rpx;
	font-weight: bold;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.section {
	padding: 30rpx;
	background-color: #FFFFFF;
	margin-bottom: 20rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 34rpx;
	font-weight: bold;
	color: #333;
}

.view-all {
	font-size: 24rpx;
	color: #999;
}

.hot-news-grid {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

.hot-news-item {
	width: 48%;
	margin-bottom: 20rpx;
}

.hot-news-image {
	width: 100%;
	height: 180rpx;
	border-radius: 12rpx;
	margin-bottom: 10rpx;
}

.hot-news-title {
	font-size: 28rpx;
	color: #333;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	line-height: 1.4;
}

.news-list-container {
	background-color: #FFFFFF;
	padding: 20rpx 30rpx;
}

.news-list {
	margin-bottom: 30rpx;
}

.news-item {
	display: flex;
	padding: 30rpx 0;
	border-bottom: 1px solid #F0F0F0;
}

.news-image-container {
	width: 220rpx;
	height: 160rpx;
	margin-right: 20rpx;
	border-radius: 12rpx;
	overflow: hidden;
}

.news-image {
	width: 100%;
	height: 100%;
}

.news-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.full-width {
	width: 100%;
}

.news-title {
	font-size: 30rpx;
	color: #333;
	line-height: 1.5;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	margin-bottom: 10rpx;
}

.news-info {
	display: flex;
	font-size: 24rpx;
	color: #999;
}

.news-source, .news-time {
	margin-right: 20rpx;
}

.loading-hint {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 80rpx;
}

.loading-icon {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	border: 2rpx solid #F0F0F0;
	border-top-color: #FF6699;
	animation: spin 0.8s linear infinite;
	margin-right: 20rpx;
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

.loading-text {
	font-size: 26rpx;
	color: #999;
}

.load-more {
	text-align: center;
	padding: 20rpx 0;
}

.load-more-text {
	font-size: 26rpx;
	color: #999;
}

.back-to-top {
	position: fixed;
	bottom: 180rpx;
	right: 30rpx;
	width: 80rpx;
	height: 80rpx;
	background-color: rgba(255, 255, 255, 0.9);
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.2);
	z-index: 100;
}

.top-icon {
	font-size: 40rpx;
	color: #666;
}
</style>