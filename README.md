# HEU266｜HEU校园恋爱匹配交友项目「🍊意配 / O_match」

面向校园场景的慢社交匹配产品：通过深度问卷建模与匹配算法，为用户提供周期性（如每周一次）的匹配结果与匹配报告，减少左滑右滑的快餐式交友疲劳。

> 本仓库为前端为主的项目（React + TypeScript），前端工程位于 `O_match/`，后端使用 Supabase（BaaS）。

---

## 项目亮点（Features）

- **多维度问卷建模**：围绕价值观、生活习惯、人格等维度进行信息采集
- **匹配与报告**：输出契合度、雷达图/描述等数据化浪漫的结果展示
- **慢社交机制**：限制匹配频次、固定开奖时间，降低社交压力
- **Supabase 后端**：Auth 认证、PostgreSQL 数据库（含 RLS 安全策略）、Edge Function 周期匹配
- **前端技术栈**：React + TypeScript + Vite + TailwindCSS + React Router + Zustand + Axios

---

## 项目状态（Project Status）

- ✅ **前端工程**：可本地启动与预览，支持无后端的 localStorage 降级模式
- ✅ **Supabase 集成**：认证服务（邮箱注册/登录/登出）已接入，支持自动降级
- ✅ **数据库 Schema**：10 张表的完整定义与 RLS 策略脚本已就绪（见 `docs/`）
- ✅ **匹配 Edge Function**：周批量匹配调度函数已编写（`docs/edge-functions/`）
- 🚧 **用户资料服务**：待实现 `userService.ts`，联调 ProfilePage / BindInfoPage
- 🚧 **问卷与匹配服务**：待实现 `questionnaireService.ts` / `matchingService.ts`
- 🚧 **实时聊天**：待实现 `chatService.ts`，联调 ChatRoom 页面

---

## 仓库结构（Structure）

```
HEU266/
├── O_match/              # 主前端工程（React + TS + Vite）
│   ├── src/
│   │   ├── components/   # 页面与 UI 组件
│   │   ├── services/     # API 服务层（auth、user、questionnaire…）
│   │   ├── store/        # Zustand 状态管理
│   │   ├── lib/          # Supabase 客户端等基础库
│   │   └── hooks/        # 自定义 React Hooks
│   ├── .env              # 环境变量（Supabase URL / Key）
│   └── package.json
├── docs/                 # 技术文档与数据库脚本
│   ├── SUPABASE_SETUP.md         # Supabase 初始化指南
│   ├── FRONTEND_INTEGRATION.md   # 前端分阶段集成指南
│   ├── IMPLEMENTATION_SUMMARY.md # 当前变更总结与后续步骤
│   ├── QUESTIONNAIRE_DESIGN.md   # 问卷设计文档
│   ├── database-schema.sql       # 完整数据库 Schema
│   ├── database-rls.sql          # 行级安全策略脚本
│   └── edge-functions/
│       └── match-scheduler.ts    # 周期匹配 Edge Function
├── documents/            # 产品文档（项目计划、问卷设计、日志、UI稿）
└── Html静态预览版/        # HTML 静态原型预览
```

---

## 快速开始（Getting Started）

### 1) 环境要求

- Node.js 18+（推荐使用 LTS 版本）
- npm（本仓库已有 `package-lock.json`，更推荐 npm）

### 2) 安装依赖

```bash
cd O_match
npm install
```

### 3) 配置环境变量（可选）

编辑 `O_match/.env.development`，填入 Supabase 项目信息：

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> **不配置也可正常开发**：未填写时，认证服务自动降级为本地 localStorage 模拟模式。

### 4) 本地开发启动

```bash
npm run dev
```

启动后访问 `http://localhost:5173`。

### 5) 构建与预览

```bash
npm run build
npm run preview
```

---

## Supabase 后端配置（Backend Setup）

如需连接真实后端，请参考以下文档：

1. **[docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)**：创建 Supabase 项目、获取 API Key
2. **[docs/database-schema.sql](docs/database-schema.sql)**：在 SQL Editor 中执行以初始化数据库
3. **[docs/database-rls.sql](docs/database-rls.sql)**：执行行级安全策略
4. **[docs/FRONTEND_INTEGRATION.md](docs/FRONTEND_INTEGRATION.md)**：前端各阶段对接指南

---

## 技术栈（Tech Stack）

| 层级 | 技术 |
|------|------|
| 前端框架 | React 18 + TypeScript |
| 构建工具 | Vite |
| 样式 | Tailwind CSS |
| 路由 | React Router v6 |
| 状态管理 | Zustand |
| HTTP 请求 | Axios |
| 后端服务 | Supabase（Auth + PostgreSQL + Edge Functions） |
| 接口模拟 | MSW（Mock Service Worker） |

---

## 开发约定（Development）

```bash
# 代码检查
cd O_match
npm run lint
```

建议在提交前运行 lint，保持代码风格一致。

---

## Roadmap

- [x] 认证服务（邮箱注册/登录）+ Supabase Auth 集成
- [x] 数据库 Schema 设计（10 张表）+ RLS 安全策略
- [x] 周期匹配 Edge Function（match-scheduler）
- [ ] 用户资料服务（getProfile / updateProfile / uploadAvatar）
- [ ] 问卷引擎（动态题目、权重、相似/互补倾向）
- [ ] 匹配引擎（打分 + 稳定匹配/最大权匹配）
- [ ] 匹配报告（契合度、百分位、雷达图）
- [ ] 通知机制（固定开奖时间、站内/短信推送等）
- [ ] 实时聊天室（72 小时限时、Supabase Realtime）

---

## 文档（Documents）

产品规划、问卷设计与开发日志等请见 `documents/` 目录：

- `documents/项目计划.md`
- `documents/问卷初版设计.md`
- `documents/项目日志.md`
- `documents/匹配算法开发日志.md`
- `documents/UI设计1.0.html`

---

## 贡献（Contributing）

欢迎提 Issue / PR，一起完善功能、UI 和算法实现。

---

## License

本仓库暂未声明 License。若要开源/协作，建议补充 LICENSE 文件并在此处说明。
