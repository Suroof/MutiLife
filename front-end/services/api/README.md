# MutiLife API 服务

这个目录包含了MutiLife应用的API服务层，提供了与后端API交互的标准接口。

## 目录结构

```
/services/api/
├── config.js        # API配置
├── request.js       # 请求工具
├── auth.js          # 认证服务
├── user.js          # 用户服务
├── planner.js       # 任务规划器服务
├── index.js         # API服务主入口
└── example.js       # 使用示例（仅供参考）
```

## 快速开始

### 1. 初始化API服务

在应用入口文件（如`main.js`）中初始化API服务：

```javascript
import { initAPI } from '@/services/api';

// 初始化API服务
const api = initAPI({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://api.mutilife.com/api'
    : 'http://localhost:3000/api',
  timeout: 10000
});

// 挂载到全局，方便在组件中使用
uni.$api = api;
```

### 2. 在组件中使用

```javascript
// 组件中
export default {
  methods: {
    async login() {
      try {
        const result = await uni.$api.auth.login({
          email: this.email,
          password: this.password
        });

        // 处理登录成功
        uni.showToast({ title: '登录成功' });
      } catch (error) {
        // 处理登录失败
        uni.showToast({ title: error.message, icon: 'none' });
      }
    }
  }
}
```

## 服务说明

### 认证服务 (`auth.js`)

提供用户认证相关功能：

- **register(userData)**: 用户注册
- **login(credentials)**: 用户登录
- **logout()**: 用户登出
- **refreshToken()**: 刷新认证令牌
- **getCurrentUser()**: 获取当前登录用户信息
- **requestPasswordReset(email)**: 请求密码重置
- **confirmPasswordReset(resetData)**: 确认密码重置

### 用户服务 (`user.js`)

提供用户资料管理功能：

- **getUserProfile()**: 获取用户资料
- **updateUserProfile(profileData)**: 更新用户资料
- **updateUserPreferences(preferences)**: 更新用户偏好设置
- **changePassword(passwordData)**: 修改用户密码
- **uploadAvatar(filePath)**: 上传用户头像
- **getUserStats()**: 获取用户统计信息

### 任务规划器服务 (`planner.js`)

提供任务管理功能：

- **getTasks(params)**: 获取任务列表
- **getTaskById(taskId)**: 获取任务详情
- **createTask(taskData)**: 创建新任务
- **updateTask(taskId, taskData)**: 更新任务
- **deleteTask(taskId)**: 删除任务
- **updateTaskStatus(taskId, status)**: 更新任务状态
- **getTaskStats()**: 获取任务统计信息
- **getTodayTasks()**: 获取今日任务
- **getUpcomingTasks(days)**: 获取即将到期任务

## 请求工具

API服务内部使用了封装的请求工具，提供了以下功能：

- 统一的请求格式和错误处理
- 自动添加认证头
- 令牌管理（存储、获取、清除）
- 401错误自动处理（跳转到登录页）
- 文件上传支持

## 错误处理

所有API请求都集成了统一的错误处理：

1. 服务器返回的错误会显示对应的错误消息
2. 网络错误会显示通用错误消息
3. 认证错误（401）会自动清除令牌并跳转到登录页
4. 所有错误都会以Promise rejection的形式返回，可以使用try/catch捕获

## 使用实例

详细的使用示例请参考 `example.js` 文件，其中包含了：

1. 用户登录示例
2. 创建任务示例
3. 更新用户资料和上传头像示例
4. 获取任务列表和统计示例
5. 完整的登录/登出流程示例

## 扩展

如需添加新的API服务，只需：

1. 创建新的服务文件（如 `newFeature.js`）
2. 在 `index.js` 中导入并添加到API对象中
3. 实现相应的API方法

## 配置选项

在 `config.js` 中可以配置以下选项：

- **baseURL**: API基础URL
- **timeout**: 请求超时时间
- **headers**: 默认请求头
- **uploadHeaders**: 上传文件时的请求头
- **tokenKey**: 本地存储中的令牌键名
- **refreshPath**: 令牌刷新路径