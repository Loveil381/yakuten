# PRODUCT VISION

**Last Updated:** 2026-04-23

## 产品定义

**HRT药典** — 循证 · 减害 · 引导就医

面向中文圈跨性别女性的 HRT 安全底线信息站。基于国际临床指南（WPATH SOC 8 / Endocrine Society 2017 / UCSF）和同行评审文献，为已在用药或即将用药者提供安全参考。

- **不是**：百科全书、论坛、购药渠道、个人化处方建议
- **是**：临床路径式安全底线，每条建议附 DOI + 证据等级，紧急情况识别与引导就医

域名：`hrtyaku.com`（Vercel 静态部署）

---

## 核心用户群

| 用户群 | 优先级 | 使用场景 |
|--------|--------|----------|
| 中国大陆 DIY HRT 跨性别女性 | 主要 | 用药前安全核查、血检自查、紧急情况识别、剂量与途径选择 |
| 友好医疗从业者 | 次要 | 参考临床路径、用药指南、转诊话术 |
| 跨性别社区组织 | 次要 | 资源分发、减害教育、内容引用 |
| 日/韩/英语圈用户 | 第三 | 参考信息（en/ja/ko 各 44 页核心覆盖，本地化资源仍有限） |

---

## 差异化定位（vs mtf.wiki）

| 维度 | mtf.wiki | HRT药典 |
|------|----------|---------|
| 定位 | 百科全书式，覆盖面广 | 安全底线导向，聚焦减害 |
| 内容深度 | 广而浅 | 深度临床参考，每条有 DOI |
| 证据等级 | 无系统性标注 | A/B/C/X 明确标注 |
| 交互工具 | 少 | 多（10 个：血检 / 注射计算 / 剂量模拟 / AI 问答 / 风险筛查 / 药物对比 / 文献库 / 速查卡 / 品牌索引 / 医院查找） |
| 医疗引导 | 弱 | 强（就医路径图、友好医疗资源、紧急横幅） |
| 紧急情况 | 有但不突出 | 显著的紧急横幅，不可关闭 |
| 编辑治理 | 无 | 有（editorial-policy / methodology / medical-advisors 三页） |
| AI 辅助 | 无 | 有（Gemini 3 Flash Preview，注入 references.json，禁止个人化处方） |
| 决策矩阵 | 无 | 有（30 秒决策矩阵：CPA vs Spiro / Gel vs Patch / 口服 vs 注射） |

---

## 产品完成度（v1.1.x · Phase 11 · 2026-04-23）

### 已完成

- **多语言文档**：zh 55 页（含 14 篇博客 + 3 篇决策矩阵 + 治理三页） / en 44 页 / ja 44 页 / ko 44 页 — 总 187 公开 URL（含博客）
- **20 种药物详解**：雌二醇（口服/舌下/凝胶/贴片/注射 4 酯）/ 抗雄（CPA/螺内酯/比卡鲁胺/GnRH/拮抗剂）/ 5α-还原酶抑制剂 / 孕激素（地屈孕酮/屈螺酮/微粒化黄体酮 + MPA 警告）/ 禁用药物
- **10 个交互工具**：血检自查 v3.2（含 sakura 手账模式）/ 注射剂量计算器 / 剂量模拟器 / AI 问答 / 风险筛查 / 药物比较器 / 参考文献库 / 药物速查卡 / 品牌索引（58 品牌）/ 医院查找（15 家）
- **医学可视化**：3 个 SVG 组件（PKCurveChart / InjectionSiteSVG / RouteComparisonSVG）+ 41 张 webp 配图（gpt-image-2 高质量人工生成 15 张 + Gemini 流水线四语图各组）
- **首次注射 10 步图文教程**：injection-step-01..08 + 部位解剖图 + 针头规格对比（gpt-image-2 真人级）
- **乳房发育 5 张高质量配图**：Tanner 五期 / 导管分支机制 / E2 阶梯曲线 / 6 谣言海报 / 时间线
- **博客系统**：14 篇 zh 文章，BlogPostLayout + 自动 OG 图 + 面包屑 + 倒序锚点 + BlogPostJsonLd
- **SEO/AEO 体系**：JsonLd（Drug/ScholarlyArticle/Article/MedicalCondition）+ BlogPostJsonLd + FaqSchema + breadcrumb + 每机器人 robots + hreflang + x-default + og:locale + llms.txt（含 GEO 扩展）
- **SEO 自动化**：`scripts/seo/` 三件套 + 月度 GitHub Actions（GSC + Trends + keyword-gap 刷新）+ 自动 sitemap lastmod + 自动 OG 图像生成 + 自动 FAQ frontmatter / compare 链接注入
- **视觉设计**：米哈游「二相乐园」主皮肤 + Sakura「手账」CSS toggle 皮肤（`html.sakura`）
- **质量基础设施**：28 项 Playwright E2E + ESLint 9 flat + Prettier + GitHub Actions CI + 内容新鲜度 90 天告警
- **PWA**：manifest.json + standalone + 深色主题 + SVG 图标
- **AI 问答**：Gemini 3 Flash Preview，Vercel Edge Function，rate limit 5 req/min/IP
- **隐私 / 反追踪**：Vercel Analytics + Speed Insights（含 dev opt-out via `localStorage['yakuten-dev']`），无第三方 GA/FB pixel
- **GitHub 项目展示**：README + LICENSE（MIT 代码 + CC BY-NC-SA 4.0 内容）+ CONTRIBUTING + Issue 模板 + FUNDING

