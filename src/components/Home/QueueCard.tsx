import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Loader2, Server } from "lucide-react";

import { ReviewTask } from "@/types/analysis";
import useReviewTasks from "@/hooks/useReviewTasks";
import { useAuth } from "@/context/AuthContext";

const MOCK_TASKS: ReviewTask[] = [
  { id: "t1", title: "My School Life", status: "done", createdAt: "2025-11-01T08:30:00Z" },
  { id: "t2", title: "A Memorable Trip", status: "processing", createdAt: "2025-11-05T12:10:00Z" },
  { id: "t3", title: "The Influence of Technology", status: "done", createdAt: "2025-11-10T09:45:00Z" },
  { id: "t4", title: "City vs Countryside", status: "processing", createdAt: "2025-11-18T16:00:00Z" },
  { id: "t5", title: "Growing Up", status: "done", createdAt: "2025-11-20T10:00:00Z" },
  { id: "t6", title: "Summer Holiday", status: "processing", createdAt: "2025-11-21T09:00:00Z" },
  { id: "t7", title: "Environmental Protection", status: "done", createdAt: "2025-11-22T11:20:00Z" },
  { id: "t8", title: "A Letter to My Friend", status: "processing", createdAt: "2025-11-23T14:05:00Z" },
  { id: "t9", title: "Dreams and Ambitions", status: "done", createdAt: "2025-11-24T08:15:00Z" },
  { id: "t10", title: "The Best Day Ever", status: "processing", createdAt: "2025-11-25T07:30:00Z" },
];

const formatDate = (iso?: string) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
};

/**
 * QueueCard
 * - 方形卡片，无背景色
 * - 左侧 20%：图标 + 标题（可点击跳转）
 * - 右侧 70%：任务列表，最多显示 3 行，更多可滚动
 */
const QueueCard: React.FC = () => {
  const navigate = useNavigate();

  // 使用共享 Hook 获取任务（内部会使用 useAuth 获取 user.uid）
  const { tasks, loading, error } = useReviewTasks(MOCK_TASKS);

  // 每项近似高度（px），用于计算可见高度
  const ITEM_HEIGHT = 56;
  // 卡片一次性渲染并通过滚动可查看的最大项数
  const MAX_RENDER = 5;
  const visibleTasks = tasks.slice(0, MAX_RENDER);

  return (
    <div className="w-full rounded-xl border-2 border-gray-200 flex overflow-hidden items-stretch h-64">
      <div
        className="flex flex-col items-center justify-center p-3 cursor-pointer hover:bg-gray-50 h-full border-r-2 border-gray-300"
        style={{ flexBasis: "20%" }}
        onClick={() => navigate("/queue")}
        role="button"
        aria-label="打开批改队列"
      >
        <Server size={36} className="text-blue-600" />
        <div className="text-xs text-gray-600 mt-2 text-center">批改队列</div>
      </div>

      <div className="p-3 h-full flex flex-col" style={{ flexBasis: "70%" }}>
        <div className="text-sm font-medium text-gray-800 mb-2">最新任务</div>
        {/* 标题下的较醒目分割线 */}
        <div className="border-b-2 border-gray-200 mb-3" />

        {/* 显示区域固定为 3 项高度，初始可见 3 项，通过滚动最多查看 5 项 */}
        <div className="flex-1 overflow-y-auto" style={{ height: 3 * ITEM_HEIGHT }}>
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <Loader2 className="animate-spin text-blue-600" />
              <span className="ml-2 text-xs">正在加载...</span>
            </div>
          ) : error ? (
            <div className="text-red-500 text-sm p-2">加载失败：{error}</div>
          ) : (
            visibleTasks.map((t, idx) => (
              <div
                key={t.id}
                className={`flex items-center justify-between gap-3 py-3 ${idx < tasks.length - 1 ? "border-b" : ""} border-gray-200`}
                onClick={() => navigate(`/preview/${t.id}`)}
                role="button"
              >
                <div className="min-w-0">
                  <div className="text-sm text-gray-800 truncate">{t.title}</div>
                  <div className="text-[11px] text-gray-500">{formatDate(t.createdAt)}</div>
                </div>
                <div className="flex items-center gap-2">
                  {t.status === "done" ? (
                    <div className="flex items-center text-green-600 gap-1">
                      <CheckCircle size={16} />
                      <span className="text-xs">已完成</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-blue-600 gap-1">
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-xs">正在批改</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QueueCard;
