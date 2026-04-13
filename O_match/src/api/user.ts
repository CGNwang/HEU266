import apiClient from './client';
import type {
  ApiResponse,
  User,
  UserProfile,
  UpdateProfileRequest
} from '@/types';

// 用户 API
export const userApi = {
  // 获取当前用户信息
  getCurrentUser: () => apiClient.get<ApiResponse<User>>('/user/me'),

  // 获取用户资料
  getProfile: () => apiClient.get<ApiResponse<UserProfile>>('/user/profile'),

  // 更新用户资料
  updateProfile: (data: UpdateProfileRequest) =>
    apiClient.put<ApiResponse<UserProfile>>('/user/profile', data),

  // 上传头像
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post<ApiResponse<{ avatar: string }>>('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // 绑定微信
  bindWechat: (code: string) =>
    apiClient.post<ApiResponse<null>>('/user/bind-wechat', { code }),

  // 解绑微信
  unbindWechat: () =>
    apiClient.delete<ApiResponse<null>>('/user/bind-wechat'),

  // 获取隐私设置
  getPrivacySettings: () =>
    apiClient.get<ApiResponse<any>>('/user/privacy'),

  // 更新隐私设置
  updatePrivacySettings: (settings: any) =>
    apiClient.put<ApiResponse<any>>('/user/privacy', settings),
};

export default userApi;