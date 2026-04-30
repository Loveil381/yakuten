#!/usr/bin/env bash
# codex-bridge runner — 被 Stop hook 异步调用，跑 codex review 写入 REVIEW-QUEUE.md
# 文档：手册 §48 + .agents/skills/codex-bridge/SKILL.md
set +e

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"
[ -z "$REPO_ROOT" ] && exit 0
cd "$REPO_ROOT"

# 0. TOCTOU 防护：mkdir 原子锁（POSIX-only，Windows git-bash 也有效）
LOCK_DIR="docs/ai-cto/.codex-bridge.lock"
mkdir -p docs/ai-cto
if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  exit 0  # 已有进程在跑同一仓库，跳过避免重复 review
fi
trap 'rmdir "$LOCK_DIR" 2>/dev/null' EXIT INT TERM

# 1. 安全前置：forbidden 路径过滤（SSOT 来自 scripts/forbidden-paths.txt）
TARGET="${1:-HEAD}"
SSOT="scripts/forbidden-paths.txt"
if [ -f "$SSOT" ]; then
  PATTERN=$(grep -v '^#' "$SSOT" | grep -v '^$' | tr '\n' '|' | sed 's/|$//')
else
  # fallback：SSOT 不存在时用 hardcoded（兼容历史）
  PATTERN='auth/|payment/|secrets/|migration|crypto/|infra/'
fi
FORBIDDEN=$(git diff --name-only "${TARGET}~1" "${TARGET}" 2>/dev/null | \
  grep -E "$PATTERN" || true)

if [ -n "$FORBIDDEN" ] && [ "${FORCE:-0}" != "1" ]; then
  mkdir -p docs/ai-cto
  echo "$(date -Iseconds 2>/dev/null || date) | sha=$(git rev-parse --short ${TARGET}) | mode=skipped-forbidden | files=${FORBIDDEN}" \
    >> docs/ai-cto/CODEX-REVIEW-LOG.md
  exit 0
fi

# 2. 业务路径过滤：只 review 业务代码（非纯文档/配置）— SSOT 来自 scripts/business-paths.txt
# v3.6.1 教训：原 hardcoded `^(src|app|lib|apps|packages)/` 是 generic 假设，
#              对 dashboard/src/ / hardening/ / actions/ 等自研结构 silent skip。
BIZ_SSOT="scripts/business-paths.txt"
if [ -f "$BIZ_SSOT" ]; then
  BIZ_PATTERN=$(grep -v '^#' "$BIZ_SSOT" | grep -v '^$' | sed 's|^|^|' | tr '\n' '|' | sed 's/|$//')
else
  BIZ_PATTERN='^(src|app|lib|apps|packages)/'
fi
BUSINESS=$(git diff --name-only "${TARGET}~1" "${TARGET}" 2>/dev/null | \
  grep -E "$BIZ_PATTERN" || true)
if [ -z "$BUSINESS" ] && [ "${FORCE:-0}" != "1" ]; then
  exit 0  # 仅文档/配置改动，不浪费 token
fi

# 3. Debounce：同 commit 不重复 review
SHA=$(git rev-parse "$TARGET")
SHORT_SHA=$(echo "$SHA" | cut -c1-7)
if [ -f docs/ai-cto/CODEX-REVIEW-LOG.md ] && \
   grep -q "sha=${SHORT_SHA}.*mode=success" docs/ai-cto/CODEX-REVIEW-LOG.md 2>/dev/null; then
  exit 0  # 已 review 过
fi

# 4. 检测 codex / claude 可用性
HAS_CODEX=0
HAS_CLAUDE=0
command -v codex >/dev/null 2>&1 && HAS_CODEX=1
command -v claude >/dev/null 2>&1 && HAS_CLAUDE=1

# 4a. Codex 配额冷却：若上次额度耗尽 < 1h，直接走 Claude fallback
COOLDOWN_FILE="docs/ai-cto/.codex-quota-cooldown"
SKIP_CODEX=0
if [ -f "$COOLDOWN_FILE" ]; then
  COOLDOWN_TS=$(cat "$COOLDOWN_FILE" 2>/dev/null || echo 0)
  NOW=$(date +%s 2>/dev/null || echo 0)
  if [ "$NOW" -gt 0 ] && [ "$COOLDOWN_TS" -gt 0 ] && [ $((NOW - COOLDOWN_TS)) -lt 3600 ]; then
    SKIP_CODEX=1
  fi
