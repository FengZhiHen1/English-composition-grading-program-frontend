import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { CheckCircle, Loader2 } from "lucide-react";

type TaskStatus = "done" | "processing";

interface ReviewTask {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: string; // ISO 时间字符串
}

// 模拟数据（无特定顺序）：组件渲染时会按时间排序，最新的任务排在上面（越早的任务排在下面）
const MOCK_TASKS: ReviewTask[] = [
  {
    id: "t1",
    title: "My School Life",
    status: "done",
    createdAt: "2025-11-01T08:30:00Z",
  },
  {
    id: "t2",
    title: "A Memorable Trip",
    status: "processing",
    createdAt: "2025-11-05T12:10:00Z",
  },
  {
    id: "t3",
    title: "The Influence of Technology",
    status: "done",
    createdAt: "2025-11-10T09:45:00Z",
  },
  {
    id: "t4",
    title: "City vs Countryside",
    status: "processing",
    createdAt: "2025-11-18T16:00:00Z",
  },
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

const QueuePage: React.FC = () => {
  const navigate = useNavigate();

  // 保证按时间降序（最新的任务排在上面，越早的任务排在下面）
  const tasks = useMemo(() => {
    return [...MOCK_TASKS].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="批改队列" showBack={true} />

      <main className="flex-1 p-4">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-800">批改队列</h2>
          <p className="text-sm text-gray-500 mt-1">
            下面是提交的批改任务列表。列表按任务生成时间排序，最新的任务排在上面（越早的任务排在下面）。点击任务可跳转至对应的预览页面（预览页面暂未实现）。
          </p>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/preview/${task.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter") navigate(`/preview/${task.id}`);
              }}
              className="cursor-pointer bg-white p-4 rounded-lg border border-gray-100 flex items-center justify-between hover:shadow-sm"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{task.title}</p>
                <p className="text-[12px] text-gray-400 mt-1">生成时间：{formatDate(task.createdAt)}</p>
              </div>

              <div className="flex items-center gap-3">
                {task.status === "done" ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle size={18} />
                    <span className="text-sm">已完成</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-sm">正在批改</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default QueuePage;
