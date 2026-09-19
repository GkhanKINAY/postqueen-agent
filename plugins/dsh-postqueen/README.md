# dsh-postqueen

**source:** [GkhanKINAY/postqueen-agent](https://github.com/GkhanKINAY/postqueen-agent/tree/main/plugins/dsh-postqueen)

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) plugin for
[PostQueen](https://postqueen.ai), the open-source social media scheduler. It connects the
agent to the PostQueen MCP server so it can list your connected channels, fetch each
platform's posting rules, and schedule, draft, or publish posts across 30+ platforms (X,
LinkedIn, Instagram, Facebook, Threads, TikTok, YouTube, Reddit, Pinterest, Bluesky,
Mastodon, Discord, Slack, Telegram, and more).

## Install

From the repository:

```bash
dsh plugin --profile web add "github:GkhanKINAY/postqueen-agent#path:/plugins/dsh-postqueen"
```

Then give it a PostQueen API key. Copy it from **PostQueen → Settings → API Keys** and
export it before starting dsh, or put it in `$DSH_HOME/.env`:

```bash
export POSTQUEEN_API_KEY=your-api-key
dsh web
```

Restart the profile after installing. Ask the agent *"List my connected social media
accounts"* to verify the connection.

## What you get

The bundle mounts two rows:

| Row | Package | Role |
|---|---|---|
| `postqueen` | `dsh-postqueen` (this package) | Reads the API key, exposes `ctx.postqueen` (`url`, `headers`), and registers the `postqueen` skill that teaches the agent the posting workflow and the HTML content rules. |
| `postqueen-mcp` | `@deepseek-ai/dsh-mcp-client` (shipped with dsh) | Connects to `https://api.postqueen.ai/mcp` over streamable HTTP with a `Bearer` header and registers the server's tools. |

The model sees the PostQueen MCP tools under the `mcp__postqueen__` namespace, among them:

| Tool | What it does |
|---|---|
| `mcp__postqueen__integrationList` | List connected channels (optionally filtered by group) |
| `mcp__postqueen__groupList` | List customer groups |
| `mcp__postqueen__integrationSchema` | Posting rules, character limits, and required settings for a platform |
| `mcp__postqueen__triggerTool` | Platform helpers (list Discord channels, search subreddits, list LinkedIn pages) |
| `mcp__postqueen__integrationSchedulePostTool` | Schedule, draft, or immediately publish posts |
| `mcp__postqueen__postsListTool` | List posts scheduled between two dates |
| `mcp__postqueen__postSettingsTool` | Update settings of an unpublished post |
| `mcp__postqueen__generateImageTool` | Generate an image for a post |
| `mcp__postqueen__generateVideoOptions` / `videoFunctionTool` / `generateVideoTool` / `videoStatusTool` | Video generation options, generation, and the status of a video that is still rendering |

The tool list comes from the server at connect time, so new PostQueen tools appear without
a plugin update. See the [PostQueen MCP tools reference](https://docs.postqueen.ai/mcp/tools).

## Configuration

Override the `postqueen` row in your profile's `cordis.patch.yml`
(`$DSH_HOME/profiles/web/cordis.patch.yml`). A bare `id:` configures the existing row:

```yaml
- id: postqueen
  config:
    apiKeyEnv: POSTQUEEN_API_KEY         # env var that holds the key (default)
    baseUrl: https://api.postqueen.ai    # self-hosted: your backend URL
    skill: true                          # register the `postqueen` workflow skill
```

| Field | Default | Description |
|---|---|---|
| `apiKeyEnv` | `POSTQUEEN_API_KEY` | Environment variable read at boot for the API key. |
| `apiKey` | `''` | Inline key. Prefer the env var; this exists for patch-level overrides. |
| `baseUrl` | `https://api.postqueen.ai` | PostQueen API host. The MCP endpoint is `<baseUrl>/mcp`. Self-hosted instances point this at their backend. |
| `skill` | `true` | Register the `postqueen` skill on `ctx.skills`. |

Without a key the `postqueen` row logs a warning naming the variable to set, and the
`postqueen-mcp` row registers no tools. dsh keeps booting.

## Self-hosted PostQueen

The MCP server is part of the PostQueen backend and listens at `/mcp` (Bearer auth). Point
`baseUrl` at your backend, the value of `NEXT_PUBLIC_BACKEND_URL`, and make sure your
reverse proxy forwards `/mcp` with streaming HTTP enabled. See
[Reverse Proxies](https://docs.postqueen.ai/reverse-proxies/caddy).

## Development

```bash
cd plugins/dsh-postqueen
pnpm install
pnpm test
```

Link a local checkout into a profile:

```bash
dsh plugin --profile web add /absolute/path/to/postqueen-agent/plugins/dsh-postqueen
```

## Related

- [PostQueen CLI](https://github.com/GkhanKINAY/postqueen-agent): the `postqueen` command-line tool and the Claude Code, Cursor and Grok plugins in this repository.
- [PostQueen MCP docs](https://docs.postqueen.ai/mcp/introduction)
- [PostQueen public API](https://docs.postqueen.ai/public-api/introduction)

## License

AGPL-3.0, same as the rest of this repository.
