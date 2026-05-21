# STATUS

**Last Updated:** 2026-05-19
**Current Version:** v1.2.x (Phase 12 in flight)
**Git Tag:** —

---

## 当前阶段：Phase 12 — 工程债清理 + 安全加固

Phase 11 (2026-04-23) 已完成博客系统 + Compare hub + gpt-image-2 配图 + SEO 自动化套件 + 治理三页四语补齐。CTO 接管审计发现 STATUS.md 之前的"i18n 平价 P1 内容债"已实际结清（editorial-policy / methodology / medical-advisors 四语齐 + compare 三页四语齐），但暴露出三条工程红线和七条工程债。

Phase 12 在 Phase 11 基础上推进三条主线：

1. **enforcement 红线清零** — `business-paths.txt` + `forbidden-paths.txt` 补 `api/` 覆盖 Edge AI endpoint；`.claude/` 全部 v3.8 hooks + v3.9 immutable-guard + 11 个 skills + pattern-detector + learned-rules infra 首次入仓（首次进入版本控制）。
2. **工程债清理** — CI 加 playwright E2E gate / OG 图生成失败时 exit 1 / google-trends-api + googleapis UNMET 修复 / GSC credentials 走 env 直传 / AIAssistant 流式响应加重试 / BloodTestChecker 硬编码外化到 i18n JSON。
3. **AI endpoint 加固（spec-driven）** — `api/ai-chat.ts` rate limit 持久化（KV / Upstash），按 §32 forbidden-policy 走 spec → plan → tasks + PR 双签。

全站 **205 个 mdx**（zh 57 + en 49 + ja 49 + ko 50），交互工具 10 个 + 1 个 Edge AI endpoint，结构化数据组件 3 个，SEO 自动化脚本 4 条，**v3.8 hard hooks 8 个 + v3.9 immutable-guard 1 个全部入仓**。

> 📌 **博客 zh-only by design**：14 篇博客有意只提供中文，按用户产品决策保留，**不视为 i18n 缺陷**（参 user memory `project_blog_zh_only`）。

---

## 功能完成度

### 本期（Phase 12）新增

| 功能 | 状态 | 质量 |
|------|------|------|
| `scripts/business-paths.txt` 增加 api/ — codex cross-review 覆盖 Edge endpoint | ✅ | 完整 (commit b759974) |
| `scripts/forbidden-paths.txt` 增加 api/ — AI endpoint 攻击面纳入 §32 spec-driven + 双签 | ✅ | 完整 (commit b759974) |
| `.claude/hooks/` 9 个守护脚本首次入仓 | ✅ | 完整 (commit 47f4df6) |
| `.claude/skills/` 11 个 auto-invoke skills 首次入仓 | ✅ | 完整 (commit 47f4df6) |
| `.claude/agents/pattern-detector.md` v3.9 飞轮分析层首次入仓 | ✅ | 完整 (commit 47f4df6) |
| `.claude/rules/learned/` Bugbot pattern 归档基础设施首次入仓 | ✅ | 完整 (commit 47f4df6) |
| `.claude/output-styles/cto.md` + `.claude/commands/cto-{doctor,evolve}.md` | ✅ | 完整 (commit 47f4df6) |
| STATUS.md 校准（187→205 / Phase 11→12 / i18n 平价结清） | ✅ | 完整 |
| CI playwright E2E gate | 🟡 计划中 | 1.1 |
| OG 图生成 fail > 0 时 exit 1 | 🟡 计划中 | 1.2 |
| google-trends-api + googleapis UNMET 修复 | 🟡 计划中 | 1.3 |
| GSC credentials 走 env 直传（移除明文文件落地） | 🟡 计划中 | 1.4（§32 workflow forbidden 需双签） |
| AIAssistant 流式响应 3 次指数退避重试 + 友好降级 | 🟡 计划中 | 1.5 |
| BloodTestChecker SECTION_COPY/RANGE_LABELS 外化到 i18n JSON | 🟡 计划中 | 1.6（铁律 #10） |
| api/ai-chat.ts rate limit 持久化（KV / Upstash） | 🟡 计划中 | 1.7（§32 spec-driven + 双签） |
| 药物 mdx 批量补 faqs frontmatter | 🟡 计划中 | 2.1 |
| sitemap-index.xml hreflang 完整性验证 | 🟡 计划中 | 2.2 |
| `dist/og/` 抽样验证 + 兜底 | 🟡 计划中 | 2.3 |
| self-audit-weekly cron 启用 | 🟡 计划中 | 3.1 |
| 首条 learned rule（business-paths-must-cover-api） | 🟡 计划中 | 3.2 |

