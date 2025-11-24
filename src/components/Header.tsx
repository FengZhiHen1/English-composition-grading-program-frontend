import React from 'react';
import { MoreHorizontal, Circle } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm px-4 h-12 flex items-center justify-between border-b border-gray-50">
      {/* 左侧占位，保持标题居中 */}
      <div className="w-20"></div>

      {/* 中间标题 */}
      <h1 className="text-base font-semibold text-gray-800 tracking-wide">
        英语作文批改
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