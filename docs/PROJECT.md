# MutiLife项目概述

## 项目简介
MutiLife是一个综合性生活应用，集成了个人规划、音乐欣赏和社交功能。项目旨在为用户提供一站式生活管理平台，让用户可以规划日常任务、欣赏音乐，并与朋友分享生活点滴。

## 项目架构
- 前端：基于uni-app的跨平台应用
- 后端：Node.js + Express.js RESTful API
- 数据库：MongoDB

## 核心功能
1. **用户系统**：注册、登录、个人资料管理
2. **规划系统**：任务创建、分类、提醒功能
3. **音乐系统**：音乐浏览、播放、收藏功能
4. **社交系统**：动态分享、好友互动功能

## 项目进度
1. ✅ 完成基础框架搭建
2. ✅ 实现用户认证系统
3. ⬜️ 实现任务管理功能
4. ✅ 实现音乐功能模块
5. ⬜️ 实现社交功能模块
6. ⬜️ 前后端完全集成
7. ⬜️ 部署与优化

## 技术栈详情

### 前端
- uni-app框架
- Vue.js组件系统
- CSS3/SCSS样式
- 响应式设计
- 本地存储与缓存策略

### 后端
- Node.js运行环境
- Express.js Web框架
- JWT用户认证
- MongoDB数据存储
- RESTful API设计
- 中间件系统

### 部署
- Netlify (前端)
- Heroku/Vercel (后端)
- MongoDB Atlas (数据库)

## 目录结构
```
MutiLife/
├── back-end/              # 后端代码
│   ├── config/            # 配置文件
│   ├── controllers/       # 控制器
│   ├── middleware/        # 中间件
│   ├── models/            # 数据模型
│   ├── routes/            # 路由定义
│   ├── utils/             # 工具函数
│   └── server.js          # 主服务器文件
├── docs/                  # 项目文档
├── pages/                 # 前端页面
│   ├── components/        # 组件
│   ├── login/             # 登录/注册
│   ├── music/             # 音乐功能
│   ├── planner/           # 规划功能
│   └── social/            # 社交功能
└── static/                # 静态资源
```

## 未来规划
1. 添加离线支持
2. 实现多平台同步
3. 添加数据分析和可视化
4. 增强社交互动功能
5. 开发小程序版本

## 快速上手
底部栏设置:\components\CustomTabBar.vue
