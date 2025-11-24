import React from 'react';
import { MOCK_DATA } from './constants';
import ScoreOverview from './components/ScoreOverview';
import AnnotatedEssay from './components/AnnotatedEssay';
import AnalysisSection from './components/AnalysisSection';
import RevisedComparison from './components/RevisedComparison';
import { GraduationCap, Printer, Share2 } from 'lucide-react';

const App: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-100 py-0 md:py-8 flex justify-center font-sans text-gray-900">
      {/* Mobile / Long Image Container */}
      <div className="w-full max-w-xl bg-white shadow-2xl md:rounded-[2rem] overflow-hidden min-h-screen flex flex-col border border-stone-200/60">
        
        {/* Top Actions (Floating for web, hidden in print) */}
        <div className="no-print absolute top-4 right-4 z-50 flex gap-2">
            <button 
                onClick={handlePrint}
                className="flex items-center justify-center w-10 h-10 bg-black/80 backdrop-blur text-white rounded-full shadow-lg hover:bg-black transition-all"
                title="导出 PDF / 打印"
            >
                <Printer size={18} />
            </button>
        </div>

        {/* Hero Header */}
        <header className="bg-stone-900 text-white p-8 pb-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
             <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
             
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6 opacity-80">
                    <GraduationCap size={24} />
                    <span className="text-xs font-bold tracking-[0.2em] uppercase">Smart Assessment</span>
                </div>
                <h1 className="text-3xl font-serif font-bold mb-2 leading-tight">英语作文<br/>深度评估报告</h1>
                <div className="w-12 h-1 bg-blue-500 mt-4 mb-6"></div>
                <div className="flex justify-between items-end text-sm text-stone-400">
                    <div>
                        <p className="uppercase tracking-wider text-[10px] mb-1">Generated</p>
                        <p className="font-serif text-stone-200">{new Date().toLocaleDateString('zh-CN')}</p>
                    </div>
                    <div className="text-right">
                         <p className="uppercase tracking-wider text-[10px] mb-1">ID</p>
                         <p className="font-mono text-stone-200">#8291-A</p>
                    </div>
                </div>
             </div>
        </header>

        {/* Main Content Stream */}
        <main className="flex-grow bg-white relative -mt-6 rounded-t-[2rem] px-6 pt-8 pb-12 space-y-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            
            {/* 1. Score Overview */}
            <section>
                <ScoreOverview evaluation={MOCK_DATA.overall_evaluation} />
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
                <AnnotatedEssay data={MOCK_DATA} />
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
                <AnalysisSection data={MOCK_DATA} />
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
                <RevisedComparison revisedText={MOCK_DATA.revised_text} />
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