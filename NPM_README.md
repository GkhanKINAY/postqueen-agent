<p align="center">
  <a href="https://postqueen.ai">
    <img src="https://raw.githubusercontent.com/GkhanKINAY/postqueen-agent/main/.github/assets/header.svg" width="840" alt="PostQueen: the queen of your posts, your AI social media assistant" />
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/postqueen"><img src="https://img.shields.io/npm/v/postqueen" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/postqueen"><img src="https://img.shields.io/npm/dm/postqueen" alt="npm downloads"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen" alt="Node >= 18"></a>
  <a href="https://github.com/GkhanKINAY/postqueen-agent/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-AGPL--3.0-blue.svg" alt="License: AGPL-3.0"></a>
</p>

# PostQueen CLI

Command-line interface to the [PostQueen](https://postqueen.ai) API. It lets developers and AI agents
schedule posts, manage content and upload media across X/Twitter, LinkedIn, Instagram, Facebook,
TikTok, YouTube, Reddit, Bluesky, Mastodon, Discord and 30+ more networks. Every command outputs
JSON, so it drops cleanly into scripts, cron jobs and agent tool-calls.

## Install

```bash
npm install -g postqueen
```

Requires Node.js 18+. To register the CLI as a skill for coding agents that support the `skills`
registry:

```bash
npx skills add GkhanKINAY/postqueen-agent
```

## Authenticate

Pick either option. When both are present, OAuth2 credentials win.

**API key (quickest)** — grab it at [app.postqueen.ai/settings](https://app.postqueen.ai/settings)
(Developers → Public API → Reveal):

```bash
export POSTQUEEN_API_KEY=your_api_key_here
```

**OAuth2 device flow** — no client ID or secret needed:

```bash
postqueen auth:login     # prints a one-time code and opens your browser
postqueen auth:status    # check that stored credentials are still valid
postqueen auth:logout    # remove them
```

Credentials land in `~/.postqueen/credentials.json`. The device flow needs an auth
server (`POSTQUEEN_AUTH_SERVER`, default `cli-auth.postqueen.ai`); you can self-host
it — see `server/SERVER.md` in the repo. If it is unreachable, use an API key instead.

## Quick start

```bash
# 1. Find the channels you can post to
postqueen integrations:list

# 2. Upload media first — most platforms only accept URLs they trust
MEDIA=$(postqueen upload ./launch.png | jq -r '.path')

# 3. Schedule the post (--date is required, ISO 8601)
postqueen posts:create \
  -c "We just shipped 🎉" \
  -m "$MEDIA" \
  -s "2026-08-01T09:00:00Z" \
  -i "twitter-123,linkedin-456"

# 4. See what is queued
postqueen posts:list
```

## Commands

| Command | What it does |
| --- | --- |
| `auth:login` / `auth:status` / `auth:logout` | OAuth2 device flow: sign in, verify, sign out |
| `integrations:list [--group <id>]` | List connected channels; filter by group (customer) |
| `integrations:groups` | List groups (customers) as `{id, name}` |
| `integrations:settings <id>` | Character limits, required settings and available tools for a channel |
| `integrations:trigger <id> <method> [-d '{}']` | Fetch dynamic data: Reddit flairs, YouTube playlists, LinkedIn companies… |
| `posts:create` | Create a scheduled post or draft (see options below) |
| `posts:list [--startDate --endDate --customer]` | List posts; defaults to last 30 → next 30 days |
| `posts:delete <id>` | Delete a post |
| `posts:status <id> --status draft\|schedule` | Move a post back to draft (stops a running workflow) or queue it |
| `posts:missing <id>` | List recent provider content when a published post has no usable ID |
| `posts:connect <id> --release-id "<content-id>"` | Attach that content to the post so analytics work |
| `analytics:platform <id> [-d 30]` | Followers, impressions and engagement for a channel (default 7 days) |
| `analytics:post <id> [-d 30]` | Likes, comments, shares and impressions for a published post |
| `upload <file>` | Upload an image or video and get a PostQueen URL back |

Run `postqueen --help` or `postqueen <command> --help` for the full syntax.

### `posts:create` options

| Flag | Description |
| --- | --- |
| `-c, --content` | Post content. Repeat it to add comments/threads, in order |
| `-s, --date` | Schedule date, ISO 8601 (**required**), e.g. `"2026-08-01T09:00:00Z"` |
| `-i, --integrations` | Comma-separated channel IDs (**required** unless `--json`) |
| `-m, --media` | Comma-separated media URLs for the matching `-c` |
| `-t, --type` | `schedule` (default) or `draft` |
| `-d, --delay` | Minutes between comments (default `0`) |
| `--settings` | Platform-specific settings as a JSON string |
| `-j, --json` | Path to a JSON file holding the full post structure |
| `--shortLink` | Use short links (default `true`) |

```bash
# Thread with a 5-minute gap between parts
postqueen posts:create -c "1/3" -c "2/3" -c "3/3" -d 5 -s "2026-08-01T09:00:00Z" -i "twitter-123"

# Reddit post with subreddit settings
postqueen posts:create -c "Content" -s "2026-08-01T09:00:00Z" -i "reddit-123" \
  --settings '{"subreddit":[{"value":{"subreddit":"programming","title":"My Post","type":"text"}}]}'

# Anything complex: describe it in a file
postqueen posts:create --json ./post.json
```

## Media uploads

Upload files to PostQueen **before** referencing them in a post. TikTok, Instagram and YouTube only
accept media from trusted domains and will reject external links.

```bash
postqueen upload ./video.mp4     # → { "path": "https://…" }
```

Supported formats: PNG, JPG, JPEG, GIF and MP4.

## Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `POSTQUEEN_API_KEY` | – | Your PostQueen API key (not needed after `auth:login`) |
| `POSTQUEEN_API_URL` | `https://api.postqueen.ai` | Point the CLI at a self-hosted instance |
| `POSTQUEEN_AUTH_SERVER` | `https://cli-auth.postqueen.ai` | Custom OAuth2 device-flow server |

Self-hosting PostQueen? Set `POSTQUEEN_API_URL` to your own API base URL and everything else works
the same.

## Use it from an AI agent

Every command prints JSON on stdout and exits `0` on success, `1` on error — no parsing tricks
needed. A typical agent loop is `integrations:list` → `integrations:settings` →
`integrations:trigger` (for flairs, playlists, companies) → `upload` → `posts:create`.

Prefer tool-calls over a shell? PostQueen also ships a hosted MCP server:

```bash
claude mcp add --transport http postqueen https://api.postqueen.ai/mcp/<YOUR_API_KEY>
```

## Troubleshooting

| Error | Fix |
| --- | --- |
| `Not authenticated` | Run `postqueen auth:login` or set `POSTQUEEN_API_KEY` |
| `Integration not found` | Run `integrations:list` for valid channel IDs |
| `--date is required` | Pass ISO 8601: `-s "2026-08-01T09:00:00Z"` |
| `Invalid settings` | Check `integrations:settings <id>` for the required fields |
| `analytics:post` returns `{"missing": true}` | Run `posts:missing <id>`, then `posts:connect <id> --release-id "<content-id>"` |

## Links

| | |
| --- | --- |
| Documentation | [docs.postqueen.ai](https://docs.postqueen.ai) |
| REST API reference | [api.postqueen.ai/docs](https://api.postqueen.ai/docs) |
| Full guide, examples and issues | [github.com/GkhanKINAY/postqueen-agent](https://github.com/GkhanKINAY/postqueen-agent) |
| NodeJS SDK | [`@postqueen/node`](https://www.npmjs.com/package/@postqueen/node) |
| n8n node | [`n8n-nodes-postqueen`](https://www.npmjs.com/package/n8n-nodes-postqueen) |

## License

[AGPL-3.0](https://github.com/GkhanKINAY/postqueen-agent/blob/main/LICENSE). PostQueen is a fork of
[Postiz](https://github.com/gitroomhq/postiz-app) by Nevo David / Gitroom — thank you to the Postiz
contributors for the foundation this builds on.
