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

assert.match(bootstrap, /initialize a wiki in the current project/i);
assert.match(structure, /page types/i);
assert.match(structure, /links/i);
assert.match(structure, /frontmatter/i);
