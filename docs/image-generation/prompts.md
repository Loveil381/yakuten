# HRT药典 · 医疗信息图 · gpt-image-2 Prompt 总册

> 本文档与 `README.md` 配套。完整规划共 23 张图，**实际仅需生成 14 张**（其余 9 张已存在于 `public/images/diagrams/zh/`，不重新生成）。
> 每张卡片包含：目标文件、插入位置、推荐尺寸、alt 文本、完整英文 prompt（含 negative）、生成验收。
> 路径约定：所有 webp 输出到 `public/images/diagrams/zh/`，原始 PNG 备份到 `public/images/diagrams/zh/source/`。
> MDX 中以原生 `<img>` 引用（不走 `astro:assets`，与项目既有模式一致，详见 README.md § 5）。

---

## ⚠ 实际任务清单（codex 必读）

### ✅ 待生成 14 张（按原编号 + P0→P1→P2 优先级）

| 原编号 | 优先级 | 文件名 | 目标 MDX | 章节 |
|---|---|---|---|---|
| #5 | P0 | `routes-vte-comparison` | medications/estrogens/overview.mdx | VTE 对比节 |
| #8 | P0 | `antiandrogens-matrix` | medications/antiandrogens/overview.mdx | 四种抗雄方案对比 |
| #9 | P0 | `dangerous-combinations` | dose-limits.mdx | § 4.2 禁止组合前 |
| #11 | P1 | `china-availability-heatmap` | china-reality.mdx | 路径图前开篇 |
| #12 | P1 | `vte-risk-stacking` | risks.mdx | § 7.1 DVT 卡片后 |
| #13 | P1 | `oral-vs-injection-curves` | compare/oral-vs-injection.mdx | 血药浓度稳定性 |
| #14 | P1 | `monitoring-gantt` | blood-tests.mdx | § 6.1 总览 |
| #15 | P1 | `progestogen-decision-tree` | breast-development.mdx | 孕激素时机段 |
| #16 | P1 | `spironolactone-potassium` | medications/antiandrogens/spironolactone.mdx | 高钾血症节后 |
| #17 | P1 | `diane-35-vs-hrt` | dose-limits.mdx | § 4.3 达英-35 后 |
| #20 | P1 | `dose-diminishing-returns` | dose-limits.mdx | § 4.1 |
| #21 | P2 | `baseline-tests-nav` | before-you-start.mdx | § 1.1 |
| #22 | P2 | `mood-monitoring` | risks.mdx | § 7.1 情绪卡片后 |
| #23 | P2 | `breast-surgery-comparison` | breast-development.mdx | 外科补救段 |

**新优先级分布**：P0 = 3 张（#5/#8/#9）· P1 = 8 张（#11-17, #20）· P2 = 3 张（#21/#22/#23）

### ⏭ 已存在 9 张（codex 跳过生成，但需检查 MDX 是否已插入 `<img>`，缺则补）

| 原编号 | 文件名 | 目标 MDX |
|---|---|---|
| #1 | `pathway-timeline.webp` | pathway.mdx |
| #2 | `tanner-stages.webp` | breast-development.mdx § 5.1 |
| #3 | `duct-branching.webp` | breast-development.mdx § 5.3 |
| #4 | `blood-tubes.webp` | blood-tests.mdx |
| #6 | `cpa-meningioma-risk.webp` | dose-limits.mdx § 4.1 |
| #7 | `injection-sites-anatomy.webp` | guides/first-injection.mdx |
| #10 | `e2-staircase.webp` | breast-development.mdx § 5.4 |
| #18 | `cis-vs-hrt-timeline.webp` | breast-development.mdx 时间线对比 |
| #19 | `emergency-signs.webp` | risks.mdx § 7.2 |

> **重要**：
> - codex 不要重新生成上述 9 张图（除非显式要求重做）。
> - codex 仍需打开对应 MDX 文件，检查是否已正确插入 `<img src="/images/diagrams/zh/<name>.webp">` 引用；如缺失，按 README.md § 5 格式补上即可（无需调用 `$imagegen`）。
> - 如某张已存在图视觉风格严重不一致需重做，先备份为 `<name>-legacy.webp` 再覆盖。下方仍保留这 9 张的完整 prompt 卡片以备查。

---

**通用 negative prompt（每张都要带）：**
```
no anime, no manga, no comic style, no photorealistic human bodies, no nudity,
no sexualization, no gendered stereotypes, no graphic blood, no gore,
no watermark, no signature, no low-quality typography, no blurry text,
no fictional brand logos, no clutter
```

**通用风格基底：**
```
modern medical infographic, clean vector-style illustration, scientific diagram,
clear visual hierarchy, well-separated zones, high-quality typography,
sharp text rendering, transparent background preferred (or neutral off-white #F5F2EC fallback),
palette must remain readable on both dark theme #1a1625 and light theme #FFF5E0
```

---

# P0 优先批次（10 张 · 必须最先完成）

## #1  P0  HRT 初始化路径全景时间轴

- **目标文件**：`public/images/diagrams/zh/pathway-timeline.webp`（覆盖现有版本前先备份为 `pathway-timeline-legacy.webp`）
- **插入位置**：`src/content/docs/zh/pathway.mdx` → 顶部 `<div class="pathway-hero">` 之后、第一个 `<PhaseBlock>` 之前
- **推荐尺寸**：1536x1024（16:9 横版）
- **alt 文本**：`HRT 初始化路径全景时间轴：从启动前基线检查、第 1-6 个月起始期、第 6-12 个月调整期到 1 年以上维持期，标注每阶段关键决策节点与复查时间`

**gpt-image-2 prompt：**
```
A horizontal medical-infographic timeline titled "HRT 启动到稳定维持 · 路径全景"
that runs left to right across four phases:
(1) "Phase 0 启动前" — baseline tests icon (test tube + checklist),
(2) "Phase 1 第 1-6 个月 · 起始期" — pill + injection icon with "1M / 3M / 6M" review markers,
(3) "Phase 2 第 6-12 个月 · 调整期" — dose-tuning gauge icon,
(4) "Phase 3 12 个月以上 · 维持期" — long sine-wave indicating steady state.
Each phase is a rounded rectangle card connected by an arrow river.
Above each card, a small clock badge shows "0M / 6M / 12M / 12M+".
Below each card, a one-line caption in simplified Chinese (14pt equivalent):
"基线血检 + 风险评估", "起始剂量 + 1/3/6 月复查", "微调到目标 E2", "每 6-12 月复查".
Top header strip uses subtle pink-to-gold gradient (#C84B7C → #D4A853) for accent only;
all body text in a high-contrast neutral ink so it reads on both dark and light backgrounds.
Style: modern medical infographic, clean vector, transparent background.

Negative: no anime, no manga, no comic style, no photorealistic human bodies, no nudity,
no sexualization, no graphic blood, no watermark, no blurry text, no fictional brand logos.
```

**生成验收：** 4 个阶段卡均可见、时间轴箭头连贯、中文标签清晰；首屏 LCP 用，转 webp ≤ 200KB；img 标签使用 `loading="eager"`。

---

## #2  P0  Tanner 乳房发育五期解剖示意图

