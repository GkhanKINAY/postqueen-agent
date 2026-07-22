<p align="center">
  <a href="https://postqueen.ai">
    <img src=".github/assets/header.svg" width="840" alt="PostQueen: the queen of your posts, your AI social media assistant" />
  </a>
</p>

<h3 align="center">🆕&nbsp; NEW: run your social media by talking to your AI. Plan, generate and schedule a whole month of content to 30+ networks just by asking, then review it all in a visual calendar.</h3>

<br/>

<div align="center">
  <p>
    <strong>Stop writing posts by hand.</strong> Tell PostQueen what is going on (a sale, a new product, a<br/>
    milestone) and she finds the best hook, picks a photo with colors that fit your brand, writes it for<br/>
    every platform, and lines it up on your calendar. A social media manager for you or your whole team,<br/>
    a content creator or a business, that never sleeps.
  </p>
  <p><strong>PostQueen</strong>: an open-source alternative to <strong>Buffer, Hootsuite, Sprout Social, Later</strong> and more.</p>
</div>

<br/>

<p align="center">
  <a href="https://postqueen.ai">Website</a> &nbsp;·&nbsp;
  <a href="https://postqueen.ai/pricing">Pricing</a> &nbsp;·&nbsp;
  <a href="https://docs.postqueen.ai">Docs</a> &nbsp;·&nbsp;
  <a href="https://api.postqueen.ai/docs">API Reference</a> &nbsp;·&nbsp;
  <a href="https://postqueen.ai/agent">Agents</a> &nbsp;·&nbsp;
  <a href="https://postqueen.ai/mcp">MCP</a> &nbsp;·&nbsp;
  <a href="https://www.npmjs.com/package/postqueen">CLI</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/postqueen"><img src="https://img.shields.io/npm/v/postqueen" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/postqueen"><img src="https://img.shields.io/npm/dm/postqueen" alt="npm downloads"></a>
  <a href="https://github.com/GkhanKINAY/postqueen-agent/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-AGPL--3.0-blue.svg" alt="License: AGPL-3.0"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/node/v/postqueen" alt="Node version"></a>
</p>

<p align="center">
  <img src=".github/assets/channels.svg" width="780" alt="Publishes to 30+ social networks" />
</p>

<p align="center">
  <a href="https://postqueen.ai"><img src=".github/assets/cta-cloud.svg" height="48" alt="Start free for 7 days" /></a>
  &nbsp;&nbsp;
  <a href="https://github.com/GkhanKINAY/postqueen-docker-compose"><img src=".github/assets/cta-selfhost.svg" height="48" alt="Self-host it free" /></a>
</p>

<p align="center">
  <a href="https://postqueen.ai/pricing"><strong>See pricing »</strong></a>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://docs.postqueen.ai"><strong>Explore the docs »</strong></a>
</p>

---

## 👑 Everything PostQueen does for you

<p align="center">
  <img src=".github/assets/features.svg" width="880" alt="Scheduling, AI Assistant, AI Design, AI Video, Auto Actions, Teamwork, Analytics, Cross-posting" />
</p>

All of it is real, and all of it is yours to run: PostQueen is fully open-source, so you can use the managed cloud or host the whole thing yourself.

---

## 💬 Just talk to your AI

Think of PostQueen as the social media manager on your team, one you simply talk to. Tell her what is happening and she does the thinking: she finds a hook that fits your topic, picks an image with colors that match your brand, writes a version for each platform, and drops it on your calendar. Ask her in plain words, in **your own language** (PostQueen speaks 16 languages, Turkish included), by text or, if your assistant supports voice, hands-free by speaking.

Just say what you want:

> *"Plan a month of content for our coffee shop and fill the calendar."*

> *"Take this photo of today's special and put it on Instagram at lunchtime."*

> *"We just hit 10k followers, write a warm thank-you post for all our channels."*

> *"Turn my latest YouTube video into posts for X, LinkedIn and Threads."*

**You stay in control.** Everything lands in your calendar first, so you can read it, tweak it, or delete it before it goes out. Prefer to sign off on every single post? Ask her to save them as drafts, and nothing publishes until you schedule it yourself.

<br/>

<p align="center">
  <img src=".github/assets/works-with.svg" width="760" alt="Works with Claude Code, ChatGPT, Cursor, OpenClaw, Hermes, Codex" />
</p>

Already using an AI assistant? Point it at PostQueen and it drives everything over the same Agent CLI and hosted MCP server.

### Claude Code

> *"Announce our new summer menu on X and Instagram tomorrow at noon, and use the photo in `./menu.jpg`."*

Claude Code connects over the CLI or MCP and does the work for you:

