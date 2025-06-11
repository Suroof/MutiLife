<template>
  <view class="container">
    <!-- 标题区域 -->
    <view class="article-header">
      <text class="article-title">{{ newsDetail.title }}</text>
      <view class="article-meta">
        <text class="article-source">{{ newsDetail.source }}</text>
        <text class="article-time">{{ newsDetail.time }}</text>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="article-content">
      <image
        v-if="newsDetail.coverImage"
        class="article-cover"
        :src="newsDetail.coverImage"
        mode="widthFix"
      ></image>

      <rich-text class="article-text" :nodes="newsDetail.content"></rich-text>

      <view class="article-tags">
        <text class="tag-title">相关标签：</text>
        <view class="tags-list">
          <text
            class="tag-item"
            v-for="(tag, index) in newsDetail.tags"
            :key="index"
            @tap="searchByTag(tag)"
            >{{ tag }}</text
          >
        </view>
      </view>
    </view>

    <!-- 评论区域 -->
    <view class="comment-section">
      <view class="section-header">
        <text class="section-title">评论 ({{ comments.length }})</text>
        <text class="sort-btn" @tap="toggleSortOrder"
          >{{ sortNewest ? "最新" : "最热" }}
          <text class="iconfont arrow-icon">&#xe627;</text></text
        >
      </view>

      <view class="comment-list" v-if="comments.length > 0">
        <view
          class="comment-item"
          v-for="(item, index) in sortedComments"
          :key="index"
        >
          <image
            class="commenter-avatar"
            :src="item.avatar"
            mode="aspectFill"
          ></image>
          <view class="comment-content">
            <view class="commenter-info">
              <text class="commenter-name">{{ item.name }}</text>
              <text class="comment-time">{{ item.time }}</text>
            </view>
            <text class="comment-text">{{ item.content }}</text>
            <view class="comment-actions">
              <view class="action-item" @tap="likeComment(index)">
                <uni-icons
                  type="hand-up"
                  size="16"
                  color="#999"
                  :class="{ liked: item.isLiked }"
                  @click="toggleLike(item)"
                />
                <text class="action-text">{{ item.likes }}</text>
              </view>
              <view class="action-item" @tap="replyComment(index)">
                <uni-icon type="chat" size="16" color="#999" />
                <text class="action-text">回复</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="no-comment" v-else>
        <text class="no-comment-text">暂无评论，快来发表您的看法吧</text>
      </view>
    </view>

    <!-- 底部评论输入区 -->
    <view class="comment-bar">
      <view class="comment-input-box" @tap="focusCommentInput">
        <text class="input-placeholder">写评论...</text>
      </view>
      <view class="action-buttons">
        <view class="action-button" @tap="likeArticle">
          <uni-icons
            type="hand-up"
            size="24"
            color="#999"
            :class="{ liked: isLiked }"
          />
          <text class="action-count">{{ newsDetail.likes }}</text>
        </view>
        <view class="action-button" @tap="collectArticle">
          <uni-icons
            type="star"
            size="24"
            color="#999"
            :class="{ collected: isCollected }"
          />
          <text class="action-count">{{ newsDetail.collections }}</text>
        </view>
        <view class="action-button" @tap="shareArticle">
          <uni-icons type="undo" size="24" color="#999" />
          <text class="action-count">{{ newsDetail.shares }}</text>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import request from "@/services/api/request.js";
