# HEU266｜HEU校园恋爱匹配交友项目「🍊意配 / O_match」

面向校园场景的“慢社交”匹配产品：通过深度问卷建模与匹配算法，为用户提供周期性（如每周一次）的匹配结果与匹配报告，减少“左滑右滑”的快餐式交友疲劳。

> 本仓库为前端为主的项目（HTML/TypeScript），前端工程位于 `O_match/`。

---

## 项目亮点（Features）

- **多维度问卷建模**：围绕价值观、生活习惯、人格等维度进行信息采集  
- **匹配与报告**：输出契合度、雷达图/描述等“数据化浪漫”的结果展示（按产品规划实现）
- **慢社交机制**：限制匹配频次、固定“开奖时间”，降低社交压力
- **前端技术栈**：React + TypeScript + Vite + TailwindCSS + React Router + Zustand + Axios

---

## 项目状态（Backend Status）

- ✅ 当前仓库以**前端**为主（可本地启动与预览）。
- 🚧 **后端正在开发中**：目前可能使用Supabase；待后端稳定后会补充 API 文档、部署地址与联调说明。

---

## 仓库结构（Structure）

- `O_match/`：主前端工程（React + TS + Vite）
- `documents/`：项目计划、问卷设计、日志、UI设计稿等文档
- `Html静态预览版/`：HTML 静态预览版本（用于展示/原型预览）
- `.DS_Store`：建议从仓库中移除并加入 `.gitignore`（macOS 生成文件）

---

## 快速开始（Getting Started）

### 1) 环境要求

- Node.js：建议 18+（或使用你本地可用的 LTS 版本）
- npm（或 pnpm/yarn 也可，但本仓库已有 `package-lock.json`，更推荐 npm）

### 2) 安装依赖

进入前端目录：

```bash
cd O_match
npm install
```

### 3) 本地开发启动

```bash
npm run dev
```

启动后按终端提示访问本地地址（通常是 `http://localhost:5173`）。

### 4) 构建与预览

```bash
npm run build
npm run preview
```

---

## 配置说明（Environment）

前端目录下包含：

- `O_match/.env`
- `O_match/.env.development`
- `O_match/.env.production`

如果你需要对接后端 API，一般会在这些文件里配置 API Base URL 等变量（按项目实际变量名为准）。

---

## 文档（Documents）

项目规划、问卷与匹配算法思路等请见：

- `documents/项目计划.md`（项目背景、目标用户、核心流程、算法/模块规划等）
- `documents/问卷初版设计.md`
- `documents/项目日志.md`
- `documents/匹配算法开发日志.md`
- `documents/UI设计1.0.html`

---

## 技术栈（Tech Stack）

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand
- Axios
- MSW（Mock Service Worker，用于接口模拟/联调）

---

## 开发约定（Development）

```bash
# 代码检查
cd O_match
npm run lint
```

建议在提交前运行 lint，保持代码风格一致。

---

## Roadmap（可选）

- [ ] 问卷引擎（动态题目、权重、相似/互补倾向）
- [ ] 匹配引擎（打分 + 稳定匹配/最大权匹配等方案落地）
- [ ] 匹配报告（契合度、百分位、雷达图、契合点描述）
- [ ] 通知机制（固定开奖时间、站内/短信/小程序推送等）
- [ ] 匿名聊天室（72 小时限时、敏感词/风控）

---

## 贡献（Contributing）

欢迎提 Issue / PR，一起完善功能、UI 和算法实现。

---

## License

本仓库暂未声明 License。若要开源/协作，建议补充 LICENSE 文件并在此处说明。
