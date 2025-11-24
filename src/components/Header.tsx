import React from 'react';
import { MoreHorizontal, Circle, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  /** 页面标题，默认为"英语作文批改" */
  title?: string;
  /** 是否显示返回按钮，默认为 false */
  showBack?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title = "英语作文批改", showBack = false }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm px-4 h-12 flex items-center justify-between border-b border-gray-50">
      {/* 左侧区域：返回按钮或占位 */}
      <div className="w-20 flex items-center">
        {showBack ? (
          <button 
            onClick={() => navigate(-1)} 
            className="p-1 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors active:scale-90"
            aria-label="返回上一页"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
        ) : (
          // 保持占位，确保标题绝对居中
          <div className="w-full"></div>
        )}
      </div>

      {/* 中间标题 */}
      <h1 className="text-lg font-semibold text-gray-800 tracking-wide truncate text-center flex-1">
        {title}
      </h1>

      {/* 右侧胶囊按钮 (模仿微信小程序原生UI) */}
      <div className="w-20 flex justify-end">
        <div className="flex items-center bg-white/50 border border-gray-200 rounded-full px-3 py-1 space-x-3 shadow-sm">
          <MoreHorizontal size={16} className="text-gray-900" />
          {/* 分割线 */}
          <div className="w-[1px] h-3 bg-gray-300"></div>
          <Circle size={16} className="text-gray-900 fill-gray-900" />
        </div>
      </div>
    </header>
  );
};

export default Header;