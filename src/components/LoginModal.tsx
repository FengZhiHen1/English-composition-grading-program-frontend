import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setUsername("");
      setPassword("");
    }
  }, [isOpen]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username || !password) {
      setError("用户名和密码不能为空");
      return;
    }
    setLoading(true);
    try {
      await login({ username, password });
      onClose();
    } catch (err: any) {
      setError(err?.message || "登录失败");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      />

      {/* 弹窗内容 */}
      <div
        ref={modalRef}
        className="relative w-[80vw] max-w-lg bg-white rounded-2xl shadow-2xl p-6 mx-4"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          aria-label="关闭"
        >
          <X />
        </button>

        <h3 className="text-xl font-semibold mb-4">登录</h3>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-600">用户名</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-gray-50"
              placeholder="请输入用户名"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-600">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-gray-50"
              placeholder="请输入密码"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex flex-col gap-3 items-center mt-2">
            <button
              type="submit"
              className="w-[60%] mx-auto bg-blue-500 text-white py-3 rounded-full shadow-md disabled:opacity-60 transition-colors"
              disabled={loading}
            >
              {loading ? "登录中..." : "登录"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-[60%] mx-auto text-center text-sm text-gray-600 py-3 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
