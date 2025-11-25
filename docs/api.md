# 接口与数据格式说明（前端使用）

> 位置提示：项目中前端请求基址由 `VITE_API_BASE_URL` 配置（见 `src/utils/request.ts`）。

**概览**
- **后端基址**: 由 `import.meta.env.VITE_API_BASE_URL` 提供。
- **认证**: 支持 Bearer Token（JWT）或 Cookie/session；前端默认将 token 存于 `localStorage` 的 `auth_token`，并通过 `http.setAuthToken(token)` 将 `Authorization: Bearer <token>` 写入 axios 默认 header（查看 `src/context/AuthContext.tsx` 与 `src/utils/index.ts`）。
- **统一响应**: 前端使用 `CustomSuccessData<T>`（`data` 字段承载业务数据）；同时兼容 `{ success:boolean, data, message }` 风格的 envelope（见 `AuthContext` 的兼容逻辑）。

**认证与错误规范**
- 存储键: `auth_token`（由 `AuthContext` 管理）。
- 设置/清除 token: `http.setAuthToken(token)` / `http.setAuthToken(null)`。
- 常见后端返回格式（优先）：
  - 成功（HTTP 200）:
    ```json
    { "code": 0, "msg": "ok", "data": { ... } }
    ```
  - 业务失败（HTTP 200，封装为失败）：
    ```json
    { "code": 1, "msg": "错误说明", "data": null }
    ```
  - 认证失败：通常为 HTTP 401 或 200 + `{ success:false, message:"未认证" }`。

附加说明（Token 与用户信息获取）
- `AuthContext` 已实现：在初始化时如果 localStorage 中存在 `auth_token`，会把 token 写入 axios header，并尝试从 token 的 payload 中解析常见字段（`uid` / `sub` / `id` / `user_id`）以作为用户 id 优先调用 `GET /api/user/get_userinfo/{id}`。如果解析失败则回退到不带 id 的 `GET /api/user/get_userinfo`。
- 登录返回若包含 `data.token`，`AuthContext.login` 会保存 token，并优先尝试从登录响应的 `data` 中读取 `uid`（或 `data.user.uid`、`data.user_id` 等），再调用 `getUserInfoAPI(uid)` 获取用户信息，以减少额外的请求。

安全提示：前端此处仅做 payload 解码以提取 id，用于优化请求流程。生产环境必须由后端签发并校验 JWT（签名、过期等），前端不可信任客户端 token 内容作为权限验证依据。

**前端请求封装（说明）**
- 使用 `http.get<T>(url, params)` / `http.post<T>(url, data)` / `http.setAuthToken(token)`（见 `src/utils/index.ts`）。
- `src/utils/request.ts` 在响应拦截器中返回 `response.data`，因此 `http` 的调用会得到后端的 envelope（而非 axios 原始 response）。

---

**接口清单（主要）**

**1. 用户相关**

- 登录
  - 方法：`POST`
  - 路径：`/api/user/login`
  - Headers: `Content-Type: application/json`
  - 请求体：
    ```json
    { "username": "string", "password": "string" }
    ```
  - 成功响应示例：
    ```json
    { "code": 0, "msg": "登录成功", "data": { "token": "<JWT>" } }
    ```
  - 前端使用：`postLoginAPI(payload)`，`AuthContext.login` 会保存 token 并调用 `refreshUser()`。

- 注册
  - 方法：`POST`
  - 路径：`/api/user/register`
  - 请求体：通常同登录（视后端要求可能包含 email/confirmPassword）
  - 响应示例：`{ "code":0, "msg":"注册成功", "data": null }`

- 获取用户信息
  - 方法：`GET`
  - 路径：`/api/user/get_userinfo` 或 `GET /api/user/get_userinfo/{id}`（后端需支持通过路径参数查询指定用户）。
  - Headers: `Authorization: Bearer <token>`（如需）
  - 返回类型（参考 `src/types/user.ts`）:
    ```ts
    interface userInfo {
      uid: number;
      username: string;
      avatar_url: string;
      telephone: string;
      wechat_id: string;
      points: number;
      grade: string;
    }
    ```
  - 响应示例：
    ```json
    {
      "code": 0,
      "msg": "ok",
      "data": {
        "uid": 123,
        "username": "zhangsan",
        "avatar_url": "https://...",
        "telephone": "13800000000",
        "wechat_id": "wx12345",
        "points": 42,
        "grade": "高中 · 三年级"
      }
    }
    ```

**2. 作文分析 / 上传**

- 提交图片或文本进行分析（上传）
  - 方法：`POST`
  - 路径：`/api/essay/upload`
  - Headers：`Content-Type: multipart/form-data`（浏览器自动设置）
  - 表单字段：
    - `text`（可选）：作文文本
    - `photo[]`：可多次出现，每次一个图片文件（`submitEssay` 使用 `formData.append('photo[]', file)`）
  - 前端限制：单张 <= 10MB；类型以 `image/` 开头（`submitEssay` 中已校验）
  - 成功响应示例：
    ```json
    { "code":0, "msg":"上传成功，任务已入队", "data": { "analysis_id":"id123", "status":"processing" } }
    ```
  - 前端使用：`submitEssay(text, files)`（见 `src/api/analysis.ts`），该方法会组装 `FormData` 并做校验。

