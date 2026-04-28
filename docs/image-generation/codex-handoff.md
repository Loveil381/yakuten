# Codex 图片生成任务交接

> 你是 OpenAI codex agent。本任务由 HRT药典项目（Astro 5 + Starlight 中文医疗信息站）交接，用 gpt-image-2 模型 **生成 14 张缺失的医疗信息图**（完整规划 23 张中已有 9 张，仅需补齐缺失），并集成到 MDX 页面。
> 仓库：`C:\projects\yakuten` · 主分支 `master` · 项目说明 `CLAUDE.md`。
>
> **必读**：`prompts.md` 顶部的"实际任务清单"明确列出了 14 张待生成 + 9 张跳过。先读这一节，再执行 § 1 的工作流。

## 1. 你的工作流

> **重要**：本任务使用 Codex 原生集成的 `$imagegen` 技能（基于 gpt-image-2 模型，2026-04 起 GA），**无需用户提供 OpenAI API Key**，也**无需写 SDK 调用代码**。直接在 agent loop 中以自然语言/技能名调用即可。

1. **先读 `docs/image-generation/README.md`** — 整体策略 / 配色 / 路径 / MDX 引用规范。
2. **再读 `docs/image-generation/prompts.md`** — 23 张图的完整 prompt 卡片（每张含目标文件、插入位置、尺寸、alt、英文 prompt、验收）。
3. **按 P0 → P1 → P2 顺序逐张执行**。每张图执行步骤：

```text
for each card in prompts.md (in P0 → P1 → P2 order):

  a. 用 $imagegen 技能生成图（不要调用 OpenAI Images API SDK，用内置技能）：

     $imagegen
       prompt: <card 的英文 prompt（含 negative prompt）>
       size: <card.size>          # "1536x1024" / "1024x1024" / "1024x1536"
       quality: high
       background: transparent    # 失败时回退 "auto"
       output_path: public/images/diagrams/zh/source/<filename>.png

  b. 转 webp (q=85) → public/images/diagrams/zh/<filename>.webp
       npx sharp-cli -i public/images/diagrams/zh/source/<n>.png \
                     -o public/images/diagrams/zh/<n>.webp \
                     -f webp -q 85
       # 若 webp > 200KB 重转 q=80; 仍超则降低 PNG 源分辨率重生

  c. 打开目标 MDX 文件（card 中"插入位置"字段）

  d. 在指定章节锚点之后插入原生 <img> 标签：
       <img
         src="/images/diagrams/zh/<filename>.webp"
         alt="<card.alt 文本>"
         width="<尺寸的 W>"
         height="<尺寸的 H>"
         loading="lazy"   {# pathway-timeline 用 "eager" #}
         decoding="async"
         style="width:100%;height:auto;border-radius:4px;margin:0 0 var(--space-lg);"
       />

  e. 跑 npm run build 验证（每完成 5 张跑一次即可，不必每张都跑）

  f. git commit（一张图一 commit）：
       git commit -m "images: add #<编号> <kebab-name> · <中文标题>"
```

**`$imagegen` 调用要点（如果你的 Codex 形态的语法略有不同）**：
- ChatGPT App / 网页版 Codex（Agent Mode）：直接以自然语言说"用 imagegen 生成 XX，prompt 见 prompts.md 第 N 张，保存到 ..."
- Codex CLI（@openai/codex）：在交互模式或 `codex exec` 中以同样自然语言指令调用，Codex 自动路由到 image_gen tool
- VS Code Codex 扩展：在 chat 面板里调用 `$imagegen` 或自然语言均可
- **任何形态都不需要 API key**：使用用户的 ChatGPT Plus/Pro 订阅配额

## 2. 验收标准（每张图必须满足）

- [ ] **视觉风格**：medical infographic / scientific diagram；无写实人体、无裸露、无动漫风、无性化暗示
- [ ] **双主题兼容**：能在深色 `#1a1625` 与浅色 `#FFF5E0` 背景下都可读（透明背景 + 中性中调配色）
- [ ] **中文标签清晰**：等效 14pt 以上、无错别字、无糊字
- [ ] **数值与引用准确**：与 prompts.md "生成验收"字段一致；与 `src/data/references.json` DOI 一致
- [ ] **文件大小**：webp ≤ 200 KB
- [ ] **alt 文本完整**：≥ 30 字、含关键数据点、对屏幕阅读器友好
- [ ] **MDX 引用 build 通过**：`npm run build` 不报死链 / 不报缺失资源

