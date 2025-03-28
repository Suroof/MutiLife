<script>
	import CustomTabBar from './components/CustomTabBar.vue'

	export default {
		components: {
			CustomTabBar
		},
		onLaunch: function() {
			console.log('App Launch');
			// 隐藏原生tabBar
			this.hideTabBar();
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		},
		globalData: {
			userInfo: null,
			themeColor: '#FF6699',
			bgColor: '#F8F8F8',
			tabBarHeight: 120
		},
		methods: {
			hideTabBar() {
				// 动态隐藏原生tabBar
				uni.hideTabBar({
					animation: false
				});
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	page {
		background-color: #F8F8F8;
		font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
	}

	.container {
		padding: 20rpx;
		padding-bottom: calc(120rpx + env(safe-area-inset-bottom)); /* 为自定义tabBar预留空间 */
	}

	.flex-row {
		display: flex;
		flex-direction: row;
	}

	.flex-col {
		display: flex;
		flex-direction: column;
	}

	.flex-center {
		align-items: center;
		justify-content: center;
	}

	.flex-between {
		justify-content: space-between;
	}

	.flex-wrap {
		flex-wrap: wrap;
	}

	.card {
		background: #FFFFFF;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
		margin-bottom: 20rpx;
		padding: 20rpx;
	}

	.btn-primary {
		background-color: #FF6699;
		color: #FFFFFF;
		border: none;
		border-radius: 30rpx;
		padding: 20rpx 40rpx;
		font-size: 30rpx;
		font-weight: 500;
	}

	.text-primary {
		color: #FF6699;
	}

	.text-secondary {
		color: #666666;
	}

	.text-light {
		color: #999999;
	}

	.font-bold {
		font-weight: bold;
	}

	/* 安全区适配 */
	.safe-area-inset-bottom {
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
