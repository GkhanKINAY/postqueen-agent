#!/bin/sh
# Publishes the package with NPM_README.md standing in for README.md.
#
# npm reads the readme it stores in the registry metadata (what npmjs.com shows)
# from the working directory, so the swap has to be in place before `npm publish`
# starts and stay there until it returns. The trap restores the GitHub README
# even if the publish fails.
#
# Usage: npm run publish:npm -- --otp=123456
set -e

dir=$(dirname "$0")
trap 'node "$dir/npm-readme.js" restore' EXIT INT TERM

node "$dir/npm-readme.js" swap
npm publish --access public "$@"
