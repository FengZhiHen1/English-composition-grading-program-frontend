import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,   // 后端基础地址
    timeout: 10000,   // 请求超时时间
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器
api.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么，例如添加 Token
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        // 请求发送前的错误
        return Promise.reject(error);
    }
);

// 响应拦截器：统一处理错误（如Token过期、业务错误）
api.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        return response.data;
    },
    (error) => {
        // 对响应错误做点什么
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default api;