import apiClient from './client';
import type { ApiResponse, Match, JoinMatchRequest } from '@/types';

// 匹配 API
export const matchApi = {
  // 获取本周匹配状态
  getCurrentMatch: () =>
    apiClient.get<ApiResponse<{ match: Match | null; nextMatchTime: string }>>('/match/current'),

  // 参与本周匹配
  joinMatch: (data: JoinMatchRequest) =>
    apiClient.post<ApiResponse<null>>('/match/join', data),

  // 取消参与匹配
  cancelMatch: () =>
    apiClient.delete<ApiResponse<null>>('/match/join'),

  // 获取匹配结果（如果已匹配）
  getMatchResult: () =>
    apiClient.get<ApiResponse<Match>>('/match/result'),

  // 获取匹配历史
  getMatchHistory: (page = 1, pageSize = 10) =>
    apiClient.get<ApiResponse<{ list: Match[]; total: number }>>('/match/history', {
      params: { page, pageSize },
    }),

  // 结束当前匹配（匹配成功后手动结束）
  endMatch: (matchId: string) =>
    apiClient.post<ApiResponse<null>>(`/match/${matchId}/end`),

  // 获取下次匹配时间
  getNextMatchTime: () =>
    apiClient.get<ApiResponse<{ time: string; weekday: string; hour: number }>>('/match/next-time'),
};

export default matchApi;