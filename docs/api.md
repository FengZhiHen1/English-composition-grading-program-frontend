# 接口与数据格式说明（前端使用）

位置提示：前端请求基址由 `VITE_API_BASE_URL` 配置（见 `src/utils/request.ts`）。本文件与代码互相印证，内容基于 `src/api/*`、`src/utils/*` 与 `src/types/*`。

## 概览

- 后端基址：`import.meta.env.VITE_API_BASE_URL`。
- 请求封装：`src/utils/index.ts` 导出 `http`（`get/post/patch/remove`）和 `setAuthToken`，调用样例 `http.get<T>(url, params)` / `http.post<T>(url, data)`。
- 响应约定：`src/utils/request.ts` 在响应拦截器中会把后端返回统一归一化为类似 `{ code?, msg?, message?, success?, data }` 的结构；当后端直接返回业务对象且未包裹 `data` 时，会自动封装为 `{ code:0, msg:'ok', data: body }`。

## 认证与 token

- 本项目 `AuthContext` 使用 `localStorage` 的键 `auth_token` 保存 token，并通过 `setAuthToken(token)` 把 `Authorization: Bearer <token>` 写入 axios 实例默认 header（见 `src/context/AuthContext.tsx` 与 `src/utils/index.ts`）。
- `AuthContext` 在初始化时：若存在 token 会尝试解析 JWT payload 中的 `uid/sub/id/user_id` 作为用户 id 调用 `getUserInfoAPI(id)`，解析失败则调用不带 id 的 `GET /api/user/get_userinfo`。
- 登录流程：调用 `postLoginAPI(payload)` 后，若响应包含 `data.token`（或兼容格式返回 token），会把 token 写入 `localStorage` 并调用 `refreshUser()` 获取用户信息；若后端使用 session（Set-Cookie），则不一定返回 token，`AuthContext` 也会尝试调用 `refreshUser()`。

## 响应封装细节（重要）

- `src/utils/request.ts` 的响应拦截器会：
  - 若返回对象包含 `success` 字段，会把其映射为 `{ code: number, msg/message, success, data }`。
  - 若返回体没有 `data` 字段但返回的是业务对象，会将其封装为 `{ code:0, msg:'ok', data: body }`。
  - 调用 `http.get/post` 等会直接返回这个归一化后的对象，调用方通常需检查 `res.code`/`res.success` 并使用 `res.data`。

## 主要接口（代码中实际使用）

1) 用户相关（文件：`src/api/user.ts`）

  - 登录
    - 函数：`postLoginAPI(data: loginData)`
    - 方法：`POST /api/user/login`
    - 请求体：`{ username, password }`（参见 `src/types/user.ts` 中的 `loginData`）
    - 返回：归一化的 envelope（示例 `{ code:0, msg:'登录成功', data:{ token: '...' } }`）

  - 注册
    - 函数：`postRegisterAPI(data: loginData)`
    - 方法：`POST /api/user/register`

  - 获取用户信息
    - 函数：`getUserInfoAPI(id?: number|string)`
    - 方法：`GET /api/user/get_userinfo` 或 `GET /api/user/get_userinfo/{id}`（当传 id 时使用路径参数）
    - 返回数据类型：`userInfo`（见 `src/types/user.ts`，字段包括 `uid, username, avatar_url, telephone, wechat_id, points, grade`）

2) 作文分析 / 上传（文件：`src/api/analysis.ts`）

  - 提交作文（文本或图片）
    - 函数：`submitEssay(text?: string, files?: File[]|FileList, onUploadProgress?)`
    - 方法：`POST /api/essay/upload`（`multipart/form-data`，浏览器/axios 自动设置 boundary）
    - 表单字段：`text`（可选）、`photo[]`（可多次出现，后端按数组接收）
    - 前端校验：仅允许 `image/*` 文件、单张不超过 10MB；若既无文本又无图片，函数会 reject
    - 返回：后端 envelope（通常包含 `analysis_id`、`status` 等）

  - 获取作文分析报告
    - 函数：`getEssayAnalysis(id?: string)`
    - 方法：`GET /api/essay/essay_analysis/{id}` 或 `GET /api/essay/essay_analysis/latest`（不传 id 时调用 `/latest`）
    - 返回类型：`EssayData`（详见 `src/types/analysis.ts`，包含 `original_text`, `overall_evaluation`, `highlights`, `detailed_errors`, `revised_text` 等）

  - 获取批改任务列表
    - 函数：`getReviewTasks(userId?: string)`
    - 方法：`GET /api/essay/review_tasks?user_id=xxx`（当提供 `userId` 时会以 `user_id` query 参数发送）
    - 注意：前端使用 `useReviewTasks` hook 时会做若干兼容处理（支持后端返回 `data` 或直接返回数组等多种格式）。

## 返回/示例说明

- 常见成功 envelope：

```json
{ "code":0, "msg":"ok", "data": { /* 业务对象 */ } }
```

- 常见业务失败（HTTP 200，业务错误）：

```json
{ "code":1001, "msg":"作文长度不足", "data": null }
```

- 认证失败示例（HTTP 401 或业务封装）：

```json
{ "code":401, "msg":"Unauthorized", "data": null }
```

## 示例（本地调试）

- 可在浏览器控制台临时设置示例 token（仅用于开发）：

```js
localStorage.setItem('auth_token', '<示例 token>');
```

- `AuthContext` 会在初始化时尝试解析 token payload 查找 `uid` 并自动调用 `getUserInfoAPI(uid)`。

## 调用注意事项与建议

- 永远通过 `http` 封装发请求（`src/utils/index.ts`），不要直接使用 axios 实例，便于统一拦截和 token 管理。
- 上传时不要手动设置 `Content-Type` 为 `multipart/form-data`，让浏览器/axios 自动处理 boundary。
- 从 `http` 返回的对象可能是归一化的 envelope，也可能是兼容旧格式的直接对象；在业务代码中请按 `useReviewTasks`、`AuthContext` 的示例做容错解析（检查 `res.data`、`res.success`、或直接解析 `res`）。
- 当上传返回 `analysis_id` 可用轮询或 WebSocket 通知来获知分析完成状态；项目中 `useReviewTasks` 提供了任务列表读取的示例实现。


