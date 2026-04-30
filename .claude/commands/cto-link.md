---
name: cto-link
description: 关联本机 ai-playbook 仓库（跨机器路径自适应，§29.8）— 自动探测 + 更新 CLAUDE.md LINK 区块
argument-hint: "[绝对路径|--check|--unset]"
allowed-tools: ["Read", "Edit", "Glob", "Bash(*)"]
model: sonnet
disable-model-invocation: false
---
# 关联本机的 ai-playbook 仓库（手册 §29.8）

解决跨机器 / 跨开发者路径不一致问题。自动探测本机的 ai-playbook 安装位置，更新当前项目的 CLAUDE.md 和 settings.local.json。

## 参数

`$ARGUMENTS` 可选：
- 空 = 自动探测本机所有候选路径
- `<绝对路径>` = 强制使用指定路径（跳过探测）
- `--check` = 只检测不修改，输出诊断报告
- `--unset` = 清除 LINK 缓存（恢复到默认 fallback 状态）

## 执行步骤

### 1. 收集候选路径

按以下顺序构建候选列表：

1. `$ARGUMENTS`（如果提供绝对路径）
2. 环境变量 `$AI_PLAYBOOK_PATH`（注意 Claude 不展开 env，要 Bash 读）
3. `~/.claude/playbook`（推荐位置）
4. `~/ai-playbook`
5. `~/projects/ai-playbook`
6. `~/Documents/ai-playbook`
7. `C:/projects/ai-playbook`（Windows 常用）
8. `/opt/ai-playbook`（Linux 服务器）

用 Bash 检测每个路径下 `playbook/handbook.md` 是否存在：
```bash
for p in "$AI_PLAYBOOK_PATH" "$HOME/.claude/playbook" "$HOME/ai-playbook" \
         "$HOME/projects/ai-playbook" "$HOME/Documents/ai-playbook" \
         "C:/projects/ai-playbook" "/opt/ai-playbook"; do
  [ -n "$p" ] && [ -f "$p/playbook/handbook.md" ] && echo "FOUND: $p" && break
done
```

### 2. 验证候选路径

对找到的路径做完整性检查：
- 存在 `playbook/handbook.md`
- 存在 `templates/CLAUDE.md`
- 存在 `.claude/commands/`（至少有 cto-init.md）
- handbook.md 第一行包含 "CTO-PLAYBOOK"（基本签名校验）

### 3. 更新当前项目 CLAUDE.md

读取当前项目 `CLAUDE.md`，找到 `<!-- AI-PLAYBOOK-LINK:START -->` 区块。

如果区块存在 → 用 Edit 替换为：
```html
<!-- AI-PLAYBOOK-LINK:START — 由 /cto-link 自动维护，勿手改 -->
<!-- 本机已发现路径：<found_path>/playbook/handbook.md -->
<!-- 检测时间：YYYY-MM-DD HH:MM | 平台：<OS> | 主机：<hostname> -->
<!-- AI-PLAYBOOK-LINK:END -->
```

如果区块不存在（旧版 CLAUDE.md 硬编码路径） → 提示用户先运行迁移：
```
检测到旧版 CLAUDE.md（硬编码路径）。
建议先运行 /cto-relink-all 迁移到新模板，或手动编辑 CLAUDE.md 将"完整手册"区段替换为 fallback 格式（见 templates/CLAUDE.md）。
```

### 4. 写入 settings.local.json 缓存

把发现的路径写入 `.claude/settings.local.json`（gitignored）：
```json
{
  "aiPlaybookPath": "<found_path>",
  "aiPlaybookLinkedAt": "YYYY-MM-DDTHH:MM:SS",
  "aiPlaybookHost": "<hostname>"
}
```

如果文件已存在，merge 而非覆盖。

### 5. 验证

最后再次 Read `<found_path>/playbook/handbook.md`，确认前 3 行内容（应含 "CTO-PLAYBOOK"），输出验证结果。

### 6. 输出报告

```markdown
## ✅ ai-playbook 已链接

| 项 | 值 |
|---|---|
| 发现路径 | `<found_path>` |
| handbook | `<found_path>/playbook/handbook.md` ✓ 可读 |
| 平台 | Windows / Mac / Linux |
| 主机名 | <hostname> |
| CLAUDE.md | LINK 区块已更新（line N-M） |
| 缓存 | .claude/settings.local.json |

### 已尝试的候选路径
- ✓ <found_path>（命中）
- ✗ ~/ai-playbook（不存在）
- ...

### 下次换机器/路径变化
重新运行 `/cto-link` 即可（无参数自动探测，或带绝对路径强制指定）。
```

## --check 模式（不修改）

仅输出诊断信息：
- 当前 CLAUDE.md 是否含 LINK 区块
- 当前 settings.local.json 中的缓存路径是否仍有效
- 所有候选路径的可达性
- 最佳推荐路径

## --unset 模式

把 LINK 区块重置为：
```html
<!-- AI-PLAYBOOK-LINK:START — 由 /cto-link 自动维护，勿手改 -->
<!-- 未配置：运行 /cto-link 自动检测 -->
<!-- AI-PLAYBOOK-LINK:END -->
```

并删除 settings.local.json 中的 aiPlaybookPath。

## 失败处理

如果**全部**候选路径都没找到：

```markdown
❌ 找不到 ai-playbook

已尝试以下路径（均无 playbook/handbook.md）：
  ✗ $AI_PLAYBOOK_PATH (未设置)
  ✗ ~/.claude/playbook
  ✗ ~/ai-playbook
  ✗ ~/projects/ai-playbook
  ✗ C:/projects/ai-playbook

### 请选择一种解决方案

**A. 我知道路径**（已 clone 到非标准位置）
   运行：`/cto-link <你的绝对路径>`
   例：`/cto-link D:/work/ai-playbook`

**B. 还没安装**（首次在本机使用）
   推荐安装到 `~/.claude/playbook`：
   ```bash
   git clone https://github.com/<org>/ai-playbook ~/.claude/playbook
   /cto-link
   ```

**C. 已安装但在非标位置，想固化路径**
   方法 1（推荐 — symlink）：
   ```bash
   # Mac / Linux
   ln -s /your/actual/path ~/.claude/playbook
   # Windows（需开发者模式或管理员）
   mklink /D %USERPROFILE%\.claude\playbook D:\actual\path
   ```
   方法 2（环境变量）：
   ```bash
   export AI_PLAYBOOK_PATH=/your/path  # 加入 ~/.bashrc / ~/.zshrc
   setx AI_PLAYBOOK_PATH C:\your\path  # Windows
   ```

诊断信息：OS=<os>, HOME=<home>, CWD=<cwd>
```

## 注意

- 不要把 LINK 区块的具体路径 commit 到团队仓库（路径因人而异）
  - 推荐策略：CLAUDE.md 在 git 中保持"未配置"状态，每人本地用 `/cto-link` 临时填充
  - 或：把 CLAUDE.md 加入 `.gitignore`（极端方案，会丢失项目特定规则）
  - **最佳折衷**：保留 CLAUDE.md 在 git 中，但 LINK 区块用 git 钩子在 commit 时自动重置
- settings.local.json 已在 .gitignore 中，路径缓存安全
- `/cto-link` 不会修改 ai-playbook 仓库本身，只更新当前工作目录的项目配置
