# MutiLife 多彩生活  让手机只有一个app
![image](https://github.com/user-attachments/assets/9ab00ef2-dfe1-4fb5-bdb4-ab63c73949be)

*探索您的多彩生活*  

---

## 📝 项目简介  
MutiLife是一款集旅游、社交、音乐、时间规划和新闻于一体的多功能生活服务应用。为用户提供丰富的生活体验和便捷的服务，帮助用户探索多彩的生活方式。  

---

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

📁 项目结构
```plaintext
MutiLife/  
├── back-end/               # 后端代码  
│   ├── config/             # 配置文件  
│   ├── controllers/        # 控制器  
│   ├── middleware/         # 中间件  
│   ├── models/             # 数据模型  
│   ├── routes/             # 路由  
│   ├── utils/              # 工具函数  
│   └── server.js           # 服务器入口  
├── components/             # 前端组件  
├── pages/                  # 页面文件  
│   ├── index/              # 首页  
│   ├── login/              # 登录页  
│   ├── mine/               # 个人中心  
│   ├── music/              # 音乐模块  
│   ├── news/               # 新闻模块  
│   ├── planner/            # 规划模块  
│   ├── social/             # 社交模块  
│   ├── travel/             # 旅游模块  
│   └── welcome/            # 欢迎页  
├── services/               # 服务API  
├── static/                 # 静态资源  
├── utils/                  # 工具函数  
├── App.vue                 # 应用入口  
├── manifest.json           # 应用配置  
├── pages.json              # 页面路由配置  
└── main.js                 # 主入口文件
```
## 📡 API接口
| 特性                | API路径        |
|---------------------|----------------|
| 用户认证	          | /api/auth/     | 
| 用户管理            | /api/users/    |
| 活动管理            | /api/activity/ | 
| 旅游服务            | /api/travel/   | 
| 时间规划            | /api/planner/  | 
| 好友管理            | /api/friends/  | 
| 位置服务            | /api/location/ | 
| 音乐服务            | 	/api/music/  | 
| 新闻服务            | /api/news/     | 

## 📱 应用截图
- ![image](https://github.com/user-attachments/assets/b3ef053d-7c9d-4fe3-8013-781744648bca)
- ![image](https://github.com/user-attachments/assets/4c472b47-b0b6-431d-8499-1f9c1e214fcb)
- ![image](https://github.com/user-attachments/assets/b664782a-f8f8-47b5-9ff4-3a98e305b24a)
- ![image](https://github.com/user-attachments/assets/726487f5-ac29-481c-9dfa-5043cf32886c)
- ![image](https://github.com/user-attachments/assets/f0957bd4-aa05-4622-ba19-828c09d00ace)
- ![image](https://github.com/user-attachments/assets/567d3447-d221-43af-b380-423028cd61c4)