- **目标文件**：`public/images/diagrams/zh/tanner-stages.webp`（已存在，仅在风格不一致时重做）
- **插入位置**：`src/content/docs/zh/breast-development.mdx` → § 5.1 "正常发育生理——Tanner 分期" 标题之后、`### 关键事实` 之前
- **推荐尺寸**：1536x1024（16:9 横版，5 个阶段一行排列）
- **alt 文本**：`Tanner 乳房发育五期抽象侧剖面线稿示意图：B1 平坦、B2 乳晕隆起、B3 乳房整体扩大、B4 乳晕二次隆起、B5 成熟形态，标注每期典型时长`

**gpt-image-2 prompt：**
```
A medical anatomical reference diagram showing five Tanner stages of breast development
arranged horizontally as B1 / B2 / B3 / B4 / B5.
CRITICAL: each stage is rendered as a clean abstract side-profile line drawing only —
single continuous outline showing the elevation curve, NO skin tones, NO nipple detail beyond
a small dot, NO realistic anatomy. Treat it as a geometric scientific reference, not a body.
Each stage sits on its own card with:
- a simplified Chinese label: B1 "平坦期", B2 "蕾期", B3 "扩大期", B4 "二次隆起", B5 "成熟期"
- a duration tag in cis-puberty terms: "8-13 岁", "9-14 岁", "10-15 岁", "11-16 岁", "12-17 岁"
- a tiny annotation: "导管萌发 → 终末分化"
Use a thin ink stroke (#4A2838 or near-black), accent dot in #C84B7C only on the areola point.
Background fully transparent. Layout symmetric, generous whitespace between stages.
Style: scientific medical reference, vector line art, neutral, non-sexualized,
suitable for an educational health resource.

Negative: no anime, no manga, no realistic skin, no photoreal human bodies, no nudity,
no sexualization, no shading on skin, no gendered stereotypes, no watermark, no blurry text.
```

**生成验收：** 5 期可读且形态差异明显；不出现写实皮肤/乳头/性化暗示；中文标签清晰。

---

## #3  P0  导管分支 vs 终末分化对比机制图

- **目标文件**：`public/images/diagrams/zh/duct-branching.webp`（已存在，复核风格）
- **插入位置**：`src/content/docs/zh/breast-development.mdx` → § 5.3 "高剂量为什么适得其反" → `### 乳腺发育的两个阶段` 段落之后
- **推荐尺寸**：1536x1024（左右分屏对比）
- **alt 文本**：`乳腺发育两阶段机制对比图：左侧"导管分支期"显示低 E2 下导管树状萌发，右侧"终末分化期"显示稳定 E2 下小叶腺泡成熟，箭头标注高剂量会跳过导管分支阶段`

**gpt-image-2 prompt：**
```
A scientific cell-biology infographic split into two labeled panels:
LEFT panel "Phase A · 导管分支期 (Ductal Branching)":
  shows a tree-like duct system branching outward, simple ink lines, sparse buds,
  small caption "低 E2 持续刺激 · 数月慢启动".
RIGHT panel "Phase B · 终末分化期 (Lobuloalveolar Maturation)":
  shows clusters of acinar buds at the duct tips, with rounded grape-like alveoli,
  small caption "稳定 E2 + 时间 · 数年完成".
Between the two panels, a horizontal arrow with the label
"⚠ 高剂量会跳过 Phase A，直接锁定不完整的 Phase B 形态".
Use thin medical line-art style, ink stroke #4A2838, accent #C84B7C only on the arrow.
Transparent background. Modest legend at bottom: "数据综合自 Endocrine Society 2017 / WPATH SOC 8".
Style: scientific diagram, vector line illustration, no realistic tissue,
no microscopy photo look, abstract symbolic representation.

Negative: no anime, no realistic skin, no microscope photograph, no blood, no gore,
no clutter, no watermark, no blurry text.
```

**生成验收：** 两阶段视觉差异明显、箭头警告清晰、引用源准确（Endocrine Society 2017 / WPATH SOC 8）。

---

## #4  P0  血检采集管与项目速查表

- **目标文件**：`public/images/diagrams/zh/blood-tubes.webp`（已存在）
- **插入位置**：`src/content/docs/zh/blood-tests.mdx` → `### 采血注意事项` 段落之后
- **推荐尺寸**：1536x1024（横版速查）
- **alt 文本**：`血检采集管色别速查表：紫帽 EDTA 抗凝管做血常规、红/黄帽分离胶管做生化与激素六项、蓝帽枸橼酸钠管做凝血与 D-二聚体，标注空腹要求与采血时段`

**gpt-image-2 prompt：**
```
A clean reference table titled "HRT 监测 · 血检采集管速查"
with three rows, each showing a stylized blood collection tube icon (vector cylinder, no realistic blood):
ROW 1 — 紫色帽 EDTA 抗凝管: "血常规 (CBC) · Hb / Hct / 血小板 · 不需空腹"
ROW 2 — 红/黄色帽 分离胶管: "肝肾 + 激素六项 (E2 / T / LH / FSH / PRL / SHBG) · 建议晨间 8-10 点 / 注射用户取谷值"
ROW 3 — 蓝色帽 枸橼酸钠管: "凝血 + D-二聚体 · 怀疑 DVT/PE 时加做"
Each row has: tube icon (left), Chinese label (middle), test list + timing tip (right).
Top right: small footnote "颜色仅作示意，以实际医院规范为准".
Tube caps use saturated colors (purple #6B5BA8, red #C84B7C, blue #5BA8E0) but tube body remains
neutral translucent gray so the chart works on both dark #1a1625 and light #FFF5E0 backgrounds.
Transparent background. Crisp Chinese typography ≥ 14pt equivalent.

Negative: no anime, no realistic blood, no photorealistic medical equipment, no clutter,
no watermark, no blurry text.
```

**生成验收：** 三种管帽颜色可辨、中文项目名无错字、空腹/时段提示明确。

---

## #5  P0  雌激素给药途径 VTE 风险对比柱状图

- **目标文件**：`public/images/diagrams/zh/routes-vte-comparison.webp`（**新建**，不要覆盖现有 `routes-comparison.webp`）
- **插入位置**：`src/content/docs/zh/medications/estrogens/overview.mdx` → § "给药途径 VTE 风险对比" 标题之后
- **推荐尺寸**：1536x1024（横版柱状图）
- **alt 文本**：`雌激素四种给药途径 VTE 风险对比柱状图：口服 E2 风险 OR≈1.7、贴片 OR≈1.0、凝胶 OR≈1.0、注射数据有限，引用 Canonico 2018 元分析`

**gpt-image-2 prompt：**
```
A horizontal bar chart infographic titled "雌激素给药途径 · VTE 相对风险 (OR)"
showing four bars (oral / patch / gel / injection):
- "口服 E2 (estradiol valerate)"  bar length OR ≈ 1.7  filled with #C84B7C, label "OR 1.7 (1.1-2.4)"
- "贴片 (transdermal patch)"        bar length OR ≈ 1.0  filled with neutral gray, label "OR 1.0 (基线)"
- "凝胶 (gel)"                      bar length OR ≈ 1.0  filled with neutral gray, label "OR 1.0"
- "注射 (intramuscular)"            bar length shown as dashed/striped pattern, label "数据有限 · 推断与口服相近"
Y-axis lists routes in Chinese; X-axis shows OR scale 0 / 0.5 / 1 / 1.5 / 2 with a vertical reference line at OR=1.
Top-right: badge "证据 A · Canonico 2018 元分析 (DOI:10.1136/bmj.k4810)".
Bottom: small footnote "OR = 相对风险比，1.0 = 与基线一致".
Use clean medical-chart aesthetic, neutral gridlines, transparent background.
Make sure the highlighted bar (口服) uses #C84B7C and stays readable on dark #1a1625 and light #FFF5E0.

Negative: no anime, no clutter, no fake brand names, no 3D effects, no watermark, no blurry text.
```

