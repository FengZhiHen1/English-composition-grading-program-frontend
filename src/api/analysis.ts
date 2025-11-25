import http from '@/utils/index';
import { EssayData } from '@/types/analysis';

/**
 * 接口路径集合
 */
const api = {
  analysisBase: '/api/essay_analysis',
  upload: '/api/upload',
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
export const submitEssay = (text?: string, files?: File[] | FileList) => {
  const fileCount = files ? (Array.isArray(files) ? files.length : files.length) : 0;
  if (!text && fileCount === 0) {
    return Promise.reject(new Error('必须提供文本或图片文件'));
  }

  const MAX_SIZE = 10 * 1024 * 1024;
  if (fileCount > 0) {
    const fileArray: File[] = Array.isArray(files) ? files : Array.from(files);
    for (const file of fileArray) {
      if (!file || !file.type || !file.type.startsWith('image/')) {
        return Promise.reject(new Error('只能上传图片文件（image/*）'));
      }
      if (file.size > MAX_SIZE) {
        return Promise.reject(new Error('单张图片大小不能超过 10MB'));
      }
    }
  }

  const formData = new FormData();
  if (text) formData.append('text', text);
  if (fileCount > 0) {
    const fileArray: File[] = Array.isArray(files) ? files : Array.from(files);
    for (const file of fileArray) {
      // 根据后端约定调整字段名（photo / photos / file 等）
      formData.append('photo', file);
    }
  }

  // 使用项目的 http.post 封装（返回 Promise<CustomSuccessData<T>>）
  return http.post<any>(api.upload, formData);
};