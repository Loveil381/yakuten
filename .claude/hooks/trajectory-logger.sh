#!/usr/bin/env bash
# v3.8 真实 trajectory 日志（修 §44 Replay 形同虚设的 bug）
# 旧版只写 {ts, type:"tool_call"} → /cto-replay 看不到 tool_name/input
# 新版从 stdin JSON 提取完整字段，写真正可 replay 的 jsonl
#
# 隐私：默认脱敏 — 不写 file content / bash command 详细参数（仅前 200 字符）
# 完整模式：CTO_TRAJECTORY_FULL=1（含 input/output 详情，仅本地审计）
set -uo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/common.sh"

read_hook_input

CWD="${HOOK_CWD:-.}"
LOG_DIR="${CWD}/.claude/agent-logs"
[ ! -d "$LOG_DIR" ] && exit 0  # 目录不存在则跳过

DAY=$(date +%Y-%m-%d 2>/dev/null || echo unknown)
TS=$(date -Iseconds 2>/dev/null || date +%s)
LOG_FILE="${LOG_DIR}/${DAY}.jsonl"

# 简单 JSON 字符串转义
_escape() {
  echo "$1" | sed 's/\\/\\\\/g; s/"/\\"/g' | tr -d '\n' | head -c 500
}

TOOL=$(_escape "${HOOK_TOOL_NAME:-}")
FILE=$(_escape "${HOOK_FILE_PATH:-}")
SESSION=$(_escape "${HOOK_SESSION_ID:-}")
EVENT=$(_escape "${HOOK_EVENT:-}")

# 默认脱敏：bash 命令仅记前 200 字符 + tool=Bash
if [ "${CTO_TRAJECTORY_FULL:-0}" = "1" ]; then
  CMD=$(_escape "${HOOK_BASH_CMD:-}")
else
  CMD=$(_escape "$(echo "${HOOK_BASH_CMD:-}" | head -c 200)")
fi

# 写真实 trajectory（schema_version 让 /cto-replay 兼容多版本）
printf '{"ts":"%s","schema":"v3.8","event":"%s","tool":"%s","file":"%s","cmd":"%s","session":"%s"}\n' \
  "$TS" "$EVENT" "$TOOL" "$FILE" "$CMD" "$SESSION" \
  >> "$LOG_FILE" 2>/dev/null

exit 0
