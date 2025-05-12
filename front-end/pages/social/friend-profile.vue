<template>
	<view class="container">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @tap="goBack">
				<text class="iconfont back-icon">&#xe602;</text>
			</view>
			<view class="nav-title">
				<text>好友资料</text>
			</view>
			<view class="nav-right">
				<text class="iconfont option-icon" @tap="showOptions">&#xe612;</text>
			</view>
		</view>

		<!-- 加载中提示 -->
		<view class="loading-tip" v-if="loading">
			<text class="loading-text">加载中...</text>
		</view>

		<!-- 错误提示 -->
		<view class="error-container" v-if="error" @tap="retryLoading">
			<view class="error-icon">!</view>
			<view class="error-message">连接服务器超时，点击屏幕重试</view>
		</view>

		<!-- 个人资料卡 -->
		<view class="profile-card" v-if="!loading && !error">
			<!-- 背景图 -->
			<view class="cover-image">
				<image :src="userInfo.coverImage" mode="aspectFill"></image>
			</view>

			<!-- 用户基本信息 -->
			<view class="user-basic-info">
				<image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
				<view class="user-name-container">
					<text class="user-name">{{userInfo.nickname}}</text>
					<view class="user-id">
						<text>MutiLife ID: {{userInfo.id}}</text>
						<text class="copy-id" @tap="copyUserId">复制</text>
					</view>
				</view>
			</view>

			<!-- 快捷操作按钮 -->
			<view class="quick-actions">
				<view class="action-btn" @tap="sendMessage">
					<text class="iconfont action-icon">&#xe601;</text>
					<text class="action-text">发消息</text>
				</view>
				<view class="action-btn" @tap="makeVoiceCall">
					<text class="iconfont action-icon">&#xe631;</text>
					<text class="action-text">语音通话</text>
				</view>
				<view class="action-btn" @tap="makeVideoCall">
					<text class="iconfont action-icon">&#xe615;</text>
					<text class="action-text">视频通话</text>
				</view>
			</view>
		</view>

		<!-- 资料信息 -->
		<view class="info-section" v-if="!loading && !error">
			<view class="info-item" v-if="userInfo.location">
				<text class="iconfont info-icon">&#xe613;</text>
				<text class="info-text">{{userInfo.location}}</text>
			</view>
			<view class="info-item" v-if="userInfo.birthday">
				<text class="iconfont info-icon">&#xe617;</text>
				<text class="info-text">{{formatBirthday}}</text>
			</view>
			<view class="info-item">
				<text class="iconfont info-icon">&#xe619;</text>
				<text class="info-text">加入于 {{formatJoinDate}}</text>
			</view>
		</view>

		<!-- 朋友关系 -->
		<view class="relation-section" v-if="!loading && !error">
			<view class="section-header">
				<text class="section-title">朋友关系</text>
			</view>
			<view class="relation-info">
				<text class="relation-text">{{relationInfo}}</text>
				<view class="relation-tags" v-if="userInfo.tags && userInfo.tags.length > 0">
					<view class="tag-item" v-for="(tag, index) in userInfo.tags" :key="index">
						{{tag}}
					</view>
					<view class="edit-tags" @tap="editTags">
						<text class="iconfont edit-icon">&#xe639;</text>
					</view>
				</view>
				<view class="add-tags" v-else @tap="editTags">
					<text class="add-tags-text">添加标签</text>
				</view>
			</view>
		</view>

		<!-- 朋友动态 -->
		<view class="moment-section" v-if="!loading && !error">
			<view class="section-header">
				<text class="section-title">朋友动态</text>
				<text class="view-all" @tap="viewAllMoments">查看全部</text>
			</view>
			<view class="moment-preview" v-if="moments.length > 0">
				<view class="moment-item" v-for="(item, index) in moments" :key="index" @tap="viewMoment(item)">
					<image class="moment-image" :src="item.images[0]" mode="aspectFill"></image>
					<view class="moment-info">
						<text class="moment-text">{{item.content}}</text>
						<text class="moment-time">{{item.timeAgo}}</text>
					</view>
				</view>
			</view>
			<view class="no-moment" v-else>
				<text class="no-moment-text">暂无动态</text>
			</view>
		</view>

		<!-- 互动记录 -->
		<view class="interaction-section" v-if="!loading && !error">
			<view class="section-header">
				<text class="section-title">互动记录</text>
			</view>
			<view class="interaction-list">
				<view class="interaction-item" v-for="(item, index) in interactions" :key="index">
					<text class="interaction-text">{{item.text}}</text>
					<text class="interaction-time">{{item.time}}</text>
				</view>
				<view class="no-more" v-if="interactions.length > 0">
					<text class="no-more-text">没有更多互动记录</text>
				</view>
				<view class="no-interaction" v-else>
					<text class="no-interaction-text">暂无互动记录</text>
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="bottom-actions" v-if="!loading && !error">
			<button class="bottom-btn unfriend-btn" @tap="unfriend">解除好友关系</button>
			<button class="bottom-btn block-btn" @tap="blockUser">加入黑名单</button>
		</view>
	</view>
