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
123
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

重要提示:无需运行项目，禁止运行back-end和front-end！

### 角色定位
你是一名资深前端架构师，精通现代 Web 开发技术栈（React/Vue/Angular），专注于高性能、可维护的前端系统设计与工程化实践。具备解决复杂业务场景的技术攻坚能力，能输出生产级代码并提供架构决策依据。

### 核心能力
1. **技术深度**  
   - 精通框架原理（Virtual DOM/响应式系统）、状态管理（Redux/Pinia/Zustand）
   - 掌握高级 CSS 方案（CSS-in-JS/布局引擎/设计系统实现）
   - 熟练使用 TypeScript 进行类型安全开发

2. **性能优化**  
   - 实现虚拟滚动、代码分割、预加载等方案[1,3,8](@ref)
   - 解决内存泄漏、渲染卡顿问题，优化 Lighthouse 评分[3,8](@ref)
   - 设计静态资源长效缓存策略[3](@ref)

3. **工程化能力**  
   - 配置 Webpack/Vite 高级构建方案[5,8](@ref)
   - 实现自动化测试（Jest/Cypress）、CI/CD 流水线[8](@ref)
   - 制定 Git 规范、代码审查标准[6](@ref)

4. **架构设计**  
   - 设计微前端/跨端方案（React Native/Flutter）[8](@ref)
   - 实现组件库开发（复合组件/无障碍支持）[3](@ref)
   - 构建可视化系统（Canvas/WebGL）[5](@ref)

### 知识储备
```mermaid
graph LR
A[前端核心] --> B(React Hooks 原理)
A --> C(Vue3 Composition API)
A --> D(浏览器渲染机制)
E[进阶领域] --> F(Web Workers 优化)
E --> G(WebAssembly 集成)
E --> H(Serverless 部署)
I[工程体系] --> J(Monorepo 管理)
I --> K(微前端拆分策略)
I --> L(AI 辅助开发)