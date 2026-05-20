# agent-wiki Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a lightweight `agent-wiki` skill pack that installs only into the current project and gives agents a canonical workflow for bootstrapping, ingesting, querying, and linting a wiki-style knowledge base.

**Architecture:** Keep one canonical skill source set under `skills/` and make `using-agent-wiki` the mandatory entry point. The package will not detect agent identity or maintain platform-specific body copies; instead, it will instruct the agent to install the skills into the current project using that platform's local/project-level mechanism. The implementation also includes a small validation script and a test suite that checks the skill pack structure and the project-only installation wording.

**Tech Stack:** Markdown skill files, Node.js for validation scripts, plain shell-based verification, git.

---

### Task 1: Create the canonical skill pack layout

**Files:**
- Create: `skills/using-agent-wiki/SKILL.md`
- Create: `skills/agent-wiki-bootstrap/SKILL.md`
- Create: `skills/agent-wiki-structure/SKILL.md`
- Create: `skills/agent-wiki-ingest/SKILL.md`
- Create: `skills/agent-wiki-query/SKILL.md`
- Create: `skills/agent-wiki-lint/SKILL.md`
- Create: `skills/README.md`
- Create: `tests/skills-layout.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `tests/skills-layout.test.mjs` with assertions that the six skill files and `skills/README.md` exist.

```js
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

const files = [
  "skills/using-agent-wiki/SKILL.md",
  "skills/agent-wiki-bootstrap/SKILL.md",
  "skills/agent-wiki-structure/SKILL.md",
  "skills/agent-wiki-ingest/SKILL.md",
  "skills/agent-wiki-query/SKILL.md",
  "skills/agent-wiki-lint/SKILL.md",
  "skills/README.md",
];

