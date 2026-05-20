import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const result = spawnSync(process.execPath, ['scripts/validate-agent-wiki.mjs'], {
  encoding: 'utf8',
});

assert.equal(result.status, 0, result.stderr || result.stdout);
assert.match(
  `${result.stderr}${result.stdout}`,
  /project-only installation wording/i,
  'validator should confirm the project-only installation wording',
);
