import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 添加 Loader2 图标用于加载状态
import { Upload, FileText, Image as ImageIcon, FileType, ArrowRight, Loader2 } from 'lucide-react';
// 导入 API
import { submitEssay } from '../api/analysis';

const UploadPage: React.FC = () => {
    const navigate = useNavigate();
    const [text, setText] = useState('');
    // 新增：存储实际的文件对象
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    // 新增：提交加载状态
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]); // 保存文件对象
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
            // 调用 API 提交数据
            // 注意：这里假设 submitEssay 返回成功即可跳转，具体数据传递方式取决于你的架构
            // (例如：后端返回 ID，跳转到 /report/:id，或者后端存储在 session 中)
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
        <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-xl bg-white rounded-[2rem] shadow-xl overflow-hidden border border-stone-200">
                
                {/* Header */}
                <div className="bg-stone-900 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <h1 className="text-2xl font-serif font-bold relative z-10">提交作文</h1>
                    <p className="text-stone-400 text-sm mt-2 relative z-10">
                        输入文字或上传图片/文档，AI 将为您生成深度评估报告。
                    </p>
                </div>

                <div className="p-8 space-y-8">
                    
                    {/* Text Input Area */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-stone-700 uppercase tracking-wider">
                            直接输入
                        </label>
                        <textarea
                            className="w-full h-48 p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all text-stone-700 placeholder-stone-400"
                            placeholder="在这里输入您的英语作文..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        ></textarea>
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-stone-200"></div>
                        <span className="flex-shrink-0 mx-4 text-stone-400 text-xs uppercase tracking-widest">OR</span>
                        <div className="flex-grow border-t border-stone-200"></div>
                    </div>

                    {/* File Upload Area */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-stone-700 uppercase tracking-wider">
                            上传文件
                        </label>
                        <div className="relative group">
                            <input 
                                type="file" 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={handleFileChange}
                                accept=".txt,.doc,.docx,.pdf,image/*"
                            />
                            <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 flex flex-col items-center justify-center gap-3 group-hover:border-blue-400 group-hover:bg-blue-50 transition-all">
                                {fileName ? (
                                    <>
                                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                            <FileText size={24} />
                                        </div>
                                        <p className="text-stone-700 font-medium">{fileName}</p>
                                        <p className="text-xs text-stone-400">点击更换文件</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex gap-4 text-stone-400 mb-2">
                                            <ImageIcon size={24} />
                                            <FileType size={24} />
                                            <Upload size={24} />
                                        </div>
                                        <p className="text-stone-600 font-medium">点击或拖拽文件至此处</p>
                                        <p className="text-xs text-stone-400">支持 PDF, Word, 图片 (JPG/PNG)</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`w-full bg-stone-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 group ${
                            isSubmitting 
                                ? 'opacity-80 cursor-not-allowed' 
                                : 'hover:bg-stone-800 hover:shadow-xl transform hover:-translate-y-0.5'
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>正在智能分析...</span>
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
        </div>
    );
};

export default UploadPage;