import apiClient from './client';
import type {
  ApiResponse,
  QuestionnaireModule,
  QuestionnaireAnswer,
  SubmitAnswerRequest
} from '@/types';

// 问卷 API
export const questionnaireApi = {
  // 获取所有问卷模块
  getModules: () =>
    apiClient.get<ApiResponse<QuestionnaireModule[]>>('/questionnaire/modules'),

  // 获取指定模块的问题
  getModuleQuestions: (moduleId: string) =>
    apiClient.get<ApiResponse<QuestionnaireModule>>(`/questionnaire/modules/${moduleId}`),

  // 提交问卷答案
  submitAnswers: (data: SubmitAnswerRequest) =>
    apiClient.post<ApiResponse<{ progress: number }>>('/questionnaire/submit', data),

  // 保存问卷进度（暂存）
  saveProgress: (moduleId: string, answers: QuestionnaireAnswer[]) =>
    apiClient.post<ApiResponse<null>>('/questionnaire/save', { moduleId, answers }),

  // 获取问卷进度
  getProgress: () =>
    apiClient.get<ApiResponse<{ completedModules: number; totalModules: number }>>('/questionnaire/progress'),

  // 重置问卷
  resetQuestionnaire: () =>
    apiClient.delete<ApiResponse<null>>('/questionnaire/reset'),
};

export default questionnaireApi;