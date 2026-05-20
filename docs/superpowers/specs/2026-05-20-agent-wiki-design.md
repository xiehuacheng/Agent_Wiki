# agent-wiki Skills 包设计说明

## 背景

`agent-wiki` 是一个轻量 skills 包，目标不是预置一套 wiki 目录，而是让 agent 在**当前项目内**自己安装、创建、维护和查询一套符合 llm-wiki 范式的知识库工作流。

这套设计对齐 Karpathy 关于 `raw sources -> wiki -> continuous maintenance` 的思路：原始资料是输入，wiki 是持续编译出来的稳定产物，skills 只是把这套编译流程变成可重复执行的能力。

## 目标

1. 只面向**本项目级安装**，不做全局安装。
2. 只保留一套 canonical skill 文本，不拆成三份平台正文。
3. 让 agent 能从零初始化一个 wiki 项目。
4. 让 agent 能把原始材料编译进 wiki。
5. 让 agent 能基于 wiki 回答问题，并在必要时沉淀为新的 wiki 内容。
6. 让 agent 能对 wiki 做结构和内容健康检查。

## 非目标

1. 不做身份识别，不区分 Codex / Claude Code / Hermes 的运行时分支。
2. 不做全局技能安装器。
3. 不预先在仓库里放好 wiki 目录。
4. 不把查询回答做成纯检索工具；它必须和沉淀、维护联动。

## 命名

统一使用 `agent-wiki` 前缀，避免 `llm` 这个更窄的命名。

推荐的技能集合：

- `using-agent-wiki`
- `agent-wiki-bootstrap`
- `agent-wiki-structure`
- `agent-wiki-ingest`
- `agent-wiki-query`
- `agent-wiki-lint`

## 总体架构

### 1. `using-agent-wiki`

总入口和门禁 skill。

职责：

- 告诉 agent：凡是涉及 agent-wiki 的任务，先读这里。
- 说明这套包只安装到当前项目，不要全局安装。
- 根据任务类型把 agent 导向对应子 skill。
- 保持规则简短、明确、可执行。

### 2. `agent-wiki-bootstrap`

从零创建 wiki 项目的 skill。

职责：

- 在当前项目目录内创建所需文件夹和初始文件。
- 生成最小可用的 wiki 入口、索引和约定文件。
- 初始化后续 ingest / query / lint 所需的基础结构。

### 3. `agent-wiki-structure`

结构规范 skill。

职责：

- 定义 wiki 页类型。
- 定义目录命名、链接约定、frontmatter 字段、索引规则。
- 约束原始资料、编译产物和维护文件之间的边界。

### 4. `agent-wiki-ingest`

编译输入资料进入 wiki 的 skill。

职责：

- 从原始来源提炼稳定知识。
- 将来源、摘要、结论、链接关系沉淀为 wiki 页面。
- 保证内容可追溯，必要时保留来源指针。

### 5. `agent-wiki-query`

查询与回答 skill。

职责：

- 基于现有 wiki 回答问题。
- 先找相关页面，再找上下文，再整合结论。
- 如果答案包含可复用的新知识，应建议沉淀回 wiki。
- 如果信息不足，要明确说明缺口，而不是补编。

### 6. `agent-wiki-lint`

健康检查 skill。

职责：

- 找孤页、断链、重复页、过时内容。
- 检查 frontmatter 和命名一致性。
- 提醒需要重编译或重链接的内容。

## 安装模型

这套包只允许**项目内安装**。

总入口 skill 必须明确写出：

> Install into this project only. Never install globally.

实现上，skill 文本不负责区分平台身份，也不复制三套正文。它只要求 agent 按各自平台的项目级 / workspace 级标准，把这套 skill 安装到当前项目。

## 工作流

### Bootstrap

1. 读取 `using-agent-wiki`。
2. 判断当前任务是从零创建 wiki。
3. 调用 `agent-wiki-bootstrap`。
4. 结合 `agent-wiki-structure` 创建目录、索引和基础文件。
5. 输出一个可继续 ingest 的初始状态。

### Ingest

1. 读取 `agent-wiki-ingest`。
2. 确定来源材料。
3. 提炼稳定知识。
4. 写入或更新 wiki 页面。
5. 维护链接与来源追溯。

### Query

1. 读取 `agent-wiki-query`。
2. 先查相关 wiki 页，再查上下文和关联页。
3. 组织答案。
4. 如果答案本身形成稳定知识，建议写回 wiki。

### Lint

1. 读取 `agent-wiki-lint`。
2. 扫描结构、命名、链接、重复和过时内容。
3. 输出修复建议。

## 设计原则

1. 轻量优先。
2. 单一 canonical 内容。
3. 项目内安装。
4. 编译、查询、维护分离。
5. 回答可沉淀，知识可持续增厚。

## 验收标准

1. 一个空项目可以在本地被 agent 初始化为可用 wiki。
2. 查询能力可以从 wiki 中给出带依据的回答。
3. 维护能力可以发现结构和内容问题。
4. 不需要全局安装即可工作。
5. 不需要为不同 agent 维护三套重复正文。

