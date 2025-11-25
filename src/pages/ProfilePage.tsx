import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  ChevronDown, 
  Star, 
  HelpCircle, 
  Clock, 
  Receipt, 
  Gift, 
  MessageCircle, 
  FileEdit, 
  Info,
  Headphones,
  X,
  Check,
  Ticket
} from 'lucide-react';

import { USER } from '../constants';

import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import ProfileMenuItem from '../components/ProfilePage/ProfileMenuItem';
import GradePicker from '../components/ProfilePage/GradePicker'; // 新增引入

// 定义教育阶段数据
const EDUCATION_LEVELS = [
  { name: '小学', years: 6 },
  { name: '初中', years: 3 },
  { name: '高中', years: 3 },
  { name: '大学', years: 4 },
];

// 数字转中文数字辅助函数
const toChineseNum = (num: number) => {
  const chinese = ['一', '二', '三', '四', '五', '六'];
  return chinese[num - 1] || num;
};

const ProfilePage: React.FC = () => {
  // --- 状态管理 ---
  const [showPicker, setShowPicker] = useState(false);
  
  // 解析 USER.grade 获取初始值
  const getInitialState = () => {
    if (!USER.grade) return { level: EDUCATION_LEVELS[3], grade: 2 };
    
    const parts = USER.grade.split(' · ');
    const levelName = parts[0];
    const gradeStr = parts[1] || '';
    
    const level = EDUCATION_LEVELS.find(l => l.name === levelName) || EDUCATION_LEVELS[3];
    
    const chinese = ['一', '二', '三', '四', '五', '六'];
    const gradeChar = gradeStr.charAt(0);
    const gradeIndex = chinese.indexOf(gradeChar);
    const grade = gradeIndex !== -1 ? gradeIndex + 1 : 1;
    
    return { level, grade };
  };

  const initialState = getInitialState();

  // 最终显示的选中值
  const [confirmedLevel, setConfirmedLevel] = useState(initialState.level); 
  const [confirmedGrade, setConfirmedGrade] = useState(initialState.grade);

  // --- 新增：锁定背景滚动 ---
  useEffect(() => {
    if (showPicker) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showPicker]);

  // 打开弹窗
  const handleOpenPicker = () => {
    setShowPicker(true);
  };

  // 确认回调
  const handleConfirm = (level: typeof EDUCATION_LEVELS[0], grade: number) => {
    setConfirmedLevel(level);
    setConfirmedGrade(grade);
    setShowPicker(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative">
      <Header title="个人中心" />

      <main className="flex-1 pb-24">
        {/* --- 用户信息区域 --- */}
        <div className="bg-white p-6 pb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
                {/* 头像 */}
                <div className="w-16 h-16 rounded-full bg-gray-200 shadow-md border-2 border-white overflow-hidden flex-shrink-0">
                    {USER.avatar_url ? (
                        <img 
                          src={USER.avatar_url} 
                          alt="用户头像" 
                          className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold text-xl">
                            {USER.username.slice(0, 1)}
                        </div>
                    )}
                </div>

                {/* 用户名与状态 */}
                <div className="space-y-1">
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-gray-800">{USER.username}</span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <span>UID: {USER.uid}</span>
                            <button className="text-blue-500 p-0.5 rounded hover:bg-blue-50">
                                <Copy size={12} />
                            </button>
                        </div>
                    </div>
                    <div className={`inline-flex items-center px-2 py-0.5 rounded-md mt-1 ${USER.points > 0 ? 'bg-amber-100' : 'bg-gray-100'}`}>
                        <div className={`w-3 h-3 rounded-full mr-1.5 border-2 border-white ${USER.points > 0 ? 'bg-amber-500' : 'bg-gray-400'}`}></div>
                        <span className={`text-xs ${USER.points > 0 ? 'text-amber-800' : 'text-gray-500'}`}>积分数：{USER.points}</span>
                    </div>
                </div>
            </div>

            {/* 年级选择按钮 (使用独立组件) */}
            <button 
              onClick={handleOpenPicker}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100 text-xs text-gray-600 font-medium active:bg-gray-100 transition-colors"
            >
                {confirmedLevel.name} · {toChineseNum(confirmedGrade)}年级
                <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* --- 菜单组 1 --- */}
        <div className="mx-4 -mt-4 relative z-10 bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          <ProfileMenuItem 
            icon={Star} 
            label="我的收藏" 
            onClick={() => console.log('收藏')} 
          />
          <ProfileMenuItem 
            icon={Clock} 
            label="历史记录" 
            subLabel="(批改、润色、写作)"
            onClick={() => console.log('历史')} 
          />
          <ProfileMenuItem 
            icon={HelpCircle} 
            label="视频教程与常见问题" 
            onClick={() => console.log('教程')} 
          />
        </div>

        {/* --- 菜单组 2 --- */}
        <div className="mx-4 bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          <ProfileMenuItem 
            icon={Receipt} 
            label="充值记录" 
            onClick={() => console.log('充值记录')} 
          />
          <ProfileMenuItem 
            icon={Gift} 
            label="活动" 
            onClick={() => console.log('活动')} 
          />
          <ProfileMenuItem 
            icon={Ticket} 
            label="兑换码"
            subLabel="(送积分)"
            onClick={() => console.log('兑换码')} 
          />
        </div>

        {/* --- 菜单组 3 --- */}
        <div className="mx-4 bg-white rounded-2xl shadow-sm overflow-hidden">
          <ProfileMenuItem 
            icon={FileEdit} 
            label="反馈和建议" 
            subLabel="(我想听到你的声音)"
            onClick={() => console.log('反馈')} 
          />
          <ProfileMenuItem 
            icon={Info} 
            label="关于我们" 
            onClick={() => console.log('关于')} 
          />
        </div>
      </main>

      {/* 使用独立的 GradePicker 组件 */}
      <GradePicker
        isOpen={showPicker}
        initialLevel={confirmedLevel}
        initialGrade={confirmedGrade}
        levels={EDUCATION_LEVELS}
        onClose={() => setShowPicker(false)}
        onConfirm={handleConfirm}
      />

      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;