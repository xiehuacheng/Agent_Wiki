import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

function listSkillFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      return listSkillFiles(path);
    }
    return entry.isFile() && entry.name === 'SKILL.md' ? [path] : [];
  });
}

function hasYamlFrontmatter(content) {
  return /^---\n[\s\S]*?\n---\n/.test(content);
}

const skillFiles = listSkillFiles('skills');

for (const file of skillFiles) {
  const content = readFileSync(file, 'utf8');
  if (!hasYamlFrontmatter(content)) {
    throw new Error(`${file} is missing YAML frontmatter`);
  }
}

const usingAgentWiki = readFileSync('skills/using-agent-wiki/SKILL.md', 'utf8');
const requiredWording = 'Install into this project only. Never install globally.';

if (!usingAgentWiki.includes(requiredWording)) {
  throw new Error('using-agent-wiki is missing the project-only installation wording');
}

console.log(`Validated ${skillFiles.length} skills and confirmed project-only installation wording.`);
