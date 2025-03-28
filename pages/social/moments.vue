<template>
  <view class="moments-container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="nav-left" @click="goBack">
        <text class="iconfont icon-back">&#xe679;</text>
      </view>
      <view class="nav-title">朋友圈</view>
      <view class="nav-right" @click="showOptions">
        <text class="iconfont icon-more">&#xe62a;</text>
      </view>
    </view>

    <!-- 封面区域 -->
    <view class="cover-section">
      <image class="cover-image" src="/static/moments/cover.jpg" mode="aspectFill"></image>
      <view class="user-info">
        <image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
        <text class="nickname">{{userInfo.nickname}}</text>
      </view>
    </view>

    <!-- 发布动态按钮 -->
    <view class="publish-btn" @click="showPublishPanel">
      <text class="iconfont icon-camera">&#xe64f;</text>
    </view>

    <!-- 动态列表 -->
    <scroll-view
      class="moments-list"
      scroll-y
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="loadMore"
    >
      <!-- 正在刷新提示 -->
      <view v-if="refreshing" class="loading-hint">
        <text>正在刷新...</text>
      </view>

      <!-- 动态内容 -->
      <view v-for="(moment, index) in momentsList" :key="index" class="moment-item">
        <!-- 用户信息 -->
        <view class="moment-user" @click="viewProfile(moment.userId)">
          <image class="user-avatar" :src="moment.avatar" mode="aspectFill"></image>
          <view class="user-details">
            <text class="user-name">{{moment.nickname}}</text>
          </view>
        </view>

        <!-- 动态内容 -->
        <view class="moment-content">
          <text class="content-text">{{moment.content}}</text>

          <!-- 图片内容 -->
          <view class="image-container" v-if="moment.images && moment.images.length > 0">
            <view :class="['image-grid', `grid-${Math.min(moment.images.length, 9)}`]">
              <image
                v-for="(img, imgIndex) in moment.images"
                :key="imgIndex"
                :src="img"
                mode="aspectFill"
                @click="previewImage(moment.images, imgIndex)"
                class="moment-image"
              ></image>
            </view>
          </view>

          <!-- 位置信息 -->
          <view class="location" v-if="moment.location">
            <text class="iconfont icon-location">&#xe651;</text>
            <text class="location-text">{{moment.location}}</text>
          </view>

          <!-- 时间和操作区 -->
          <view class="moment-footer">
            <text class="time-text">{{moment.time}}</text>
            <view class="action-btn" @click="toggleActions(index)">
              <text class="iconfont icon-like">&#xe61a;</text>
            </view>
          </view>

          <!-- 展开的操作面板 -->
          <view class="action-panel" v-if="moment.showActions">
            <view class="action-item" @click="likeMoment(index)">
              <text class="iconfont" :class="{'liked': moment.isLiked}">{{moment.isLiked ? '&#xe60b;' : '&#xe61a;'}}</text>
              <text>{{moment.isLiked ? '取消' : '点赞'}}</text>
            </view>
            <view class="action-item" @click="commentMoment(index)">
              <text class="iconfont icon-comment">&#xe667;</text>
              <text>评论</text>
            </view>
          </view>

          <!-- 点赞列表 -->
          <view class="likes-container" v-if="moment.likes && moment.likes.length > 0">
            <text class="iconfont icon-like liked">&#xe60b;</text>
            <view class="likes-list">
              <text
                v-for="(like, likeIndex) in moment.likes"
                :key="likeIndex"
                @click="viewProfile(like.userId)"
                class="like-name"
              >{{like.nickname}}{{likeIndex < moment.likes.length - 1 ? '，' : ''}}</text>
            </view>
          </view>

          <!-- 评论列表 -->
          <view class="comments-container" v-if="moment.comments && moment.comments.length > 0">
            <view
              v-for="(comment, commentIndex) in moment.comments"
              :key="commentIndex"
              class="comment-item"
            >
              <text class="comment-name" @click="viewProfile(comment.userId)">{{comment.nickname}}</text>
              <text class="comment-text">{{comment.content}}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载更多提示 -->
      <view class="loading-more" v-if="hasMore">
        <text>正在加载更多...</text>
      </view>
      <view class="no-more" v-else>
        <text>没有更多内容了</text>
      </view>
    </scroll-view>

    <!-- 发布动态面板 -->
    <view class="publish-panel" v-if="showPublish">
      <view class="panel-header">
        <text class="close-btn" @click="closePublishPanel">取消</text>
        <text class="title">发表动态</text>
        <text class="publish-action" :class="{active: contentInput.length > 0 || selectedImages.length > 0}" @click="publishMoment">发表</text>
      </view>
      <view class="panel-content">
        <textarea
          class="content-input"
          placeholder="分享新鲜事..."
          v-model="contentInput"
          maxlength="300"
          auto-height
        ></textarea>

        <!-- 已选择的图片预览 -->
        <view class="selected-images" v-if="selectedImages.length > 0">
          <view class="image-grid" :class="`grid-${Math.min(selectedImages.length + 1, 9)}`">
            <view
              v-for="(img, imgIndex) in selectedImages"
              :key="imgIndex"
              class="selected-image-container"
            >
              <image
                :src="img"
                mode="aspectFill"
                class="selected-image"
              ></image>
              <text class="remove-image" @click="removeImage(imgIndex)">×</text>
            </view>

            <!-- 添加图片按钮 -->
            <view class="add-image-btn" v-if="selectedImages.length < 9" @click="chooseImage">
              <text class="iconfont icon-add">&#xe61f;</text>
            </view>
          </view>
        </view>

        <!-- 未选择图片时的添加按钮 -->
        <view class="image-options" v-else>
          <view class="image-option" @click="chooseImage">
            <text class="iconfont icon-picture">&#xe70f;</text>
            <text>图片</text>
          </view>
        </view>

        <!-- 发布位置 -->
        <view class="location-option" @click="chooseLocation">
          <text class="iconfont icon-location">&#xe651;</text>
          <text v-if="!selectedLocation">所在位置</text>
          <text v-else>{{selectedLocation}}</text>
          <text v-if="selectedLocation" class="clear-location" @click.stop="clearLocation">×</text>
        </view>
      </view>
    </view>

    <!-- 评论输入框 -->
    <view class="comment-input-container" v-if="showCommentInput">
      <input
        class="comment-input"
        v-model="commentText"
        placeholder="评论"
        :focus="showCommentInput"
        @blur="onCommentBlur"
        @confirm="submitComment"
      />
      <text class="send-btn" @click="submitComment">发送</text>
    </view>

    <!-- 遮罩层 -->
    <view class="mask" v-if="showPublish || showCommentInput" @click="closeAllPanels"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        avatar: '/static/avatar/avatar1.jpg',
        nickname: '自己的昵称'
      },
      refreshing: false,
      hasMore: true,
      momentsList: [
        {
          userId: '1001',
          nickname: '张三',
          avatar: '/static/avatar/avatar2.jpg',
          content: '今天天气真好，去海边玩了一天，很开心！',
          images: [
            '/static/moments/sample1.jpg',
            '/static/moments/sample2.jpg',
            '/static/moments/sample3.jpg',
          ],
          location: '青岛海边',
          time: '10分钟前',
          likes: [
            { userId: '2001', nickname: '王五' },
            { userId: '3001', nickname: '赵六' }
          ],
          comments: [
            { userId: '2001', nickname: '王五', content: '真羡慕，风景太美了！' },
            { userId: '3001', nickname: '赵六', content: '下次一起去啊' }
          ],
          isLiked: false,
          showActions: false
        },
        {
          userId: '2001',
          nickname: '王五',
          avatar: '/static/avatar/avatar3.jpg',
          content: '新买的手机终于到了，拍照效果杠杠的！',
          images: [
            '/static/moments/sample4.jpg',
          ],
          location: '',
          time: '1小时前',
          likes: [],
          comments: [],
          isLiked: false,
          showActions: false
        },
        {
          userId: '3001',
          nickname: '赵六',
          avatar: '/static/avatar/avatar4.jpg',
          content: '生活不止眼前的苟且，还有诗和远方。',
          images: [],
          location: '',
          time: '昨天',
          likes: [
            { userId: '1001', nickname: '自己的昵称' }
          ],
          comments: [
            { userId: '1001', nickname: '自己的昵称', content: '说得好！' }
          ],
          isLiked: true,
          showActions: false
        }
      ],
      showPublish: false,
      contentInput: '',
      selectedImages: [],
      selectedLocation: '',
      showCommentInput: false,
      commentText: '',
      currentCommentIndex: -1
    };
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },

    showOptions() {
      uni.showActionSheet({
        itemList: ['设置朋友圈权限', '设置提醒', '清空动态缓存'],
        success: (res) => {
          // 处理选择结果
          uni.showToast({
            title: '功能开发中',
            icon: 'none'
          });
        }
      });
    },

    onRefresh() {
      this.refreshing = true;
      // 模拟刷新操作
      setTimeout(() => {
        this.refreshing = false;
        uni.showToast({
          title: '刷新成功',
          icon: 'success'
        });
      }, 1500);
    },

    loadMore() {
      if (!this.hasMore) return;

      // 模拟加载更多
      uni.showLoading({
        title: '加载中...'
      });

      setTimeout(() => {
        const newMoments = [
          {
            userId: '4001',
            nickname: '李四',
            avatar: '/static/avatar/avatar5.jpg',
            content: '周末去看了一场电影，推荐给大家！',
            images: ['/static/moments/sample5.jpg'],
            location: '万达影城',
            time: '3天前',
            likes: [],
            comments: [],
            isLiked: false,
            showActions: false
          }
        ];

        this.momentsList = [...this.momentsList, ...newMoments];

        // 模拟数据到底了
        if (this.momentsList.length > 10) {
          this.hasMore = false;
        }

        uni.hideLoading();
      }, 1500);
    },

    viewProfile(userId) {
      uni.navigateTo({
        url: `/pages/social/friend-profile?id=${userId}`
      });
    },

    previewImage(images, current) {
      uni.previewImage({
        urls: images,
        current: images[current]
      });
    },

    toggleActions(index) {
      // 先关闭所有其他的操作面板
      this.momentsList.forEach((item, i) => {
        if (i !== index) {
          this.$set(this.momentsList[i], 'showActions', false);
        }
      });

      // 切换当前操作面板的显示状态
      this.$set(this.momentsList[index], 'showActions', !this.momentsList[index].showActions);
    },

    likeMoment(index) {
      const moment = this.momentsList[index];
      const isLiked = !moment.isLiked;

      this.$set(this.momentsList[index], 'isLiked', isLiked);
      this.$set(this.momentsList[index], 'showActions', false);

      if (isLiked) {
        // 添加点赞
        if (!moment.likes) {
          this.$set(this.momentsList[index], 'likes', []);
        }
        this.momentsList[index].likes.push({
          userId: '1001',
          nickname: '自己的昵称'
        });
      } else {
        // 取消点赞
        const likeIndex = moment.likes.findIndex(like => like.userId === '1001');
        if (likeIndex !== -1) {
          this.momentsList[index].likes.splice(likeIndex, 1);
        }
      }
    },

    commentMoment(index) {
      this.currentCommentIndex = index;
      this.showCommentInput = true;
      this.$set(this.momentsList[index], 'showActions', false);
    },

    onCommentBlur() {
      // 延迟关闭输入框，避免点击发送按钮失效
      setTimeout(() => {
        if (this.commentText.trim() === '') {
          this.showCommentInput = false;
        }
      }, 200);
    },

    submitComment() {
      if (this.commentText.trim() === '') return;

      const index = this.currentCommentIndex;
      if (index === -1) return;

      const moment = this.momentsList[index];

      // 确保comments数组存在
      if (!moment.comments) {
        this.$set(this.momentsList[index], 'comments', []);
      }

      // 添加评论
      this.momentsList[index].comments.push({
        userId: '1001',
        nickname: '自己的昵称',
        content: this.commentText
      });

      // 清空评论文本并关闭输入框
      this.commentText = '';
      this.showCommentInput = false;
      this.currentCommentIndex = -1;
    },

    showPublishPanel() {
      this.showPublish = true;
    },

    closePublishPanel() {
      this.showPublish = false;
      this.contentInput = '';
      this.selectedImages = [];
      this.selectedLocation = '';
    },

    chooseImage() {
      uni.chooseImage({
        count: 9 - this.selectedImages.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.selectedImages = [...this.selectedImages, ...res.tempFilePaths];
        }
      });
    },

    removeImage(index) {
      this.selectedImages.splice(index, 1);
    },

    chooseLocation() {
      // 模拟选择位置
      uni.showActionSheet({
        itemList: ['当前位置', '选择位置'],
        success: (res) => {
          const locations = ['北京市朝阳区', '上海市浦东新区', '广州市天河区'];
          this.selectedLocation = locations[Math.floor(Math.random() * locations.length)];
        }
      });
    },

    clearLocation() {
      this.selectedLocation = '';
    },

    publishMoment() {
      if (this.contentInput.trim() === '' && this.selectedImages.length === 0) {
        uni.showToast({
          title: '请输入内容或选择图片',
          icon: 'none'
        });
        return;
      }

      // 模拟发布动态
      uni.showLoading({
        title: '发布中...'
      });

      setTimeout(() => {
        // 创建新动态
        const newMoment = {
          userId: '1001',
          nickname: '自己的昵称',
          avatar: this.userInfo.avatar,
          content: this.contentInput,
          images: [...this.selectedImages],
          location: this.selectedLocation,
          time: '刚刚',
          likes: [],
          comments: [],
          isLiked: false,
          showActions: false
        };

        // 添加到动态列表的顶部
        this.momentsList.unshift(newMoment);

        // 关闭发布面板并清空数据
        this.closePublishPanel();

        uni.hideLoading();
        uni.showToast({
          title: '发布成功',
          icon: 'success'
        });
      }, 1500);
    },

    closeAllPanels() {
      this.showPublish = false;
      this.showCommentInput = false;
    }
  }
};
</script>

