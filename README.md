<div align="center">

# 😂绷住大挑战🤣

### **你憋笑有多强？让 AI 来验一验。**

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)
![MediaPipe](https://img.shields.io/badge/MediaPipe-FaceMesh-4285f4?logo=google)
![Supabase](https://img.shields.io/badge/Supabase-Leaderboard-3ecf8e?logo=supabase)

</div>

---

## 🎭 这是什么？

大绷住时代的究极产物，一个让你的**扑克脸**接受终极考验的网页游戏。

打开摄像头，AI 会实时追踪你脸上的 **468 个关键点**——然后朝你输出搞笑段子、沙雕表情包和魔性短视频。你要做的只有一件事：

> **绷住，别笑。**

每轮 7 秒。一旦嘴角上扬被 AI 抓到，当场破防，游戏结束。

坚持到最后？恭喜，你就是**老绷带**。

---

## 🕹️ 玩法

| 步骤 | 操作 |
|:---:|------|
| 1️⃣ | 打开网页，允许摄像头权限 |
| 2️⃣ | 输入你的专属昵称 |
| 3️⃣ | 点击「开始挑战」或按下 **空格键** |
| 4️⃣ | 看搞笑内容，同时拼命控制你的嘴角 |
| 5️⃣ | 7 秒不笑 → 过关！进入下一轮 |
| 6️⃣ | 笑了 → 😂 游戏结束，战绩上传全球排行榜 |
| 👑 | 扛过全部内容 → 你就是**老绷带**，不过要小心老了会变成崩崩炸弹 |

---

## 🧠 笑容检测

游戏使用 **MediaPipe FaceMesh** 实时捕捉面部的 468 个关键点，重点监控这些部位：

```
        前额 (151)
           │
           ▼
     嘴角 (61) ─── 嘴巴中心 ─── 嘴角 (291)
           │                      │
           ▼                      ▼
     下巴 (10) ←──── 脸高基准 ────→
```

核心算法：

```
微笑差值 = 嘴巴中心 Y - 嘴角平均 Y
微笑指数 = (微笑差值 / 脸高) × 100
```

- 微笑指数 > **30** → AI 开始怀疑你在笑
- 持续超过 **0.7 秒** → **破防判定！**

你可以在画面中实时看到自己的微笑指数——**越绿越安全，越红越危险**。

---

## 📦 素材库

笑点来自三种素材，全部随机轮番投放：

| 类型 | 内容 | 危险等级 |
|------|------|----------|
| 📝 文字段子 | 冷笑话、谐音梗、猝不及防的反转 | ⭐⭐⭐ |
| 🖼️ 表情包 | 经典沙雕图，越看越破防 | ⭐⭐⭐⭐ |
| 🎬 短视频 | 魔性剪辑，视觉冲击拉满 | ⭐⭐⭐⭐⭐ |

全部素材不重复，一次挑战，一路惊喜。

---

## 🏆 排行榜

每局结束，你的**最长连胜数**会自动上传到排行榜（基于 Supabase）。

切到「排行榜」标签，看看你和全世界比，谁才是真正的扑克脸之王。

---

## 🛠️ 技术栈

| 层 | 技术 |
|----|------|
| 框架 | React 19 + Vite 8 |
| 面部识别 | MediaPipe FaceMesh + TensorFlow.js |
| 摄像头 | react-webcam |
| 排行榜后端 | Supabase |
| 样式 | CSS Modules |
| 代码检查 | oxlint |

---

## 🚀 本地运行

```bash
# 克隆项目
git clone <repo-url>
cd bengzhu-challenge

# 安装依赖
npm install

# 配置环境变量（排行榜功能需要）
cp .env.example .env
# 编辑 .env，填入你的 Supabase 配置

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

---

## 📂 项目结构

```
src/
├── hooks/
│   ├── useFaceDetection.js   # AI 面部识别核心逻辑
│   ├── useGameState.js       # 游戏状态机
│   ├── useMaterials.js       # 素材池管理
│   ├── useLeaderboard.js     # 排行榜数据
│   └── useTimer.js           # 7 秒倒计时
├── components/
│   ├── CameraPanel/          # 摄像头 + 面部关键点渲染
│   ├── ContentPanel/         # 搞笑内容展示区
│   ├── Leaderboard/          # 全球排行榜
│   ├── StartScreen/          # 开始界面
│   ├── VictoryScreen/        # 绷王加冕界面 🎉
│   └── ...
├── resources/                # 段子、表情包、视频
└── lib/supabase.js           # Supabase 客户端
```