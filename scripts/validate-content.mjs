import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();
const docsDir = path.join(rootDir, 'src', 'content', 'docs');
const referencesPath = path.join(rootDir, 'src', 'data', 'references.json');

const errors = [];

const references = JSON.parse(await readFile(referencesPath, 'utf8'));
if (!Array.isArray(references)) {
  throw new Error('src/data/references.json must be an array.');
}

const referenceIds = new Set();
for (const reference of references) {
  if (!reference || typeof reference !== 'object') {
    errors.push('Each reference entry must be an object.');
    continue;
  }

  const { id, authors, year, title } = reference;

  if (typeof id !== 'string' || id.length === 0) {
    errors.push('Each reference entry must include a non-empty string id.');
    continue;
  }

  if (referenceIds.has(id)) {
    errors.push(`Duplicate reference id found in references.json: ${id}`);
  }
  referenceIds.add(id);

  if (typeof authors !== 'string' || authors.length === 0) {
    errors.push(`Reference "${id}" is missing a non-empty authors field.`);
  }
  if (!Number.isInteger(year)) {
    errors.push(`Reference "${id}" is missing an integer year.`);
  }
  if (typeof title !== 'string' || title.length === 0) {
    errors.push(`Reference "${id}" is missing a non-empty title field.`);
  }
}

async function collectFiles(dir, matcher) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath, matcher)));
    } else if (matcher(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function parseFrontmatterReferences(filePath, content) {
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) {
    errors.push(`${path.relative(rootDir, filePath)} is missing frontmatter.`);
    return [];
  }

  const referencesMatch = frontmatterMatch[1].match(/(?:^|\r?\n)references:\s*\[(.*?)\]\s*(?:\r?\n|$)/);
  if (!referencesMatch) {
    errors.push(`${path.relative(rootDir, filePath)} is missing a references array in frontmatter.`);
    return [];
  }

  const ids = referencesMatch[1]
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  for (const id of ids) {
    if (!referenceIds.has(id)) {
      errors.push(`${path.relative(rootDir, filePath)} frontmatter references unknown id "${id}".`);
    }
  }

  return ids;
}

function parseCitationIds(content) {
  const citationIds = [];
  const citationPattern = /CitationRef\s+[^>]*id="([^"]+)"/g;

  for (const match of content.matchAll(citationPattern)) {
    citationIds.push(match[1]);
  }

  return [...new Set(citationIds)];
}

const mdxFiles = await collectFiles(docsDir, (filePath) => filePath.endsWith('.mdx'));
for (const filePath of mdxFiles) {
  const content = await readFile(filePath, 'utf8');
  const frontmatterReferences = parseFrontmatterReferences(filePath, content);
  const frontmatterReferenceSet = new Set(frontmatterReferences);
  const citationIds = parseCitationIds(content);

  for (const citationId of citationIds) {
    if (!referenceIds.has(citationId)) {
      errors.push(`${path.relative(rootDir, filePath)} uses unknown CitationRef id "${citationId}".`);
    }
    if (!frontmatterReferenceSet.has(citationId)) {
      errors.push(
        `${path.relative(rootDir, filePath)} uses CitationRef id "${citationId}" but does not list it in frontmatter references.`
      );
    }
  }
}

if (errors.length > 0) {
  console.error('Content validation failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Content validation passed.');
