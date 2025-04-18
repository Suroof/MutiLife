<template>
	<view class="container">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @tap="goBack">
				<text class="iconfont back-icon">&#xe602;</text>
			</view>
			<view class="nav-title">
				<text>{{chatUser && chatUser.nickname}}</text>
				<text class="status-text" v-if="chatUser && chatUser.online">在线</text>
				<text class="status-text offline" v-else>离线</text>
			</view>
			<view class="nav-right" @tap="showOptions">
				<text class="iconfont option-icon">&#xe6de;</text>
			</view>
		</view>

		<!-- 聊天内容区 -->
		<scroll-view
			class="chat-content"
			scroll-y="true"
			:scroll-top="scrollTop"
			@scrolltoupper="loadMoreMessages"
			refresher-enabled
			:refresher-triggered="isRefreshing"
			@refresherrefresh="onRefresh"
		>
			<view class="loading-more" v-if="isLoadingMore">加载更多消息...</view>

			<view class="message-day" v-for="(group, date) in messageGroups" :key="date">
				<view class="date-divider">
					<text>{{formatDate(date)}}</text>
				</view>

				<view
					class="message-item"
					v-for="(message, index) in group"
					:key="index"
					:class="{'self-message': message.isSelf}"
				>
					<image
						class="avatar"
						:src="message.isSelf ? userInfo.avatar : chatUser.avatar"
						mode="aspectFill"
					></image>

					<view class="message-content">
						<view class="message-bubble" :class="{'self-bubble': message.isSelf}">
							<text v-if="message.type === 'text'">{{message.content}}</text>
							<image
								v-else-if="message.type === 'image'"
								:src="message.content"
								mode="widthFix"
								class="message-image"
								@tap="previewImage(message.content)"
							></image>
						</view>
						<text class="message-time">{{formatTime(message.time)}}</text>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 输入区域 -->
		<view class="input-area">
			<view class="input-options">
				<text class="iconfont option-btn" @tap="toggleVoiceInput">&#xe60e;</text>
			</view>

			<view class="input-box">
				<textarea
					v-if="!isVoiceInput"
					class="text-input"
					v-model="messageText"
					placeholder="输入消息..."
					auto-height
					:maxlength="500"
					confirm-type="send"
					@confirm="sendTextMessage"
				></textarea>
				<view
					v-else
					class="voice-input"
					@touchstart="startVoiceRecord"
					@touchend="stopVoiceRecord"
					@touchcancel="cancelVoiceRecord"
				>
					按住 说话
				</view>
			</view>

			<view class="input-actions">
				<text class="iconfont emotion-btn" @tap="toggleEmoji">&#xe605;</text>
				<text class="iconfont add-btn" @tap="showMoreActions">&#xe61c;</text>
				<text
					v-if="messageText.trim().length > 0"
					class="send-btn"
					@tap="sendTextMessage"
				>发送</text>
			</view>
		</view>

		<!-- 更多操作面板 -->
		<view class="action-panel" v-if="showActionPanel">
			<view class="action-grid">
				<view class="action-item" @tap="chooseImage">
					<view class="action-icon">
						<text class="iconfont">&#xe60f;</text>
					</view>
					<text class="action-text">相册</text>
				</view>
				<view class="action-item" @tap="takePhoto">
					<view class="action-icon">
						<text class="iconfont">&#xe606;</text>
					</view>
					<text class="action-text">拍摄</text>
				</view>
				<view class="action-item" @tap="chooseLocation">
					<view class="action-icon">
						<text class="iconfont">&#xe619;</text>
					</view>
					<text class="action-text">位置</text>
				</view>
				<view class="action-item" @tap="shareContact">
					<view class="action-icon">
						<text class="iconfont">&#xe624;</text>
					</view>
					<text class="action-text">名片</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				chatUser: {
					id: 1001,
					nickname: '慕容晓晓',
					avatar: '/static/images/avatar/1.jpg',
					online: true
				},
				userInfo: {
					id: 1000,
					nickname: '自己的昵称',
					avatar: '/static/images/avatar/6.jpg'
				},
				messages: [
					{
						id: 1,
						type: 'text',
						content: '你好啊，最近怎么样？',
						time: new Date(new Date().getTime() - 3600000 * 24),
						isSelf: false
					},
					{
						id: 2,
						type: 'text',
						content: '我很好，谢谢关心！你呢？',
						time: new Date(new Date().getTime() - 3600000 * 24 + 120000),
						isSelf: true
					},
					{
						id: 3,
						type: 'image',
						content: '/static/images/chat/image1.jpg',
						time: new Date(new Date().getTime() - 3600000 * 24 + 240000),
						isSelf: false
					},
					{
						id: 4,
						type: 'text',
						content: '这是我前几天拍的照片，感觉还不错',
						time: new Date(new Date().getTime() - 3600000 * 24 + 250000),
						isSelf: false
					},
					{
						id: 5,
						type: 'text',
						content: '拍得真好，是在哪里拍的？',
						time: new Date(new Date().getTime() - 3600000 * 24 + 300000),
						isSelf: true
					},
					{
						id: 6,
						type: 'text',
						content: '在城市公园，那里的风景很美',
						time: new Date(new Date().getTime() - 3600000 * 2),
						isSelf: false
					},
					{
						id: 7,
						type: 'text',
						content: '改天我们一起去吧？',
						time: new Date(new Date().getTime() - 3600000 * 2 + 60000),
						isSelf: true
					},
					{
						id: 8,
						type: 'text',
						content: '好啊，周末有空吗？',
						time: new Date(new Date().getTime() - 3600000),
						isSelf: false
					},
					{
						id: 9,
						type: 'text',
						content: '周六应该可以，我们上午去吧',
						time: new Date(new Date().getTime() - 1800000),
						isSelf: true
					},
					{
						id: 10,
						type: 'text',
						content: '好的，那就这么约定了！',
						time: new Date(new Date().getTime() - 1200000),
						isSelf: false
					}
				],
				messageText: '',
				scrollTop: 9999,
				isRefreshing: false,
				isLoadingMore: false,
				isVoiceInput: false,
				showActionPanel: false
			}
		},
		computed: {
			// 按日期分组的消息
			messageGroups() {
				const groups = {};
				this.messages.forEach(message => {
					const date = this.getDateString(message.time);
					if (!groups[date]) {
						groups[date] = [];
					}
					groups[date].push(message);
				});
				return groups;
			}
		},
		onLoad(options) {
			// 获取聊天对象ID
			if (options.userId) {
				this.loadChatUser(options.userId);
			}

			// 模拟初始加载完成后滚动到底部
			setTimeout(() => {
				this.scrollToBottom();
			}, 300);
		},
		methods: {
			// 加载聊天对象信息
			loadChatUser(userId) {
				// 实际开发中，这里应该从服务器获取用户信息
				console.log('加载用户信息:', userId);
				// 这里使用模拟数据
			},

			// 返回上一页
			goBack() {
				uni.navigateBack();
			},

			// 显示聊天选项
			showOptions() {
				uni.showActionSheet({
					itemList: ['清空聊天记录', '将聊天置顶', '举报', '加入黑名单'],
					success: (res) => {
						console.log('选择了选项:', res.tapIndex);
					}
				});
			},

			// 加载更多历史消息
			loadMoreMessages() {
				if (this.isLoadingMore) return;

				this.isLoadingMore = true;

				// 模拟加载更多消息
				setTimeout(() => {
					// 这里应该从服务器获取更早的消息
					const earliestDate = new Date(Math.min(...this.messages.map(m => m.time)));
					const newMessages = [
						{
							id: 101,
							type: 'text',
							content: '这是更早的消息',
							time: new Date(earliestDate.getTime() - 86400000), // 一天前
							isSelf: true
						},
						{
							id: 102,
							type: 'text',
							content: '好的，收到了',
							time: new Date(earliestDate.getTime() - 86000000), // 接近一天前
							isSelf: false
						}
					];

					this.messages = [...newMessages, ...this.messages];
					this.isLoadingMore = false;
				}, 1000);
			},

			// 下拉刷新
			onRefresh() {
				this.loadMoreMessages();
				setTimeout(() => {
					this.isRefreshing = false;
				}, 1000);
			},

			// 发送文本消息
			sendTextMessage() {
				if (!this.messageText.trim()) return;

				const newMessage = {
					id: Date.now(),
					type: 'text',
					content: this.messageText,
					time: new Date(),
					isSelf: true
				};

				this.messages.push(newMessage);
				this.messageText = '';

				// 滚动到底部
				this.$nextTick(() => {
					this.scrollToBottom();
				});

				// 模拟对方回复
				setTimeout(() => {
					const replyMessage = {
						id: Date.now() + 1,
						type: 'text',
						content: '好的，我知道了！',
						time: new Date(),
						isSelf: false
					};
					this.messages.push(replyMessage);

					this.$nextTick(() => {
						this.scrollToBottom();
					});
				}, 2000);
			},

			// 滚动到底部
			scrollToBottom() {
				setTimeout(() => {
					this.scrollTop = 999999;
				}, 100);
			},

			// 切换语音输入
			toggleVoiceInput() {
				this.isVoiceInput = !this.isVoiceInput;
			},

			// 开始语音录制
			startVoiceRecord() {
				uni.showToast({
					title: '开始录音',
					icon: 'none'
				});
				// 实际开发中应调用录音API
			},

			// 停止语音录制
			stopVoiceRecord() {
				uni.showToast({
					title: '录音结束，发送语音',
					icon: 'none'
				});
				// 实际开发中应停止录音并发送语音消息
			},

			// 取消语音录制
			cancelVoiceRecord() {
				uni.showToast({
					title: '取消录音',
					icon: 'none'
				});
				// 实际开发中应取消录音
			},

			// 切换表情面板
			toggleEmoji() {
				uni.showToast({
					title: '暂未实现表情功能',
					icon: 'none'
				});
			},

			// 显示更多操作
			showMoreActions() {
				this.showActionPanel = !this.showActionPanel;
			},

			// 从相册选择图片
			chooseImage() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.sendImageMessage(res.tempFilePaths[0]);
						this.showActionPanel = false;
					}
				});
			},

			// 拍照
			takePhoto() {
				uni.chooseImage({
					count: 1,
					sourceType: ['camera'],
					success: (res) => {
						this.sendImageMessage(res.tempFilePaths[0]);
						this.showActionPanel = false;
					}
				});
			},

			// 发送图片消息
			sendImageMessage(imagePath) {
				const newMessage = {
					id: Date.now(),
					type: 'image',
					content: imagePath,
					time: new Date(),
					isSelf: true
				};

				this.messages.push(newMessage);

				// 滚动到底部
				this.$nextTick(() => {
					this.scrollToBottom();
				});
			},

			// 选择位置
			chooseLocation() {
				uni.showToast({
					title: '暂未实现位置功能',
					icon: 'none'
				});
				this.showActionPanel = false;
			},

			// 分享联系人
			shareContact() {
				uni.showToast({
					title: '暂未实现名片功能',
					icon: 'none'
				});
				this.showActionPanel = false;
			},

			// 预览图片
			previewImage(url) {
				const imageMessages = this.messages
					.filter(msg => msg.type === 'image')
					.map(msg => msg.content);

				uni.previewImage({
					urls: imageMessages,
					current: url
				});
			},

			// 获取日期字符串(yyyy-MM-dd)
			getDateString(date) {
				return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
			},

			// 格式化日期显示
			formatDate(dateString) {
				const today = this.getDateString(new Date());
				const yesterday = this.getDateString(new Date(Date.now() - 86400000));

				if (dateString === today) {
					return '今天';
				} else if (dateString === yesterday) {
					return '昨天';
				} else {
					return dateString;
				}
			},

			// 格式化时间显示(HH:mm)
			formatTime(date) {
				return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
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
	height: 100vh;
	background-color: #F5F5F5;
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
	display: flex;
	flex-direction: column;
	align-items: center;
}

