import { useCallback, useEffect, useRef, useState } from "react";
import { ReviewTask } from "@/types/analysis";
import { getReviewTasks } from "@/api/analysis";
import { useAuth } from "@/context/AuthContext";

export type UseReviewTasksResult = {
  tasks: ReviewTask[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

// module-level cache & in-flight promise 去重
type CacheEntry = {
  data?: ReviewTask[];
  promise?: Promise<ReviewTask[]>;
  ts?: number;
};
const CACHE_TTL = 30 * 1000; // 30s 缓存 TTL，可按需调整
const cache = new Map<string, CacheEntry>();

export default function useReviewTasks(initialTasks: ReviewTask[] = []): UseReviewTasksResult {
  const { user } = useAuth();
  const userId = user?.uid ? String(user.uid) : "__anon";
  const cacheKey = `review_tasks:${userId}`;

  const [tasks, setTasks] = useState<ReviewTask[]>(
    () => [...initialTasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  const extractTasks = (res: any): ReviewTask[] => {
    if (!res) return [];
    if (Array.isArray(res.data?.data)) return res.data.data;
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data?.result)) return res.data.result;
    return [];
  };

  const fetchFromNetwork = async (): Promise<ReviewTask[]> => {
    const res = await getReviewTasks(userId === "__anon" ? undefined : userId);
    return extractTasks(res);
  };

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    // 检查缓存
    const entry = cache.get(cacheKey);
    const now = Date.now();
    if (entry?.data && now - (entry.ts || 0) < CACHE_TTL) {
      // 有有效缓存，直接使用
      if (mounted.current) {
        setTasks([...entry.data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setLoading(false);
      }
      return;
    }

    // 如果已有进行中的请求，复用 promise（去重）
    if (entry?.promise) {
      try {
        const list = await entry.promise;
        if (mounted.current) {
          setTasks([...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        }
        return;
      } catch (err: any) {
        if (mounted.current) {
          setError(err?.message || "获取批改任务失败");
          setTasks([...initialTasks]);
        }
        return;
      } finally {
        if (mounted.current) setLoading(false);
      }
    }

    // 发起新的请求并把 promise 存入 cache，其他挂载会复用该 promise
    const p = fetchFromNetwork()
      .then((list) => {
        cache.set(cacheKey, { data: list, ts: Date.now() });
        return list;
      })
      .catch((err) => {
        // 清除失败的 promise，保留 previous data 不覆盖
        const cur = cache.get(cacheKey);
        if (cur && cur.promise) {
          delete cur.promise;
          cache.set(cacheKey, cur);
        }
        throw err;
      });

    cache.set(cacheKey, { ...(cache.get(cacheKey) || {}), promise: p });

    try {
      const list = await p;
      if (mounted.current) {
        if (list.length > 0) {
          setTasks([...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } else {
          setTasks((prev) => (prev.length > 0 ? prev : [...initialTasks]));
        }
      }
    } catch (err: any) {
      console.error("获取批改任务失败:", err);
      if (mounted.current) {
        setError(err?.message || "获取批改任务失败");
        setTasks([...initialTasks]);
      }
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [cacheKey, initialTasks, userId]);

  useEffect(() => {
    mounted.current = true;
    fetchTasks();
    return () => {
      mounted.current = false;
    };
  }, [fetchTasks]);

  return { tasks, loading, error, refresh: fetchTasks };
}