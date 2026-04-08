-- ============================================================================
-- O-Match Supabase Row Level Security (RLS) Policies
-- 
-- 说明：这些策略确保用户只能访问他们被授权的数据。
-- ============================================================================

-- ============================================================================
-- 1. Profiles 表 RLS
-- ============================================================================

-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 策略1: 用户可以查看自己和匹配对象的资料
CREATE POLICY "profiles_select_self_or_match"
  ON profiles FOR SELECT
  USING (
    auth.uid() = id 
    OR EXISTS (
      SELECT 1 FROM matches 
      WHERE (user_a_id = auth.uid() AND user_b_id = profiles.id 
             AND status = 'matched')
             OR (user_b_id = auth.uid() AND user_a_id = profiles.id 
             AND status = 'matched')
    )
  );

-- 策略2: 用户只能更新自己的资料
CREATE POLICY "profiles_update_self"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 策略3: 注册时自动创建 profile（通过触发器在认证流程中完成）
CREATE POLICY "profiles_insert_self"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- 2. Privacy Settings 表 RLS
-- ============================================================================

ALTER TABLE privacy_settings ENABLE ROW LEVEL SECURITY;

-- 策略1: 用户只能查看自己的隐私设置
CREATE POLICY "privacy_settings_select_self"
  ON privacy_settings FOR SELECT
  USING (auth.uid() = user_id);

-- 策略2: 用户只能更新自己的隐私设置
CREATE POLICY "privacy_settings_update_self"
  ON privacy_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- 策略3: 用户只能插入自己的隐私设置
CREATE POLICY "privacy_settings_insert_self"
  ON privacy_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 3. Questionnaire Questions 表 RLS（公开题库，所有人可读）
-- ============================================================================

ALTER TABLE questionnaire_questions ENABLE ROW LEVEL SECURITY;

-- 策略: 所有认证用户都可查看题目
CREATE POLICY "questions_select_all"
  ON questionnaire_questions FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- 4. Questionnaire Answers 表 RLS
-- ============================================================================

ALTER TABLE questionnaire_answers ENABLE ROW LEVEL SECURITY;

-- 策略1: 用户只能查看自己的答案
CREATE POLICY "answers_select_self"
  ON questionnaire_answers FOR SELECT
  USING (auth.uid() = user_id);

-- 策略2: 用户只能插入自己的答案
CREATE POLICY "answers_insert_self"
  ON questionnaire_answers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 策略3: 用户只能更新自己的答案
CREATE POLICY "answers_update_self"
  ON questionnaire_answers FOR UPDATE
  USING (auth.uid() = user_id);

-- 策略4: 用户只能删除自己的答案
CREATE POLICY "answers_delete_self"
  ON questionnaire_answers FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 5. Match Pool 表 RLS
-- ============================================================================

ALTER TABLE match_pool ENABLE ROW LEVEL SECURITY;

-- 策略1: 用户只能查看自己的参与记录
CREATE POLICY "match_pool_select_self"
  ON match_pool FOR SELECT
  USING (auth.uid() = user_id);

-- 策略2: 用户只能加入自己
CREATE POLICY "match_pool_insert_self"
  ON match_pool FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 策略3: 用户只能删除自己的记录（退出匹配）
CREATE POLICY "match_pool_delete_self"
  ON match_pool FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 6. Matches 表 RLS
-- ============================================================================

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- 策略1: 匹配的两个用户可以查看该匹配记录
CREATE POLICY "matches_select_participants"
  ON matches FOR SELECT
  USING (
    auth.uid() = user_a_id 
    OR auth.uid() = user_b_id
  );

-- 策略2: 只有系统（Edge Function）可以插入新匹配
-- 注：需要在 Edge Function 中使用 service_role 密钥
CREATE POLICY "matches_insert_service"
  ON matches FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role'
  );

-- 策略3: 只有系统可以更新匹配状态
CREATE POLICY "matches_update_service"
  ON matches FOR UPDATE
  USING (auth.role() = 'service_role');

-- ============================================================================
-- 7. Match Reports 表 RLS
-- ============================================================================

ALTER TABLE match_reports ENABLE ROW LEVEL SECURITY;

-- 策略: 只有参与该匹配的用户才能查看报告
CREATE POLICY "match_reports_select_participants"
  ON match_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = match_reports.match_id
      AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
    )
  );

-- ============================================================================
-- 8. Chat Messages 表 RLS
-- ============================================================================

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 策略1: 只有参与该匹配的用户可以查看消息
CREATE POLICY "chat_messages_select_participants"
  ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = chat_messages.match_id
      AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
    )
  );

-- 策略2: 用户可以发送消息到自己参与的匹配
CREATE POLICY "chat_messages_insert_self"
  ON chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = chat_messages.match_id
      AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
    )
  );

-- 策略3: 用户可以标记自己的消息为已读（通过 chat_read_state）
CREATE POLICY "chat_messages_update_read_for_others"
  ON chat_messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = chat_messages.match_id
      AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
      AND chat_messages.sender_id != auth.uid()
    )
  );

-- ============================================================================
-- 9. Chat Read State 表 RLS
-- ============================================================================

ALTER TABLE chat_read_state ENABLE ROW LEVEL SECURITY;

-- 策略1: 用户只能查看自己的已读状态
CREATE POLICY "chat_read_state_select_self"
  ON chat_read_state FOR SELECT
  USING (auth.uid() = user_id);

-- 策略2: 用户只能更新自己的已读状态
CREATE POLICY "chat_read_state_insert_self"
  ON chat_read_state FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 策略3: 用户只能更新自己的已读状态
CREATE POLICY "chat_read_state_update_self"
  ON chat_read_state FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 10. Questionnaire Modules 表 RLS（公开题库，所有人可读）
-- ============================================================================

ALTER TABLE questionnaire_modules ENABLE ROW LEVEL SECURITY;

-- 策略: 所有认证用户都可查看模块
CREATE POLICY "modules_select_all"
  ON questionnaire_modules FOR SELECT
  USING (auth.role() = 'authenticated');