.nav-title text {
	font-size: 32rpx;
	color: #333333;
	font-weight: 500;
}

.status-text {
	font-size: 22rpx;
	color: #4CAF50;
	margin-top: 4rpx;
}

.status-text.offline {
	color: #999999;
}

/* 聊天内容区 */
.chat-content {
	flex: 1;
	padding: 20rpx;
}

.loading-more {
	text-align: center;
	color: #999999;
	font-size: 24rpx;
	padding: 20rpx 0;
}

.date-divider {
	display: flex;
	justify-content: center;
	margin: 30rpx 0;
}

.date-divider text {
	background-color: rgba(0, 0, 0, 0.1);
	color: #FFFFFF;
	font-size: 24rpx;
	padding: 6rpx 16rpx;
	border-radius: 10rpx;
}

.message-item {
	display: flex;
	margin-bottom: 30rpx;
}

.self-message {
	flex-direction: row-reverse;
}

.avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
}

.message-content {
	max-width: 65%;
	margin: 0 20rpx;
	display: flex;
	flex-direction: column;
}

.self-message .message-content {
	align-items: flex-end;
}

.message-bubble {
	background-color: #FFFFFF;
	padding: 20rpx;
	border-radius: 20rpx;
	word-break: break-all;
}

.self-bubble {
	background-color: #FF6699;
	color: #FFFFFF;
}

