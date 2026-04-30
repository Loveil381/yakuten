---
name: cto-canary
description: Canary 部署生成器（手册 §45）— 输入 percent / success_metric / rollback_condition，输出可执行的 GitHub Actions workflow + feature flag 配置
argument-hint: "[--percent N] [--metric <expr>] [--duration <h>]"
allowed-tools: ["Read", "Write", "Edit", "Bash"]
model: opus
disable-model-invocation: false
---

# Canary 部署生成器（手册 §45）

把 CLAUDE.md / commands / hooks / 模型路由的改动包装为 canary 推出，避免一次性影响全部下游项目。

## 参数

`$ARGUMENTS` 形式：
- `--percent N` = 初始覆盖比例（默认 5）
- `--metric <expr>` = success metric 表达式
- `--duration <h>` = 观察期小时数（默认 24）
- `--rollback <expr>` = 自动 rollback 条件

无参数 = 交互式询问

## 执行步骤

### 1. 识别变更范围

```bash
git diff --name-only HEAD~1 HEAD | grep -E '(CLAUDE\.md|\.claude/commands|\.claude/hooks|\.claude/settings\.json)'
```

如果无 agent 配置改动 → 报错 "无需 canary"。

### 2. 询问关键参数（如未提供）

- 影响范围：本仓库 only / 所有下游项目 / 部分项目（清单）
- success_metric：默认 "eval_pass_rate > 95% AND cost < $0.50"
- rollback：默认 "eval_pass_rate < 90% in 3 windows"
- duration：24h / 7d

### 3. 生成 GitHub Actions workflow

写入 `.github/workflows/canary-<feature>.yml`：

```yaml
name: Canary - <feature>
on:
  push:
    branches: [claude/canary-<feature>]
jobs:
  canary-eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run evals
        run: ./scripts/run-evals.sh
      - name: Check metric
        run: ./scripts/check-canary-metric.sh "<metric expr>"
      - name: Decide
        run: |
          if [ "$pass" = "true" ]; then
            gh pr merge --merge
          else
            gh pr close && git revert
            echo "Rollback triggered" >> docs/ai-cto/INCIDENTS.md
          fi
```

### 4. 生成 feature flag 配置

如果项目用 ConfigCat / Unleash / PostHog：

```yaml
# configcat.yml
flags:
  - key: ai-playbook-<feature>
    description: Canary for <feature>
    rollout:
      percentage: 5
      target_segments: [internal-users]
```

否则用 git branch 方案：
```bash
git checkout -b claude/canary-<feature>
# 修改后只 cherry-pick 到部分项目
```

### 5. 写入 INCIDENT 模板（预防性）

`docs/ai-cto/INCIDENTS.md` 新增 placeholder section：
```markdown
## [PENDING] Canary <feature> — <YYYY-MM-DD>
- 状态：观察中
- 部署比例：5%
- 观察期截止：<24h 后>
- 当前 success metric：[每小时更新]
```

### 6. 输出报告

```markdown
## Canary 部署计划：<feature>

✅ 已生成 .github/workflows/canary-<feature>.yml
✅ 已生成 feature flag 配置（或 git branch 方案）
✅ 已在 INCIDENTS.md 预占 section

下一步：
1. push 到 claude/canary-<feature> 分支
2. 自动开始 24h 观察
3. 通过 → 自动合并到 main
4. 失败 → 自动 rollback + RCA
```

## 注意

- 不修改业务代码，只生成 canary 基础设施
- 默认 percent ≤ 5%，避免误推
- rollback condition 必填，无 fallback 路径不允许 canary
- 与 `/cto-release` 联动：未走 canary 的改动不能进 release