**生成验收：** OR 数值与 Canonico 2018 一致；口服显著高于贴片/凝胶；注射用虚线表达"数据有限"。

---

## #6  P0  CPA 脑膜瘤剂量风险曲线

- **目标文件**：`public/images/diagrams/zh/cpa-meningioma-risk.webp`（已存在）
- **插入位置**：`src/content/docs/zh/dose-limits.mdx` → § 4.1 "各药物最大剂量表" → `### 剂量与风险的关系` 段落之后
- **推荐尺寸**：1536x1024（横版折线图）
- **alt 文本**：`色普龙（CPA）脑膜瘤风险与日剂量关系曲线：5 mg/天 OR≈1.0、12.5 mg/天 OR≈3.5、25 mg/天 OR≈12.36、50 mg/天 OR>20，标注 EMA 2020 警告线`

**gpt-image-2 prompt：**
```
A medical risk curve titled "CPA 日剂量 vs 脑膜瘤风险 (OR)"
X-axis: CPA daily dose in mg, ticks at 5 / 12.5 / 25 / 50.
Y-axis: Odds Ratio (OR), log-style scale, ticks at 1 / 3 / 10 / 30.
Curve is a smooth ascending line passing through approximate points:
  (5 mg, OR ≈ 1.0), (12.5 mg, OR ≈ 3.5), (25 mg, OR ≈ 12.36), (50 mg, OR ≈ 22+).
Stroke color #C84B7C, line thickness ~3px equivalent.
Add a vertical dashed warning line at x = 25 mg labeled "EMA 2020 限制阈值".
Shaded danger zone (light pink-red overlay) above OR = 10.
Add three callout pills along the curve:
  "5 mg · 安全区间", "12.5 mg · 推荐上限", "25 mg+ · EMA 警告".
Bottom right: tiny citation "Lee et al. 2022 · Hudelist et al. 2026 · EMA 2020".
Transparent background, clean axis lines, simplified Chinese labels ≥ 14pt.

Negative: no anime, no clutter, no 3D, no watermark, no blurry text, no graphic medical imagery.
```

**生成验收：** 曲线斜率明显（剂量翻倍 → OR 数倍上升）；25 mg 警告线醒目；引用 Lee 2022 + EMA 2020。

---

## #7  P0  首次注射部位解剖图（SC + IM）

- **目标文件**：`public/images/diagrams/zh/injection-sites-anatomy.webp`（已存在）
- **插入位置**：`src/content/docs/zh/guides/first-injection.mdx` → `### 注射操作图解` 章节内、操作步骤图之前
- **推荐尺寸**：1024x1536（3:4 竖版，便于身体部位标注）
- **alt 文本**：`首次注射部位解剖示意图：左侧 IM 肌内注射推荐部位（股外侧肌、臀大肌外上象限、三角肌），右侧 SC 皮下注射推荐部位（腹部脐周、大腿前侧、上臂外侧），抽象人体轮廓加部位高亮`

**gpt-image-2 prompt：**
```
A medical anatomical reference titled "首次注射 · 推荐部位 (SC vs IM)"
arranged as two simplified abstract human silhouettes side by side
(geometric outline only, NO realistic skin, NO gender features, neutral mannequin look):
LEFT silhouette labeled "IM 肌内注射" with three highlighted zones:
  "股外侧肌 (大腿外侧中段)", "臀大肌外上象限", "三角肌 (上臂)".
RIGHT silhouette labeled "SC 皮下注射" with three highlighted zones:
  "腹部脐周 (避开脐 5cm)", "大腿前侧", "上臂外侧".
Highlight zones rendered as soft circles with #C84B7C fill at 40% opacity and a thin label arrow
pointing to a side caption.
Below the silhouettes, a small comparison strip:
  "IM · 90° 角 · 23-25G 1-1.5 inch" vs "SC · 45-90° 角 · 25-27G 5/8 inch".
Use thin ink stroke for the silhouette outline (#4A2838), transparent background,
asexualized geometric form (no chest, hip, or genital detail).
Style: scientific anatomy diagram, vector, educational, gender-neutral.

Negative: no anime, no realistic body, no nudity, no sexualization, no skin tone,
no gendered features, no graphic blood, no needle photoreal, no watermark.
```

**生成验收：** 两套部位（SC/IM）共 6 个区可辨；人体轮廓抽象无性别特征；针头规格说明准确。

---

## #8  P0  抗雄激素四方案速查表（效能-风险-可及性矩阵）

- **目标文件**：`public/images/diagrams/zh/antiandrogens-matrix.webp`（**新建**）
- **插入位置**：`src/content/docs/zh/medications/antiandrogens/overview.mdx` → § "四种抗雄方案对比" 标题之后
- **推荐尺寸**：1536x1024（横版矩阵）
- **alt 文本**：`四种抗雄激素方案对比矩阵：CPA 低剂量、螺内酯、GnRH 激动剂、比卡鲁胺，按效能、风险、可及性、价格四维度评分，CPA/螺内酯为常规选择，GnRH 为理想选择，比卡鲁胺不推荐常规使用`

**gpt-image-2 prompt：**
```
A 4x4 comparison matrix titled "抗雄方案速查 · 效能 · 风险 · 可及性 · 价格"
ROWS (top to bottom):
  "CPA 低剂量 (5-12.5 mg/天)",
  "螺内酯 (50-200 mg/天)",
  "GnRH 激动剂 (亮丙瑞林等)",
  "比卡鲁胺 (50 mg/天)".
COLUMNS (left to right):
  "效能 (Potency)", "风险 (Risk)", "可及性 (Access · 中国大陆)", "价格 (Cost)".
Each cell shows a 5-circle bar (filled vs empty) representing strength on that axis.
Suggested fills:
  CPA 低剂量:        效能 4/5 · 风险 2/5 · 可及性 3/5 · 价格 5/5
  螺内酯:           效能 3/5 · 风险 2/5 · 可及性 4/5 · 价格 5/5
  GnRH 激动剂:      效能 5/5 · 风险 1/5 · 可及性 1/5 · 价格 1/5
  比卡鲁胺:         效能 4/5 · 风险 4/5 · 可及性 2/5 · 价格 3/5  + 红色 ⚠ 角标
Header row uses subtle gold accent (#D4A853). The "比卡鲁胺" row carries a small "⚠ 不推荐常规" badge in #C84B7C.
Below the matrix: legend "● 已填 = 强 · ○ 空 = 弱  |  风险列：填越多 = 风险越高".
Transparent background. Clean simplified-Chinese labels.

Negative: no anime, no clutter, no fake brand logos, no 3D, no watermark, no blurry text.
```

**生成验收：** 四种方案分值与 MDX 推荐顺序一致（CPA/螺内酯 → 常规、GnRH → 理想、比卡鲁胺 → 谨慎）。