### 待完成

| 功能 | 优先级 | 备注 |
|------|--------|------|
| Phase 11 zh 增量内容 → en/ja/ko 翻译 | P1 | blog 14 / compare 3 / editorial-policy / methodology / medical-advisors，是当前最大 i18n 债 |
| Sakura 皮肤跨 locale 覆盖 | P2 | 当前主要在 zh 路径验证 |
| 品牌图鉴实物图片 | P3 | 需社区贡献素材 |
| 韩语交互工具 UI 本地化 | P3 | 当前 fallback 到英文 |
| 儿科/青少年内容 | P3 | CONTENT.md 已规划未实施 |
| API 速率限制持久化 | P3 | 当前 in-memory，Vercel Edge 冷启动后重置 |
| 更多 SVG 插图（分子结构、Tanner 分期 SVG 化） | P3 | 当前以 webp 配图为主 |

### 质量评分（v1.1.x）

| 维度 | 评分 | 说明 |
|------|------|------|
| 产品完整性 | 9.7/10 | 临床路径完整 + 决策矩阵 + 编辑治理 |
| 技术质量 | 9.6/10 | SEO 自动化 + 结构化数据 + CI + 安全修复（API key 环境变量化） |
| 内容质量 | 9.7/10 | 22 文献 + DOI + A/B/C/X 证据等级 + 14 篇博客 + 16 张医学图解 |
| 视觉设计 | 9.7/10 | 米哈游主皮 + Sakura 副皮 + gpt-image-2 高质量配图 |
| 性能 | 9/10 | 字体 swap + Pagefind 索引 + Astro 静态优先 |
| SEO/AEO | 9.8/10 | 三件套结构化数据 + 自动化 GSC/Trends + llms.txt + breadcrumb + FAQ schema |
| i18n 完整性 | 8.5/10 | 主体 4 语 44 页平价；Phase 11 内容 zh-only 拉低 |
| UX 导航 | 9.3/10 | 6 组侧边栏 + badge + 信任支柱 + 风险筛查跳卡 + 交叉链接 |

---

## 下一阶段（Phase 12 候选）

按优先级建议：

1. **i18n 回归** — 翻译 Phase 11 zh 增量到 en/ja/ko（至少 compare 决策矩阵 + 治理三页 + top 5 博客）
2. **内容货币化** — 评估 OpenCollective / Liberapay 链接是否激活（FUNDING.yml 当前占位）
3. **GSC 闭环** — 让月度 SEO PR 真正走入决策（看 striking-distance 词，按需补内容）
4. **WPATH SOC 9 / Endocrine Society 2025 草案跟进** — 出版后 30 天内更新 references.json + 标注差异
5. **AI 问答升级** — 评估 Gemini 3 Pro 或 Claude Sonnet 替代（仅当 Gemini 在跨性别医疗领域回答质量被验证不足时）
