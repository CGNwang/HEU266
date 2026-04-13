# 当前代码变更总结与后续步骤

## 变更清单

### ✅ 已完成的改动

#### 1. 环境配置
- [x] `src/lib/supabase.ts` - Supabase 客户端初始化（支持自动降级）
- [x] `src/vite-env.d.ts` - 环境变量类型定义扩展
- [x] `.env` / `.env.development` / `.env.production` - 添加 Supabase 配置项

#### 2. 认证服务重写
- [x] `src/services/authService.ts` - 完全重写，支持：
  - Supabase Auth（当配置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY 时）
  - 本地 localStorage 模拟（无配置时自动回退）
  - 邮箱注册/登录/登出/续期
  - 用户信息持久化

#### 3. 页面修复
- [x] `src/components/pages/LoginPage.tsx` - 修正 auth 参数传递（username + email）

#### 4. 文档生成
- [x] `docs/SUPABASE_SETUP.md` - Supabase 初始化完整指南
- [x] `docs/database-schema.sql` - 10 张数据库表的完整 schema
- [x] `docs/database-rls.sql` - 行级别安全策略脚本
- [x] `docs/edge-functions/match-scheduler.ts` - 周批量匹配 Edge Function 代码
- [x] `docs/FRONTEND_INTEGRATION.md` - 前端集成逐步指南

---

## 🚀 立即可执行的步骤（今天）

### 步骤 1：安装依赖

当前网络连接超时，但可以尝试以下方式：

**方式 A：使用 npm（推荐，网络恢复后）**
```bash
cd /Users/a123456/Desktop/Project/HEU266/O_match
npm install @supabase/supabase-js
```

**方式 B：使用 yarn**
```bash
cd /Users/a123456/Desktop/Project/HEU266/O_match
yarn add @supabase/supabase-js
```

**方式 C：手动下载并离线安装**
- 访问 https://www.npmjs.com/package/@supabase/supabase-js
- 下载 tarball
- 解压到 `node_modules/@supabase/supabase-js`

### 步骤 2：创建 Supabase 项目

访问 https://supabase.com 并按以下步骤操作：

1. **登录或注册**
2. **创建新项目**
   - 项目名称：`o-match`
   - 数据库密码：设置强密码
   - 地区：选择最近地区
3. **等待初始化完成**（约 2-3 分钟）
4. **获取 API 密钥**
   - 打开 **Settings** → **API**
   - 复制 `Project URL` → 填入 `VITE_SUPABASE_URL`
   - 复制 `anon key` → 填入 `VITE_SUPABASE_ANON_KEY`

### 步骤 3：初始化数据库

1. 打开 Supabase Dashboard
2. 左侧菜单 → **SQL Editor**
3. 点击 **New Query**
4. 复制 `/Users/a123456/Desktop/Project/HEU266/docs/database-schema.sql` 的内容
5. 执行

### 步骤 4：应用 RLS 策略

1. 新建一个 SQL Query
2. 复制 `/Users/a123456/Desktop/Project/HEU266/docs/database-rls.sql` 的内容
3. 执行

### 步骤 5：测试登录流程

1. 填入 `.env.development`：
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 打开 `http://localhost:5173`

4. 测试注册/登录：
   - 点击"注册"或"登录"
   - 填写邮箱和密码
   - 验证能否成功（可在 Supabase Dashboard → Authentication 中查看用户）

---

## 📋 后续实现任务（按优先级）

### 第一周：核心链路贯通

**优先级：High**

```
└─ 阶段二：用户资料与隐私设置
   ├─ 新建 src/services/userService.ts
   ├─ 实现 getProfile() / updateProfile() / uploadAvatar()
   ├─ 更新 src/store/user.ts （创建用户状态）
   └─ 联调 BindInfoPage / ProfilePage
```

所需文件：
- [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) 中的"阶段二：用户资料与绑定"章节

---

### 第二周：问卷与匹配

**优先级：High**

```
└─ 阶段三：问卷系统
   ├─ 新建 src/services/questionnaireService.ts
   ├─ 实现 getModules() / getModule(id) / submitAnswers() / getProgress()
   ├─ 更新 src/store/questionnaire.ts
   └─ 联调 Questionnaire 各模块页面

└─ 阶段四：匹配系统
   ├─ 新建 src/services/matchingService.ts
   ├─ 实现 joinMatch() / getStatus() / getResult()
   ├─ 更新 src/store/match.ts
   ├─ 部署 Edge Function: match-scheduler
   └─ 联调 Waiting / MatchSuccess / MatchFail / MatchReport 页面
```

