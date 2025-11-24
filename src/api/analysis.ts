import api from './axios';
import {EssayData} from '../types'

// 定义请求参数和响应类型（根据实际后端接口定义）
export interface GradingRequest {
  text: string;
  topic?: string;
}

export interface GradingResponse {
  score: number;
  feedback: string;
  corrections: Array<{ original: string; correction: string }>;
}

// 获取作文分析报告数据
// 假设后端接口为 GET /api/essay_analysis (或者根据实际 ID 获取)
export const getEssayAnalysis = (id?: string) => {
  const url = id ? `/api/essay_analysis/${id}` : '/api/essay_analysis/latest';
  return api.get<any, EssayData>(url);
};

/**
 * 提交作文进行分析
 * @param text 作文文本内容 (可选)
 * @param file 作文文件 (可选)
 * @returns 分析结果
 */
export const submitEssay = async (text?: string, file?: File): Promise<any> => {
    const formData = new FormData();
    
    if (text) {
        formData.append('text', text);
    }
    
    if (file) {
        formData.append('file', file);
    }

    // 如果既没有文本也没有文件，抛出错误
    if (!text && !file) {
        throw new Error('必须提供文本或文件');
    }

    try {
        // 假设后端接口地址为 /api/upload
        // 请根据实际后端地址修改 URL
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
            // 注意：使用 FormData 时，fetch 会自动设置 Content-Type 为 multipart/form-data，
            // 不要手动设置 Content-Type 头，否则会导致 boundary 丢失
        });

        if (!response.ok) {
            throw new Error(`上传失败: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('提交作文出错:', error);
        throw error;
    }
};