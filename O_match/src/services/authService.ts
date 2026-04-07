/**
 * 认证服务层
 *
 * 目前使用 localStorage 实现用户身份管理
 * 后续对接真实后端时，只需替换以下方法即可
 *
 * 后端 API 设计参考：
 * POST /api/auth/register   - 用户注册
 * POST /api/auth/login      - 用户登录
 * POST /api/auth/logout     - 用户登出
 * GET  /api/auth/profile    - 获取用户信息
 * POST /api/auth/refresh    - 刷新 token
 */

const AUTH_STORAGE_KEY = 'stitch_o_match_auth';

/**
 * 用户信息结构
 */
export interface User {
  id: string;
  username: string;
  email?: string;
  nickname?: string;
  avatar?: string;
  createdAt: number;
}

/**
 * 登录返回结果
 */
export interface LoginResult {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

/**
 * 注册表单数据
 */
export interface RegisterData {
  username: string;
  password: string;
  email?: string;
  nickname?: string;
}

/**
 * 登录表单数据
 */
export interface LoginData {
  username: string;
  password: string;
}

/**
 * 用户注册
 *
 * @param data 注册信息
 * @returns Promise<LoginResult>
 *
 * 后端对接示例:
 * ```typescript
 * const register = async (data: RegisterData): Promise<LoginResult> => {
 *   const response = await fetch('/api/auth/register', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(data)
 *   });
 *   return response.json();
 * };
 * ```
 */
export const register = async (data: RegisterData): Promise<LoginResult> => {
  // TODO: 对接后端 API
  // const response = await fetch('/api/auth/register', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  // return response.json();

  // 当前使用 localStorage 模拟
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  const users: RegisterData[] = stored ? JSON.parse(stored) : [];

  // 检查用户名是否已存在
  if (users.find(u => u.username === data.username)) {
    return { success: false, message: '用户名已存在' };
  }

  // 保存新用户（密码存储仅为演示，实际应加密存储或仅存后端）
  users.push(data);
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));

  // 自动登录
  const newUser: User = {
    id: Date.now().toString(),
    username: data.username,
    nickname: data.nickname || data.username,
    createdAt: Date.now(),
  };

  // 模拟 token
  const token = btoa(JSON.stringify({ userId: newUser.id, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }));
  localStorage.setItem('stitch_o_match_token', token);
  localStorage.setItem('stitch_o_match_user', JSON.stringify(newUser));

  return { success: true, user: newUser, token };
};

/**
 * 用户登录
 *
 * @param data 登录信息
 * @returns Promise<LoginResult>
 *
 * 后端对接示例:
 * ```typescript
 * const login = async (data: LoginData): Promise<LoginResult> => {
 *   const response = await fetch('/api/auth/login', {
 *     method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(data)
 *   });
 *   return response.json();
 * };
 * ```
 */
export const login = async (data: LoginData): Promise<LoginResult> => {
  // TODO: 对接后端 API
  // const response = await fetch('/api/auth/login', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  // return response.json();

  // 当前使用 localStorage 模拟
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  const users: RegisterData[] = stored ? JSON.parse(stored) : [];

  const user = users.find(u => u.username === data.username && u.password === data.password);

  if (!user) {
    return { success: false, message: '用户名或密码错误' };
  }

  const loginUser: User = {
    id: Date.now().toString(),
    username: user.username,
    nickname: user.nickname || user.username,
    createdAt: Date.now(),
  };

  // 模拟 token
  const token = btoa(JSON.stringify({ userId: loginUser.id, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }));
  localStorage.setItem('stitch_o_match_token', token);
  localStorage.setItem('stitch_o_match_user', JSON.stringify(loginUser));

  return { success: true, user: loginUser, token };
};

/**
 * 用户登出
 *
 * @returns void
 *
 * 后端对接示例:
 * ```typescript
 * const logout = async (): Promise<void> => {
 *   await fetch('/api/auth/logout', { method: 'POST' });
 * };
 * ```
 */
export const logout = async (): Promise<void> => {
  // TODO: 对接后端 API
  // await fetch('/api/auth/logout', { method: 'POST' });

  // 当前使用 localStorage
  localStorage.removeItem('stitch_o_match_token');
  localStorage.removeItem('stitch_o_match_user');
};

/**
 * 获取当前登录用户
 *
 * @returns User | null
 *
 * 后端对接示例:
 * ```typescript
 * const getCurrentUser = async (): Promise<User | null> => {
 *   const response = await fetch('/api/auth/profile');
 *   if (response.status === 401) return null;
 *   return response.json();
 * };
 * ```
 */
export const getCurrentUser = async (): Promise<User | null> => {
  // TODO: 对接后端 API
  // const response = await fetch('/api/auth/profile');
  // if (!response.ok) return null;
  // return response.json();

  // 当前使用 localStorage
  const token = localStorage.getItem('stitch_o_match_token');
  const userStr = localStorage.getItem('stitch_o_match_user');

  if (!token || !userStr) return null;

  // 检查 token 是否过期
  try {
    const tokenData = JSON.parse(atob(token));
    if (tokenData.exp < Date.now()) {
      logout();
      return null;
    }
  } catch {
    return null;
  }

  return JSON.parse(userStr);
};

/**
 * 检查用户是否已登录
 *
 * @returns boolean
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('stitch_o_match_token');
  if (!token) return false;

  try {
    const tokenData = JSON.parse(atob(token));
    return tokenData.exp > Date.now();
  } catch {
    return false;
  }
};

/**
 * 获取访问 token
 *
 * @returns string | null
 */
export const getToken = (): string | null => {
  return localStorage.getItem('stitch_o_match_token');
};