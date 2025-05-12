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
				<image class="selectBtn" :src="item.icon" mode="aspectFit">{{item.image}}</image>
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
				<view class="song-card" v-for="(item, index) in dailyRecommendations" :key="index" @tap="playRecommendSong(item)">
					<image class="song-image" :src="item.coverImg" mode="aspectFill"></image>
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
						<image class="playlist-image" :src="item.coverImg || item.cover" mode="aspectFill"></image>
						<view class="play-count">
							<text class="iconfont play-icon">🎧</text>
							<text class="count-text">{{formatCount(item.playCount)}}</text>
						</view>
					</view>
					<text class="playlist-name">{{item.name}}</text>
					<text class="playlist-desc">{{item.count || item.songCount || 0}}首</text>
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
					<image class="artist-avatar" :src="item.cover" mode="aspectFill"></image>
					<text class="artist-name">{{item.name}}</text>
				</view>
			</scroll-view>
		</view>

		<!-- 最近播放 -->
		<view class="section">
			<view class="section-header">
				<view class="section-title">
					<text class="title-text">最近播放</text>
				</view>
				<text class="view-all" @tap="navigateToPlayHistory">查看全部</text>
			</view>

			<view class="recent-play-list">
				<view class="recent-play-item" v-for="(item, index) in recentlyPlayed.slice(0, 3)" :key="index" @tap="playSong(item)">
					<image class="recent-play-cover" :src="item.coverImg || defaultCover" mode="aspectFill"></image>
					<view class="recent-play-info">
						<text class="recent-play-name">{{item.name}}</text>
						<text class="recent-play-artist">{{item.artist}}</text>
					</view>
					<text class="iconfont play-icon">▶</text>
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
				<view class="volume-control" @tap.stop>
					<text class="iconfont volume-icon" @tap.stop="toggleMute">{{volume > 0 ? '🔊' : '🔇'}}</text>
					<slider class="volume-slider"
						min="0"
						max="100"
						:value="volume"
						@change="setVolume"
						step="1"
						activeColor="#ff6022"
						backgroundColor="#dddddd"
						block-size="12" />
				</view>
			</view>
		</view>

		<!-- 播放器小组件 -->
		<view class="mini-player" v-if="currentSong && currentSong._id && !showFullPlayer">
			<view class="mini-player-left" @tap="openFullPlayer">
				<image class="mini-song-cover" :src="currentSong.cover || defaultCover" mode="aspectFill"></image>
				<view class="mini-song-info">
					<text class="mini-song-name">{{currentSong.name || '未知歌曲'}}</text>
					<text class="mini-song-artist">{{currentSong.artist || '未知歌手'}}</text>
				</view>
			</view>
			<view class="mini-player-right">
				<text class="mini-player-btn play-pause-btn iconfont" @tap.stop="togglePlayStatus">
					{{isPlaying ? '⏸' : '▶'}}
				</text>
				<text class="mini-player-btn next-btn iconfont" @tap.stop="nextSong">⏭</text>
			</view>
		</view>

		<!-- 自定义底部导航栏 -->
		<CustomTabBar />

		<!-- 全屏播放器弹出层 -->
		<view class="full-player-popup" v-if="showFullPlayer" @tap="hideFullPlayer">
			<view class="full-player-mask"></view>
			<view class="full-player-content" @tap.stop>
				<!-- 背景模糊效果 -->
				<view class="bg-image" :style="{backgroundImage: 'url(' + currentSong.cover + ')'}"></view>
				<view class="bg-mask"></view>

				<!-- 顶部导航 -->
				<view class="nav-bar safe-area-inset-top">
					<view class="nav-left" @tap="hideFullPlayer">
						 <image class="back-icon" src="/static/icons/下拉.png" mode="aspectFit"></image>
					</view>
					<view class="nav-center">
						<view class="nav-title-container">
							<text class="nav-title">{{currentSong.name}}</text>
							<text class="nav-subtitle">{{currentSong.artist}}</text>
						</view>
					</view>
					<view class="nav-right" @tap="shareSong">
						 <image class="share-icon" src="/static/icons/分享.png" mode="aspectFit"></image>
					</view>
				</view>

				<!-- 主要内容区 -->
				<view class="content-area">
					<!-- 唱片动画区 -->
					<view class="vinyl-area">
						<view class="vinyl-container" :class="{ 'playing': isPlaying, 'paused': !isPlaying }">
							<image class="vinyl-disc" src="/static/胶片背景.jpg" mode="aspectFill"></image>
							<image class="vinyl-cover" :src="currentSong.coverImg" mode="aspectFill"></image>
							<view class="vinyl-reflection"></view>
						</view>
					</view>

					<!-- 播放控制区域 -->
					<view class="controls-container glass-card">
						<!-- 播放进度条 -->
						<view class="progress-bar">
							<text class="time-text current-time">{{formatTime(currentPlayTime)}}</text>
							<view class="progress-track">
								<view class="progress-inner" :style="{width: progressPercentage + '%'}"></view>
								<view class="progress-handle" :style="{left: progressPercentage + '%'}"></view>
							</view>
							<text class="time-text total-time">{{formatTime(currentSong.duration || 0)}}</text>
						</view>

						<!-- 播放控制按钮 -->
						<view class="player-controls">
							<view class="control-btn prev-btn" @tap="prevSong">
								<text class="iconfont">⏮</text>
							</view>
							<view class="control-btn play-btn" @tap="togglePlayStatus">
								<text class="iconfont play-icon">{{isPlaying ? '⏸' : '▶'}}</text>
							</view>
							<view class="control-btn next-btn" @tap="nextSong">
								<text class="iconfont">⏭</text>
							</view>
						</view>

						<!-- 音量控制 -->
						<view class="volume-control-full">
							<text class="iconfont volume-icon" @tap="toggleMute">{{volume > 0 ? '🔊' : '🔇'}}</text>
							<slider class="volume-slider-full"
								min="0"
								max="100"
								:value="volume"
								@change="setVolume"
								step="1"
								activeColor="#ff6022"
								backgroundColor="#dddddd"
								block-size="12" />
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import CustomTabBar from '@/components/CustomTabBar.vue'
	import request from '@/services/api/request'
	import { isAuthenticated } from '@/services/api/request'

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
                        icon: '/static/icons/排行榜.png',
                        url: '/pages/music/rank'
                    },
                    {
                        title: '歌单',
                        icon: '/static/icons/歌单.png',
                        url: '/pages/music/playlist'
                    },
                    {
                        title: '电台',
                        icon: '/static/icons/电台.png',
                        url: '/pages/music/radio'
                    },
                    {
                        title: '听书',
                        icon: '/static/icons/听书.png',
                        url: '/pages/music/live'
                    }
                ],
				dailyRecommendations: [], // 每日推荐歌曲，从后端获取
				hotPlaylists: [], // 热门歌单，从后端获取
				recommendedArtists: [], // 推荐歌手，从后端获取
				recentlyPlayed: [], // 最近播放，从后端获取
				isPlaying: false,
				currentSong: null,
				loading: {
					recommendations: true,
					playlists: true,
					artists: true,
					recentlyPlayed: true
				},
				volume: 80, // 音量，范围0-100
				prevVolume: 80, // 存储静音前的音量
				audioContext: null, // 音频播放器实例
				playTimer: null, // 进度条更新定时器
				showFullPlayer: false, // 是否显示全屏播放器
				currentPlayTime: 0, // 当前播放时间
				progressPercentage: 0, // 播放进度百分比
				defaultCover: '/static/default-cover.jpg', // 默认封面
			}
		},
		methods: {
			selectCategory(index) {
				this.selectedCategory = index;
				// 跳转到对应的分类页面
				uni.navigateTo({
					url: this.categories[index].url
				});
			},
			formatCount(count) {
				if (!count && count !== 0) return '0';

				if (count < 10000) {
					return count.toString();
				} else if (count < 100000000) {
					return Math.floor(count / 10000) + '万';
				} else {
					return Math.floor(count / 100000000) + '亿';
				}
			},
			// 播放歌曲
			async playSong(song) {
				try {
					// 设置当前播放歌曲
					this.currentSong = song;

					// 获取歌曲的播放URL（如果需要从API获取）
					let playUrl = song.url;

					// 如果歌曲对象中只有ID没有URL，则需要从API获取
					if (!playUrl && song._id) {
						try {
							const response = await request.get(`/music/songs/${song._id}/url`, {}, true);
							if (response && response.url) {
								playUrl = response.url;
								song.url = playUrl; // 更新歌曲对象中的URL
							}
						} catch (error) {
							console.error('获取播放URL失败:', error);
							uni.showToast({
								title: '获取歌曲失败，请稍后再试',
								icon: 'none'
							});
							return;
						}
					}

					if (!playUrl) {
						uni.showToast({
							title: '歌曲链接无效',
							icon: 'none'
						});
						return;
					}

					// 创建或重用音频播放实例
					if (!this.audioContext) {
						this.audioContext = uni.createInnerAudioContext();

						// 配置音频播放器
						this.audioContext.onPlay(() => {
							console.log('开始播放');
							this.isPlaying = true;
							// 开始更新进度条
							this.startProgressUpdate();
						});

						this.audioContext.onPause(() => {
							console.log('暂停播放');
							this.isPlaying = false;
							// 停止更新进度条
							this.stopProgressUpdate();
						});

						this.audioContext.onStop(() => {
							console.log('停止播放');
							this.isPlaying = false;
							// 停止更新进度条
							this.stopProgressUpdate();
						});

						this.audioContext.onEnded(() => {
							console.log('播放结束');
							this.isPlaying = false;
							// 停止更新进度条
							this.stopProgressUpdate();
							// 播放下一首歌曲
							this.nextSong();
						});

						this.audioContext.onError((res) => {
							console.error('播放错误:', res);
							this.isPlaying = false;
							// 停止更新进度条
							this.stopProgressUpdate();
							uni.showToast({
								title: '播放失败，请稍后再试',
								icon: 'none'
							});
						});

						// 监听音频时间更新事件
						this.audioContext.onTimeUpdate(() => {
							// 更新播放时间和进度
							this.currentPlayTime = this.audioContext.currentTime;
							if (this.audioContext.duration > 0) {
								this.progressPercentage = (this.audioContext.currentTime / this.audioContext.duration) * 100;
							}
						});
					} else {
						// 如果已经有实例，先停止当前播放
						this.audioContext.stop();
					}

					// 设置音频源并播放
					this.audioContext.src = playUrl;
					this.audioContext.volume = this.volume / 100; // 设置音量
					this.audioContext.play();
					this.isPlaying = true; // 确保UI状态同步

					// 记录播放历史
					this.recordPlayHistory(song);

					console.log('播放歌曲:', song.name, '链接:', playUrl);
				} catch (error) {
					console.error('播放歌曲出错:', error);
					uni.showToast({
						title: '播放出错，请稍后再试',
						icon: 'none'
					});
				}
			},
			// 在每日推荐中播放歌曲
			playRecommendSong(song) {
				this.playSong(song);
				// 不自动打开全屏播放器，用户可以从小组件点击进入
			},
			// 切换播放状态
			togglePlayStatus() {
				if (!this.currentSong || !this.audioContext) return;

				if (this.isPlaying) {
					this.audioContext.pause();
					this.isPlaying = false;
				} else {
					this.audioContext.play();
					this.isPlaying = true;
				}
			},
			// 播放下一首歌曲
			nextSong() {
				if (!this.currentSong) return;

				// 查找当前歌曲在推荐列表中的位置
				const currentIndex = this.dailyRecommendations.findIndex(song =>
					song._id === this.currentSong._id || song.name === this.currentSong.name
				);

				if (currentIndex !== -1 && currentIndex < this.dailyRecommendations.length - 1) {
					// 播放下一首歌曲
					this.playSong(this.dailyRecommendations[currentIndex + 1]);
				} else {
					// 如果是最后一首或找不到当前歌曲，则播放第一首
					if (this.dailyRecommendations.length > 0) {
						this.playSong(this.dailyRecommendations[0]);
					}
				}
			},
			// 开始更新进度条
			startProgressUpdate() {
				// 清除可能存在的定时器
				this.stopProgressUpdate();

				// 创建定时器每秒更新进度
				this.playTimer = setInterval(() => {
					if (!this.audioContext) return;

					// 计算进度百分比
					if (this.audioContext.duration > 0) {
						this.progressWidth = (this.audioContext.currentTime / this.audioContext.duration) * 100;
						this.currentPlayTime = this.audioContext.currentTime;
						this.progressPercentage = (this.audioContext.currentTime / this.audioContext.duration) * 100;
					}
				}, 1000);
			},

			// 停止更新进度条
			stopProgressUpdate() {
				if (this.playTimer) {
					clearInterval(this.playTimer);
					this.playTimer = null;
				}
			},
			openPlaylist(playlist) {
				// 跳转到歌单详情页
				// 检查数据结构，适配不同的ID字段名
				const playlistId = playlist._id || playlist.id || playlist.playlistId;

				if (!playlistId) {
					console.error('无法跳转：歌单ID不存在', playlist);
					uni.showToast({
						title: '无法打开歌单',
						icon: 'none'
					});
					return;
				}

				console.log('跳转到歌单详情页:', playlistId);

				uni.navigateTo({
					url: `/pages/music/playlist-detail?id=${playlistId}`,
					fail: (err) => {
						console.error('跳转失败:', err);
						uni.showToast({
							title: '跳转失败，请稍后再试',
							icon: 'none'
						});
					}
				});
			},
			openArtist(artist) {
				// 跳转到歌手详情页
				uni.navigateTo({
					url: `/pages/music/artist-detail?id=${artist._id}`
				});
			},
			openFullPlayer() {
				// 显示全屏播放器
				this.showFullPlayer = true;
			},
			hideFullPlayer() {
				// 隐藏全屏播放器
				this.showFullPlayer = false;
				// 确保关闭后小组件显示
				if (this.currentSong._id) {
					this.showMiniPlayer = true;
				}
			},
			closeFullPlayer() {
				this.showFullPlayer = false;
			},
			//获取每日推荐歌曲
			async fetchDailyRecommendations() {
				this.loading.recommendations = true;
				try {
					// 使用request工具来发送请求，自动携带认证信息
					const response = await request.get('/music/daily-recommendations', {}, true);

					console.log('每日推荐响应:', response);

					// 处理数据
					if (Array.isArray(response)) {
						this.dailyRecommendations = response;
					} else if (response.songs) {
						this.dailyRecommendations = response.songs;
					} else if (response.data) {
						this.dailyRecommendations = response.data;
					}

					console.log('每日推荐获取成功:', this.dailyRecommendations);
				} catch (error) {
					console.error('获取每日推荐出错:', error);
					// 错误已被request工具处理，无需额外处理
				} finally {
					this.loading.recommendations = false;
				}
			},
			// 获取热门歌单
			async fetchHotPlaylists() {
				this.loading.playlists = true;
				try {
					// 使用request工具来发送请求
					const response = await request.get('/music/playlists/hot', {}, true);

					console.log('热门歌单响应:', response);

					// 处理数据
					if (Array.isArray(response)) {
						this.hotPlaylists = response;
					} else if (response.playlists) {
						this.hotPlaylists = response.playlists;
					} else if (response.data) {
						this.hotPlaylists = response.data;
					}

					console.log('热门歌单获取成功:', this.hotPlaylists);
				} catch (error) {
					console.error('获取热门歌单出错:', error);
					// 错误已被request工具处理
				} finally {
					this.loading.playlists = false;
				}
			},
			// 获取推荐歌手
			async fetchRecommendedArtists() {
				this.loading.artists = true;
				try {
					// 使用request工具来发送请求
					const response = await request.get('/music/artists/recommended', {}, true);

					console.log('推荐歌手响应:', response);

					// 处理数据
					if (Array.isArray(response)) {
						this.recommendedArtists = response;
					} else if (response.artists) {
						this.recommendedArtists = response.artists;
					} else if (response.data) {
						this.recommendedArtists = response.data;
					}

					console.log('推荐歌手获取成功:', this.recommendedArtists);
				} catch (error) {
					console.error('获取推荐歌手出错:', error);
				} finally {
					this.loading.artists = false;
				}
			},
			// 获取最近播放
			async fetchRecentlyPlayed() {
				this.loading.recentlyPlayed = true;
				try {
					// 使用request工具来发送请求
					const response = await request.get('/music/history', {}, true);

					console.log('最近播放响应:', response);

					// 处理数据
					if (Array.isArray(response)) {
						this.recentlyPlayed = response;
					} else if (response.songs) {
						this.recentlyPlayed = response.songs;
					} else if (response.data) {
						this.recentlyPlayed = response.data;
					}

					console.log('最近播放获取成功:', this.recentlyPlayed);
				} catch (error) {
					console.error('获取最近播放出错:', error);
					// 错误已被request工具处理
				} finally {
					this.loading.recentlyPlayed = false;
				}
			},
			// 记录播放历史
			async recordPlayHistory(song) {
				try {
					console.log('记录播放历史:', song.name);
					// 使用request工具来发送请求
					await request.post('/music/history', { songId: song._id }, true);

					console.log('播放历史记录成功:', song.name);
				} catch (error) {
					console.error('记录播放历史失败:', error);
					// 错误已被request工具处理
				}
			},
			// 设置音量
			setVolume(e) {
				const newVolume = e.detail.value;
				this.volume = newVolume;

				// 设置音频实例的音量
				if (this.audioContext) {
					this.audioContext.volume = newVolume / 100;
				}

				// 如果音量不为0，更新prevVolume
				if (newVolume > 0) {
					this.prevVolume = newVolume;
				}

				console.log('音量已设置为:', newVolume);
			},

			// 切换静音状态
			toggleMute() {
				if (this.volume > 0) {
					// 当前有声音，切换到静音
					this.prevVolume = this.volume; // 保存当前音量
					this.volume = 0;
				} else {
					// 当前是静音，恢复到之前的音量
					this.volume = this.prevVolume || 80;
				}

				// 设置音频实例的音量
				if (this.audioContext) {
					this.audioContext.volume = this.volume / 100;
				}

				console.log('静音状态切换:', this.volume > 0 ? '有声音' : '静音');
			},
			shareSong() {
				uni.share({
					provider: 'weixin',
					scene: 'WXSceneSession',
					type: 0,
					title: this.currentSong.name,
					summary: this.currentSong.artist,
					imageUrl: this.currentSong.cover,
					href: 'https://example.com',
					success: (res) => {
						console.log('分享成功:', res);
					},
					fail: (err) => {
						console.error('分享失败:', err);
					}
				});
			},
			formatTime(time) {
				const minutes = Math.floor(time / 60);
				const seconds = Math.floor(time % 60);
				return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
			},
			navigateToPlayHistory() {
				uni.navigateTo({
					url: '/pages/music/play-history'
				});
			},
		},
		onLoad() {
			// 检查用户是否已登录
			if (!isAuthenticated()) {
				console.warn('用户未登录，需要先登录才能访问音乐功能');

				// 显示登录提示
				uni.showModal({
					title: '需要登录',
					content: '请先登录后再访问音乐功能',
					confirmText: '去登录',
					cancelText: '取消',
					success: (res) => {
						if (res.confirm) {
							// 跳转到登录页面
							uni.navigateTo({
								url: '/pages/login/login'
							});
						} else {
							// 用户取消，返回上一页
							uni.navigateBack();
						}
					}
				});

				return; // 阻止后续API调用
			}

			// 页面加载时获取所有数据
			this.fetchDailyRecommendations();
			this.fetchHotPlaylists();
			this.fetchRecommendedArtists();
			this.fetchRecentlyPlayed();

			// 测试示例：设置一个默认的当前播放歌曲（实际应用中可能从历史记录或存储中获取）
			// 在实际应用中，这里可能会从缓存或状态管理中获取当前播放的歌曲
			uni.getStorage({
				key: 'currentSong',
				success: (res) => {
					this.currentSong = res.data;
				},
				fail: () => {
					// 没有缓存的情况，可以设置为空或默认歌曲
					this.currentSong = null;
				}
			});
		},
		// 组件销毁时释放资源
		beforeDestroy() {
			// 停止更新进度条
			this.stopProgressUpdate();

			// 释放音频实例
			if (this.audioContext) {
				this.audioContext.destroy();
				this.audioContext = null;
			}
		},
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
	margin: 30rpx 20rpx -80rpx;
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
	margin-bottom: 6rpx;
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
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
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
.recent-play-list {
	background-color: #FFFFFF;
	border-radius: 12rpx;
	overflow: hidden;
}

