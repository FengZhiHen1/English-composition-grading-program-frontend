import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 导入 hook 用于返回

import { MOCK_DATA } from "../constants";
import { EssayData } from "../types/analysis";
import { getEssayAnalysis } from "../api/analysis";

import ScoreOverview from "../components/AnalysisReport/ScoreOverview";
import AnnotatedEssay from "../components/AnalysisReport/AnnotatedEssay";
import AnalysisSection from "../components/AnalysisReport/AnalysisSection";
import RevisedComparison from "../components/AnalysisReport/RevisedComparison";

import { GraduationCap, Printer, ArrowLeft } from "lucide-react";

const AnalysisReport: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<EssayData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 开发阶段或显式开启 MOCK 时直接使用本地测试数据，避免网络请求
    const useMock =
      process.env.REACT_APP_USE_MOCK === "true" || process.env.NODE_ENV === "development";
    if (useMock) {
      setData(MOCK_DATA);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getEssayAnalysis();
        // 兼容两种返回：后端封装 { data: EssayData } 或 直接返回 EssayData
        const fetched: EssayData | undefined =
          res && typeof res === "object" && "data" in (res as any)
            ? (res as any).data
            : (res as any);
        if (!fetched) {
          throw new Error("接口未返回数据");
        }
        setData(fetched);
      } catch (err) {
        console.error("获取分析数据失败：", err);
        setError("获取分析数据失败，已使用本地示例数据");
        setData(MOCK_DATA);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

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

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 text-red-500">
        <p>{error || "未找到数据"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 py-0 md:py-8 flex justify-center font-sans text-gray-900">
      <div className="w-full max-w-xl bg-white shadow-2xl md:rounded-[2rem] overflow-hidden min-h-screen flex flex-col border border-stone-200/60 relative">
        {/* 顶部操作区 */}
        <div className="no-print absolute top-4 right-4 z-50 flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center w-10 h-10 bg-black/80 backdrop-blur text-white rounded-full shadow-lg hover:bg-black transition-all"
            title="导出 PDF / 打印"
          >
            <Printer size={18} />
          </button>
        </div>

        {/* 返回按钮 */}
        <div className="no-print absolute top-4 left-4 z-50">
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur text-stone-700 rounded-full shadow-lg hover:bg-white transition-all"
            title="返回首页"
          >
            <ArrowLeft size={18} />
          </button>
        </div>

        {/* 头部区域 */}
        <header className="bg-stone-900 text-white p-8 pb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6 opacity-80">
              <GraduationCap size={24} />
              <span className="text-xs font-bold tracking-[0.2em] uppercase">
                Smart Assessment
              </span>
            </div>
            <h1 className="text-3xl font-serif font-bold mb-2 leading-tight">
              英语作文
              <br />
              深度评估报告
            </h1>
            <div className="w-12 h-1 bg-blue-500 mt-4 mb-6"></div>

            <div className="flex justify-between items-end text-sm text-stone-400">
              <div>
                <p className="uppercase tracking-wider text-[10px] mb-1">
                  Generated
                </p>
                <p className="font-serif text-stone-200">
                  {new Date().toLocaleDateString("zh-CN")}
                </p>
              </div>
              <div className="text-right">
                <p className="uppercase tracking-wider text-[10px] mb-1">ID</p>
                <p className="font-mono text-stone-200">#8291-A</p>
              </div>
            </div>
          </div>
        </header>

        {/* 主要内容 */}
        <main className="flex-grow bg-white relative -mt-6 rounded-t-[2rem] px-6 pt-8 pb-12 space-y-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <section>
            <ScoreOverview evaluation={data.overall_evaluation} />
          </section>

          <div className="flex items-center gap-4 opacity-30">
            <div className="h-px bg-stone-900 flex-1"></div>
            <span className="font-serif italic text-xs">Section 01</span>
            <div className="h-px bg-stone-900 flex-1"></div>
          </div>

          <section>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                逐句精批与原文
              </h2>
              <p className="text-xs text-gray-400 uppercase tracking-widest">
                Detailed Annotations
              </p>
            </div>
            <AnnotatedEssay data={data} />
          </section>

          <div className="flex items-center gap-4 opacity-30">
            <div className="h-px bg-stone-900 flex-1"></div>
            <span className="font-serif italic text-xs">Section 02</span>
            <div className="h-px bg-stone-900 flex-1"></div>
          </div>

          <section>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                深度点评与拓展
              </h2>
              <p className="text-xs text-gray-400 uppercase tracking-widest">
                Deep Analysis
              </p>
            </div>
            <AnalysisSection data={data} />
          </section>

          <div className="flex items-center gap-4 opacity-30">
            <div className="h-px bg-stone-900 flex-1"></div>
            <span className="font-serif italic text-xs">Section 03</span>
            <div className="h-px bg-stone-900 flex-1"></div>
          </div>

          <section>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                高分范文润色
              </h2>
              <p className="text-xs text-gray-400 uppercase tracking-widest">
                Polished Revision
              </p>
            </div>
            <RevisedComparison revisedText={data.revised_text} />
          </section>
        </main>

        <footer className="bg-stone-50 p-8 text-center border-t border-stone-100">
          <div className="flex items-center justify-center gap-2 text-stone-400 mb-4">
            <div className="w-1 h-1 rounded-full bg-stone-300"></div>
            <div className="w-1 h-1 rounded-full bg-stone-300"></div>
            <div className="w-1 h-1 rounded-full bg-stone-300"></div>
          </div>
          <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em]">
            AI Intelligent Engine
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AnalysisReport;
