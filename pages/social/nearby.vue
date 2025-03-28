<template>
  <view class="nearby-container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="nav-left" @click="goBack">
        <text class="iconfont icon-back">&#xe679;</text>
      </view>
      <view class="nav-title">附近的人</view>
      <view class="nav-right" @click="refreshLocation">
        <text class="iconfont icon-refresh">&#xe62f;</text>
      </view>
    </view>

    <!-- 定位信息 -->
    <view class="location-info">
      <text class="iconfont icon-location">&#xe651;</text>
      <text v-if="locating">正在获取位置...</text>
      <text v-else-if="currentLocation">{{currentLocation}}</text>
      <text v-else>未获取到位置信息</text>
    </view>

    <!-- 过滤选项 -->
    <view class="filter-options">
      <view class="filter-row">
        <text class="filter-label">性别</text>
        <view class="filter-items">
          <view
            class="filter-item"
            :class="{ active: genderFilter === 'all' }"
            @click="setGenderFilter('all')"
          >
            全部
          </view>
          <view
            class="filter-item"
            :class="{ active: genderFilter === 'male' }"
            @click="setGenderFilter('male')"
          >
            男生
          </view>
          <view
            class="filter-item"
            :class="{ active: genderFilter === 'female' }"
            @click="setGenderFilter('female')"
          >
            女生
          </view>
        </view>
      </view>

      <view class="filter-row">
        <text class="filter-label">距离</text>
        <view class="filter-items">
          <view
            class="filter-item"
            :class="{ active: distanceFilter === 'all' }"
            @click="setDistanceFilter('all')"
          >
            全部
          </view>
          <view
            class="filter-item"
            :class="{ active: distanceFilter === '1km' }"
            @click="setDistanceFilter('1km')"
          >
            1km内
          </view>
          <view
            class="filter-item"
            :class="{ active: distanceFilter === '5km' }"
            @click="setDistanceFilter('5km')"
          >
            5km内
          </view>
          <view
            class="filter-item"
            :class="{ active: distanceFilter === '10km' }"
            @click="setDistanceFilter('10km')"
          >
            10km内
          </view>
        </view>
      </view>

      <view class="filter-row">
        <text class="filter-label">在线</text>
        <view class="filter-items">
          <view
            class="filter-item"
            :class="{ active: onlineFilter === 'all' }"
            @click="setOnlineFilter('all')"
          >
            全部
          </view>
          <view
            class="filter-item"
            :class="{ active: onlineFilter === 'online' }"
            @click="setOnlineFilter('online')"
          >
            在线
          </view>
        </view>
      </view>
    </view>

    <!-- 用户列表 -->
    <scroll-view
      class="user-list"
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

      <block v-if="nearbyUsers.length > 0">
        <view
          v-for="(user, index) in nearbyUsers"
          :key="index"
          class="user-item"
          @click="viewProfile(user.userId)"
        >
          <view class="user-avatar-container">
            <image class="user-avatar" :src="user.avatar" mode="aspectFill"></image>
            <view v-if="user.online" class="online-badge"></view>
          </view>

          <view class="user-info">
            <view class="user-name-row">
              <text class="user-name">{{user.nickname}}</text>
              <text class="user-gender" :class="user.gender">{{user.gender === 'male' ? '♂' : '♀'}}</text>
            </view>

            <view class="user-status">
              <text class="status-text">{{user.statusText}}</text>
            </view>

            <view class="user-details">
              <text class="distance">{{user.distance}}</text>
              <text class="last-active">{{user.lastActive}}</text>
            </view>
          </view>

          <view class="action-btn" @click.stop="sayHi(user)">
            <text>打招呼</text>
          </view>
        </view>
      </block>

      <view v-else-if="!loading" class="empty-tip">
        <image class="empty-icon" src="/static/social/empty.png" mode="aspectFit"></image>
        <text class="empty-text">暂时没有找到附近的人</text>
        <text class="empty-hint">换个地方试试吧</text>
      </view>

      <!-- 加载更多提示 -->
      <view class="loading-more" v-if="hasMore && nearbyUsers.length > 0">
        <text>正在加载更多...</text>
      </view>
      <view class="no-more" v-else-if="nearbyUsers.length > 0">
        <text>没有更多用户了</text>
      </view>
    </scroll-view>

    <!-- 加载中遮罩 -->
    <view class="loading-mask" v-if="loading">
      <view class="loading-content">
        <image class="loading-icon" src="/static/loading.gif" mode="aspectFit"></image>
        <text class="loading-text">正在搜索附近的人...</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      locating: true,
      currentLocation: '',
      refreshing: false,
      loading: true,
      hasMore: true,
      genderFilter: 'all',
      distanceFilter: 'all',
      onlineFilter: 'all',
      nearbyUsers: []
    };
  },
  onLoad() {
    this.getLocation();
    this.loadNearbyUsers();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },

    getLocation() {
      this.locating = true;

      // 模拟获取位置
      setTimeout(() => {
        this.locating = false;
        this.currentLocation = '北京市朝阳区三里屯';
      }, 1500);
    },

    refreshLocation() {
      this.getLocation();
      this.refreshing = true;
      setTimeout(() => {
        this.refreshing = false;
        this.loadNearbyUsers();
      }, 1500);
    },

    onRefresh() {
      this.refreshing = true;

      // 模拟刷新操作
      setTimeout(() => {
        this.refreshing = false;
        this.loadNearbyUsers();

        uni.showToast({
          title: '刷新成功',
          icon: 'success'
        });
      }, 1500);
    },

    loadMore() {
      if (!this.hasMore || this.loading) return;

      // 模拟加载更多
      this.loading = true;

      setTimeout(() => {
        const moreUsers = [
          {
            userId: '6001',
            nickname: '王强',
            avatar: '/static/avatar/avatar7.jpg',
            gender: 'male',
            distance: '2.7km',
            statusText: '玩游戏中',
            online: true,
            lastActive: '刚刚'
          },
          {
            userId: '7001',
            nickname: '陈小红',
            avatar: '/static/avatar/avatar8.jpg',
            gender: 'female',
            distance: '3.1km',
            statusText: '一起听歌吧',
            online: false,
            lastActive: '10分钟前'
          }
        ];

        this.nearbyUsers = [...this.nearbyUsers, ...moreUsers];
        this.loading = false;

        // 模拟数据到底了
        if (this.nearbyUsers.length > 8) {
          this.hasMore = false;
        }
      }, 1500);
    },

    loadNearbyUsers() {
      this.loading = true;
      this.nearbyUsers = [];
      this.hasMore = true;

      // 模拟加载数据
      setTimeout(() => {
        this.nearbyUsers = [
          {
            userId: '1001',
            nickname: '张小明',
            avatar: '/static/avatar/avatar2.jpg',
            gender: 'male',
            distance: '0.5km',
            statusText: '想认识新朋友',
            online: true,
            lastActive: '刚刚'
          },
          {
            userId: '2001',
            nickname: '李娜',
            avatar: '/static/avatar/avatar3.jpg',
            gender: 'female',
            distance: '0.8km',
            statusText: '喜欢旅游和摄影',
            online: true,
            lastActive: '5分钟前'
          },
          {
            userId: '3001',
            nickname: '王刚',
            avatar: '/static/avatar/avatar4.jpg',
            gender: 'male',
            distance: '1.2km',
            statusText: '工作中',
            online: false,
            lastActive: '1小时前'
          },
          {
            userId: '4001',
            nickname: '赵丽',
            avatar: '/static/avatar/avatar5.jpg',
            gender: 'female',
            distance: '1.5km',
            statusText: '学习ing',
            online: true,
            lastActive: '10分钟前'
          },
          {
            userId: '5001',
            nickname: '周杰',
            avatar: '/static/avatar/avatar6.jpg',
            gender: 'male',
            distance: '1.9km',
            statusText: '听音乐中',
            online: false,
            lastActive: '30分钟前'
          }
        ];

        this.loading = false;
      }, 2000);
    },

    setGenderFilter(filter) {
      this.genderFilter = filter;
      this.loadNearbyUsers();
    },

    setDistanceFilter(filter) {
      this.distanceFilter = filter;
      this.loadNearbyUsers();
    },

    setOnlineFilter(filter) {
      this.onlineFilter = filter;
      this.loadNearbyUsers();
    },

    viewProfile(userId) {
      uni.navigateTo({
        url: `/pages/social/friend-profile?id=${userId}`
      });
    },

    sayHi(user) {
      uni.showActionSheet({
        itemList: ['发送: 你好，很高兴认识你', '发送: 我们可以交个朋友吗？', '自定义打招呼'],
        success: (res) => {
          let message = '';

          if (res.tapIndex === 0) {
            message = '你好，很高兴认识你';
          } else if (res.tapIndex === 1) {
            message = '我们可以交个朋友吗？';
          } else if (res.tapIndex === 2) {
            // 使用输入框让用户自定义消息
            uni.showModal({
              title: '自定义打招呼',
              content: '',
              editable: true,
              placeholderText: '输入打招呼消息',
              success: (modalRes) => {
                if (modalRes.confirm && modalRes.content) {
                  this.sendGreeting(user, modalRes.content);
                }
              }
            });
            return;
          }

          if (message) {
            this.sendGreeting(user, message);
          }
        }
      });
    },

    sendGreeting(user, message) {
      uni.showLoading({
        title: '发送中...'
      });

      setTimeout(() => {
        uni.hideLoading();

        uni.showToast({
          title: '已发送打招呼',
          icon: 'success'
        });

        // 可以跳转到聊天页面
        setTimeout(() => {
          uni.navigateTo({
            url: `/pages/social/chat?id=${user.userId}&nickname=${user.nickname}`
          });
        }, 1000);
      }, 1000);
    }
  }
};
</script>