.recent-play-item {
	display: flex;
	align-items: center;
	padding: 16rpx 0;
	border-bottom: 1rpx solid #F5F5F5;
}

.recent-play-item:last-child {
	border-bottom: none;
}

.recent-play-cover {
	width: 90rpx;
	height: 90rpx;
	border-radius: 8rpx;
	margin-right: 20rpx;
}

.recent-play-info {
	flex: 1;
	overflow: hidden;
}

.recent-play-name {
	font-size: 28rpx;
	font-weight: 500;
	color: #333;
	margin-bottom: 6rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.recent-play-artist {
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

.volume-control {
	margin-left: 30rpx;
	display: flex;
	align-items: center;
}

.volume-icon {
	font-size: 36rpx;
	margin-right: 10rpx;
}

.volume-slider {
	width: 100rpx;
	margin-left: 10rpx;
}

/* 播放器小组件样式 */
.mini-player {
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

.mini-player-left {
	flex: 1;
	display: flex;
	align-items: center;
}

.mini-song-cover {
	width: 60rpx;
	height: 60rpx;
	border-radius: 8rpx;
	margin-right: 20rpx;
}

.mini-song-info {
	flex: 1;
	overflow: hidden;
}

.mini-song-name {
	font-size: 24rpx;
	font-weight: 500;
	color: #333;
	margin-bottom: 4rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.mini-song-artist {
	font-size: 20rpx;
	color: #999;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.mini-player-right {
	width: 120rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.mini-player-btn {
	font-size: 36rpx;
	color: #333;
}

.play-pause-btn {
	margin-right: 20rpx;
}

/* 全屏播放器样式 */
.full-player-popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 1000;
	display: flex;
	align-items: center;
	justify-content: center;
}

.full-player-mask {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1000;
}

.full-player-content {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
	z-index: 1001;
	display: flex;
	flex-direction: column;
}

.bg-image {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-size: cover;
	background-position: center;
	filter: blur(20rpx);
	transform: scale(1.2);
	z-index: -1;
}

.bg-mask {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(150deg,
		rgba(10, 10, 30, 0.85) 0%,
		rgba(60, 10, 80, 0.85) 50%,
		rgba(120, 40, 90, 0.85) 100%);
	z-index: -1;
}

.nav-bar {
	position: relative;
	height: 88rpx;
	padding: 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	z-index: 1003;
}

.nav-left {
	width: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-icon {
	font-size: 48rpx;
	color: #FFFFFF;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.nav-center {
	flex: 1;
	overflow: hidden;
	margin: 0 20rpx;
}

.nav-title-container {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.nav-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #FFFFFF;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.nav-subtitle {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.nav-right {
	width: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.share-icon {
	width: 60%;
	font-size: 48rpx;
	color: #FFFFFF;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.content-area {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 40rpx 30rpx;
	z-index: 1;
}

.vinyl-area {
	position: relative;
	height: 700rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 40rpx;
}

.vinyl-container {
	position: relative;
	width: 500rpx;
	height: 500rpx;
	border-radius: 50%;
	filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5));
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

.vinyl-disc {
	position: absolute;
	width: 100%;
	height: 100%;
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
	z-index: 3;
	pointer-events: none;
}

.controls-container {
	background-color: rgba(255, 255, 255, 0.1);
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 40rpx;
	backdrop-filter: blur(10px);
}

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

.player-controls {
	display: flex;
	justify-content: space-around;
	align-items: center;
	margin-bottom: 30rpx;
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
	padding-left: 10rpx;
	padding-bottom:6rpx;
}

.volume-control-full {
	display: flex;
	align-items: center;
}

.volume-slider-full {
	flex: 1;
	margin-left: 20rpx;
}

.safe-area-inset-top {
	padding-top: env(safe-area-inset-top);
}

.glass-card {
	background-color: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(10px);
	border-radius: 20rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.selectBtn {
  position: relative;
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

</style>