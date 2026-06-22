# Agent Wiki

## 当前目标

我们现在需要构建一个 Karpathy 式的 llm-wiki，同时兼容 Google Cloud 的 Open Knowledge Format（OKF）0.1，它是一个关于 xx（通过向我提问获取） 领域的 wiki。

## 一直遵循的哲学

请始终遵循 Karpathy 关于 wiki 式笔记和“原始资料 -> wiki”思路的原文中的哲学思想：https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f

同时参考 OKF 规范，让知识库在 Markdown + frontmatter 的基础上具备跨工具、跨 agent 的可解析性：https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md

## OKF 核心约定（融入本 wiki）

1. 每条知识都是一篇 Markdown 文件，**文件路径即概念身份**。
2. 每个概念文件**必须**包含 YAML frontmatter，且至少包含 `type` 字段。
3. 建议的 frontmatter 字段包括：`title`、`description`、`resource`、`tags`、`timestamp`。
4. 自定义字段可自由扩展；生成/消费工具必须保留不认识的字段。
5. 保留文件名：`index.md` 作为目录，`log.md` 作为追加式更新日志。**仅根目录的 `index.md`** 可包含 frontmatter 用于声明 `okf_version: "0.1"`；子目录中的 `index.md` 以及任何 `log.md` 不得包含 frontmatter。
6. 知识图谱优先使用 **Obsidian 双向链接**（`[[文本]]`）构建；如需与严格 OKF 工具交换，可在 lint/export 阶段转换为标准 Markdown 链接（`[文本](路径)`）。
7. 目录与建议 `type` 的对应关系：
   - `00-Raw/` 中的条目建议 `type: source`（或 `raw`）
   - `01-Wiki/` 中的条目建议 `type: concept`
   - `03-Projects/` 中的条目建议 `type: project`
   - 第二级目录的 `type` 按你在"目录设计"中的选择确定：`02-Areas/` → `type: area`；`02-Module/` → `type: module`
8. `CLAUDE.md` / `AGENTS.md` 等 schema/指令文件若位于知识包内，也属于 `.md` 文件，需包含 frontmatter 并指定 `type: schema`（或 `type: agents`），否则严格 OKF 校验会视为缺少 `type` 的概念文件。
9. `00-Raw/` 中的原始资料应尽可能转换为 Markdown 文件并标注 `type: source`；非 Markdown 附件（PDF、图片等）建议放在 `assets/` 等不被 OKF 消费者解析的目录，或通过 `resource` 字段引用。

## Obsidian 格式保留规则

本 wiki 在 Obsidian 中维护，因此**必须**保留 Obsidian 风格，不能因 OKF 兼容而破坏原生格式：

1. **优先且保留 `[[wikilink]]`**：新建内部链接时用 `[[知识点名称]]`，编辑已有页面时禁止把现有的 `[[...]]` 转成 `[...](...)`。
2. **外部链接用标准 Markdown**：如 `[来源](https://example.com)`。
3. **保留 YAML frontmatter**：不要删除或修改 `type`、`title`、`description`、`tags`、`aliases`、`cssclasses` 等字段，除非用户明确让你改。
4. **保留文件命名习惯**：继续使用中文知识点名称作为文件名，例如 `二叉树.md`，不要改成 slug。
5. **仅在明确需要对外导出 OKF 时**，才批量把 `[[...]]` 转换为标准 Markdown 链接；转换前需告知用户并征得同意。

## 注意事项

1. 请你确保在阅读完上面的链接之后再进行操作
2. 不要给知识库中填充初始知识
3. 有不确定的地方请向我提问
4. 如果你需要更好的 Obsidian 编辑支持，可在项目级别安装 kepano 的 obsidian-skills（https://github.com/kepano/obsidian-skills）；不安装也能正常使用。安装完后让我重启 agent 再继续。
5. 请为我提供一个 html 看板（非必选，向我提问确定需求），让我能看到 wiki 当前的状态
6. 请初始化 git 仓库
7. 请根据 Karpathy 原文 **和 OKF 约定** 定义好第一版 schema 文档（例如 CLAUDE.md for Claude Code or AGENTS.md for Codex），其中需包含：
   - 原文中讲到的 Wiki 内容类型
   - OKF 要求的 `type` 字段及取值规范
   - `index.md` 和 `log.md` 的角色：根目录 `index.md` 正文列出目录（可使用 Obsidian 风格 `[[标题]]` 或 OKF 风格 `[标题](相对路径)`）；`log.md` 的日期标题使用 ISO 8601 `YYYY-MM-DD` 格式
   - 文件命名、链接、frontmatter 的使用规则
8. 在首次生成**根目录** `index.md` 时，于其 frontmatter 中写入 `okf_version: "0.1"`

## 目录设计

初始化时创建以下四个基础目录：

- `00-Raw/` —— 输入的信息存放处，必须包含 `classified/` 和 `uncategorized/` 两个空子目录
- `01-Wiki/` —— 整理好的主题卡片，按知识点组织
- `02-Areas/` 或 `02-Module/` —— 第二级分类目录（只创建这一层空目录，不要在其下再划分具体领域子文件夹）
- `03-Projects/` —— 正在做的具体项目，相关内容都放这里

`02-*/` 下的具体子目录（如 `02-Module/数据结构/`、`02-Areas/AI工具/`）**不要在初始化时创建**。等后续用户提供资料、明确分类需求后，再询问用户是否需要创建，以及采用什么命名。
