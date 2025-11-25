import api from './axios';
import {EssayData} from '../types'

// 获取作文分析报告数据
// 假设后端接口为 GET /api/essay_analysis (或者根据实际 ID 获取)
export const getEssayAnalysis = (id?: string) => {
    const url = id ? `/api/essay_analysis/${id}` : '/api/essay_analysis/latest';
    return api.get<any, EssayData>(url);
};

/**
 * 提交作文/照片进行分析
 * @param text 作文文本内容（可选）
 * @param files 照片文件数组（可选，只允许图片类型），可以传入 File[] 或 FileList
 * @returns 分析结果
 */
export const submitEssay = async (text?: string, files?: File[] | FileList): Promise<any> => {
    // 必须至少提供文本或文件
    const fileCount = files ? (Array.isArray(files) ? files.length : files.length) : 0;
    if (!text && fileCount === 0) {
        throw new Error('必须提供文本或图片文件');
    }

    // 单张图片大小限制 10MB
    const MAX_SIZE = 10 * 1024 * 1024;

    // 校验每个文件（如果有）
    if (fileCount > 0) {
        const fileArray: File[] = Array.isArray(files) ? files : Array.from(files);
        for (const file of fileArray) {
            if (!file || !file.type || !file.type.startsWith('image/')) {
                throw new Error('只能上传图片文件（image/*）');
            }
            if (file.size > MAX_SIZE) {
                throw new Error('单张图片大小不能超过 10MB');
            }
        }
    }

    const formData = new FormData();

    if (text) {
        formData.append('text', text);
    }

    if (fileCount > 0) {
        const fileArray: File[] = Array.isArray(files) ? files : Array.from(files);
        // 根据后端期望字段名调整下面的 key：'photo' / 'photos' / 'photo[]' 等
        // 这里使用重复的 'photo' 字段以兼容多数后端文件数组接收方式
        for (const file of fileArray) {
            formData.append('photo', file);
        }
    }

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
            // 注意：不要手动设置 Content-Type，fetch 会自动处理 multipart/form-data boundary
        });

        if (!response.ok) {
            throw new Error(`上传失败: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('提交图片/作文出错:', error);
        throw error;
    }
};