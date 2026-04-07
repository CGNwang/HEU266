/**
 * 问卷数据服务层
 *
 * 目前使用 localStorage 实现数据持久化
 * 后续对接真实后端时，只需替换以下方法即可：
 * 1. 将 localStorage 替换为 API 调用
 * 2. 保持相同的函数签名和返回格式
 *
 * 后端 API 设计参考：
 * POST /api/questionnaire/save    - 保存问卷
 * GET  /api/questionnaire/load    - 加载问卷
 * DELETE /api/questionnaire/clear - 清除保存的问卷
 */

const STORAGE_KEY = 'stitch_o_match_questionnaire';

/**
 * 问卷答案数据结构
 * 后续后端可沿用此结构，或进行扩展
 */
export interface QuestionnaireAnswer {
  module1?: {
    gender: string;
    expectedGender: string;
    stage: string;
    partnerStages: string[];
    locations: string[];
  };
  module2?: {
    q1Schedule: string;
    q1Attitude: string;
    q2Space: string;
    q2Tolerance: string;
    q3Frequency: string;
    q3Bottomline: string;
    q4Smoking: string;
    q4Bottomline: string;
    q5Alcohol: string;
    q5Bottomline: string;
  };
  module3?: {
    q1Slider: number;
    q1Preference: string;
    q2Slider: number;
    q2Preference: string;
    q3Slider: number;
    q3Preference: string;
    q4Slider: number;
    q4Preference: string;
    q5Slider: number;
    q5Preference: string;
    q6Slider: number;
    q6Preference: string;
    q7Slider: number;
    q7Preference: string;
    q8Slider: number;
    q8Preference: string;
    q9Slider: number;
    q9Preference: string;
    q10Slider: number;
    q10Preference: string;
  };
  module4?: {
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    q5: string;
    q6: string;
  };
  module5?: {
    q1: string;
    q2: string[];
    q3: string;
    q4: string;
    q5: string;
    q6: string;
    q7: string[];
  };
  savedAt?: number; // 保存时间戳
}

/**
 * 保存问卷答案
 *
 * @param data 问卷答案数据
 * @returns Promise<void>
 *
 * 后端对接示例:
 * ```typescript
 * const saveQuestionnaire = async (data: QuestionnaireAnswer) => {
 *   const response = await fetch('/api/questionnaire/save', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(data)
 *   });
 *   if (!response.ok) throw new Error('保存失败');
 * };
 * ```
 */
export const saveQuestionnaire = async (data: QuestionnaireAnswer): Promise<void> => {
  // TODO: 对接后端 API
  // const response = await fetch('/api/questionnaire/save', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ ...data, savedAt: Date.now() })
  // });

  // 当前使用 localStorage 实现
  const existingData = loadQuestionnaire();
  const mergedData = {
    ...existingData,
    ...data,
    savedAt: Date.now(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));

  console.log('问卷已保存 (localStorage)', mergedData);
};

/**
 * 加载已保存的问卷答案
 *
 * @returns Promise<QuestionnaireAnswer | null> 返回保存的数据，若无则返回 null
 *
 * 后端对接示例:
 * ```typescript
 * const loadQuestionnaire = async (): Promise<QuestionnaireAnswer | null> => {
 *   const response = await fetch('/api/questionnaire/load');
 *   if (response.status === 404) return null;
 *   return response.json();
 * };
 * ```
 */
export const loadQuestionnaire = async (): Promise<QuestionnaireAnswer | null> => {
  // TODO: 对接后端 API
  // const response = await fetch('/api/questionnaire/load');
  // if (!response.ok) return null;
  // return response.json();

  // 当前使用 localStorage 实现
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

/**
 * 清除已保存的问卷答案
 *
 * @returns Promise<void>
 *
 * 后端对接示例:
 * ```typescript
 * const clearQuestionnaire = async (): Promise<void> => {
 *   await fetch('/api/questionnaire/clear', { method: 'DELETE' });
 * };
 * ```
 */
export const clearQuestionnaire = async (): Promise<void> => {
  // TODO: 对接后端 API
  // await fetch('/api/questionnaire/clear', { method: 'DELETE' });

  // 当前使用 localStorage 实现
  localStorage.removeItem(STORAGE_KEY);
  console.log('问卷数据已清除');
};

/**
 * 获取保存状态信息
 *
 * @returns 字符串，包含保存时间和完成进度
 */
export const getSaveStatus = (): string => {
  const data = loadQuestionnaire();
  if (!data?.savedAt) return '';

  const date = new Date(data.savedAt);
  const timeStr = `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;

  // 计算完成进度（简单估算）
  let completed = 0;
  if (data.module1) completed += 5;
  if (data.module2) completed += 5;
  if (data.module3) completed += 10;
  if (data.module4) completed += 6;
  if (data.module5) completed += 7;

  return `上次保存: ${timeStr} (${completed}/33题)`;
};