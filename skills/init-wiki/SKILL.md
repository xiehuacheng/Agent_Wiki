---
name: init-wiki
description: 根据指定领域，初始化并维护一个 Obsidian 优先、兼容 Google Cloud OKF 0.1 的 Karpathy 式 LLM wiki。
---

# 构建 Agent Wiki

帮助用户构建一个 Karpathy 风格的 LLM wiki，并遵循 Google Cloud Open Knowledge Format（OKF）v0.1 规范。

## 执行流程

执行过程中，可将耗时的独立执行任务（如批量创建/更新卡片）交给 sub agent 并行处理；但 **Ingest 中的 takeaways 讨论和页面方案确认必须由主会话完成**，主会话负责任务拆分、结果整合与质量兜底。若 sub agent 失败或超时，主会话应及时接管，避免阻塞整体流程。

1. 如果用户还没有说明领域或主题，先问：**“你想构建关于哪个领域的 wiki？”**
2. 参考 Karpathy 的 LLM Wiki 模式（https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f）和 OKF 规范（https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md）。
3. **不要预填初始知识**，等待用户提供来源或明确指令。
4. 如果项目还没有 git 仓库，请先初始化。
5. 初始化时创建以下四个基础目录：
   - `00-Raw/` —— 原始资料存放处，必须包含 `classified/` 与 `uncategorized/` 两个空子目录。**原始资料只读不改**，Agent 读取后不要在原文件上做任何修改。这两个子目录不需要放 `index.md`。
   - `01-Wiki/` —— 主题卡片。
   - `02-Areas/` 或 `02-Module/` —— 第二级分类目录，只创建这一层空目录；不要在其下再创建具体领域子文件夹。
   - `03-Projects/` —— 具体项目。
   
   `02-*/` 下的具体子目录（如 `02-Module/数据结构/`、`02-Areas/AI工具/`）不要在初始化时创建。等用户提供资料并明确分类需求后，再询问用户是否需要创建、采用什么命名，然后根据用户确认创建。
6. 创建第一版 agent schema 文档（例如 Claude Code 用 `CLAUDE.md`，Codex / OpenCode 等用 `AGENTS.md`），并同时创建 `WORKFLOWS.md` 作为工作流程手册。可参考仓库根目录下的 `templates/WORKFLOWS.md` 模板。其中需包含：
   - Karpathy 原文中提到的 Wiki 内容类型
   - OKF 要求的 `type` 字段及取值规范
   - 根目录 `index.md` 和 `log.md` 的角色与格式
   - 文件命名、链接、frontmatter 的使用规则
   - 核心工作流程：Ingest、Query、Lint 的**明确职责分界**、触发条件与执行步骤
   - 扫描版/非文本资料的处理方式（如有）
7. 创建**根目录** `index.md`，frontmatter 中写入 `okf_version: "0.1"`，正文列出 wiki 目录入口。注意：`00-Raw/` 不要作为 `[[00-Raw]]` 的 wikilink 目标，因为 raw 目录不需要 `index.md`；写成纯文本说明即可。其他目录链接使用 Obsidian 风格 `[[标题]]` 或 OKF 风格 `[标题](相对路径)`。
8. 创建 `log.md`，日期标题使用 ISO 8601 格式 `YYYY-MM-DD`，并写入初始化记录。
9. 可选项：如果用户需要，再询问是否为其创建一个 HTML 看板来展示 wiki 状态。

## Ingest 强制流程（必须先讨论，后写入）

为了贴近 Karpathy 原版的 LLM Wiki 思想，Ingest 不是“把资料丢进去就自动生成卡片”的批处理任务，而是一个**人机协作的策展过程**。执行 Ingest 时，主会话必须先完成以下两个阶段，再决定是否使用 sub agent 并行创建卡片：

### 阶段一：讨论关键收获（Key Takeaways）

这一步必须先做，不能跳过。重点是**内容层面的对话**，而不是直接规划写哪些页面。

1. **读取所有待处理的原始资料**。
2. **按来源提炼关键收获**：为每个资料用 1–2 句话概括其主旨，然后列出核心论点、关键概念、重要数据、与已有 wiki 的冲突或补充、作者的限制/假设等。不预设数量，按实际内容列出。
3. **把关键收获展示给用户，并展开讨论**：
   - 这些资料主要说了什么？
   - 哪些观点最有价值？
   - 哪些和已有知识矛盾或需要更新？
   - 用户有没有想补充、质疑或特别强调的地方？
4. **根据用户反馈调整收获重点**。

### 阶段二：基于收获规划页面方案

