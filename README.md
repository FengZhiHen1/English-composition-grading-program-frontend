# 智能作文批改 (Smart Essay Grading)

这是一个基于 React 和 AI 技术的英语作文智能批改前端项目。它旨在为学生和教师提供深度、可视化的作文评估报告，不仅提供评分，还包含逐句精批、逻辑分析以及高分范文润色对比。

## 1. 项目内容与功能

本项目主要包含以下核心功能模块：

*   **智能上传**：支持直接文本输入或上传文件（PDF, Word, 图片）进行识别与分析。
*   **多维评分体系**：基于切题度、词汇语法、逻辑结构、内容详情四个维度进行雷达图评分展示。
*   **逐句精批 (Annotated Essay)**：在原文中高亮错误与亮点，点击即可查看详细的修改建议、错误解释及高级表达推荐。
*   **深度点评 (Deep Analysis)**：提供文章亮点总结、待改进项分析以及素材复用指南（如适用主题、拓展思路）。
*   **润色对比 (Revised Comparison)**：展示 AI 润色后的高分范文，支持左右对照阅读，直观感受提升空间。
*   **打印/导出**：支持将评估报告完美适配 A4 纸张格式进行打印或导出为 PDF。

### 技术栈
*   **核心框架**: [React 19](https://react.dev/) + TypeScript
*   **构建工具**: [Vite](https://vitejs.dev/)
*   **路由管理**: [React Router DOM](https://reactrouter.com/)
*   **数据可视化**: [Recharts](https://recharts.org/) (用于雷达图)
*   **UI 组件与样式**: Tailwind CSS (CDN 引入) + [Lucide React](https://lucide.dev/) (图标)
*   **网络请求**: [Axios](https://axios-http.com/)

## 2. 配置方法说明

在运行项目之前，请确保你的开发环境已安装 **Node.js**。

### 1. 安装依赖
在项目根目录下运行以下命令安装所需依赖：
```bash
npm install
```

### 2. 环境配置
项目依赖环境变量来连接后端服务。
1. 复制 `.env.local` 文件（如果不存在则新建）：
2. 配置以下变量：

```properties
# 后端 API 基础地址 (例如 Python/FastAPI 后端)
VITE_API_BASE_URL=http://localhost:8000

# Gemini API Key (如果前端直接调用或用于特定配置)
GEMINI_API_KEY=your_api_key_here
```

> **注意**: `vite.config.ts` 中已配置了代理，开发环境下 `/api` 开头的请求会自动转发到 `VITE_API_BASE_URL`。

## 3. 使用方法说明

### 启动开发服务器
运行以下命令启动本地开发环境：
```bash
npm run dev
```
启动后，访问终端显示的本地地址（通常为 `http://localhost:3000`）。

### 构建生产版本
如需部署，运行构建命令生成静态文件：
```bash
npm run build
```
构建产物将输出到 `dist` 目录。

### 预览生产构建
```bash
npm run preview
```

### 模拟数据模式
如果后端服务未启动或请求失败，系统会自动降级使用 `src/constants.ts` 中的 `MOCK_DATA` 展示演示报告，方便前端调试 UI。

## 4. 项目结构

```text
react-frontend/
├── public/                 # 静态资源目录
├── src/
│   ├── api/                # API 请求模块
│   │   ├── analysis.ts     # 作文分析相关接口
│   │   └── axios.ts        # Axios 拦截器封装
│   ├── components/         # UI 组件库
│   │   ├── AnalysisSection.tsx   # 深度点评与素材复用组件
│   │   ├── AnnotatedEssay.tsx    # 逐句精批交互组件
│   │   ├── RevisedComparison.tsx # 润色对比组件
│   │   └── ScoreOverview.tsx     # 评分雷达图组件
│   ├── pages/              # 页面级组件
│   │   ├── AnalysisReport.tsx    # 批改报告详情页
│   │   └── UploadPage.tsx        # 首页/上传页
│   ├── App.tsx             # 路由配置
│   ├── constants.ts        # 常量定义及 Mock 数据
│   ├── types.ts            # TypeScript 类型定义
│   ├── index.tsx           # 入口文件
│   └── env.d.ts            # 环境变量类型声明
├── .env.local              # 本地环境变量配置
├── index// filepath: d:\Code\English_composition_grading_program\react-frontend\README.md
