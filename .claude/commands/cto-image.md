---
name: cto-image
description: 图像生成委派分流（§26.5）— 根据用途自动选择 Codex (gpt-image-2) 或 Antigravity (Nano Banana Pro)，输出可执行委派指令
argument-hint: "[用途描述] 例如: hero 插画 / logo / icon 套装 / wireframe"
allowed-tools: ["Read", "Glob", "Grep"]
model: sonnet
disable-model-invocation: false
---

# 图像生成委派分流（手册 §26.5）

根据用途自动决定委派给 Codex（asset-in-loop）还是 Antigravity（mockup-first），输出**可粘贴到目标平台**的委派指令。

## 参数

`$ARGUMENTS` = 图像用途描述（必须提供）

例：
- `/cto-image 登录页 hero 插画 4K 含 slogan 文字`
- `/cto-image React 商品列表 wireframe 用户先看`
- `/cto-image 8 个游戏 icon 风格统一`
- `/cto-image 含最新地图的营销图`

## 执行步骤

### 1. 用途分类（决策树）

按手册 §26.5 决策矩阵分类：

| 关键词信号 | 委派目标 | 工作流 |
|---|---|---|
| `mockup` / `wireframe` / `用户审` / `先看` / `review` | Antigravity Stitch | mockup-first |
| `4K` / `海报` / `文字渲染` / `hero` / `营销图` / `final asset` | Codex gpt-image-2 | asset-in-loop |
| `icon 套装` / `精灵` / `批量` / `风格统一` | Codex gpt-image-2 | 同会话风格连贯 |
| `Logo` / `品牌主视觉` | Codex 主选 + Antigravity A/B | 多版本对比 |
| `含最新` / `实时数据` / `真实地图` / `当前事件` | Antigravity Nano Banana Pro | 联网 grounding |
| `数据可视化` / `chart` / `图表` | 拒绝（用代码 D3/recharts，LLM 生图不可靠） | — |

### 2. 读取项目设计系统（如有）

- 读取 `docs/ai-cto/DESIGN.md`（若存在）的 design tokens
- 读取 `CLAUDE.md` 的设计风格规范（如：暗色主题 / Ethereal 风格 / Material 等）
- 读取 `docs/ai-cto/PRODUCT-VISION.md` 的品牌调性

### 3. 输出委派指令

#### Codex 委派模板

```markdown
# 委派 Codex 生图（gpt-image-2 + image_gen 工具）

**任务**：[用途简述]

**Prompt 给 Codex Agent**:
"请使用 image_gen 工具生成以下图像，并按 OpenAI imagegen SKILL 规则操作（生成 → cp 到 workspace → 更新代码引用）：

输入描述：[详细 prompt，引用 DESIGN.md tokens]
- 风格：[参考项目设计系统]
- 分辨率：[1024² | 4K]
- 文字（如有）：[精确内容 + 字体方向]
- 输出位置：`<项目>/public/images/<filename>.png`
- 代码集成：在 `<组件路径>` 中 import 并使用

完成后报告：(1) 生成的文件路径 (2) 修改的代码文件 (3) 用 `<img>` / `<Image>` 引用方式"
```

#### Antigravity 委派模板

```markdown
# 委派 Antigravity 生图（Stitch / Nano Banana Pro）

**任务**：[用途简述]

**Prompt 给 Antigravity Agent**:
"使用 Stitch 设计系统（或 Nano Banana Pro 直接生图）：

输入描述：[详细 prompt]
- 模式：mockup（用户审）/ final asset（直接交付）
- 风格：[设计 tokens]
- 实时数据需求：[如有]
- 五态覆盖（mockup 时）：空 / 加载 / 成功 / 错误 / 部分

完成后输出 Artifact，等用户反馈再迭代。"
```

### 4. 提示用户后续步骤

```markdown
## 推荐工作流

**Codex 路径**（asset-in-loop）：
1. 切到 Codex 桌面 App
2. 粘贴上方 Codex 委派 prompt
3. Codex agent 自动调 image_gen → 生图 → 落盘 → 改代码
4. 切回 Claude Code，git pull 拉取改动
5. 跑 `/cto-review` 验证图片质量 + 代码引用正确

**Antigravity 路径**（mockup-first）：
1. 切到 Antigravity IDE
2. 粘贴上方 Antigravity 委派 prompt
3. Stitch / Nano Banana 输出 Artifact
4. 用户 review → 反馈 → 迭代
5. 最终 export → cp 到 Claude Code 项目
```

### 5. 检查清单

输出前确认：
- [ ] 用途分类符合 §26.5 决策矩阵
- [ ] Prompt 引用了项目 design tokens（避免风格漂移）
- [ ] 输出路径明确（不留在 `$CODEX_HOME/generated_images/`）
- [ ] 大图压缩策略已说明（> 500KB → WebP/AVIF）
- [ ] 含人物 / 品牌的图有版权说明

## 注意

- 这是**委派指令生成器**，不直接调用图像 API
- 实际生图在 Codex 或 Antigravity 执行
- 委派完成后，CTO 在 Claude Code 中验证产出（不重复生图）
- 数据可视化场景**拒绝委派**，引导用代码（D3 / recharts / chartjs）实现