在确认关键收获之后，才把讨论结果转化为具体的 wiki 写入方案。

1. **基于已确认的关键收获，提出“本次处理清单”**：
   - 新增的概念/实体卡
   - 需要更新的已有页面
   - 可能值得创建的对比/算法/项目页面
   - 建议合并或明确边界的重叠主题
   - 暂时不值得单独成卡、但可以在已有页面中提及的内容
2. **向用户展示处理清单并等待确认**：让用户看到将要写什么、改什么、合并什么，询问是否有要调整、补充、跳过或合并的项。
3. **用户确认后，才使用 sub agent 并行创建/更新具体卡片**。
4. **sub agent 完成后，主会话执行去重与边界澄清**，更新 `index.md`、相关概览和 `log.md`。

如果 sub agent 失败或超时，主会话应接管并手动完成对应卡片，避免阻塞流程。详见 `WORKFLOWS.md` 的 Ingest 流程。

## 升级与迁移

当 `init-wiki` skill 本身有重大更新（如 Ingest 流程调整、目录约定变化）时，已经用旧版 skill 初始化的 wiki 项目不会自动更新。主会话应：

1. **同步 `WORKFLOWS.md`**：将项目根目录的 `WORKFLOWS.md` 与当前 skill 模板对齐。这是项目级文件，skill 更新不会自动覆盖。
2. **同步 `CLAUDE.md` / `AGENTS.md`**：把 schema 文档中的过时约定（如目录结构、frontmatter 规则、工作流程）更新到最新版本。
3. **清理过时结构**：例如旧版可能创建了 `00-Raw/index.md`、`00-Raw/classified/index.md`、`00-Raw/uncategorized/index.md` 等，新版已明确这些目录不需要 `index.md`，应删除。
4. **更新根 `index.md`**：如果旧版链接了不应再存在的页面或目录（如 `[[00-Raw]]`），应移除或改为纯文本说明。
5. **在 `log.md` 中记录迁移**：说明本次迁移的原因和变更内容。

完成迁移后，再按新版流程继续 Ingest / Query / Lint。

## 必须遵守的 OKF 约定

- 每个概念 `.md` 文件都必须包含可解析的 YAML frontmatter，且至少有一个非空的 `type` 字段。
- 建议的 frontmatter 字段包括：`title`、`description`、`resource`、`tags`、`timestamp`（ISO 8601）。
- 允许自定义扩展字段；消费工具应保留不认识的键，不能因此拒绝文档。
- **只有根目录的 `index.md`** 可以包含 frontmatter，且仅用于声明 `okf_version`；子目录中的 `index.md` 和任何 `log.md` 都不得包含 frontmatter。
- **子目录 `index.md` 的角色**：允许作为该目录的导航/概览页存在，但不是必须的；如果存在，只能包含目录说明和页面链接，不能包含 frontmatter，也不应被当作概念页面。
- 知识图谱优先使用 Obsidian 双向链接（`[[文本]]`）。如需与严格 OKF 工具交换，可在 lint/export 阶段转换为标准 Markdown 链接（`[文本](路径)`）。
- 概念身份等于文件在包内的路径去掉 `.md` 后缀。
- 断链是允许的，不能视为格式错误。

## Obsidian 格式保留规则

- **优先且保留 `[[wikilink]]`**：新建内部链接时用 `[[知识点名称]]`；编辑已有页面时，禁止把现有的 `[[...]]` 转成 `[...](...)`。
- **外部链接用标准 Markdown**：如 `[来源](https://example.com)`。
- **保留 YAML frontmatter**：不要删除或修改 `type`、`title`、`description`、`tags`、`aliases`、`cssclasses` 等字段，除非用户明确要求。
- **保留文件命名习惯**：继续使用中文知识点名称作为文件名，例如 `二叉树.md`，不要改成 slug。
- **防止双后缀**：概念 `.md` 文件不得以 `.md` 结尾再加 `.md`（禁止 `CLAUDE.md.md`、`index.md.md`、`log.md.md`）。若概念名本身含 `.md`（如 `CLAUDE.md`），应命名为 `CLAUDE.md 配置文件.md` 或 `CLAUDE.md 项目规范.md`。
- **仅在明确需要对外导出 OKF 时**，才批量把 `[[...]]` 转换为标准 Markdown 链接；转换前需告知用户并征得同意。

## 其他注意事项

- 有不确定的地方请向用户提问。
- 如果需要更好的 Obsidian 编辑支持，可在项目级别安装 kepano 的 `obsidian-skills`，安装完后请用户重启 agent 再继续；不安装也能正常使用。