- 获取作文分析报告
  - 方法：`GET`
  - 路径：
    - 指定 ID：`/api/essay/essay_analysis/{id}`
    - 最新：`/api/essay/essay_analysis/latest`
  - 返回类型：参见 `src/types/analysis.ts` 中的 `EssayData`（下文也包含示例）
  - 响应示例（概要）：
    ```json
    {
      "code":0,
      "msg":"ok",
      "data": { "original_text":"...", "overall_evaluation":{...}, "revised_text":"..." }
    }
    ```
  - 前端使用：`getEssayAnalysis(id?)`（若不传 id，使用 `/latest`）。

---

**类型参考（项目内）**
- `src/types/user.ts` 与 `src/types/analysis.ts` 已定义了常用类型。关键类型摘要：
  - `loginData`: `{ username: string; password: string }`
  - `userInfo`: 见上文
  - `EssayData`: 包含 `original_text`, `overall_evaluation`, `highlights`, `improvements`, `error_summary`, `detailed_errors`, `optimizations`, `paragraph_reviews`, `material_reuse_guide`, `revised_text` 等（详见 `src/types/analysis.ts`）。

**示例数据（完整样例）**

- 登录请求：
  ```json
  { "username": "testuser", "password": "password123" }
  ```

- 登录成功响应：
  ```json
  { "code":0, "msg":"登录成功", "data": { "token": "eyJ..." } }
  ```

- 获取用户信息响应：
  ```json
  {
    "code":0,
    "msg":"ok",
    "data":{
      "uid":101,
      "username":"testuser",
      "avatar_url":"https://example.com/avatar.jpg",
      "telephone":"13800000000",
      "wechat_id":"weixin101",
      "points":120,
      "grade":"大学 · 二年级"
    }
  }
  ```

- 上传作文（成功示例）：
  ```json
  { "code":0, "msg":"上传成功", "data":{ "analysis_id":"analysis_20251125_ab12", "status":"processing" } }
  ```

**示例 Token（用于本地调试）**
- 说明：下面的 token 为本地测试示例，未做签名校验，仅用于前端从 payload 中解析 `uid`。不要在生产环境使用该示例 token。

示例 token（payload 包含 uid = "123"）：

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxMjMifQ==.c2lnbmF0dXJl
```

使用方法：
- 在浏览器控制台执行：
  ```js
  localStorage.setItem('auth_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxMjMifQ==.c2lnbmF0dXJl');
  ```
- 刷新页面后 `AuthContext` 会解析出 `uid: "123"` 并尝试调用 `GET /api/user/get_userinfo/123` 来刷新用户信息。

安全提示：该示例 signature 不是后端签名，仅示范 payload 解码流程；生产环境必须使用后端签发并校验的 JWT。

- 分析报告（部分示例）：
  ```json
  {
    "code":0,
    "msg":"ok",
    "data":{
      "original_text":"Today I go to school and ...",
      "overall_evaluation":{
        "tier":"B",
        "total_score":"82",
        "brief_comment":"条理较好，但语法与词汇欠佳。",
        "score_breakdown":{
          "relevance":"Good",
          "grammar_vocab":"Average",
          "logic_structure":"Good",
          "content":"Good"
        }
      },
      "highlights":{
        "content":[{"point":"紧扣主题","evidence":"第一段主题句"}],
        "language":[],
        "structure":[]
      },
      "error_summary":{ "grammar":["时态错误"], "spelling":["occured -> occurred"], "structure":["段落结尾缺少总结句"] },
      "detailed_errors":[{"id":1,"type":"grammar","original_sentence":"She go to school yesterday.","correction":"She went to school yesterday.","explanation":"过去时应该使用 went","advanced_suggestion":"可使用 'She had gone' 表示过去完成"}],
      "revised_text":"Today I went to school and..."
    }
  }
  ```

**错误响应示例**
- 认证失效（HTTP 401）：
  ```json
  { "code":401, "msg":"Unauthorized", "data": null }
  ```
- 业务失败（HTTP 200 但业务错误）：
  ```json
  { "code":1001, "msg":"作文长度不足", "data": null }
  ```

**前端使用建议**
- 使用项目内的 `postLoginAPI`, `postRegisterAPI`, `getUserInfoAPI`，并通过 `AuthContext` 管理登录态。
- 上传图片请使用 `submitEssay(text, files)`，不要手动设置 `Content-Type` 为 `multipart/form-data`（浏览器自动设置 boundary）。
- 在调用 `http` 返回的 envelope 时，检查 `res.code` / `res.success` / `res.msg`，并在必要时抛出错误或显示用户友好提示。
- 建议在 `src/utils/request.ts` 的响应拦截器中统一处理 token 过期（如遇到特定 code）并触发 `logout()`。

**可选增强**
- 若上传返回 `analysis_id`，可以实现轮询或 WebSocket 推送来通知前端结果完成。
- 可以把该文档转换为 OpenAPI/Swagger JSON 以方便后端联调与自动化测试。

---

如需我将此文档转换为 OpenAPI 规范、或根据后端给出的真实示例进一步校正字段与 code，请告诉我。我也可以现在把该文件提交为一个 commit。
