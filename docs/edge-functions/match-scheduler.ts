/**
 * Supabase Edge Function: Match Scheduler
 * 
 * 目标：每周执行一次匹配任务
 * - 触发频率：每周五晚上 8 点 (Cron: 0 20 * * FRI)
 * - 实现功能：
 *   1. 查询本周 match_pool 中的所有用户
 *   2. 构建匹配候选对
 *   3. 计算匹配度
 *   4. 写入 matches 表
 *   5. 发送通知
 * 
 * 部署：supabase functions deploy match-scheduler
 * 测试：supabase functions invoke match-scheduler --no-verify-jwt
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

interface UserProfile {
  id: string;
  gender: string;
  stage: string;
  expected_gender: string;
  partner_stages: string[];
}

interface Questionnaire {
  user_id: string;
  module_id: string;
  answers: Record<string, unknown>;
}

interface MatchPair {
  user_a_id: string;
  user_b_id: string;
  score: number;
}

/**
 * 获取本周标签（YYYY-WW 格式）
 */
function getWeekTag(date = new Date()): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

/**
 * 计算两个用户的匹配度
 * 
 * 策略：
 * 1. 性别匹配检查
 * 2. 学段匹配检查
 * 3. 问卷答案相似度计算
 * 4. 加权求和得出最终分数
 */
async function calculateMatchScore(
  userA: UserProfile,
  userB: UserProfile,
  answersA: Questionnaire[],
  answersB: Questionnaire[]
): Promise<number> {
  // 1. 性别匹配检查 (30分)
  let genderScore = 0;
  if (userA.expected_gender === "both" || userB.expected_gender === "both") {
    genderScore = 30;
  } else if (
    userA.expected_gender === userB.gender &&
    userB.expected_gender === userA.gender
  ) {
    genderScore = 30;
  } else {
    return 0; // 性别不匹配，直接返回 0
  }

  // 2. 学段匹配检查 (20分)
  let stageScore = 0;
  if (userA.partner_stages.includes(userB.stage) &&
      userB.partner_stages.includes(userA.stage)) {
    stageScore = 20;
  } else if (userA.partner_stages.includes(userB.stage) ||
             userB.partner_stages.includes(userA.stage)) {
    stageScore = 10;
  } else {
    return 0; // 学段不匹配
  }

  // 3. 问卷答案相似度 (50分)
  // 简化算法：按模块匹配率取平均
  let questionnaireScore = 0;
  if (answersA.length > 0 && answersB.length > 0) {
    // TODO: 实现详细的答案相似度计算
    // 这里使用占位符，实际应根据问题类型和答案值计算
    questionnaireScore = 30; // 占位符
  }

  // 4. 总分 = genderScore + stageScore + questionnaireScore
  const totalScore = genderScore + stageScore + questionnaireScore;
  return Math.min(totalScore, 100);
}

/**
 * 匹配算法主函数
 */
async function runMatching(client: any, weekTag: string) {
  console.log(`Starting match scheduler for week: ${weekTag}`);

  try {
    // 1. 查询本周参与者池
    const { data: poolUsers, error: poolError } = await client
      .from("match_pool")
      .select("user_id")
      .eq("week_tag", weekTag);

    if (poolError) throw poolError;
    if (!poolUsers || poolUsers.length === 0) {
      console.log("No users in match pool this week");
      return { success: true, matches_created: 0 };
    }

    const userIds = (poolUsers as { user_id: string }[]).map((p) => p.user_id);
    console.log(`Pool size: ${userIds.length}`);

    // 2. 获取用户资料和问卷答案
    const { data: profiles, error: profileError } = await client
      .from("profiles")
      .select("*")
      .in("id", userIds);

    if (profileError) throw profileError;

    // 按用户ID索引资料
    const profileMap = Object.fromEntries(
      (profiles as UserProfile[]).map((p) => [p.id, p])
    );

    // 获取所有用户的问卷答案
    const { data: answers, error: answerError } = await client
      .from("questionnaire_answers")
      .select("user_id, module_id, answer_value")
      .in("user_id", userIds);

    if (answerError) throw answerError;

    // 按用户ID分组答案
    const answersByUser = new Map<string, Questionnaire[]>();
    (answers as any[]).forEach((ans) => {
      if (!answersByUser.has(ans.user_id)) {
        answersByUser.set(ans.user_id, []);
      }
      answersByUser.get(ans.user_id)!.push({
        user_id: ans.user_id,
        module_id: ans.module_id,
        answers: ans.answer_value,
      });
    });

    // 3. 构建匹配对并计算匹配度
    const matchPairs: MatchPair[] = [];
    const matchedUsers = new Set<string>();

    for (let i = 0; i < userIds.length; i++) {
      if (matchedUsers.has(userIds[i])) continue;

      const userA = profileMap[userIds[i]];
      if (!userA) continue;

      for (let j = i + 1; j < userIds.length; j++) {
        if (matchedUsers.has(userIds[j])) continue;

        const userB = profileMap[userIds[j]];
        if (!userB) continue;

        // 计算匹配度
        const score = await calculateMatchScore(
          userA,
          userB,
          answersByUser.get(userIds[i]) || [],
          answersByUser.get(userIds[j]) || []
        );

        if (score > 0) {
          matchPairs.push({
            user_a_id: userIds[i],
            user_b_id: userIds[j],
            score,
          });
          matchedUsers.add(userIds[i]);
          matchedUsers.add(userIds[j]);
          break; // 一个用户一周只能匹配一个
        }
      }
    }

    console.log(`Found ${matchPairs.length} match pairs`);

    // 4. 写入匹配结果
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 天后过期

    for (const pair of matchPairs) {
      const { error: insertError } = await client
        .from("matches")
        .insert([
          {
            user_a_id: pair.user_a_id,
            user_b_id: pair.user_b_id,
            match_rate: pair.score,
            week_tag: weekTag,
            status: "matched",
            expires_at: expiresAt.toISOString(),
          },
        ]);

      if (insertError) {
        console.error(`Failed to insert match:`, insertError);
      }
    }

    // 5. 处理未匹配的用户
    const unmatchedUsers = userIds.filter((id) => !matchedUsers.has(id));
    console.log(`Unmatched users: ${unmatchedUsers.length}`);

    for (const userId of unmatchedUsers) {
      // 记录失败原因（可选）
      // 可以在 matches 表中插入一条 status='failed' 的记录
    }

    // 6. 清空本周 match_pool（已处理）
    const { error: clearError } = await client
      .from("match_pool")
      .delete()
      .eq("week_tag", weekTag);

    if (clearError) {
      console.error("Failed to clear match pool:", clearError);
    }

    return {
      success: true,
      matches_created: matchPairs.length,
      unmatched_count: unmatchedUsers.length,
    };
  } catch (error) {
    console.error("Matching error:", error);
    throw error;
  }
}

serve(async (req) => {
  // 只允许 POST 请求
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // 初始化 Supabase 客户端（使用 service_role 密钥）
    const client = createClient(supabaseUrl!, supabaseServiceRoleKey!);

    // 获取本周标签
    const weekTag = getWeekTag();

    // 执行匹配
    const result = await runMatching(client, weekTag);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({
        error: (error as Error).message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