.message-time {
	font-size: 22rpx;
	color: #999999;
	margin-top: 10rpx;
}

.message-image {
	max-width: 400rpx;
	border-radius: 10rpx;
}

/* 输入区域 */
.input-area {
	display: flex;
	background-color: #FFFFFF;
	padding: 20rpx;
	border-top: 1rpx solid #EEEEEE;
}

.input-options, .input-actions {
	display: flex;
	align-items: center;
}

.input-box {
	flex: 1;
	background-color: #F5F5F5;
	border-radius: 10rpx;
	margin: 0 20rpx;
	padding: 15rpx;
}

.text-input {
	width: 100%;
	font-size: 28rpx;
	min-height: 40rpx;
}

.voice-input {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 60rpx;
	color: #666666;
	font-size: 28rpx;
}

.option-btn, .emotion-btn, .add-btn {
	font-size: 50rpx;
	color: #666666;
	margin: 0 10rpx;
}

.send-btn {
	background-color: #FF6699;
	color: #FFFFFF;
	padding: 10rpx 20rpx;
	border-radius: 10rpx;
	font-size: 26rpx;
	margin-left: 10rpx;
}

/* 更多操作面板 */
.action-panel {
	background-color: #FFFFFF;
	border-top: 1rpx solid #EEEEEE;
	padding: 30rpx 0;
}

.action-grid {
	display: flex;
	flex-wrap: wrap;
}

.action-item {
	width: 25%;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 30rpx;
}

.action-icon {
	width: 100rpx;
	height: 100rpx;
	background-color: #F5F5F5;
	border-radius: 20rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 10rpx;
}

.action-icon .iconfont {
	font-size: 50rpx;
	color: #666666;
}

.action-text {
	font-size: 24rpx;
	color: #666666;
}
</style>