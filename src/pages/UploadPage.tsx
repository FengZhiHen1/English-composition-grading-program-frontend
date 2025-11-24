import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Image as ImageIcon, FileType, ArrowRight, Loader2 } from 'lucide-react';
import { submitEssay } from '../api/analysis';
import Header from '../components/Header'; // 确保路径正确

const UploadPage: React.FC = () => {
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }
    };

    const handleSubmit = async () => {
        if (!text && !file) {
            alert("请输入文字或上传文件");
            return;
        }

        try {
            setIsSubmitting(true);
            await submitEssay(text, file || undefined);
            navigate('/report');
        } catch (error) {
            console.error("提交失败:", error);
            alert("提交失败，请检查网络或稍后重试");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // 1. 布局容器：与 Home.tsx 保持一致的背景色和 flex 结构
        // 注意：外层的 max-w-md 已在 App.tsx 中全局配置，这里只需填充即可
        <div className="flex flex-col min-h-screen bg-gray-50">
            
            {/* 2. 顶部导航：启用返回按钮，设置标题 */}
            <Header showBack={true} title="提交作文" />

            {/* 3. 主要内容区域 */}
            <main className="flex-1 p-4 space-y-6">
                
                {/* 引导文案 (替代原来的黑色 Header Banner) */}
                <div className="px-1">
                    <h2 className="text-lg font-bold text-gray-800">开始智能批改</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        输入文字或上传图片/文档，AI 将为您生成深度评估报告。
                    </p>
                </div>

                {/* 输入区域容器：使用白色背景和圆角，增加层次感 */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
                    
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

                    {/* 文件上传 */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                            上传文件
                        </label>
                        <div className="relative group">
                            <input 
                                type="file" 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={handleFileChange}
                                accept=".txt,.doc,.docx,.pdf,image/*"
                            />
                            <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 transition-all ${
                                fileName 
                                    ? 'border-blue-400 bg-blue-50' 
                                    : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
                            }`}>
                                {fileName ? (
                                    <>
                                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                            <FileText size={20} />
                                        </div>
                                        <p className="text-gray-700 font-medium text-sm truncate max-w-[200px]">{fileName}</p>
                                        <p className="text-[10px] text-blue-500">点击更换</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex gap-3 text-gray-400 mb-1">
                                            <ImageIcon size={20} />
                                            <FileType size={20} />
                                            <Upload size={20} />
                                        </div>
                                        <p className="text-gray-600 font-medium text-sm">点击上传文件</p>
                                        <p className="text-[10px] text-gray-400">支持 PDF, Word, 图片</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 提交按钮 */}
                {/* 放在底部或内容下方，使用蓝色主色调 */}
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
            </main>
        </div>
    );
};

export default UploadPage;