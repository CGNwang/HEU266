# 前端与 Supabase 集成开发指南

## 1. 前置条件

- [x] Supabase 项目已创建
- [ ] 数据库 Schema 已初始化（database-schema.sql）
- [ ] RLS 策略已配置（database-rls.sql）
- [x] `.env.development` 已填入 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`
- [x] 已运行 `npm install @supabase/supabase-js`

## 2. 代码结构

```
O_match/src/
├── lib/
│   └── supabase.ts          # Supabase 客户端初始化
├── services/
│   ├── authService.ts       # 已完成：认证服务（支持 Supabase Auth）
│   ├── userService.ts       # TODO：用户资料服务
│   ├── questionnaireService.ts  # TODO：问卷服务
│   ├── matchingService.ts   # TODO：匹配服务
│   └── chatService.ts       # TODO：聊天服务（Realtime）
├── api/
│   └── user.ts              # 可删除或保留为适配层
├── store/
│   ├── auth.ts              # 已完成：认证状态
│   ├── user.ts              # TODO：用户资料状态
│   ├── questionnaire.ts     # TODO：问卷状态
│   ├── match.ts             # TODO：匹配状态
│   └── chat.ts              # TODO：聊天状态
└── types/
    └── index.ts             # 已有基础 types
```

## 3. 逐步实现计划

### 阶段一：认证流程（已完成）

**文件**：`src/services/authService.ts`

**功能**：
- ✅ 邮箱注册（`register()`）
- ✅ 邮箱登录（`login()`）
- ✅ 登出（`logout()`）
- ✅ 获取当前用户（`getCurrentUser()`）
- ✅ Token 管理（`getToken()`）

**测试步骤**：
1. 打开 `http://localhost:5173`
2. 点击"注册"
3. 填写邮箱、密码、确认密码
4. 进行邮箱验证（生产环境需要真实邮箱验证，开发可跳过）
5. 登录并验证能否正确跳转

**调试**：
- 如果显示"用户名已存在"等本地错误，说明未配置 Supabase 密钥，使用本地模拟
- 如果收到网络错误，检查 Supabase 密钥和网络连接

---

### 阶段二：用户资料与绑定

**文件**：新建 `src/services/userService.ts`

**功能目标**：
- 获取当前用户资料（`getProfile()`）
- 更新用户资料（`updateProfile()`）
- 上传头像（`uploadAvatar()`）
- 获取隐私设置（`getPrivacy()`）
- 更新隐私设置（`updatePrivacy()`）

**涉及页面**：
- `BindInfoPage.tsx` - 绑定微信/手机
- `ProfilePage.tsx` - 编辑资料、上传头像

**实现示例**：

```typescript
// src/services/userService.ts
import { supabase, hasSupabaseConfig } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import type { UserProfile, UpdateProfileRequest } from '@/types';

export const userService = {
  async getProfile(): Promise<UserProfile> {
    if (!hasSupabaseConfig || !supabase) {
      // 本地回退
      const user = useAuthStore.getState().user;
      return {
        userId: user?.id ?? '',
        gender: 'male',
        expectedGender: 'female',
        stage: 'undergrad_high',
        partnerStages: [],
        locations: [],
        completedModules: 0,
        questionnaireProgress: 0,
      };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(update: UpdateProfileRequest): Promise<UserProfile> {
    // 实现类似...
  },

  async uploadAvatar(file: File): Promise<string> {
    // 实现 Storage 上传...
  },
};
```

**测试**：
- [ ] 打开 ProfilePage，验证能否加载资料
- [ ] 编辑资料并保存，刷新后验证是否持久化
- [ ] 上传头像，验证能否在 Storage 中看到文件

---

### 阶段三：问卷系统

**文件**：新建 `src/services/questionnaireService.ts`

**功能目标**：
- 获取问卷模块列表（`getModules()`）
- 获取特定模块的题目（`getModule(id)`）
- 获取用户答题进度（`getProgress()`）
- 提交答案（`submitAnswers()`）
- 重置问卷（`resetQuestionnaire()`）

**涉及页面**：
- `QuestionnaireWrapper.tsx` - 问卷导航
- `QuestionnaireModule1-5.tsx` - 各模块答题

**实现示例**：

```typescript
// src/services/questionnaireService.ts
export const questionnaireService = {
  async getModules() {
    const { data, error } = await supabase
      .from('questionnaire_modules')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    return data;
  },

  async submitAnswers(moduleId: string, answers: QuestionnaireAnswer[]) {
    // 批量插入/更新答案...
    // 答案行为触发器自动更新 questionnaire_answers.updated_at
  },

  async getProgress() {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    // 统计已完成的模块数...
  },
};
```