### 已发布（沿用 Phase 11）

| 功能 | 状态 |
|------|------|
| 博客系统（`src/content/blog/zh/` + `src/pages/zh/blog/`） 14 篇 zh | ✅ |
| 30 秒决策矩阵 Compare hub（**四语齐**） | ✅ |
| 编辑治理三页（editorial-policy / methodology / medical-advisors，**四语齐**） | ✅ |
| 乳房发育页 + 5 张 gpt-image-2 配图 | ✅ |
| 首次注射 10 步图文教程（gpt-image-2） | ✅ |
| Codex 配图批量交付 16 张高质量图解 | ✅ |
| SEO 自动化脚本套件（`scripts/seo/*.mjs` + `seo-refresh.yml`） | ✅ |
| 结构化数据三组件（`JsonLd` + `BlogPostJsonLd` + `FaqSchema`） | ✅ |
| 自动 sitemap lastmod / OG 图 / FAQ frontmatter / compare 交叉链接注入 | ✅ |
| Sakura 手账皮肤（CSS toggle）+ 血检手账 v3.2 | ✅ |
| 信任支柱 + 风险筛查器跳卡（首页） | ✅ |
| llms.txt GEO 扩展 + 多 H1 修复 | ✅ |
| Bing/Google SEO 元数据重写（20 个 zh tier-1 页面） | ✅ |
| WCAG AA 站内对比度修复 | ✅ |
| 安全：API key 强制走环境变量 | ✅ |
| Breadcrumb schema + 每机器人 robots | ✅ |

### 已发布（沿用 Phase 10）

| 功能 | 状态 |
|------|------|
| 中文核心文档（before-you-start / pathway / risks / dose-limits / blood-tests / china-reality / breast-development） | ✅ |
| 英/日/韩文档（49-50 页 × 3） | ✅ |
| 交互工具 10 个（血检自查 / 注射计算器 / 剂量模拟器 / AI 助手 / 风险筛查 / 药物对比 / 文献库 / 药物速查卡 / 品牌索引 / 医院查找） | ✅ |
| AI 问答（Gemini 3 Flash Preview，Vercel Edge） | ✅ |
| 友好医疗资源数据库（15 家） | ✅ |
| 引用系统 + 22 条文献（18 条有 DOI） | ✅ |
| SVG 医学可视化（PKCurveChart / InjectionSiteSVG / RouteComparisonSVG） | ✅ |
| 28+ Playwright E2E | ✅ |
| PWA manifest + 内容新鲜度 90 天告警 | ✅ |
| Pagefind 四语全文搜索 | ✅ |
| ESLint 9 flat + Prettier + GitHub Actions CI（**E2E 待加 gate**） | ✅ |

### 未完成 / 已知缺口

| 项目 | 优先级 | 备注 |
|------|--------|------|
| CI 加 playwright E2E gate | P1 | Phase 12 阶段 1.1 |
| OG 图生成失败无 exit code（CI 看不出缺图） | P1 | Phase 12 阶段 1.2 |
| AIAssistant 流式响应无重试 | P1 | Phase 12 阶段 1.5 |
| BloodTestChecker 硬编码字串（违反铁律 #10） | P1 | Phase 12 阶段 1.6 |
| API 速率限制仅 in-memory（Vercel Edge 冷启动后重置） | P1 | Phase 12 阶段 1.7（§32 spec-driven） |
| GSC credentials 解码到明文文件（短窗口泄漏风险） | P1 | Phase 12 阶段 1.4（§32 workflow） |
| google-trends-api + googleapis UNMET | P2 | Phase 12 阶段 1.3 |
| 药物 mdx faqs frontmatter 覆盖率低 | P2 | Phase 12 阶段 2.1 |
| Sakura 皮肤的 zh 之外 locale 覆盖 | P3 | 当前主要在 zh 路径验证 |
| 品牌图鉴实物图片 | P3 | 需社区贡献素材 |
| 韩语交互工具 UI 本地化 | P3 | 当前 fallback 到英文 |
| 儿科/青少年内容 | P3 | CONTENT.md 已规划未实施 |
| en/ja/ko 主题图依然使用 Gemini 流水线产物 | P3 | gpt-image-2 仅 zh 替换 |

