import apiClient from './client';
import type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  SendCodeRequest,
  User
} from '@/types';

// 认证 API
export const authApi = {
  // 登录
  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<{ token: string; user: User }>>('/auth/login', data),

  // 注册
  register: (data: RegisterRequest) =>
    apiClient.post<ApiResponse<{ token: string; user: User }>>('/auth/register', data),

  // 发送验证码
  sendCode: (data: SendCodeRequest) =>
    apiClient.post<ApiResponse<null>>('/auth/send-code', data),

  // 验证邮箱
  verifyEmail: (email: string) =>
    apiClient.get<ApiResponse<{ valid: boolean }>>(`/auth/verify-email/${email}`),

  // 登出
  logout: () => apiClient.post<ApiResponse<null>>('/auth/logout'),

  // 刷新 Token
  refreshToken: () =>
    apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh-token'),
};

export default authApi;