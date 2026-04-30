---
name: cto-cross-review
description: 跨模型 review 手动触发器（手册 §48）— Claude Code → Codex (gpt-5.5) 自动跑八维评审，结果写入 docs/ai-cto/REVIEW-QUEUE.md。Stop hook 漏触发或想主动审历史 commit 时使用。
argument-hint: "[--target <commit-sha>] [--force]"
allowed-tools: ["Read", "Write", "Bash"]
model: sonnet
disable-model-invocation: false
---

# Cross-Model Review（手册 §48）

手动触发 Claude → Codex 跨模型 review。Stop hook 自动模式的补充入口。

## 参数

- 空 = 审最近一个 commit
- `--target <sha>` = 审指定 commit
- `--force` = 跳过 forbidden 路径过滤（**仅用于已脱敏代码，慎用**）
- `--dry-run` = 仅准备 prompt 不真调 Codex（看会送啥过去）

## 执行步骤

### 1. 安全前置检查

```bash
# 路径过滤
TARGET=${1:-HEAD}
FORBIDDEN=$(git diff --name-only ${TARGET}~1 ${TARGET} 2>/dev/null | \
  grep -E '(auth|payment|secrets|migration|crypto|infra)/' || true)

if [ -n "$FORBIDDEN" ] && [ "$2" != "--force" ]; then
  echo "🛑 触及 §32.1 forbidden 路径："
  echo "$FORBIDDEN"
  echo "Codex review 会上传代码到 OpenAI，建议人工 review。"
  echo "如确认已脱敏，加 --force 跳过此检查。"
  exit 1
fi
```

### 2. 检查 Codex 可用性

```bash
# 优先 MCP server
if curl -s http://localhost:8723/health > /dev/null 2>&1; then
  MODE=mcp
elif command -v codex >/dev/null && [ -n "$OPENAI_API_KEY" ]; then
  MODE=cli
else
  echo "⚠️ Codex 不可用，fallback 到 GitHub Actions"
  echo "请 push 后让 .github/workflows/codex-review.yml 处理"
  exit 0
fi
```

### 3. 调用 codex-bridge skill

委派给 `.agents/skills/codex-bridge/SKILL.md` 处理实际逻辑（见 §48.7 配置）。

### 4. 输出报告

```markdown
## ✅ Cross-Model Review 已触发

| 项 | 值 |
|---|---|
| Target commit | abc1234 |
| 改动文件 | 5 个（无 forbidden 路径）|
| Codex 模式 | MCP（本地 :8723） / CLI / CI fallback |
| 八维评审 prompt | 已准备 + 含 SPEC + Constitution 节选 |
| 结果输出 | docs/ai-cto/REVIEW-QUEUE.md（追加） |
| 审计日志 | docs/ai-cto/CODEX-REVIEW-LOG.md |

### 等待 review 完成

预计 30-90 秒。完成后会话刷新即可看到。

### 下次会话自动加载

SessionStart hook 自动读 REVIEW-QUEUE.md → 显示在 context 中。
```

## 注意

- 这是**触发器**，不是 review 实际执行者（实际执行在 codex-bridge skill）
- **不**触及 §32.1 forbidden 路径（除非 --force 且已脱敏）
- 商业敏感项目：先确认用 Microsoft Foundry zero-retention 端点
- 与 `/cto-review`（slash command 形式的纯 Claude review）边界：cross-review 是**跨模型**，cto-review 是 **Claude 自审多次**
