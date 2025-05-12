<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <text class="iconfont">←</text>
      </view>
      <view class="category-info">
        <view class="category-icon" :style="{ backgroundColor: categoryColor }">
          <text class="icon-text">{{ categoryIcon }}</text>
        </view>
        <text class="category-name">{{ categoryName }}</text>
      </view>
      <view class="action-btn" @tap="openFilterOptions">
        <text class="iconfont">⋮</text>
      </view>
    </view>

    <!-- 统计卡片 -->
    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-number">{{ tasks.length }}</text>
        <text class="stat-label">总任务</text>
      </view>
      <view class="stat-item">
        <text class="stat-number">{{ completedTasksCount }}</text>
        <text class="stat-label">已完成</text>
      </view>
      <view class="stat-item">
        <text class="stat-number">{{ pendingTasksCount }}</text>
        <text class="stat-label">待完成</text>
      </view>
    </view>

    <!-- 任务列表 -->
    <view class="task-section">
      <view class="section-header">
        <text class="section-title">任务列表</text>
        <text class="view-all" @tap="openTaskPopup">+ 添加任务</text>
      </view>

      <!-- 加载中状态 -->
      <view class="loading-container" v-if="loading">
        <view class="loading-spinner"></view>
        <text class="loading-text">加载任务中...</text>
      </view>

      <!-- 空任务提示 -->
      <view class="empty-task-container" v-else-if="tasks.length === 0">
        <image
          src="/static/empty-tasks.png"
          mode="aspectFit"
          class="empty-task-image"
        ></image>
        <text class="empty-task-text">该分类暂无任务</text>
        <button class="add-task-btn" @tap="openTaskPopup">添加任务</button>
      </view>

      <!-- 任务列表 -->
      <view
        class="task-card"
        v-else
        v-for="(task, index) in tasks"
        :key="task._id || index"
        @tap="editTask(task, index)"
      >
        <view class="task-info">
          <view class="task-main">
            <text class="task-title">{{ task.title || "无标题任务" }}</text>
            <view class="task-details">
              <text class="task-date">{{ formatDate(task.dueDate) }}</text>
              <text class="task-time">{{
                formatTimeFromDate(task.dueDate)
              }}</text>
            </view>
          </view>
          <view class="task-priority" :class="'priority-' + task.priority">
            {{ getPriorityText(task.priority) }}
          </view>
        </view>
        <view class="task-actions">
          <text class="task-complete" @tap.stop="toggleTaskStatus(task)">
            {{ task.status === "completed" ? "✓" : "○" }}
          </text>
          <text class="task-delete" @tap.stop="deleteTask(task._id)">🗑️</text>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="floating-btn" @tap="openTaskPopup">
      <text class="btn-icon">+</text>
    </view>
  </view>
</template>

<script>
import plannerAPI from "@/services/api/planner.js";

