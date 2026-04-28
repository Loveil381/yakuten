# HRT药典 · 医疗信息图生成手册（codex 交接）

> 交接对象：OpenAI codex（gpt-image-2 图像模型）
> 仓库：`C:\projects\yakuten`（Astro 5 + Starlight 中文医疗信息站）
> 关联文档：本目录下 `prompts.md`（23 张 prompt 卡片）、`codex-handoff.md`（执行指令）

## 1. 整体策略

完整视觉规划共 **23 张医疗信息图**（覆盖 HRT 用药路径、Tanner 分期、血检解读、危险组合、紧急症状等核心安全信息），其中 **9 张已存在**于 `public/images/diagrams/zh/`，**实际仅需生成 14 张**（详见 `prompts.md` 顶部"实际任务清单"）。所有图片必须满足以下五条原则：

1. **双主题兼容**：Yakuten 默认深色「米哈游二相乐园」（背景 `#1a1625`、主色 `#C84B7C`、强调 `#D4A853`），sakura 模式浅色「乐园手账」（纸 `#FFF5E0`、樱花深粉 `#E5578B`、蜂蜜金 `#F5B347`、墨 `#4A2838`）。图片需用**透明背景 + 中性中调配色**，深底浅底都不刺眼。
2. **医学严谨性**：所有数值、范围、单位必须与对应 MDX 页面一致（DOI 来源在 `src/data/references.json`）。Endocrine Society 2017 / WPATH SOC 8 / EMA 2020 / Canonico 2018 是主要循证锚点。
3. **零人体写实**：禁止任何写实人体、裸露、动漫风格人物。Tanner 分期等解剖示意必须使用**抽象侧剖面线稿**或几何符号化图形，绝对避免性化表现。
4. **中文标签清晰**：所有标签使用简体中文，字体大小 ≥ 14pt 等效，避免极细字体。
5. **可循证标注**：图中如出现引用源（"WPATH SOC 8" / "Canonico 2018" 等），必须与 prompts.md 中的来源字段一致。

## 2. gpt-image-2 推荐参数（通过 Codex `$imagegen` 技能）

> **2026-04 更新**：Codex（ChatGPT App / 网页 / CLI / VS Code 扩展 / 桌面 App）原生集成 gpt-image-2 模型，**用户用 ChatGPT Plus/Pro 订阅即可调用，无需 OpenAI API Key**。所有 Codex 形态在 agent loop 中通过 `$imagegen` 技能或自然语言均可触发。

| 参数 | 值 | 说明 |
|---|---|---|
| `size` | `1536x1024` | **默认** 16:9 横版（时间轴、对比矩阵、流程图） |
| `size` | `1024x1024` | 1:1 方版（速查卡、单一概念图） |
| `size` | `1024x1536` | 3:4 竖版（决策树、风险叠加模型） |
| `quality` | `high` | 全部使用高质量档位 |
| `background` | `transparent` | **优先**透明，回退 `auto` |
| `n` | `1` | 一次出一张，保留配额用于迭代 |

每张图的具体尺寸见 `prompts.md` 的"推荐尺寸"字段。

**配额参考**（2026-04）：
- ChatGPT Plus：~50 张/3 小时滚动窗口（23 张分两批即可）
- ChatGPT Pro：基本无限制
- Codex CLI：使用同账号订阅配额

## 3. 输出格式与转换流程

```
gpt-image-2 输出 PNG
        │
        ├─ 备份原始 PNG → public/images/diagrams/zh/source/<name>.png
        │
        └─ 转换 WebP → public/images/diagrams/zh/<name>.webp
```

转换命令（任选其一）：

```bash
# 方案 A：sharp CLI（推荐，质量稳定）
npx sharp-cli -i input.png -o output.webp -f webp -q 85

# 方案 B：Node 脚本（批量）
node -e "require('sharp')('input.png').webp({quality:85}).toFile('output.webp')"

# 方案 C：cwebp（系统已装时）
cwebp -q 85 input.png -o output.webp
```

**质量目标**：单张 webp ≤ 200 KB，超过 200KB 时降至 q=80 重转，仍超过则降低 PNG 源分辨率。

## 4. 文件命名规范

`kebab-case` + 主题前缀，统一放入 `public/images/diagrams/zh/`：

