/**
 * 匹配服务层
 *
 * 目前使用 localStorage 实现匹配状态管理
 * 后续对接真实后端时，只需替换以下方法即可
 *
 * 后端 API 设计参考：
 * POST /api/matching/join    - 参与本周匹配
 * GET  /api/matching/status   - 获取匹配状态
 * GET  /api/matching/result   - 获取匹配结果（每周三揭晓）
 */

const MATCHING_STORAGE_KEY = 'stitch_o_match_matching';

/**
 * 匹配状态
 */
export interface MatchingStatus {
  isJoined: boolean;       // 是否已参与本周匹配
  joinedAt?: number;       // 参与时间
  matchingId?: string;     // 匹配ID
  matchedUserId?: string;  // 匹配到的用户ID（如果有）
  resultRevealed: boolean;  // 结果是否已揭晓
}

/**
 * 参与本周匹配
 *
 * @returns Promise<MatchingStatus>
 *
 * 后端对接示例:
 * ```typescript
 * const joinMatching = async (): Promise<MatchingStatus> => {
 *   const response = await fetch('/api/matching/join', {
 *     method: 'POST',
 *     headers: {
 *       'Authorization': `Bearer ${getToken()}`,
 *       'Content-Type': 'application/json'
 *     }
 *   });
 *   return response.json();
 * };
 * ```
 */
export const joinMatching = async (): Promise<MatchingStatus> => {
  // TODO: 对接后端 API
  // const response = await fetch('/api/matching/join', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${getToken()}`,
  //   }
  // });
  // return response.json();

  // 当前使用 localStorage 模拟
  const status: MatchingStatus = {
    isJoined: true,
    joinedAt: Date.now(),
    resultRevealed: false,
  };

  localStorage.setItem(MATCHING_STORAGE_KEY, JSON.stringify(status));
  console.log('已参与本周匹配', status);

  return status;
};

/**
 * 获取匹配状态
 *
 * @returns Promise<MatchingStatus>
 *
 * 后端对接示例:
 * ```typescript
 * const getMatchingStatus = async (): Promise<MatchingStatus> => {
 *   const response = await fetch('/api/matching/status', {
 *     headers: {
 *       'Authorization': `Bearer ${getToken()}`,
 *     }
 *   });
 *   return response.json();
 * };
 * ```
 */
export const getMatchingStatus = async (): Promise<MatchingStatus | null> => {
  // TODO: 对接后端 API
  // const response = await fetch('/api/matching/status', {
  //   headers: {
  //     'Authorization': `Bearer ${getToken()}`,
  //   }
  // });
  // if (response.status === 404) return null;
  // return response.json();

  // 当前使用 localStorage 模拟
  const stored = localStorage.getItem(MATCHING_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

/**
 * 取消参与匹配
 *
 * @returns Promise<void>
 *
 * 后端对接示例:
 * ```typescript
 * const cancelMatching = async (): Promise<void> => {
 *   await fetch('/api/matching/cancel', {
 *     method: 'POST',
 *     headers: {
 *       'Authorization': `Bearer ${getToken()}`,
 *     }
 *   });
 * };
 * ```
 */
export const cancelMatching = async (): Promise<void> => {
  // TODO: 对接后端 API
  // await fetch('/api/matching/cancel', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${getToken()}`,
  //   }
  // });

  // 当前使用 localStorage 模拟
  localStorage.removeItem(MATCHING_STORAGE_KEY);
  console.log('已取消参与匹配');
};

/**
 * 获取匹配结果
 * 注意：仅在每周三 12:00 后可调用
 *
 * @returns Promise<{ matchedUser: User | null; message: string }>
 *
 * 后端对接示例:
 * ```typescript
 * const getMatchingResult = async (): Promise<{ matchedUser: User | null; message: string }> => {
 *   const response = await fetch('/api/matching/result', {
 *     headers: {
 *       'Authorization': `Bearer ${getToken()}`,
 *     }
 *   });
 *   return response.json();
 * };
 * ```
 */
export const getMatchingResult = async (): Promise<{ matchedUser: any | null; message: string }> => {
  // TODO: 对接后端 API
  // const response = await fetch('/api/matching/result', {
  //   headers: {
  //     'Authorization': `Bearer ${getToken()}`,
  //   }
  // });
  // return response.json();

  // 当前使用 localStorage 模拟（返回模拟结果）
  const status = await getMatchingStatus();

  if (!status?.isJoined) {
    return { matchedUser: null, message: '您尚未参与本周匹配' };
  }

  // 模拟匹配结果（实际应从后端获取）
  return {
    matchedUser: {
      id: 'matched_user_123',
      nickname: '灵魂伴侣',
      // 其他用户信息...
    },
    message: '匹配成功！'
  };
};

/**
 * 检查匹配结果并返回对应的路由路径
 * 后端匹配引擎给出结果后调用此函数决定跳转页面
 *
 * @returns Promise<string> 返回 '/match-success' 或 '/match-fail'
 *
 * 后端对接示例:
 * ```typescript
 * const checkMatchingResult = async (): Promise<string> => {
 *   const response = await fetch('/api/matching/result', {
 *     headers: {
 *       'Authorization': `Bearer ${getToken()}`,
 *     }
 *   });
 *   const data = await response.json();
 *   return data.matchedUser ? '/match-success' : '/match-fail';
 * };
 * ```
 */
export const checkMatchingResult = async (): Promise<string> => {
  // TODO: 对接后端 API
  // const response = await fetch('/api/matching/result', {
  //   headers: {
  //     'Authorization': `Bearer ${getToken()}`,
  //   }
  // });
  // const data = await response.json();
  // return data.matchedUser ? '/match-success' : '/match-fail';

  // 当前使用 localStorage 模拟
  // 模拟：随机返回成功或失败（实际应由后端判断）
  const result = await getMatchingResult();

  if (result.matchedUser) {
    // 保存匹配结果到本地
    const status = await getMatchingStatus();
    if (status) {
      status.matchedUserId = result.matchedUser.id;
      status.resultRevealed = true;
      localStorage.setItem(MATCHING_STORAGE_KEY, JSON.stringify(status));
    }
    return '/match-success';
  } else {
    return '/match-fail';
  }
};