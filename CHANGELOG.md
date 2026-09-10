# Changelog

All notable changes to the PostQueen CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.22] - 2026-09-11

### Added
- `posts:settings` - Update a post's provider settings via `PUT /public/v1/posts/:id/settings` (merged: only the keys you pass change; unpublished DRAFT/QUEUE posts only). Needs a PostQueen API that serves this endpoint.
- Cursor plugin: `.cursor-plugin/plugin.json` and `.cursor-plugin/marketplace.json`, so the repo installs as a [Cursor plugin](https://cursor.com/docs/reference/plugins) next to the Claude Code plugin.
- Grok Build plugin: `.grok-plugin/plugin.json` and `.grok-plugin/marketplace.json`. Like the Claude Code and Cursor plugins it is skill/CLI-only and registers no MCP server.
- `npm run sync-skill` copies the root `SKILL.md` into `skills/postqueen/SKILL.md`.

### Changed
- `skills/postqueen/SKILL.md` is now a real file instead of a symlink to the root `SKILL.md`, so plugin installers that do not follow symlinks still get the skill. Run `npm run sync-skill` after editing `SKILL.md`.
- `posts:list` output includes each post's current `settings` when the API returns them.
- SKILL.md has four hard rules instead of two: TikTok posts must use `content_posting_method: "DIRECT_POST"`, and agents must honor the `rules` and field descriptions from `integrations:settings`. TikTok examples use `privacy_level` and `content_posting_method`.

### Fixed
- The Claude Code plugin manifest points `skills` at `./skills/postqueen` instead of `./`, so the skill is no longer loaded twice.
- `auth:login` no longer prints the host's error page when no auth server answers. PostQueen Cloud does not run one behind the default `cli-auth.postqueen.ai`, so it now says to use `POSTQUEEN_API_KEY` there, or to run the auth server in `server/` and point `--auth-server` / `POSTQUEEN_AUTH_SERVER` at it. The READMEs say the same.

## [1.0.0] - 2026-02-13

### Added
- Initial release of PostQueen CLI
- `posts:create` - Create new social media posts
- `posts:list` - List all posts with pagination and search
- `posts:delete` - Delete posts by ID
- `integrations:list` - List connected social media integrations
- `upload` - Upload media files (images)
- Environment variable configuration (POSTQUEEN_API_KEY, POSTQUEEN_API_URL)
- Comprehensive help documentation
- Example scripts for basic usage and AI agent integration
- SKILL.md for AI agent usage patterns

### Features
- Command-line interface for PostQueen API
- Support for scheduled posts
- Multi-platform posting via integrations
- Media upload functionality
- User-friendly error messages with emojis
- JSON output for programmatic parsing
- Comprehensive examples for AI agents