import uniIcons from "@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue";
export default {
  components: {
    uniIcons,
  },
  data() {
    return {
      newsId: 0,
      isLiked: false,
      isCollected: false,
      commentText: "",
      popupFocus: false,
      sortNewest: true,

      // 新闻详情数据
      newsDetail: {
        title: "",
        source: "",
        time: "",
        coverImage: "",
        content: "",
        tags: [],
        likes: 0,
        collections: 0,
        shares: 0,
      },

      // 评论数据
      comments: [],
    };
  },
  computed: {
    sortedComments() {
      if (this.sortNewest) {
        // 按时间排序（这里简化处理，实际应根据时间戳排序）
        return [...this.comments];
      } else {
        // 按点赞数排序
        return [...this.comments].sort((a, b) => b.likes - a.likes);
      }
    },
  },
  onLoad(options) {
    // 获取新闻ID参数
    if (options.id) {
      this.newsId = options.id;
      console.log("加载新闻详情，ID:", this.newsId);
      this.loadNewsDetail();
    }
  },
  methods: {
    // 加载新闻详情
    async loadNewsDetail() {
      uni.showLoading({
        title: "加载中...",
      });

      try {
        // 根据newsId从服务器获取数据
        const response = await request.get(`/news/${this.newsId}`);
        console.log("新闻详情响应:", response);

        if (response.success && response.data) {
          // 格式化新闻数据
          this.newsDetail = {
            title: response.data.title,
            source: response.data.author || "未知来源",
            time: this.formatTime(response.data.publishDate),
            coverImage: response.data.coverImage,
            content: response.data.content,
            tags: response.data.tags || [],
            likes: response.data.likeCount || 0,
            collections: response.data.collectCount || 0,
            shares: response.data.shareCount || 0,
          };

          // 加载评论
          this.loadComments();
        } else {
          uni.showToast({
            title: "加载新闻失败",
            icon: "none",
          });
        }
      } catch (error) {
        console.error("获取新闻详情失败:", error);
        uni.showToast({
          title: "加载新闻失败",
          icon: "none",
        });
      } finally {
        uni.hideLoading();
      }
    },

    // 加载评论
    async loadComments() {
      try {
        const response = await request.get(`/news/${this.newsId}/comments`);

        if (response.success && response.data) {
          let data = response.data;

          if (typeof data === "object" && !Array.isArray(data)) {
            data = data.comments || [];
          }

          this.comments = data.map((item) => ({
            id: item._id,
            name: item.userId.name || item.userId.username,
            avatar:
              item.userId.avatar ||
              "https://tse4-mm.cn.bing.net/th/id/OIP-C.kQ1yF3EUTztALQowPU_77AHaE7?w=255&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
            content: item.content,
            time: this.formatTime(item.createdAt),
            likes: item.likeCount || 0,
            isLiked: item.isLiked || false,
          }));
        }
      } catch (error) {
        console.error("获取评论失败:", error);
      }
    },

    // 格式化时间
    formatTime(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / (1000 * 60));

      if (diffMins < 60) {
        return diffMins + "分钟前";
      } else if (diffMins < 24 * 60) {
        return Math.floor(diffMins / 60) + "小时前";
      } else {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")} ${String(
          date.getHours()
        ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
      }
    },

    // 点赞文章
    likeArticle() {
      if (!this.checkLogin()) return;

      this.isLiked = !this.isLiked;
      if (this.isLiked) {
        this.newsDetail.likes++;
      } else {
        this.newsDetail.likes--;
      }

      uni.showToast({
        title: this.isLiked ? "已点赞" : "已取消点赞",
        icon: "none",
      });
    },

    // 收藏文章
    collectArticle() {
      if (!this.checkLogin()) return;

      this.isCollected = !this.isCollected;
      if (this.isCollected) {
        this.newsDetail.collections++;
      } else {
        this.newsDetail.collections--;
      }

      uni.showToast({
        title: this.isCollected ? "已收藏" : "已取消收藏",
        icon: "none",
      });
    },

    // 分享文章
    shareArticle() {
      // 调用系统分享
      uni.showActionSheet({
        itemList: ["分享到微信", "分享到朋友圈", "分享到QQ", "复制链接"],
        success: (res) => {
          this.newsDetail.shares++;
          uni.showToast({
            title: "分享成功",
            icon: "success",
          });
        },
      });
    },

    // 点赞评论
    likeComment(index) {
      if (!this.checkLogin()) return;

      const comment = this.comments[index];
      comment.isLiked = !comment.isLiked;
      if (comment.isLiked) {
        comment.likes++;
      } else {
        comment.likes--;
      }
    },

    // 回复评论
    replyComment(index) {
      if (!this.checkLogin()) return;

      const comment = this.comments[index];
      this.commentText = `回复 @${comment.name}：`;
      this.openCommentPopup();
    },

    // 聚焦评论输入框
    focusCommentInput() {
      if (!this.checkLogin()) return;
      this.openCommentPopup();
    },

    // 打开评论弹窗
    openCommentPopup() {
      this.$refs.commentPopup.open();
      // 延迟设置焦点，解决某些设备上无法自动聚焦的问题
      setTimeout(() => {
        this.popupFocus = true;
      }, 300);
    },

    // 关闭评论弹窗
    closeCommentPopup() {
      this.popupFocus = false;
      this.$refs.commentPopup.close();
      this.commentText = "";
    },

    // 提交评论
    submitComment() {
      if (!this.commentText.trim()) return;

      // 添加新评论到列表
      this.comments.unshift({
        id: this.comments.length + 1,
        name: "我",
        avatar: "/static/avatar.jpg",
        content: this.commentText,
        time: "刚刚",
        likes: 0,
        isLiked: false,
      });

      uni.showToast({
        title: "评论成功",
        icon: "success",
      });

      this.closeCommentPopup();
    },

    // 切换评论排序方式
    toggleSortOrder() {
      this.sortNewest = !this.sortNewest;
    },

    // 按标签搜索
    searchByTag(tag) {
      uni.showToast({
        title: "搜索: " + tag,
        icon: "none",
      });
    },

    // 检查登录状态
    checkLogin() {
      const userInfo = uni.getStorageSync("userInfo");
      if (!userInfo) {
        uni.showModal({
          title: "提示",
          content: "请先登录",
          confirmText: "去登录",
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({
                url: "/pages/login/login",
              });
            }
          },
        });
        return false;
      }
      return true;
    },
  },
};
</script>