---

## #9  P0  危险药物组合禁忌速查

- **目标文件**：`public/images/diagrams/zh/dangerous-combinations.webp`（**新建**）
- **插入位置**：`src/content/docs/zh/dose-limits.mdx` → § 4.2 "危险的药物组合" → `### 禁止组合` 段落之前
- **推荐尺寸**：1024x1024（1:1 速查卡）
- **alt 文本**：`危险药物组合禁忌速查卡：CPA + 高剂量 E2 注射、螺内酯 + 钾保留药、达英-35 + CPA、CPA + 雌激素受体调节剂等四组红色禁止组合，附风险机制简注`

**gpt-image-2 prompt：**
```
A square emergency-style reference card titled "危险药物组合 · 禁止 (DO NOT COMBINE)"
showing four prohibition rows. Each row presents two pill/tablet icons with a large red ⊘ symbol
between them, plus a one-line explanation:
ROW 1: "CPA 25mg+ × 高剂量 E2 注射"  →  "脑膜瘤 + VTE 双重叠加"
ROW 2: "螺内酯 × 钾保留药 (ACEI/ARB/补钾)"  →  "高钾血症致命风险"
ROW 3: "达英-35 (CPA 2mg + EE 35μg) × 额外 CPA"  →  "CPA 实际暴露超 25mg"
ROW 4: "CPA × 他莫昔芬/雷洛昔芬"  →  "对抗机制 · 抵消 HRT 效果"
The card has a strong red header band (#C84B7C) with white text "禁止组合 · DO NOT COMBINE".
Body uses clean white card on transparent background; text neutral ink for both-theme readability.
Each pill icon is a simple geometric capsule (no brand markings).
Bottom-right footnote: "数据来源: EMA 2020 / WPATH SOC 8 / Endocrine Society 2017".

Negative: no anime, no realistic medication photos, no fake brand logos, no clutter,
no watermark, no graphic medical imagery, no blurry text.
```

**生成验收：** 4 组组合明确、⊘ 符号醒目、机制注释准确（脑膜瘤+VTE / 高钾 / 实际暴露 / 对抗）。

---

## #10  P0  E2 剂量阶梯与发育窗口关闭对比

- **目标文件**：`public/images/diagrams/zh/e2-staircase.webp`（已存在，复核曲线）
- **插入位置**：`src/content/docs/zh/breast-development.mdx` → § 5.4 "正确的阶梯式方案" → `### E2 水平阶梯总览` 段落之后
- **推荐尺寸**：1536x1024（横版双线对比）
- **alt 文本**：`E2 剂量阶梯发育对比图：上线为推荐阶梯式方案（200 → 300 → 400 pg/mL，发育窗口持续打开），下线为冒进高剂量方案（>500 pg/mL，导管期被跳过、窗口提前关闭）`

**gpt-image-2 prompt：**
```
A two-line comparison chart titled "E2 剂量阶梯 vs 发育窗口"
X-axis: time in months, ticks 0 / 6 / 12 / 18 / 24.
Y-axis: serum E2 in pg/mL, ticks 100 / 200 / 300 / 400 / 500 / 600.
LINE A "推荐阶梯式 (Recommended Staircase)" — green-teal #5AC89D smooth ascending stairs
  through points: (0,150) → (3,200) → (9,300) → (18,400). Below the line, soft fill labeled
  "持续刺激导管分支 → 终末分化窗口持续打开".
LINE B "冒进高剂量 (Reckless High Dose)" — red #C84B7C steep curve jumping to (1,500) → (3,600+) and plateauing.
  Above this curve, a "X 早闭" marker; beneath, label "跳过导管期 → 终末分化提前锁定".
Between two lines, a vertical bracket marker at month 12 with the caption "发育窗口对比节点".
Add a top-right legend showing the two line styles and a small footnote
"目标区间灰色带 200-400 pg/mL · WPATH SOC 8".
Transparent background, neutral ink axis labels for both-theme readability.

Negative: no anime, no clutter, no 3D effects, no watermark, no blurry text.
```

**生成验收：** 两条曲线形态差异明显（阶梯 vs 跳跃）；目标区间 200-400 pg/mL 灰带可见；引用 WPATH SOC 8。

---

# P1 次优批次（10 张）

## #11  P1  中国 HRT 药物可及性热力图

- **目标文件**：`public/images/diagrams/zh/china-availability-heatmap.webp`（**新建**）
- **插入位置**：`src/content/docs/zh/china-reality.mdx` → § "中国 HRT 路径图：5 步走" 之前的开场段（约第 76 行附近，作为开篇视觉）
- **推荐尺寸**：1536x1024（横版热力图）
- **alt 文本**：`中国大陆 HRT 药物可及性热力图：行=药物类别（口服 E2、注射 E2、贴片、凝胶、CPA、螺内酯、孕激素），列=药物可及性渠道（医院处方、网络药房、海淘、地下市场），颜色越深表示可及性越好`

**gpt-image-2 prompt：**
```
A heatmap titled "中国大陆 HRT 药物可及性 (2025 现状)"
ROWS (drug categories): "口服 E2", "注射 E2 (戊酸/环戊丙酸)", "经皮贴片", "经皮凝胶",
                        "CPA (色普龙)", "螺内酯", "孕激素 (微粒化/地屈)".
COLUMNS (access channels): "三甲医院处方", "互联网药房 (合规)", "海外代购", "地下市场".
Cell shading scale (5 levels): 深粉 #C84B7C = 高可及, 中粉 = 中, 浅粉 = 低, 灰 = 极低/不可获得, 红斜线 = 受限/警示.
Suggested fills (educational approximation, NOT prescriptive):
  口服 E2:       医院 中 / 互联网 高 / 海外 高 / 地下 中
  注射 E2:       医院 低 / 互联网 极低 / 海外 中 / 地下 中
  贴片:         医院 中 / 互联网 中 / 海外 高 / 地下 低
  凝胶:         医院 中 / 互联网 低 / 海外 高 / 地下 低
  CPA:          医院 中 / 互联网 极低 / 海外 中 / 地下 中
  螺内酯:        医院 高 / 互联网 高 / 海外 高 / 地下 高
  孕激素:        医院 高 / 互联网 中 / 海外 高 / 地下 低
Add right-side legend with the 5 shading levels.
Bottom footnote: "本图基于 2022 年网售禁令后社区调研，仅作信息参考，非购药指南。"
Transparent background, simplified-Chinese labels.

Negative: no anime, no real brand names, no purchase links, no watermark, no blurry text.
```

**生成验收：** 7 种药 × 4 渠道矩阵完整；色阶清晰；底部"非购药指南"免责声明可读。

---

## #12  P1  VTE 风险因素累加模型

- **目标文件**：`public/images/diagrams/zh/vte-risk-stacking.webp`（**新建**）
- **插入位置**：`src/content/docs/zh/risks.mdx` → § 7.1 "HRT 的已知风险" → "深静脉血栓 (DVT)" 卡片之后（约第 51 行后插入）
- **推荐尺寸**：1024x1536（3:4 竖版，金字塔/累加堆叠）
- **alt 文本**：`VTE 风险因素累加模型金字塔：基线人群风险 0.1%、加雌激素口服 +0.4%、加吸烟 +0.5%、加 BMI>30 +0.5%、加既往血栓史 +2%、加遗传性凝血异常 +5%，累加可达年度 8% 以上`

