import React, { useEffect, useState } from 'react';

type Level = { name: string; years: number };

interface GradePickerProps {
  isOpen: boolean;
  initialLevel: Level;
  initialGrade: number;
  levels: Level[];
  onClose: () => void;
  onConfirm: (level: Level, grade: number) => void;
}

const toChineseNum = (num: number) => {
  const chinese = ['一', '二', '三', '四', '五', '六'];
  return chinese[num - 1] || num;
};

const GradePicker: React.FC<GradePickerProps> = ({ isOpen, initialLevel, initialGrade, levels, onClose, onConfirm }) => {
  const [tempLevel, setTempLevel] = useState<Level>(initialLevel);
  const [tempGrade, setTempGrade] = useState<number>(initialGrade);

  useEffect(() => {
    if (isOpen) {
      setTempLevel(initialLevel);
      setTempGrade(initialGrade);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialLevel, initialGrade]);

  const handleLevelChange = (level: Level) => {
    setTempLevel(level);
    if (tempGrade > level.years) {
      setTempGrade(1);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 transition-opacity" onClick={onClose} />

      <div className="fixed bottom-0 left-0 right-0 bg-white z-[60] rounded-t-2xl shadow-2xl transform transition-transform duration-300 max-w-md mx-auto overscroll-contain">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <button onClick={onClose} className="text-gray-500 text-sm px-2 py-1">取消</button>
          <span className="font-bold text-gray-800">选择年级</span>
          <button
            onClick={() => onConfirm(tempLevel, tempGrade)}
            className="text-blue-600 font-bold text-sm px-2 py-1"
          >
            确定
          </button>
        </div>

        <div className="flex h-64">
          <div className="flex-1 overflow-y-auto border-r border-gray-50 scrollbar-hide touch-pan-y">
            <div className="py-2">
              {levels.map((level) => (
                <div
                  key={level.name}
                  onClick={() => handleLevelChange(level)}
                  className={`py-3 text-center text-sm cursor-pointer transition-colors ${
                    tempLevel.name === level.name ? 'text-blue-600 font-bold bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {level.name}
                </div>
              ))}
              <div className="h-8" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide touch-pan-y">
            <div className="py-2">
              {Array.from({ length: tempLevel.years }).map((_, index) => {
                const gradeNum = index + 1;
                return (
                  <div
                    key={gradeNum}
                    onClick={() => setTempGrade(gradeNum)}
                    className={`py-3 text-center text-sm cursor-pointer transition-colors ${
                      tempGrade === gradeNum ? 'text-blue-600 font-bold bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {toChineseNum(gradeNum)}年级
                  </div>
                );
              })}
              <div className="h-8" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GradePicker;