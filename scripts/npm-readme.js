#!/usr/bin/env node
/**
 * Swaps the npm-facing README in at pack time.
 *
 * npm always ships the tarball's README.md and offers no way to point it at a
 * different file, so `prepack` moves the GitHub README aside and copies
 * NPM_README.md over it, and `postpack` puts the original back.
 *
 * If a run is interrupted and README.md is left holding the npm copy, restore it
 * with: git checkout -- README.md
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const readme = path.join(root, 'README.md');
const npmReadme = path.join(root, 'NPM_README.md');
const backup = path.join(root, '.readme-github.bak');

const mode = process.argv[2];

if (mode === 'swap') {
  if (!fs.existsSync(npmReadme)) {
    console.error('npm-readme: NPM_README.md not found, keeping README.md as is');
    process.exit(0);
  }
  // Keep the first backup: a leftover one means README.md already holds the npm copy.
  if (!fs.existsSync(backup)) {
    fs.renameSync(readme, backup);
  }
  fs.copyFileSync(npmReadme, readme);
} else if (mode === 'restore') {
  if (fs.existsSync(backup)) {
    fs.renameSync(backup, readme);
  }
} else {
  console.error('usage: node scripts/npm-readme.js swap|restore');
  process.exit(1);
}
