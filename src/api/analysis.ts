import http from "@/utils/index";
import { EssayData } from "@/types/analysis";
import { ReviewTask } from "@/types/analysis";

/**
 * 接口路径集合
 */
const api = {
  analysisBase: "/api/essay/essay_analysis",
  upload: "/api/essay/upload",
  reviewTasks: "/api/essay/review_tasks", // 新增：获取用户批改任务列表
};

/**
 * 获取作文分析报告数据
 * @param id 可选的分析 ID，未传时获取 latest
 */
export const getEssayAnalysis = (id?: string) => {
  const url = id ? `${api.analysisBase}/${id}` : `${api.analysisBase}/latest`;
  return http.get<EssayData>(url);
};

/**
 * 提交照片（支持多张）或文本进行分析
 * @param text 可选的作文文本
 * @param files 可选的图片数组或 FileList（仅 image/*，单张 <= 10MB）
 * @returns 后端响应（通过项目 http 封装返回）
 */
export const submitEssay = (
  text?: string,
  files?: File[] | FileList,
  onUploadProgress?: (ev: ProgressEvent) => void,
) => {
  // 支持同时上传文字与多张图片。files 可为 File[] 或 FileList。
  const fileCount = files
    ? Array.isArray(files)
      ? files.length
      : files.length
    : 0;

  if (!text && fileCount === 0) {
    return Promise.reject(new Error("必须提供文本或图片文件"));
  }

  const MAX_SIZE = 10 * 1024 * 1024;
  if (fileCount > 0) {
    const fileArray: File[] = Array.isArray(files) ? files : Array.from(files);
    for (const file of fileArray) {
      if (!file || !file.type || !file.type.startsWith("image/")) {
        return Promise.reject(new Error("只能上传图片文件（image/*）"));
      }
      if (file.size > MAX_SIZE) {
        return Promise.reject(new Error("单张图片大小不能超过 10MB"));
      }
    }
  }

  const formData = new FormData();
  if (text) formData.append("text", text);
  if (fileCount > 0) {
    const fileArray: File[] = Array.isArray(files) ? files : Array.from(files);
    for (const file of fileArray) {
      // 与后端约定使用字段名 'photo[]'（数组形式），后端应使用 request.files.getlist('photo[]') 或等效方法接收多文件
      formData.append("photo[]", file);
    }
  }

  // 注意：不要手动设置 Content-Type，浏览器 / axios 会自动处理 multipart boundary。
  // 将上传进度回调传给 axios（通过 http.post 的第三个参数 config）
  const config = onUploadProgress ? { onUploadProgress } : undefined;

  // 返回后端 envelope（前端在调用处根据 code/success 进行判断）
  return http.post<any>(api.upload, formData, config as any);
};

/**
 * 获取指定用户的批改任务列表
 * 请求：GET /api/essay/review_tasks?user_id=xxx
 * 后端期望返回示例（envelope）：
 * {
 *   code: 0,
 *   message: "ok",
 *   data: [ { id, title, status, createdAt }, ... ]  // ReviewTask[]
 * }
 * 
 * 前端会把 userId 作为 query 参数 user_id 发送给后端。
 */
export const getReviewTasks = (userId?: string) => {
  const params = userId ? { user_id: userId } : undefined;
  // 返回原始响应，调用方按实际封装解析（下方 QueuePage 有兼容处理）
  return http.get<any>(api.reviewTasks, { params });
};
