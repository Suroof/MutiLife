<template>
	<view class="container">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @tap="goBack">
				<text class="iconfont back-icon">&#xe602;</text>
			</view>
			<view class="nav-title">
				<text>群组信息</text>
			</view>
			<view class="nav-right">
				<text class="iconfont option-icon" @tap="showOptions">&#xe6de;</text>
			</view>
		</view>

		<!-- 群组基本信息 -->
		<view class="group-basic-info card">
			<view class="group-header">
				<image class="group-avatar" :src="groupInfo.avatar" mode="aspectFill"></image>
				<view class="group-details">
					<text class="group-name">{{groupInfo.name}}</text>
					<text class="group-id">群号：{{groupInfo.id}}</text>
				</view>
				<view class="edit-btn" @tap="editGroupInfo">
					<text class="iconfont edit-icon">&#xe639;</text>
				</view>
			</view>
		</view>

		<!-- 群公告 -->
		<view class="group-notice card">
			<view class="section-header">
				<text class="section-title">群公告</text>
				<text class="edit-text" @tap="editNotice" v-if="isAdmin">编辑</text>
			</view>
			<view class="notice-content">
				<text class="notice-text">{{groupInfo.notice || '暂无群公告'}}</text>
			</view>
		</view>

		<!-- 群相册 -->
		<view class="group-album card">
			<view class="section-header">
				<text class="section-title">群相册</text>
				<text class="view-all" @tap="viewAlbum">查看全部</text>
			</view>
			<view class="album-preview">
				<image
					v-for="(item, index) in albumPreview"
					:key="index"
					:src="item"
					mode="aspectFill"
					class="album-item"
					@tap="previewImage(item)"
				></image>
				<view class="album-more" v-if="groupInfo.albumCount > 4" @tap="viewAlbum">
					<text class="more-text">+{{groupInfo.albumCount - 4}}</text>
				</view>
			</view>
		</view>

		<!-- 群成员 -->
		<view class="group-members card">
			<view class="section-header">
				<text class="section-title">群成员（{{groupInfo.memberCount}}）</text>
				<text class="view-all" @tap="viewAllMembers">查看全部</text>
			</view>
			<view class="members-grid">
				<view class="member-item" v-for="(member, index) in memberPreview" :key="index" @tap="viewMemberInfo(member)">
					<image class="member-avatar" :src="member.avatar" mode="aspectFill"></image>
					<text class="member-name">{{member.nickname}}</text>
					<text class="member-role" v-if="member.role === 'owner'">群主</text>
					<text class="member-role" v-else-if="member.role === 'admin'">管理员</text>
				</view>
				<view class="member-item add-member" @tap="inviteMembers">
					<view class="add-icon-box">
						<text class="iconfont add-icon">&#xe61c;</text>
					</view>
					<text class="add-text">邀请</text>
				</view>
			</view>
		</view>

		<!-- 群设置 -->
		<view class="group-settings card">
			<view class="settings-item" @tap="toggleMute">
				<text class="settings-label">消息免打扰</text>
				<switch :checked="settings.mute" color="#FF6699" @change="toggleMute" />
			</view>
			<view class="settings-item" @tap="toggleSticky">
				<text class="settings-label">置顶聊天</text>
				<switch :checked="settings.sticky" color="#FF6699" @change="toggleSticky" />
			</view>
			<view class="settings-item" @tap="manageNotice">
				<text class="settings-label">提醒方式</text>
				<view class="settings-value">
					<text>{{noticeOptions[settings.noticeType]}}</text>
					<text class="iconfont arrow-icon">&#xe603;</text>
				</view>
			</view>
			<view class="settings-item" @tap="clearHistory">
				<text class="settings-label">清空聊天记录</text>
				<text class="iconfont arrow-icon">&#xe603;</text>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="bottom-btn-area">
			<button class="exit-btn" @tap="exitGroup">{{isOwner ? '解散群组' : '退出群组'}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				groupInfo: {
					id: 2001,
					name: "星光音乐爱好者",
					avatar: "/static/images/group-avatar.jpg",
					notice: "这是一个音乐爱好者交流群，欢迎讨论各种音乐话题！群内禁止发广告和与音乐无关的内容。每周六晚8点有线上音乐分享会，欢迎大家参与。",
					memberCount: 35,
					albumCount: 16,
					createTime: "2023-01-15"
				},
				memberPreview: [
					{
						id: 101,
						nickname: "音乐梦想家",
						avatar: "/static/images/avatar/1.jpg",
						role: "owner"
					},
					{
						id: 102,
						nickname: "李明",
						avatar: "/static/images/avatar/2.jpg",
						role: "admin"
					},
					{
						id: 103,
						nickname: "张红",
						avatar: "/static/images/avatar/3.jpg",
						role: "member"
					},
					{
						id: 104,
						nickname: "王强",
						avatar: "/static/images/avatar/4.jpg",
						role: "member"
					},
					{
						id: 105,
						nickname: "陈静",
						avatar: "/static/images/avatar/5.jpg",
						role: "member"
					}
				],
				albumPreview: [
					"/static/images/album/1.jpg",
					"/static/images/album/2.jpg",
					"/static/images/album/3.jpg",
					"/static/images/album/4.jpg"
				],
				settings: {
					mute: false,
					sticky: true,
					noticeType: 0 // 0: 接收全部消息, 1: 只接收@我的消息, 2: 完全静音
				},
				noticeOptions: ["接收全部消息", "只接收@我的消息", "完全静音"],
				currentUserRole: "member" // owner, admin, member
			}
		},
		computed: {
			isAdmin() {
				return this.currentUserRole === 'owner' || this.currentUserRole === 'admin';
			},
			isOwner() {
				return this.currentUserRole === 'owner';
			}
		},
		onLoad(options) {
			// 实际开发中，这里应该根据options.id获取群组信息
			if (options && options.id) {
				this.loadGroupInfo(options.id);
			}
		},
		methods: {
			// 加载群组信息
			loadGroupInfo(groupId) {
				console.log('加载群组信息:', groupId);
				// 这里应该是从服务器获取群组信息
				// 这里使用模拟数据

				// 检查当前用户在群组中的角色
				// 假设我们能够从某个地方获取到当前用户的id
				const currentUserId = 103; // 假设当前用户id为103

				// 在成员列表中查找当前用户
				const currentMember = this.memberPreview.find(member => member.id === currentUserId);
				if (currentMember) {
					this.currentUserRole = currentMember.role;
				}
			},

			// 返回上一页
			goBack() {
				uni.navigateBack();
			},

			// 显示更多选项
			showOptions() {
				let options = [];

				if (this.isAdmin) {
					options = ["设置管理员", "禁言列表", "设置群名片", "举报"];
				} else {
					options = ["投诉", "举报"];
				}

				uni.showActionSheet({
					itemList: options,
					success: (res) => {
						console.log('选择了选项:', options[res.tapIndex]);
					}
				});
			},

			// 编辑群组信息
			editGroupInfo() {
				if (!this.isAdmin) {
					uni.showToast({
						title: '只有群主或管理员可以编辑群信息',
						icon: 'none'
					});
					return;
				}

				uni.showToast({
					title: '编辑群组信息',
					icon: 'none'
				});
			},

			// 编辑群公告
			editNotice() {
				uni.showToast({
					title: '编辑群公告',
					icon: 'none'
				});
			},

			// 查看群相册
			viewAlbum() {
				uni.showToast({
					title: '查看群相册',
					icon: 'none'
				});
			},

			// 预览图片
			previewImage(current) {
				uni.previewImage({
					urls: this.albumPreview,
					current: current
				});
			},

			// 查看所有成员
			viewAllMembers() {
				uni.showToast({
					title: '查看所有成员',
					icon: 'none'
				});
			},

			// 查看成员信息
			viewMemberInfo(member) {
				uni.showToast({
					title: '查看' + member.nickname + '的信息',
					icon: 'none'
				});
			},

			// 邀请成员
			inviteMembers() {
				uni.showToast({
					title: '邀请新成员',
					icon: 'none'
				});
			},

			// 切换免打扰状态
			toggleMute(e) {
				if (typeof e === 'object') {
					this.settings.mute = e.detail.value;
				} else {
					this.settings.mute = !this.settings.mute;
				}

				uni.showToast({
					title: this.settings.mute ? '已开启消息免打扰' : '已关闭消息免打扰',
					icon: 'none'
				});
			},

			// 切换置顶状态
			toggleSticky(e) {
				if (typeof e === 'object') {
					this.settings.sticky = e.detail.value;
				} else {
					this.settings.sticky = !this.settings.sticky;
				}

				uni.showToast({
					title: this.settings.sticky ? '已置顶聊天' : '已取消置顶',
					icon: 'none'
				});
			},

			// 管理通知设置
			manageNotice() {
				uni.showActionSheet({
					itemList: this.noticeOptions,
					success: (res) => {
						this.settings.noticeType = res.tapIndex;
						uni.showToast({
							title: '已设置为' + this.noticeOptions[res.tapIndex],
							icon: 'none'
						});
					}
				});
			},

			// 清空聊天记录
			clearHistory() {
				uni.showModal({
					title: '清空聊天记录',
					content: '确定要清空与该群组的聊天记录吗？',
					success: (res) => {
						if (res.confirm) {
							uni.showToast({
								title: '聊天记录已清空',
								icon: 'success'
							});
						}
					}
				});
			},

			// 退出或解散群组
			exitGroup() {
				const title = this.isOwner ? '解散群组' : '退出群组';
				const content = this.isOwner ?
					'解散后，群的聊天记录将被清空，群相册、群文件等数据将被删除' :
					'退出后，将不再接收此群消息';

				uni.showModal({
					title: title,
					content: content,
					confirmColor: '#FF0000',
					success: (res) => {
						if (res.confirm) {
							uni.showToast({
								title: this.isOwner ? '群组已解散' : '已退出群组',
								icon: 'success',
								success: () => {
									setTimeout(() => {
										uni.navigateBack({
											delta: 2 // 返回到social页面
										});
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
	background-color: #F5F5F5;
	min-height: 100vh;
}

.card {
	background-color: #FFFFFF;
	border-radius: 12rpx;
	margin: 20rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
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

/* 群组基本信息 */
.group-header {
	display: flex;
	align-items: center;
	position: relative;
}

.group-avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 20rpx;
	margin-right: 20rpx;
}

.group-details {
	flex: 1;
}

.group-name {
	font-size: 34rpx;
	font-weight: bold;
	color: #333333;
	display: block;
	margin-bottom: 10rpx;
}

.group-id {
	font-size: 26rpx;
	color: #999999;
	display: block;
}

.edit-btn {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.edit-icon {
	font-size: 36rpx;
	color: #999999;
}

/* 群公告 */
.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
}

.edit-text, .view-all {
	font-size: 26rpx;
	color: #999999;
}

.notice-content {
	background-color: #F8F8F8;
	border-radius: 10rpx;
	padding: 20rpx;
}

.notice-text {
	font-size: 28rpx;
	color: #666666;
	line-height: 1.5;
}

/* 群相册 */
.album-preview {
	display: flex;
	flex-wrap: wrap;
}

.album-item {
	width: 150rpx;
	height: 150rpx;
	border-radius: 8rpx;
	margin-right: 10rpx;
	margin-bottom: 10rpx;
}

.album-more {
	width: 150rpx;
	height: 150rpx;
	border-radius: 8rpx;
	background-color: rgba(0, 0, 0, 0.7);
	display: flex;
	align-items: center;
	justify-content: center;
}

.more-text {
	color: #FFFFFF;
	font-size: 32rpx;
}

/* 群成员 */
.members-grid {
	display: flex;
	flex-wrap: wrap;
}

.member-item {
	width: 20%;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 30rpx;
}

.member-avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	margin-bottom: 10rpx;
}

.member-name {
	font-size: 26rpx;
	color: #333333;
	width: 100%;
	text-align: center;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.member-role {
	font-size: 22rpx;
	color: #FF6699;
	margin-top: 4rpx;
}

.add-icon-box {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	background-color: #F5F5F5;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 10rpx;
}

.add-icon {
	font-size: 50rpx;
	color: #999999;
}

.add-text {
	font-size: 26rpx;
	color: #666666;
}

/* 群设置 */
.settings-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx 0;
	border-bottom: 1rpx solid #F5F5F5;
}

.settings-item:last-child {
	border-bottom: none;
	padding-bottom: 0;
}

.settings-label {
	font-size: 30rpx;
	color: #333333;
}

.settings-value {
	display: flex;
	align-items: center;
	font-size: 28rpx;
	color: #999999;
}

.arrow-icon {
	font-size: 36rpx;
	color: #CCCCCC;
	margin-left: 10rpx;
}

/* 底部按钮区域 */
.bottom-btn-area {
	padding: 40rpx 20rpx;
	margin-bottom: env(safe-area-inset-bottom);
}

.exit-btn {
	width: 100%;
	height: 90rpx;
	line-height: 90rpx;
	background-color: #FFFFFF;
	border-radius: 45rpx;
	font-size: 32rpx;
	color: #FF6699;
	text-align: center;
	border: none;
}
</style>