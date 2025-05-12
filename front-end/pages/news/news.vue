<template>
  <view class="container">
    <!-- 顶部分类切换 -->
    <view class="category-tabs">
      <scroll-view scroll-x="true" class="scroll-view-x" show-scrollbar="false">
        <view
          class="tab-item"
          v-for="(item, index) in categories"
          :key="index"
          :class="{ 'active-tab': currentCategory === index }"
          @tap="switchCategory(index)"
        >
          <text class="tab-text">{{ item.name }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 轮播图 -->
    <swiper
      class="banner-swiper"
      indicator-dots="true"
      autoplay="true"
      interval="3000"
      duration="500"
      circular="true"
    >
      <swiper-item
        v-for="(item, index) in banners"
        :key="index"
        @tap="openNewsDetail(item)"
      >
        <view class="banner-item">
          <image
            class="banner-image"
            :src="item.image"
            mode="aspectFill"
          ></image>
          <view class="banner-title-box">
            <text class="banner-title">{{ item.title }}</text>
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
        <view
          class="hot-news-item"
          v-for="(item, index) in hotNews"
          :key="index"
          @tap="openNewsDetail(item)"
        >
          <image
            class="hot-news-image"
            :src="item.image"
            mode="aspectFill"
          ></image>
          <text class="hot-news-title">{{ item.title }}</text>
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
        <view
          class="news-item"
          v-for="(item, index) in newsList"
          :key="index"
          @tap="openNewsDetail(item)"
        >
          <view class="news-image-container" v-if="item.image">
            <image
              class="news-image"
              :src="item.image"
              mode="aspectFill"
            ></image>
          </view>
          <view class="news-content" :class="{ 'full-width': !item.image }">
            <text class="news-title">{{ item.title }}</text>
            <view class="news-info">
              <text class="news-source">{{ item.source }}</text>
              <text class="news-time">{{ item.time }}</text>
              <text class="news-comments">{{ item.comments }}评论</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载更多提示 -->
      <view class="load-more" v-if="newsList.length > 0" @tap="loadMoreNews">
        <text class="load-more-text">{{
          hasMore ? "加载更多" : "已显示全部内容"
        }}</text>
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
import CustomTabBar from "@/components/CustomTabBar.vue";
import request from "@/services/api/request.js";
export default {
  components: {
    CustomTabBar,
  },
  data() {
    return {
      // 分类数据
      categories: [
        { name: "推荐" },
        { name: "热点" },
        { name: "科技" },
        { name: "财经" },
        { name: "体育" },
        { name: "娱乐" },
        { name: "健康" },
        { name: "教育" },
      ],
      currentCategory: 0,

      // 轮播图数据
      banners: [],

      // 热门推荐新闻
      hotNews: [],

      // 新闻列表
      newsList: [],

      // 状态控制
      isRefreshing: false,
      hasMore: true,
      showBackToTop: false,
      page: 1,
      isLoading: false,
    };
  },

  onLoad() {
    // 页面加载时获取数据
    this.getCategories();
    this.getBanners();
    this.getHotNews();
    this.getNewsList();
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
    // 获取分类数据
    async getCategories() {
      try {
        const response = await request.get('/news/categories');
        if(response.success) {
          // 在推荐和热点前添加后端获取的分类
          this.categories = [
            { name: '推荐' },
            { name: '热点' },
            ...response.data.map(category => ({ name: category }))
          ];
        }
      } catch(error) {
        console.error('获取新闻分类失败:', error);
        uni.showToast({
          title: '获取分类失败',
          icon: 'none'
        });
      }
    },

    // 获取轮播图数据（使用推荐新闻作为轮播图）
    async getBanners() {
      try {
        const response = await request.get('/news/recommended', { limit: 3 });
        if(response.success && response.data.length > 0) {
          this.banners = response.data.map(item => ({
            id: item._id,
            title: item.title,
            image: item.coverImage || 'https://tse4-mm.cn.bing.net/th/id/OIP-C.eZUbrF5ICvANJ9v1sbV4BAHaDt?w=339&h=174&c=7&r=0&o=5&dpr=1.3&pid=1.7'
          }));
        }
      } catch(error) {
        console.error('获取轮播图数据失败:', error);
        // 保留静态数据作为备用
      }
    },

    // 获取热门推荐新闻
    async getHotNews() {
      try {
        const response = await request.get('/news/hot', { limit: 4 });
        console.log('热门新闻响应:', response);
        if(response.success && response.data.length > 0) {
          this.hotNews = response.data.map(item => ({
            id: item._id,
            title: item.title,
            image: item.coverImage || 'https://tse2-mm.cn.bing.net/th/id/OIP-C.0JrLQnq56rOz-O_l1ZlRlAHaFs?w=254&h=195&c=7&r=0&o=5&dpr=1.3&pid=1.7'
          }));
        }
      } catch(error) {
        console.error('获取热门推荐新闻失败:', error);
        // 保留静态数据作为备用
        uni.showToast({
          title: '获取热门新闻失败',
          icon: 'none'
        });
      }
    },

    // 获取新闻列表
    async getNewsList(refresh = false) {
      if(refresh) {
        this.page = 1;
      }

      try {
        const params = {
          page: this.page,
          limit: 10
        };

        // 根据当前分类筛选
        if(this.currentCategory > 1) { // 0是推荐，1是热点，其余是具体分类
          params.category = this.categories[this.currentCategory].name;
        } else if(this.currentCategory === 1) { // 热点
          params.hot = 'true';
        } else { // 推荐
          params.recommended = 'true';
        }

        console.log('请求参数:', params);
        const response = await request.get('/news/list', params);
        console.log('新闻列表响应:', response);

        if(response.success && response.data.list) {
          const formattedNews = response.data.list.map(item => ({
            id: item._id,
            title: item.title,
            source: item.author || '未知来源',
            time: this.formatTime(item.publishDate),
            comments: item.commentCount || 0,
            image: item.coverImage || ''
          }));

          if(refresh) {
            this.newsList = formattedNews;
          } else {
            this.newsList = [...this.newsList, ...formattedNews];
          }

          // 判断是否还有更多数据
          this.hasMore = this.page < response.data.pagination.pages;
        }
      } catch(error) {
        console.error('获取新闻列表失败:', error);
        // 保留静态数据作为备用
        uni.showToast({
          title: '获取新闻列表失败',
          icon: 'none'
        });
      }
    },

    // 格式化时间
    formatTime(dateString) {
      const publishDate = new Date(dateString);
      const now = new Date();
      const diffMs = now - publishDate;
      const diffMins = Math.floor(diffMs / (1000 * 60));

      if(diffMins < 60) {
        return `${diffMins}分钟前`;
      } else if(diffMins < 24 * 60) {
        return `${Math.floor(diffMins / 60)}小时前`;
      } else {
        return `${Math.floor(diffMins / (60 * 24))}天前`;
      }
    },

    // 切换分类
    switchCategory(index) {
      this.currentCategory = index;
      this.refreshNews();
    },

    // 刷新新闻
    refreshNews() {
      this.isRefreshing = true;

      // 获取新数据
      this.getNewsList(true).then(() => {
        this.isRefreshing = false;
        uni.stopPullDownRefresh();
      }).catch(() => {
        this.isRefreshing = false;
        uni.stopPullDownRefresh();
      });
    },

    // 加载更多新闻
    loadMoreNews() {
      if (!this.hasMore || this.isLoading) return;

      this.isLoading = true;
      this.page++;

      this.getNewsList().finally(() => {
        this.isLoading = false;
      });
    },

    // 查看热门新闻列表
    viewAllHot() {
      this.currentCategory = 1; // 切换到热点分类
      this.refreshNews();
    },

    // 打开新闻详情
    openNewsDetail(item) {
      console.log('正在打开新闻详情，新闻ID:', item.id);
      uni.navigateTo({
        url: `/pages/news/detail?id=${item.id}`,
      });
    },

    // 滚动到顶部
    scrollToTop() {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300,
      });
    },
  },
};
</script>

