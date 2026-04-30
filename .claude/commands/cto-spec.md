---
name: cto-spec
description: Spec-Driven 三段式开发（§18，对齐 GitHub Spec Kit）— specify/plan/tasks 顺序产出 + 用户审核
argument-hint: "[specify|plan|tasks|audit] [描述]"
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash(git*)"]
model: opus
disable-model-invocation: false
---
# Spec-Driven 开发启动（三段式，对齐 GitHub Spec Kit）

按手册 §18 三段式 Spec-Driven 工作流，从 SPEC → PLAN → TASKS。

## 参数

`$ARGUMENTS` 形式：
- `[功能描述]` = 智能判断当前阶段（如无 SPEC.md 则进 specify，有则进 plan，依此类推）
- `specify [功能描述]` = 强制进入 SPEC 阶段
- `plan` = 强制进入 PLAN 阶段（要求 SPEC.md 已存在）
- `tasks` = 强制进入 TASKS 阶段（要求 PLAN.md 已存在）
- `audit` = 检查现有三层文档一致性

## 阶段 1：Specify（What & Why）

读取 `docs/ai-cto/CONSTITUTION.md`（若存在）确认不违反项目宪法。

读取产品愿景：
- `docs/ai-cto/PRODUCT-VISION.md`
- `docs/ai-cto/TECH-VISION.md`

起草 `docs/ai-cto/SPEC.md`，包含：
- **功能详细描述、目标用户、成功标准**
- **输入输出定义、API/数据模型设计、边界条件和异常处理**
- **非功能需求**（性能、安全、兼容性要求）
- **与现有模块的依赖关系**
- **验收标准**（测试用例覆盖范围、acceptance criteria）
- **引用 Constitution 的相关条款**（哪些原则适用）

如果 SPEC 撰写过程中发现产品愿景有遗漏或技术架构需要调整，**直接提出**（铁律 #5：敢于挑战）。

输出后**等用户确认**再进入下一阶段。

## 阶段 2：Plan（How）

前置：`docs/ai-cto/SPEC.md` 存在且用户已确认。

读取 SPEC.md，起草 `docs/ai-cto/PLAN.md`：
- **拆解为有序的实施步骤**
- **每步标注**：涉及文件、预计变更量、风险、依赖关系
- **每步标注**：是否需要人工审核 / 自动测试 / 交叉审核（§19）
- **分支策略**：单分支 vs feature flag vs 多 stage rollout
- **回退策略**：每步失败如何回退
- **预计工时**：每步小时级估算

**§18.6 强制 Spec → Test → Code 顺序**：
- 在 PLAN 中标注：哪些步骤先生成测试 → 测试 review → 锁定测试 → 实现
- 高风险路径（§32.1）的步骤必须走这个顺序

输出后**等用户确认**再进入下一阶段。

## 阶段 3：Tasks（Do）

前置：`docs/ai-cto/PLAN.md` 存在且用户已确认。

读取 PLAN.md，起草 `docs/ai-cto/TASKS.md`：
- **从 PLAN 拆解为可执行的原子任务**
- **每条含**：
  - 任务 ID（T-001, T-002, ...）
  - 描述（一句话）
  - 涉及文件（精确路径）
  - 完成标准（验证命令，如 `pnpm test src/feature/`）
  - 预计复杂度（S/M/L）
  - 依赖任务（前置 ID）
  - 是否可并行
- **按 user story + 依赖排序**（来自 GitHub Spec Kit 规范）
- **Parallel groups**：标注哪些任务可并行委派给 sub-agent / Worktree

执行规则：
- 每完成一个 T-XXX → 更新 TASKS.md 状态（pending → in_progress → done）
- 每个 T-XXX 一次 commit，message 格式 `type(scope): T-XXX 描述`
- 失败任务保持 in_progress，添加 blockers 字段

## 阶段 4：Audit（一致性检查）

`/cto-spec audit` 模式：

检查三层文档一致性：

```markdown
## Spec/Plan/Tasks 一致性审计

### SPEC.md
- 创建：YYYY-MM-DD
- 最后修改：YYYY-MM-DD
- 验收标准条数：N

### PLAN.md
- 步骤数：M
- 引用 SPEC 的所有验收标准：✅ / ❌ 漏 X 条

### TASKS.md
- 任务数：K
- 已完成：J
- 引用 PLAN 的所有步骤：✅ / ❌ 漏 X 步
- 状态字段完整性：✅ / ❌

### 偏差报告
- 🔴 SPEC 改动后 PLAN/TASKS 未同步
- 🟠 TASKS 中有 PLAN 未提的任务
- 🟢 一致

### 建议处置
- [按发现的问题排序]
```

## 与 GitHub Spec Kit 的兼容

如果项目希望与 GitHub Spec Kit 完全兼容：
- `docs/ai-cto/CONSTITUTION.md` ← `constitution.md`
- `docs/ai-cto/SPEC.md` ← `spec.md`
- `docs/ai-cto/PLAN.md` ← `plan.md`
- `docs/ai-cto/TASKS.md` ← `tasks.md`

可加 symlink：`ln -s docs/ai-cto/SPEC.md spec.md` 等，让 Spec Kit 工具直接识别。

## 注意

- 三阶段必须**按顺序**且每阶段都要用户确认
- 跳过 SPEC 直接 PLAN = 反模式（违反 §32.5 Vibe Shipping）
- 高风险路径（§32.1）必须走完整三段，不允许简化
- 每次三段完成后跑 `/cto-eval` 添加 golden trajectory
