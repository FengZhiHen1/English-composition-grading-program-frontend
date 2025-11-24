import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  /** 功能名称 */
  title: string;
  /** 简单介绍 */
  description: string;
  /** 图标组件 (Lucide React Icon) */
  icon: LucideIcon;
  /** 点击回调 */
  onClick?: () => void;
  /** 颜色主题，默认为蓝色 */
  variant?: 'blue' | 'green' | 'orange' | 'purple';
  /** 额外的样式类名 */
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  onClick,
  variant = 'blue',
  className = '',
}) => {
  // 定义不同主题的颜色样式
  const themeStyles = {
    blue: 'bg-gradient-to-b from-blue-400 to-blue-500 shadow-blue-200',
    green: 'bg-gradient-to-b from-emerald-400 to-emerald-500 shadow-emerald-200',
    orange: 'bg-gradient-to-b from-orange-400 to-orange-500 shadow-orange-200',
    purple: 'bg-gradient-to-b from-purple-400 to-purple-500 shadow-purple-200',
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative 
        w-[45%] 
        aspect-[4/5] 
        rounded-2xl 
        p-4 
        flex 
        flex-col 
        items-center 
        justify-center 
        text-center 
        text-white 
        shadow-lg 
        cursor-pointer 
        transition-transform 
        active:scale-95 
        ${themeStyles[variant]} 
        ${className}
      `}
    >
      {/* 图标背景圈 */}
      <div className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-sm">
        <Icon size={32} className="text-white" strokeWidth={2} />
      </div>

      {/* 标题 */}
      <h3 className="text-lg font-bold mb-2 tracking-wide">
        {title}
      </h3>

      {/* 描述 */}
      <p className="text-xs text-white/90 leading-relaxed font-medium">
        {description}
      </p>

      {/* 装饰性背景圆 (可选，增加质感) */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl pointer-events-none"></div>
    </div>
  );
};

export default FeatureCard;