# Supabase 后端开发指南

## 1. Supabase 项目初始化

### 1.1 创建项目
1. 访问 [supabase.com](https://supabase.com)
2. 登录或注册账户
3. 创建新项目
   - 项目名称：`o-match`
   - 数据库密码：设置强密码（记住）
   - 地区：选择最近的地区（推荐 `ap-southeast-1` 或 `ap-northeast-1`）
4. 等待项目初始化完成（约 2-3 分钟）

### 1.2 获取连接信息
项目创建后，在 **Settings** > **API** 中获取：
- `Project URL` → 填入 `VITE_SUPABASE_URL`
- `anon key` (public) → 填入 `VITE_SUPABASE_ANON_KEY`

将这两个值填入 `.env.development` 和 `.env.production`：

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 2. 数据库 Schema 初始化

### 2.1 在 Supabase 中执行 SQL
1. 进入 Supabase Dashboard
2. 左侧菜单 → **SQL Editor**
3. 点击 **New Query**
4. 复制 [database-schema.sql](./database-schema.sql) 的内容
5. 执行

### 2.2 验证表创建成功
1. 左侧菜单 → **Table Editor**
2. 应该看到以下表：
   - `profiles`
   - `questionnaire_modules`
   - `questionnaire_questions`
   - `questionnaire_answers`
   - `match_pool`
   - `matches`
   - `match_reports`
   - `chat_messages`
   - `chat_read_state`
   - `privacy_settings`

## 3. 行级别安全性 (RLS) 配置

### 3.1 启用 RLS
1. 左侧菜单 → **Authentication** > **Policies**
2. 或直接在 Table Editor 中为每个表点击 **Enable RLS**

### 3.2 应用 RLS 策略
执行 [database-rls.sql](./database-rls.sql) 中的所有策略语句。

策略清单：
- **Profiles**：用户只能读写自己的资料
- **Matches**：参与双方可见
- **ChatMessages**：只有匹配的两个用户可见
- **QuestionnaireAnswers**：用户只能读写自己的答案

## 4. 前端集成

### 4.1 安装 Supabase 包
```bash
npm install @supabase/supabase-js
```

### 4.2 配置环境变量
已自动创建的文件：
- `src/lib/supabase.ts` - Supabase 客户端初始化
- `.env` / `.env.development` / `.env.production` - 环境变量模板

只需填入密钥即可。

### 4.3 认证流程已支持两种模式
- **有 Supabase 配置**：自动使用 Supabase Auth
- **无 Supabase 配置**：回退到本地 localStorage 模拟（便于开发）

## 5. Edge Functions（匹配算法）

### 5.1 创建匹配函数
1. Supabase Dashboard → **Functions**
2. 点击 **Create a new function**
3. 选择 **Deno** 模板
4. 参考 [edge-functions/match-scheduler.ts](./edge-functions/match-scheduler.ts)

### 5.2 部署与配置
```bash
supabase functions deploy match-scheduler
```

### 5.3 配置 Cron 触发
在 Supabase 中设置定时任务：
- **函数名**：`match-scheduler`
- **Cron 表达式**：`0 20 * * FRI` （每周五晚 8 点）
- **时区**：UTC+8

## 6. 验证清单

- [ ] Supabase 项目已创建
- [ ] 项目 URL 和 API 密钥已添加到 `.env.development`
- [ ] 数据库表已创建（10 个表）
- [ ] RLS 策略已启用
- [ ] 前端依赖已安装
- [ ] 本地能够注册/登录（Supabase 或本地模拟）
- [ ] 用户资料能够正确加载和更新

## 7. 常见问题

**Q: 表创建失败，提示权限问题？**
A: 检查是否使用了 `postgres` 超级用户运行 SQL。Supabase 默认仅允许该角色创建表。

**Q: auth 表已经存在？**
A: Supabase 在项目创建时自动创建 `auth.users` 表。后续不要再创建。

**Q: RLS 策略应用后，无法读取数据？**
A: 检查是否正确获取了用户 UUID。登录后通过 `supabase.auth.getUser()` 获取。

**Q: Edge Function 如何测试？**
A: 在 Supabase Dashboard → **Functions** 中选择函数，点击 **Invoke** 测试。

## 8. 后续步骤

完成以上配置后，进行以下前端联调：

1. **认证链路**
   - [ ] 新用户注册并验证邮箱
   - [ ] 登录获取 token
   - [ ] 刷新页面，用户会话保持

2. **用户资料**
   - [ ] 完善个人信息
   - [ ] 上传头像到 Storage

3. **问卷**
   - [ ] 获取题目未实现，需后续开发
   - [ ] 分模块提交答案

4. **匹配**
   - [ ] 参与本周匹配
   - [ ] 等待 Cron 触发（手动触发用于快速测试）

5. **聊天**
   - [ ] 实时消息收发
   - [ ] 离线消息查询
   
详见 [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)