**gpt-image-2 prompt：**
```
A vertical stacking pyramid infographic titled "VTE 风险因素累加 (Year Risk %)"
showing layered horizontal bars stacking upward from a baseline:
LAYER 1 (bottom, light gray): "顺性别同龄基线" 0.1%/年.
LAYER 2 (light pink): "+ 口服雌激素 (vs 经皮)" +0.4% → 累计 0.5%.
LAYER 3 (pink): "+ 吸烟 (>10 支/天)" +0.5% → 累计 1.0%.
LAYER 4 (deeper pink): "+ BMI > 30" +0.5% → 累计 1.5%.
LAYER 5 (red-pink): "+ 既往 DVT/PE 史" +2.0% → 累计 3.5%.
LAYER 6 (top, dark red #C84B7C): "+ 遗传性凝血异常 (Factor V Leiden 等)" +5.0% → 累计 8.5%+.
Each layer has its own label on the right side and a thin tick on a vertical % axis (0 / 1 / 2 / 5 / 10).
Top of pyramid: warning icon (⚠) with label "高叠加 → 强烈建议改经皮 + 戒烟".
Right-side: small footnote "估算综合自 Canonico 2018 / EMA 2020 / WPATH SOC 8".
Transparent background, neutral ink labels.

Negative: no anime, no clutter, no 3D, no watermark, no blurry text.
```

**生成验收：** 6 层叠加可见、累计 % 标注准确、顶层警示醒目。

---

## #13  P1  口服 vs 注射 E2 血药浓度波形对比

- **目标文件**：`public/images/diagrams/zh/oral-vs-injection-curves.webp`（**新建**）
- **插入位置**：`src/content/docs/zh/compare/oral-vs-injection.mdx` → § "血药浓度稳定性" 标题之后
- **推荐尺寸**：1536x1024（横版双曲线）
- **alt 文本**：`口服 vs 肌内注射 E2 血药浓度对比波形图：口服每日两次呈现日内峰谷波动 (100-400 pg/mL)，注射每周一次呈现一周内由高峰 600 pg/mL 缓降至谷值 150 pg/mL`

**gpt-image-2 prompt：**
```
A pharmacokinetics line chart titled "口服 vs 注射 E2 · 血药浓度曲线"
X-axis: 时间 (天), 0-7 days, ticks every 1 day.
Y-axis: 血清 E2 (pg/mL), ticks 100 / 200 / 300 / 400 / 500 / 600.
LINE A "口服 estradiol valerate 2mg BID":
  pulsing wave with daily peaks ~400 pg/mL and troughs ~100 pg/mL, repeating every 12 hours.
  Color #5BA8E0 (蓝).
LINE B "肌内注射 estradiol valerate 4mg/周":
  smooth peak at day 1 (~600 pg/mL) descending exponentially to ~150 pg/mL at day 7.
  Color #C84B7C (绯).
Shaded target band 200-400 pg/mL in light gray across the chart.
Top-right legend explaining both lines.
Annotations:
  - On Line A: "波动大 · 日峰谷差 ~300 pg/mL"
  - On Line B: "周内单峰 · 谷值低于目标"
Bottom footnote: "示意性曲线 · 个体差异大 · 数据综合自 Endocrine Society 2017".
Transparent background, neutral ink axis.

Negative: no anime, no clutter, no 3D effects, no watermark, no blurry text.
```

**生成验收：** 两条曲线形态差异明显（脉冲 vs 单峰衰减）；目标带 200-400 pg/mL 标注；引用 ES 2017。

---

## #14  P1  监测时间表全景甘特图

- **目标文件**：`public/images/diagrams/zh/monitoring-gantt.webp`（**新建**）
- **插入位置**：`src/content/docs/zh/blood-tests.mdx` → § 6.1 "什么时候查、查什么" 标题之后、`### 阶段 1：起始期` 之前
- **推荐尺寸**：1536x1024（横版甘特图）
- **alt 文本**：`HRT 监测时间表甘特图：横轴为时间（启动至 24 个月），纵轴为检查项目（基线、激素六项、肝肾、电解质、凝血、骨密度、脑膜瘤筛查），不同颜色块标注必查/可选时段`

**gpt-image-2 prompt：**
```
A Gantt-style monitoring schedule titled "HRT 监测时间表 · 24 个月全景"
X-axis (time): "基线 / 1M / 3M / 6M / 9M / 12M / 18M / 24M".
Y-axis (test items, 7 rows top to bottom):
  "基线全套 (CBC + 肝肾 + 凝血 + 激素六项 + ECG)",
  "激素六项 (E2 / T / LH / FSH / PRL / SHBG)",
  "肝功能 (ALT / AST / ALP)",
  "肾功能 + 电解质 (Cr / K / Na)",
  "凝血 + D-Dimer (按需)",
  "骨密度 (DXA · 长期低 E2 风险)",
  "CPA 用户脑膜瘤筛查 (MRI 累积剂量 >10g)".
Cell legend: 深粉 #C84B7C = 必查, 浅粉 = 推荐, 灰 = 按需, 空 = 不需.
Suggested fill pattern:
  基线全套: 仅基线 必查
  激素六项: 1M/3M/6M 必查, 12M+ 必查每年
  肝功能: 3M/6M/12M 必查, 之后每年
  肾+电解质: 3M/6M/12M 必查 (螺内酯用户加强)
  凝血: 基线 + 按需
  骨密度: 24M 推荐 (长期低 E2 者)
  脑膜瘤筛查: 12M+ CPA 累积剂量超 10g 时
Right-side compact legend; bottom footnote "WPATH SOC 8 + Endocrine Society 2017".
Transparent background, simplified-Chinese.

Negative: no anime, no clutter, no fake medical chart numbers, no watermark, no blurry text.
```

**生成验收：** 7 行 × 8 时间点矩阵清晰；色阶 4 级可辨；CPA 脑膜瘤筛查节点准确。

---

## #15  P1  孕激素添加时机决策树

- **目标文件**：`public/images/diagrams/zh/progestogen-decision-tree.webp`（**新建**）
- **插入位置**：`src/content/docs/zh/breast-development.mdx` → § "关于孕激素添加时机" 标题之后、`### 支持添加的观点` 之前（约第 290 行附近）
- **推荐尺寸**：1024x1536（3:4 竖版决策树）
- **alt 文本**：`孕激素添加时机决策树：起点为"是否考虑加孕激素"，分支判断 E2 是否达标、Tanner 是否到 B3+、是否过 18 月、目标是否仅为乳房终末分化，最终落到"考虑加微粒化孕酮"或"暂不加 / 不加"`

