# STATUS

**Last Updated:** 2026-04-12
**Current Version:** v0.9.0
**Git Tag:** —

---

## 当前阶段：Phase 9 完成（品牌索引 + SEO/AEO + GnRH 重写 + 审计修复）

Phase 9 聚焦四大方向：全站品牌索引工具、SEO/AEO 基础设施升级、GnRH 激动剂内容全面重写、CTO 审计问题修复。
全站 131 页（zh 44 + en 44 + ja 43），药物品牌 58 条，交互工具 9 个。

---

## 功能完成度

### 已发布（Vercel 生产环境）

| 功能 | 状态 | 质量 |
|------|------|------|
| 中文核心文档（9 页 + 20 药物详解页） | ✅ | 优秀（全部有内联 CitationRef + DOI 链接） |
| 英文完整文档（44 页，含药物详解 + about + tools） | ✅ | 优秀 |
| 日文完整文档（43 页，含药物详解 + about + tools） | ✅ | 优秀 |
| 用药路径时间线 | ✅ | 良好 |
| 乳房发育专题 | ✅ | 良好 |
| 中国现实页 | ✅ | 良好 |
| 血检指南 | ✅ | 良好 |
| 血检自查工具 | ✅ | 良好 |
| 注射剂量计算器 | ✅ | 良好 |
| 剂量模拟器 | ✅ | 良好 |
| 注射雌二醇酯类扩展（EC/EEn/EU） | ✅ | 良好（3 种注射酯类 PK 对比，三语） |
| 5α-还原酶抑制剂（非那雄胺/度他雄胺） | ✅ | 良好（全新药物类别，三语） |
| 地屈孕酮 + 屈螺酮 | ✅ | 良好（孕激素替代选项，三语） |
| 不推荐孕激素 (MPA) | ✅ | 完整（警告页面，三语） |
| 药物比较器（DrugComparator） | ✅ | 良好（18 药物对比，三语） |
| 风险自评工具（RiskScreener） | ✅ | 良好（7 问卷 → 4 维度评分，三语） |
| 参考文献库（ReferenceLibrary） | ✅ | 良好（22 条文献，搜索 + 分类过滤，三语） |
| AI 问答助手（Gemini Flash） | ✅ | 良好 |
| 友好医疗资源数据库（15 家） | ✅ | 良好（全国主要区域覆盖，全部验证至 2026-04-12） |
| **品牌索引（DrugBrandIndex）** | ✅ | **良好（58 品牌，搜索 + 地区/类别筛选，三语）** |
| 品牌图鉴（DrugBrandGallery） | ✅ | 良好（58 品牌，各药物页底部展示 + 索引页链接） |
| **GnRH 激动剂完整指南** | ✅ | **优秀（6 种药物对比、注射操作指南、Flare 管理、拮抗剂、三语 ~280 行/语）** |
| 引用系统（DOI 可点击跳转） | ✅ | 优秀（22 条文献，18 条有 DOI） |
| **SEO/AEO 完整体系** | ✅ | **优秀（页面级 JSON-LD Drug/ScholarlyArticle、llms.txt、hreflang + x-default、og:locale）** |
| **GitHub 项目展示** | ✅ | **完整（README + LICENSE + CONTRIBUTING + Issue 模板 + CI）** |
| **GitHub Actions CI** | ✅ | **完整（内容验证 + TypeScript 检查 + 构建）** |
| 米哈游视觉主题 | ✅ | 优秀 |
| **浅色主题兼容** | ✅ | **良好（所有交互工具使用 CSS 变量，深浅自适应）** |
| **侧边栏分组优化** | ✅ | **良好（给药途径分组 + badge + 6 个折叠组）** |
| **Footer 法律声明** | ✅ | **完整（免责声明 + 隐私 + GitHub + 反馈链接）** |
| 多语言 UI 字符串 | ✅ | 良好 |
| Pagefind 搜索（三语索引） | ✅ | 良好 |
| Google Fonts 非阻塞加载 | ✅ | 优秀（preload + swap） |
| CSS 变量系统 | ✅ | 完整（零硬编码颜色） |
| **ESLint + Prettier** | ✅ | **完整（ESLint 9 flat config + Prettier）** |
| 禁用药物页 | ✅ | 完整 |
| About 页面（三语，含 hananote 集成） | ✅ | 完整 |
| 反馈入口（Footer） | ✅ | 完整（腾讯问卷已上线） |

### 未完成（暂缓）

| 功能 | 优先级 | 备注 |
|------|--------|------|
| 移动端 UX 专项审计 | P1 | 86% 用户移动端，需测试所有交互工具 |
| 韩语 locale | P2 | 路由已预留 /ko/，内容待翻译 |
| PWA 支持 | P2 | manifest.json + Service Worker，离线访问 |
| 品牌图鉴实物图片 | P3 | 需要社区贡献素材 |
| E2E 自动化测试 | P3 | webapp-testing skill 已安装，待编写测试用例 |
| 内容新鲜度检测（90 天告警） | P3 | validate-content.mjs 扩展 |

---

## Phase 9 完成记录

### Sprint 1 — GitHub 项目展示 ✅

| 任务 | 结果 |
|------|------|
| README.md | 精美项目首页（徽章 + 功能表格 + Quick Start + 项目结构） |
| LICENSE | 双协议（MIT 代码 + CC BY-NC-SA 4.0 内容） |
| CONTRIBUTING.md | 贡献指南（翻译/代码/医学审阅） |
| Issue 模板 | bug_report.yml + content_correction.yml + feature_request.yml |
| FUNDING.yml | 赞助链接占位 |