---

### 第三周：实时聊天

**优先级：Medium**

```
└─ 阶段五：Realtime 聊天
   ├─ 新建 src/services/chatService.ts
   ├─ 实现 subscribeToMatch() / sendMessage() / getHistory() / markAsRead()
   ├─ 更新 src/store/chat.ts
   └─ 联调 ChatRoom 页面
```

---

## 🔍 当前代码逻辑流程

### 认证流程（已完成）

```
LoginPage.tsx
  ↓
  login({ email, password })
    ↓
  authService.ts
    ├─→ 有 Supabase 配置？
    │   ├─ Y → supabase.auth.signInWithPassword() → 返回 user + token
    │   └─ N → 本地 localStorage 验证 → 返回 mock user + token
    ↓
  setClientAuth(token, user)
    ├─→ localStorage.setItem()
    ├─→ useAuthStore.setAuth()
    └─→ useAuthStore.getState().setAuth()
  ↓
  navigate('/questionnaire')
```

### 无 Supabase 配置时的行为

当 `.env.development` 中 `VITE_SUPABASE_URL` 或 `VITE_SUPABASE_ANON_KEY` 为空时：
- `supabase/lib/supabase.ts` 中 `hasSupabaseConfig = false`
- 所有认证服务自動降级到本地 `localStorage` 实现
- **开发不中断**，可继续测试页面逻辑
- 数据全部存储在本地，刷新后清空

---

## ⚠️ 已知限制与待处理

### 当前阶段的限制

1. **问卷题目数据尚未接入**
   - database-schema.sql 中仅定义了 Module 1-3 的题目
   - Module 4-5 的题目需要后续补充

2. **匹配算法使用占位符**
   - edge-functions/match-scheduler.ts 中的 `calculateMatchScore()` 函数使用了简化算法
   - 实际投入使用前需要根据业务需求调整权重和策略

3. **聊天建议回复未实现**
   - ChatRoom 页面中的"AI 建议回复"功能留作后续
   - 需要接入 OpenAI/Anthropic API 在 Edge Function 中处理

4. **微信绑定/OAuth 未支持**
   - 当前仅支持邮箱注册/登录
   - 微信登录需要配置 OAuth 提供商（在 Supabase Auth 中）

---

## 📞 技术支持与文档

- **Supabase 官方文档**：https://supabase.com/docs
- **Supabase 客户端库（JS）**：https://github.com/supabase/supabase-js
- **本项目文档**：
  - [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Supabase 项目初始化
  - [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) - 前端分阶段实现指南
  - [database-schema.sql](./database-schema.sql) - 完整 DB schema
  - [database-rls.sql](./database-rls.sql) - RLS 安全策略
  - [edge-functions/match-scheduler.ts](./edge-functions/match-scheduler.ts) - 匹配函数

---

## ✅ 验收标准

### 开发环境（即刻）

- [ ] `npm install @supabase/supabase-js` 成功
- [ ] Supabase 项目已创建，密钥已配置
- [ ] 数据库 Schema 已初始化
- [ ] RLS 策略已应用
- [ ] 打开 `http://localhost:5173` 能完整走通 Register → Login

### 阶段一完成（本周）

- [ ] 用户资料 API 已实现
- [ ] 能上传头像到 Supabase Storage
- [ ] ProfilePage 能正确加载和保存用户信息

### 阶段二完成（下周）

- [ ] 问卷 API 已实现，能获取题目和提交答案
- [ ] 能参与匹配并看到倒计时
- [ ] Edge Function 能手动触发测试（手动运行 match-scheduler）

### 阶段三完成（下下周）

- [ ] Realtime 聊天能双向同步
- [ ] 消息实时显示，离线消息可补全

---

## 🎯 下一步行动

1. **立即**：安装 @supabase/supabase-js 包
2. **今日**：创建 Supabase 项目，初始化数据库
3. **明日**：测试登录流程
4. **本周**：实现用户资料服务
5. **下周**：实现问卷与匹配

详细步骤见 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) 和 [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)。
