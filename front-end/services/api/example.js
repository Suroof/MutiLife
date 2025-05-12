/**
 * API服务使用示例
 * 这个文件展示了如何在前端组件中使用API服务
 * 注意：这个文件仅用于示例，不是实际代码的一部分
 */

// 导入API服务
import api from './index';

// ======== 示例1：用户登录 ========
async function loginExample() {
  try {
    // 调用登录API
    const userData = await api.auth.login({
      email: 'user@example.com',
      password: 'password123'
    });

    console.log('登录成功:', userData);

    // 登录成功后获取用户资料
    const userProfile = await api.user.getUserProfile();
    console.log('用户资料:', userProfile);

    return { success: true, user: userData };
  } catch (error) {
    console.error('登录失败:', error.message);
    return { success: false, error: error.message };
  }
}

// ======== 示例2：创建任务 ========
async function createTaskExample() {
  // 检查用户是否已登录
  if (!api.auth.isAuthenticated()) {
    console.error('用户未登录，请先登录');
    return { success: false, error: '用户未登录' };
  }

  try {
    // 创建新任务
    const newTask = await api.planner.createTask({
      title: '完成API文档',
      description: '编写MutiLife应用的API文档',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 一周后截止
      category: '工作',
      priority: '高',
      status: '进行中'
    });

    console.log('任务创建成功:', newTask);
    return { success: true, task: newTask };
  } catch (error) {
    console.error('创建任务失败:', error.message);
    return { success: false, error: error.message };
  }
}

// ======== 示例3：更新用户资料和上传头像 ========
async function updateProfileExample(avatarFilePath) {
  if (!api.auth.isAuthenticated()) {
    console.error('用户未登录，请先登录');
    return { success: false, error: '用户未登录' };
  }

  try {
    // 先更新用户资料
    const updatedProfile = await api.user.updateUserProfile({
      username: 'newUsername',
      firstName: 'John',
      lastName: 'Doe',
      bio: '我是一名软件开发者，热爱技术和创新。'
    });

    console.log('资料更新成功:', updatedProfile);

    // 如果提供了头像文件路径，则上传头像
    if (avatarFilePath) {
      const avatarResult = await api.user.uploadAvatar(avatarFilePath);
      console.log('头像上传成功:', avatarResult);
    }

    return { success: true, profile: updatedProfile };
  } catch (error) {
    console.error('更新资料失败:', error.message);
    return { success: false, error: error.message };
  }
}

// ======== 示例4：获取任务列表和统计 ========
async function fetchTasksExample() {
  if (!api.auth.isAuthenticated()) {
    console.error('用户未登录，请先登录');
    return { success: false, error: '用户未登录' };
  }

  try {
    // 获取任务列表（第1页，每页10条，按优先级筛选）
    const tasks = await api.planner.getTasks({
      page: 1,
      limit: 10,
      priority: '高'
    });

    console.log('任务列表:', tasks);

    // 获取任务统计
    const stats = await api.planner.getTaskStats();
    console.log('任务统计:', stats);

    // 获取今日任务
    const todayTasks = await api.planner.getTodayTasks();
    console.log('今日任务:', todayTasks);

    return {
      success: true,
      data: {
        tasks,
        stats,
        todayTasks
      }
    };
  } catch (error) {
    console.error('获取任务失败:', error.message);
    return { success: false, error: error.message };
  }
}

// ======== 示例5：完整的登录/登出流程 ========
// 在uni-app的页面或组件中使用
export default {
  data() {
    return {
      isLoading: false,
      userInfo: null,
      errorMessage: ''
    };
  },

  methods: {
    // 登录方法
    async handleLogin(formData) {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        // 调用登录API
        const result = await api.auth.login({
          email: formData.email,
          password: formData.password
        });

        // 登录成功，获取用户资料
        this.userInfo = await api.user.getUserProfile();

        // 跳转到首页
        uni.switchTab({
          url: '/pages/index/index'
        });
      } catch (error) {
        this.errorMessage = error.message || '登录失败';
      } finally {
        this.isLoading = false;
      }
    },

    // 登出方法
    handleLogout() {
      // 调用登出API
      api.auth.logout();

      // 清除用户信息
      this.userInfo = null;

      // 跳转到登录页
      uni.reLaunch({
        url: '/pages/login/login'
      });
    }
  },

  // 页面加载时检查登录状态
  onLoad() {
    if (api.auth.isAuthenticated()) {
      // 已登录，获取用户资料
      api.user.getUserProfile()
        .then(profile => {
          this.userInfo = profile;
        })
        .catch(error => {
          console.error('获取用户资料失败:', error);
          // 如果获取失败（如令牌已过期），清除登录状态
          api.auth.logout();
        });
    }
  }
};