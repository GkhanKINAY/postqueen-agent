<p align="center">
  <a href="https://postqueen.ai">
    <img src=".github/assets/header.svg" width="840" alt="PostQueen: the AI agent CLI for social scheduling" />
  </a>
</p>

<h3 align="center">🆕&nbsp; NEW: drive PostQueen from Claude&nbsp;Code, ChatGPT, Cursor, OpenClaw, Hermes or Codex, over the built-in <a href="https://postqueen.ai/mcp">MCP server</a> or this <a href="https://www.npmjs.com/package/postqueen">Agent CLI</a>.</h3>

<br/>

<div align="center">
  <h2>The queen of your posts 👑</h2>
  <p>
    From your terminal, or the AI agent you already talk to, she writes, designs and schedules across 30+ networks.<br/>
    You just approve, and <strong>nothing goes out without your say-so</strong>.
  </p>
  <p><em>An open-source alternative to Buffer, Hootsuite, Sprout Social and Later.</em></p>
</div>

<br/>

<p align="center">
  <a href="https://postqueen.ai">Website</a> &nbsp;·&nbsp;
  <a href="https://postqueen.ai/pricing">Pricing</a> &nbsp;·&nbsp;
  <a href="https://app.postqueen.ai/auth">Start free</a> &nbsp;·&nbsp;
  <a href="https://docs.postqueen.ai">Docs</a> &nbsp;·&nbsp;
  <a href="https://api.postqueen.ai/docs">API Reference</a> &nbsp;·&nbsp;
  <a href="https://www.npmjs.com/package/postqueen">npm</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/postqueen"><img src="https://img.shields.io/npm/v/postqueen" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/postqueen"><img src="https://img.shields.io/npm/dm/postqueen" alt="npm downloads"></a>
  <a href="https://github.com/GkhanKINAY/postqueen-agent/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-AGPL--3.0-blue.svg" alt="License: AGPL-3.0"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/node/v/postqueen" alt="Node version"></a>
</p>

<p align="center">
  <a href="https://postqueen.ai"><img src=".github/assets/cta-cloud.svg" height="46" alt="Start free for 7 days" /></a>
  &nbsp;&nbsp;
  <a href="https://github.com/GkhanKINAY/postqueen-docker-compose"><img src=".github/assets/cta-selfhost.svg" height="46" alt="Self-host it free" /></a>
</p>

<br/>

<p align="center">
  <img src=".github/assets/channels.svg" width="780" alt="Supported social networks" />
</p>

<p align="center">
  <a href="https://docs.postqueen.ai"><strong>Explore the docs »</strong></a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="https://postqueen.ai/pricing"><strong>Start a 7-day free trial »</strong></a>
</p>

<br/>

---