| 编号 | 文件名 | 已存在? |
|---|---|---|
| 1 | `pathway-timeline.webp` | 已存在（需重做或保留） |
| 2 | `tanner-stages.webp` | 已存在 |
| 3 | `duct-branching.webp` | 已存在 |
| 4 | `blood-tubes.webp` | 已存在 |
| 5 | `routes-vte-comparison.webp` | 新（不要覆盖现有 `routes-comparison.webp`） |
| 6 | `cpa-meningioma-risk.webp` | 已存在 |
| 7 | `injection-sites-anatomy.webp` | 已存在 |
| 8 | `antiandrogens-matrix.webp` | 新 |
| 9 | `dangerous-combinations.webp` | 新 |
| 10 | `e2-staircase.webp` | 已存在 |
| 11 | `china-availability-heatmap.webp` | 新 |
| 12 | `vte-risk-stacking.webp` | 新 |
| 13 | `oral-vs-injection-curves.webp` | 新 |
| 14 | `monitoring-gantt.webp` | 新 |
| 15 | `progestogen-decision-tree.webp` | 新 |
| 16 | `spironolactone-potassium.webp` | 新 |
| 17 | `diane-35-vs-hrt.webp` | 新 |
| 18 | `cis-vs-hrt-timeline.webp` | 已存在 |
| 19 | `emergency-signs.webp` | 已存在 |
| 20 | `dose-diminishing-returns.webp` | 新 |
| 21 | `baseline-tests-nav.webp` | 新 |
| 22 | `mood-monitoring.webp` | 新 |
| 23 | `breast-surgery-comparison.webp` | 新 |

**已存在标记**：默认**保留旧版本**，仅在视觉风格严重不一致时重做。重做时先备份 `<name>-legacy.webp`。

## 5. MDX 引用规范

Yakuten 现有 MDX 全部使用**原生 `<img>` 标签**（不走 `astro:assets` 处理管线，因为图都是预先生成的静态 webp）。统一格式：

```mdx
<img
  src="/images/diagrams/zh/<name>.webp"
  alt="<≥30字中文描述，含关键数据点>"
  width="1536"
  height="1024"
  loading="lazy"
  decoding="async"
  style="width:100%;height:auto;border-radius:4px;margin:0 0 var(--space-lg);"
/>
```

例外：路径页首图 `pathway-timeline.webp` 用 `loading="eager"`（首屏 LCP 优化），其他全部 `lazy`。

`width` / `height` **必须填**真实像素（防止布局抖动 CLS）：1536x1024、1024x1024、1024x1536 三选一。

## 6. 推荐生成顺序

按优先级 + 依赖关系：

1. **P0 批次（10 张，编号 1-10）**：核心安全信息，影响 LCP 与首屏阅读。先生成 1-5（路径/Tanner/导管/血检管/VTE 对比），再生成 6-10（CPA/注射/抗雄/危险组合/E2 阶梯）。
2. **P1 批次（10 张，编号 11-20）**：补充对比与监测信息。按编号顺序即可。
3. **P2 批次（3 张，编号 21-23）**：增强阅读体验。最后生成。

每批完成 5 张后跑一次 `npm run build`，确保 MDX 引用无死链。

## 7. 验收清单

每张图必须在合并前满足：

- [ ] **双主题可读**：分别在深色 `#1a1625` 与浅色 `#FFF5E0` 背景下截图查看，文字与配色都不刺眼、不丢失
- [ ] **无人体写实**：无任何裸露、写实皮肤、动漫人物；解剖图必须是抽象线稿或几何符号
- [ ] **医学准确性**：数值、范围、单位与 prompts.md 中"生成验收"字段一致；与对应 MDX 页面一致
- [ ] **中文标签清晰**：等效 14pt 及以上，无马赛克、无糊字、无错别字
- [ ] **文件大小**：webp ≤ 200KB（超过则按第 3 节回退）

## 8. 失败回退

- 单张连续生成 3 次仍不满足验收 → 在 `docs/image-generation/skipped.md` 追加一行 `<编号> | <文件名> | <跳过原因>`，跳到下一张
- 全部 23 张完成后回头处理 SKIP 列表，必要时降级为 SVG 手画（CSS-only flex/grid 信息图）

## 9. 关联资源

| 资源 | 路径 |
|---|---|
| 引用数据库（DOI） | `src/data/references.json` |
| 药物结构化数据 | `src/data/drugs.json`, `src/data/injection-doses.json` |
| 血检参考范围 | `src/data/blood-ranges.json` |
| 现有 webp 目录 | `public/images/diagrams/zh/` |
| MDX 路径根 | `src/content/docs/zh/` |
| 项目规范 | `CLAUDE.md` 顶部「Architecture Constraints」「Visual Design」 |

---

**下一步**：阅读 `prompts.md` 获取每张图的完整 prompt 与元数据，按 `codex-handoff.md` 的批处理流程执行。
