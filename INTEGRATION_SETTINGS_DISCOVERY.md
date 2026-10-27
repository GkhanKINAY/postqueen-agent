# Integration Settings Discovery

The CLI now has a powerful feature to discover what settings are available for each integration!

## New Command: `integrations:settings`

Get the settings schema, validation rules, and maximum character limits for any integration.

## Usage

```bash
postqueen integrations:settings <integration-id>
```

The command prints one status line (`⚙️  Settings for integration: <id>`) and then the JSON, so drop the first line with `tail -n +2` before you pipe it into `jq`.

## What It Returns

```json
{
  "output": {
    "rules": "Platform guidance written for agents",
    "maxLength": 280,
    "tools": [],
    "settings": {
      "properties": {
        "who_can_reply_post": {
          "enum": ["everyone", "following", "mentionedUsers", "subscribers", "verified"],
          "description": "Who can reply to this post"
        },
        "community": {
          "pattern": "^(https://x.com/i/communities/\\d+)?$",
          "description": "X community URL"
        }
      },
      "required": ["who_can_reply_post"]
    }
  }
}
```

## Workflow

### 1. List Your Integrations

```bash
postqueen integrations:list
```

Output (after the status line):
```json
[
  {
    "id": "pinterest-abc123",
    "name": "My Pinterest Account",
    "identifier": "pinterest"
  },
  {
    "id": "youtube-def456",
    "name": "My YouTube Channel",
    "identifier": "youtube"
  },
  {
    "id": "twitter-ghi789",
    "name": "@myhandle",
    "identifier": "x"
  }
]
```

### 2. Get Settings for Specific Integration

```bash
postqueen integrations:settings pinterest-abc123
```

Output:
```json
{
  "output": {
    "rules": "Pinterest requires at least one media, if posting a video, you must have two attachment, one for video, one for the cover picture, When posting a video, there can be only one, if posting images, there can be maximum 5",
    "maxLength": 800,
    "settings": {
      "properties": {
        "title": {
          "maxLength": 100,
          "type": "string"
        },
        "link": {
          "format": "url",
          "type": "string"
        },
        "dominant_color": {
          "type": "string"
        },
        "board": {
          "pattern": "^\\d+$",
          "type": "string",
          "minLength": 1,
          "not": { "type": "null" },
          "description": "The numeric id of the board (from the boards list of the channel), not the board name"
        }
      },
      "type": "object",
      "required": ["board"]
    },
    "tools": [
      {
        "methodName": "boards",
        "description": "List of boards",
        "dataSchema": []
      }
    ]
  }
}
```

### 3. Use the Settings in Your Post

Now you know what settings are available and required! `board` takes the numeric ID of a board, which the `boards` tool returns, and the `rules` ask for at least one image or video:

```bash
postqueen integrations:trigger pinterest-abc123 boards
# The output lists the boards as [{ "name": "<board name>", "id": "<board id>" }]

PIN=$(postqueen upload pin.jpg | tail -n +2 | jq -r '.path')

postqueen posts:create \
  -c "My pin description" \
  -s "2026-12-31T12:00:00Z" \
  -m "$PIN" \
  --settings '{
    "board": "<board id>",
    "title": "Check this out!"
  }' \
  -i "pinterest-abc123"
```

## Examples by Platform

### Pinterest

```bash
postqueen integrations:settings pinterest-abc123
```

Returns:
- Max length: 800 characters
- Required settings: board (the numeric board ID from the `boards` tool, not the board name)
- Optional: title (up to 100 characters), link, dominant_color
- Media: at least one, either up to 5 images or one video with its cover image

### YouTube

```bash
postqueen integrations:settings youtube-def456
```

Returns:
- Max length: 5,000 characters (description)
- Required settings: title, type (public/private/unlisted)
- Optional: tags, thumbnail, selfDeclaredMadeForKids

### X (Twitter)

```bash
postqueen integrations:settings twitter-ghi789
```

Returns:
- Max length: 280 characters (or 4,000 for verified)
- Required settings: who_can_reply_post
- Optional: community

### LinkedIn

```bash
postqueen integrations:settings linkedin-jkl012
```

Returns:
- Max length: 3,000 characters
- Optional settings: post_as_images_carousel, carousel_name

### TikTok

```bash
postqueen integrations:settings tiktok-mno345
```

Returns:
- Max length: 150 characters (caption)
- Required settings: privacy_level, duet, stitch, comment, brand_content_toggle, brand_organic_toggle, content_posting_method
- Optional: title, video_made_with_ai, autoAddMusic
- Posting method: every setting except title requires `content_posting_method: "DIRECT_POST"` — with `"UPLOAD"` only the title/content is kept
- Media type: duet, stitch are video-only; autoAddMusic is photo-only; video_made_with_ai labels videos and photos on TikTok, videos only on TikTok Business; see [PROVIDER_SETTINGS.md](./PROVIDER_SETTINGS.md)