<style>
.moments-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8f8f8;
}

/* 导航栏样式 */
.navbar {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 15px;
  background-color: #ffffff;
  position: relative;
  z-index: 10;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.nav-left, .nav-right {
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
}

.iconfont {
  font-family: "iconfont";
}

/* 封面区域样式 */
.cover-section {
  height: 250px;
  position: relative;
}

.cover-image {
  width: 100%;
  height: 100%;
}

.user-info {
  position: absolute;
  right: 15px;
  bottom: 15px;
  display: flex;
  align-items: center;
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 5px;
  border: 2px solid #ffffff;
  margin-left: 10px;
}

.nickname {
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* 发布按钮 */
.publish-btn {
  position: fixed;
  right: 20px;
  bottom: 80px;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #FF6699;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(255, 102, 153, 0.3);
}

.publish-btn .iconfont {
  color: #ffffff;
  font-size: 24px;
}

/* 动态列表样式 */
.moments-list {
  flex: 1;
  padding: 10px 0;
}

.loading-hint, .loading-more, .no-more {
  padding: 10px 0;
  text-align: center;
  font-size: 14px;
  color: #999999;
}

.moment-item {
  background-color: #ffffff;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.moment-user {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 10px;
}

.user-name {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
}

.moment-content {
  margin-left: 50px;
}

.content-text {
  font-size: 15px;
  color: #333333;
  line-height: 1.5;
  margin-bottom: 10px;
}

.image-container {
  margin: 10px 0;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
}

.grid-1 .moment-image {
  width: 200px;
  height: 200px;
  border-radius: 5px;
}

.grid-2 .moment-image, .grid-4 .moment-image {
  width: calc(50% - 5px);
  height: 120px;
  margin: 0 5px 5px 0;
  border-radius: 5px;
}

.grid-3 .moment-image, .grid-5 .moment-image, .grid-6 .moment-image, .grid-7 .moment-image, .grid-8 .moment-image, .grid-9 .moment-image {
  width: calc(33.33% - 5px);
  height: 100px;
  margin: 0 5px 5px 0;
  border-radius: 5px;
}

.location {
  display: flex;
  align-items: center;
  margin: 5px 0;
  font-size: 14px;
  color: #5d9afe;
}

.location-text {
  margin-left: 5px;
}

.moment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.time-text {
  font-size: 13px;
  color: #999999;
}

.action-btn {
  padding: 5px 10px;
  color: #666666;
}

.action-panel {
  display: flex;
  background-color: #f8f8f8;
  border-radius: 5px;
  margin-top: 10px;
}

.action-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  font-size: 14px;
  color: #666666;
}

.action-item .iconfont {
  margin-right: 5px;
}

.liked {
  color: #FF6699;
}

.likes-container {
  display: flex;
  align-items: flex-start;
  background-color: #f8f8f8;
  border-radius: 5px;
  padding: 8px;
  margin-top: 10px;
}

.likes-list {
  flex: 1;
  margin-left: 5px;
}

.like-name {
  font-size: 14px;
  color: #5d9afe;
}

.comments-container {
  background-color: #f8f8f8;
  border-radius: 5px;
  padding: 8px;
  margin-top: 10px;
}

.comment-item {
  margin-bottom: 5px;
}

.comment-name {
  font-size: 14px;
  color: #5d9afe;
  margin-right: 5px;
}

.comment-text {
  font-size: 14px;
  color: #333333;
}

/* 发布动态面板 */
.publish-panel {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #ffffff;
  z-index: 1000;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  transform: translateY(0);
  transition: transform 0.3s;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.close-btn, .publish-action {
  font-size: 16px;
  color: #666666;
}

.publish-action.active {
  color: #FF6699;
  font-weight: 500;
}

.title {
  font-size: 18px;
  font-weight: 500;
}

.panel-content {
  padding: 15px;
}

.content-input {
  width: 100%;
  min-height: 100px;
  font-size: 16px;
  line-height: 1.5;
  padding: 0;
  margin-bottom: 15px;
}

.selected-images {
  margin-bottom: 15px;
}

.selected-image-container {
  position: relative;
  margin: 0 5px 5px 0;
}

.selected-image {
  width: 100%;
  height: 100%;
  border-radius: 5px;
}

.remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  line-height: 18px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  border-radius: 10px;
  font-size: 16px;
}

.add-image-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  border-radius: 5px;
  font-size: 24px;
  color: #999999;
}

.image-options {
  display: flex;
  margin-bottom: 15px;
}

.image-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
  font-size: 14px;
  color: #666666;
}

.image-option .iconfont {
  font-size: 24px;
  margin-bottom: 5px;
  color: #5d9afe;
}

.location-option {
  display: flex;
  align-items: center;
  padding: 10px 0;
  font-size: 14px;
  color: #666666;
}

.location-option .iconfont {
  margin-right: 5px;
  color: #5d9afe;
}

.clear-location {
  margin-left: 5px;
  width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  background-color: #cccccc;
  color: #ffffff;
  border-radius: 8px;
  font-size: 12px;
}

/* 评论输入框 */
.comment-input-container {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #ffffff;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.comment-input {
  flex: 1;
  height: 36px;
  background-color: #f0f0f0;
  border-radius: 18px;
  padding: 0 15px;
  font-size: 14px;
  margin-right: 10px;
}

.send-btn {
  font-size: 16px;
  color: #FF6699;
  padding: 5px;
}

/* 遮罩层 */
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
</style>