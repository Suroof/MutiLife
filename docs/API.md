# MutiLife API文档

## 基础信息
- 基础URL: `http://localhost:5000/api`
- 认证方式: JWT Token (在请求头中使用`Authorization: Bearer {token}`)
- 响应格式: JSON

## 用户接口

### 用户注册
- **URL**: `/auth/register`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "name": "测试用户"
  }
  ```
- **成功响应** (201):
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
    "user": {
      "id": "60a5e8b9e4b0c8f2e8c91234",
      "username": "testuser",
      "email": "test@example.com",
      "name": "测试用户",
      "avatar": "default-avatar.png",
      "role": "user"
    }
  }
  ```

### 用户登录
- **URL**: `/auth/login`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **成功响应** (200): 同注册响应

### 获取当前用户
- **URL**: `/auth/me`
- **方法**: `GET`
- **认证**: 必需
- **成功响应** (200):
  ```json
  {
    "id": "60a5e8b9e4b0c8f2e8c91234",
    "username": "testuser",
    "email": "test@example.com",
    "name": "测试用户",
    "avatar": "default-avatar.png",
    "role": "user",
    "bio": "",
    "preferences": {
      "theme": "system",
      "notifications": true,
      "language": "zh"
    },
    "createdAt": "2023-03-30T15:00:00Z",
    "updatedAt": "2023-03-30T15:00:00Z"
  }
  ```

### 刷新令牌
- **URL**: `/auth/refresh`
- **方法**: `POST`
- **认证**: 必需
- **成功响应** (200):
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
  }
  ```

## 用户资料接口

### 获取用户资料
- **URL**: `/users/profile`
- **方法**: `GET`
- **认证**: 必需
- **成功响应** (200): 同获取当前用户

### 更新用户资料
- **URL**: `/users/profile`
- **方法**: `PUT`
- **认证**: 必需
- **请求体**:
  ```json
  {
    "name": "新名称",
    "bio": "关于我的简介",
    "phoneNumber": "13812345678"
  }
  ```
- **成功响应** (200): 更新后的用户对象

### 更新用户偏好设置
- **URL**: `/users/preferences`
- **方法**: `PUT`
- **认证**: 必需
- **请求体**:
  ```json
  {
    "theme": "dark",
    "notifications": true,
    "language": "zh"
  }
  ```
- **成功响应** (200): 更新后的偏好设置对象

### 修改密码
- **URL**: `/users/change-password`
- **方法**: `PUT`
- **认证**: 必需
- **请求体**:
  ```json
  {
    "currentPassword": "oldPassword123",
    "newPassword": "newPassword123"
  }
  ```
- **成功响应** (200):
  ```json
  {
    "message": "密码已成功更新"
  }
  ```

### 更新头像
- **URL**: `/users/avatar`
- **方法**: `PUT`
- **认证**: 必需
- **内容类型**: `multipart/form-data`
- **表单数据**:
  - `avatar`: 图片文件
- **成功响应** (200):
  ```json
  {
    "avatar": "avatar-60a5e8b9e4b0c8f2e8c91234-1680193452123.jpg"
  }
  ```

## 任务管理接口

### 获取所有任务
- **URL**: `/planner/tasks`
- **方法**: `GET`
- **认证**: 必需
- **查询参数** (可选):
  - `category`: 按类别筛选
  - `status`: 按状态筛选
  - `priority`: 按优先级筛选
- **成功响应** (200):
  ```json
  [
    {
      "_id": "60a6f1b2e4b0d9f3e9c91234",
      "title": "完成项目文档",
      "description": "编写MutiLife项目的详细文档",
      "dueDate": "2023-04-10T12:00:00Z",
      "category": "工作",
      "priority": "high",
      "status": "pending",
      "user": "60a5e8b9e4b0c8f2e8c91234",
      "createdAt": "2023-03-30T15:00:00Z",
      "updatedAt": "2023-03-30T15:00:00Z"
    },
    // 更多任务...
  ]
  ```

### 获取单个任务
- **URL**: `/planner/tasks/:id`
- **方法**: `GET`
- **认证**: 必需
- **成功响应** (200): 任务对象

### 创建任务
- **URL**: `/planner/tasks`
- **方法**: `POST`
- **认证**: 必需
- **请求体**:
  ```json
  {
    "title": "完成项目文档",
    "description": "编写MutiLife项目的详细文档",
    "dueDate": "2023-04-10T12:00:00Z",
    "category": "工作",
    "priority": "high",
    "status": "pending"
  }
  ```
- **成功响应** (201): 创建的任务对象

### 更新任务
- **URL**: `/planner/tasks/:id`
- **方法**: `PUT`
- **认证**: 必需
- **请求体**: 同创建任务，字段可部分提供
- **成功响应** (200): 更新后的任务对象

### 删除任务
- **URL**: `/planner/tasks/:id`
- **方法**: `DELETE`
- **认证**: 必需
- **成功响应** (200):
  ```json
  {
    "msg": "Task removed"
  }
  ```

### 获取所有类别
- **URL**: `/planner/categories`
- **方法**: `GET`
- **认证**: 必需
- **成功响应** (200): 类别字符串数组

### 创建类别
- **URL**: `/planner/categories`
- **方法**: `POST`
- **认证**: 必需
- **请求体**:
  ```json
  {
    "name": "新类别"
  }
  ```
- **成功响应** (201):
  ```json
  {
    "name": "新类别"
  }
  ```

### 获取任务统计
- **URL**: `/planner/stats`
- **方法**: `GET`
- **认证**: 必需
- **成功响应** (200):
  ```json
  {
    "status": [
      {"_id": "pending", "count": 3},
      {"_id": "in-progress", "count": 2},
      {"_id": "completed", "count": 5}
    ],
    "priority": [
      {"_id": "low", "count": 2},
      {"_id": "medium", "count": 5},
      {"_id": "high", "count": 3}
    ],
    "category": [
      {"_id": "工作", "count": 4},
      {"_id": "个人", "count": 3},
      {"_id": "学习", "count": 3}
    ],
    "upcoming": [
      // 最近5个未完成任务...
    ]
  }
  ```

## 错误响应

### 无效请求 (400)
```json
{
  "errors": [
    {
      "msg": "Email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### 未授权 (401)
```json
{
  "message": "No token, authorization denied"
}
```

### 资源不存在 (404)
```json
{
  "msg": "Task not found"
}
```

### 服务器错误 (500)
```json
{
  "message": "Server Error"
}
```