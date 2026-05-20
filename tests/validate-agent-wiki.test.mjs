import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const result = spawnSync(process.execPath, ['scripts/validate-agent-wiki.mjs'], {
  encoding: 'utf8',
});

assert.equal(result.status, 0, result.stderr || result.stdout);
assert.match(result.stdout, /project only/i);
assert.match(result.stdout, /never install globally/i);

const bootstrap = readFileSync('skills/agent-wiki-bootstrap/SKILL.md', 'utf8');
const structure = readFileSync('skills/agent-wiki-structure/SKILL.md', 'utf8');
const ingest = readFileSync('skills/agent-wiki-ingest/SKILL.md', 'utf8');
const query = readFileSync('skills/agent-wiki-query/SKILL.md', 'utf8');
const lint = readFileSync('skills/agent-wiki-lint/SKILL.md', 'utf8');

assert.match(bootstrap, /initialize a wiki in the current project/i);
assert.match(structure, /page types/i);
assert.match(structure, /links/i);
assert.match(structure, /frontmatter/i);
assert.match(ingest, /compile raw sources into stable wiki pages/i);
assert.match(ingest, /raw sources/i);
assert.match(ingest, /traceability/i);
assert.match(ingest, /wiki pages/i);
assert.match(query, /answer from the wiki/i);
assert.match(query, /write back new stable knowledge when appropriate/i);
assert.match(lint, /graph and content health/i);
assert.match(lint, /orphan pages/i);
assert.match(lint, /broken links/i);
assert.match(lint, /duplicates/i);
assert.match(lint, /stale content/i);
