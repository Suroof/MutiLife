<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="menu-icon">
        <text class="position-text">Travel</text>
      </view>
      <view class="avatar-container">
        <image
          class="avatar"
          src="../../static/avatar/avatar6.jpg"
          mode="aspectFill"
          @click="toggleMine"
        ></image>
      </view>
    </view>

    <!-- 主标题 -->
    <view class="title-section">
      <text class="page-title">Discover</text>
    </view>

    <!-- 搜索栏 -->
    <view class="search-section">
      <view class="search-bar">
        <text class="search-icon">🔍</text>
        <input
          type="text"
          placeholder="Search destinations"
          class="search-input"
        />
      </view>
    </view>

    <!-- 分类导航 -->
    <view class="categories-nav">
      <view
        v-for="(category, index) in categories"
        :key="index"
        class="category-item"
        :class="{ active: category.active }"
        @click="selectCategory(category.name)"
      >
        <text class="category-text">{{ category.name }}</text>
        <view v-if="category.active" class="active-dot"></view>
      </view>
    </view>

    <!-- 加载中状态 -->
    <view class="loading-container" v-if="loading.destinations">
      <view class="loading-spinner"></view>
    </view>

    <!-- 探索卡片区域 -->
    <scroll-view
      v-else
      class="discover-scroll"
      scroll-x="true"
      show-scrollbar="false"
    >
      <view
        class="discover-card"
        v-for="(item, index) in filteredDestinations"
        :key="'dest-' + index"
      >
        <image
          class="discover-image"
          :src="item.mainImage"
          mode="aspectFill"
        ></image>
        <view
          class="bookmark-icon"
          @tap.stop="toggleBookmark(item._id)"
          v-if="item.isBookmarked"
          >📍</view
        >
        <view class="card-content">
          <text class="card-title">{{ item.name }}</text>
          <view class="location">
            <text class="location-icon">📍</text>
            <text class="location-text">{{ item.country }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 冒险想法 -->
    <view class="mood-section">
      <view class="section-header">
        <text class="section-title">Adventurous Mood?</text>
        <text class="view-all">Show all</text>
      </view>

      <!-- 加载中状态 -->
      <view class="loading-container" v-if="loading.activities">
        <view class="loading-spinner"></view>
      </view>

      <scroll-view
        v-else
        class="activities-scroll"
        scroll-x="true"
        show-scrollbar="false"
      >
        <view
          class="activity-item"
          v-for="(item, index) in activities"
          :key="'act-' + index"
          @tap="showActivityInfo(item)"
        >
          <view
            class="activity-icon"
            :style="{ backgroundColor: item.iconBackground }"
          >
            <image
              :src="item.icon"
              mode="aspectFit"
              class="activity-icon-image"
            ></image>
          </view>
          <text class="activity-name">{{ item.name }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 实用信息 -->
    <view class="info-section">
      <view class="section-header">
        <text class="section-title">Useful Information</text>
        <view class="pagination-dots">
          <view
            class="dot"
            v-for="(item, index) in infoCards"
            :key="'dot-' + index"
            :class="{ active: infoCardIndex === index }"
             @tap="goToUsefulInfomation(item)"
          ></view>
        </view>
      </view>

      <!-- 加载中状态 -->
      <view class="loading-container" v-if="loading.infoCards">
        <view class="loading-spinner"></view>
      </view>

      <scroll-view
        v-else
        class="info-scroll"
        scroll-x="true"
        show-scrollbar="false"
        @scroll="onInfoScroll"
      >
        <view
          class="info-card"
          v-for="(item, index) in infoCards"
          :key="'info-' + index"
        >
          <image class="info-image" :src="item.image" mode="aspectFill"></image>
          <view class="info-button">{{ item.buttonText || "Learn more" }}</view>
        </view>
      </scroll-view>
    </view>

    <!-- 特色体验 -->
    <view class="featured-section">
      <view class="section-header">
        <text class="section-title">Featured Experiences</text>
        <text class="view-all">View all</text>
      </view>

      <!-- 加载中状态 -->
      <view class="loading-container" v-if="loading.featuredExperiences">
        <view class="loading-spinner"></view>
      </view>

      <view v-else class="featured-grid">
        <view
          class="featured-card"
          v-for="(item, index) in featuredExperiences"
          :key="'feat-' + index"
        >
          <image
            class="featured-image"
            :src="item.image"
            mode="aspectFill"
            @tap="handleDetail(item._id)"
          ></image>
          <view class="featured-content">
            <text class="featured-title">{{ item.title }}</text>
            <view class="featured-rating">
              <text class="rating-stars">★★★★★</text>
              <text class="rating-count">{{ item.rating }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- Padding at bottom to account for tab bar -->
    <view style="height: -10rpx"></view>
  </view>

  <!-- 自定义底部导航栏 -->
  <CustomTabBar />
</template>

<script>
import CustomTabBar from "@/components/CustomTabBar.vue";
import { isAuthenticated } from "@/services/api/request.js";
import request from "@/services/api/request.js";

export default {
  components: {
    CustomTabBar,
  },
  data() {
    return {
      destinations: [],
      activities: [],
      infoCards: [],
      featuredExperiences: [],
      infoCardIndex: 0,
      loading: {
        destinations: true,
        activities: true,
        infoCards: true,
        featuredExperiences: true,
      },
      categories: [
        { name: "Experiences", active: true },
        { name: "Places", active: false },
        { name: "Housings", active: false },
      ],
      currentCategory: "Experiences",
      filteredDestinations: [],
    };
  },
  onLoad() {
    // 检查用户是否已登录，如果未登录则重定向到登录页面
    if (!isAuthenticated()) {
      uni.navigateTo({
        url: "/pages/login/login",
      });
      return;
    }

    // 加载所有数据
    this.fetchDestinations();
    this.fetchActivities();
    this.fetchInfoCards();
    this.fetchFeaturedExperiences();
    this.filterContent();
  },
  methods: {
    //获取详情
    handleDetail(id) {
      uni.navigateTo({
        url: `/pages/travel/FeatureDetail?id=${id}`,
      });
    },
    // 获取目的地数据
    async fetchDestinations() {
      try {
        const response = await request.get("/travel/destinations");
        if (response.success) {
          this.destinations = response.data;
        } else {
          uni.showToast({
            title: "获取目的地数据失败",
            icon: "none",
          });
        }
      } catch (error) {
        console.error("获取目的地数据错误:", error);
        uni.showToast({
          title: "获取目的地数据错误",
          icon: "none",
        });
      } finally {
        this.loading.destinations = false;
        this.filterContent(); 
      }
    },

    // 获取活动数据
    async fetchActivities() {
      try {
        const response = await request.get("/travel/activities");
        if (response.success) {
          this.activities = response.data;
        } else {
          uni.showToast({
            title: "获取活动数据失败",
            icon: "none",
          });
        }
      } catch (error) {
        console.error("获取活动数据错误:", error);
        uni.showToast({
          title: "获取活动数据错误",
          icon: "none",
        });
      } finally {
        this.loading.activities = false;
      }
    },

    // 获取信息卡片数据
    async fetchInfoCards() {
      try {
        const response = await request.get("/travel/infocards");
        if (response.success) {
          this.infoCards = response.data;
        } else {
          uni.showToast({
            title: "获取信息卡片数据失败",
            icon: "none",
          });
        }
      } catch (error) {
        console.error("获取信息卡片数据错误:", error);
        uni.showToast({
          title: "获取信息卡片数据错误",
          icon: "none",
        });
      } finally {
        this.loading.infoCards = false;
      }
    },

    // 获取特色体验数据
    async fetchFeaturedExperiences() {
      try {
        const response = await request.get("/travel/featured-experiences");
        if (response.success) {
          this.featuredExperiences = response.data;
        } else {
          uni.showToast({
            title: "获取特色体验数据失败",
            icon: "none",
          });
        }
      } catch (error) {
        console.error("获取特色体验数据错误:", error);
        uni.showToast({
          title: "获取特色体验数据错误",
          icon: "none",
        });
      } finally {
        this.loading.featuredExperiences = false;
      }
    },

    // 切换收藏状态
    async toggleBookmark(id) {
      try {
        const response = await request.patch(
          `/travel/destinations/${id}/bookmark`
        );
        if (response.success) {
          // 更新本地数据
          const index = this.destinations.findIndex((item) => item._id === id);
          if (index !== -1) {
            this.destinations[index].isBookmarked =
              !this.destinations[index].isBookmarked;
          }

          uni.showToast({
            title: this.destinations[index].isBookmarked
              ? "已添加收藏"
              : "已取消收藏",
            icon: "success",
          });
        }
      } catch (error) {
        console.error("更新收藏状态错误:", error);
        uni.showToast({
          title: "更新收藏状态失败",
          icon: "none",
        });
      }
    },

    //跳转到我的页面
    toggleMine() {
      uni.navigateTo({
        url: "/pages/mine/mine",
      });
    },
    // 监听信息卡片滚动，更新指示点
    onInfoScroll(e) {
      // 根据滚动位置计算当前显示的卡片
      if (!this.infoCards.length) return;

      const scrollLeft = e.detail.scrollLeft;
      const cardWidth = 400; // info-card的宽度
      const index = Math.round(scrollLeft / cardWidth);

      if (index >= 0 && index < this.infoCards.length) {
        this.infoCardIndex = index;
      }
    },

    //打开详情模态框
    showActivityInfo(item) {
      const description = item.description || "暂无详细介绍";
      const formattedDescription = `${description}`;
      uni.showModal({
        title: item.name,
        content: formattedDescription,
        showCancel: false,
        confirmText: "确定",
      });
    },

    goToUsefulInfomation(item){
      uni.navigateTo({
        url: `/pages/travel/UsefulInformation?id=${item._id}`,
      });
    },

    selectCategory(categoryName) {
      this.categories = this.categories.map((cat) => ({
        ...cat,
        active: cat.name === categoryName,
      }));
      this.currentCategory = categoryName;
      this.filterContent();
    },

    filterContent() {
      if (this.currentCategory === "Experiences") {
        // 显示 Experiences 类型的目的地
        this.filteredDestinations = this.destinations.filter(
          (d) => d.type === 1
        );
      } else if (this.currentCategory === "Places") {
        this.filteredDestinations = this.destinations.filter(
          (d) => d.type === 2
        );
      } else if (this.currentCategory === "Housings") {
        this.filteredDestinations = this.destinations.filter(
          (d) => d.type === 3
        );
      }
    },
  },
};
</script>

<style>
.container {
  padding: 40rpx 30rpx;
  background-color: #ffffff;
  min-height: 100vh;
  box-sizing: border-box;
  position: relative;
}

/* 添加淡色背景装饰 */
.container::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 500rpx;
  height: 500rpx;
  background: radial-gradient(
    circle,
    rgba(255, 85, 51, 0.05) 0%,
    rgba(255, 85, 51, 0) 70%
  );
  z-index: 0;
}

/* 顶部导航栏 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  position: relative;
  z-index: 1;
  background-image:linear-gradient(135deg, #f16021, #f3ba71) ;
  border-radius: 18px;
}

.menu-icon {
  width: 12 0rpx;
  height: 50rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s;
}

.position-text {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  background:linear-gradient(135deg, #fffdb4, #9386ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
  margin-left:11px;
}

.avatar-container {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  overflow: hidden;
  border: 3rpx solid #ffffff;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.avatar {
  width: 100%;
  height: 100%;
}

/* 主标题 */
.title-section {
  margin-bottom: 30rpx;
  position: relative;
  z-index: 1;
}

.page-title {
  font-size: 58rpx;
  font-weight: bold;
  color: #333;
  background: linear-gradient(135deg, #ff5533, #ff8566);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

/* 搜索栏 */
.search-section {
  margin-bottom: 40rpx;
  position: relative;
  z-index: 1;
}

.search-bar {
  display: flex;
  align-items: center;
  height: 80rpx;
  background-color: #f8f8f8;
  border-radius: 40rpx;
  padding: 0 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.search-bar:hover {
  background-color: #f0f0f0;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
}

.search-icon {
  margin-right: 10rpx;
  font-size: 32rpx;
  color: #999;
}

.search-input {
  flex: 1;
  height: 80rpx;
  font-size: 28rpx;
  color: #333;
}

/* 分类导航 */
.categories-nav {
  display: flex;
  margin-bottom: 40rpx;
  position: relative;
  z-index: 1;
}

.category-item {
  margin-right: 40rpx;
  position: relative;
  padding-bottom: 15rpx;
  transition: all 0.3s;
}

.category-text {
  font-size: 28rpx;
  color: #999;
  transition: all 0.3s;
}

.active .category-text {
  color: #ff5533;
  font-weight: 500;
  transform: scale(1.05);
}

.active-dot {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background-color: #ff5533;
  transition: all 0.3s;
}

.active:hover .active-dot {
  transform: translateX(-50%) scale(1.5);
}

/* 加载中状态 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40rpx 0;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #f0f0f0;
  border-top-color: #ff5533;
  border-radius: 50%;
  animation: spinner 0.8s linear infinite;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

/* 探索卡片 */
.discover-scroll {
  white-space: nowrap;
  margin: 0 -30rpx;
  padding: 0 30rpx;
  margin-bottom: 50rpx;
  position: relative;
  z-index: 1;
}

.discover-card {
  display: inline-block;
  width: 500rpx;
  height: 300rpx;
  border-radius: 24rpx;
  margin-right: 25rpx;
  margin-top: 20rpx;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
}

.discover-card:hover {
  transform: translateY(-10rpx);
  box-shadow: 0 15rpx 30rpx rgba(0, 0, 0, 0.2);
}

.discover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.discover-card:hover .discover-image {
  transform: scale(1.05);
}

.bookmark-icon {
  position: absolute;
  top: 0;
  right: 30rpx;
  width: 30rpx;
  height: 50rpx;
  background: linear-gradient(to bottom, #ff5533, #ff7755);
  border-bottom-left-radius: 5rpx;
  border-bottom-right-radius: 5rpx;
  box-shadow: 0 4rpx 10rpx rgba(255, 85, 51, 0.3);
}

.card-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 25rpx;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0) 100%
  );
}

.card-title {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: bold;
  margin-bottom: 10rpx;
  display: block;
}

.location {
  display: flex;
  align-items: center;
}

.location-icon {
  font-size: 24rpx;
  margin-right: 8rpx;
}

.location-text {
  font-size: 24rpx;
  color: #ffffff;
}

/* 冒险模式 */
.mood-section {
  margin-bottom: 40rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25rpx;
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

.activities-scroll {
  white-space: nowrap;
  margin: 0 -30rpx;
  padding: 0 30rpx;
}

.activity-item {
  display: inline-block;
  flex-direction: column;
  align-items: center;
  margin-right: 40rpx;
  margin-top: 80rpx;
  text-align: center;
  transition: all 0.3s;
}

.activity-item:hover {
  transform: translateY(-5rpx);
}

.activity-icon {
  width: 110rpx;
  height: 110rpx;
  border-radius: 50%;
  margin-bottom: 15rpx;
  background-color: #ffeee6;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 6rpx 15rpx rgba(255, 85, 51, 0.15);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.activity-icon::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0)
  );
  border-radius: 50%;
}

.activity-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 8rpx 20rpx rgba(255, 85, 51, 0.25);
}

.activity-icon-image {
  width: 50%;
  height: 50%;
}

.activity-name {
  font-size: 22rpx;
  color: #666;
  font-weight: 500;
  transition: all 0.3s;
}

.activity-item:hover .activity-name {
  color: #ff5533;
}

/* 实用信息 */
.info-section {
  margin-bottom: 40rpx;
}

.pagination-dots {
  display: flex;
}

.dot {
  width: 20rpx;
  height: 6rpx;
  background-color: #ddd;
  margin-right: 5rpx;
  border-radius: 3rpx;
  transition: all 0.3s;
}

.dot.active {
  background: linear-gradient(to right, #ff5533, #ff7755);
  width: 30rpx;
}

.info-scroll {
  white-space: nowrap;
  margin: 0 -30rpx;
  padding: 0 30rpx;
}

.info-card {
  display: inline-block;
  width: 400rpx;
  height: 240rpx;
  border-radius: 20rpx;
  margin-right: 25rpx;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
}

.info-card:hover {
  transform: translateY(-8rpx);
  box-shadow: 0 15rpx 30rpx rgba(0, 0, 0, 0.2);
}

.info-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.85);
}

.info-button {
  position: absolute;
  bottom: 30rpx;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(to right, #ff5533, #ff7755);
  color: white;
  font-size: 28rpx;
  font-weight: 500;
  padding: 12rpx 30rpx;
  border-radius: 30rpx;
  text-align: center;
  min-width: 180rpx;
  box-shadow: 0 4rpx 15rpx rgba(255, 85, 51, 0.3);
  transition: all 0.3s;
}

.info-card:hover .info-button {
  transform: translateX(-50%) scale(1.05);
  box-shadow: 0 6rpx 20rpx rgba(255, 85, 51, 0.4);
}

/* 特色体验 */
.featured-section {
  margin-bottom: 40rpx;
}

.featured-grid {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.featured-card {
  width: 48%;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
  margin-bottom: 20rpx;
  transition: all 0.3s;
}

.featured-card:hover {
  transform: translateY(-8rpx);
  box-shadow: 0 15rpx 30rpx rgba(0, 0, 0, 0.15);
}

.featured-image {
  width: 100%;
  height: 200rpx;
  object-fit: cover;
  transition: transform 0.5s;
}

.featured-card:hover .featured-image {
  transform: scale(1.05);
}

.featured-content {
  padding: 20rpx;
  background: linear-gradient(to bottom, #fff, #fafafa);
}

.featured-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.featured-rating {
  display: flex;
  align-items: center;
}

.rating-stars {
  color: #ff5533;
  font-size: 24rpx;
  margin-right: 8rpx;
  letter-spacing: 2rpx;
}

.rating-count {
  font-size: 24rpx;
  color: #999;
}

.app-container {
  padding: 40rpx 30rpx;
  background-color: #ffffff;
  min-height: 100vh;
  box-sizing: border-box;
}
</style>
