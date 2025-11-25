import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { submitEssay } from '../api/analysis';
import Header from '../components/Header'; // 确保路径正确
import UploadImages from '../components/UploadPage/UploadImages';

const UploadPage: React.FC = () => {
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mode, setMode] = useState<'direct' | 'context'>('direct'); // 默认：直接批改

    const handleSubmit = async () => {
        if (!text && files.length === 0) {
            alert("请输入文字或上传图片");
            return;
        }

        try {
            setIsSubmitting(true);
            await submitEssay(text || undefined, files.length > 0 ? files : undefined);
            navigate('/report');
        } catch (error) {
            console.error("提交失败:", error);
            alert("提交失败，请检查网络或稍后重试");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header showBack={true} title="提交作文" />

            <main className="flex-1 p-4 pb-28 space-y-6">
                
                <div className="px-1">
                    <h2 className="text-lg font-bold text-gray-800">开始智能批改</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        输入文字或上传图片，AI 将为您生成深度评估报告。
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
                    
                    {/* 新增：选择模式（下拉框，放在输入框之前） */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                            选择模式
                        </label>
                        <div>
                            <select
                                value={mode}
                                onChange={(e) => setMode(e.target.value as 'direct' | 'context')}
                                className="w-40 py-2 px-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="direct">直接批改</option>
                                <option value="context">上下文批改</option>
                            </select>
                            <p className="text-[11px] text-gray-400 mt-2">上下文批改为可选模式，当前为预留选项。</p>
                        </div>
                    </div>

                    {/* 文本输入 */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                            直接输入
                        </label>
                        <textarea
                            className="w-full h-40 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all text-gray-700 placeholder-gray-400 text-sm leading-relaxed"
                            placeholder="在这里输入您的英语作文..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        ></textarea>
                    </div>

                    {/* 分割线 */}
                    <div className="relative flex items-center py-1">
                        <div className="flex-grow border-t border-gray-100"></div>
                        <span className="flex-shrink-0 mx-3 text-gray-300 text-[10px] uppercase tracking-widest">OR</span>
                        <div className="flex-grow border-t border-gray-100"></div>
                    </div>

                    {/* 图片上传（支持多张图片） */}
                    <UploadImages files={files} setFiles={setFiles} />
                </div>
            </main>

            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 p-4 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-95 ${
                        isSubmitting 
                            ? 'bg-blue-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                    }`}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>正在分析...</span>
                        </>
                    ) : (
                        <>
                            <span>开始智能批改</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default UploadPage;