import axios from 'axios';

// 创建axios实例，配置全局默认项
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 后端基础地址
  timeout: 10000, // 超时时间（10秒）
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. 请求拦截器：添加统一参数（如Token）
axiosInstance.interceptors.request.use(
  (config) => {
    // 示例：给所有请求添加身份Token（从localStorage获取）
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 请求发送前的错误（如参数错误）
    return Promise.reject(error);
  }
);

// 2. 响应拦截器：统一处理错误（如Token过期、业务错误）
axiosInstance.interceptors.response.use(
  (response) => {
    // 只返回响应体中的data字段（后端通常封装为{ code: 200, data: {}, message: '' }）
    return response.data;
  },
  (error) => {
    // 处理HTTP错误或后端返回的业务错误
    if (error.response) {
      // 后端返回错误状态码（如401 Token过期、403无权限）
      const status = error.response.status;
      if (status === 401) {
        // 示例：Token过期，跳转登录页
        window.location.href = '/login';
      }
      // 提取后端返回的错误信息
      const errorMsg = error.response.data?.message || '后端请求失败';
      return Promise.reject(new Error(errorMsg));
    } else if (error.request) {
      // 网络错误（如断网、超时）
      return Promise.reject(new Error('网络异常，请检查网络连接'));
    } else {
      // 请求配置错误（如参数错误）
      return Promise.reject(new Error('请求配置错误'));
    }
  }
);

export default axiosInstance;