# MutiLife 多彩生活  让手机只有一个app
![image](https://github.com/user-attachments/assets/8febe1e8-289f-4645-958d-e2b14c762b1b)

https://mutilife.netlify.app/#/pages/index/index
*探索您的多彩生活*  

---

## 📝 项目简介  
MutiLife是一款集旅游、社交、音乐、时间规划和新闻于一体的多功能生活服务应用，旨在为用户提供丰富的生活体验和便捷的服务，帮助用户探索多彩的生活方式。  

---

## 🔐 系统架构
MutiLife采用前后端分离的架构设计：
![image](https://github.com/user-attachments/assets/0a913f4c-8b3c-46da-b4db-84796859f5ab)

## ✨ 主要功能  
MutiLife提供五大核心功能模块：  

1. **旅游** - 探索旅游景点、规划旅行路线  
2. **社交** - 寻找好友、聊天交流、分享生活动态  
3. **音乐** - 听歌、探索歌单、享受音乐时光  
4. **规划** - 时间管理、日程安排、提高生活效率  
5. **新闻** - 浏览最新资讯、了解热点事件  

---

## 🛠️ 技术栈  

### 前端  
- Vue.js 3.x  
- Uni-app (跨平台应用开发框架)  
- SCSS 样式预处理器  

### 后端  
- Node.js + Express  
- MongoDB 数据库  
- JWT 身份验证  
- RESTful API
- 错误处理中间件 - 统一的错误处理机制 

---

## 📥 安装与运行  

### 前端  
```bash
git clone https://github.com/Suroof/MutiLife.git  
cd MutiLife
npm install
npm run dev        # 开发模式运行
npm run build      # 构建生产版本
```
### 后端  
```bash
cd back-end
npm install
cp .env.example .env   # 编辑.env文件配置MongoDB连接
npm run dev            # 启动服务器
npm run setup          # 初始化数据库（可选）
```

📁 后端项目结构
```plaintext
back-end/  
├── config/             # 配置文件目录（存放各类配置信息）
├── controllers/        # 请求处理器（处理业务逻辑）
├── middleware/         # 自定义中间件（用于请求预处理/后处理）
├── models/             # 数据库模型（定义数据结构和ORM映射）
├── public/             # 静态文件（如图片、CSS、客户端JS等）
├── routes/             # API路由（定义接口路径与控制器映射）
├── scripts/            # 实用脚本（自动化脚本或工具脚本）
├── utils/              # 辅助函数（可复用的工具函数）
├── server.js           # 主入口文件（启动服务的核心文件）
└── package.json        # 依赖管理文件（记录项目依赖和配置）
```
📁 前端项目结构
```plaintext
front-end/
├── components/         # 可复用的UI组件
├── pages/              # 应用页面目录
│   ├── index/          # 首页
│   ├── login/          # 登录页
│   ├── mine/           # 个人中心
│   ├── music/          # 音乐模块
│   ├── news/           # 新闻模块
│   ├── planner/        # 计划模块
│   ├── social/         # 社交模块
│   ├── travel/         # 旅行模块
│   └── welcome/        # 欢迎页
├── services/           # API服务层
├── static/             # 静态资源（图片/字体等）
├── utils/              # 工具函数
├── App.vue             # 根Vue组件
├── manifest.json       # 应用配置清单
├── pages.json          # 页面路由配置
└── main.js             # 应用入口文件
```
## 📡 API接口
| 功能模块            | API路径         | 描述                                   |
|---------------------|----------------|----------------------------------------|
| 用户认证            | `/api/auth/`   | 用户注册、登录、令牌刷新等              |
| 用户管理            | `/api/users/`  | 用户资料、偏好设置、头像更新等          |
| 活动管理            | `/api/activity/` | 用户活动、动态、互动等                |
| 旅游服务            | `/api/travel/` | 景点信息、路线规划、评价等              |
| 时间规划            | `/api/planner/` | 日程安排、提醒、任务管理等             |
| 好友管理            | `/api/friends/` | 好友添加、查询、推荐等                 |
| 位置服务            | `/api/location/` | 地理位置、附近的人等                  |
| 音乐服务            | `/api/music/`  | 歌曲、歌单、艺术家等                   |
| 新闻服务            | `/api/news/`   | 新闻文章、分类、评论等                 |

## 📱 应用截图
- ![image](https://github.com/user-attachments/assets/b3ef053d-7c9d-4fe3-8013-781744648bca)
- ![image](https://github.com/user-attachments/assets/4c472b47-b0b6-431d-8499-1f9c1e214fcb)
- ![image](https://github.com/user-attachments/assets/b664782a-f8f8-47b5-9ff4-3a98e305b24a)
- ![image](https://github.com/user-attachments/assets/726487f5-ac29-481c-9dfa-5043cf32886c)
- ![image](https://github.com/user-attachments/assets/f0957bd4-aa05-4622-ba19-828c09d00ace)
- ![image](https://github.com/user-attachments/assets/567d3447-d221-43af-b380-423028cd61c4)

---
MutiLife - 让生活更多彩 © 2025