> Published on npm as [`postqueen`](https://www.npmjs.com/package/postqueen). By default the CLI talks to the hosted PostQueen API at `https://api.postqueen.ai`. Set the `POSTQUEEN_API_URL` environment variable to target any self-hosted PostQueen instance. The only URL-related flag is `--auth-server` (on `auth:login`), which points the OAuth2 device flow at a self-hosted auth server.

## What is the PostQueen CLI?

The PostQueen CLI is a command-line interface to the PostQueen API. It lets developers and AI agents automate social media posting, manage content, and handle media uploads across networks like Twitter/X, LinkedIn, Reddit, YouTube, TikTok, Instagram, Facebook, and more. Every command outputs JSON, so it drops cleanly into scripts, cron jobs, and agent tool-calls.

---

## 👑 Everything PostQueen does for you

<p align="center">
  <img src=".github/assets/features.svg" width="820" alt="PostQueen features: scheduling, AI assistant, AI design, AI video, auto actions, teamwork, analytics, cross-posting" />
</p>

- 📅 **Scheduling.** Plan every channel on one visual calendar; drag to reschedule, click to edit.
- 🤖 **AI Assistant.** Generate hooks, captions and threads in your voice, shaped per platform.
- 🎨 **AI Design.** A built-in, Canva-like editor plus AI image generation for post visuals.
- 🎬 **AI Video.** Turn a photo and a script into a short vertical video for Reels, Shorts and TikTok.
- ⚡ **Auto Actions (Plugs).** Auto repost, like and comment when a post hits a milestone.
- 👥 **Teamwork.** Roles, comments and multi-brand workspaces for your whole team.
- 📈 **Analytics.** Track post and audience performance on the major networks.
- 🔁 **Cross-posting.** Write once, tailor each post per channel, and recycle evergreen content on a schedule.

---

## 💬 Just talk to your AI

You don't need to write a line of code. Connect PostQueen to the AI assistant you already use, then just ask:

> *"Post about our launch on X and LinkedIn tomorrow morning."*

> *"Turn this blog post into a week of posts, one a day."*

> *"Make an image for this post and schedule it for Friday at 9am."*

> *"Upload this video and post it to TikTok, YouTube and Instagram."*

Your assistant writes it, designs it, and drops it into your **PostQueen queue**, where you review and approve before anything goes live. Nothing publishes behind your back.

---

## 🔑 Get your API key

You will need a PostQueen API key for every option below. It takes a minute:

1. Open **[app.postqueen.ai/settings](https://app.postqueen.ai/settings)** (or your own self-hosted instance).
2. Go to **Developers → Public API**.
3. Click **Reveal** to show your key.
4. Copy it and export it in your shell:

```bash
export POSTQUEEN_API_KEY="your_api_key"
```

Keep it secret: it grants full access to your account. You can revoke or rotate it any time from the same screen.

---

## 🤝 Works with your AI

This is what makes PostQueen different: **drive it from whatever AI you already talk to.** Every agent connects over the same Agent CLI and hosted MCP server, drafts into your queue, and waits for your approval.

### 🟣 Claude Code

Tell it, in plain English:

> *"Schedule a tweet for tomorrow morning announcing our new feature, and attach the screenshot from `./assets/launch.png`."*

Claude Code connects over the CLI or MCP and runs, under the hood:

```bash
postqueen integrations:list
postqueen upload ./assets/launch.png
postqueen posts:create \
  -c "We just launched our new feature..." \
  -m "<uploaded-url>" \
  -s "2026-03-02T09:00:00Z" \
  -i "<x-integration-id>"
```

The draft lands in your queue for approval. [Set up Claude Code »](https://postqueen.ai/claude-code)

### 🟢 ChatGPT

Draft and refine in ChatGPT, then let it publish everywhere through the MCP connector.

> *"Write a witty launch post, make a square image for it, and schedule it to X, LinkedIn and Instagram for Tuesday at 9am."*

[Set up ChatGPT »](https://postqueen.ai/chatgpt)

### 🔵 Cursor

Manage your channels without leaving the editor you build in; Cursor drives PostQueen over the CLI or MCP.

> *"Post the release notes from CHANGELOG.md to our channels this afternoon."*

[Set up Cursor »](https://postqueen.ai/cursor)

### 🦞 OpenClaw

Message it from WhatsApp, Telegram, Slack or Discord and it works hands-free.

> *"Create 4 posts about fitness for TikTok, LinkedIn, X and Instagram and schedule them for this week."*

[Set up OpenClaw »](https://postqueen.ai/openclaw)

### ⚡ Hermes

Hand your whole posting pipeline to an agent that plans and runs multi-step tasks end to end.

> *"Every Monday, turn last week's blog posts into a week of scheduled content."*

[Set up Hermes »](https://postqueen.ai/hermes-agent)

### 🟩 Codex

OpenAI's software agent: one prompt in, a scheduled week out, straight from your terminal.

> *"Draft and schedule a daily tip for X and LinkedIn for the next seven days."*

[Set up Codex »](https://postqueen.ai/codex)

### And any other agent

PostQueen's CLI and MCP server are **model-agnostic**, so any MCP client or command-running agent works: **Gemini CLI, Aider, Cline, Warp, Windsurf**, or your own scripts. If it can run a command or speak MCP, it can drive PostQueen.

---

## 🔌 Connect over MCP

The [Model Context Protocol](https://modelcontextprotocol.io) lets AI assistants call tools. PostQueen ships a hosted MCP server, so any MCP client can draft, schedule and manage posts as if it were built in.

**One-line connect (Claude Code or any CLI client):**

```bash
claude mcp add --transport http postqueen https://api.postqueen.ai/mcp/<YOUR_API_KEY>
```

**Config-file clients (Claude Desktop, Cursor, and others):**

```json
{
  "mcpServers": {
    "postqueen": {
      "url": "https://api.postqueen.ai/mcp/<YOUR_API_KEY>"
    }
  }
}
```

**ChatGPT:** Settings → Connectors → add a custom connector pointing at `https://api.postqueen.ai/mcp/<YOUR_API_KEY>`.

Works with **Claude Code, ChatGPT, Cursor, OpenClaw, Hermes, Codex** and any other MCP client (Gemini CLI, Aider, Cline, Warp, or your own). Full guide: [postqueen.ai/mcp](https://postqueen.ai/mcp).

---

## ⌨️ Agent CLI

Prefer the terminal, or building an agent that runs commands? The `postqueen` CLI drives everything and returns clean JSON, so any model-agnostic agent can use it.

```bash
npm i -g postqueen
postqueen auth:login          # opens a browser device flow
postqueen integrations:list   # your connected channels
postqueen posts:create -c "Hello from PostQueen" -s "2026-01-01T09:00:00Z" -i <integration-id>
```

Or skip the browser login and pass an API key directly:

```bash
export POSTQUEEN_API_KEY=<YOUR_API_KEY>   # grab it at app.postqueen.ai/settings
```

Install the CLI as a skill for terminal agents with `npx skills add GkhanKINAY/postqueen-agent`. The full command reference lives further down this page.

---

## 🤖 Build your own agent (agentic scheduling)

Because every action is a plain CLI command (and a public API call), you can point **your own** agent at PostQueen and let it plan, draft and schedule on its own, on a recurring schedule if you like. A simple heartbeat job (a cron entry, a CI schedule, or an always-on agent loop) can wake up on a timer, decide what to post, upload any media, and queue it, all through the same commands documented below. A human stays in the loop the whole time: **nothing publishes until it is approved**.

Every command prints JSON, so it composes cleanly in scripts and cron:

```bash
# e.g. a morning cron job that queues today's post to X
ID=$(postqueen integrations:list | jq -r '.[] | select(.identifier=="twitter") | .id')
postqueen posts:create -c "Good morning ☀️ Today's tip: ..." -s "2026-01-01T09:00:00Z" -i "$ID"
```

Everything an agent needs is here: discover channels with `integrations:list`, upload media with `upload`, create and manage posts with `posts:*`, and read results with `analytics:*`. Start from the [Agent CLI](https://postqueen.ai/agent) or [MCP](https://postqueen.ai/mcp) guides.

---

## 🚀 Get started

PostQueen is **fully open-source (AGPL-3.0)**. Run it whichever way suits you; both options are honest about what they cost:

<p align="center">
  <a href="https://postqueen.ai"><img src=".github/assets/cta-cloud.svg" height="52" alt="Start free for 7 days" /></a>
  &nbsp;&nbsp;
  <a href="https://github.com/GkhanKINAY/postqueen-docker-compose"><img src=".github/assets/cta-selfhost.svg" height="52" alt="Self-host it free" /></a>
</p>

- ☁️ **Cloud.** The fastest path: connect your channels and schedule your first post in minutes, with a **7-day free trial** and nothing to run yourself.
- 🐳 **Self-host.** Own your data and run the whole stack for free with Docker Compose:

```bash
git clone https://github.com/GkhanKINAY/postqueen-docker-compose
cd postqueen-docker-compose
# open docker-compose.yaml and set a unique JWT_SECRET + your public URLs
docker compose up -d       # then open http://localhost:4007
```

Full [self-host guide](https://docs.postqueen.ai/quickstart), [Kubernetes / Helm](https://github.com/GkhanKINAY/postqueen-helmchart), and [configuration reference](https://docs.postqueen.ai/configuration/reference).

Prefer to run everything from the terminal? Install the CLI below and log in with a browser device flow. The full command reference follows.

---

## Installation

### From npm (Recommended)

```bash
npm install -g postqueen
# or
pnpm install -g postqueen
```

### Install as a skill

Register the CLI as a skill for coding agents that support the `skills` registry:

```bash
npx skills add GkhanKINAY/postqueen-agent
```

---

## Authentication

### Option 1: OAuth2 (Recommended)

Authenticate using the device flow: no client ID or secret needed:

```bash
postqueen auth:login
```

This will:
1. Display a one-time code in your terminal
2. Open your browser to authorize
3. Automatically save credentials to `~/.postqueen/credentials.json`

```bash
# Check current auth status (verifies credentials are still valid)
postqueen auth:status

# Remove stored credentials
postqueen auth:logout
```

#### Self-Hosting the Auth Server

By default, `postqueen auth:login` uses the hosted auth server at `cli-auth.postqueen.ai`. If you want to self-host the OAuth2 device flow server, follow the guide in [`server/SERVER.md`](./server/SERVER.md).

### Option 2: API Key

Grab your key at **[app.postqueen.ai/settings](https://app.postqueen.ai/settings)** (Developers → Public API → Reveal), then export it:

```bash
export POSTQUEEN_API_KEY=your_api_key_here
```

**Optional:** Custom API endpoint

```bash
export POSTQUEEN_API_URL=https://your-custom-api.com
```

> **Note:** OAuth2 credentials take priority over the API key when both are present.

---

## Commands

### Discovery & Settings

**List all connected integrations**
```bash
postqueen integrations:list
postqueen integrations:list --group "customer-id"
```

Returns integration IDs, provider names, and metadata. Use `--group` to return only the channels assigned to a specific group (customer).

**List all groups (customers)**
```bash
postqueen integrations:groups
```

Returns all groups (customers) for your organization as `{id, name}`. Use a group's `id` with `integrations:list --group` to filter channels.

**Get integration settings schema**
```bash
postqueen integrations:settings <integration-id>
```

Returns character limits, required settings, and available tools for fetching dynamic data.

**Trigger integration tools**
```bash
postqueen integrations:trigger <integration-id> <method-name>
postqueen integrations:trigger <integration-id> <method-name> -d '{"key":"value"}'
```

Fetch dynamic data like Reddit flairs, YouTube playlists, LinkedIn companies, etc.

**Examples:**
```bash
# Get Reddit flairs
postqueen integrations:trigger reddit-123 getFlairs -d '{"subreddit":"programming"}'

# Get YouTube playlists
postqueen integrations:trigger youtube-456 getPlaylists

# Get LinkedIn companies
postqueen integrations:trigger linkedin-789 getCompanies
```

---

### Creating Posts

**Simple scheduled post**
```bash
postqueen posts:create -c "Content" -s "2024-12-31T12:00:00Z" -i "integration-id"
```

**Draft post**
```bash
postqueen posts:create -c "Content" -s "2024-12-31T12:00:00Z" -t draft -i "integration-id"
```

**Post with media**
```bash
postqueen posts:create -c "Content" -m "img1.jpg,img2.jpg" -s "2024-12-31T12:00:00Z" -i "integration-id"
```

**Post with comments** (each comment can have its own media)
```bash
postqueen posts:create \
  -c "Main post" -m "main.jpg" \
  -c "First comment" -m "comment1.jpg" \
  -c "Second comment" -m "comment2.jpg,comment3.jpg" \
  -s "2024-12-31T12:00:00Z" \
  -i "integration-id"
```

**Multi-platform post**
```bash
postqueen posts:create -c "Content" -s "2024-12-31T12:00:00Z" -i "twitter-id,linkedin-id,facebook-id"
```

**Platform-specific settings**
```bash
postqueen posts:create \
  -c "Content" \
  -s "2024-12-31T12:00:00Z" \
  --settings '{"subreddit":[{"value":{"subreddit":"programming","title":"Post Title","type":"text"}}]}' \
  -i "reddit-id"
```

**Complex post from JSON file**
```bash
postqueen posts:create --json post.json
```

**Options:**
- `-c, --content`: Post/comment content (use multiple times for posts with comments)
- `-s, --date`: Schedule date in ISO 8601 format (REQUIRED)
- `-t, --type`: Post type: "schedule" or "draft" (default: "schedule")
- `-m, --media`: Comma-separated media URLs for corresponding `-c`
- `-i, --integrations`: Comma-separated integration IDs (required)
- `-d, --delay`: Delay between comments in minutes (default: 0)
- `--settings`: Platform-specific settings as JSON string
- `-j, --json`: Path to JSON file with full post structure
- `--shortLink`: Use short links (default: true)

---

### Managing Posts

**List posts**
```bash
postqueen posts:list
postqueen posts:list --startDate "2024-01-01T00:00:00Z" --endDate "2024-12-31T23:59:59Z"
postqueen posts:list --customer "customer-id"
```

Defaults to last 30 days to next 30 days if dates not specified.

**Delete post**
```bash
postqueen posts:delete <post-id>
```

**Change post status (draft ↔ schedule)**
```bash
postqueen posts:status <post-id> --status draft
postqueen posts:status <post-id> --status schedule
```

Move a scheduled post back to a draft, or promote a draft into the publishing queue. Switching to `draft` also terminates any workflow that's already running for the post, so it won't publish. Switching to `schedule` queues the post for publishing at its stored date.

---

### Analytics

**Get platform analytics**
```bash
postqueen analytics:platform <integration-id>
postqueen analytics:platform <integration-id> -d 30
```

Returns metrics like followers, impressions, and engagement over time for a specific integration/channel. The `-d` flag specifies the number of days to look back (default: 7).

**Get post analytics**
```bash
postqueen analytics:post <post-id>
postqueen analytics:post <post-id> -d 30
```

Returns metrics like likes, comments, shares, and impressions for a specific published post.

**⚠️ If `analytics:post` returns `{"missing": true}`**, the post was published but the platform didn't return a usable post ID. You must resolve this before analytics will work:

```bash
# 1. List available content from the provider
postqueen posts:missing <post-id>

# 2. Connect the correct content to the post
postqueen posts:connect <post-id> --release-id "7321456789012345678"

# 3. Analytics will now work
postqueen analytics:post <post-id>
```

---

### Connecting Missing Posts

Some platforms (e.g. TikTok) don't return a post ID immediately after publishing. The post's `releaseId` is set to `"missing"` and analytics won't work until resolved.

**List available content from the provider**
```bash
postqueen posts:missing <post-id>
```

Returns an array of `{id, url}` items representing recent content from the provider. Returns an empty array if the provider doesn't support this feature.

**Connect a post to its published content**
```bash
postqueen posts:connect <post-id> --release-id "<content-id>"
```

---

### Media Upload

**Upload file and get URL**
```bash
postqueen upload <file-path>
```

**⚠️ IMPORTANT: Upload Files Before Posting**

You **must** upload media files to PostQueen before using them in posts. Many platforms (especially TikTok, Instagram, and YouTube) require verified/trusted URLs and will reject external links.

**Workflow:**
1. Upload your file using `postqueen upload`
2. Extract the returned URL
3. Use that URL in your post's `-m` parameter

**Supported formats:**
- **Images:** PNG, JPG, JPEG, GIF
- **Videos:** MP4

**Example:**
```bash
# 1. Upload the file first
RESULT=$(postqueen upload video.mp4)
FILE_PATH=$(echo "$RESULT" | jq -r '.path')

# 2. Use the PostQueen URL in your post
postqueen posts:create -c "Check out my video!" -s "2024-12-31T12:00:00Z" -m "$FILE_PATH" -i "tiktok-id"
```

**Why this is required:**
- **TikTok, Instagram, YouTube** only accept URLs from trusted domains
- **Security:** Platforms verify media sources to prevent abuse
- **Reliability:** PostQueen ensures your media is always accessible

---

## Platform-Specific Features

### Reddit
```bash
# Get available flairs
postqueen integrations:trigger reddit-id getFlairs -d '{"subreddit":"programming"}'

# Post with subreddit and flair
postqueen posts:create \
  -c "Content" \
  -s "2024-12-31T12:00:00Z" \
  --settings '{"subreddit":[{"value":{"subreddit":"programming","title":"My Post","type":"text","is_flair_required":true,"flair":{"id":"flair-123","name":"Discussion"}}}]}' \
  -i "reddit-id"
```

### YouTube
```bash
# Get playlists
postqueen integrations:trigger youtube-id getPlaylists

# Upload video FIRST (required!)
VIDEO=$(postqueen upload video.mp4)
VIDEO_URL=$(echo "$VIDEO" | jq -r '.path')

# Post with uploaded video URL
postqueen posts:create \
  -c "Video description" \
  -s "2024-12-31T12:00:00Z" \
  --settings '{"title":"Video Title","type":"public","tags":[{"value":"tech","label":"Tech"}],"playlistId":"playlist-id"}' \
  -m "$VIDEO_URL" \
  -i "youtube-id"
```

### TikTok
```bash
# Upload video FIRST (TikTok only accepts verified URLs!)
VIDEO=$(postqueen upload video.mp4)
VIDEO_URL=$(echo "$VIDEO" | jq -r '.path')

# Post with uploaded video URL
postqueen posts:create \
  -c "Video caption #fyp" \
  -s "2024-12-31T12:00:00Z" \
  --settings '{"privacy":"PUBLIC_TO_EVERYONE","duet":true,"stitch":true}' \
  -m "$VIDEO_URL" \
  -i "tiktok-id"
```

### LinkedIn
```bash
# Get companies you can post to
postqueen integrations:trigger linkedin-id getCompanies

# Post as company
postqueen posts:create \
  -c "Company announcement" \
  -s "2024-12-31T12:00:00Z" \
  --settings '{"companyId":"company-123"}' \
  -i "linkedin-id"
```

### X (Twitter)
```bash
# Create thread
postqueen posts:create \
  -c "Thread 1/3 🧵" \
  -c "Thread 2/3" \
  -c "Thread 3/3" \
  -s "2024-12-31T12:00:00Z" \
  -d 2000 \
  -i "twitter-id"

# With reply settings
postqueen posts:create \
  -c "Tweet content" \
  -s "2024-12-31T12:00:00Z" \
  --settings '{"who_can_reply_post":"everyone"}' \
  -i "twitter-id"
```

### Instagram
```bash
# Upload image FIRST (Instagram requires verified URLs!)
IMAGE=$(postqueen upload image.jpg)
IMAGE_URL=$(echo "$IMAGE" | jq -r '.path')

# Regular post
postqueen posts:create \
  -c "Caption #hashtag" \
  -s "2024-12-31T12:00:00Z" \
  --settings '{"post_type":"post"}' \
  -m "$IMAGE_URL" \
  -i "instagram-id"

# Story (upload first)
STORY=$(postqueen upload story.jpg)
STORY_URL=$(echo "$STORY" | jq -r '.path')

postqueen posts:create \
  -c "" \
  -s "2024-12-31T12:00:00Z" \
  --settings '{"post_type":"story"}' \
  -m "$STORY_URL" \
  -i "instagram-id"
```

**See [PROVIDER_SETTINGS.md](./PROVIDER_SETTINGS.md) for all 30+ platforms.**

---

## Features for AI Agents

### Discovery Workflow
The CLI enables dynamic discovery of integration capabilities:

1. **List integrations**: Get available social media accounts
2. **Get settings**: Retrieve character limits, required fields, and available tools
3. **Trigger tools**: Fetch dynamic data (flairs, playlists, boards, etc.)
4. **Create posts**: Use discovered data in posts
5. **Analyze**: Get post analytics; if `{"missing": true}` is returned, resolve with `posts:missing` + `posts:connect`

This allows AI agents to adapt to different platforms without hardcoded knowledge.

### JSON Mode
For complex posts with multiple platforms and settings:

```bash
postqueen posts:create --json complex-post.json
```

JSON structure:
```json
{
  "integrations": ["twitter-123", "linkedin-456"],
  "posts": [
    {
      "provider": "twitter",
      "post": [
        {
          "content": "Tweet version",
          "image": ["twitter-image.jpg"]
        }
      ]
    },
    {
      "provider": "linkedin",
      "post": [
        {
          "content": "LinkedIn version with more context...",
          "image": ["linkedin-image.jpg"]
        }
      ],
      "settings": {
        "__type": "linkedin",
        "companyId": "company-123"
      }
    }
  ]
}
```

### All Output is JSON
Every command outputs JSON for easy parsing:

```bash
INTEGRATIONS=$(postqueen integrations:list | jq -r '.')
REDDIT_ID=$(echo "$INTEGRATIONS" | jq -r '.[] | select(.identifier=="reddit") | .id')
```

### Threading Support
Comments are automatically converted to threads/replies based on platform:
- **Twitter/X**: Thread of tweets
- **Reddit**: Comment replies
- **LinkedIn**: Comment on post
- **Instagram**: First comment

```bash
postqueen posts:create \
  -c "Main post" \
  -c "Comment 1" \
  -c "Comment 2" \
  -i "integration-id"
```

---

## Common Workflows

### Reddit Post with Flair
```bash
#!/bin/bash
REDDIT_ID=$(postqueen integrations:list | jq -r '.[] | select(.identifier=="reddit") | .id')
FLAIRS=$(postqueen integrations:trigger "$REDDIT_ID" getFlairs -d '{"subreddit":"programming"}')
FLAIR_ID=$(echo "$FLAIRS" | jq -r '.output[0].id')

postqueen posts:create \
  -c "My post content" \
  -s "2024-12-31T12:00:00Z" \
  --settings "{\"subreddit\":[{\"value\":{\"subreddit\":\"programming\",\"title\":\"Post Title\",\"type\":\"text\",\"is_flair_required\":true,\"flair\":{\"id\":\"$FLAIR_ID\",\"name\":\"Discussion\"}}}]}" \
  -i "$REDDIT_ID"
```

### YouTube Video Upload
```bash
#!/bin/bash
VIDEO=$(postqueen upload video.mp4)
VIDEO_PATH=$(echo "$VIDEO" | jq -r '.path')

postqueen posts:create \
  -c "Video description..." \
  -s "2024-12-31T12:00:00Z" \
  --settings '{"title":"My Video","type":"public","tags":[{"value":"tech","label":"Tech"}]}' \
  -m "$VIDEO_PATH" \
  -i "youtube-id"
```

### Multi-Platform Campaign
```bash
#!/bin/bash
postqueen posts:create \
  -c "Same content everywhere" \
  -s "2024-12-31T12:00:00Z" \
  -m "image.jpg" \
  -i "twitter-id,linkedin-id,facebook-id"
```

### Batch Scheduling
```bash
#!/bin/bash
DATES=("2024-02-14T09:00:00Z" "2024-02-15T09:00:00Z" "2024-02-16T09:00:00Z")
CONTENT=("Monday motivation 💪" "Tuesday tips 💡" "Wednesday wisdom 🧠")

for i in "${!DATES[@]}"; do
  postqueen posts:create \
    -c "${CONTENT[$i]}" \
    -s "${DATES[$i]}" \
    -i "twitter-id"
done
```

---

## Documentation

**For AI Agents:**
- **[SKILL.md](./SKILL.md)**: Complete skill reference with patterns and examples

**Deep-Dive Guides:**
- **[HOW_TO_RUN.md](./HOW_TO_RUN.md)**: Installation and setup methods
- **[COMMAND_LINE_GUIDE.md](./examples/COMMAND_LINE_GUIDE.md)**: Complete command syntax reference
- **[PROVIDER_SETTINGS.md](./PROVIDER_SETTINGS.md)**: All platform settings schemas
- **[INTEGRATION_TOOLS_WORKFLOW.md](./INTEGRATION_TOOLS_WORKFLOW.md)**: Tools workflow guide
- **[INTEGRATION_SETTINGS_DISCOVERY.md](./INTEGRATION_SETTINGS_DISCOVERY.md)**: Settings discovery
- **[SUPPORTED_FILE_TYPES.md](./SUPPORTED_FILE_TYPES.md)**: Media format reference
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)**: Code architecture
- **[PUBLISHING.md](./PUBLISHING.md)**: npm publishing guide

**Examples:**
- **[examples/EXAMPLES.md](./examples/EXAMPLES.md)**: Comprehensive examples
- **[examples/](./examples/)**: Ready-to-use scripts and JSON files

### Other ways to use the PostQueen API

The CLI is one of several ways to reach the same public API:

- **MCP server**: point any MCP client at `https://api.postqueen.ai/mcp/<API_KEY>`
- **NodeJS SDK**: [`@postqueen/node`](https://www.npmjs.com/package/@postqueen/node)
- **n8n node**: [`n8n-nodes-postqueen`](https://www.npmjs.com/package/n8n-nodes-postqueen)
- **REST reference**: [api.postqueen.ai/docs](https://api.postqueen.ai/docs)

---

## API Endpoints

The CLI interacts with these PostQueen API endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/public/v1/posts` | POST | Create a post |
| `/public/v1/posts` | GET | List posts |
| `/public/v1/posts/:id` | DELETE | Delete a post |
| `/public/v1/posts/:id/status` | PUT | Change post status (draft ↔ schedule) |
| `/public/v1/posts/:id/missing` | GET | Get missing content from provider |
| `/public/v1/posts/:id/release-id` | PUT | Update release ID for a post |
| `/public/v1/integrations` | GET | List integrations (optional `?group=` filter) |
| `/public/v1/groups` | GET | List groups (customers) |
| `/public/v1/integration-settings/:id` | GET | Get integration settings |
| `/public/v1/integration-trigger/:id` | POST | Trigger integration tool |
| `/public/v1/analytics/:integration` | GET | Get platform analytics |
| `/public/v1/analytics/post/:postId` | GET | Get post analytics |
| `/public/v1/upload` | POST | Upload media |

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `POSTQUEEN_API_KEY` | No* | - | Your PostQueen API key |
| `POSTQUEEN_API_URL` | No | `https://api.postqueen.ai` | Custom API endpoint |
| `POSTQUEEN_AUTH_SERVER` | No | `https://cli-auth.postqueen.ai` | Custom auth server URL |

*Either OAuth2 (via `postqueen auth:login`) or `POSTQUEEN_API_KEY` is required.

---

## Error Handling

The CLI provides clear error messages with exit codes:

- **Exit code 0**: Success
- **Exit code 1**: Error occurred

**Common errors:**

| Error | Solution |
|-------|----------|
| `Not authenticated` | Run `postqueen auth:login` or set `POSTQUEEN_API_KEY` |
| `Integration not found` | Run `integrations:list` to get valid IDs |
| `startDate/endDate required` | Use ISO 8601 format: `"2024-12-31T12:00:00Z"` |
| `Invalid settings` | Check `integrations:settings` for required fields |
| `Tool not found` | Check available tools in `integrations:settings` output |
| `Upload failed` | Verify file exists and format is supported |
| `analytics:post` returns `{"missing": true}` | Run `posts:missing <id>` then `posts:connect <id> --release-id "<rid>"` |

---

## Development

### Project Structure

```
src/
├── index.ts              # CLI entry point with yargs
├── api.ts                # PostQueenAPI client class
├── config.ts             # Configuration (OAuth2 + API key)
└── commands/
    ├── auth.ts           # OAuth2 authentication (login/logout/status)
    ├── posts.ts          # Post management commands
    ├── integrations.ts   # Integration commands
    ├── analytics.ts      # Analytics commands
    └── upload.ts         # Media upload command
examples/                 # Example scripts and JSON files
package.json
tsconfig.json
tsup.config.ts            # Build configuration
README.md                 # This file
SKILL.md                  # AI agent reference
```

### Scripts

```bash
pnpm run dev       # Watch mode for development
pnpm run build     # Build the CLI
pnpm run start     # Run the built CLI
```

### Building

The CLI uses `tsup` for bundling:

```bash
pnpm run build
```

Output in `dist/`:
- `index.js`: Bundled executable with shebang
- `index.js.map`: Source map

---

## Quick Reference

```bash
# Authentication
postqueen auth:login                                              # OAuth2 device flow
postqueen auth:status                                             # Check auth
postqueen auth:logout                                             # Remove credentials
export POSTQUEEN_API_KEY=your_key                                 # Or use API key

# Discovery
postqueen integrations:list                           # List integrations
postqueen integrations:list --group "<group-id>"      # List integrations in a group
postqueen integrations:groups                         # List groups (customers)
postqueen integrations:settings <id>                  # Get settings
postqueen integrations:trigger <id> <method> -d '{}'  # Fetch data

# Posting (date is required)
postqueen posts:create -c "text" -s "2024-12-31T12:00:00Z" -i "id"                    # Simple
postqueen posts:create -c "text" -s "2024-12-31T12:00:00Z" -t draft -i "id"          # Draft
postqueen posts:create -c "text" -m "img.jpg" -s "2024-12-31T12:00:00Z" -i "id"      # With media
postqueen posts:create -c "main" -c "comment" -s "2024-12-31T12:00:00Z" -i "id"      # With comment
postqueen posts:create -c "text" -s "2024-12-31T12:00:00Z" --settings '{}' -i "id"   # Platform-specific
postqueen posts:create --json file.json                                               # Complex

# Management
postqueen posts:list                                  # List posts
postqueen posts:delete <id>                          # Delete post
postqueen posts:status <id> --status draft           # Move to draft (stops workflow)
postqueen posts:status <id> --status schedule        # Queue draft for publishing
postqueen upload <file>                              # Upload media

# Analytics
postqueen analytics:platform <id>                    # Platform analytics (7 days)
postqueen analytics:platform <id> -d 30             # Platform analytics (30 days)
postqueen analytics:post <id>                        # Post analytics (7 days)
postqueen analytics:post <id> -d 30                 # Post analytics (30 days)
# If analytics:post returns {"missing": true}, resolve it:
postqueen posts:missing <id>                         # List provider content
postqueen posts:connect <id> --release-id "<rid>"    # Connect content to post

# Help
postqueen --help                                     # Show help
postqueen posts:create --help                        # Command help
```

---

## ❤️ Community & Support

We would love to hear from you, whether you hit a bug, have an idea, or just want to say hi:

- 🐛 **Found a bug or have a feature idea?** [Open an issue](https://github.com/GkhanKINAY/postqueen-agent/issues).
- 💌 **Need a hand?** Email **support@postqueen.ai**.
- 📚 **Getting started?** The [docs](https://docs.postqueen.ai) walk you through everything.

If PostQueen saves you time, a ⭐ on the repo genuinely helps other people find it.

---

## Contributing

This CLI is part of the [PostQueen monorepo](https://github.com/GkhanKINAY/postqueen-app).

To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes in `apps/cli/`
4. Run tests: `pnpm run build`
5. Submit a pull request

---

## 💜 Thank you, Postiz

PostQueen exists because **Nevo David open-sourced [Postiz](https://github.com/gitroomhq/postiz-app) under AGPL-3.0**. We believe agentic AI will be part of everyday life from 2030 on, and Postiz gave us the perfect open foundation to build our own agentic social media assistant on top of, in our own direction, not as a paywalled clone. Thank you, Nevo and the Postiz contributors. 🙏💜

## License

AGPL-3.0

PostQueen is a fork of [Postiz](https://github.com/gitroomhq/postiz-app) (AGPL-3.0). Huge thanks to Nevo David and the Postiz contributors for the foundation this project builds on.

---

## Links

- **Website:** [postqueen.ai](https://postqueen.ai)
- **App:** [app.postqueen.ai](https://app.postqueen.ai)
- **API Reference:** [api.postqueen.ai/docs](https://api.postqueen.ai/docs)
- **Docs:** [docs.postqueen.ai](https://docs.postqueen.ai)
- **npm:** [postqueen](https://www.npmjs.com/package/postqueen)
- **GitHub:** [GkhanKINAY/postqueen-app](https://github.com/GkhanKINAY/postqueen-app)
- **Issues:** [Report bugs](https://github.com/GkhanKINAY/postqueen-app/issues)

---

## Supported Platforms

30+ platforms including:

| Platform | Integration Tools | Settings |
|----------|------------------|----------|
| Twitter/X | getLists, getCommunities | who_can_reply_post |
| LinkedIn | getCompanies | companyId, carousel |
| Reddit | getFlairs, searchSubreddits | subreddit, title, flair |
| YouTube | getPlaylists, getCategories | title, type, tags, playlistId |
| TikTok | - | privacy, duet, stitch |
| Instagram | - | post_type (post/story) |
| Facebook | getPages | - |
| Pinterest | getBoards, getBoardSections | - |
| Discord | getChannels | - |
| Slack | getChannels | - |
| And 20+ more... | | |

**See [PROVIDER_SETTINGS.md](./PROVIDER_SETTINGS.md) for complete documentation.**
