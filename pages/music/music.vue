<template>
	<view class="container">
		<!-- 顶部区域 -->
		<view class="header">
			<text class="page-title">听歌</text>
			<view class="search-box">
				<text class="iconfont search-icon">🔍</text>
				<input type="text" class="search-input" placeholder="搜索歌曲、歌手、专辑" />
			</view>
		</view>

		<!-- 分类导航 -->
		<view class="category-tabs">
			<view class="tab-item"
				v-for="(item, index) in categories"
				:key="index"
				:class="{ active: selectedCategory === index }"
				@tap="selectCategory(index)">
				<text class="iconfont" v-html="item.icon"></text>
				<text class="tab-text">{{item.title}}</text>
			</view>
		</view>

		<!-- 每日推荐 -->
		<view class="section daily-recommend">
			<view class="section-header">
				<text class="section-title">每日推荐</text>
				<text class="view-all">查看全部</text>
			</view>

			<scroll-view class="scroll-view-x" scroll-x="true" show-scrollbar="false">
				<view class="song-card" v-for="(item, index) in dailyRecommendations" :key="index" @tap="playSong(item)">
					<image class="song-image" :src="item.cover" mode="aspectFill"></image>
					<view class="song-info">
						<text class="song-name">{{item.name}}</text>
						<text class="song-artist">{{item.artist}}</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 热门歌单 -->
		<view class="section playlist-section">
			<view class="section-header">
				<text class="section-title">热门歌单</text>
				<text class="view-all">查看全部</text>
			</view>

			<view class="playlist-grid">
				<view class="playlist-card" v-for="(item, index) in hotPlaylists" :key="index" @tap="openPlaylist(item)">
					<view class="playlist-image-container">
						<image class="playlist-image" :src="item.cover" mode="aspectFill"></image>
						<view class="play-count">
							<text class="iconfont play-icon">🠜</text>
							<text class="count-text">{{formatCount(item.playCount)}}</text>
						</view>
					</view>
					<text class="playlist-name">{{item.name}}</text>
					<text class="playlist-desc">{{item.count}}首</text>
				</view>
			</view>
		</view>

		<!-- 推荐歌手 -->
		<view class="section artists-section">
			<view class="section-header">
				<text class="section-title">推荐歌手</text>
				<text class="view-all">更多</text>
			</view>

			<scroll-view class="scroll-view-x" :scroll-x="true" :show-scrollbar="false">
				<view class="artist-card" v-for="(item, index) in recommendedArtists" :key="index" @tap="openArtist(item)">
					<image class="artist-avatar" :src="item.avatar" mode="aspectFill"></image>
					<text class="artist-name">{{item.name}}</text>
				</view>
			</scroll-view>
		</view>

		<!-- 最近播放 -->
		<view class="section recent-section">
			<view class="section-header">
				<text class="section-title">最近播放</text>
				<text class="view-all">查看全部</text>
			</view>

			<view class="recent-list">
				<view class="recent-item" v-for="(item, index) in recentlyPlayed" :key="index" @tap="playSong(item)">
					<image class="recent-cover" :src="item.cover" mode="aspectFill"></image>
					<view class="recent-info">
						<text class="recent-name">{{item.name}}</text>
						<text class="recent-artist">{{item.artist}}</text>
					</view>
					<view class="play-btn">
						<text class="iconfont play-icon">🎝</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 播放控制栏 -->
		<view class="player-bar" v-if="currentSong" @tap="openFullPlayer">
			<view class="music-progress" :style="{width: progressWidth + '%'}"></view>
			<image class="player-cover" :src="currentSong.cover" mode="aspectFill"></image>
			<view class="player-info">
				<text class="player-name">{{currentSong.name}}</text>
				<text class="player-artist">{{currentSong.artist}}</text>
			</view>
			<view class="player-controls">
				<text class="iconfont control-icon" @tap.stop="togglePlayStatus">{{isPlaying ? '⏸' : '⏵'}}</text>
				<text class="iconfont control-icon" @tap.stop="nextSong">⏭</text>
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
				selectedCategory: 0,
				progressWidth: 30, // Current song progress
				categories: [
					{
						title: '排行榜',
						icon: '\🗠',
						url: '/pages/music/rank'
					},
					{
						title: '歌单',
						icon: '\🗼',
						url: '/pages/music/playlist'
					},
					{
						title: '电台',
						icon: '\🖱',
						url: '/pages/music/radio'
					},
					{
						title: '直播',
						icon: '\🗣',
						url: '/pages/music/live'
					}
				],
				dailyRecommendations: [
					{
						id: 1,
						name: 'Bad guy',
						artist: 'Billie Eillish',
						cover: 'data:image/jpeg;base64,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'
					},
					{
						id: 2,
						name: 'Lonely',
						artist: 'Justin Bieber',
						cover: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.c7IkDJYB-jcG16wyaddS1gHaHa?w=182&h=181&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					},
					{
						id: 3,
						name: '花花公子',
						artist: '马思唯',
						cover: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.gVSfENMN2f4EA1oHhvRZsAHaHa?w=200&h=200&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					},
					{
						id: 4,
						name: 'Overdrive',
						artist: 'Post Malone',
						cover: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.Cp0JsyzNurQ3pR_O8HuUIAHaEy?w=307&h=199&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					}
				],
				hotPlaylists: [
					{
						id: 1,
						name: '华语流行热歌榜',
						count: 100,
						playCount: 1500000,
						cover: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.sl6LH20AanG7zmXwSk5QSAHaHa?w=174&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					},
					{
						id: 2,
						name: 'Billboard',
						count: 80,
						playCount: 980000,
						cover: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.S0z-Y3-SbuH61ISlLw7fKQHaFF?w=241&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					},
					{
						id: 3,
						name: '夏日清凉',
						count: 65,
						playCount: 750000,
						cover: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.EBv8J8EgUGhUupOkfeQeGAHaE7?w=227&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					},
					{
						id: 4,
						name: '午后轻音乐',
						count: 50,
						playCount: 560000,
						cover: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.3qFP-d4UlG6EtImL2iUIjQHaFI?w=274&h=189&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					}
				],
				recommendedArtists: [
					{
						id: 1,
						name: '周杰伦',
						avatar: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.Qf8Hq00BpPUvwOGmL_RlWQHaEu?w=309&h=197&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					},
					{
						id: 2,
						name: 'Tylor',
						avatar: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.Vi9o1SYDqNlRl4JztrtMFAHaD5?w=288&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					},
					{
						id: 3,
						name: '陈奕迅',
						avatar: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.QlW0P71LsNw4H8JK06bbZwHaFj?w=271&h=204&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					},
					{
						id: 4,
						name: 'Ed Sheeran',
						avatar: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.Wbp1lxlRu9uYvjXuv8or5gHaE8?w=256&h=183&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					},
					{
						id: 5,
						name: '林俊杰',
						avatar: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.m_5KDVmJ5QM8JUtEhpfd1QHaKX?w=182&h=254&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					}
				],
				recentlyPlayed: [
					{
						id: 1,
						name: 'Scared 2 be lonely',
						artist: 'Lil Tjay',
						cover: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.dLXImGEAPuJa_BCvRNvWXAAAAA?w=169&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					},
					{
						id: 2,
						name: 'Simon',
						artist: '丁世光',
						cover: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.4JWD_HGCmAyYoHnjYkvDkwHaHa?w=175&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					},
					{
						id: 3,
						name: 'Lvy',
						artist: 'Frank Ocean',
						cover: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.JvAJFWUZdgDYLPdvyGpnGwHaEK?w=296&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
					}
				],
				currentSong: null,
				isPlaying: false
			}
		},
		methods: {
			selectCategory(index) {
				this.selectedCategory = index;
				uni.navigateTo({
					url: this.categories[index].url
				});
			},
			formatCount(count) {
				if (count >= 10000) {
					return (count / 10000).toFixed(1) + '万';
				}
				return count;
			},
			playSong(song) {
				this.currentSong = song;
				this.isPlaying = true;

				// 打开音乐播放器
				uni.navigateTo({
					url: `/pages/music/player?id=${song.id}`
				});
			},
			openPlaylist(playlist) {
				uni.navigateTo({
					url: '/pages/music/playlist-detail?id=' + playlist.id
				})
			},
			openArtist(artist) {
				uni.navigateTo({
					url: '/pages/music/artist?id=' + artist.id
				})
			},
			togglePlayStatus() {
				this.isPlaying = !this.isPlaying;

				uni.showToast({
					title: this.isPlaying ? '继续播放' : '暂停播放',
					icon: '🞀'
				})
			},
			nextSong() {
				uni.showToast({
					title: '切换到下一首',
					icon: 'none'
				})
			},
			openFullPlayer() {
				if (this.currentSong) {
					uni.navigateTo({
						url: `/pages/music/player?id=${this.currentSong.id}`
					});
				}
			}
		},
		onLoad() {
			// 模拟默认播放最近一首歌
			if (this.recentlyPlayed.length > 0) {
				this.currentSong = this.recentlyPlayed[0];
			}

			// 为静态图片创建占位符
			for (let recommendation of this.dailyRecommendations) {
				recommendation.cover = recommendation.cover.replace('/static/music/', '/static/canyon.jpg');
			}

			for (let playlist of this.hotPlaylists) {
				playlist.cover = playlist.cover.replace('/static/music/', '/static/canyon.jpg');
			}

			for (let artist of this.recommendedArtists) {
				artist.avatar = artist.avatar.replace('/static/music/', '/static/canyon.jpg');
			}

			for (let recent of this.recentlyPlayed) {
				recent.cover = recent.cover.replace('/static/music/', '/static/canyon.jpg');
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
	background-color: #FAFAFA;
	padding-bottom: 140rpx;
}

/* 头部区域样式 */
.header {
	padding: 30rpx;
	background: linear-gradient(to right, #FF6699, #FF9B82);
	border-radius: 0 0 30rpx 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(255, 102, 153, 0.2);
}

.page-title {
	font-size: 44rpx;
	font-weight: bold;
	color: #FFFFFF;
	margin-bottom: 20rpx;
	display: block;
}

.search-box {
	height: 80rpx;
	background-color: rgba(255, 255, 255, 0.2);
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	padding: 0 30rpx;
	backdrop-filter: blur(10px);
}

.search-icon {
	font-size: 36rpx;
	color: #FFFFFF;
	margin-right: 20rpx;
}

.search-input {
	flex: 1;
	height: 100%;
	color: #FFFFFF;
	font-size: 28rpx;
}

.search-input::placeholder {
	color: rgba(255, 255, 255, 0.7);
}

/* 分类标签样式 */
.category-tabs {
	display: flex;
	justify-content: space-between;
	background-color: #FFFFFF;
	border-radius: 20rpx;
	margin: -30rpx 20rpx 20rpx;
	padding: 20rpx 10rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	position: relative;
	z-index: 10;
}

.tab-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 16rpx 0;
	border-radius: 12rpx;
	transition: all 0.3s;
}

.tab-item.active {
	background-color: rgba(255, 102, 153, 0.1);
}

.tab-item .iconfont {
	font-size: 44rpx;
	color: #999;
	margin-bottom: 10rpx;
}

.tab-item.active .iconfont {
	color: #FF6699;
}

.tab-text {
	font-size: 24rpx;
	color: #999;
}

.tab-item.active .tab-text {
	color: #FF6699;
	font-weight: 500;
}

/* 公共区域样式 */
.section {
	margin: 30rpx 20rpx;
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
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

.scroll-view-x {
	white-space: nowrap;
}

/* 每日推荐样式 */
.daily-recommend {
	background-color: #FFFFFF;
}

.song-card {
	display: inline-block;
	width: 200rpx;
	margin-right: 25rpx;
	vertical-align: top;
}

.song-image {
	width: 200rpx;
	height: 200rpx;
	border-radius: 12rpx;
	margin-bottom: 12rpx;
	box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
}

.song-info {
	width: 200rpx;
}

.song-name {
	font-size: 26rpx;
	font-weight: 500;
	color: #333;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: block;
}

.song-artist {
	font-size: 22rpx;
	color: #999;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: block;
}

/* 热门歌单样式 */
.playlist-grid {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

.playlist-card {
	width: 48%;
	margin-bottom: 20rpx;
}

.playlist-image-container {
	position: relative;
	width: 100%;
	height: 220rpx;
	border-radius: 12rpx;
	overflow: hidden;
	margin-bottom: 12rpx;
	box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
}

.playlist-image {
	width: 100%;
	height: 100%;
}

.play-count {
	position: absolute;
	top: 10rpx;
	right: 10rpx;
	background-color: rgba(0, 0, 0, 0.3);
	color: #FFFFFF;
	font-size: 20rpx;
	padding: 4rpx 10rpx;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
}

.play-icon {
	font-size: 20rpx;
	margin-right: 6rpx;
}

.count-text {
	font-size: 20rpx;
}

.playlist-name {
	font-size: 26rpx;
	font-weight: 500;
	color: #333;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: block;
}

.playlist-desc {
	font-size: 22rpx;
	color: #999;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: block;
}

/* 推荐歌手样式 */
.artist-card {
	display: inline-block;
	width: 140rpx;
	margin-right: 25rpx;
	text-align: center;
}

.artist-avatar {
	width: 140rpx;
	height: 140rpx;
	border-radius: 50%;
	margin-bottom: 12rpx;
	box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
}

.artist-name {
	font-size: 24rpx;
	color: #333;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: block;
}

/* 最近播放列表样式 */
.recent-list {
	background-color: #FFFFFF;
	border-radius: 12rpx;
	overflow: hidden;
}

.recent-item {
	display: flex;
	align-items: center;
	padding: 16rpx 0;
	border-bottom: 1rpx solid #F5F5F5;
}

.recent-item:last-child {
	border-bottom: none;
}

.recent-cover {
	width: 90rpx;
	height: 90rpx;
	border-radius: 8rpx;
	margin-right: 20rpx;
}

.recent-info {
	flex: 1;
	overflow: hidden;
}

.recent-name {
	font-size: 28rpx;
	font-weight: 500;
	color: #333;
	margin-bottom: 6rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.recent-artist {
	font-size: 24rpx;
	color: #999;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.play-btn {
	width: 70rpx;
	height: 70rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.play-btn .play-icon {
	color: #FF6699;
	font-size: 40rpx;
}

/* 播放器控制条样式 */
.player-bar {
	position: fixed;
	bottom: 120rpx;
	left: 20rpx;
	right: 20rpx;
	height: 100rpx;
	background-color: rgba(255, 255, 255, 0.95);
	border-radius: 50rpx;
	display: flex;
	align-items: center;
	padding: 0 20rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
	backdrop-filter: blur(10px);
	z-index: 99;
	overflow: hidden;
}

.music-progress {
	position: absolute;
	left: 0;
	bottom: 0;
	height: 3rpx;
	background: linear-gradient(to right, #FF6699, #FF9B82);
}

.player-cover {
	width: 80rpx;
	height: 80rpx;
	border-radius: 12rpx;
	margin-right: 20rpx;
}

.player-info {
	flex: 1;
	overflow: hidden;
}

.player-name {
	font-size: 28rpx;
	font-weight: 500;
	color: #333;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin-bottom: 4rpx;
}

.player-artist {
	font-size: 22rpx;
	color: #999;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.player-controls {
	display: flex;
	align-items: center;
}

.control-icon {
	margin-left: 30rpx;
	color: #333;
	font-size: 44rpx;
}
</style>