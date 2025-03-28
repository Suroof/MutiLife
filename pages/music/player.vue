<template>
	<view class="container">
		<!-- 背景模糊效果 -->
		<view class="bg-image" :style="{ backgroundImage: `url(${currentSong.coverImg})` }"></view>
		<view class="bg-mask"></view>

		<!-- 添加彩色光效 -->
		<view class="color-effects">
			<view class="color-circle circle1"></view>
			<view class="color-circle circle2"></view>
			<view class="color-circle circle3"></view>
		</view>

		<!-- 添加粒子效果 -->
		<view class="particle-container">
			<view class="particle" v-for="n in 8" :key="n" :class="'p'+n"></view>
		</view>

		<!-- 顶部导航 -->
		<view class="nav-bar safe-area-inset-top">
			<view class="nav-left" @tap="goBack">
				<text class="iconfont back-icon">🞀</text>
			</view>
			<view class="nav-center">
				<view class="nav-title-container">
					<text class="nav-title">{{currentSong.name}}</text>
					<text class="nav-subtitle">{{currentSong.artist}}</text>
				</view>
			</view>
			<view class="nav-right">
				<text class="iconfont share-icon" @tap="shareSong">→</text>
			</view>
		</view>

		<!-- 主要内容区 -->
		<view class="content-area">
			<!-- 唱片动画区 -->
			<view class="vinyl-area">
				<view class="vinyl-container" :class="{ 'playing': isPlaying, 'paused': !isPlaying }">
					<image class="vinyl-disc" src="/static/disc.png" mode="aspectFill"></image>
					<image class="vinyl-cover" :src="currentSong.coverImg" mode="aspectFill"></image>
					<view class="vinyl-reflection"></view>
				</view>

				<view class="tonearm-container" :class="{ 'playing': isPlaying }">
					<image class="tonearm-image" src="/static/tonearm.png" mode="aspectFill"></image>
				</view>
			</view>

			<!-- 歌词区域 -->
			<view class="lyric-container glass-card">
				<swiper class="lyric-swiper" :current="currentLyricIndex" circular="true" vertical="true"
					:display-multiple-items="5" @change="onLyricChange">
					<swiper-item class="lyric-item" v-for="(item, index) in lyrics" :key="index">
						<view class="lyric-line" :class="{ 'active-lyric': currentLyricIndex === index }">
							<text class="lyric-text">{{item.text}}</text>
						</view>
					</swiper-item>
					<swiper-item class="lyric-item" v-if="lyrics.length === 0">
						<view class="lyric-line">
							<text class="lyric-text">暂无歌词</text>
						</view>
					</swiper-item>
				</swiper>
			</view>

			<!-- 音乐控制区域 -->
			<view class="controls-container glass-card">
				<!-- 播放进度条 -->
				<view class="progress-bar">
					<text class="time-text current-time">{{formatTime(currentTime)}}</text>
					<view class="progress-track">
						<view class="progress-inner" :style="{width: progressPercentage + '%'}"></view>
						<view class="progress-handle" :style="{left: progressPercentage + '%'}"></view>
					</view>
					<text class="time-text total-time">{{formatTime(totalTime)}}</text>
				</view>

				<!-- 播放控制按钮 -->
				<view class="player-controls">
					<view class="control-btn mode-btn" @tap="togglePlayMode">
						<text class="iconfont" :class="playModeIcon"></text>
					</view>
					<view class="control-btn prev-btn" @tap="prevSong">
						<text class="iconfont">⏪</text>
					</view>
					<view class="control-btn play-btn" @tap="togglePlay">
						<text class="iconfont play-icon">{{isPlaying ? '⏸' : '⏵'}}</text>
					</view>
					<view class="control-btn next-btn" @tap="nextSong">
						<text class="iconfont">⏩</text>
					</view>
					<view class="control-btn list-btn" @tap="togglePlaylist">
						<text class="iconfont">🛆</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 播放列表弹出层 -->
		<view class="playlist-popup" v-if="showPlaylist" @tap="hidePlaylist">
			<view class="playlist-mask"></view>
			<view class="playlist-content dark-glass-card" @tap.stop>
				<view class="playlist-header">
					<text class="playlist-title">播放列表 ({{playlist.length}}首)</text>
					<view class="playlist-actions">
						<text class="action-btn" @tap="playAll">
							<text class="iconfont">&#xe605;</text> 播放全部
						</text>
						<text class="action-btn" @tap="clearPlaylist">
							<text class="iconfont">&#xe61a;</text> 清空
						</text>
					</view>
				</view>

				<scroll-view class="playlist-scroll" scroll-y="true">
					<view class="playlist-item" v-for="(item, index) in playlist" :key="index"
						@tap="playSongAtIndex(index)"
						:class="{'active': currentSong.id === item.id}">
						<view class="item-info">
							<text class="item-index">{{index + 1}}</text>
							<view class="item-details">
								<text class="item-name">{{item.name}}</text>
								<text class="item-artist">{{item.artist}}</text>
							</view>
						</view>
						<text class="iconfont playing-icon" v-if="currentSong.id === item.id">&#xe605;</text>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				songId: null,
				currentSong: {
					id: 1,
					name: '七里香',
					artist: '周杰伦',
					coverImg: '/static/canyon.jpg',
					url: 'https://music.example.com/song1.mp3'
				},
				isPlaying: true, // 是否正在播放
				currentTime: 0, // 当前播放时间
				totalTime: 240, // 歌曲总时长
				currentLyricIndex: 0, // 当前歌词索引
				showPlaylist: false, // 是否显示播放列表
				playMode: 'loop', // 播放模式：loop, random, single

				// 歌词数据
				lyrics: [
					{ time: 0, text: '七里香 - 周杰伦' },
					{ time: 5, text: '作词：方文山' },
					{ time: 10, text: '作曲：周杰伦' },
					{ time: 15, text: '窗外的麻雀 在电线杆上多嘴' },
					{ time: 20, text: '你说这一句 很有夏天的感觉' },
					{ time: 25, text: '手心的汗 蒸发在热气中' },
					{ time: 30, text: '眼神却再躲闪 我也不知怎么' },
					{ time: 35, text: '你才明白 这是场悲剧' },
					{ time: 40, text: '开始就已经清楚结局' },
					{ time: 45, text: '你在说 我不懂 你的痛' },
					{ time: 50, text: '你不懂 我的痛' },
					{ time: 55, text: '你若懂 何须痛' }
				],

				// 播放列表
				playlist: [
					{
						id: 1,
						name: '七里香',
						artist: '周杰伦',
						coverImg: '/static/avartor.jpg',
						url: 'https://music.example.com/song1.mp3'
					},
					{
						id: 2,
						name: '晴天',
						artist: '周杰伦',
						coverImg: '/static/sedona.jpg',
						url: 'https://music.example.com/song2.mp3'
					},
					{
						id: 3,
						name: '稻香',
						artist: '周杰伦',
						coverImg: '/static/yellowstone.jpg',
						url: 'https://music.example.com/song3.mp3'
					},
					{
						id: 4,
						name: '花海',
						artist: '周杰伦',
						coverImg: '/static/canyon.jpg',
						url: 'https://music.example.com/song4.mp3'
					},
					{
						id: 5,
						name: '青花瓷',
						artist: '周杰伦',
						coverImg: '/static/sedona.jpg',
						url: 'https://music.example.com/song5.mp3'
					}
				],

				// 定时器
				timer: null
			}
		},
		computed: {
			// 进度百分比
			progressPercentage() {
				return (this.currentTime / this.totalTime) * 100;
			},
			// 播放模式图标
			playModeIcon() {
				switch (this.playMode) {
					case 'loop': return 'mode-loop';
					case 'random': return 'mode-random';
					case 'single': return 'mode-single';
					default: return 'mode-loop';
				}
			}
		},
		onLoad(options) {
			// 获取歌曲ID参数
			if (options.id) {
				this.songId = options.id;
				this.loadSongDetail();
			}

			// 开始模拟播放进度
			this.startTimer();
		},
		onUnload() {
			// 清除定时器
			this.clearTimer();
		},
		methods: {
			// 加载歌曲详情
			loadSongDetail() {
				// 模拟API请求获取歌曲详情
				// 在实际应用中，这里应该调用后端API获取歌曲信息
				const songId = parseInt(this.songId);
				const song = this.playlist.find(item => item.id === songId);

				if (song) {
					this.currentSong = song;
					this.resetPlayer();
				}
			},

			// 重置播放器
			resetPlayer() {
				this.currentTime = 0;
				this.currentLyricIndex = 0;
			},

			// 开始计时器模拟播放进度
			startTimer() {
				this.clearTimer();

				if (this.isPlaying) {
					this.timer = setInterval(() => {
						if (this.currentTime < this.totalTime) {
							this.currentTime++;
							this.updateLyricIndex();
						} else {
							this.onSongEnd();
						}
					}, 1000);
				}
			},

			// 清除计时器
			clearTimer() {
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
				}
			},

			// 更新歌词索引
			updateLyricIndex() {
				for (let i = this.lyrics.length - 1; i >= 0; i--) {
					if (this.currentTime >= this.lyrics[i].time) {
						this.currentLyricIndex = i;
						break;
					}
				}
			},

			// 歌曲播放结束处理
			onSongEnd() {
				this.clearTimer();

				// 根据播放模式决定下一曲
				switch (this.playMode) {
					case 'single':
						// 单曲循环
						this.currentTime = 0;
						this.startTimer();
						break;
					case 'random':
						// 随机播放
						this.randomNextSong();
						break;
					case 'loop':
					default:
						// 列表循环
						this.nextSong();
						break;
				}
			},

			// 格式化时间
			formatTime(seconds) {
				const min = Math.floor(seconds / 60);
				const sec = Math.floor(seconds % 60);
				return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
			},

			// 切换播放/暂停状态
			togglePlay() {
				this.isPlaying = !this.isPlaying;

				if (this.isPlaying) {
					this.startTimer();
					uni.showToast({
						title: '继续播放',
						icon: 'none'
					});
				} else {
					this.clearTimer();
					uni.showToast({
						title: '暂停播放',
						icon: 'none'
					});
				}
			},

			// 上一曲
			prevSong() {
				const currentIndex = this.playlist.findIndex(item => item.id === this.currentSong.id);
				const prevIndex = currentIndex > 0 ? currentIndex - 1 : this.playlist.length - 1;

				this.playSongAtIndex(prevIndex);
			},

			// 下一曲
			nextSong() {
				const currentIndex = this.playlist.findIndex(item => item.id === this.currentSong.id);
				const nextIndex = currentIndex < this.playlist.length - 1 ? currentIndex + 1 : 0;

				this.playSongAtIndex(nextIndex);
			},

			// 随机下一曲
			randomNextSong() {
				const currentIndex = this.playlist.findIndex(item => item.id === this.currentSong.id);
				let randomIndex;

				do {
					randomIndex = Math.floor(Math.random() * this.playlist.length);
				} while (randomIndex === currentIndex && this.playlist.length > 1);

				this.playSongAtIndex(randomIndex);
			},

			// 播放指定索引的歌曲
			playSongAtIndex(index) {
				if (index >= 0 && index < this.playlist.length) {
					this.currentSong = this.playlist[index];
					this.resetPlayer();
					this.isPlaying = true;
					this.startTimer();
				}
			},

			// 歌词切换事件
			onLyricChange(e) {
				// const current = e.detail.current;
				// 这里不需要处理，因为我们是用时间来控制歌词
			},

			// 返回上一页
			goBack() {
				uni.navigateBack();
			},

			// 分享歌曲
			shareSong() {
				uni.showToast({
					title: '分享功能正在开发中',
					icon: '🢂'
				});
			},

			// 切换播放模式
			togglePlayMode() {
				const modes = ['loop', 'random', 'single'];
				const currentIndex = modes.indexOf(this.playMode);
				const nextIndex = (currentIndex + 1) % modes.length;
				this.playMode = modes[nextIndex];

				const modeText = {
					'loop': '列表循环',
					'random': '随机播放',
					'single': '单曲循环'
				};

				uni.showToast({
					title: modeText[this.playMode],
					icon: 'none'
				});
			},

			// 显示播放列表
			togglePlaylist() {
				this.showPlaylist = !this.showPlaylist;
			},

			// 隐藏播放列表
			hidePlaylist() {
				this.showPlaylist = false;
			},

			// 播放全部
			playAll() {
				this.playSongAtIndex(0);
				this.hidePlaylist();
			},

			// 清空播放列表（保留当前歌曲）
			clearPlaylist() {
				uni.showModal({
					title: '提示',
					content: '确定要清空播放列表吗?',
					success: (res) => {
						if (res.confirm) {
							const currentSong = this.currentSong;
							this.playlist = [currentSong];
							uni.showToast({
								title: '播放列表已清空',
								icon: 'none'
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
	src: url('data:font/woff2;charset=utf-8;base64,d09GMgABAAAAAAQsAAsAAAAACQAAAAPeAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDMgqEWIQlATYCJAMUCwwABCAFhGcHUBtmB8gOJcHAwAAAAADiIR77Y+7u7hIaIIkW88h0eoIkWqNYCVqhezJx+LNJ/Pty2nsSHkCdqoyqXbvw7HKWVRXvZOGhjIdHJnECnyMB1JtQbNgOQAEz4WsGCAD85v7X0+w/WCcvmzxyLqoKbBf+F8oFGgiMsf/NOl0arUm8AQrQ3hjbou5CnE8g2TRTOJ9TUAWuCnQpEA/bLQauJqIauEIPXdlbLKx4qaFnepoeAV6E3x//YBFXSZpMP/XwJOsE5T/tP1WVf5WLAZHHc0N7kbEBFOJJpeceCsIbKJLMv9bswM/QSz7tp/3/X0ZQK+0fHiGyRDRCp0fxIaG5/mkfDZ/2CYQTpEpSk71UUjI3gR+AvAf8QOUdYTI1ItsRcTWMV5+9EyfXM5Ph7PgRvLBzXVDk+2yVtaO9swKC/aXYNtZPnDy9Qjg52eLEoQnVj5V4OI3m4XTVt0FT3+ZxmLPNI78erRvNg1OTHUr6NbP35jk3jpUxvBrH8Oqsm+WtxqC989y9Zj60y2TQXRwZc7PxG9A+Vj4ELn7r1xw0xKmunhjz1XBMOzdOxvHk+Cqax6fxPDaBYd/eMXtnTw+P9xZN78OZ+5vT9C7MvCsmH85gbx1dMcHHgX07uxvsfJsb2F4cbRzdx+GhpZnT3Vy1cnH7v7Dkgx3YW2btsVnAj3Ky8aTEHDHv/wj0ZdH/WXSuN+1WXG9JfQG20bKQ43p7z5gzlN1v3IW5AxH5HwAKH6oGnNw9J98Eir2/bfIAOLcn/0/zZ3HuL/iiAgAkiDH/pfZrz4uu9BbSUoTFi24ggAGAJ+wKCz6Zt3VBUoUAKO6huhJWcV1Z5E/T6XADfkMSepD0LCHrmUfd2A3QM7AFrZ4DSLYutL/HT6QoClYtANa8AwhzV5BMvUU29wV1Y39Az8IfaJkHIrllPTvmeLJYqRgFOYb+QJPJKtbGCvkDYx0jtDw+Er4hZ/ahs6ZuuEdOsY/tKnM0UUZUcAavg/tImkaSYzSIo7rRtszlfj+9TK5iJZE5CBiL3E7QiImVsNawEvm8PRrK50cEecMXpZrJQ44a9dCboxxFfjHbSmYxDjVCKUQJnAHTgX0RaRSRLt4xMhCHVKeQVky67Hy6v7z2vBWQazsRKXLUaBhjQsbJUTZJy3Qpxo6lDQAA') format('woff2');
}

.iconfont {
	font-family: "iconfont" !important;
	font-size: 24px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.mode-loop:before {
	content: "⇄";
}

.mode-random:before {
	content: "↺";
}

.mode-single:before {
	content: "⇔";
}

/* 容器样式 */
.container {
	position: relative;
	height: 100vh;
	width: 100%;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	background-color: #000; /* 添加黑色背景作为基础 */
}

/* 背景效果 */
.bg-image {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-size: cover;
	background-position: center;
	z-index: -2;
	transform: scale(1.2);
	filter: blur(35px) saturate(180%);
	animation: slowZoom 20s infinite alternate ease-in-out;
	opacity: 1; /* 确保背景图片可见 */
}

.bg-mask {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(150deg,
		rgba(10, 10, 30, 0.85) 0%,
		rgba(60, 10, 80, 0.85) 50%,
		rgba(120, 40, 90, 0.85) 100%);
	z-index: -1;
}

/* 彩色光效 */
.color-effects {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 0; /* 提高z-index以确保显示 */
	overflow: hidden;
	pointer-events: none;
}

.color-circle {
	position: absolute;
	border-radius: 50%;
	filter: blur(80px);
	opacity: 0.5; /* 增加透明度以使其更明显 */
}

.circle1 {
	background: radial-gradient(circle, rgba(255, 102, 153, 0.6) 0%, rgba(255, 102, 153, 0) 70%);
	width: 60vh;
	height: 60vh;
	top: -10%;
	left: -10%;
	animation: float 15s infinite alternate ease-in-out;
}

.circle2 {
	background: radial-gradient(circle, rgba(102, 204, 255, 0.6) 0%, rgba(102, 204, 255, 0) 70%);
	width: 50vh;
	height: 50vh;
	bottom: -10%;
	right: -10%;
	animation: float 18s infinite alternate-reverse ease-in-out;
}

.circle3 {
	background: radial-gradient(circle, rgba(255, 204, 102, 0.6) 0%, rgba(255, 204, 102, 0) 70%);
	width: 40vh;
	height: 40vh;
	bottom: 30%;
	left: 10%;
	animation: float 20s infinite alternate ease-in-out;
}

/* Add a floating particle effect */
.particle-container {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	z-index: 0; /* 提高z-index以确保显示 */
	opacity: 0.6; /* 增加透明度 */
	pointer-events: none;
}

.particle {
	position: absolute;
	border-radius: 50%;
	background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.2) 100%);
	opacity: 0.15;
	box-shadow: 0 0 20rpx rgba(255, 255, 255, 0.8);
	animation: float 15s infinite ease-in-out;
}

.p1 {
	width: 120rpx;
	height: 120rpx;
	top: 15%;
	left: 15%;
	animation-delay: 0s;
}

.p2 {
	width: 180rpx;
	height: 180rpx;
	top: 75%;
	left: 70%;
	animation-delay: -2s;
}

.p3 {
	width: 150rpx;
	height: 150rpx;
	top: 40%;
	left: 80%;
	animation-delay: -5s;
}

.p4 {
	width: 100rpx;
	height: 100rpx;
	top: 80%;
	left: 25%;
	animation-delay: -8s;
}

.p5 {
	width: 200rpx;
	height: 200rpx;
	top: 20%;
	left: 65%;
	animation-delay: -12s;
}

.p6 {
	width: 160rpx;
	height: 160rpx;
	top: 60%;
	left: 30%;
	animation-delay: -7s;
}

.p7 {
	width: 140rpx;
	height: 140rpx;
	top: 35%;
	left: 20%;
	animation-delay: -9s;
}

.p8 {
	width: 180rpx;
	height: 180rpx;
	top: 10%;
	left: 75%;
	animation-delay: -4s;
}

@keyframes float {
	0% {
		transform: translate(0, 0) rotate(0deg);
	}
	25% {
		transform: translate(-20rpx, 50rpx) rotate(45deg);
	}
	50% {
		transform: translate(40rpx, 20rpx) rotate(90deg);
	}
	75% {
		transform: translate(10rpx, -30rpx) rotate(45deg);
	}
	100% {
		transform: translate(0, 0) rotate(0deg);
	}
}

@keyframes slowZoom {
	0% {
		transform: scale(1.2) translate(0, 0);
	}
	100% {
		transform: scale(1.4) translate(-10rpx, -10rpx);
	}
}

/* 顶部导航栏 */
.nav-bar {
	width: 100%;
	height: 100rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 30rpx;
	margin-top: 40rpx;
	z-index: 1;
}

.nav-left, .nav-right {
	width: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-icon, .share-icon {
	color: #FFFFFF;
	font-size: 48rpx;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.nav-center {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}

.nav-title-container {
	text-align: center;
	width: 100%;
}

.nav-title {
	color: #FFFFFF;
	font-size: 32rpx;
	font-weight: bold;
	display: block;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.nav-subtitle {
	color: rgba(255, 255, 255, 0.8);
	font-size: 24rpx;
	display: block;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* 主要内容区 */
.content-area {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 40rpx 30rpx;
	z-index: 1;
}

/* 唱片区域 */
.vinyl-area {
	position: relative;
	height: 700rpx;
	display: flex;
	justify-content: center;
	perspective: 1000px;
}

.vinyl-container {
	position: relative;
	width: 500rpx;
	height: 500rpx;
	margin-top: 60rpx;
	transition: transform 0.5s ease;
	filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5));
}

.vinyl-disc {
	position: absolute;
	width: 500rpx;
	height: 500rpx;
	border-radius: 50%;
	z-index: 1;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.5);
}

.vinyl-cover {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 300rpx;
	height: 300rpx;
	border-radius: 50%;
	transform: translate(-50%, -50%);
	z-index: 2;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.4);
}

.vinyl-reflection {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border-radius: 50%;
	background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 50%);
	z-index: 4;
	pointer-events: none;
}

.tonearm-container {
	position: absolute;
	top: -30rpx;
	right: 20%;
	width: 200rpx;
	height: 300rpx;
	z-index: 4;
	transform-origin: top right;
	transform: rotate(-30deg);
	transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
}

.tonearm-image {
	width: 100%;
	height: 100%;
}

.tonearm-container.playing {
	transform: rotate(0deg);
}

.vinyl-container.playing {
	animation: rotate 20s linear infinite;
}

.vinyl-container.paused {
	animation-play-state: paused;
}

@keyframes rotate {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

/* 歌词区域 */
.lyric-container {
	height: 250rpx;
	margin: 40rpx 0;
	overflow: hidden;
	border-radius: 20rpx;
}

.lyric-swiper {
	height: 100%;
}

.lyric-item {
	display: flex;
	justify-content: center;
	align-items: center;
}

.lyric-line {
	width: 100%;
	text-align: center;
	padding: 15rpx 30rpx;
	transition: all 0.3s;
}

.lyric-text {
	color: rgba(255, 255, 255, 0.7);
	font-size: 28rpx;
	line-height: 40rpx;
	transition: all 0.3s;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.active-lyric {
	transform: scale(1.05);
}

.active-lyric .lyric-text {
	color: #FFFFFF;
	font-weight: bold;
	font-size: 32rpx;
}

/* 控制区域 */
.controls-container {
	margin-bottom: 80rpx;
	padding: 30rpx;
	border-radius: 20rpx;
}

/* 进度条 */
.progress-bar {
	display: flex;
	align-items: center;
	margin-bottom: 40rpx;
}

.time-text {
	color: rgba(255, 255, 255, 0.8);
	font-size: 24rpx;
	width: 80rpx;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.progress-track {
	flex: 1;
	height: 4rpx;
	background-color: rgba(255, 255, 255, 0.2);
	border-radius: 2rpx;
	margin: 0 20rpx;
	position: relative;
}

.progress-inner {
	position: absolute;
	left: 0;
	top: 0;
	height: 100%;
	background: linear-gradient(to right, #FF6699, #FF9B82);
	border-radius: 2rpx;
}

.progress-handle {
	position: absolute;
	top: 50%;
	width: 20rpx;
	height: 20rpx;
	background-color: #FFFFFF;
	border-radius: 50%;
	transform: translate(-50%, -50%);
	box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.5);
}

/* 控制按钮 */
.player-controls {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 40rpx;
}

.control-btn {
	width: 80rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}

.control-btn .iconfont {
	color: #FFFFFF;
	font-size: 44rpx;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.play-btn {
	width: 120rpx;
	height: 120rpx;
	background: linear-gradient(135deg, #FF6699 0%, #FF9B82 100%);
	border-radius: 60rpx;
	box-shadow: 0 6rpx 20rpx rgba(255, 102, 153, 0.6);
}

.play-btn .play-icon {
	font-size: 60rpx;
}

/* 播放列表 */
.playlist-popup {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 100;
}

.playlist-mask {
	position: absolute;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(10px);
}

.playlist-content {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	border-radius: 30rpx 30rpx 0 0;
	padding-bottom: env(safe-area-inset-bottom);
	max-height: 70%;
	display: flex;
	flex-direction: column;
}

.playlist-header {
	padding: 40rpx 30rpx 20rpx;
	border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
}

.playlist-title {
	color: #FFFFFF;
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 20rpx;
}

.playlist-actions {
	display: flex;
	justify-content: space-between;
}

.action-btn {
	color: rgba(255, 255, 255, 0.8);
	font-size: 26rpx;
}

.action-btn .iconfont {
	font-size: 26rpx;
	margin-right: 10rpx;
}

.playlist-scroll {
	flex: 1;
	max-height: 700rpx;
}

.playlist-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 25rpx 30rpx;
	border-bottom: 1rpx solid rgba(255, 255, 255, 0.05);
}

.playlist-item.active {
	background-color: rgba(255, 102, 153, 0.2);
}

.item-info {
	display: flex;
	align-items: center;
	flex: 1;
	overflow: hidden;
}

.item-index {
	color: rgba(255, 255, 255, 0.6);
	font-size: 28rpx;
	width: 50rpx;
	text-align: center;
}

.item-details {
	margin-left: 20rpx;
	flex: 1;
	overflow: hidden;
}

.item-name {
	color: #FFFFFF;
	font-size: 28rpx;
	margin-bottom: 6rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: block;
}

.item-artist {
	color: rgba(255, 255, 255, 0.6);
	font-size: 24rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: block;
}

.playing-icon {
	color: #FF6699;
	font-size: 36rpx;
}

.safe-area-inset-top {
	padding-top: env(safe-area-inset-top);
}
</style>