```bash
postqueen integrations:list
postqueen upload ./menu.jpg
postqueen posts:create \
  -c "Our summer menu is here 🌞" \
  -m "<uploaded-url>" \
  -s "2026-06-01T12:00:00Z" \
  -i "<instagram-id>"
```

[Claude Code integration »](https://postqueen.ai/claude-code)

### ChatGPT

> *"Write a fun post about our weekend sale, make a matching image, and schedule it for Friday morning on Instagram and Facebook."*

Draft and refine in ChatGPT, then let it publish everywhere through the MCP connector. [ChatGPT integration »](https://postqueen.ai/chatgpt)

### Cursor

> *"Turn our latest blog post into three posts and space them across next week."*

Run your channels without leaving the editor you build in. [Cursor integration »](https://postqueen.ai/cursor)

### OpenClaw

> *"Create a week of gym content: a tip, a quote and a class reminder, and schedule them all."*

Message it from WhatsApp, Telegram, Slack or Discord and it works hands-free. [OpenClaw integration »](https://postqueen.ai/openclaw)

### Hermes

> *"Every Monday, plan the week's posts for our bakery and fill the calendar."*

Hand your whole posting routine to an agent that plans and runs multi-step tasks. [Hermes integration »](https://postqueen.ai/hermes-agent)

### Codex

> *"Draft a short daily tip for our brand and schedule one for each morning next week."*

OpenAI's software agent: one prompt in, a scheduled week out. [Codex integration »](https://postqueen.ai/codex)

**And any other agent.** PostQueen's CLI and MCP server are model-agnostic, so any MCP client or command-running agent works too: **Gemini CLI, Aider, Cline, Warp, Windsurf**, or your own scripts.

---

## 🌐 Supported networks

PostQueen publishes to **30+ social networks** out of the box:

<p align="center">
  <img src=".github/assets/channels.svg" width="820" alt="Supported social networks" />
</p>

- **Major social:** X, LinkedIn, Instagram, Facebook, TikTok, YouTube, Threads, Pinterest, Reddit, Bluesky
- **Community & chat:** Discord, Slack, Telegram, Mastodon, Twitch, Kick, MeWe, VK
- **Publishing & blogs:** WordPress, Medium, Dev.to, Hashnode, Tumblr, Listmonk, Moltbook
- **Web3 & decentralized:** Nostr, Farcaster, Lemmy
- **Creator & business:** Google Business Profile, Whop, Skool, Dribbble

LinkedIn and Instagram each support both personal and page posting, so the number of connectors runs a little higher. New connectors ship regularly.

---

## 🚀 Get started

PostQueen is **fully open-source (AGPL-3.0)**. Pick whichever way suits you:

### ☁️ Cloud

The fastest way to start: connect your channels and schedule your first post in minutes, with a **7-day free trial** and nothing to run yourself. [Start free »](https://postqueen.ai)

### 🐳 Self-host

Own your data and run the whole stack for free. You will need Docker, about 4 GB of RAM, and a domain with TLS (social networks send their OAuth callbacks there).

```bash
git clone https://github.com/GkhanKINAY/postqueen-docker-compose
cd postqueen-docker-compose
# open docker-compose.yaml and set a unique JWT_SECRET and your public URLs
docker compose up -d          # then open http://localhost:4007
```

The stack runs the app, PostgreSQL, Redis and a Temporal cluster (the engine that publishes on time). For the full walkthrough see the [self-host guide](https://docs.postqueen.ai/quickstart), for Kubernetes see [postqueen-helmchart](https://github.com/GkhanKINAY/postqueen-helmchart), and every setting is documented in the [configuration reference](https://docs.postqueen.ai/configuration/reference).

---

## 🧱 Tech stack

- **pnpm workspaces** (monorepo)
- **[Next.js](https://nextjs.org)** (React) for the frontend
- **[NestJS](https://nestjs.com)** for the backend API
- **[Prisma](https://www.prisma.io)** (default: PostgreSQL)
- **[Temporal](https://temporal.io)** for scheduling and publishing workers
- **Redis** for cache and queues
- **[Resend](https://resend.com)** for email notifications

---

## 🔑 Get your API key

You will need an API key to use the CLI, the MCP server, the SDK or the public API. It takes a minute:

1. Open **[app.postqueen.ai/settings](https://app.postqueen.ai/settings)** (or your own self-hosted instance).
2. Go to **Developers → Public API**.
3. Click **Reveal** to show your key.
4. Copy it and set it in your shell:

```bash
export POSTQUEEN_API_KEY="your_api_key"
```

Keep it secret: it grants full access to your account. You can revoke or rotate it any time from the same screen.

---

## 🔌 Connect over MCP

The [Model Context Protocol](https://modelcontextprotocol.io) lets AI assistants call tools. PostQueen ships a hosted MCP server, so any MCP client can draft, schedule and manage posts as if it were built in.

**One line (Claude Code or any CLI client):**

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

**ChatGPT:** Settings → Connectors → add a custom connector pointing at `https://api.postqueen.ai/mcp/<YOUR_API_KEY>`. Full guide: [postqueen.ai/mcp](https://postqueen.ai/mcp).

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

Install the CLI as a skill for terminal agents with `npx skills add GkhanKINAY/postqueen-agent`. The full command reference follows.

> Published on npm as [`postqueen`](https://www.npmjs.com/package/postqueen). By default the CLI talks to the hosted PostQueen API at `https://api.postqueen.ai`. Set the `POSTQUEEN_API_URL` environment variable to target any self-hosted PostQueen instance. The only URL-related flag is `--auth-server` (on `auth:login`), which points the OAuth2 device flow at a self-hosted auth server.

### What is the PostQueen CLI?

The PostQueen CLI is a command-line interface to the PostQueen API. It lets developers and AI agents automate social media posting, manage content, and handle media uploads across networks like Twitter/X, LinkedIn, Reddit, YouTube, TikTok, Instagram, Facebook, and more. Every command outputs JSON, so it drops cleanly into scripts, cron jobs, and agent tool-calls.

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

## Contributing

This CLI is part of the [PostQueen monorepo](https://github.com/GkhanKINAY/postqueen-app).

To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes in `apps/cli/`
4. Run tests: `pnpm run build`
5. Submit a pull request

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

---

## 🤖 Build your own agent

Because every action is a public API call, you can point your own agent at PostQueen and let it plan, draft and schedule on a schedule you set. A simple recurring job can wake up, decide what to post, and queue it. Start from the [Agent CLI](https://postqueen.ai/agent) or [MCP](https://postqueen.ai/mcp) guides.

---

## 🧩 Public API, SDK & n8n

| Tool | What it is | Get started |
| --- | --- | --- |
| **Public API** | REST at `https://api.postqueen.ai/public/v1` | [API reference](https://api.postqueen.ai/docs) |
| **NodeJS SDK** | Typed client for Node | [`@postqueen/node`](https://www.npmjs.com/package/@postqueen/node) |
| **n8n node** | No-code automation node | [`n8n-nodes-postqueen`](https://www.npmjs.com/package/n8n-nodes-postqueen) |
| **Webhooks** | Get notified when posts publish | [docs](https://docs.postqueen.ai) |

```bash
curl https://api.postqueen.ai/public/v1/integrations \
  -H "Authorization: $POSTQUEEN_API_KEY"
```

Plug the same API into Make.com, Zapier or your own scripts.

---

## 🛡️ Compliance

- PostQueen is an open-source, self-hostable social media scheduler that supports X, LinkedIn, Instagram, Bluesky, Mastodon, Discord and 30+ more.
- The hosted service uses official, platform-approved OAuth flows.
- PostQueen does not automate or scrape content from social media platforms.
- PostQueen does not collect, store, or proxy API keys or access tokens from users.
- PostQueen never asks users to paste social-platform credentials into the hosted product.
- Users always authenticate directly with each platform (X, LinkedIn, Discord, and so on), which keeps every platform's compliance and your data privacy intact.

---

## ❤️ Community & Support

We would love to hear from you, whether you hit a bug, have an idea, or just want to say hi:

- 🐛 **Found a bug or have a feature idea?** [Open an issue](https://github.com/GkhanKINAY/postqueen-agent/issues).
- 💌 **Need a hand?** Email **support@postqueen.ai**.
- 📚 **Getting started?** The [docs](https://docs.postqueen.ai) walk you through everything.

If PostQueen saves you time, a ⭐ on the repo genuinely helps other people find it.

## 💜 Why we built PostQueen, and a thank you

We believe the way we work is about to change. AI is getting better every month, and before long, getting real work done by simply talking to an assistant will feel completely normal. We wanted to build something for that shift, in the spirit of tools we admire like [Chatbase](https://www.chatbase.co) and [Wispr Flow](https://wisprflow.ai).

Social media felt like the perfect place to start: it takes real time and effort, and most of it is work an assistant can carry for you. When we found that Nevo David had open-sourced [Postiz](https://github.com/gitroomhq/postiz-app) under AGPL-3.0, we knew we had the foundation we needed. [PostQueen](https://postqueen.ai) grows that work in its own direction: an assistant that runs your social media, so you can spend your time on everything else.

Thank you, Nevo David and the Postiz contributors. We could not have started this without you. 🙏💜

## License

This repository's source code is available under the [AGPL-3.0 license](LICENSE). Original work © Nevo David / Gitroom and the Postiz contributors. Modifications © PostQueen.
