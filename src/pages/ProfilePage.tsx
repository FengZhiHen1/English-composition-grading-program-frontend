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
  Check
} from 'lucide-react';

import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import ProfileMenuItem from '../components/ProfileMenuItem';
import { USER } from '../constants';

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
    // 尝试从 "二年级" 中提取 "二" 并转换为数字
    const gradeChar = gradeStr.charAt(0);
    const gradeIndex = chinese.indexOf(gradeChar);
    const grade = gradeIndex !== -1 ? gradeIndex + 1 : 1;
    
    return { level, grade };
  };

  const initialState = getInitialState();

  // 最终显示的选中值
  const [confirmedLevel, setConfirmedLevel] = useState(initialState.level); 
  const [confirmedGrade, setConfirmedGrade] = useState(initialState.grade);

  // 弹窗中临时的选中值
  const [tempLevel, setTempLevel] = useState(initialState.level);
  const [tempGrade, setTempGrade] = useState(initialState.grade);

  // --- 新增：锁定背景滚动 ---
  // 当弹窗打开时，禁止页面主体滚动，防止滚动穿透
  useEffect(() => {
    if (showPicker) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // 组件卸载时恢复
    return () => {
      document.body.style.overflow = '';
    };
  }, [showPicker]);

  // --- 事件处理 ---

  // 打开弹窗
  const handleOpenPicker = () => {
    setTempLevel(confirmedLevel);
    setTempGrade(confirmedGrade);
    setShowPicker(true);
  };

  // 切换阶段时，重置年级或确保年级在范围内
  const handleLevelChange = (level: typeof EDUCATION_LEVELS[0]) => {
    setTempLevel(level);
    // 如果切换后的阶段年级少于当前选中的年级，重置为1，否则保持
    if (tempGrade > level.years) {
      setTempGrade(1);
    }
  };

  // 确认选择
  const handleConfirm = () => {
    setConfirmedLevel(tempLevel);
    setConfirmedGrade(tempGrade);
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

            {/* 年级选择按钮 (修改了 onClick) */}
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
            icon={HelpCircle} 
            label="视频教程与常见问题" 
            onClick={() => console.log('教程')} 
          />
          <ProfileMenuItem 
            icon={Clock} 
            label="历史记录" 
            subLabel="(批改、润色、写作)"
            onClick={() => console.log('历史')} 
          />
        </div>

        {/* --- 菜单组 2 --- */}
        <div className="mx-4 bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          <ProfileMenuItem 
            icon={Receipt} 
            label="购买记录" 
            onClick={() => console.log('购买记录')} 
          />
          <ProfileMenuItem 
            icon={Gift} 
            label="活动" 
            subLabel="(送会员)"
            onClick={() => console.log('活动')} 
          />
          <ProfileMenuItem 
            icon={MessageCircle} 
            label="交流群" 
            onClick={() => console.log('交流群')} 
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

      {/* --- 悬浮客服按钮 --- */}
      <button className="fixed bottom-24 right-4 flex flex-col items-center z-20 group">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shadow-lg border-2 border-white text-blue-600 mb-1 group-active:scale-95 transition-transform">
          <Headphones size={24} fill="currentColor" className="text-blue-500" />
        </div>
        <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">
          联系客服
        </span>
      </button>

      {/* --- 年级选择弹窗 (Bottom Sheet) --- */}
      {showPicker && (
        <>
          {/* 遮罩层 - z-50 */}
          <div 
            className="fixed inset-0 bg-black/40 z-50 transition-opacity"
            onClick={() => setShowPicker(false)}
          />
          
          {/* 弹窗内容 - 提升到 z-[60] 确保在遮罩层之上，防止事件被拦截 */}
          <div className="fixed bottom-0 left-0 right-0 bg-white z-[60] rounded-t-2xl shadow-2xl transform transition-transform duration-300 max-w-md mx-auto overscroll-contain">
            {/* 弹窗头部 */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <button 
                onClick={() => setShowPicker(false)}
                className="text-gray-500 text-sm px-2 py-1"
              >
                取消
              </button>
              <span className="font-bold text-gray-800">选择年级</span>
              <button 
                onClick={handleConfirm}
                className="text-blue-600 font-bold text-sm px-2 py-1"
              >
                确定
              </button>
            </div>

            {/* 选择区域 (两列滚动) */}
            {/* 增加高度到 h-64 以便更容易触发滚动 */}
            <div className="flex h-64">
              {/* 左侧：阶段选择 */}
              {/* 添加 touch-pan-y 明确允许垂直滚动 */}
              <div className="flex-1 overflow-y-auto border-r border-gray-50 scrollbar-hide touch-pan-y">
                <div className="py-2">
                  {EDUCATION_LEVELS.map((level) => (
                    <div
                      key={level.name}
                      onClick={() => handleLevelChange(level)}
                      className={`py-3 text-center text-sm cursor-pointer transition-colors ${
                        tempLevel.name === level.name 
                          ? 'text-blue-600 font-bold bg-blue-50' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {level.name}
                    </div>
                  ))}
                  {/* 底部留白，优化滚动体验 */}
                  <div className="h-8"></div>
                </div>
              </div>

              {/* 右侧：年级选择 */}
              <div className="flex-1 overflow-y-auto scrollbar-hide touch-pan-y">
                <div className="py-2">
                  {Array.from({ length: tempLevel.years }).map((_, index) => {
                    const gradeNum = index + 1;
                    return (
                      <div
                        key={gradeNum}
                        onClick={() => setTempGrade(gradeNum)}
                        className={`py-3 text-center text-sm cursor-pointer transition-colors ${
                          tempGrade === gradeNum 
                            ? 'text-blue-600 font-bold bg-blue-50' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {toChineseNum(gradeNum)}年级
                      </div>
                    );
                  })}
                  {/* 底部留白 */}
                  <div className="h-8"></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;