# 智能作文批改 (Smart Essay Grading)

这是一个基于 React + TypeScript 和 AI 技术的英语作文智能批改前端项目。目标是为学生与教师提供可视化、可交互的作文评估报告，包含逐句精批、深度点评、润色对比与多维评分展示。

## 主要特性

- **智能上传**：支持直接文本输入或上传（图片/PDF/Word）并进行识别与分析。
- **多维评分**：按切题度、词汇语法、逻辑结构、内容详情等维度生成雷达图评分。
- **逐句精批**：逐句标注错误与亮点，点击查看修改建议与解释。
- **深度点评**：总结亮点、待改进项与素材复用建议。
- **润色对比**：展示 AI 润色后的高分范文并支持并排对比。
- **导出/打印**：支持将评估报告导出或打印为 A4/PDF 格式。

## 技术栈

- 核心：`React` + `TypeScript`
- 构建：`Vite`
- 路由：`react-router-dom`
- 可视化：`recharts`（用于雷达图等）
- 网络请求：`axios`
- 图标：`lucide-react`
- 样式：Tailwind CSS（项目通过 CDN 或自定义引入）

**注意**：本仓库为前端项目，不包含后端模型服务。前端通过 `VITE_API_BASE_URL` 与后端 API 通信。

## 快速开始

1. 克隆仓库并进入项目根目录：

```powershell
cd D:\Code\English_composition_grading_program\react-frontend
```

2. 安装依赖：

```powershell
npm install
```

3. 环境变量（开发时）：新建或复制 `.env.local`，并设置后端地址，例如：

```properties
# 后端 API 基础地址
VITE_API_BASE_URL=http://localhost:8000
```

4. 启动开发服务器：

```powershell
npm run dev
```

启动后，终端会显示本地访问地址（通常为 `http://localhost:3000` 或 `http://localhost:5173`，以终端输出为准）。

5. 构建与预览：

```powershell
npm run build
npm run preview
```

**当后端不可用时（Mock 模式）**

如果后端服务未启动或发生错误，项目会在前端降级使用模拟数据以保证 UI 调试体验。模拟数据定义在 `src/constants.ts` 中的 `MOCK_DATA` 常量。

## 项目结构（主要目录）

- `public/`：静态资源
- `src/`
	- `api/`：后端接口封装（例如 `analysis.ts`、`user.ts`）
	- `components/`：可复用组件（如 `AnalysisReport` 下的分组件）
	- `pages/`：页面级组件（`Home.tsx`、`UploadPage.tsx` 等）
	- `context/`：React Context（如 `AuthContext.tsx`）
	- `hooks/`：自定义 Hook（如 `useReviewTasks.ts`）
	- `types/`：类型定义
	- `utils/`：工具函数与请求封装（如 `request.ts`）

### 关键文件说明

- `src/constants.ts`：全局常量与 `MOCK_DATA`，用于本地调试。
- `src/api/analysis.ts`：作文分析相关 API 调用封装。
- `src/components/AnalysisReport/*`：分析报告详情页的子组件集合。
- `src/context/AuthContext.tsx`：鉴权与用户信息状态管理。

## 开发与调试提示

- 推荐 Node 版本：`Node 18+`（使用 NVM 或官方安装包管理版本）。
- 开发时若遇到跨域问题，请检查 `VITE_API_BASE_URL` 与 `vite.config.ts` 中的代理配置。
- 若 UI 无数据，请确认后端 `/api` 接口可达，或切换到 Mock 模式检查 `src/constants.ts`。

## 贡献与联系

欢迎提交 Issue 或 PR。有关建议或问题，请在仓库中创建 Issue，或联系维护者。

---

如果你需要，我可以：

- 帮你运行一次 `npm run dev` 并检查控制台输出；
- 或者把 `VITE_API_BASE_URL` 的用法和 `vite.config.ts` 的代理配置贴出来解释。
