---
name: init-wiki
description: 根据指定领域，初始化并维护一个 Obsidian 优先、兼容 Google Cloud OKF 0.1 的 Karpathy 式 LLM wiki。
---

# 构建 Agent Wiki

帮助用户构建一个 Karpathy 风格的 LLM wiki，并遵循 Google Cloud Open Knowledge Format（OKF）v0.1 规范。

## 执行流程

1. 如果用户还没有说明领域或主题，先问：**“你想构建关于哪个领域的 wiki？”**
2. 参考 Karpathy 的 LLM Wiki 模式（https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f）和 OKF 规范（https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md）。
3. **不要预填初始知识**，等待用户提供来源或明确指令。
4. 如果项目还没有 git 仓库，请先初始化。
5. 设计并创建目录结构：
   - `00-Raw/` —— 原始资料存放处。尽量把输入转换成 Markdown，并使用 `type: source`（或 `type: raw`）。
   - `01-Wiki/` —— 整理好的主题卡片，使用 `type: concept`。
   - `02-*/` —— 第二级分类目录，由你根据领域特征自行选择：
     - 若领域偏跨学科、工具导向或主题松散（例如“AI 工具”“学习方法”），使用 `02-Areas/`，条目 `type: area`。
     - 若领域有明确技术板块或课程结构（例如“自然语言处理”“计算机视觉”），使用 `02-Module/`，条目 `type: module`。
     - 用 1–2 句话说明你的选择理由。如果两种特征都很强，优先选 `02-Areas/`，再在下面用子目录表达模块。
   - `03-Projects/` —— 正在做的具体项目，使用 `type: project`。
   - 非 Markdown 附件（PDF、图片等）放在 `assets/` 目录，或通过 `resource` frontmatter 字段引用。
6. 创建第一版 schema 文档（Claude Code 用 `CLAUDE.md`，Codex 用 `AGENTS.md`），其中需包含：
   - Karpathy 原文中提到的 Wiki 内容类型
   - OKF 要求的 `type` 字段及取值规范
   - 根目录 `index.md` 和 `log.md` 的角色与格式
   - 文件命名、链接、frontmatter 的使用规则
7. 创建**根目录** `index.md`，frontmatter 中写入 `okf_version: "0.1"`，正文列出目录（可使用 Obsidian 风格 `[[标题]]` 或 OKF 风格 `[标题](相对路径)`）。
8. 创建 `log.md`，日期标题使用 ISO 8601 格式 `YYYY-MM-DD`，并写入初始化记录。

## 必须遵守的 OKF 约定

- 每个概念 `.md` 文件都必须包含可解析的 YAML frontmatter，且至少有一个非空的 `type` 字段。
- 建议的 frontmatter 字段包括：`title`、`description`、`resource`、`tags`、`timestamp`（ISO 8601）。
- 允许自定义扩展字段；消费工具应保留不认识的键，不能因此拒绝文档。
- **只有根目录的 `index.md`** 可以包含 frontmatter，且仅用于声明 `okf_version`；子目录中的 `index.md` 和任何 `log.md` 都不得包含 frontmatter。
- 知识图谱优先使用 Obsidian 双向链接（`[[文本]]`）。如需与严格 OKF 工具交换，可在 lint/export 阶段转换为标准 Markdown 链接（`[文本](路径)`）。
- 概念身份等于文件在包内的路径去掉 `.md` 后缀。
- 断链是允许的，不能视为格式错误。

## Obsidian 格式保留规则

- **优先且保留 `[[wikilink]]`**：新建内部链接时用 `[[知识点名称]]`；编辑已有页面时，禁止把现有的 `[[...]]` 转成 `[...](...)`。
- **外部链接用标准 Markdown**：如 `[来源](https://example.com)`。
- **保留 YAML frontmatter**：不要删除或修改 `type`、`title`、`description`、`tags`、`aliases`、`cssclasses` 等字段，除非用户明确要求。
- **保留文件命名习惯**：继续使用中文知识点名称作为文件名，例如 `二叉树.md`，不要改成 slug。
- **仅在明确需要对外导出 OKF 时**，才批量把 `[[...]]` 转换为标准 Markdown 链接；转换前需告知用户并征得同意。

## 其他注意事项

- 有不确定的地方请向用户提问。
- 如果需要更好的 Obsidian 编辑支持，可在项目级别安装 kepano 的 `obsidian-skills`，安装完后请用户重启 agent 再继续；不安装也能正常使用。
