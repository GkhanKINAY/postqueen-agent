#!/usr/bin/env node
/**
 * Swaps the npm-facing README in around a publish.
 *
 * npm always ships the tarball's README.md and offers no way to point it at a
 * different file. Worse, the readme npm stores in the registry metadata (what
 * npmjs.com renders) is read from the working directory, not from the tarball —
 * so a prepack/postpack swap ships a correct tarball with a stale package page.
 * README.md has to already be swapped when `npm publish` starts and stay swapped
 * until it finishes, which is what scripts/publish-npm.sh does.
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
} else if (mode === 'check') {
  // Guard against a bare `npm publish`, which would ship the GitHub README.
  if (fs.readFileSync(readme, 'utf8') !== fs.readFileSync(npmReadme, 'utf8')) {
    console.error(
      'npm-readme: README.md is not the npm copy.\n' +
        'Publish with: npm run publish:npm -- --otp=<code>'
    );
    process.exit(1);
  }
} else {
  console.error('usage: node scripts/npm-readme.js swap|restore|check');
  process.exit(1);
}
