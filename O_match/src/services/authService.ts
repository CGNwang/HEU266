import type { User } from '@/types';
import { useAuthStore } from '@/store/auth';
import { hasSupabaseConfig, supabase } from '@/lib/supabase';

const AUTH_STORAGE_KEY = 'stitch_o_match_auth';
const TOKEN_STORAGE_KEY = 'stitch_o_match_token';
const USER_STORAGE_KEY = 'stitch_o_match_user';
const INVALID_CREDENTIAL_MESSAGE = '账号或密码错误';

export interface LoginResult {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email?: string;
  nickname?: string;
}

export interface LoginData {
  username?: string;
  email?: string;
  password: string;
}

interface MockStoredUser {
  username: string;
  password: string;
  email?: string;
  nickname?: string;
}

const isInvalidCredentialError = (message?: string): boolean => {
  if (!message) return false;

  const normalized = message.toLowerCase();
  return (
    normalized.includes('invalid login credentials') ||
    normalized.includes('invalid credentials') ||
    normalized.includes('wrong password') ||
    normalized.includes('用户名或密码错误') ||
    normalized.includes('账号或密码错误') ||
    normalized.includes('密码错误') ||
    normalized.includes('用户不存在')
  );
};

const mapAuthUser = (authUser: {
  id: string;
  email?: string;
  created_at?: string;
  user_metadata?: Record<string, unknown>;
  email_confirmed_at?: string;
}): User => {
  const metadata = authUser.user_metadata ?? {};
  const nickname = typeof metadata.nickname === 'string'
    ? metadata.nickname
    : typeof metadata.username === 'string'
      ? metadata.username
      : undefined;

  return {
    id: authUser.id,
    email: authUser.email ?? '',
    nickname,
    createdAt: authUser.created_at ?? new Date().toISOString(),
    verified: Boolean(authUser.email_confirmed_at),
  };
};

const setClientAuth = (token: string, user: User) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  useAuthStore.getState().setAuth(token, user);
};

const clearClientAuth = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  useAuthStore.getState().logout();
};

const readMockUsers = (): MockStoredUser[] => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  return stored ? JSON.parse(stored) as MockStoredUser[] : [];
};

const fallbackRegister = async (data: RegisterData): Promise<LoginResult> => {
  const users = readMockUsers();

  if (users.find((u) => u.username === data.username)) {
    return { success: false, message: '用户名已存在' };
  }

  users.push({
    username: data.username,
    password: data.password,
    email: data.email,
    nickname: data.nickname,
  });
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));

  const newUser: User = {
    id: Date.now().toString(),
    email: data.email ?? `${data.username}@example.com`,
    nickname: data.nickname || data.username,
    createdAt: new Date().toISOString(),
    verified: false,
  };

  const token = btoa(JSON.stringify({
    userId: newUser.id,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  }));

  setClientAuth(token, newUser);
  return { success: true, user: newUser, token };
};

const fallbackLogin = async (data: LoginData): Promise<LoginResult> => {
  const users = readMockUsers();
  const user = users.find((u) => {
    if (data.email) {
      return u.email === data.email && u.password === data.password;
    }
    return u.username === data.username && u.password === data.password;
  });

  if (!user) {
    return { success: false, message: INVALID_CREDENTIAL_MESSAGE };
  }

  const loginUser: User = {
    id: Date.now().toString(),
    email: user.email ?? `${user.username}@example.com`,
    nickname: user.nickname || user.username,
    createdAt: new Date().toISOString(),
    verified: false,
  };

  const token = btoa(JSON.stringify({
    userId: loginUser.id,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  }));

  setClientAuth(token, loginUser);
  return { success: true, user: loginUser, token };
};

export const register = async (data: RegisterData): Promise<LoginResult> => {
  if (!hasSupabaseConfig || !supabase) {
    return fallbackRegister(data);
  }

  if (!data.email) {
    return { success: false, message: '请填写邮箱地址' };
  }

  const { data: signUpResult, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        username: data.username,
        nickname: data.nickname ?? data.username,
      },
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  if (!signUpResult.user) {
    return { success: false, message: '注册失败，请稍后重试' };
  }

  const user = mapAuthUser(signUpResult.user);
  const token = signUpResult.session?.access_token ?? '';

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  if (token) {
    setClientAuth(token, user);
  } else {
    useAuthStore.getState().setUser(user);
  }

  return {
    success: true,
    user,
    token,
    message: token ? '注册成功' : '注册成功，请前往邮箱完成验证',
  };
};

export const login = async (data: LoginData): Promise<LoginResult> => {
  if (!hasSupabaseConfig || !supabase) {
    return fallbackLogin(data);
  }

  const email = data.email;
  if (!email) {
    return { success: false, message: '请使用邮箱登录' };
  }

  const { data: signInResult, error } = await supabase.auth.signInWithPassword({
    email,
    password: data.password,
  });

  if (error) {
    if (isInvalidCredentialError(error.message)) {
      return { success: false, message: INVALID_CREDENTIAL_MESSAGE };
    }
    return { success: false, message: error.message };
  }

  if (!signInResult.user || !signInResult.session) {
    return { success: false, message: '登录失败，请稍后重试' };
  }

  const user = mapAuthUser(signInResult.user);
  const token = signInResult.session.access_token;
  setClientAuth(token, user);

  return { success: true, user, token };
};

export const logout = async (): Promise<void> => {
  if (hasSupabaseConfig && supabase) {
    await supabase.auth.signOut();
  }
  clearClientAuth();
};

export const getCurrentUser = async (): Promise<User | null> => {
  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      clearClientAuth();
      return null;
    }

    const user = mapAuthUser(data.user);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    useAuthStore.getState().setUser(user);
    return user;
  }

  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const userStr = localStorage.getItem(USER_STORAGE_KEY);

  if (!token || !userStr) {
    return null;
  }

  try {
    const tokenData = JSON.parse(atob(token)) as { exp: number };
    if (tokenData.exp < Date.now()) {
      clearClientAuth();
      return null;
    }
  } catch {
    clearClientAuth();
    return null;
  }

  return JSON.parse(userStr) as User;
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!token) {
    return false;
  }

  if (hasSupabaseConfig) {
    return true;
  }

  try {
    const tokenData = JSON.parse(atob(token)) as { exp: number };
    return tokenData.exp > Date.now();
  } catch {
    return false;
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};