<style>
@font-face {
  font-family: "iconfont";
  src: url("data:font/woff2;charset=utf-8;base64,d09GMgABAAAAAAQsAAsAAAAACQAAAAPeAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDMgqEWIQlATYCJAMUCwwABCAFhGcHUBtmB8gOJcHAwAAAAADiIR77Y+7u7hIaIIkW88h0eoIkWqNYCVqhezJx+LNJ/Pty2nsSHkCdqoyqXbvw7HKWVRXvZOGhjIdHJnECnyMB1JtQbNgOQAEz4WsGCAD85v7X0+w/WCcvmzxyLqoKbBf+F8oFGgiMsf/NOl0arUm8AQrQ3hjbou5CnE8g2TRTOJ9TUAWuCnQpEA/bLQauJqIauEIPXdlbLKx4qaFnepoeAV6E3x//YBFXSZpMP/XwJOsE5T/tP1WVf5WLAZHHc0N7kbEBFOJJpeceCsIbKJLMv9bswM/QSz7tp/3/X0ZQK+0fHiGyRDRCp0fxIaG5/mkfDZ/2CYQTpEpSk71UUjI3gR+AvAf8QOUdYTI1ItsRcTWMV5+9EyfXM5Ph7PgRvLBzXVDk+2yVtaO9swKC/aXYNtZPnDy9Qjg52eLEoQnVj5V4OI3m4XTVt0FT3+ZxmLPNI78erRvNg1OTHUr6NbP35jk3jpUxvBrH8Oqsm+WtxqC989y9Zj60y2TQXRwZc7PxG9A+Vj4ELn7r1xw0xKmunhjz1XBMOzdOxvHk+Cqax6fxPDaBYd/eMXtnTw+P9xZN78OZ+5vT9C7MvCsmH85gbx1dMcHHgX07uxvsfJsb2F4cbRzdx+GhpZnT3Vy1cnH7v7Dkgx3YW2btsVnAj3Ky8aTEHDHv/wj0ZdH/WXSuN+1WXG9JfQG20bKQ43p7z5gzlN1v3IW5AxH5HwAKH6oGnNw9J98Eir2/bfIAOLcn/0/zZ3HuL/iiAgAkiDH/pfZrz4uu9BbSUoTFi24ggAGAJ+wKCz6Zt3VBUoUAKO6huhJWcV1Z5E/T6XADfkMSepD0LCHrmUfd2A3QM7AFrZ4DSLYutL/HT6QoClYtANa8AwhzV5BMvUU29wV1Y39Az8IfaJkHIrllPTvmeLJYqRgFOYb+QJPJKtbGCvkDYx0jtDw+Er4hZ/ahs6ZuuEdOsY/tKnM0UUZUcAavg/tImkaSYzSIo7rRtszlfj+9TK5iJZE5CBiL3E7QiImVsNawEvm8PRrK50cEecMXpZrJQ44a9dCboxxFfjHbSmYxDjVCKUQJnAHTgX0RaRSRLt4xMhCHVKeQVky67Hy6v7z2vBWQazsRKXLUaBhjQsbJUTZJy3Qpxo6lDQAA")
    format("woff2");
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 24px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.container {
  background-color: #f8f8f8;
  padding-bottom: 20rpx;
}

.category-tabs {
  position: sticky;
  top: 0;
  background-color: #ffffff;
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
  line-height: 0.5rem;
  position: relative;
}

.tab-text {
  font-size: 28rpx;
  color: #666;
}

.active-tab {
  color: #ff6699;
}

.active-tab .tab-text {
  color: #ff6699;
  font-weight: bold;
}

.active-tab::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 6rpx;
  background-color: #ff6699;
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
  color: #ffffff;
  font-size: 32rpx;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.section {
  padding: 30rpx;
  background-color: #ffffff;
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
  background-color: #ffffff;
  padding: 20rpx 30rpx;
}

.news-list {
  margin-bottom: 30rpx;
}

.news-item {
  display: flex;
  padding: 30rpx 0;
  border-bottom: 1px solid #f0f0f0;
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

.news-source,
.news-time {
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
  border: 2rpx solid #f0f0f0;
  border-top-color: #ff6699;
  animation: spin 0.8s linear infinite;
  margin-right: 20rpx;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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