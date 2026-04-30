---
name: cto-relink-all
description: 批量迁移多个项目到 fallback 模板（§29.8）— 扫描 + diff 预览 + 批量替换"完整手册"区段
argument-hint: "[扫描目录|--dry-run|--projects-list]"
allowed-tools: ["Read", "Edit", "Glob", "Bash(*)"]
model: sonnet
disable-model-invocation: false
---
# 批量迁移多个项目到新 fallback 模板（手册 §29.8）

把硬编码 ai-playbook 路径的旧版 CLAUDE.md，批量迁移到新的 fallback 多路径模板。

## 参数

`$ARGUMENTS` 可选：
- 空 = 扫描 `~/projects/*` 自动找含 CLAUDE.md 的项目
- `<目录路径>` = 扫描指定父目录下的所有项目（如 `C:/projects` 或 `~/work`）
- `--dry-run` = 仅输出 diff 预览，不实际修改
- `--projects-list <file.txt>` = 从 txt 文件读取项目路径清单（每行一个）

## 执行步骤

### 1. 扫描项目

构建项目清单：
```bash
# 默认扫描位置（按平台）
PROJECTS_DIR="${1:-$HOME/projects}"
[ "$OSTYPE" =~ "msys" ] && PROJECTS_DIR="${1:-/c/projects}"

find "$PROJECTS_DIR" -maxdepth 2 -name "CLAUDE.md" -not -path "*/ai-playbook/*"
```

只处理满足以下条件的 CLAUDE.md：
- 不是 ai-playbook 仓库本身
- 文件中含"完整手册"或"CTO 操作手册"段落
- 文件中含 ai-playbook 的引用（不论硬编码还是 fallback 模板）

### 2. 检测每个项目状态

对每个找到的 CLAUDE.md：

| 状态 | 检测方式 | 处置 |
|---|---|---|
| **🔴 旧版（硬编码）** | grep `C:[/\\]projects[/\\]ai-playbook` 或绝对路径 | 需迁移 |
| **🟡 部分迁移** | 含"完整手册"但缺 LINK 区块 | 需补全 |
| **🟢 已是新版** | 含 `<!-- AI-PLAYBOOK-LINK:START -->` | 跳过 |
| **⚪ 无引用** | 不含 ai-playbook 引用 | 跳过（不是 CTO 项目）|

### 3. 输出迁移计划

```markdown
## 扫描结果（C:/projects）

| 项目 | 状态 | CLAUDE.md 行数 | 需迁移行数 |
|---|---|---|---|
| dian | 🔴 旧版 | 462 | 3 行（line 9-11） |
| witch-gacha | 🔴 旧版 | 234 | 3 行 |
| aegis-panel | 🔴 旧版 | 131 | 3 行 |
| ... | | | |

总计：N 个项目需迁移，M 个已是最新，K 个跳过
```

### 4. 询问用户确认

显示前 3 个项目的具体 diff 预览：

```diff
--- C:/projects/dian/CLAUDE.md
+++ C:/projects/dian/CLAUDE.md (after migration)
@@ -7,4 +7,18 @@
-## 完整手册
-
-CTO 操作手册（§1-§29，工作流程、输出格式、配置规范、决策框架、项目集成教程）见：
-`C:\projects\ai-playbook\playbook\handbook.md`
+## 完整手册
+
+CTO 操作手册见 ai-playbook 仓库的 `playbook/handbook.md`。
+
+**Claude 在本机查找手册的顺序**（用 Read 工具按序尝试）：
+
+1. `~/.claude/playbook/handbook.md` — 推荐
+2. `~/ai-playbook/playbook/handbook.md`
+3. `~/projects/ai-playbook/playbook/handbook.md`
+4. `C:/projects/ai-playbook/playbook/handbook.md`（Windows 常用）
+5. 下方 LINK 区块中的本机缓存路径
+
+<!-- AI-PLAYBOOK-LINK:START — 由 /cto-link 自动维护，勿手改 -->
+<!-- 未配置：运行 /cto-link 自动检测 -->
+<!-- AI-PLAYBOOK-LINK:END -->
+
+> ⚠️ 如以上全部读取失败：运行 `/cto-link [可选绝对路径]`。
```

询问：「确认对 N 个项目应用迁移？(y/n)」

### 5. 应用迁移（除非 --dry-run）

对每个项目：
1. 备份原 CLAUDE.md 为 `CLAUDE.md.bak`（同目录）
2. 用 Edit 工具替换"完整手册"区段
3. 验证：grep 检查新区块是否成功写入
4. 输出 `✓ 项目名` 或 `✗ 项目名: 错误原因`

### 6. 输出最终报告

```markdown
## ✅ 批量迁移完成

| 状态 | 数量 | 项目 |
|---|---|---|
| ✅ 已迁移 | N | dian, witch-gacha, ... |
| ⏭️ 已跳过（已是最新） | M | ... |
| ❌ 失败 | K | 项目名 + 失败原因 |

### 备份位置
- C:/projects/dian/CLAUDE.md.bak
- C:/projects/witch-gacha/CLAUDE.md.bak
- ...

### 后续步骤
1. 在每个迁移后的项目运行 `/cto-link` 关联本机路径
2. 一周内确认无问题后，删除 .bak 备份：
   `find C:/projects -name "CLAUDE.md.bak" -delete`
3. 跨机器使用：每台新机器运行 `/cto-link` 即可（详见手册 §29.8）
```

## --dry-run 模式

只扫描和输出 diff 预览，不修改任何文件。用于：
- 首次使用前确认效果
- 团队 review 迁移影响

## 注意

- 命令在 ai-playbook 仓库内运行（即从 ai-playbook 项目调度迁移）
- 备份文件 `.bak` 不会被 commit（CLAUDE.md.bak 已在 .gitignore 中匹配 `*.bak`）
- 如目标项目处于干净状态（无未提交改动），CLAUDE.md 改动会触发 git diff 让用户审视
- 失败的项目会列出具体原因（权限、文件锁定、解析错误等），不影响其他项目
