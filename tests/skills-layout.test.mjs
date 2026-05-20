import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

const files = [
  'skills/using-agent-wiki/SKILL.md',
  'skills/agent-wiki-bootstrap/SKILL.md',
  'skills/agent-wiki-structure/SKILL.md',
  'skills/agent-wiki-ingest/SKILL.md',
  'skills/agent-wiki-query/SKILL.md',
  'skills/agent-wiki-lint/SKILL.md',
  'skills/README.md',
];

for (const file of files) {
  assert.equal(existsSync(file), true, `${file} should exist`);
}
