<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="nav-left" @click="goBack">
        <text class="iconfont icon-back">&#xe679;</text>
      </view>
      <view class="nav-title">面对面添加</view>
    </view>

    <!-- 主要内容区 -->
    <view class="content-area">
      <view class="face-to-face-card">
        <image class="ftf-logo" src="/static/social/face-to-face.png" mode="aspectFit"></image>
        <text class="ftf-title">面对面建立连接</text>
        <text class="ftf-desc">当你和朋友在同一位置时，可以互相添加好友</text>
        
        <view class="connection-status" v-if="isSearching">
          <view class="searching-animation">
            <view class="circle-pulse"></view>
            <view class="circle-pulse delay-1"></view>
            <view class="circle-pulse delay-2"></view>
          </view>
          <text class="searching-text">正在搜索附近的人...</text>
          <text class="searching-tip">确保对方也打开了面对面添加</text>
        </view>
        
        <button class="action-button" 
          :class="isSearching ? 'stop-btn' : 'search-btn'" 
          @click="toggleSearch">
          {{isSearching ? '停止搜索' : '开始搜索'}}
        </button>
      </view>
      
      <!-- 搜索结果 -->
      <view class="search-results" v-if="nearbyUsers.length > 0">
        <view class="result-title">已发现 {{nearbyUsers.length}} 人</view>
        
        <view class="user-item" v-for="(user, index) in nearbyUsers" :key="index">
          <image class="user-avatar" :src="user.avatar" mode="aspectFill"></image>
          <view class="user-info">
            <text class="user-name">{{user.nickname}}</text>
            <text class="user-distance">{{user.distance}}</text>
          </view>
          <button class="add-btn" @click="addFriend(user)">添加</button>
        </view>
      </view>
      
      <!-- 使用说明 -->
      <view class="instructions">
        <view class="instruction-title">如何使用</view>
        <view class="instruction-item">
          <text class="instruction-num">1</text>
          <text class="instruction-text">你和朋友同时打开"面对面添加"</text>
        </view>
        <view class="instruction-item">
          <text class="instruction-num">2</text>
          <text class="instruction-text">点击"开始搜索"按钮</text>
        </view>
        <view class="instruction-item">
          <text class="instruction-num">3</text>
          <text class="instruction-text">在发现的用户列表中添加好友</text>
        </view>
      </view>
    </view>
    
    <!-- 安全提示 -->
    <view class="safety-tip">
      <text class="tip-icon">📢</text>
      <text class="tip-text">请在安全的公共场所使用面对面添加功能</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isSearching: false,
      searchTimer: null,
      nearbyUsers: []
    };
  },
  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },
    
    // 切换搜索状态
    toggleSearch() {
      if (this.isSearching) {
        this.stopSearch();
      } else {
        this.startSearch();
      }
    },
    
    // 开始搜索
    startSearch() {
      // 检查定位权限
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          this.isSearching = true;
          uni.showToast({
            title: '开始搜索附近的人',
            icon: 'none'
          });
          
          // 模拟搜索过程
          this.searchTimer = setTimeout(() => {
            // 模拟数据
            this.nearbyUsers = [
              {
                userId: '1001',
                nickname: '小明',
                avatar: '/static/avatar/avatar1.jpg',
                distance: '0.5米'
              },
              {
                userId: '1002',
                nickname: '小红',
                avatar: '/static/avatar/avatar2.jpg',
                distance: '1.2米'
              },
              {
                userId: '1003',
                nickname: '小刚',
                avatar: '/static/avatar/avatar3.jpg',
                distance: '2.5米'
              }
            ];
          }, 3000);
        },
        fail: (err) => {
          uni.showModal({
            title: '提示',
            content: '需要获取您的位置信息才能使用面对面添加功能',
            confirmText: '去设置',
            success: (res) => {
              if (res.confirm) {
                uni.openSetting();
              }
            }
          });
        }
      });
    },
    
    // 停止搜索
    stopSearch() {
      this.isSearching = false;
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
        this.searchTimer = null;
      }
      uni.showToast({
        title: '已停止搜索',
        icon: 'none'
      });
    },
    
    // 添加好友
    addFriend(user) {
      uni.showModal({
        title: '添加好友',
        content: `确定要添加 ${user.nickname} 为好友吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '正在发送请求'
            });
            
            // 模拟请求
            setTimeout(() => {
              uni.hideLoading();
              uni.showToast({
                title: '好友请求已发送',
                icon: 'success'
              });
              
              // 跳转到好友请求页面
              setTimeout(() => {
                uni.navigateTo({
                  url: '/pages/social/friend-requests'
                });
              }, 1500);
            }, 1000);
          }
        }
      });
    }
  },
  // 页面卸载时清除定时器
  onUnload() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }
  }
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: 30rpx;
  background-color: #f8f8f8;
}

.navbar {
  display: flex;
  align-items: center;
  height: 90rpx;
  padding: 0 30rpx;
  background-color: #ffffff;
}

.nav-left {
  width: 60rpx;
  font-size: 40rpx;
  color: #333333;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-size: 36rpx;
  font-weight: 500;
  color: #333333;
}

.content-area {
  flex: 1;
  padding: 30rpx;
}

.face-to-face-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 30rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.ftf-logo {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 20rpx;
}

.ftf-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 10rpx;
}

.ftf-desc {
  font-size: 28rpx;
  color: #666666;
  text-align: center;
  margin-bottom: 30rpx;
}

.connection-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30rpx;
}

.searching-animation {
  position: relative;
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 20rpx;
}

.circle-pulse {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 8rpx solid #FF6699;
  border-radius: 50%;
  animation: pulse 2s infinite;
  opacity: 0.7;
}

.delay-1 {
  animation-delay: 0.5s;
}

.delay-2 {
  animation-delay: 1s;
}

@keyframes pulse {
  0% {
    transform: scale(0.5);
    opacity: 0.8;
  }
  70% {
    transform: scale(1.5);
    opacity: 0;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.searching-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 10rpx;
}

.searching-tip {
  font-size: 26rpx;
  color: #999999;
}

.action-button {
  width: 80%;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  font-size: 32rpx;
  color: #ffffff;
}

.search-btn {
  background-color: #FF6699;
}

.stop-btn {
  background-color: #FF9999;
}

.search-results {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.result-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 20rpx;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.user-item:last-child {
  border-bottom: none;
}

.user-avatar {
  width: 90rpx;
  height: 90rpx;
  border-radius: 45rpx;
  margin-right: 20rpx;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 30rpx;
  color: #333333;
  margin-bottom: 6rpx;
}

.user-distance {
  font-size: 24rpx;
  color: #999999;
}

.add-btn {
  width: 120rpx;
  height: 60rpx;
  line-height: 60rpx;
  background-color: #E8FFF2;
  color: #38C976;
  font-size: 28rpx;
  border-radius: 30rpx;
}

.instructions {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.instruction-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 20rpx;
}

.instruction-item {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.instruction-num {
  width: 40rpx;
  height: 40rpx;
  line-height: 40rpx;
  text-align: center;
  background-color: #FF6699;
  color: #ffffff;
  border-radius: 20rpx;
  font-size: 24rpx;
  margin-right: 15rpx;
}

.instruction-text {
  font-size: 28rpx;
  color: #666666;
}

.safety-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
  background-color: #FFF9E6;
  margin: 0 30rpx;
  border-radius: 8rpx;
}

.tip-icon {
  font-size: 32rpx;
  margin-right: 10rpx;
}

.tip-text {
  font-size: 24rpx;
  color: #FF9900;
}
</style>
