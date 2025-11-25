import api from './axios';
import { User } from '../types';

export interface LoginResult {
  token: string;
  user: User;
}

/**
 * 登录：POST /api/login 返回 { token, user }
 * 请根据后端接口调整字段和路径
 */
export const login = async (username: string, password: string): Promise<LoginResult> => {
  const res = await api.post('/login', { username, password });
  // 这里假设 api 已经返回 response.data（见 axios.ts）
  return res as LoginResult;
};

export const getProfile = async (): Promise<User> => {
  return await api.get('/me');
};

export const logoutRequest = async (): Promise<void> => {
  try {
    await api.post('/logout');
  } catch {
    // 忽略网络错误，客户端仍然清理本地状态
  }
};