<style>
@font-face {
  font-family: "iconfont";
  src: url("data:font/woff2;charset=utf-8;base64,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");
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 24px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.container {
  padding-bottom: 120rpx;
}

.article-header {
  padding: 30rpx 40rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.article-title {
  font-size: 44rpx;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
  margin-bottom: 20rpx;
}

.article-meta {
  display: flex;
  align-items: center;
}

.article-source {
  font-size: 26rpx;
  color: #ff6699;
  margin-right: 20rpx;
}

.article-time {
  font-size: 26rpx;
  color: #999;
}

.article-content {
  padding: 30rpx 40rpx;
}

.article-cover {
  width: 100%;
  border-radius: 12rpx;
  margin-bottom: 30rpx;
}

.article-text {
  font-size: 32rpx;
  color: #333;
  line-height: 1.8;
}

.article-tags {
  margin-top: 40rpx;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.tag-title {
  font-size: 28rpx;
  color: #666;
  margin-right: 10rpx;
}

.tags-list {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
}

.tag-item {
  background-color: #f8f8f8;
  color: #666;
  padding: 10rpx 20rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
}

.comment-section {
  margin-top: 20rpx;
  padding: 30rpx 40rpx;
  border-top: 20rpx solid #f8f8f8;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
}

.sort-btn {
  font-size: 28rpx;
  color: #666;
  display: flex;
  align-items: center;
}

.arrow-icon {
  font-size: 24rpx;
  margin-left: 4rpx;
}

.comment-list {
  padding-bottom: 20rpx;
}

.comment-item {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.commenter-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  margin-right: 20rpx;
}

.comment-content {
  flex: 1;
}

.commenter-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.commenter-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.comment-time {
  font-size: 24rpx;
  color: #999;
}

.comment-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  margin-bottom: 10rpx;
}

.comment-actions {
  display: flex;
}

.action-item {
  display: flex;
  align-items: center;
  margin-right: 30rpx;
}

.action-icon {
  font-size: 30rpx;
  color: #999;
  margin-right: 6rpx;
}

.liked {
  color: #ff6699;
}

.collected {
  color: #ff6699;
}

.action-text {
  font-size: 24rpx;
  color: #999;
}

.no-comment {
  padding: 60rpx 0;
  text-align: center;
}

.no-comment-text {
  font-size: 28rpx;
  color: #999;
}

.comment-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  display: flex;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f5f5f5;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.comment-input-box {
  flex: 1;
  height: 70rpx;
  background-color: #f8f8f8;
  border-radius: 35rpx;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  margin-right: 20rpx;
}

.input-placeholder {
  font-size: 28rpx;
  color: #999;
}

.action-buttons {
  display: flex;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 30rpx;
}

.action-count {
  font-size: 22rpx;
  color: #999;
  margin-top: 4rpx;
}

.popup-comment {
  background-color: #ffffff;
  border-radius: 20rpx 20rpx 0 0;
  padding: 30rpx;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.popup-close {
  font-size: 28rpx;
  color: #999;
}

.popup-content {
  padding-bottom: 30rpx;
}

.comment-textarea {
  width: 100%;
  min-height: 200rpx;
  font-size: 30rpx;
  color: #333;
  line-height: 1.6;
}

.popup-footer {
  display: flex;
  justify-content: flex-end;
}

.submit-btn {
  background-color: #ff6699;
  color: #ffffff;
  font-size: 28rpx;
  padding: 0 40rpx;
  height: 70rpx;
  border-radius: 35rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.submit-btn[disabled] {
  background-color: #ffcce0;
}
</style>