**测试**：
- [ ] 打开 Questionnaire，验证能否加载题目
- [ ] 填写答案并提交，检查数据库中是否有新记录
- [ ] 刷新页面，验证进度是否保留
- [ ] 测试重置功能

---

### 阶段四：匹配系统

**文件**：新建 `src/services/matchingService.ts`

**功能目标**：
- 获取本周匹配状态（`getStatus()`）
- 参与匹配（`joinMatch()`）
- 取消参与（`cancelMatch()`）
- 获取匹配结果（`getResult()`）
- 获取匹配历史（`getHistory()`）

**涉及页面**：
- `WaitingPage.tsx` - 报名界面
- `MatchSuccessPage.tsx` / `MatchFailPage.tsx` - 结果展示
- `MatchReportPage.tsx` - 详细报告

**实现示例**：

```typescript
export const matchingService = {
  async joinMatch(weekTag: string) {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const { error } = await supabase
      .from('match_pool')
      .insert([{ user_id: userId, week_tag: weekTag }]);
    if (error) throw error;
  },

  async getResult(weekTag: string) {
    // 查询 matches 表中状态为 'matched' 或 'failed' 的记录...
  },
};
```

**测试**：
- [ ] 点击"参与本周匹配"，验证入池成功
- [ ] 手动触发 Edge Function 进行匹配（或等待下一个周五）
- [ ] 验证结果页能否正确渲染

---

### 阶段五：Realtime 聊天

**文件**：新建 `src/services/chatService.ts`

**功能目标**：
- 订阅聊天频道（`subscribeToMatch()`）
- 发送消息（`sendMessage()`）
- 获取历史消息（`getHistory()`）
- 标记已读（`markAsRead()`）

**涉及页面**：
- `ChatRoomPage.tsx` - 聊天界面

**实现示例**：

```typescript
export const chatService = {
  subscribeToMatch(matchId: string, callback: (msg: ChatMessage) => void) {
    return supabase
      .channel(`match_${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => callback(payload.new as ChatMessage)
      )
      .subscribe();
  },

  async sendMessage(matchId: string, content: string) {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const { error } = await supabase
      .from('chat_messages')
      .insert([{ match_id: matchId, sender_id: userId, content }]);
    if (error) throw error;
  },
};
```

**测试**：
- [ ] 打开聊天页面
- [ ] 从另一个浏览器模拟对方登录
- [ ] 验证消息实时同步
- [ ] 检查已读状态更新

---

## 4. 常见问题与调试

### Q: 登录后显示"未验证邮箱"

Supabase 默认需要邮箱验证。在开发环境可以：
1. 在 Supabase Dashboard → Authentication 中禁用"Email Confirmation"
2. 或直接在验证邮件中点击链接

### Q: 头像上传失败

1. 检查 Storage bucket 是否已创建：Dashboard → Storage
2. 检查 RLS 策略是否允许上传
3. 验证文件大小是否超过限制（默认 100MB）

### Q: Realtime 不工作

1. 确保在 Project Settings 中启用了 Realtime
2. 检查 RLS 是否阻止了对 chat_messages 的 SELECT 权限
3. 尝试在浏览器开发者工具 → Network 中查看 WebSocket 连接

### Q: 匹配结果一直是"待匹配"

1. 确保 Edge Function 已部署：`supabase functions deploy match-scheduler`
2. 手动测试函数：`supabase functions invoke match-scheduler --no-verify-jwt`
3. 检查函数日志了解具体错误

---

## 5. 部署检查清单

### 开发环境完成

- [ ] `.env.development` 已填入 Supabase 密钥
- [ ] `npm install @supabase/supabase-js` 成功
- [ ] `npm run dev` 启动无错
- [ ] 能够完整走通 Register → Login → Profile → Questionnaire

### 生产环境准备

- [ ] `.env.production` 已填入正式 Supabase 项目的密钥
- [ ] RLS 策略已充分测试（确保用户无法越权读取他人数据）
- [ ] Edge Function 已部署并通过测试
- [ ] 数据库备份策略已制定

---

## 6. 后续优化方向

1. **认证增强**：支持 OAuth（微信、QQ）
2. **问卷优化**：支持题目权重调整、相似度算法迭代
3. **匹配算法**：集成 ML 模型提升匹配准确率
4. **通知系统**：接入邮件/推送通知
5. **分析统计**：用户行为分析、匹配成功率统计