---

## 质量评分

| 维度 | 评分 | 变化 |
|------|------|------|
| 产品完整性 | 9.7/10 | — |
| 技术质量 | 9.7/10 | ↑ from 9.6（enforcement 全入仓 + api/ 覆盖 cross-review） |
| 内容质量 | 9.7/10 | — |
| 视觉设计 | 9.7/10 | — |
| 性能 | 9/10 | — |
| SEO/AEO | 9.8/10 | — |
| i18n 完整性 | 9.5/10 | ↑ from 8.5（editorial 三页 + compare 四语齐，博客 zh-only by design） |
| UX 导航 | 9.3/10 | — |
| 安全 | 9.5/10 | ↑（api/ 纳入 forbidden + business-paths） |
| **综合** | **9.6/10** | ↑ 微升（enforcement 红线归零） |

---

## 页面统计（已 Glob 复核）

| Locale | 页面数 | 备注 |
|--------|--------|------|
| zh | 57 | 含 compare 3 + editorial-policy + methodology + medical-advisors |
| en | 49 | 含 compare 3 + editorial-policy + methodology + medical-advisors |
| ja | 49 | 含 compare 3 + editorial-policy + methodology + medical-advisors |
| ko | 50 | 含 compare 3 + editorial-policy + methodology + medical-advisors |
| **mdx 总计** | **205** | （博客 14 篇 zh 通过 `src/pages/zh/blog/[slug].astro` 动态渲染，不计入 mdx 数） |

> 注：博客 14 篇 zh-only by design。若计入，zh 实际公开 URL 数 ≈ 71，全站 ≈ 219。

---

## 数据资产

| 数据文件 | 条目数 | 备注 |
|---------|--------|------|
| `drugs.json` | 20 种药物 | 全覆盖 |
| `drug-brands.json` | 58 品牌 | 16 类药物，13 国 |
| `references.json` | 22 条文献 | 18 条有 DOI |
| `hospitals.json` | 15 家医院 | 全部验证至 2026-04-12 |
| `blood-ranges.json` | 7 项指标 | E2/T/PRL/ALT/K+/Hb/D-dimer |
| `gpt-image-2-manifest.json` | 15 条 prompt | 2026-04-23 一次性产出，禁止脚本重生成 |
| `image-manifest.json` | 多语言图像清单 | Gemini 流水线（zh 已被 gpt-image-2 替换） |

---

## 当日（2026-05-19）落地

- `chore(enforcement): track scripts SSOT + cover api/ in business + forbidden paths` (commit b759974)
- `chore(enforcement): track v3.8 hooks + v3.9 immutable-guard + skills + learned-rules infra` (commit 47f4df6)
- STATUS.md 校准：187→205 页 / Phase 11 i18n P1 标记结清 / Phase 12 入口
- CTO 接管完成：3 个并行 Explore 子代理审计 + 矛盾点复核 + Plan agent 独立第二意见 + 用户确认优先级
- Phase 12 路线图入库：`~/.claude/plans/sub-agent-codex-review-peaceful-pretzel.md`

---

## 已知问题

| 问题 | 严重性 | 状态 |
|------|--------|------|
| API 速率限制仅 in-memory（Vercel Edge 冷启动后重置） | 中 | Phase 12 阶段 1.7，§32 spec-driven |
| GSC credentials 短窗口泄漏风险 | 中 | Phase 12 阶段 1.4，§32 workflow |
| CI 未跑 playwright E2E gate | 中 | Phase 12 阶段 1.1 |
| OG 图生成失败 CI 静默 | 中 | Phase 12 阶段 1.2 |
| BloodTestChecker 硬编码（铁律 #10） | 中 | Phase 12 阶段 1.6 |
| AIAssistant 流式响应无重试 | 中 | Phase 12 阶段 1.5 |
| 药物 mdx FAQPage schema 覆盖率低 | 低 | Phase 12 阶段 2.1 |
| 品牌图鉴暂无实物图片 | 低 | 需社区素材 |
| 韩语交互工具 UI 未完全本地化 | 低 | fallback 英文，功能正常 |
| en/ja/ko 主题图依然使用 Gemini 流水线产物 | 低 | gpt-image-2 仅 zh 替换 |
