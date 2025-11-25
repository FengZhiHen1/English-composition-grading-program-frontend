import React from "react";
import { ChevronRight, LucideIcon } from "lucide-react";

interface ProfileMenuItemProps {
  icon: LucideIcon;
  label: string;
  subLabel?: string; // 用于显示如 "(批改、润色、写作)" 这样的补充信息
  onClick?: () => void;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon: Icon,
  label,
  subLabel,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center p-4 bg-white active:bg-gray-50 transition-colors border-b border-gray-50 last:border-none"
    >
      {/* 左侧图标 */}
      <Icon size={20} className="text-gray-600" strokeWidth={1.5} />

      {/* 中间文字 */}
      <div className="flex-1 text-left ml-3">
        <span className="text-gray-800 text-sm font-medium">{label}</span>
        {subLabel && (
          <span className="text-gray-400 text-xs ml-2 font-normal">
            {subLabel}
          </span>
        )}
      </div>

      {/* 右侧箭头 */}
      <ChevronRight size={16} className="text-gray-300" />
    </button>
  );
};

export default ProfileMenuItem;