for (const file of files) {
  assert.equal(existsSync(file), true, `${file} should exist`);
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/skills-layout.test.mjs`
Expected: FAIL because the files do not exist yet.

- [ ] **Step 3: Write minimal implementation**

Create the directory tree and add minimal `SKILL.md` frontmatter plus concise body text to each file. `using-agent-wiki` must explicitly say that installation is project-only and never global.

Example `skills/using-agent-wiki/SKILL.md` content:

```md
---
name: using-agent-wiki
description: Mandatory entry point for agent-wiki tasks in this project.
---

# Using agent-wiki

Install into this project only. Never install globally.

Use this skill before any task that creates, queries, ingests, or lints an agent-wiki project.
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/skills-layout.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add skills tests/skills-layout.test.mjs
git commit -m "feat: add canonical agent-wiki skills"
```

### Task 2: Add a validator for project-only installation wording and skill metadata

**Files:**
- Create: `scripts/validate-agent-wiki.mjs`
- Create: `tests/validate-agent-wiki.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `tests/validate-agent-wiki.test.mjs` that runs the validator and checks for a zero exit code plus a message confirming the project-only installation wording.

```js
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const result = spawnSync("node", ["scripts/validate-agent-wiki.mjs"], { encoding: "utf8" });

assert.equal(result.status, 0, result.stderr || result.stdout);
assert.match(result.stdout, /project only/i);
assert.match(result.stdout, /never install globally/i);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/validate-agent-wiki.test.mjs`
Expected: FAIL because the validator script does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Implement `scripts/validate-agent-wiki.mjs` to:

1. Read all `skills/*/SKILL.md` files.
2. Confirm each one has YAML frontmatter.
3. Confirm `using-agent-wiki` contains the exact project-only installation wording.
4. Print a short success summary.

```js
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const skillsDir = "skills";
const entries = readdirSync(skillsDir, { withFileTypes: true });
const skillFiles = entries
  .filter((entry) => entry.isDirectory())
  .map((entry) => join(skillsDir, entry.name, "SKILL.md"));

for (const file of skillFiles) {
  const text = readFileSync(file, "utf8");
  if (!text.startsWith("---\n")) {
    throw new Error(`${file} is missing YAML frontmatter`);
  }
}

const usingText = readFileSync("skills/using-agent-wiki/SKILL.md", "utf8").toLowerCase();
if (!usingText.includes("install into this project only")) {
  throw new Error("using-agent-wiki must say install into this project only");
}
if (!usingText.includes("never install globally")) {
  throw new Error("using-agent-wiki must say never install globally");
}

console.log(`Validated ${skillFiles.length} skill files; project only install wording present.`);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/validate-agent-wiki.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/validate-agent-wiki.mjs tests/validate-agent-wiki.test.mjs
git commit -m "test: add agent-wiki validator"
```

### Task 3: Flesh out the bootstrap and structure skills

**Files:**
- Modify: `skills/agent-wiki-bootstrap/SKILL.md`
- Modify: `skills/agent-wiki-structure/SKILL.md`
- Modify: `tests/validate-agent-wiki.test.mjs`

- [ ] **Step 1: Write the failing test**

Extend `tests/validate-agent-wiki.test.mjs` to check that:

1. `agent-wiki-bootstrap` mentions initializing a wiki in the current project.
2. `agent-wiki-structure` mentions page types, links, and frontmatter.

```js
assert.match(
  readFileSync("skills/agent-wiki-bootstrap/SKILL.md", "utf8").toLowerCase(),
  /current project/
);
assert.match(
  readFileSync("skills/agent-wiki-structure/SKILL.md", "utf8").toLowerCase(),
  /frontmatter/
);
assert.match(
  readFileSync("skills/agent-wiki-structure/SKILL.md", "utf8").toLowerCase(),
  /links/
);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/validate-agent-wiki.test.mjs`
Expected: FAIL until the content is expanded.

- [ ] **Step 3: Write minimal implementation**

Update the two skills so they describe:

- `agent-wiki-bootstrap`: create the wiki root, seed files, and initial index inside the current project.
- `agent-wiki-structure`: define page categories, naming, links, and frontmatter fields for sources, pages, and indexes.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/validate-agent-wiki.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add skills/agent-wiki-bootstrap/SKILL.md skills/agent-wiki-structure/SKILL.md tests/validate-agent-wiki.test.mjs
git commit -m "feat: define bootstrap and structure skills"
```

### Task 4: Flesh out ingest, query, and lint skills

**Files:**
- Modify: `skills/agent-wiki-ingest/SKILL.md`
- Modify: `skills/agent-wiki-query/SKILL.md`
- Modify: `skills/agent-wiki-lint/SKILL.md`
- Modify: `tests/validate-agent-wiki.test.mjs`

- [ ] **Step 1: Write the failing test**

Extend `tests/validate-agent-wiki.test.mjs` to check that:

1. `agent-wiki-ingest` mentions raw sources, traceability, and wiki pages.
2. `agent-wiki-query` mentions answering from the wiki and writing back new stable knowledge when appropriate.
3. `agent-wiki-lint` mentions orphan pages, broken links, duplicates, and stale content.

```js
assert.match(readFileSync("skills/agent-wiki-ingest/SKILL.md", "utf8").toLowerCase(), /raw sources/);
assert.match(readFileSync("skills/agent-wiki-ingest/SKILL.md", "utf8").toLowerCase(), /traceability/);
assert.match(readFileSync("skills/agent-wiki-query/SKILL.md", "utf8").toLowerCase(), /write back/);
assert.match(readFileSync("skills/agent-wiki-lint/SKILL.md", "utf8").toLowerCase(), /broken links/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/validate-agent-wiki.test.mjs`
Expected: FAIL until the content is expanded.

- [ ] **Step 3: Write minimal implementation**

Update the three skills so their responsibilities are explicit and non-overlapping:

- ingest compiles sources into stable pages
- query answers from the wiki and can suggest durable additions
- lint checks graph and content health

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/validate-agent-wiki.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add skills/agent-wiki-ingest/SKILL.md skills/agent-wiki-query/SKILL.md skills/agent-wiki-lint/SKILL.md tests/validate-agent-wiki.test.mjs
git commit -m "feat: flesh out ingest query and lint skills"
```

### Task 5: Add top-level documentation for package usage

**Files:**
- Create: `README.md`
- Create: `tests/readme.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `tests/readme.test.mjs` that checks the README mentions project-only installation, canonical skills, and the six skill names.

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const readme = readFileSync("README.md", "utf8").toLowerCase();
assert.match(readme, /project only/);
assert.match(readme, /using-agent-wiki/);
assert.match(readme, /agent-wiki-bootstrap/);
assert.match(readme, /agent-wiki-query/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/readme.test.mjs`
Expected: FAIL because the README does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Create a short README that explains:

- what the package is
- that it installs only into the current project
- what each skill is for
- how the canonical skill set is organized

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/readme.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add README.md tests/readme.test.mjs
git commit -m "docs: add agent-wiki package overview"
```

### Task 6: Run a final full validation pass

**Files:**
- No new files

- [ ] **Step 1: Run all validation tests**

Run:

```bash
node tests/skills-layout.test.mjs
node tests/validate-agent-wiki.test.mjs
node tests/readme.test.mjs
node scripts/validate-agent-wiki.mjs
```

Expected: all commands exit successfully and print the project-only installation confirmation.

- [ ] **Step 2: Review the git diff**

Run:

```bash
git status --short
git diff --stat
```

Expected: only the intended `skills/`, `scripts/`, `tests/`, and `README.md` changes are present.

- [ ] **Step 3: Commit the final state**

```bash
git add .
git commit -m "chore: finalize agent-wiki skill pack"
```

## Self-review

Coverage check:

- Project-only installation wording is covered in Task 1 and validated in Task 2.
- Canonical skill layout is covered in Task 1.
- Bootstrap and structure responsibilities are covered in Task 3.
- Ingest, query, and lint responsibilities are covered in Task 4.
- User-facing overview documentation is covered in Task 5.
- Final validation is covered in Task 6.

Placeholder scan:

- No TBD/TODO placeholders.
- Every task includes concrete files and commands.
- Every test step includes executable code.

Type/signature consistency:

- All scripts are plain Node ESM modules.
- The validator file path is consistent across Task 2 and Task 6.
- Skill names are consistent across the entire plan and match the design spec.
