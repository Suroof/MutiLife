<script>
import CustomTabBar from "./components/CustomTabBar.vue";
export default {
  components: {
    CustomTabBar,
  },
  onLaunch: function () {
  // 注释掉这行来禁用TabBar隐藏
  // this.hideTabBar();

  // 检查是否存在用户信息
  const userInfo = uni.getStorageSync('userInfo');
  if (!userInfo) {
    console.log('用户未登录，导航到登录页面');
    // 如果是首次加载，并且没有用户信息，跳转到登录页
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/login/login'
      });
    }, 100);
  }
},
  onShow: function () {
  },
  onHide: function () {
  },
  globalData: {
    userInfo: null,
    themeColor: "#FF6699",
    bgColor: "#F8F8F8",
    tabBarHeight: 120,
  },
  methods: {
    hideTabBar() {
      // 完全修改hideTabBar方法
      if (uni.canIUse("hideTabBar")) {
        try {
          uni.hideTabBar({
            animation: false,
          });
        } catch (error) {
          console.log("TabBar隐藏失败，忽略错误:", error);
        }
      } else {
        console.log("当前环境不支持hideTabBar");
      }
    },
  },
};
</script>

<style>
/* 引入重置样式 */
@import url('./static/reset.css');
@import url('./static/main.css');

/*每个页面公共css */
page {
  background-color: #f8f8f8;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica,
    Segoe UI, Arial, Roboto, "PingFang SC", "miui", "Hiragino Sans GB",
    "Microsoft Yahei", sans-serif;
  font-size: 28rpx;
  line-height: 1.5;
  color: #333;
}

/* 容器样式 - 注意添加非登录页面的类 */
.app-container {
  padding: 20rpx;
  padding-bottom: calc(
    120rpx + env(safe-area-inset-bottom)
  ); /* 为自定义tabBar预留空间 */
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.flex-center {
  align-items: center;
  justify-content: center;
}

.flex-between {
  justify-content: space-between;
}

.flex-wrap {
  flex-wrap: wrap;
}

.card {
  background: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
  margin-bottom: 20rpx;
  padding: 20rpx;
}

.btn-primary {
  background-color: #ff6699;
  color: #ffffff;
  border: none;
  border-radius: 30rpx;
  padding: 20rpx 40rpx;
  font-size: 30rpx;
  font-weight: 500;
}

.text-primary {
  color: #ff6699;
}

.text-secondary {
  color: #666666;
}

.text-light {
  color: #999999;
}

.font-bold {
  font-weight: bold;
}

/* 安全区适配 */
.safe-area-inset-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>