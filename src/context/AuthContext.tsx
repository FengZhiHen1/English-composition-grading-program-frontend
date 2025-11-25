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

  // 类型守卫：判断是否为后端统一的 envelope
  const isEnvelope = (v: any): v is { success: boolean; data?: any; message?: string } => {
    return typeof v === "object" && v !== null && Object.prototype.hasOwnProperty.call(v, "success");
  };

  const refreshUser = async () => {
    try {
      const res = await getUserInfoAPI();
      if (isEnvelope(res)) {
        if (res.success) {
          setUser(res.data ?? null);
        } else {
          // 未认证或其他后端返回的失败
          setUser(null);
          throw new Error(res.message || "未认证");
        }
      } else if (res && typeof res === "object") {
        // 兼容旧格式，直接使用返回对象
        setUser((res as any) ?? null);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
      // token 可能无效，清理
      localStorage.removeItem(TOKEN_KEY);
      setAuthToken(null);
    }
  };

  const login = async (payload: loginData) => {
    const res = await postLoginAPI(payload);
    // 期望后端返回统一 envelope: { success: boolean, data?: any, message?: string }
    if (isEnvelope(res)) {
      if (!res.success) {
        // 将后端返回的 message 透传给调用者
        throw new Error(res.message || "登录失败");
      }

      // 成功
      const maybe = res.data;
      // 如果返回 token
      if (maybe && typeof maybe === "object" && (maybe as any).token) {
        const token = (maybe as any).token;
        try {
          localStorage.setItem(TOKEN_KEY, token);
        } catch {}
        setAuthToken(token);
        await refreshUser();
        return;
      }

      // 成功但没有 token：可能为 session 登录（后端通过 Set-Cookie 写入 session）
      if (res.success) {
        await refreshUser();
        return;
      }

      throw new Error("登录返回格式不正确");
    } else if (res && typeof res === "object") {
      // 兼容旧格式：尝试提取 token
      const token = (res as any).token || (res as any).data?.token;
      if (token) {
        try {
          localStorage.setItem(TOKEN_KEY, token);
        } catch {}
        setAuthToken(token);
        await refreshUser();
        return;
      }
      throw new Error("登录未返回 token");
    } else {
      throw new Error("登录失败");
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
