---
name: cto-eval
description: Eval-Driven Development（§35）— 创建 / 审视 / 添加 / 运行 evals/golden-trajectories/
argument-hint: "[init|audit|add|run]"
allowed-tools: ["Read", "Write", "Edit", "Glob", "Bash(*)"]
model: opus
disable-model-invocation: false
---
# Eval-Driven Development 启动 / 维护

按手册 §35 引导项目建立 / 维护 Eval-Driven Development 流程。

## 参数

`$ARGUMENTS` 可选：
- 空 = 智能判断（首次跑则 init，已存在则 audit）
- `init` = 创建 evals/ 目录 + 5 条 golden trajectory 起点
- `audit` = 审视现有 evals/ 是否需扩充
- `add [task description]` = 为某任务添加 golden trajectory
- `run` = 跑全部 eval 报告 pass/fail

## 执行步骤

### 1. 检测当前状态

```bash
test -d evals/ && ls evals/golden-trajectories/
```

- 如果不存在 → 进入 init 流程
- 如果存在 → 进入 audit 流程

### 2. Init 流程

#### 2a. 创建目录结构

```
evals/
├── README.md             # 用法说明
├── golden-trajectories/  # ≥5 条黄金轨迹
│   ├── 001-add-feature.yaml
│   ├── 002-fix-bug.yaml
│   ├── 003-refactor.yaml
│   ├── 004-cross-review.yaml
│   └── 005-spec-driven.yaml
├── regression/           # 回归测试用例
└── capability/           # 能力扩展测试用例
```

#### 2b. Golden Trajectory 模板

每条 yaml 文件按 §35.2 格式：
```yaml
id: 001-add-feature
description: 添加新功能的标准 CTO 流程
input: "添加用户头像上传功能"
expected_steps:
  - 读取 docs/ai-cto/SPEC.md（如不存在则创建）
  - 创建 feature/avatar-upload 分支
  - 修改 routes / controllers / data layer
  - 添加测试
  - 跑 lint + test 通过
  - commit + 输出摘要
forbidden_actions:
  - 修改 tests/* 中已有的测试断言
  - 跳过 csrf_verify() 或类似安全检查
  - 直接 commit 到 main
acceptance_criteria:
  - 测试通过
  - lint 0 警告
  - 文件改动 ≤ 5 个
  - PR 描述引用 SPEC.md
priority: P0
```

#### 2c. 写入铁律

确保 CLAUDE.md 含：
> 铁律 #12：无 eval 的 agent 配置改动不得进 main

#### 2d. 推荐工具集成

询问用户是否启用：
- **Braintrust** — 中大型项目，CI/CD 集成
- **LangSmith** — 用 LangGraph 的项目
- **Promptfoo** — 安全敏感项目
- **本地脚本** — 仅手动跑 yaml 对比

### 3. Audit 流程

读取 `evals/golden-trajectories/` 全部文件，输出：

```markdown
## Eval 集审计报告

### 现有覆盖
- 总计 N 条 golden trajectory
- 任务类型分布：[add / fix / refactor / review / spec / ...]
- 平均 expected_steps 数：X
- 平均 forbidden_actions 数：Y

### 覆盖空白
- 缺少类型：[列出 §38.1 主流模式中未覆盖的]
- 缺少 §32.1 高风险路径的专门 trajectory
- 缺少 §33 Vibe / §36 Self-Healing 场景

### 建议补充
1. [新 trajectory 标题] — 覆盖什么场景
2. ...

### 过期 trajectory
- [ID] 最后更新 N 天前，可能与最新 CLAUDE.md 不一致
```

### 4. Add 流程

根据 `$ARGUMENTS` 中的任务描述，生成新的 yaml：
- 询问用户 input、expected_steps、forbidden_actions、acceptance_criteria
- 写入 `evals/golden-trajectories/NNN-<slug>.yaml`
- 更新 evals/README.md 的清单

### 5. Run 流程

依次：
1. 读取每个 yaml 的 input
2. 模拟在干净 worktree 中执行
3. 对比实际行为与 expected_steps
4. 检查 forbidden_actions 是否触发
5. 验证 acceptance_criteria
6. 输出每条 pass/fail + 详情

```markdown
## Eval Run 报告

总计：12 条
通过：10 ✅
失败：2 ❌

### 失败详情
- 003-refactor: 实际改了 8 个文件，超过 acceptance_criteria（≤ 5）
- 005-spec-driven: 触发了 forbidden_action（直接 commit main）

### 建议
- 对失败的 trajectory 调试 CLAUDE.md / commands
- 加固铁律或更新 acceptance_criteria
```

## 注意

- Golden trajectory 比单元测试更接近"行为合约"
- 先求最小可行（5 条），再渐进扩充
- 每次改 CLAUDE.md / commands / skills 都要跑 regression
- 如果 CI 不集成 eval，就在 PR 描述中粘贴 run 结果
