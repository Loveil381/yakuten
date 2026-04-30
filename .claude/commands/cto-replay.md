---
name: cto-replay
description: 重放 agent trajectory 日志（手册 §44）— 时间轴可视化 + cost 累计 + 与 eval golden case diff。用于事故调试 / 审计 / 规划重演。
argument-hint: "[<session-id>|--target <commit-sha>|--diff <eval-id>]"
allowed-tools: ["Read", "Glob", "Bash"]
model: sonnet
disable-model-invocation: false
---

# Trajectory Replay（手册 §44）

重放 agent 执行历史，定位事故根因或固化为 eval golden case。

## 参数

`$ARGUMENTS` 形式：
- `<session-id>` = 直接重放该 session
- `--target <commit-sha>` = 找产生该 commit 的 session 并重放
- `--diff <eval-id>` = 与指定 eval golden case 对比偏差
- `--list` = 列出最近 20 个 session
- 空 = 列出最近 5 个 session 让用户选

## 执行步骤

### 1. 检测 trajectory 日志目录

```bash
test -d .claude/agent-logs/ || echo "未启用 trajectory 日志，请先在 settings.json 启用 PostToolUse hook"
```

如果不存在，提示用户启用并退出。

### 2. 解析 session

| 入参 | 行为 |
|---|---|
| `<session-id>` | 直接读 `.claude/agent-logs/<session-id>.jsonl` |
| `--target <sha>` | git log 找时间戳 → 匹配 session_end 时间最接近的 jsonl |
| `--diff <eval-id>` | 读 evals/golden-trajectories/<eval-id>.yaml + 最近 session 对比 |

### 3. 渲染时间轴

```
🕒 16:00:00  session_start  model=opus-4-7
🕒 16:00:03  👤 user: "添加用户头像上传功能"
🕒 16:00:05  🔧 Read .docs/ai-cto/SPEC.md
🕒 16:00:06  🔧 Glob src/**/avatar*
🕒 16:00:10  💬 assistant: "我先读 SPEC..."
🕒 16:00:15  ✏️ Edit src/UserProfile.tsx (+12 -3)
🕒 16:00:30  💰 cost: 0.05 USD (累计 0.18)
🕒 16:01:00  session_end  status=completed total=0.23 USD
```

### 4. 脱敏

显示前必须替换：
- `password` / `api_key` / `token` 字段值 → `<REDACTED>`
- `Authorization: Bearer xxx` → `Authorization: <REDACTED>`
- 邮箱 / 手机号 → 部分掩码

### 5. Cost 累计图（ASCII）

```
$ 0.25 ┤                              ━━━ 0.23
$ 0.20 ┤                       ━━━━━━━
$ 0.15 ┤                ━━━━━━━
$ 0.10 ┤        ━━━━━━━
$ 0.05 ┤━━━━━━━
       └────────────────────────────────────
       16:00  16:00:30  16:01  16:01:30
```

### 6. --diff 模式

读取 eval yaml 的 expected_steps，与 trajectory 实际步骤对比：

```
✅ 步骤 1：读取 SPEC.md（matched）
✅ 步骤 2：创建分支（matched）
⚠️ 步骤 3：未在 expected 中：Glob src/**/avatar*（多余但无害）
❌ 步骤 4：expected "跑测试" 但 trajectory 中无 Bash(npm test)
```

输出建议：是否将该 trajectory 升级为新 golden case，或修复 expected_steps。

### 7. 输出报告

```markdown
## Replay 报告：session-<id>

### 概览
- 时长：1m 23s
- Cost：$0.23（10 次 LLM 调用）
- 工具调用：Read 5 / Glob 2 / Edit 3 / Bash 1
- 状态：completed

### 时间轴
[渲染]

### 成本曲线
[ASCII chart]

### 偏差报告（仅 --diff 模式）
[与 eval 对比]

### 建议
- [ ] 升级为 golden case：T-XXX 步骤
- [ ] 修复 prompt 漂移：第 5 步多调用一次 Glob
```

## 失败模式

- session-id 不存在 → 列出最近 10 个 session 让用户选
- jsonl 损坏 → 报告损坏行，跳过继续
- 超过 10000 行 → 自动分页（每页 200 行）

## 注意

- 这是**只读工具**，不修改任何 trajectory
- 涉及 §32.1 forbidden 路径的 session 默认不显示完整 prompt（仅元信息）
- 与 `/cto-eval add-from-trajectory` 配合使用，把成功路径固化