## 3. 失败回退

如果 prompt 生成不理想，按以下规则迭代（每张最多重试 3 次）：

| 问题 | 修复方法 |
|---|---|
| 构图错乱、元素重叠 | prompt 追加：`clear visual hierarchy, well-separated zones, generous whitespace` |
| 文字模糊 / 错字 | prompt 追加：`high-quality typography, sharp text rendering`；复杂中文标签可改为英文 + alt/caption 中给中文 |
| 出现动漫/漫画风 | 强化 negative：`no anime, no manga, no comic style, no chibi, no kawaii style` |
| 出现写实人体/性化 | 强化 negative：`no realistic skin, no nudity, no body curves, asexualized geometric form only` |
| 配色冲突（深底看不见 / 浅底刺眼） | prompt 显式指定：`use only these hex colors: #1a1625 (dark accent), #C84B7C (highlight), #D4A853 (gold), white, transparent background` |
| 尺寸不对 | API 请求时检查 `size` 参数；导出后用 sharp 不做缩放（保留原始） |

**3 次仍不达标** → 在 `docs/image-generation/skipped.md` 追加一行：
```
| <编号> | <文件名> | <跳过原因> | <最后一次 prompt 哈希> |
```
跳到下一张，全部完成后回头处理 SKIP 列表（必要时降级为 SVG / CSS-only flex 信息图）。

## 4. 进度汇报

- **完成 P0 10 张后**：向用户提交中期汇报，附：
  - 已生成文件清单（路径 + 文件大小）
  - 关键截图（深色/浅色双主题各一张拼图）
  - 任何 prompt 调整经验或 SKIP 项
- **全部 23 张完成后**：最终报告，包含：
  - 23 张完整路径清单
  - `npm run build` 状态
  - SKIP 项汇总与降级方案
  - 关键 prompt 调整经验沉淀（供未来批次参考）

## 5. 边界与禁忌

- **不调用 OpenAI Images API SDK**：用 Codex 内置 `$imagegen` 技能。如你的 Codex 形态不支持图像生成，停下来报告"此形态不支持 $imagegen，请切换到 ChatGPT App Codex Agent Mode 或 Codex CLI"
- **不修改 MDX 内容文字**，只插入 `<img>` 标签和必要的 import（如果该 MDX 文件没用过原生 img，则不需要 import）
- **不更改全站 CSS**，所有图都设计为透明背景 + 中性配色，依赖 MDX 内联 style 适配
- **不引入新 npm 依赖**（sharp 通过 `npx sharp-cli` 临时调用即可）
- **不新建任何 .md 文档**（仅在跳过时追加 `skipped.md`）
- **不调用任何 npm audit / npm update / 任何 destructive 命令**
- **不 push 到远程**，所有 commit 留在本地或 PR 中由用户审阅

## 6. 关键提醒（最重要的 3 条）

1. **路径一致性 > 一切**：图保存到 `public/images/diagrams/zh/`（不是 `src/assets/`），MDX 用 `<img src="/images/diagrams/zh/...">` 直接路径，与项目既有 26 张图模式完全一致。改动这条会破坏所有现存图片引用。
2. **医学准确性 > 美观**：每个数值（OR、剂量、阈值）都有 DOI 来源；prompt 中的数字与 prompts.md "生成验收"字段不符 → 必须重生。CPA OR 12.36、Canonico 2018、EMA 2020 ≥25mg、E2 目标 200-400 pg/mL — 这些是硬指标。
3. **抽象 > 写实**：Tanner 分期、注射部位、外科对比这三张最容易踩坑。绝对避免任何写实皮肤 / 乳头 / 性化形态 / 动漫人物 — 只允许几何线稿 + 抽象符号。这是 CLAUDE.md 「Architecture Constraints」 与 prompts.md negative 的红线。
