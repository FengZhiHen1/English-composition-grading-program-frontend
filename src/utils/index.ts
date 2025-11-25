// 本模块封装基于项目 axios 实例的 HTTP 请求方法（get/post/patch/delete）。
// 统一返回 CustomSuccessData<T> 格式，便于全局处理后端响应结构与类型推断。
// 在应用中通过导出的 http 对象调用，例如 http.get<T>(url, params) / http.post<T>(url, data)。
import api from "./axios";
import { AxiosRequestConfig } from "axios";

/**
 * 网络请求响应格式，T 是具体的接口返回类型数据
 */
interface CustomSuccessData<T> {
  code?: number;
  msg?: string;
  message?: string;
  data: T;
  [keys: string]: any;
}

/**
 * @description: 封装get请求方法
 * @param {string} url url 请求地址
 * @param {string | object} params 请求参数
 * @param {AxiosRequestConfig} config 请求配置
 * @return {Promise<CustomSuccessData<T>>} 返回的接口数据
 */
const get = <T>(
  url: string,
  params?: string | object,
  config?: AxiosRequestConfig,
): Promise<CustomSuccessData<T>> => {
  config = {
    method: "get", // `method` 是创建请求时使用的方法
    url, // `url` 是用于请求的服务器 URL
    ...config,
  };
  if (params) {
    config.params = params;
  }
  return api(config);
};

/**
 * @description: 封装post请求方法
 * @param {string} url url 请求地址
 * @param {string | object} data 请求参数
 * @param {AxiosRequestConfig} config 请求配置
 * @return {Promise<CustomSuccessData<T>>} 返回的接口数据
 */
const post = <T>(
  url: string,
  data?: string | object,
  config?: AxiosRequestConfig,
): Promise<CustomSuccessData<T>> => {
  config = {
    method: "post",
    url,
    ...config,
  };
  if (data) {
    config.data = data;
  }
  return api(config);
};

/**
 * @description: 封装patch请求方法
 * @param {string} url url 请求地址
 * @param {string | object} data 请求参数
 * @param {AxiosRequestConfig} config 请求配置
 * @return {Promise<CustomSuccessData<T>>} 返回的接口数据
 */
const patch = <T>(
  url: string,
  data?: string | object,
  config?: AxiosRequestConfig,
): Promise<CustomSuccessData<T>> => {
  config = {
    method: "patch",
    url,
    ...config,
  };
  if (data) {
    config.data = data;
  }
  return api(config);
};

/**
 * @description: 封装delete请求方法
 * @param {string} url url 请求地址
 * @param {string | object} params 请求参数
 * @param {AxiosRequestConfig} config 请求配置
 * @return {Promise<CustomSuccessData<T>>} 返回的接口数据
 */
const remove = <T>(
  url: string,
  params?: string | object,
  config?: AxiosRequestConfig,
): Promise<CustomSuccessData<T>> => {
  config = {
    method: "delete",
    url,
    ...config,
  };
  if (params) {
    config.params = params;
  }
  return api(config);
};

// 包裹请求方法的容器,使用 http 统一调用
const http = {
  get,
  post,
  patch,
  remove,
};

export default http;
