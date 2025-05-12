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

          <view class="action-buttons">
            <view class="action-btn say-hi-btn" @click.stop="sayHi(user)">
              <text>打招呼</text>
            </view>
            <view class="action-btn chat-btn" @click.stop="startChat(user)" v-if="user.isFriend">
              <text>聊天</text>
            </view>
            <view class="action-btn add-btn" @click.stop="addFriend(user)" v-else>
              <text>加好友</text>
            </view>
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

    <!-- 快捷功能按钮 -->
    <view class="quick-actions">
      <view class="quick-action-btn" @click="goToSocial">
        <text class="iconfont icon-home">&#xe672;</text>
        <text class="action-label">交友主页</text>
      </view>
      <view class="quick-action-btn" @click="goToChat">
        <text class="iconfont icon-chat">&#xe61d;</text>
        <text class="action-label">我的聊天</text>
      </view>
      <view class="quick-action-btn" @click="goToMoments">
        <text class="iconfont icon-moments">&#xe61e;</text>
        <text class="action-label">朋友圈</text>
      </view>
    </view>

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
import { getNearbyUsers } from '@/services/api/location.js';
import { updateLocation } from '@/services/api/location.js';
import { sendFriendRequest } from '@/services/api/friend.js';

export default {
  data() {
    return {
      currentLocation: '',
      locating: false,
      loading: false,
      refreshing: false,
      hasMore: true,
      nearbyUsers: [],
      page: 1,
      limit: 10,
      genderFilter: 'all',
      distanceFilter: 'all',
      onlineFilter: 'all',
      latitude: 0,
      longitude: 0,
      errorMsg: '',
      showLocationError: false
    };
  },
  onLoad() {
    this.getLocation();
  },
  onPullDownRefresh() {
    this.onRefresh();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    
    getLocation() {
      this.locating = true;
      this.showLocationError = false;
      
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          this.latitude = res.latitude;
          this.longitude = res.longitude;
          this.currentLocation = '已获取当前位置';
          
          // 更新位置到服务器
          this.updateUserLocation(res.latitude, res.longitude);
          
          // 获取位置成功后加载附近的人
          this.loadNearbyUsers();
        },
        fail: (err) => {
          console.error('获取位置失败:', err);
          this.currentLocation = '获取位置失败，请检查定位权限';
          this.showLocationError = true;
          
          uni.showToast({
            title: '获取位置失败，请检查定位权限',
            icon: 'none',
            duration: 3000
          });
        },
        complete: () => {
          this.locating = false;
        }
      });
    },
    
    // 更新用户位置到服务器
    async updateUserLocation(latitude, longitude) {
      try {
        // 使用Geo API获取城市名称
        const locationData = {
          latitude: latitude,
          longitude: longitude,
          isVisible: true // 默认可见
        };
        
        // 尝试获取城市名称
        try {
          const res = await new Promise((resolve, reject) => {
            uni.request({
              url: `https://api.map.baidu.com/reverse_geocoding/v3/?ak=YOUR_BAIDU_AK&output=json&coordtype=wgs84ll&location=${latitude},${longitude}`,
              success: resolve,
              fail: reject
            });
          });
          
          if (res.data && res.data.result && res.data.result.addressComponent) {
            locationData.city = res.data.result.addressComponent.city;
            locationData.address = res.data.result.formatted_address;
          }
        } catch (geoError) {
          console.warn('获取城市信息失败:', geoError);
        }
        
        // 更新位置到服务器
        await updateLocation(locationData);
      } catch (error) {
        console.error('更新位置失败:', error);
        // 即使更新位置失败，我们仍然可以继续加载附近的人
      }
    },
    
    refreshLocation() {
      this.getLocation();
    },
    
    onRefresh() {
      this.refreshing = true;
      this.page = 1;
      this.nearbyUsers = [];
      
      this.loadNearbyUsers()
        .finally(() => {
          this.refreshing = false;
          uni.stopPullDownRefresh();
        });
    },
    
    loadMore() {
      if (this.loading || !this.hasMore) return;
      
      this.page++;
      this.loadNearbyUsers(true);
    },
    
    loadNearbyUsers(isLoadMore = false) {
      if (this.loading && !isLoadMore) return Promise.resolve();
      
      this.loading = true;
      this.errorMsg = '';
      
      // 检查是否有位置信息
      if (!this.latitude || !this.longitude) {
        this.loading = false;
        this.errorMsg = '无法获取位置信息，请重试';
        this.showLocationError = true;
        return Promise.resolve();
      }

      const params = {
        latitude: this.latitude,
        longitude: this.longitude,
        radius: this.getRadiusFromFilter(),
        gender: this.genderFilter !== 'all' ? this.genderFilter : undefined,
        onlineOnly: this.onlineFilter === 'online',
        page: this.page,
        limit: this.limit
      };
      
      // 添加超时处理
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('请求超时，请检查网络连接')), 15000);
      });
      
      // 使用Promise.race进行超时处理
      return Promise.race([
        getNearbyUsers(params),
        timeoutPromise
      ])
        .then(response => {
          if (response && response.success && response.data) {
            const { users, total } = response.data;
            
            if (isLoadMore) {
              this.nearbyUsers = [...this.nearbyUsers, ...users];
            } else {
              this.nearbyUsers = users;
            }
            
            this.hasMore = this.nearbyUsers.length < total;
            
            if (users.length === 0 && !isLoadMore) {
              this.errorMsg = '暂无附近的人';
            }
          } else {
            throw new Error('获取数据失败');
          }
        })
        .catch(error => {
          console.error('加载附近的人失败:', error);
          this.errorMsg = error.message || '加载失败，请稍后重试';
          
          uni.showToast({
            title: '连接服务器超时，请重试',
            icon: 'none',
            duration: 3000
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    
    getRadiusFromFilter() {
      switch (this.distanceFilter) {
        case '1km': return 1;
        case '5km': return 5;
        case '10km': return 10;
        default: return 50; // 默认50km
      }
    },
    
    setGenderFilter(filter) {
      this.genderFilter = filter;
      this.page = 1;
      this.nearbyUsers = [];
      this.loadNearbyUsers();
    },
    
    setDistanceFilter(filter) {
      this.distanceFilter = filter;
      this.page = 1;
      this.nearbyUsers = [];
      this.loadNearbyUsers();
    },
    
    setOnlineFilter(filter) {
      this.onlineFilter = filter;
      this.page = 1;
      this.nearbyUsers = [];
      this.loadNearbyUsers();
    },
    
    viewProfile(userId) {
      uni.navigateTo({
        url: `/pages/social/friend-profile?id=${userId}`
      });
    },
    
    startChat(user) {
      uni.navigateTo({
        url: `/pages/social/chat?id=${user.userId}&name=${user.nickname}`
      });
    },
    
    // 添加好友
    async addFriend(user) {
      try {
        uni.showLoading({ title: '处理中...' });
        
        const response = await sendFriendRequest({
          receiverId: user.userId,
          message: `你好，我通过"附近的人"功能找到你，希望能加你为好友`
        });
        
        if (response && response.success) {
          uni.showToast({
            title: '好友请求已发送',
            icon: 'success'
          });
        }
      } catch (error) {
        console.error('发送好友请求失败:', error);
        
        uni.showToast({
          title: error.message || '发送请求失败，请稍后重试',
          icon: 'none'
        });
      } finally {
        uni.hideLoading();
      }
    },
    
    // 打招呼
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
            // 自定义消息
            uni.showModal({
              title: '打招呼',
              editable: true,
              placeholderText: '输入打招呼内容',
              success: (res) => {
                if (res.confirm && res.content) {
                  this.sendGreeting(user, res.content);
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
    
    // 发送打招呼消息
    async sendGreeting(user, message) {
      try {
        uni.showLoading({
          title: '发送中...'
        });
        
        // 这里应该调用发送消息的API
        // 暂时模拟一个成功响应
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        uni.showToast({
          title: '已发送',
          icon: 'success'
        });
        
        // 如果不是好友，询问是否添加好友
        if (!user.isFriend) {
          setTimeout(() => {
            uni.showModal({
              title: '添加好友',
              content: '要将对方添加为好友吗？',
              success: (res) => {
                if (res.confirm) {
                  this.addFriend(user);
                }
              }
            });
          }, 1500);
        }
      } catch (error) {
        uni.showToast({
          title: '发送失败',
          icon: 'none'
        });
      } finally {
        uni.hideLoading();
      }
    },
    
    goToSocial() {
      uni.switchTab({
        url: '/pages/social/social'
      });
    },
    
    goToChat() {
      uni.navigateTo({
        url: '/pages/social/chat'
      });
    },
    
    goToMoments() {
      uni.navigateTo({
        url: '/pages/social/moments'
      });
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

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.action-btn {
  padding: 10rpx 20rpx;
  background-color: #F8F8F8;
  border-radius: 30rpx;
  font-size: 24rpx;
  text-align: center;
}

.say-hi-btn {
  background-color: #FFE8EE;
  color: #FF6699;
}

.chat-btn {
  background-color: #E8F4FF;
  color: #3A86FF;
}

.add-btn {
  background-color: #E8FFF2;
  color: #38C976;
}

.quick-actions {
  position: fixed;
  bottom: 30rpx;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 20rpx;
  background-color: #FFFFFF;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  border-top: 1rpx solid #EEEEEE;
}

.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10rpx 20rpx;
}

.action-label {
  font-size: 24rpx;
  color: #666666;
  margin-top: 6rpx;
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