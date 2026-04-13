import apiClient from './client';
import type { ApiResponse, ChatMessage, ChatSession, SendMessageRequest, PaginatedResponse } from '@/types';

// 聊天 API
export const chatApi = {
  // 获取当前匹配会话
  getCurrentSession: (matchId: string) =>
    apiClient.get<ApiResponse<ChatSession>>(`/chat/session/${matchId}`),

  // 获取聊天记录
  getMessages: (matchId: string, page = 1, pageSize = 20) =>
    apiClient.get<ApiResponse<PaginatedResponse<ChatMessage>>>(`/chat/messages/${matchId}`, {
      params: { page, pageSize },
    }),

  // 发送消息
  sendMessage: (data: SendMessageRequest) =>
    apiClient.post<ApiResponse<ChatMessage>>('/chat/send', data),

  // 标记消息为已读
  markAsRead: (matchId: string, messageId?: string) =>
    apiClient.post<ApiResponse<null>>(`/chat/read/${matchId}`, { messageId }),

  // 获取未读消息数
  getUnreadCount: () =>
    apiClient.get<ApiResponse<{ count: number }>>('/chat/unread-count'),

  // 获取建议回复
  getSuggestions: (matchId: string, lastMessage: string) =>
    apiClient.get<ApiResponse<{ suggestions: string[] }>>(`/chat/suggestions/${matchId}`, {
      params: { lastMessage },
    }),
};

export default chatApi;