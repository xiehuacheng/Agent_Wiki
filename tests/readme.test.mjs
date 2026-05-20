import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const readme = readFileSync('README.md', 'utf8');

assert.match(readme, /current project/i);
assert.match(readme, /project only/i);
assert.match(readme, /canonical agent-wiki skill set/i);
assert.match(readme, /using-agent-wiki/i);
assert.match(readme, /agent-wiki-bootstrap/i);
assert.match(readme, /agent-wiki-structure/i);
assert.match(readme, /agent-wiki-ingest/i);
assert.match(readme, /agent-wiki-query/i);
assert.match(readme, /agent-wiki-lint/i);
assert.match(readme, /six skills/i);