export default {
  data() {
    return {
      categoryId: null,
      categoryName: "",
      categoryColor: "#FF6699",
      categoryIcon: "🔖",
      tasks: [],
      loading: false,
      error: null,
      showTaskPopup: false,
    };
  },
  computed: {
    completedTasksCount() {
      return this.tasks.filter((task) => task.status === "completed").length;
    },
    pendingTasksCount() {
      return this.tasks.filter((task) => task.status !== "completed").length;
    },
  },
  onLoad(options) {
    // 从URL参数获取分类信息
    this.categoryId = options.id;
    this.categoryName = decodeURIComponent(options.name || "");
    this.categoryColor = decodeURIComponent(options.color || "#FF6699");
    this.categoryIcon = decodeURIComponent(options.icon || "🔖");

    // 加载该分类的任务
    this.fetchCategoryTasks();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },

    async fetchCategoryTasks() {
      try {
        this.loading = true;
        this.error = null;

        // 获取所有任务并过滤该分类的任务
        const response = await plannerAPI.getTasks();

        if (response) {
          let allTasks = [];

          // 处理不同响应格式
          if (Array.isArray(response)) {
            allTasks = response;
          } else if (response.data && Array.isArray(response.data)) {
            allTasks = response.data;
          }

          // 过滤该分类的任务
          // 分类名称需要转为小写进行比较，因为后端存储的是小写
          this.tasks = allTasks.filter(
            (task) =>
              task.category &&
              task.category.toLowerCase() === this.categoryName.toLowerCase()
          );
        } else {
          this.error = "获取任务失败";
          this.tasks = [];
        }
      } catch (error) {
        console.error("获取分类任务错误:", error);
        this.error = `获取任务出错: ${error.message || "未知错误"}`;
        this.tasks = [];
      } finally {
        this.loading = false;
      }
    },

    formatDate(dateString) {
      if (!dateString) return "";

      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");

        return `${year}-${month}-${day}`;
      } catch (error) {
        console.error("日期格式化错误", error);
        return "";
      }
    },

    formatTimeFromDate(dateString) {
      if (!dateString) return "";

      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";

        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "下午" : "上午";
        const hours12 = hours % 12 || 12;

        return `${ampm} ${hours12}:${minutes}`;
      } catch (error) {
        console.error("时间格式化错误", error);
        return "";
      }
    },

    getPriorityText(priority) {
      const priorityMap = {
        low: "低",
        medium: "中",
        high: "高",
      };
      return priorityMap[priority] || "中";
    },

 	openTaskPopup() {
				this.resetNewTask();
				this.showTaskPopup = true;
			},

    editTask(task, index) {
      // 导航到任务编辑页面
      uni.navigateTo({
        url: `/pages/planner/edit-task?taskId=${task._id}`,
      });
    },

    async toggleTaskStatus(task) {
      try {
        const newStatus = task.status === "completed" ? "pending" : "completed";

        uni.showLoading({ title: "更新中..." });

        const response = await plannerAPI.updateTaskStatus(task._id, newStatus);

        if (
          response &&
          (!response.hasOwnProperty("success") || response.success)
        ) {
          // 更新本地任务状态
          task.status = newStatus;

          uni.showToast({
            title:
              newStatus === "completed" ? "任务已完成" : "任务标记为待完成",
            icon: "success",
          });
        } else {
          uni.showToast({
            title: "更新任务状态失败",
            icon: "none",
          });
        }
      } catch (error) {
        console.error("更新任务状态错误:", error);
        uni.showToast({
          title: "更新任务状态出错",
          icon: "none",
        });
      } finally {
        uni.hideLoading();
      }
    },

    async deleteTask(taskId) {
      try {
        uni.showLoading({ title: "删除中..." });

        const response = await plannerAPI.deleteTask(taskId);

        if (
          response &&
          (!response.hasOwnProperty("success") || response.success)
        ) {
          // 从本地列表中移除任务
          this.tasks = this.tasks.filter((task) => task._id !== taskId);

          uni.showToast({
            title: "任务已删除",
            icon: "success",
          });
        } else {
          uni.showToast({
            title: "删除任务失败",
            icon: "none",
          });
        }
      } catch (error) {
        console.error("删除任务错误:", error);
        uni.showToast({
          title: "删除任务出错",
          icon: "none",
        });
      } finally {
        uni.hideLoading();
      }
    },

    openFilterOptions() {
      uni.showActionSheet({
        itemList: [
          "按日期排序",
          "按优先级排序",
          "只看待完成",
          "只看已完成",
          "刷新列表",
        ],
        success: (res) => {
          switch (res.tapIndex) {
            case 0: // 按日期排序
              this.tasks.sort(
                (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
              );
              break;
            case 1: // 按优先级排序
              const priorityValue = { low: 1, medium: 2, high: 3 };
              this.tasks.sort(
                (a, b) => priorityValue[b.priority] - priorityValue[a.priority]
              );
              break;
            case 2: // 只看待完成
              this.tasks = this.tasks.filter(
                (task) => task.status !== "completed"
              );
              break;
            case 3: // 只看已完成
              this.tasks = this.tasks.filter(
                (task) => task.status === "completed"
              );
              break;
            case 4: // 刷新列表
              this.fetchCategoryTasks();
              break;
          }
        },
      });
    },
  },
};
</script>

<style>
.container {
  padding: 0;
  background-color: #f8f8f8;
  min-height: 100vh;
}

/* 顶部导航栏 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.back-btn,
.action-btn {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn .iconfont,
.action-btn .iconfont {
  font-size: 44rpx;
  color: #333333;
}

.category-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.category-icon {
  width: 90rpx;
  height: 90rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
}

.icon-text {
  font-size: 40rpx;
}

.category-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

/* 统计卡片 */
.stats-card {
  display: flex;
  justify-content: space-around;
  background-color: #ffffff;
  margin: 20rpx;
  padding: 30rpx;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 48rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 10rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #666666;
}

/* 任务部分样式 */
.task-section {
  background-color: #ffffff;
  margin: 20rpx;
  padding: 30rpx;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.view-all {
  font-size: 28rpx;
  color: #666666;
}

.task-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
}

.task-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-main {
  flex: 1;
}

.task-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 10rpx;
}

.task-details {
  display: flex;
  align-items: center;
}

.task-date,
.task-time {
  font-size: 24rpx;
  color: #999999;
  margin-right: 10rpx;
}

.task-priority {
  font-size: 24rpx;
  padding: 6rpx 18rpx;
  border-radius: 20rpx;
  text-align: center;
  color: #ffffff;
}

.priority-low {
  background-color: #6ac44e;
}

.priority-medium {
  background-color: #ffb74d;
}

.priority-high {
  background-color: #ff6b6b;
}

.task-actions {
  display: flex;
  align-items: center;
}

.task-complete,
.task-delete {
  font-size: 36rpx;
  padding: 10rpx;
  margin-left: 10rpx;
}

.task-complete {
  color: #6ac44e;
}

.task-delete {
  color: #ff6666;
}

/* 加载和空状态 */
.loading-container,
.empty-task-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid rgba(0, 0, 0, 0.1);
  border-top: 4rpx solid #ff6699;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20rpx;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text,
.empty-task-text {
  color: #999999;
  font-size: 28rpx;
  margin-bottom: 20rpx;
}

.empty-task-image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.add-task-btn {
  background-color: #ff6699;
  color: #ffffff;
  border-radius: 40rpx;
  font-size: 28rpx;
  padding: 12rpx 40rpx;
  border: none;
}

/* 浮动按钮 */
.floating-btn {
  position: fixed;
  bottom: 40rpx;
  right: 40rpx;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6699 0%, #ff9b82 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(255, 102, 153, 0.4);
}

.btn-icon {
  font-size: 50rpx;
  color: #ffffff;
  font-weight: bold;
}
</style>
