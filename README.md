# Agent Wiki

一个用于初始化并维护 **Karpathy 式 LLM Wiki** 的 Claude Code 项目模板。它兼容 Google Cloud 的 [Open Knowledge Format（OKF）0.1](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)，同时**优先保留 Obsidian 原生格式**。

## 用途

当你想为一个新领域（如一个技术栈、研究方向、产品领域）构建一个由 LLM 维护、人类策展的 wiki 时，可以用这个项目快速启动：

- 自动生成目录结构
- 生成 `CLAUDE.md` / `AGENTS.md` schema 文档
- 创建 `index.md`、`log.md`
- 统一 frontmatter 和链接规范

## 项目结构

```text
Agent_Wiki/
├── Prompt.md              # 直接可用的完整提示词
├── README.md              # 本文件
├── skills/
│   └── init-wiki/
│       └── SKILL.md       # Claude Code skill，可通过 /init-wiki 调用
└── .gitignore
```

## 一句话启动（新电脑/未安装 skill）

```text
请先从 https://github.com/xiehuacheng/Agent_Wiki 安装 init-wiki skill（把仓库里的 skills/init-wiki/ 目录复制或软链到 ~/.claude/skills/init-wiki/），然后执行 /init-wiki 为我初始化一个关于 [你的领域] 的 LLM wiki。
```

如果 agent 没有自动安装，可以手动执行：

```bash
mkdir -p ~/.claude/skills
git clone https://github.com/xiehuacheng/Agent_Wiki.git /tmp/Agent_Wiki
cp -r /tmp/Agent_Wiki/skills/init-wiki ~/.claude/skills/
# 然后重启 Claude Code，输入 /init-wiki
```

## 快速开始

### 方式一：使用 Skill（推荐）

安装完成后，在 Claude Code 中输入：

```text
/init-wiki
```

Agent 会询问你想构建哪个领域的 wiki，然后自动完成初始化。

### 方式二：使用 Prompt.md

把 `Prompt.md` 的内容复制进 Claude Code 的对话，按提示回答领域问题即可。

## 生成的 Wiki 目录结构

```text
wiki/
├── 00-Raw/                # 原始资料（Markdown + type: source）
├── 01-Wiki/               # 知识点卡片（type: concept/card/comparison/algorithm）
├── 02-Areas/ 或 02-Module/ # 第二级分类（agent 会根据领域自动选择）
├── 03-Projects/           # 具体项目（type: project）
├── index.md               # 根目录，frontmatter 声明 okf_version: "0.1"
└── log.md                 # 追加式更新日志
```

## 核心约定

1. **Obsidian 优先**：内部链接统一使用 `[[知识点名称]]`，编辑已有页面时禁止改成标准 Markdown 链接。
2. **OKF 兼容**：每个概念 `.md` 文件都包含 YAML frontmatter，且至少包含 `type` 字段；根 `index.md` 声明 `okf_version`。
3. **保留 frontmatter**：不要删除或修改 `type`、`title`、`description`、`tags`、`aliases` 等字段，除非用户明确要求。
4. **仅在对外导出 OKF 时**，才批量把 `[[...]]` 转换为 `[文本](路径.md)`，且需先征得用户同意。

## 依赖（可选）

- [obsidian-skills](https://github.com/kepano/obsidian-skills)：Kepano 的 Obsidian 编辑 skill，安装后编辑体验更好，不安装也能正常使用。

## 相关资源

- Karpathy LLM Wiki 原文：https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- OKF 规范：https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md
