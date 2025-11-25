import axios, { AxiosResponse } from "axios";

// 创建 axios 实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 后端基础地址
  timeout: 10000, // 请求超时时间
  headers: {
    Accept: "application/json",
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 每次发送请求之前判断pinia中是否存在token，如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 注意：不要直接从 localStorage 读取 token，
    // token 由 `setAuthToken()` 统一管理并写入 `api.defaults.headers.common`，
    // 这样更可控，避免不同地方使用不同的 key 导致不一致。

    return config;
  },
  (error) => {
    // 请求发送前的错误
    return Promise.reject(error);
  },
);

// 响应拦截器：统一处理错误（如Token过期、业务错误）
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // 统一归一化后端 envelope，兼容多种返回格式
    const body = response.data;

    // 如果后端已使用 { success: boolean, data, message } 风格，映射为统一结构
    if (body && typeof body === "object") {
      const hasSuccess = Object.prototype.hasOwnProperty.call(body, "success");
      if (hasSuccess) {
        const normalized = {
          code: typeof body.code !== "undefined" ? body.code : body.success ? 0 : 1,
          msg: body.msg ?? body.message ?? (body.success ? "ok" : ""),
          message: body.message ?? body.msg ?? (body.success ? "ok" : ""),
          success: Boolean(body.success),
          data: typeof body.data !== "undefined" ? body.data : null,
        };
        return normalized;
      }

      // 如果后端直接返回业务对象（没有包裹 data），则将其封装为 { code:0, data: body }
      if (!Object.prototype.hasOwnProperty.call(body, "data")) {
        return { code: 0, msg: "ok", data: body };
      }
    }

    // 默认返回 response.data（已为 envelope 或其他结构）
    return body;
  },
  (error) => {
    // 对响应错误做点什么
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);

export default api;