### Sprint 2 — 药物品牌索引 ✅

| 任务 | 结果 |
|------|------|
| drug-brands.json 扩展 | 39→58 品牌，新增字段（activeIngredient, status, url） |
| DrugBrandIndex.tsx | React 交互组件（搜索 + 地区/类别筛选 + 状态 badge） |
| 三语 MDX 页面 | zh/en/ja tools/brand-index.mdx |
| DrugBrandGallery 链接 | 各药物页底部新增「查看全部品牌索引 →」 |

### Sprint 3 — 侧边栏重构 ✅

| 任务 | 结果 |
|------|------|
| 雌二醇分组 | 按给药途径（口服/透皮/注射），注射变体折叠 |
| Badge 系统 | 常用/首选/慎用/非必需/⚠ 三语 badge |
| 折叠优化 | 孕激素/5αRI/工具/附录默认折叠（35→23 可见行） |

### Sprint 4 — SEO/AEO 升级 ✅

| 任务 | 结果 |
|------|------|
| llms.txt | AI 引擎发现文件（站点结构 + 证据标准 + 引用格式） |
| JsonLd.astro 重构 | 页面级 Drug + ScholarlyArticle schema |
| hreflang | HTML head 三语 + x-default |
| og:locale | zh_CN/en_US/ja_JP + alternate |
| Meta description | 10 个核心页面扩展至 130-160 字符 |

### Sprint 5 — GnRH 激动剂重写 ✅

| 任务 | 结果 |
|------|------|
| 三语页面 | 100-170 行 → ~280 行/语 |
| 药物覆盖 | 3→6 种（+布舍瑞林鼻喷/那法瑞林/组氨瑞林植入棒） |
| 使用方法 | 皮下注射 7 步操作 + 鼻喷使用 + 植入棒说明 |
| Flare 管理 | 时间线表 + 抗雄覆盖方案 |
| GnRH 拮抗剂 | 地加瑞克 + 瑞卢戈利介绍 |
| 品牌数据 | 2→7 个（+Zoladex/贝依/Suprefact/Supprelin LA） |

### Sprint 6 — 审计修复 ✅

| 任务 | 结果 |
|------|------|
| 浅色主题 | BloodTestChecker/DoseSimulator/InjectionCalculator/DrugBrandIndex → CSS 变量 |
| Footer 法律声明 | 免责声明 + GitHub/反馈链接 |
| 医院验证 | 4 家过期记录刷新至 2026-04-12 |
| CI/CD | GitHub Actions（内容验证 + TS 检查 + 构建） |
| 代码质量 | ESLint 9 flat config + Prettier |

---

## Phase 7-8 完成记录

### Phase 7 — 工具 + 反馈

- DrugComparator（18 药物对比）
- RiskScreener（7 问卷 → 4 维度评分）
- ReferenceLibrary（22 文献检索）
- 反馈入口 + hananote 介绍

### Phase 8 — 药物覆盖扩展

- 注射雌二醇酯类（EC/EEn/EU）
- 5α-还原酶抑制剂（非那雄胺/度他雄胺）
- 孕激素扩展（地屈孕酮/屈螺酮/MPA）
- 药物覆盖 13→20 种

---

## 质量评分

| 维度 | 评分 | 变化 |
|------|------|------|
| 产品完整性 | 9.5/10 | — |
| 技术质量 | 9.5/10 | ↑ from 9.5（CI/CD + ESLint + Prettier） |
| 内容质量 | 9.5/10 | ↑（GnRH 重写 + 58 品牌） |
| 视觉设计 | 9/10 | ↑（浅色主题全面兼容） |
| 性能 | 9/10 | ↑ from 8.5（CJK 字体优化确认） |
| SEO/AEO | 9.5/10 | ↑↑ from 7（llms.txt + 页面级 JSON-LD + hreflang + og:locale） |
| i18n 完整性 | 9.5/10 | — |
| UX 导航 | 9/10 | ↑（侧边栏分组 + badge + 折叠优化） |
| **综合** | **9.4/10** | ↑ from 9.3 |

---

## 页面统计

| Locale | 页面数 |
|--------|--------|
| zh | 44 |
| en | 44 |
| ja | 43 |
| **总计** | **131** |

---

## 数据资产

| 数据文件 | 条目数 | 备注 |
|---------|--------|------|
| drugs.json | 20 种药物 | 全覆盖 |
| drug-brands.json | 58 品牌 | 16 类药物，13 国 |
| references.json | 22 条文献 | 18 条有 DOI |
| hospitals.json | 15 家医院 | 全部验证至 2026-04-12 |
| blood-ranges.json | 7 项指标 | E2/T/PRL/ALT/K+/Hb/D-dimer |

---

## 已知问题

| 问题 | 严重性 | 状态 |
|------|--------|------|
| 移动端交互工具未专项测试 | 中 | 待 P1 审计 |
| API 速率限制仅 in-memory | 低 | Vercel Edge 冷启动后重置 |
| 品牌图鉴暂无实物图片 | 低 | 需社区素材 |
| 韩语 locale 未实现 | 低 | 路由已预留 |
| 内容新鲜度无自动告警 | 低 | validate-content.mjs 待扩展 |