### Instagram

```bash
postqueen integrations:settings instagram-pqr678
```

Returns:
- Max length: 2,200 characters
- Required settings: post_type (post, reel or story)
- Optional: is_trial_reel, graduation_strategy, collaborators

## No Additional Settings Required

Some platforms don't require specific settings:

```bash
postqueen integrations:settings threads-stu901
```

Returns:
```json
{
  "output": {
    "maxLength": 500,
    "settings": "No additional settings required"
  }
}
```

Platforms with no additional settings:
- Threads
- Mastodon
- Bluesky
- Telegram
- Nostr
- VK

## Use Cases

### 1. Discovery

Find out what settings are available before posting:

```bash
# What settings does YouTube support?
postqueen integrations:settings youtube-123

# What settings does Pinterest support?
postqueen integrations:settings pinterest-456
```

### 2. Validation

Check maximum character limits:

```bash
postqueen integrations:settings twitter-789 | tail -n +2 | jq '.output.maxLength'
# Output: 280
```

### 3. AI Agent Integration

AI agents can call this endpoint to:
- Discover available settings dynamically
- Validate settings before posting
- Adapt to platform-specific requirements

```bash
# Get settings schema
INTEGRATION_ID="your-integration-id"
SETTINGS=$(postqueen integrations:settings "$INTEGRATION_ID" | tail -n +2)

# Extract max length
MAX_LENGTH=$(echo "$SETTINGS" | jq '.output.maxLength')

# Check and truncate content if needed
CONTENT="Your post content"
if [ ${#CONTENT} -gt "$MAX_LENGTH" ]; then
  CONTENT="${CONTENT:0:$MAX_LENGTH}"
fi

# List required settings
echo "$SETTINGS" | jq '.output.settings.required // []'
```

### 4. Form Generation

Use the schema to generate UI forms:

```bash
# Inspect the settings schema for form generation
postqueen integrations:settings pinterest-123 | tail -n +2 | jq '.output.settings'

# Extract specific field properties
postqueen integrations:settings pinterest-123 \
  | tail -n +2 \
  | jq '.output.settings.properties'
# → title (text, maxLength: 100)
# → link (URL)
# → dominant_color (text)
# → board (text, digits only, required)
```

## Combined Workflow

Complete workflow for posting with correct settings:

```bash
#!/bin/bash
export POSTQUEEN_API_KEY=your_key

# 1. List integrations
echo "📋 Available integrations:"
postqueen integrations:list

# 2. Get settings for Pinterest
echo ""
echo "⚙️  Pinterest settings:"
SETTINGS=$(postqueen integrations:settings pinterest-123 | tail -n +2)
echo "$SETTINGS" | jq '.output.maxLength'
echo "$SETTINGS" | jq '.output.settings'

# 3. Pick a board and upload the image
BOARD_ID=$(postqueen integrations:trigger pinterest-123 boards | tail -n +2 | jq -r '.output[0].id')
PIN=$(postqueen upload pin.jpg | tail -n +2 | jq -r '.path')

# 4. Create post with correct settings
echo ""
echo "📝 Creating post..."
postqueen posts:create \
  -c "My pin description" \
  -s "2026-12-31T12:00:00Z" \
  -m "$PIN" \
  --settings "{\"board\":\"$BOARD_ID\",\"title\":\"Interesting pin\"}" \
  -i "pinterest-123"
```

## API Endpoint

The command calls:
```
GET /public/v1/integration-settings/:id
```

Returns:
```typescript
{
  output: {
    rules: string;
    maxLength: number;
    settings: ValidationSchema | "No additional settings required";
    tools: Tool[];
  }
}
```

## Error Handling

### Integration Not Found

```bash
postqueen integrations:settings invalid-id
# ❌ Failed to get integration settings: <the API's error>
```

### API Key Not Set

```bash
postqueen integrations:settings pinterest-123
# ❌ Error: No authentication found.
# Options:
#   1. API Key: export POSTQUEEN_API_KEY=your_api_key
#      Get it from PostQueen > Connections > API key, visible to workspace admins only.
```

## Tips

1. **Always check settings first** before creating posts with custom settings
2. **Use the schema** to validate your settings object
3. **Check maxLength** to avoid exceeding character limits
4. **For AI agents**: Cache the settings to avoid repeated API calls
5. **Required fields** must be included in your settings object

## Comparison: Before vs After

### Before ❌

```bash
# Had to guess what settings are available
# Had to read documentation or source code
# Didn't know character limits
```

### After ✅

```bash
# Discover settings programmatically
postqueen integrations:settings pinterest-123

# See exactly what's required and optional
# Know the exact character limits
# Get validation schemas
```

## Summary

✅ **Discover settings for any integration**
✅ **Get character limits**
✅ **See validation schemas**
✅ **Know required vs optional fields**
✅ **Perfect for AI agents**
✅ **No more guesswork!**

**Now you can discover what settings each platform supports!** 🎉