<style>
.nearby-container {
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

/* 位置信息 */
.location-info {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #ffffff;
  font-size: 14px;
  color: #666666;
  border-bottom: 1px solid #f0f0f0;
}

.location-info .iconfont {
  margin-right: 5px;
  color: #5d9afe;
}

/* 过滤选项 */
.filter-options {
  background-color: #ffffff;
  padding: 10px 15px;
  margin-bottom: 10px;
}

.filter-row {
  display: flex;
  margin-bottom: 10px;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-label {
  width: 40px;
  font-size: 14px;
  color: #666666;
  padding-top: 5px;
}

.filter-items {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
}

.filter-item {
  padding: 5px 12px;
  margin-right: 10px;
  margin-bottom: 5px;
  font-size: 14px;
  color: #666666;
  background-color: #f0f0f0;
  border-radius: 15px;
}

.filter-item.active {
  background-color: #FF6699;
  color: #ffffff;
}

/* 用户列表 */
.user-list {
  flex: 1;
  padding: 0 10px;
}

.loading-hint, .loading-more, .no-more {
  padding: 10px 0;
  text-align: center;
  font-size: 14px;
  color: #999999;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #ffffff;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.user-avatar-container {
  position: relative;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-right: 12px;
}

.online-badge {
  position: absolute;
  right: 12px;
  bottom: 0;
  width: 12px;
  height: 12px;
  background-color: #4CAF50;
  border-radius: 6px;
  border: 2px solid #ffffff;
}

.user-info {
  flex: 1;
}

.user-name-row {
  display: flex;
  align-items: center;
}

.user-name {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  margin-right: 5px;
}

.user-gender {
  font-size: 14px;
  padding: 0 5px;
  border-radius: 10px;
}

.user-gender.male {
  color: #5d9afe;
}

.user-gender.female {
  color: #FF6699;
}

.user-status {
  margin: 5px 0;
}

.status-text {
  font-size: 14px;
  color: #666666;
}

.user-details {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999999;
}

.distance {
  margin-right: 10px;
}

.action-btn {
  padding: 8px 15px;
  background-color: #FF6699;
  color: #ffffff;
  font-size: 14px;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(255, 102, 153, 0.2);
}

/* 空状态 */
.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.empty-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 15px;
}

.empty-text {
  font-size: 16px;
  color: #666666;
  margin-bottom: 5px;
}

.empty-hint {
  font-size: 14px;
  color: #999999;
}

/* 加载中遮罩 */
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
}

.loading-text {
  font-size: 14px;
  color: #666666;
}
</style>