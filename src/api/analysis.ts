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

// 提交作文进行评分
export const submitComposition = (data: GradingRequest) => {
  return api.post<any, GradingResponse>('/grade', data);
};

// 获取历史记录示例
export const getHistory = () => {
  return api.get('/history');
};

// 获取作文分析报告数据
// 假设后端接口为 GET /essay/analysis (或者根据实际 ID 获取)
export const getEssayAnalysis = (id?: string) => {
  const url = id ? `/essay/analysis/${id}` : '/essay/analysis/latest';
  return api.get<any, EssayData>(url);
};