fi

# 都不可用：写 PENDING + 退出
if [ "$HAS_CODEX" = "0" ] && [ "$HAS_CLAUDE" = "0" ]; then
  echo "$(date -Iseconds 2>/dev/null || date) | sha=${SHORT_SHA} | mode=ci_pending | reason=no_local_reviewer" \
    >> docs/ai-cto/CODEX-REVIEW-LOG.md
  exit 0
fi

# 5. 真正调用 review（异步在后台跑）
{
  TS=$(date -Iseconds 2>/dev/null || date)
  REVIEWER=""
  MODE=""
  OUTPUT=""
  STATUS=1

  # 5a. 主路径：codex review（除非冷却中或不可用）
  if [ "$HAS_CODEX" = "1" ] && [ "$SKIP_CODEX" = "0" ]; then
    OUTPUT=$(codex review --commit "$SHA" --title "ai-playbook §48 cross-model review" 2>&1)
    STATUS=$?
    if [ $STATUS -eq 0 ]; then
      REVIEWER="codex-gpt5.5"
      MODE="success"
    elif echo "$OUTPUT" | grep -qiE "(rate.?limit|quota|exceeded|insufficient|usage.?limit|429|402)"; then
      # 5b. 检测到额度耗尽 → 写 cooldown，下面尝试 fallback
      echo "$(date +%s 2>/dev/null || echo 0)" > "$COOLDOWN_FILE"
      MODE="codex-quota-exhausted"
      STATUS=99
    else
      # 其他错误（网络/版本）
      MODE="codex-failed"
    fi
  fi

  # 5c. Fallback 到 Claude（codex 失败 OR 冷却 OR 不可用）
  if [ -z "$REVIEWER" ] && [ "$HAS_CLAUDE" = "1" ]; then
    PROMPT="按手册 §10.5 八维评审 commit ${SHORT_SHA} 的改动。先用 Bash 跑 'git show ${SHA}' 看 diff，再按八维（架构/代码质量/性能/安全/测试/DX/功能/UX）逐条 ✅⚠️🔴 + 行号。仅输出 markdown 报告，不修改任何文件。"
    CLAUDE_OUTPUT=$(claude -p "$PROMPT" --max-turns 5 2>&1)
    CLAUDE_STATUS=$?
    if [ $CLAUDE_STATUS -eq 0 ]; then
      OUTPUT="$CLAUDE_OUTPUT"
      REVIEWER="claude-fallback-opus"
      if [ "$MODE" = "codex-quota-exhausted" ] || [ "$SKIP_CODEX" = "1" ]; then
        MODE="fallback-to-claude"
      else
        MODE="claude-only"
      fi
      STATUS=0
    else
      MODE="${MODE}+claude-failed"
    fi
  fi

  # 6. 写 REVIEW-QUEUE.md（仅成功时）
  if [ $STATUS -eq 0 ] && [ -n "$OUTPUT" ]; then
    {
      echo ""
      echo "## $TS — Review for $SHORT_SHA"
      echo "**Reviewer**: $REVIEWER | **Mode**: $MODE"
      if [ "$MODE" = "fallback-to-claude" ]; then
        echo ""
        echo "> ⚠️ Codex 额度耗尽（1h 冷却中），本次由 Claude 完成。**失去跨模型价值**（Claude 自审有相同认知偏差）。建议恢复 codex 配额后重跑 \`/cto-cross-review\`。"
      fi
      echo ""
      echo '```markdown'
      echo "$OUTPUT"
      echo '```'
      echo ""
      echo "---"
    } >> docs/ai-cto/REVIEW-QUEUE.md
    echo "$TS | sha=${SHORT_SHA} | mode=$MODE | reviewer=$REVIEWER | bytes=${#OUTPUT}" \
      >> docs/ai-cto/CODEX-REVIEW-LOG.md
  else
    # 全部失败 → 仅写 audit log
    echo "$TS | sha=${SHORT_SHA} | mode=${MODE:-no-reviewer-available} | reviewer=none" \
      >> docs/ai-cto/CODEX-REVIEW-LOG.md
  fi
} &

# 后台运行，立即返回（Stop hook 不阻塞）
disown 2>/dev/null
exit 0