**gpt-image-2 prompt：**
```
A vertical decision tree flowchart titled "孕激素 (Progestogen) · 是否添加 · 决策路径"
ROOT: rounded rectangle "是否考虑加孕激素？" branching downward.
Each branching node is a diamond labeled with a question; leaves are pill-shaped outcome boxes.
NODE 1 "E2 是否已稳定在 200-400 pg/mL ≥ 6 个月？"
  → 否 → "先调 E2 · 暂不加" (gray outcome)
  → 是 → 进入 NODE 2
NODE 2 "Tanner 是否到 B3 以上？"
  → 否 → "继续观察 · 暂不加" (gray)
  → 是 → 进入 NODE 3
NODE 3 "HRT 是否已超 18 个月？"
  → 否 → "继续观察 · 暂不加" (gray)
  → 是 → 进入 NODE 4
NODE 4 "目标是否为终末分化 / 月经样周期？"
  → 否 (无明确目标) → "WPATH 谨慎立场 · 暂不加" (light pink)
  → 是 → "可考虑微粒化孕酮 100-200mg 睡前" (deep pink #C84B7C 高亮)
Add a sidebar "禁忌警示": "禁用合成孕激素 (CPA / MPA / 地诺孕素) 替代 micronized progesterone".
Transparent background, simplified-Chinese, clean flowchart connectors.
Bottom footnote: "WPATH SOC 8 立场 · Endocrine Society 2017 · UCSF 2016".

Negative: no anime, no clutter, no fake brand logos, no watermark, no blurry text.
```

**生成验收：** 4 层决策节点路径清楚；最终建议指向"微粒化孕酮"；禁忌侧栏（禁用合成孕激素）醒目。

---

## #16  P1  螺内酯高钾血症监测信息图

- **目标文件**：`public/images/diagrams/zh/spironolactone-potassium.webp`（**新建**）
- **插入位置**：`src/content/docs/zh/medications/antiandrogens/spironolactone.mdx` → § "不良反应" → `### 高钾血症（最重要的风险）` 段落之后
- **推荐尺寸**：1024x1024（1:1 速查卡）
- **alt 文本**：`螺内酯高钾血症监测速查卡：血钾正常 3.5-5.0 mmol/L、5.1-5.5 警戒、5.6-6.0 减量复查、>6.0 立即停药就医，叠加风险因素清单（ACEI/ARB、补钾、肾功能不全、高钾饮食）`

**gpt-image-2 prompt：**
```
A square reference card titled "螺内酯 · 血钾监测速查 (K⁺ mmol/L)"
divided into a vertical 4-band thermometer:
  BAND A (3.5 - 5.0)  绿  "正常 · 维持当前剂量"
  BAND B (5.1 - 5.5)  黄  "警戒 · 4 周内复查 + 评估饮食/合并用药"
  BAND C (5.6 - 6.0)  橙  "减量 50% + 1 周复查"
  BAND D (> 6.0)     红  "⚠ 立即停药 · 急诊 · 心电图"
Each band has a number range, color block, and one-line action.
On the right side of the thermometer, a "风险因素叠加清单" listing:
  "□ ACEI / ARB (普利/沙坦类)",
  "□ 补钾药 / 含钾饮料",
  "□ 高钾饮食 (香蕉/橘子/土豆)",
  "□ 肾功能 eGFR < 60",
  "□ 严重脱水".
Bottom footnote: "数据综合自 Endocrine Society 2017 / UCSF 2016 / 中国心血管学会高钾血症共识".
Transparent background, simplified-Chinese.

Negative: no anime, no clutter, no fake brand logos, no realistic medical imagery, no watermark, no blurry text.
```

**生成验收：** 4 段血钾区间与行动清晰；5 项风险因素 checklist 完整；引用源标注。

---

## #17  P1  达英-35 vs 真正 HRT 对比

- **目标文件**：`public/images/diagrams/zh/diane-35-vs-hrt.webp`（**新建**）
- **插入位置**：`src/content/docs/zh/dose-limits.mdx` → § 4.3 "常见错误方案批评" → `### "达英-35 当 HRT"` 段落之后
- **推荐尺寸**：1536x1024（横版双栏对比）
- **alt 文本**：`达英-35 vs 真正 HRT 方案对比：达英-35 含 CPA 2mg + 炔雌醇 35μg（避孕药级别），真正 HRT 用 estradiol valerate 2-4mg + 低剂量 CPA 5-12.5mg，标注炔雌醇 VTE 风险显著高于 estradiol`

**gpt-image-2 prompt：**
```
A two-column comparison sheet titled "达英-35 ≠ HRT · 用药对比"
LEFT column "达英-35 (Diane-35) · 避孕药":
  "成分: CPA 2mg + 炔雌醇 (Ethinyl estradiol) 35μg / 片"
  "设计目的: 避孕 / 痤疮治疗 (顺性别女性)"
  "VTE 风险: 显著 (炔雌醇 vs estradiol = ~2-4 倍)"
  "E2 当量: 极低 (无法满足 HRT 目标 200-400 pg/mL)"
  "结论: ⚠ 不能替代 HRT".
RIGHT column "真正 HRT 标准方案":
  "成分: estradiol valerate 2-4mg/天 OR 注射 4mg/周"
  "+ 低剂量 CPA 5-12.5mg/天 OR 螺内酯 50-200mg/天"
  "VTE 风险: 经皮/注射 < 口服 EV ≈ EV 口服"
  "E2 目标: 200-400 pg/mL"
  "结论: ✓ 符合循证指南".
Top header strip: 红色警告条 "达英-35 当 HRT 是常见误区 · 危险且无效".
Use neutral cards on transparent background; left card has a subtle red tint, right card has a teal tint.
Bottom footnote: "WPATH SOC 8 · Endocrine Society 2017 · EMA 2018 (Ethinyl Estradiol VTE warning)".

Negative: no anime, no clutter, no fake brand logos beyond the generic "达英-35" textual reference,
no real pill photos, no watermark, no blurry text.
```

**生成验收：** 左右栏成分/E2 目标/VTE 风险对照清楚；红色警示头条醒目；引用 EMA 2018。

---

## #18  P1  顺性别青春期 vs HRT 时间线对比

- **目标文件**：`public/images/diagrams/zh/cis-vs-hrt-timeline.webp`（已存在）
- **插入位置**：`src/content/docs/zh/breast-development.mdx` → § "与顺性别发育的时间线对比" 之后、`### 合理预期` 之前（约第 258 行附近）
- **推荐尺寸**：1536x1024（横版双时间线）
- **alt 文本**：`顺性别青春期发育 vs HRT 发育时间线对比：上线为顺性别 8-17 岁连续 8-9 年发育，下线为 HRT 用户 0-3 年快速进入 Tanner B3-B4，标注顺性别完成 B5 通常需 5+ 年`

**gpt-image-2 prompt：**
```
A two-track horizontal timeline comparison titled "顺性别青春期 vs HRT · 乳房发育时间线"
TOP TRACK "顺性别青春期发育":
  X axis 8-18 岁 (10 years span);
  bar segments showing Tanner B1 / B2 / B3 / B4 / B5 spreading roughly:
    B1 → B2 (~10岁), B2 → B3 (~12岁), B3 → B4 (~14岁), B4 → B5 (~16-17岁).
  Color: 浅金 #D4A853.
BOTTOM TRACK "HRT 用户 (估算)":
  X axis 0-36 月 (compressed scale, with note "横轴非等比");
  bar segments showing:
    B1-B2 月 0-6, B2-B3 月 6-18, B3-B4 月 18-36, B5 多数 "可能不完全".
  Color: 深粉 #C84B7C.
Between the tracks, a vertical bracket annotation:
  "顺性别 ~ 8-9 年完成 / HRT ~ 2-3 年达到 B3-B4 · B5 通常不完全".
Bottom footnote: "估算时间线 · 个体差异极大 · 综合 Endocrine Society 2017 / WPATH SOC 8".
Transparent background, simplified-Chinese.

Negative: no anime, no body silhouettes, no nudity, no clutter, no watermark, no blurry text.
```

