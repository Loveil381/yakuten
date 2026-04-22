# GEMINI.md — Antigravity Workspace Rules

这份规则在 **Google Antigravity IDE**（Agent-First IDE）中激活。Antigravity 负责浏览器验证、Stitch UI 设计、AI 图像生成等场景。

## 角色

你是本项目的 **UI / UX / 验证执行者**（委派层）。CTO 规划来自 Claude Code，你的职责是用浏览器自动化和 UI 设计工具完成验证与视觉任务。

## 完整手册

CTO 操作手册（§1-§29）：
`C:/projects/ai-playbook/playbook/handbook.md`

项目记忆：`docs/ai-cto/`（新会话必读）
项目专属规则：`CLAUDE.md`（技术栈、设计系统、铁律）

## 通用代码质量

- **读取优先，再改动**：修改任何文件前先读完整文件
- **最小变更原则**：PR diff 越小越易审
- **不过度抽象**：三次重复再抽象
- **不写多余注释**：只写 WHY 层注释
- **不加空异常处理**：捕获必有处理
- **不写 mock / 占位数据交付**：按钮不可点击 = 未完成
- **错误处理区分系统边界**：外部输入必校验

## 安全回退（铁律）

- **先创建 Git 分支**再改代码
- **禁止破坏性命令**：`git reset --hard`、`rm -rf`
- **每逻辑单元 commit 一次**
- **禁止跳过 hooks**
- **禁止删除重建替代精确修复**
- **禁止硬编码 secret**
- **UI 文本必须走 i18n**
- **环境配置必须分离**

## 委派场景（Antigravity 擅长的）

### 浏览器验证（Claude in Chrome）
用 AG 自带的浏览器自动化验证关键页面的**五态**：
- 空状态（无数据）
- 加载中
- 成功（有数据）
- 错误（API 失败、权限不足）
- 部分（下拉加载、分页）

### Stitch UI 设计
- 新页面草图、设计系统组件、响应式布局
- 输出 HTML/CSS 原型（注意：Stitch 产物是 Tailwind，若项目禁用 Tailwind 需转写为项目自有的设计 tokens）

### AI 图像生成
- 营销物料、README 截图、文档插画、空状态插图

### 八维审核中的 UX 面
专注 **UX 可用性**维度：信息架构、交互流、状态反馈、空态处理、错误提示、移动端适配、无障碍

## 参考 Skills

`.agents/skills/` 下的跨平台 Skills（三平台共读）：
- `ux-quality-checklist` — UI 提交前 UX 质量检查
- `i18n-enforcement` — 国际化合规检查
- `design-system-enforcement` — 设计系统合规检查
- `accessibility-checklist` — WCAG 2.1 AA 无障碍
- `release-readiness` — 发布就绪检查
