# PostQueen CLI - Quick Start Guide

## Installation

### From Source (Development)

```bash
# Clone this repository
git clone https://github.com/GkhanKINAY/postqueen-agent.git
cd postqueen-agent

# Install dependencies
pnpm install

# Build the CLI
pnpm run build

# Test locally
node dist/index.js --help
```

### Global Installation (Development)

```bash
# From the repository root

# Link globally
pnpm link --global

# Now you can use 'postqueen' anywhere
postqueen --help
```

### From npm (Recommended)

```bash
npm install -g postqueen

# Or with pnpm
pnpm add -g postqueen
```

## Setup

### 1. Get Your API Key

1. Log in to your PostQueen account at https://postqueen.ai
2. Open Connections > API Keys (only workspace admins can see it)
3. Copy the key

### 2. Set Environment Variable

```bash
# Bash/Zsh
export POSTQUEEN_API_KEY=your_api_key_here

# Fish
set -x POSTQUEEN_API_KEY your_api_key_here

# PowerShell
$env:POSTQUEEN_API_KEY="your_api_key_here"
```

To make it permanent, add it to your shell profile:

```bash
# ~/.bashrc or ~/.zshrc
echo 'export POSTQUEEN_API_KEY=your_api_key_here' >> ~/.bashrc
source ~/.bashrc
```

### 3. Verify Installation

```bash
postqueen --help
```

## Basic Commands

### Create a Post

Every post needs a date (`-s`, ISO 8601) and at least one integration ID (`-i`). Media go through `postqueen upload` first, and `-m` takes the `path` it returns.

```bash
# Simple post
postqueen posts:create -c "Hello World!" -s "2024-12-31T12:00:00Z" -i "twitter-123"

# Draft instead of scheduled
postqueen posts:create -c "Hello World!" -s "2024-12-31T12:00:00Z" -t draft -i "twitter-123"

# Post with multiple images
IMG1=$(postqueen upload img1.jpg | tail -n +2 | jq -r '.path')
IMG2=$(postqueen upload img2.jpg | tail -n +2 | jq -r '.path')
postqueen posts:create \
  -c "Check these out!" \
  -m "$IMG1,$IMG2" \
  -s "2024-12-31T12:00:00Z" \
  -i "twitter-123"

# Post with comments (each can have different media!)
MAIN=$(postqueen upload main.jpg | tail -n +2 | jq -r '.path')
C1=$(postqueen upload comment1.jpg | tail -n +2 | jq -r '.path')
C2=$(postqueen upload comment2.jpg | tail -n +2 | jq -r '.path')
postqueen posts:create \
  -c "Main post" -m "$MAIN" \
  -c "First comment" -m "$C1" \
  -c "Second comment" -m "$C2" \
  -s "2024-12-31T12:00:00Z" \
  -i "twitter-123"
```

### List Posts

```bash
# List posts from 30 days ago to 30 days ahead
postqueen posts:list

# For a date range
postqueen posts:list --startDate "2024-01-01T00:00:00Z" --endDate "2024-12-31T23:59:59Z"

# For one customer
postqueen posts:list --customer "customer-id"
```

### Delete a Post

```bash
postqueen posts:delete abc123xyz
```

### List Integrations

```bash
postqueen integrations:list
```

### Upload Media

```bash
postqueen upload ./path/to/image.png
```

## Common Workflows

### 1. Check What's Connected

```bash
# See all your connected social media accounts
postqueen integrations:list
```

After a status line, the output shows integration IDs like:
```json
[
  { "id": "twitter-123", "name": "@myhandle", "identifier": "x" },
  { "id": "linkedin-456", "name": "My Name", "identifier": "linkedin" }
]
```

### 2. Create Multi-Platform Post

```bash
# Use the integration IDs from step 1
postqueen posts:create \
  -c "Posting to multiple platforms!" \
  -s "2024-12-31T12:00:00Z" \
  -i "twitter-123,linkedin-456,facebook-789"
```

### 3. Schedule Multiple Posts

```bash
# Morning post
postqueen posts:create -c "Good morning!" -s "2024-01-15T09:00:00Z" -i "twitter-123"

# Afternoon post
postqueen posts:create -c "Lunch time update!" -s "2024-01-15T12:00:00Z" -i "twitter-123"

# Evening post
postqueen posts:create -c "Good night!" -s "2024-01-15T20:00:00Z" -i "twitter-123"
```

### 4. Upload and Post Image

```bash
# First upload the image and keep the path it returns
IMAGE=$(postqueen upload ./my-image.png | tail -n +2 | jq -r '.path')

# Then create the post with it
postqueen posts:create -c "Check out this image!" -m "$IMAGE" -s "2024-12-31T12:00:00Z" -i "twitter-123"
```

## Tips & Tricks

### Using with jq for JSON Parsing

Most commands print one status line before their JSON, so drop it with `tail -n +2`:

```bash
# Get just the post IDs
postqueen posts:list | tail -n +2 | jq '.posts[].id'

# Get each integration's platform
postqueen integrations:list | tail -n +2 | jq '.[].identifier'
```

### Script Automation

```bash
#!/bin/bash
# Create a batch of posts

for hour in 09 12 15 18; do
  postqueen posts:create \
    -c "Automated post at ${hour}:00" \
    -s "2024-01-15T${hour}:00:00Z" \
    -i "twitter-123"
  echo "Created post for ${hour}:00"
done
```

### Environment Variables

```bash
# Custom API endpoint (for self-hosted)
export POSTQUEEN_API_URL=https://your-instance.com

# Use the CLI with custom endpoint
postqueen posts:list
```

## Troubleshooting

### API Key Not Set

```
❌ Error: No authentication found.
```

**Solution:** Set the environment variable:
```bash
export POSTQUEEN_API_KEY=your_key
```

### Command Not Found

```
postqueen: command not found
```

**Solution:** Either:
1. Use the full path: `node /path/to/postqueen-agent/dist/index.js`
2. Link globally: run `pnpm link --global` in the repository root
3. Install it from npm: `npm install -g postqueen`

### API Errors

```
❌ API Error (401): Unauthorized
```

**Solution:** Check your API key is valid. `postqueen auth:status` tests it.

```
❌ API Error (404): Not Found
```

**Solution:** Verify the post ID exists when deleting.

## Getting Help

```bash
# General help
postqueen --help

# Command-specific help
postqueen posts:create --help
postqueen posts:list --help
postqueen posts:delete --help
```

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Check [SKILL.md](./SKILL.md) for AI agent integration patterns
- See [examples/](./examples/) for more usage examples

## Links

- [PostQueen Website](https://postqueen.ai)
- [API Documentation](https://api.postqueen.ai/docs)
- [GitHub Repository](https://github.com/GkhanKINAY/postqueen-agent)
- [Report Issues](https://github.com/GkhanKINAY/postqueen-agent/issues)