**生成验收：** 两条轨道时间尺度差异明显；B5 不完全的注释清晰；不出现人体轮廓。

---

## #19  P1  紧急症状速查卡

- **目标文件**：`public/images/diagrams/zh/emergency-signs.webp`（已存在）
- **插入位置**：`src/content/docs/zh/risks.mdx` → § 7.2 "必须立即停药就医的症状" 标题之后（已在第 35 行使用，此项为复核）
- **推荐尺寸**：1024x1024（1:1 速查卡，已存在为 800x400 横版，重做时改为 1:1）
- **alt 文本**：`HRT 紧急症状速查卡：胸痛/呼吸困难（疑似 PE/DVT）、单侧小腿肿胀剧痛（DVT）、视力突变/听力丧失（脑膜瘤）、巩膜黄染/茶色尿（肝衰）、自杀意念，附 120 急诊与心理热线`

**gpt-image-2 prompt：**
```
A square emergency reference card titled "⚠ HRT 紧急症状 · 立即停药 + 就医"
showing 5 emergency symptom cards in a 2-3 grid layout:
1. "胸痛 / 呼吸困难"  → "疑似肺栓塞 (PE) · 拨 120"
2. "单侧小腿红肿剧痛"  → "疑似深静脉血栓 (DVT) · 急诊"
3. "视力突变 / 听力丧失 / 异常头痛"  → "疑似脑膜瘤 · MRI"
4. "巩膜黄染 / 茶色尿 / 极度疲劳"  → "疑似肝衰 · 急诊"
5. "持续自杀意念 / 无端绝望"  → "心理热线 800-810-1117 / 北京 010-82951332"
Each card uses a strong red header band (#C84B7C with white text) and a black/ink body.
Top of the layout has a red ⚠ icon.
Bottom strip: "本卡为速查 · 不替代医疗判断 · 请保留就医记录".
Transparent background, simplified-Chinese ≥ 14pt equivalent.

Negative: no anime, no realistic medical imagery, no graphic blood, no clutter, no watermark, no blurry text.
```

**生成验收：** 5 类急症 + 行动指引清楚；心理热线号码准确（与 `src/data/hotlines.json` 一致）；红色不可"看不到"。

---

## #20  P1  剂量与女性化收益递减曲线

- **目标文件**：`public/images/diagrams/zh/dose-diminishing-returns.webp`（**新建**）
- **插入位置**：`src/content/docs/zh/dose-limits.mdx` → § 4.1 "各药物最大剂量表" → `### 剂量与风险的关系` 段落之内（与 #6 CPA 曲线相邻，建议放 CPA 曲线之前）
- **推荐尺寸**：1536x1024（横版双 Y 轴）
- **alt 文本**：`E2 剂量与女性化收益/风险关系曲线：横轴为 E2 血清浓度 0-800 pg/mL，左纵轴为女性化收益（在 200-400 平台后递减），右纵轴为 VTE/肝/情绪综合风险（>400 后陡升），标注最佳目标区间 200-400 pg/mL`

**gpt-image-2 prompt：**
```
A dual-axis line chart titled "E2 浓度 · 收益 vs 风险"
X-axis: 血清 E2 (pg/mL), ticks 0 / 100 / 200 / 300 / 400 / 500 / 600 / 700 / 800.
LEFT Y-axis (收益): "女性化效果指数 (相对值)" 0-100.
RIGHT Y-axis (风险): "VTE + 肝 + 情绪 综合风险指数" 0-100.

CURVE A "女性化收益" (绿-青 #5AC89D):
  快速上升 0 → 200 pg/mL 达到 ~70%,
  缓增 200 → 400 达到 ~85%,
  之后 400 → 800 几乎平台 (~88%) — 明显递减.
CURVE B "综合风险" (红 #C84B7C):
  缓慢 0-300 ~10%,
  在 400 开始翘起 ~25%,
  在 600 ~50%, 在 800 陡升 ~80%+.

Shaded green band 200-400 pg/mL labeled "最佳目标区间 · 收益高 + 风险低".
Right side of 600 pg/mL: hatched red zone labeled "高风险区 · 收益已饱和".
Bottom footnote: "示意性曲线 · 综合 WPATH SOC 8 / Endocrine Society 2017 / Canonico 2018".
Transparent background.

Negative: no anime, no clutter, no 3D, no watermark, no blurry text.
```

**生成验收：** 两条曲线交叉点形态正确（收益饱和 + 风险陡升）；目标带 200-400 pg/mL 醒目。

---

# P2 增强批次（3 张）

## #21  P2  基线检查项目快速导航

- **目标文件**：`public/images/diagrams/zh/baseline-tests-nav.webp`（**新建**）
- **插入位置**：`src/content/docs/zh/before-you-start.mdx` → § 1.1 "基准检查清单 (Baseline Tests)" 标题之后
- **推荐尺寸**：1024x1024（1:1 速查卡）
- **alt 文本**：`HRT 启动前基线检查项目导航卡：血常规、肝肾功能、电解质、凝血、激素六项（E2/T/LH/FSH/PRL/SHBG）、空腹血糖与血脂、ECG/血压，分四组用图标速览`

**gpt-image-2 prompt：**
```
A square navigation card titled "HRT 启动前 · 基线检查项目"
showing 4 grouped sectors (2x2 grid):

SECTOR 1 "血液常规 + 凝血":
  icon: tube + droplet
  items: "CBC (Hb / Hct / 血小板 / WBC)", "PT / APTT / D-Dimer (高危者加做)".

SECTOR 2 "肝肾功能 + 电解质":
  icon: liver-kidney symbol
  items: "ALT / AST / ALP", "Cr / BUN / eGFR", "Na / K / Cl (螺内酯前必查)".

SECTOR 3 "激素六项":
  icon: hormone-curve
  items: "E2 (雌二醇)", "T (睾酮)", "LH / FSH", "PRL (泌乳素)", "SHBG".

SECTOR 4 "代谢 + 心血管":
  icon: heart-ECG
  items: "空腹血糖 + HbA1c", "血脂 (TC / LDL / HDL / TG)", "血压 + ECG".

Center divider: "采血时段 · 晨 8-10 点 · 注射用户取谷值".
Bottom footnote: "WPATH SOC 8 + Endocrine Society 2017 + UCSF 2016".
Use 4 distinct subtle accent colors (粉/金/青/蓝), all readable on dark and light backgrounds.
Transparent background, simplified-Chinese.

Negative: no anime, no clutter, no fake brand logos, no watermark, no blurry text.
```

**生成验收：** 4 组检查项目无遗漏；时段提示与 MDX 一致；四象限色调和谐。

---

## #22  P2  情绪与抑郁风险监测信息图

- **目标文件**：`public/images/diagrams/zh/mood-monitoring.webp`（**新建**）
- **插入位置**：`src/content/docs/zh/risks.mdx` → § 7.1 "HRT 的已知风险" → "情绪波动与抑郁" 卡片之后（约第 103 行附近）
- **推荐尺寸**：1024x1024（1:1 信息图）
- **alt 文本**：`HRT 情绪与抑郁风险监测信息图：CPA 引发的情绪波动发生率 5-15%、E2 过低也可能加重抑郁，建议每 1-3 个月做 PHQ-9 自评，附求助路径（朋辈/心理咨询/急诊）`

