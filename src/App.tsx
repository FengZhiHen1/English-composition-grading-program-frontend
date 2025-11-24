/**
 * App 组件
 * 
 * 这是英语作文智能批改报告的主入口组件。
 * 它负责组装和渲染报告的各个部分，包括：
 * - 评分概览 (Score Overview)
 * - 逐句精批 (Annotated Essay)
 * - 深度点评与拓展 (Analysis Section)
 * - 高分范文润色 (Revised Comparison)
 * 
 * 页面布局设计为移动端友好，并针对打印/PDF导出进行了优化。
 */

// 导入 React 核心库
import React, { useState, useEffect } from 'react';

// 导入模拟数据（可作为加载失败的兜底或开发时的占位）
import { MOCK_DATA } from './constants';
import { EssayData } from './types';
import { getEssayAnalysis } from './api/analysis';

// 导入子组件
import ScoreOverview from './components/ScoreOverview';
import AnnotatedEssay from './components/AnnotatedEssay';
import AnalysisSection from './components/AnalysisSection';
import RevisedComparison from './components/RevisedComparison';

// 导入图标组件
import { GraduationCap, Printer, Share2 } from 'lucide-react';

const App: React.FC = () => {
    // 定义状态来存储数据、加载状态和错误信息
    const [data, setData] = useState<EssayData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 组件挂载时获取数据
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // 发送请求获取数据
                const result = await getEssayAnalysis();
                setData(result);
            } catch (err) {
                // console.error("Failed to fetch essay data:", err);
                // setError("无法加载报告数据，请检查网络连接。");
                
                // 【可选】如果后端未就绪，可以在这里使用 Mock 数据兜底，方便调试 UI
                setData(MOCK_DATA); 
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 调用浏览器原生的window.print()方法，实现打印 / 导出 PDF 功能。
    const handlePrint = () => {
        window.print();
    };

    // 加载中状态渲染
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-100 text-stone-500">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p>正在生成评估报告...</p>
                </div>
            </div>
        );
    }

    // 错误状态渲染
    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-100 text-red-500">
                <p>{error || "未找到数据"}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-100 py-0 md:py-8 flex justify-center font-sans text-gray-900">
            {/* Mobile / Long Image Container */}
            <div className="w-full max-w-xl bg-white shadow-2xl md:rounded-[2rem] overflow-hidden min-h-screen flex flex-col border border-stone-200/60">
                
                {/* 顶部操作区（打印按钮） */}
                <div className="no-print absolute top-4 right-4 z-50 flex gap-2">
                    <button 
                        onClick={handlePrint}
                        className="flex items-center justify-center w-10 h-10 bg-black/80 backdrop-blur text-white rounded-full shadow-lg hover:bg-black transition-all"
                        title="导出 PDF / 打印"
                    >
                        <Printer size={18} />
                    </button>
                </div>

                {/* 头部区域（报告标题与基本信息） */}
                <header className="bg-stone-900 text-white p-8 pb-12 relative overflow-hidden">
                    {/* 装饰性模糊圆形 */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
                    
                    <div className="relative z-10">
                        {/* 标题与标识 */}
                        <div className="flex items-center gap-3 mb-6 opacity-80">
                            <GraduationCap size={24} />
                            <span className="text-xs font-bold tracking-[0.2em] uppercase">Smart Assessment</span>
                        </div>
                        <h1 className="text-3xl font-serif font-bold mb-2 leading-tight">英语作文<br/>深度评估报告</h1>
                        {/* 蓝色短横线 */}
                        <div className="w-12 h-1 bg-blue-500 mt-4 mb-6"></div>

                        {/* 生成日期与报告ID */}
                        <div className="flex justify-between items-end text-sm text-stone-400">
                            <div>
                                <p className="uppercase tracking-wider text-[10px] mb-1">Generated</p>
                                <p className="font-serif text-stone-200">{new Date().toLocaleDateString('zh-CN')}</p>
                            </div>
                            <div className="text-right">
                                <p className="uppercase tracking-wider text-[10px] mb-1">ID</p>
                                <p className="font-mono text-stone-200">#8291-A</p>  {/* 报告 ID，之后应改为动态获取 */}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Stream */}
                <main className="flex-grow bg-white relative -mt-6 rounded-t-[2rem] px-6 pt-8 pb-12 space-y-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                    
                    {/* 1. Score Overview */}
                    <section>
                        {/* 使用 state 中的 data 替换 MOCK_DATA */}
                        <ScoreOverview evaluation={data.overall_evaluation} />
                    </section>

                    {/* Divider */}
                    <div className="flex items-center gap-4 opacity-30">
                        <div className="h-px bg-stone-900 flex-1"></div>
                        <span className="font-serif italic text-xs">Section 01</span>
                        <div className="h-px bg-stone-900 flex-1"></div>
                    </div>

                    {/* 2. Annotated Text */}
                    <section>
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-1">逐句精批与原文</h2>
                            <p className="text-xs text-gray-400 uppercase tracking-widest">Detailed Annotations</p>
                        </div>
                        {/* 使用 state 中的 data */}
                        <AnnotatedEssay data={data} />
                    </section>

                    {/* Divider */}
                    <div className="flex items-center gap-4 opacity-30">
                        <div className="h-px bg-stone-900 flex-1"></div>
                        <span className="font-serif italic text-xs">Section 02</span>
                        <div className="h-px bg-stone-900 flex-1"></div>
                    </div>

                    {/* 3. Deep Analysis */}
                    <section>
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-1">深度点评与拓展</h2>
                            <p className="text-xs text-gray-400 uppercase tracking-widest">Deep Analysis</p>
                        </div>
                        {/* 使用 state 中的 data */}
                        <AnalysisSection data={data} />
                    </section>

                    {/* Divider */}
                    <div className="flex items-center gap-4 opacity-30">
                        <div className="h-px bg-stone-900 flex-1"></div>
                        <span className="font-serif italic text-xs">Section 03</span>
                        <div className="h-px bg-stone-900 flex-1"></div>
                    </div>

                    {/* 4. Revised Text */}
                    <section>
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-1">高分范文润色</h2>
                            <p className="text-xs text-gray-400 uppercase tracking-widest">Polished Revision</p>
                        </div>
                        {/* 使用 state 中的 data */}
                        <RevisedComparison revisedText={data.revised_text} />
                    </section>
                </main>

                <footer className="bg-stone-50 p-8 text-center border-t border-stone-100">
                    <div className="flex items-center justify-center gap-2 text-stone-400 mb-4">
                        <div className="w-1 h-1 rounded-full bg-stone-300"></div>
                        <div className="w-1 h-1 rounded-full bg-stone-300"></div>
                        <div className="w-1 h-1 rounded-full bg-stone-300"></div>
                    </div>
                    <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em]">AI Intelligent Engine</p>
                </footer>
            </div>
        </div>
    );
};

export default App;