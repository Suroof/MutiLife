<template>
  <view class="search-container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="nav-left" @click="goBack">
        <text class="iconfont icon-back">&#xe679;</text>
      </view>
      <view class="nav-title">查找好友</view>
    </view>

    <!-- 搜索框区域 -->
    <view class="search-section">
      <view class="search-box">
        <text class="iconfont icon-search">&#xe622;</text>
        <input
          class="search-input"
          v-model="searchText"
          placeholder="QQ号/手机号/昵称"
          confirm-type="search"
          @confirm="handleSearch"
        />
        <text v-if="searchText.length > 0" class="clear-btn" @click="clearSearch">×</text>
      </view>
      <view class="search-btn" @click="handleSearch" :class="{ active: searchText.length > 0 }">搜索</view>
    </view>

    <!-- 搜索方式选择 -->
    <view class="search-type-section">
      <view
        class="type-item"
        :class="{ active: searchType === 'id' }"
        @click="setSearchType('id')"
      >
        <text class="type-text">ID</text>
      </view>
      <view
        class="type-item"
        :class="{ active: searchType === 'nickname' }"
        @click="setSearchType('nickname')"
      >
        <text class="type-text">昵称</text>
      </view>
      <view
        class="type-item"
        :class="{ active: searchType === 'phone' }"
        @click="setSearchType('phone')"
      >
        <text class="type-text">手机号</text>
      </view>
    </view>

    <!-- 搜索结果区域 -->
    <view class="result-section" v-if="hasSearched">
      <!-- 加载中 -->
      <view class="loading-state" v-if="loading">
        <image class="loading-icon" src="/static/loading.gif" mode="aspectFit"></image>
        <text class="loading-text">正在搜索...</text>
      </view>

      <!-- 搜索结果为空 -->
      <view class="empty-state" v-else-if="searchResults.length === 0">
        <image class="empty-icon" src="/static/social/empty-search.png" mode="aspectFit"></image>
        <text class="empty-text">未找到相关用户</text>
        <text class="empty-tip">请检查搜索内容是否正确</text>
      </view>

      <!-- 搜索结果列表 -->
      <view class="result-list" v-else>
        <view class="section-title">搜索结果</view>
        <view
          class="user-item"
          v-for="(user, index) in searchResults"
          :key="index"
          @click="viewProfile(user.userId)"
        >
          <image class="user-avatar" :src="user.avatar" mode="aspectFill"></image>
          <view class="user-info">
            <view class="user-name-row">
              <text class="user-name">{{user.nickname}}</text>
              <text class="user-gender" :class="user.gender">{{user.gender === 'male' ? '♂' : '♀'}}</text>
            </view>
            <view class="user-id">ID: {{user.userId}}</view>
            <view class="user-location" v-if="user.location">{{user.location}}</view>
          </view>
          <view class="action-btn" v-if="!user.isFriend" @click.stop="addFriend(user)">
            <text class="action-text">加好友</text>
          </view>
          <view class="friend-badge" v-else>
            <text class="badge-text">好友</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 其他查找方式 -->
    <view class="other-search-section" v-if="!hasSearched || (searchResults.length === 0 && !loading)">
      <view class="section-title">其他方式添加好友</view>
      <view class="other-methods">
        <view class="method-item" @click="openQRCode">
          <view class="method-icon">
            <text class="iconfont icon-qrcode">&#xe62b;</text>
          </view>
          <text class="method-name">扫一扫</text>
        </view>
        <view class="method-item" @click="showMyQRCode">
          <view class="method-icon">
            <text class="iconfont icon-myqrcode">&#xe62e;</text>
          </view>
          <text class="method-name">我的二维码</text>
        </view>
        <view class="method-item" @click="goToNearby">
          <view class="method-icon">
            <text class="iconfont icon-nearby">&#xe651;</text>
          </view>
          <text class="method-name">附近的人</text>
        </view>
        <view class="method-item" @click="faceToFace">
          <view class="method-icon">
            <text class="iconfont icon-faceto">&#xe626;</text>
          </view>
          <text class="method-name">面对面添加</text>
        </view>
      </view>
    </view>

    <!-- 二维码弹窗 -->
    <view class="qrcode-popup" v-if="showQRCodePopup">
      <view class="popup-mask" @click="closeQRCodePopup"></view>
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">我的二维码</text>
          <text class="close-popup" @click="closeQRCodePopup">×</text>
        </view>
        <view class="qrcode-section">
          <image class="my-avatar" :src="myInfo.avatar" mode="aspectFill"></image>
          <text class="my-name">{{myInfo.nickname}}</text>
          <image class="qrcode-image" src="/static/social/qrcode.png" mode="aspectFit"></image>
          <text class="qrcode-tip">扫一扫上面的二维码，加我为好友</text>
        </view>
        <view class="popup-actions">
          <view class="popup-btn save-btn" @click="saveQRCode">
            <text>保存到相册</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchText: '',
      searchType: 'id',
      hasSearched: false,
      loading: false,
      searchResults: [],
      showQRCodePopup: false,
      myInfo: {
        userId: '1001',
        nickname: '自己的昵称',
        avatar: '/static/avatar/avatar1.jpg'
      }
    };
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },

    clearSearch() {
      this.searchText = '';
      this.hasSearched = false;
    },

    setSearchType(type) {
      this.searchType = type;
      if (this.hasSearched && this.searchText.length > 0) {
        this.handleSearch();
      }
    },

    handleSearch() {
      if (!this.searchText.trim()) {
        uni.showToast({
          title: '请输入搜索内容',
          icon: 'none'
        });
        return;
      }

      this.hasSearched = true;
      this.loading = true;
      this.searchResults = [];

      // 模拟搜索请求
      setTimeout(() => {
        this.loading = false;

        // 根据搜索类型返回不同的结果
        if (this.searchType === 'id' && this.searchText === '1001') {
          this.searchResults = [
            {
              userId: '1001',
              nickname: '自己的昵称',
              avatar: '/static/avatar/avatar1.jpg',
              gender: 'male',
              location: '北京市朝阳区',
              isFriend: true
            }
          ];
        } else if (this.searchText.includes('张') || this.searchText === '2001') {
          this.searchResults = [
            {
              userId: '2001',
              nickname: '张小明',
              avatar: '/static/avatar/avatar2.jpg',
              gender: 'male',
              location: '上海市浦东新区',
              isFriend: true
            }
          ];
        } else if (this.searchText.includes('李') || this.searchText === '3001') {
          this.searchResults = [
            {
              userId: '3001',
              nickname: '李娜',
              avatar: '/static/avatar/avatar3.jpg',
              gender: 'female',
              location: '广州市天河区',
              isFriend: false
            }
          ];
        } else if (this.searchText.includes('王') || this.searchText === '4001') {
          this.searchResults = [
            {
              userId: '4001',
              nickname: '王刚',
              avatar: '/static/avatar/avatar4.jpg',
              gender: 'male',
              location: '深圳市南山区',
              isFriend: false
            }
          ];
        } else if (this.searchText.includes('1') || this.searchText.includes('5')) {
          this.searchResults = [
            {
              userId: '5001',
              nickname: '赵丽',
              avatar: '/static/avatar/avatar5.jpg',
              gender: 'female',
              location: '成都市武侯区',
              isFriend: false
            }
          ];
        }
      }, 1500);
    },

    viewProfile(userId) {
      uni.navigateTo({
        url: `/pages/social/friend-profile?id=${userId}`
      });
    },

    addFriend(user) {
      uni.showModal({
        title: '添加好友',
        content: `是否添加"${user.nickname}"为好友？`,
        confirmText: '发送请求',
        success: (res) => {
          if (res.confirm) {
            uni.showModal({
              title: '好友申请',
              content: '',
              editable: true,
              placeholderText: '请输入验证信息',
              confirmText: '发送',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  uni.showLoading({
                    title: '发送中...'
                  });

                  setTimeout(() => {
                    uni.hideLoading();
                    uni.showToast({
                      title: '请求已发送',
                      icon: 'success'
                    });

                    // 更新界面状态
                    const index = this.searchResults.findIndex(u => u.userId === user.userId);
                    if (index !== -1) {
                      this.$set(this.searchResults[index], 'requestSent', true);
                    }
                  }, 1000);
                }
              }
            });
          }
        }
      });
    },

    openQRCode() {
      uni.scanCode({
        success: (res) => {
          console.log('扫码结果：', res);
          uni.showToast({
            title: '扫码成功',
            icon: 'success'
          });

          // 模拟扫码成功后的操作
          setTimeout(() => {
            // 假设扫描到了某个用户的二维码
            uni.navigateTo({
              url: '/pages/social/friend-profile?id=5001'
            });
          }, 1000);
        },
        fail: () => {
          uni.showToast({
            title: '扫码失败',
            icon: 'none'
          });
        }
      });
    },

    showMyQRCode() {
      this.showQRCodePopup = true;
    },

    closeQRCodePopup() {
      this.showQRCodePopup = false;
    },

    saveQRCode() {
      uni.showLoading({
        title: '保存中...'
      });

      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: '已保存到相册',
          icon: 'success'
        });
      }, 1000);
    },

    goToNearby() {
      uni.navigateTo({
        url: '/pages/social/nearby'
      });
    },

    faceToFace() {
      uni.showLoading({
        title: '初始化中...'
      });

      setTimeout(() => {
        uni.hideLoading();

        uni.showModal({
          title: '面对面添加',
          content: '当前已创建面对面添加房间，房间号：58793。请让对方在附近打开相同页面，输入此房间号添加。',
          confirmText: '确定',
          showCancel: false
        });
      }, 1000);
    }
  }
};
</script>