**gpt-image-2 prompt：**
```
A square infographic titled "HRT · 情绪与抑郁监测"
divided into three horizontal bands:

BAND 1 "可能诱因":
  - "CPA 孕激素活性 → 情绪波动 / 抑郁 (5-15%)"
  - "E2 过低 (< 100 pg/mL 持续) → 加重抑郁"
  - "孤立 / 缺乏支持网络"
  Use a soft 浅紫 #9B7DD4 banner.

BAND 2 "建议监测频率":
  - "起始期 (0-6M): PHQ-9 自评 每月 1 次"
  - "调整期 (6-12M): PHQ-9 每 3 个月"
  - "维持期: PHQ-9 每 6 个月 + 任何剂量调整后"
  Use a 蜂蜜金 #F5B347 banner.

BAND 3 "求助路径 (升级阶梯)":
  - 1️⃣ "朋辈支持 (社区 / 互助群)"
  - 2️⃣ "心理咨询师 (跨儿友好 / WPATH 培训)"
  - 3️⃣ "精神科医生 (PHQ-9 ≥ 15 时)"
  - 4️⃣ "⚠ 急诊 (持续自杀意念) · 800-810-1117 / 010-82951332"
  Use a 樱花深粉 #E5578B banner.

Bottom: small footnote "WPATH SOC 8 · 不能替代专业评估".
Transparent background, simplified-Chinese.

Negative: no anime, no realistic faces, no triggering imagery, no clutter, no watermark, no blurry text.
```

**生成验收：** 3 段（诱因/频率/求助）逻辑清楚；4 级求助阶梯准确；热线号码与 hotlines.json 一致。

---

## #23  P2  隆胸 vs 自体脂肪移植对比

- **目标文件**：`public/images/diagrams/zh/breast-surgery-comparison.webp`（**新建**）
- **插入位置**：`src/content/docs/zh/breast-development.mdx` → § "如果对发育结果不满意" → `### 2. 隆胸手术` 之后、`### 3. 不做手术也可以` 之前
- **推荐尺寸**：1536x1024（横版双栏）
- **alt 文本**：`隆胸 vs 自体脂肪移植对比表：硅胶/盐水假体（增量大、需 10-15 年更换、有包膜挛缩风险），自体脂肪移植（增量小、需多次、吸收率 30-50%、无外置物风险），从效果、风险、维护、费用四维度对比`

**gpt-image-2 prompt：**
```
A two-column surgical comparison sheet titled "隆胸 vs 自体脂肪移植 · 对比"
LEFT column "硅胶 / 盐水假体 (Implant)":
  "效果增量: 显著 (一次到位 1-2 杯)"
  "维护周期: 10-15 年需考虑更换"
  "主要风险: 包膜挛缩 / 假体破裂 / BIA-ALCL (罕见)"
  "费用: 中-高"
  "适用: 自体脂肪不足 / 需大幅增量"
  Icon: a stylized geometric capsule shape (no realistic body).

RIGHT column "自体脂肪移植 (Fat Transfer)":
  "效果增量: 单次 0.5-1 杯 (吸收率 30-50%)"
  "维护周期: 通常需 2-3 次"
  "主要风险: 脂肪坏死 / 钙化 / 影响乳腺影像学"
  "费用: 中"
  "适用: 自身有脂肪储备 / 拒绝植入物"
  Icon: a stylized cluster of dots (no realistic body).

Center divider: 灰底 "选择前必读 · 与整形外科 + 内分泌科共同评估".
Top header strip: 蜂蜜金 #D4A853 "外科补救 · 不能替代 HRT 阶梯方案".
Transparent background, simplified-Chinese.
Bottom footnote: "ASPS 2024 · WPATH SOC 8 (gender-affirming top surgery)".

Negative: no anime, no realistic body, no nudity, no surgical photos, no graphic medical imagery,
no fake brand names of implants, no clutter, no watermark, no blurry text.
```

**生成验收：** 两栏 4 维度对照清楚；不出现写实身体或手术图；引用 ASPS 2024 + WPATH。

---

# 索引：编号 → 文件名 → 目标 MDX

| # | 优先级 | 文件名（webp） | 目标 MDX | 章节锚点 | 尺寸 |
|---|---|---|---|---|---|
| 1 | P0 | pathway-timeline | pathway.mdx | hero 之后 | 1536x1024 |
| 2 | P0 | tanner-stages | breast-development.mdx | § 5.1 | 1536x1024 |
| 3 | P0 | duct-branching | breast-development.mdx | § 5.3 两阶段后 | 1536x1024 |
| 4 | P0 | blood-tubes | blood-tests.mdx | 采血注意事项后 | 1536x1024 |
| 5 | P0 | routes-vte-comparison | medications/estrogens/overview.mdx | VTE 对比节 | 1536x1024 |
| 6 | P0 | cpa-meningioma-risk | dose-limits.mdx | § 4.1 剂量与风险后 | 1536x1024 |
| 7 | P0 | injection-sites-anatomy | guides/first-injection.mdx | 注射操作图解 | 1024x1536 |
| 8 | P0 | antiandrogens-matrix | medications/antiandrogens/overview.mdx | 四种抗雄方案对比 | 1536x1024 |
| 9 | P0 | dangerous-combinations | dose-limits.mdx | § 4.2 禁止组合前 | 1024x1024 |
| 10 | P0 | e2-staircase | breast-development.mdx | § 5.4 阶梯总览后 | 1536x1024 |
| 11 | P1 | china-availability-heatmap | china-reality.mdx | 路径图前开篇 | 1536x1024 |
| 12 | P1 | vte-risk-stacking | risks.mdx | § 7.1 DVT 卡片后 | 1024x1536 |
| 13 | P1 | oral-vs-injection-curves | compare/oral-vs-injection.mdx | 血药浓度稳定性 | 1536x1024 |
| 14 | P1 | monitoring-gantt | blood-tests.mdx | § 6.1 总览 | 1536x1024 |
| 15 | P1 | progestogen-decision-tree | breast-development.mdx | 孕激素时机段 | 1024x1536 |
| 16 | P1 | spironolactone-potassium | medications/antiandrogens/spironolactone.mdx | 高钾血症节后 | 1024x1024 |
| 17 | P1 | diane-35-vs-hrt | dose-limits.mdx | § 4.3 达英-35 后 | 1536x1024 |
| 18 | P1 | cis-vs-hrt-timeline | breast-development.mdx | 时间线对比段 | 1536x1024 |
| 19 | P1 | emergency-signs | risks.mdx | § 7.2 起始 | 1024x1024 |
| 20 | P1 | dose-diminishing-returns | dose-limits.mdx | § 4.1 剂量与风险节 | 1536x1024 |
| 21 | P2 | baseline-tests-nav | before-you-start.mdx | § 1.1 | 1024x1024 |
| 22 | P2 | mood-monitoring | risks.mdx | § 7.1 情绪卡片后 | 1024x1024 |
| 23 | P2 | breast-surgery-comparison | breast-development.mdx | 外科补救段 | 1536x1024 |
