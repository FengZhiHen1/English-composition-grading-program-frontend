// AuthContext.tsx
// 本文件提供认证上下文（AuthContext）与提供者（AuthProvider）。
// 作用：在应用中统一管理用户登录态与用户信息，包括：
// - 从 localStorage 读取/保存 token 并通过 setAuthToken 设置 axios 授权头
// - 提供 login/logout/refreshUser 方法以便组件调用
// - 在初始化时尝试使用本地 token 刷新用户信息，供全局使用（useAuth hook）
// 导出：AuthProvider（包裹应用）和 useAuth（组件内获取 auth 状态与方法）
import React, { createContext, useContext, useEffect, useState } from "react";
import http, { setAuthToken } from "@/utils/index";
import { postLoginAPI, getUserInfoAPI } from "@/api/user";
import type { userInfo, loginData } from "@/types/user";

interface AuthContextValue {
  user: userInfo | null;
  loading: boolean; // 认证状态加载中（如初始化时读取token、获取用户信息）
  isAuthenticated: boolean;
  login: (payload: loginData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<userInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const TOKEN_KEY = "auth_token";

  useEffect(() => {
    // 初始化：从 localStorage 读取 token，若存在则设置 header 并尝试获取用户信息
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      setAuthToken(token);
      refreshUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshUser = async () => {
    try {
      const res = await getUserInfoAPI();
      const data =
        res && "data" in (res as any) ? (res as any).data : (res as any);
      setUser(data ?? null);
    } catch (err) {
      setUser(null);
      // token 可能无效，清理
      localStorage.removeItem(TOKEN_KEY);
      setAuthToken(null);
    }
  };

  const login = async (payload: loginData) => {
    const res = await postLoginAPI(payload);
    const token =
      res && "data" in (res as any) && (res as any).data?.token
        ? (res as any).data.token
        : (res as any)?.token;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      setAuthToken(token);
      await refreshUser();
    } else {
      throw new Error("登录未返回 token");
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth 必须在 AuthProvider 内使用");
  return ctx;
};

export default AuthContext;