<style>
.search-container {
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

.nav-left {
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

/* 搜索框区域 */
.search-section {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #ffffff;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 20px;
  padding: 0 15px;
  height: 40px;
}

.icon-search {
  color: #999999;
  margin-right: 8px;
}

.search-input {
  flex: 1;
  height: 40px;
  font-size: 14px;
}

.clear-btn {
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #999999;
  font-size: 16px;
}

.search-btn {
  padding: 0 15px;
  color: #999999;
  font-size: 14px;
}

.search-btn.active {
  color: #FF6699;
}

/* 搜索方式选择 */
.search-type-section {
  display: flex;
  background-color: #ffffff;
  padding: 0 15px 10px;
}

.type-item {
  margin-right: 20px;
  padding: 5px 0;
  position: relative;
}

.type-text {
  font-size: 14px;
  color: #666666;
}

.type-item.active .type-text {
  color: #FF6699;
  font-weight: 500;
}

.type-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #FF6699;
  border-radius: 1px;
}

/* 搜索结果区域 */
.result-section {
  flex: 1;
  padding: 15px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 15px;
}

.empty-text {
  font-size: 16px;
  color: #666666;
  margin-bottom: 5px;
}

.empty-tip {
  font-size: 14px;
  color: #999999;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 15px;
}

.result-list {
  margin-bottom: 20px;
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

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 12px;
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

.user-id {
  font-size: 13px;
  color: #999999;
  margin: 3px 0;
}

.user-location {
  font-size: 13px;
  color: #999999;
}

.action-btn {
  padding: 6px 12px;
  background-color: #FF6699;
  color: #ffffff;
  font-size: 14px;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(255, 102, 153, 0.2);
}

.action-text {
  color: #ffffff;
}

.friend-badge {
  padding: 5px 10px;
  background-color: #f0f0f0;
  border-radius: 15px;
}

.badge-text {
  font-size: 12px;
  color: #999999;
}

/* 其他查找方式 */
.other-search-section {
  padding: 15px;
  margin-bottom: 20px;
}

.other-methods {
  display: flex;
  flex-wrap: wrap;
}

.method-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.method-icon {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.method-icon .iconfont {
  font-size: 24px;
  color: #5d9afe;
}

.method-name {
  font-size: 14px;
  color: #666666;
}

/* 二维码弹窗 */
.qrcode-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
  width: 80%;
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  z-index: 10;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  position: relative;
  border-bottom: 1px solid #f0f0f0;
}

.popup-title {
  font-size: 18px;
  font-weight: 500;
}

.close-popup {
  position: absolute;
  right: 15px;
  font-size: 22px;
  color: #999999;
}

.qrcode-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.my-avatar {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-bottom: 10px;
}

.my-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
}

.qrcode-image {
  width: 200px;
  height: 200px;
  margin-bottom: 10px;
}

.qrcode-tip {
  font-size: 14px;
  color: #999999;
}

.popup-actions {
  padding: 15px;
  border-top: 1px solid #f0f0f0;
}

.popup-btn {
  height: 44px;
  line-height: 44px;
  text-align: center;
  border-radius: 22px;
  font-size: 16px;
}

.save-btn {
  background-color: #FF6699;
  color: #ffffff;
}
</style>