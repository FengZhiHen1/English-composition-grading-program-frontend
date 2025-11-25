import React from "react";
import { Home, BookOpen, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 定义导航项
  const navItems = [
    {
      name: "首页",
      path: "/",
      icon: Home,
    },
    {
      name: "范文集",
      path: "/essays", // 假设的路由，你可以根据实际情况修改
      icon: BookOpen,
    },
    {
      name: "我的",
      path: "/profile",
      icon: User,
    },
  ];

  return (
    // 修改定位方式：
    // 1. left-1/2 -translate-x-1/2: 强制居中对齐
    // 2. w-full max-w-md: 宽度跟随全局容器，但不超过最大宽度
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 pb-safe pt-2 px-6 z-50">
      <div className="flex justify-between items-center pb-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center w-full space-y-1 group active:scale-95 transition-transform duration-100"
            >
              <div
                className={`relative p-1 rounded-full transition-colors duration-200 ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              >
                <Icon
                  size={24}
                  strokeWidth={isActive ? 2.5 : 2}
                  fill={isActive ? "currentColor" : "none"}
                  className={`transition-all duration-200 ${isActive ? "opacity-100" : "opacity-80"}`}
                />
              </div>
              <span
                className={`text-[10px] font-medium transition-colors duration-200 ${
                  isActive ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