</template>

<script>
	import moment from '@/utils/moment-wrapper.js'
	import { getUserById } from '@/services/api/user.js'
	import { getFriendship } from '@/services/api/friend.js'

	export default {
		data() {
			return {
				loading: true,
				error: null,
				userId: null,
				userInfo: {
					id: '',
					nickname: '',
					avatar: '/static/images/avatar/default.jpg',
					coverImage: '/static/images/cover/default.jpg',
					location: '',
					birthday: '',
					joinDate: '',
					tags: [],
					friendSince: ''
				},
				// 模拟数据，用于API调用失败时展示
				mockData: false,
				moments: [],
				interactions: []
			}
		},
		onLoad(options) {
			// 获取路由参数中的用户ID
			if (options.id) {
				this.userId = options.id;
				this.loadUserInfo();
			} else {
				this.error = '未找到用户ID';
				this.loading = false;
				uni.showToast({
					title: '加载失败：未找到用户ID',
					icon: 'none'
				});
			}
		},
		computed: {
			formatBirthday() {
				if (!this.userInfo.birthday) return '';
				return moment(this.userInfo.birthday).format('YYYY年MM月DD日');
			},
			formatJoinDate() {
				if (!this.userInfo.joinDate) return '';
				return moment(this.userInfo.joinDate).format('YYYY年MM月DD日');
			},
			relationInfo() {
				if (!this.userInfo.friendSince) return '暂无朋友关系';
				const friendDays = moment().diff(moment(this.userInfo.friendSince), 'days');
				return `成为好友 ${friendDays} 天`;
			}
		},
		methods: {
			// 重试加载
			retryLoading() {
				if (this.userId) {
					this.error = null;
					this.loadUserInfo();
				} else {
					uni.navigateBack();
				}
			},
			
			// 加载用户信息
			loadUserInfo() {
				this.loading = true;
				this.error = null;
				
				console.log('正在加载用户资料，用户ID:', this.userId);
				
				// 创建本地测试数据（如果API调用失败可以显示）
				const testUserInfo = {
					id: this.userId,
					nickname: '测试用户',
					avatar: '/static/images/avatar/default.jpg',
					coverImage: '/static/images/cover/default.jpg',
					location: '中国',
					birthday: '1990-01-01',
					joinDate: new Date().toISOString(),
					bio: '这是一个测试用户资料',
					friendSince: new Date(Date.now() - 30*24*60*60*1000).toISOString(), // 30天前
					tags: ['朋友', '同事']
				};
				
				// 添加超时处理
				const timeoutPromise = new Promise((_, reject) => {
					setTimeout(() => reject(new Error('请求超时，请检查网络连接')), 10000);
				});
				
				// 使用Promise.race进行超时处理
				Promise.race([
					getUserById(this.userId),
					timeoutPromise
				])
				.then(response => {
					console.log('获取用户资料成功:', response);
					if (!response || !response.data) {
						throw new Error('获取用户资料失败：服务器返回数据格式错误');
					}
					
					this.userInfo = {
						...this.userInfo,
						...response.data
					};
					this.mockData = false;
					
					// 获取朋友关系
					return this.loadFriendship();
				})
				.then(() => {
					// 加载用户的动态和互动记录
					this.loadUserMoments();
					this.loadInteractions();
				})
				.catch(error => {
					console.error('加载用户资料失败:', error);
					this.error = error.message || '加载失败，请稍后重试';
					
					// 如果API调用失败，使用测试数据
					if (confirm('无法连接到服务器，是否使用本地测试数据？')) {
						console.log('使用测试数据');
						this.userInfo = testUserInfo;
						this.error = null;
						this.mockData = true;
					} else {
						uni.showToast({
							title: '连接服务器超时，点击重试',
							icon: 'none',
							duration: 2000
						});
					}
				})
				.finally(() => {
					this.loading = false;
				});
			},
			
			// 加载朋友关系信息
			loadFriendship() {
				if (this.mockData) return Promise.resolve();
				
				return getFriendship(this.userId)
					.then(response => {
						if (response && response.data) {
							this.userInfo.friendSince = response.data.createdAt;
						}
					})
					.catch(error => {
						console.error('加载朋友关系失败:', error);
						// 静默失败，不影响界面展示
					});
			},
			
			// 加载用户动态
			loadUserMoments() {
				// 示例动态数据，实际应从API获取
				this.moments = [
					{
						id: 1,
						content: '今天去看了一场超棒的音乐会，贝多芬的钢琴协奏曲太震撼了！',
						images: ['/static/images/moments/1.jpg'],
						timeAgo: '2小时前'
					},
					{
						id: 2,
						content: '分享一首最近很喜欢的歌曲，太洗脑了',
						images: ['/static/images/moments/2.jpg'],
						timeAgo: '昨天'
					}
				];
			},
			
			// 加载互动记录
			loadInteractions() {
				// 示例互动数据，实际应从API获取
				this.interactions = [
					{
						type: 'chat',
						text: '聊天了23分钟',
						time: '今天 14:30'
					},
					{
						type: 'moment',
						text: '点赞了对方的动态',
						time: '昨天 20:15'
					},
					{
						type: 'gift',
						text: '收到了礼物"鲜花"',
						time: '2023-03-10'
					}
				];
			},

			// 返回上一页
			goBack() {
				uni.navigateBack();
			},

			// 显示更多选项
			showOptions() {
				uni.showActionSheet({
					itemList: ['查看朋友圈', '设置备注', '加入收藏', '投诉'],
					success: (res) => {
						console.log('选择了选项:', res.tapIndex);
					}
				});
			},

			// 复制用户ID
			copyUserId() {
				uni.setClipboardData({
					data: this.userInfo.id,
					success: () => {
						uni.showToast({
							title: 'ID已复制',
							icon: 'success'
						});
					}
				});
			},

			// 发送消息
			sendMessage() {
				uni.navigateTo({
					url: `/pages/social/chat?id=${this.userInfo.id}&name=${this.userInfo.nickname}`
				});
			},

			// 发起语音通话
			makeVoiceCall() {
				uni.showToast({
					title: '发起语音通话',
					icon: 'none'
				});
			},

			// 发起视频通话
			makeVideoCall() {
				uni.showToast({
					title: '发起视频通话',
					icon: 'none'
				});
			},

			// 编辑标签
			editTags() {
				const tags = this.userInfo.tags || [];
				uni.showActionSheet({
					itemList: tags.length > 0 ? ['编辑标签', '删除全部标签'] : ['添加标签'],
					success: (res) => {
						if (tags.length > 0) {
							if (res.tapIndex === 0) {
								// 编辑标签
								this.showTagEditor();
							} else if (res.tapIndex === 1) {
								// 删除全部标签
								this.userInfo.tags = [];
								uni.showToast({
									title: '已删除全部标签',
									icon: 'success'
								});
							}
						} else {
							// 添加标签
							this.showTagEditor();
						}
					}
				});
			},

			// 显示标签编辑器
			showTagEditor() {
				// 实际开发中，这里应该跳转到标签编辑页面或显示编辑弹窗
				uni.showToast({
					title: '标签编辑功能开发中',
					icon: 'none'
				});
			},

			// 查看全部动态
			viewAllMoments() {
				uni.navigateTo({
					url: `/pages/social/moments?id=${this.userInfo.id}`
				});
			},

			// 查看单条动态
			viewMoment(moment) {
				uni.navigateTo({
					url: `/pages/social/moment-detail?id=${moment.id}`
				});
			},

			// 解除好友关系
			unfriend() {
				uni.showModal({
					title: '解除好友关系',
					content: `确定要与"${this.userInfo.nickname}"解除好友关系吗？`,
					success: (res) => {
						if (res.confirm) {
							uni.showToast({
								title: '已解除好友关系',
								icon: 'success',
								success: () => {
									setTimeout(() => {
										uni.navigateBack();
									}, 1500);
								}
							});
						}
					}
				});
			},

			// 加入黑名单
			blockUser() {
				uni.showModal({
					title: '加入黑名单',
					content: `确定要将"${this.userInfo.nickname}"加入黑名单吗？\n加入黑名单后将自动解除好友关系，且对方无法向你发起好友申请。`,
					success: (res) => {
						if (res.confirm) {
							uni.showToast({
								title: '已加入黑名单',
								icon: 'success',
								success: () => {
									setTimeout(() => {
										uni.navigateBack();
									}, 1500);
								}
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
	src: url('data:font/woff2;charset=utf-8;base64,d09GMgABAAAAAAUwAAsAAAAACegAAATiAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDSAqHVIZkATYCJAMYCw4ABCAFhGcHURt5CMgekiSQQAEFFAAUUIByPLzfj33PvS/fkCqk2dWTRCKJplokk5QWEh41SCx0hvr/32/ffdyrRCnirBaJSFasLNrEInE0Xag6q1n48/l8PB/Q93mWy1hjUft9nMcBDSjCzgLJHsAb4tzjHH9Ac4GYQnOBzQSTRHsM4iqnRCYjHlhfXrpZ/pKP5+HmnoJAFgkVqVGV8z9v9uc3aV6k0AhtQxcSVWDXDqsyqcwXa43V6sI4JbA1E2gaNS3YxdHpBcgVcC+gsHTABSiAU8o5pKHWVRtylkWPkKqbTtIN8OC+f/z1hihJlcG9e3KQfwOHX3WXp6mTZjY7C24WAzsyKLAKyMJibeE80gEuC01T6fwmHdCklZKvrnzV/mq4rLZ+2VF/+OeRBqtGfeTOfWGm+JdHlGRFidWU3JDW0pnlq+Yp8evKySA1kkCaPGlHmlU+SMRVkZFmpIxOKlNJQVOQfhfQDvAu0HkgTLtbp6i3d93Kkzu3KlUKhUx+FYjYC3SoRuPbBwjvqgE5ePLkkXy5QiHf+3Oe8FUqFNrRjCfCdOTo+ZNzl44HDs7vzcvw/jVu4JUDf9CsF7wHBH/Iz/HXFIQy+gJuX/F+QQ9MiWXieBOfizx5CRrZ30HGGOTEbZYFDGcxe01JwazYUvvV0n17S2PnwCR/zdzzT5Pkvvd2cvBgjhhQsAz2HgASF4SBwsVSXKUohgtXLRJXKuQyDlQBpZwr5KCyWc+f7Z8XHQhEh/vlX+j1qRfiBwY0h3VanB3l4MPb+k+J+z+v9ynGr7Cj++Tl9PL7/YrU+PoHvw+KXfp17/yRV8O2yt1f0wDzkPQlNHzH7qf9J/Z1qXyvkz/u4wr+KfmC5kD5glbR5UZ3P9xJEw8f5uy5eZNzp0WrCebLNwUeJqnD9xI0cw8d4gKTtJ9Pn6bknD27tYu4l4zY4cbU9e1QR0f+PsL13Ll/Qh1mz4bjfTGxtjJ7XHDRPQHzO7N45k39nxm30obdzK/c7Kx/NfNtlE5R0t3dZpUDz7Yp6FPP/5c1FXvxL9b/JXj6CvSsdPrqq/rLBHb9j35pjJJ+i1RhkPGwJNhcPZmdndS8wqqY2yHv1WQvMrNHnY5MdEszM/3E/ZiYJIeySLfU0dzUK43tZkxd9JDZmixGsAg0kOB5HajxREPFJoHK6d+kpV1yXdmxd1dKpGHhJDxwjYbTtJSmiWnRj9NXt/YMlA1UWNrRoNSx+3qP0Xn37BnOT3/jfZYPDWmAZ2pVfXjOX15fFBMkfHVx9C4vYDPw22vHDi6a9aSvQl/8BORHRQj6YwQe9V76YYkvJgPd72mBfvh7SdpEKlORUc5Yx2qAj1bE/yvhwJdHJgXuYLIw2CRp6DRrIGk0ysztKtQsrEGl0Q40W1l6fIteFBPIE5YsIHTbQtLpHTLdzpnZ/UZl0F+odAcGzY6T5ootRtGpYsZihCrYEYbjC3SknV1F1zn8wlAXdIYJa+IXhmSI0eMcLS5JULg1S7HHDGXMmBZRDLaWDdh7HEahIgYVB/UxzvFizXjGKfcFnbpWqVkdYBqyGEZhCFIBdgiFxVdgIzrLTc6nnfNeUIgT6Bi01IxfQxAZRKkCw6J7SRJKbFWmyHYZQzFGGRmFFbMGbMD2sAG7kjDIUIHqoRbnrpfGy+jy28MU3f9mO12ssdkibXSxjTY8bHQvVHhY4fNQoGM9vj2sQ3ZWqdRRtKMjiqOQw8zXFCqXapiqZp9yPbVnx2KKAAAA');
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
	border-bottom: 1rpx solid #EEEEEE;
	padding: 0 20rpx;
}

.nav-left, .nav-right {
	width: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-icon, .option-icon {
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

/* 个人资料卡 */
.profile-card {
	background-color: #FFFFFF;
	margin-bottom: 20rpx;
}

.cover-image {
	width: 100%;
	height: 300rpx;
	overflow: hidden;
}

.cover-image image {
	width: 100%;
	height: 100%;
}

.user-basic-info {
	padding: 0 30rpx;
	margin-top: -80rpx;
	position: relative;
	display: flex;
	align-items: flex-end;
	margin-bottom: 20rpx;
}

.avatar {
	width: 160rpx;
	height: 160rpx;
	border-radius: 50%;
	border: 6rpx solid #FFFFFF;
	background-color: #FFFFFF;
}

.user-name-container {
	margin-left: 20rpx;
	flex: 1;
	margin-bottom: 15rpx;
}

.user-name {
	font-size: 40rpx;
	font-weight: bold;
	color: #333333;
	display: block;
	margin-bottom: 10rpx;
}

.user-id {
	font-size: 26rpx;
	color: #999999;
}

.copy-id {
	margin-left: 10rpx;
	color: #FF6699;
}

.quick-actions {
	display: flex;
	padding: 30rpx;
	border-bottom: 20rpx solid #F5F5F5;
}

.action-btn {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.action-icon {
	font-size: 48rpx;
	color: #FF6699;
	margin-bottom: 10rpx;
}

.action-text {
	font-size: 28rpx;
	color: #666666;
}

/* 资料信息 */
.info-section {
	background-color: #FFFFFF;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.info-item {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.info-item:last-child {
	margin-bottom: 0;
}

.info-icon {
	font-size: 36rpx;
	color: #999999;
	margin-right: 15rpx;
}

.info-text {
	font-size: 28rpx;
	color: #666666;
}

/* 公共段落样式 */
.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.view-all {
	font-size: 26rpx;
	color: #999999;
}

/* 朋友关系 */
.relation-section {
	background-color: #FFFFFF;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.relation-info {
	margin-top: 20rpx;
}

.relation-text {
	font-size: 30rpx;
	color: #333333;
	margin-bottom: 20rpx;
	display: block;
}

.relation-tags {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
}

.tag-item {
	background-color: #F5F5F5;
	color: #666666;
	font-size: 24rpx;
	padding: 10rpx 20rpx;
	border-radius: 30rpx;
	margin-right: 15rpx;
	margin-bottom: 15rpx;
}

.edit-tags, .add-tags {
	display: flex;
	align-items: center;
	justify-content: center;
	color: #FF6699;
}

.edit-icon {
	font-size: 32rpx;
	color: #FF6699;
}

.add-tags-text {
	font-size: 28rpx;
	color: #FF6699;
}

/* 朋友动态 */
.moment-section {
	background-color: #FFFFFF;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.moment-preview {
	margin-top: 20rpx;
}

.moment-item {
	display: flex;
	margin-bottom: 20rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #F5F5F5;
}

.moment-item:last-child {
	margin-bottom: 0;
	padding-bottom: 0;
	border-bottom: none;
}

.moment-image {
	width: 120rpx;
	height: 120rpx;
	border-radius: 10rpx;
	margin-right: 20rpx;
}

.moment-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.moment-text {
	font-size: 28rpx;
	color: #333333;
	line-height: 1.5;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
	overflow: hidden;
	text-overflow: ellipsis;
}

.moment-time {
	font-size: 24rpx;
	color: #999999;
	margin-top: 10rpx;
}

.no-moment {
	text-align: center;
	padding: 40rpx 0;
}

.no-moment-text {
	font-size: 28rpx;
	color: #999999;
}

/* 互动记录 */
.interaction-section {
	background-color: #FFFFFF;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.interaction-list {
	margin-top: 20rpx;
}

.interaction-item {
	display: flex;
	justify-content: space-between;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #F5F5F5;
}

.interaction-item:last-child {
	border-bottom: none;
}

.interaction-text {
	font-size: 28rpx;
	color: #333333;
}

.interaction-time {
	font-size: 24rpx;
	color: #999999;
}

.no-more, .no-interaction {
	text-align: center;
	padding: 20rpx 0;
}

.no-more-text, .no-interaction-text {
	font-size: 26rpx;
	color: #999999;
}

/* 底部按钮 */
.bottom-actions {
	padding: 30rpx;
	display: flex;
	justify-content: space-between;
	margin-bottom: env(safe-area-inset-bottom);
}

.bottom-btn {
	width: 48%;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	border-radius: 40rpx;
	font-size: 28rpx;
}

.unfriend-btn {
	background-color: #FFFFFF;
	color: #FF6699;
	border: 1rpx solid #DDDDDD;
}

.block-btn {
	background-color: #FFFFFF;
	color: #FF3333;
	border: 1rpx solid #DDDDDD;
}

.error-container {
	text-align: center;
	padding: 40rpx 0;
}

.error-icon {
	font-size: 60rpx;
	color: #FF3333;
	margin-bottom: 20rpx;
}

.error-message {
	font-size: 28rpx;
	color: #999999;
}
</style>