---
name: cto-constitution
description: 项目 Constitution 管理（§37）— 创建 / 审视 / 审计 docs/ai-cto/CONSTITUTION.md，双签变更
argument-hint: "[init|review|audit]"
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep"]
model: opus
disable-model-invocation: false
---
# 创建 / 维护项目 Constitution（手册 §37）

为项目创建或修改 `docs/ai-cto/CONSTITUTION.md`，定义不可妥协的项目原则。

## 参数

`$ARGUMENTS` 可选：
- 空 = 智能判断（不存在则 init，存在则 review）
- `init` = 强制重新创建
- `review` = 审视现有 Constitution 是否需更新
- `audit` = 检查项目实际行为是否违反 Constitution

## 执行步骤

### 1. 检测状态

```bash
test -f docs/ai-cto/CONSTITUTION.md && echo "EXISTS" || echo "NEW"
```

### 2. Init 流程（创建新 Constitution）

#### 2a. 调研项目身份

读取以下文件提炼项目身份：
- `README.md` — 产品愿景、目标用户
- `docs/ai-cto/PRODUCT-VISION.md`（若存在）
- `LICENSE` — license 类型
- `package.json` / `composer.json` 等 — 依赖约束
- `CLAUDE.md` — 现有铁律

#### 2b. 与用户确认五大宪法领域

逐项询问用户：

**① 产品宪法**
- 一句话产品愿景
- 目标用户（最具体的描述）+ **不服务的用户**
- 核心价值主张（解决什么问题，不解决什么）

**② 架构宪法**
- 不可跨越的架构边界（如：前后端绝对分离 / 微服务边界）
- 禁止引入的依赖类型（如：本项目零 Composer 依赖）
- 数据流方向（单向 / 双向）

**③ 安全宪法**
- 永远 HTTPS / 永远参数化 SQL / 永远 CSRF
- secrets 管理方式（.env / vault / kms）
- 高风险路径黑名单（引用 §32.1，结合本项目实际）

**④ 合规宪法**
- 适用法规：GDPR / CCPA / PIPL（哪些适用）
- License 约束（如：AGPL-3.0 必须保留版权头）
- 算法备案 / 数据本地化要求（中国市场）

**⑤ 质量宪法**
- 测试覆盖率底线（如：核心模块 80%）
- 性能预算（引用 §31）
- 无障碍底线（WCAG 2.2 AA）

#### 2c. 输出 Constitution.md

按 §37.2 模板写入 `docs/ai-cto/CONSTITUTION.md`，每条都是"绝对禁止"或"必须"，无例外。

#### 2d. 加入双签提示

在文件顶部加：
```markdown
> 本文件定义项目不可妥协的原则。所有 SPEC / PLAN / 代码改动必须服从。
> 修改本文件需要 CTO + 至少一位 senior engineer 双签。
> 最近修改：YYYY-MM-DD by [姓名] + [审核人姓名]
```

#### 2e. 更新 CLAUDE.md

确保 CLAUDE.md 在"会话开始流程"中包含：
> AI 在生成代码前必须读 docs/ai-cto/CONSTITUTION.md

### 3. Review 流程

读取现有 Constitution，对照：
- 最近 30 天的代码改动是否有违反？
- 最近的 ADR / DECISIONS 是否需要写入 Constitution？
- 是否有过时条款（如团队规模变化、技术栈替换）？

输出 review 报告：

```markdown
## Constitution Review 报告

### 上次修改：YYYY-MM-DD（N 天前）

### 与实际代码的偏差
- 🔴 [条款] 实际代码有违反：[文件 + 行号]
- 🟠 [条款] 部分违反

### 建议补充的新条款
- [基于近期 DECISIONS / 事故 / 新法规]

### 建议修订的旧条款
- [因团队 / 技术栈变化已过时的]

### 处置
- 立即修复违反项 → 开 issue
- 补充新条款 → 双签后写入
```

### 4. Audit 流程

对项目代码做合规扫描，逐条检查 Constitution：

```markdown
## Constitution Audit 报告

| 条款 | 检查方法 | 结果 |
|---|---|---|
| 永远参数化 SQL | grep "SELECT.*\$" src/ | ✅ / ❌ N 处违反 |
| 零 Composer 依赖 | composer.json 不存在 / require 为空 | ✅ |
| AGPL 版权头保留 | grep -L "AGPL" includes/ | ❌ N 个文件缺失 |
| ... | ... | ... |

### 总体合规率：X / N 条款通过

### 立即处置
- [ ] 高风险违反（安全 / 合规） → 当轮修复
- [ ] 低风险违反（命名 / 格式） → 加入 backlog
```

## 注意

- Constitution 改动频率应低（季度级）
- 每条都要可验证（grep / 工具检查）
- 不要把"建议"写成 Constitution，只写"必须"
- 与 SPEC.md / PLAN.md 区分：Constitution 是宪法，SPEC 是当下迭代
