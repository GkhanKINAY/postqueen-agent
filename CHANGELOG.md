# Changelog

All notable changes to the PostQueen CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.27] - 2026-09-26

### Changed

- The skill (`SKILL.md`) lists every network PostQueen supports in one place, with the two conditions that come from the product: X connects once the workspace's 7-day trial ends, and Hashnode needs Hashnode Pro. The TikTok examples use `PUBLIC_TO_EVERYONE`, and the privacy note says to use what the account allows.
- The npm page lists the AI agents in the homepage's order. No code changes.

## [2.0.26] - 2026-09-24

### Changed

- The npm page now matches the GitHub README: the PostQueen CLI banner, colour badges, the AI agents and networks card, and the PostQueen Cloud trial. No code changes.

## [2.0.25] - 2026-09-23

### Fixed
- Unknown commands and flags are errors. `postqueen post:create` printed nothing and exited 0, and a mistyped flag such as `posts:list --startdate` was dropped, so the command ran with its default. Both now print one line, such as `❌ Unknown argument: startdate. Run "postqueen posts:list --help" for usage.`, and exit 1. The kebab-case and camelCase forms of a flag, such as `--start-date` and `--startDate`, both still work.
- Usage errors, such as a missing `--content`, print one line with the reason and the help command to run, instead of the whole help block, and exit 1.
- A single-value flag given twice fails with `❌ --integrations was given more than once, but takes one value.` and exit 1. A second `-i` crashed with a TypeError, and a second `-s` sent the API a list of dates. `-c` and `-m` still repeat, once per post and comment.
- `-c` takes text that starts with "-", such as `-c "-hello"` or `-c "- item"`. `-c "-hello"` printed the help and exited 0, and `-c "- item"` sent an empty comment.
- An empty integration ID, as in `-i "id1,"` or `-i "id1,,id2"`, is caught before the API call. The check for it never ran, so the API answered "All posts must have an integration id".
- `auth:login` without `--auth-server` or `POSTQUEEN_AUTH_SERVER` prints one line to stderr that says where to get the API key, and exits 1, also when `POSTQUEEN_API_KEY` is set (it exited 0 then). PostQueen's API has no `/device/*` routes, so the device flow still runs only against an auth server you name, such as the one in `server/`.

### Added
- `npm test` builds the CLI and runs it against a local stand-in for the API (`test/cli.test.mjs`).

### Changed
- The GitHub-only guides use real flags, which the strict parser now requires. `PROVIDER_SETTINGS.md`, `INTEGRATION_SETTINGS_DISCOVERY.md`, `QUICK_START.md`, `examples/EXAMPLES.md`, `examples/COMMAND_LINE_GUIDE.md` and the two example scripts no longer use `-p`, `--image`, `--comments` or `posts:list -l/-p/-s`, which the CLI never had. Every `posts:create` example now passes the required `-s` date and `-i` ID. Delays are in minutes, and Reddit takes a `/r/...` subreddit with type `self`, `link` or `media`. The example JSON files match.
- Removed `SYNTAX_UPGRADE.md`, `FEATURES.md` and `PROVIDER_SETTINGS_SUMMARY.md`. They described flags the CLI never had and repeated the guides above.

## [2.0.24] - 2026-09-23

### Fixed
- `engines.node` now says `^20.19.0 || >=22.12.0`. 2.0.23 stops at start on Node 18 with `ERR_REQUIRE_ESM`, so npm now warns before installing on a Node it cannot run on.
- `auth:status` exits with code 1 when no credentials are set, when the API rejects them, or when they could not be checked. It exited 0 in every case, so a script could not tell.
- The Claude, Cursor, Grok and Gemini CLI plugin manifests said 2.0.22. They now carry the package version.

## [2.0.23] - 2026-09-23

### Added
- DeepSeek Harness plugin: `plugins/dsh-postqueen` is a `dsh` bundle (`dsh plugin --profile web add "github:GkhanKINAY/postqueen-agent#path:/plugins/dsh-postqueen"`). It mounts one `@deepseek-ai/dsh-mcp-client` row pointed at the PostQueen MCP server (`https://api.postqueen.ai/mcp`, Bearer auth from `POSTQUEEN_API_KEY`) and registers a `postqueen` skill describing the integrationList → integrationSchema → integrationSchedulePostTool workflow. Self-hosted instances override `baseUrl` on the `postqueen` row. It is not published on npm.
- Gemini CLI extension: a root `gemini-extension.json`, so the repo installs with `gemini extensions install https://github.com/GkhanKINAY/postqueen-agent` and loads the `postqueen` skill. Like the other plugins it registers no MCP server.
- README: Gemini CLI and Qwen Code install steps. Qwen Code installs the Claude Code marketplace directly.

### Changed
- The Claude Code and Cursor plugin descriptions, and the skill's description row, name every supported platform instead of six.
- README and NPM_README rewritten as a short CLI page: install, the API key location (Connections > API Keys, admins only), the command table, the real output format (one status line, then JSON), the skill and plugin installs, and links. The per-network examples, which named helper tools and settings that do not exist, now point to `integrations:settings` and the command reference instead.
- The npm package description no longer says every command returns clean JSON.
- `LICENSE` now carries the full AGPL-3.0 text, with the existing copyright line above it and the existing notice below it, so GitHub detects the license.
- `auth:login` no longer has a default auth server. PostQueen runs none (the old default, `cli-auth.postqueen.ai`, answers 404 `DEPLOYMENT_NOT_FOUND`), so without `--auth-server` or `POSTQUEEN_AUTH_SERVER` it makes no network call: it explains how to get the API key (PostQueen > Connections > API Keys, admins only) and set `POSTQUEEN_API_KEY`, and exits 1 unless that key is already set. The device flow still runs against an auth server you name. `auth:status`, the missing-credentials error, `--help` and the READMEs now put the API key first.

### Fixed
- README MCP copy: the schedule tool's wire name is `integrationSchedulePostTool` (not `schedulePostTool`). The Claude README mock now shows that name.
- The skill (`SKILL.md`, `skills/postqueen/SKILL.md`), `INTEGRATION_TOOLS_WORKFLOW.md` and the CLI's `--help` examples named helper tools and settings that do not exist. They now use only the tools the API has (Reddit `subreddits` and `restrictions`, Pinterest `boards`, Discord and Slack `channels`, and the rest in one table) and only real settings: Reddit `subreddit` as a `/r/...` path with `type` `self`, `link` or `media` (never `text`); no YouTube playlist or LinkedIn company setting (neither exists; a LinkedIn Page is its own channel); every required TikTok field; X `who_can_reply_post` on X examples; Instagram `post_type` `post`, `reel` or `story`. The invented tool names and the nonexistent `-p` flag are gone.
- The skill's `jq` pipelines drop the status line first (`tail -n +2`), the `--json` example uses the API's request shape, and the thread delay is in minutes (`-d 2`, not `-d 2000`).
- The skill now gives the API key location (Connections > API Keys, admins only), lists the networks marked Soon on the hosted service, lists the accepted upload formats, and describes MCP as 21 tools with a key or 20 with OAuth. The DeepSeek Harness skill and README give the same key location and no longer offer a LinkedIn pages helper.

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
