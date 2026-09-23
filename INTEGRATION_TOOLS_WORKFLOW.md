# Integration Tools Workflow

Some integrations need data that only the network knows (a subreddit's flairs, a Pinterest board, a Discord channel) before you can post. The CLI supports a complete workflow to discover and use these tools.

Most commands print one status line before their JSON, so the examples below drop it with `tail -n +2` before `jq`.

## The Complete Workflow

### Step 1: List Integrations

```bash
postqueen integrations:list
```

Get your integration IDs. Each entry also has an `identifier`, such as `reddit` or `pinterest`.

### Step 2: Get Integration Settings

```bash
postqueen integrations:settings <integration-id>
```

This returns, under `output`:
- `rules` - Guidance for agents on what the settings do
- `maxLength` - Character limit
- `settings` - The settings JSON schema (required fields, enums, descriptions)
- **`tools`** - Callable methods to fetch additional data (an empty array when the network has none)

### Step 3: Trigger Tools (If Needed)

If settings require IDs you don't have, use the tools:

```bash
postqueen integrations:trigger <integration-id> <method-name> -d '{"key":"value"}'
```

The result comes back as `{"output": ...}`.

### Step 4: Create Post with Complete Settings

Use the data from Step 3 in your post settings.

## Real-World Example: Reddit

### 1. Get Reddit Integration Settings

```bash
postqueen integrations:settings reddit-abc123
```

**The `tools` part of the output:**
```json
{
  "output": {
    "tools": [
      {
        "methodName": "subreddits",
        "description": "Get list of subreddits with information",
        "dataSchema": [
          {
            "key": "word",
            "type": "string",
            "description": "Search subreddit by string"
          }
        ]
      },
      {
        "methodName": "restrictions",
        "description": "Get list of flairs and restrictions for a subreddit",
        "dataSchema": [
          {
            "key": "subreddit",
            "type": "string",
            "description": "Search flairs and restrictions by subreddit key should be \"/r/[name]\""
          }
        ]
      }
    ]
  }
}
```

### 2. Find the Subreddit

```bash
postqueen integrations:trigger reddit-abc123 subreddits -d '{"word":"programming"}'
```

Each result has a `title`, an `id` and a `name`. The `name` is the subreddit's `/r/...` path, which is what the `subreddit` setting takes.

### 3. Get Its Post Types and Flairs

```bash
postqueen integrations:trigger reddit-abc123 restrictions -d '{"subreddit":"/r/programming"}'
```

**Output shape:**
```json
{
  "output": {
    "subreddit": "/r/programming",
    "allow": ["self", "link"],
    "is_flair_required": true,
    "flairs": [
      { "id": "<flair id>", "name": "<flair name>" }
    ]
  }
}
```

`allow` lists the post types the subreddit accepts, out of `self`, `link` and `media`.

### 4. Create Post with the Flair

```bash
postqueen posts:create \
  -c "Check out my project!" \
  -s "2026-12-31T12:00:00Z" \
  --settings '{
    "subreddit": [{
      "value": {
        "subreddit": "/r/programming",
        "title": "My Cool Project",
        "type": "self",
        "is_flair_required": true,
        "flair": {
          "id": "<flair id>",
          "name": "<flair name>"
        }
      }
    }]
  }' \
  -i "reddit-abc123"
```

`type` must be `self` (a text post), `link` (also needs `url`) or `media` (posts the first attached image or MP4 video). `flair` is only needed when `is_flair_required` is true.

## Example: Pinterest Boards

### 1. List Boards

```bash
postqueen integrations:trigger pinterest-123 boards
```

**Output shape:**
```json
{
  "output": [
    { "name": "<board name>", "id": "<board id>" }
  ]
}
```

### 2. Post to a Board

```bash
PIN=$(postqueen upload pin.jpg | tail -n +2 | jq -r '.path')

postqueen posts:create \
  -c "Pin description" \
  -s "2026-12-31T12:00:00Z" \
  -m "$PIN" \
  --settings '{"board":"<board id>","title":"My Pin"}' \
  -i "pinterest-123"
```

## Example: Discord and Slack Channels

### 1. List Channels

```bash
postqueen integrations:trigger discord-123 channels
```

Both Discord and Slack return `[{ "id": "...", "name": "..." }]` under `output`. Discord lists text and announcement channels.

### 2. Post to a Channel

```bash
postqueen posts:create \
  -c "Release notes are out" \
  -s "2026-12-31T12:00:00Z" \
  --settings '{"channel":"<channel id>"}' \
  -i "discord-123"
```

## Understanding Tools

### Tool Structure

```json
{
  "methodName": "restrictions",
  "description": "Get list of flairs and restrictions for a subreddit",
  "dataSchema": [
    {
      "key": "subreddit",
      "type": "string",
      "description": "Search flairs and restrictions by subreddit key should be \"/r/[name]\""
    }
  ]
}
```

- **methodName** - Use this in `integrations:trigger`
- **description** - What the tool does
- **dataSchema** - The input keys to pass with `-d`

### Calling Tools

```bash
# No parameters
postqueen integrations:trigger <integration-id> <methodName>

# With parameters
postqueen integrations:trigger <integration-id> <methodName> -d '{"key":"value"}'
```

## Every Tool Method

These are all the tools the PostQueen API has, by network (`identifier` from `integrations:list`):

| Network | Tools (`methodName`) | Input (`-d`) | Setting it helps fill |
|---|---|---|---|
| Reddit (`reddit`) | `subreddits` | `{"word":"programming"}` | `subreddit[].value.subreddit` |
| Reddit (`reddit`) | `restrictions` | `{"subreddit":"/r/programming"}` | `type`, `is_flair_required`, `flair` |
| Pinterest (`pinterest`) | `boards` | none | `board` |
| Discord (`discord`) | `channels` | none | `channel` |
| Slack (`slack`) | `channels` | none | `channel` |
| Lemmy (`lemmy`) | `subreddits` (communities) | `{"word":"..."}` | `subreddit[].value` |
| Farcaster (`wrapcast`) | `subreddits` (channels) | `{"word":"..."}` | `subreddit[].value.id` |
| DEV (`devto`) | `tags`, `organizations` | none | `tags`, `organization` |
| Hashnode (`hashnode`) | `tagsList`, `publications` | none | `tags`, `publication` |
| WordPress (`wordpress`) | `postTypes`, `categoriesList`, `tagsList` | none | `type`, `categories`, `tags` |
| Listmonk (`listmonk`) | `list`, `templates` | none | `list`, `template` |
| Dribbble (`dribbble`) | `teams` | none | `team` |
| MeWe (`mewe`) | `groups` | none | `group` |
| Skool (`skool`) | `groups`, then `label` | `label`: `{"id":"<group id>"}` | `group`, `label` |
| Whop (`whop`) | `companies`, then `experiences` | `experiences`: `{"id":"<company id>"}` | `company`, `experience` |
| Instagram, Facebook login (`instagram`) | `audioSearch` | `{"q":"...","type":"music"}` or `"original_sound"` | `audio` |
| TikTok Business (`tiktok-business`) | `musicSearch`, `locationSearch` | `{"genre":"POP"}`, `{"q":"..."}` | `music`, `location` |

X, LinkedIn, LinkedIn Page, Facebook, Threads, YouTube, TikTok and the other networks have no tools. A LinkedIn Page is its own channel (`linkedin-page`), not a setting of a LinkedIn profile.

Some of these networks are marked Soon on the hosted service and cannot be connected there yet; see the Networks section of [SKILL.md](SKILL.md).

## AI Agent Workflow

For AI agents, this enables dynamic discovery and usage:

```bash
#!/bin/bash

INTEGRATION_ID="your-integration-id"

# 1. Get settings and tools
SETTINGS=$(postqueen integrations:settings "$INTEGRATION_ID" | tail -n +2)
echo "$SETTINGS" | jq '.output.tools'

# 2. Read each tool's dataSchema, then call the ones the settings need, for example:
postqueen integrations:trigger "$INTEGRATION_ID" <methodName> -d '{"<key>":"<value>"}'

# 3. Create post with complete settings
postqueen posts:create \
  -c "Your content" \
  -s "2026-12-31T12:00:00Z" \
  --settings '<settings JSON built from the tool output>' \
  -i "$INTEGRATION_ID"
```

## Error Handling

### Tool Not Found

```bash
postqueen integrations:trigger reddit-123 invalidMethod
# ❌ Failed to trigger tool: Request failed: API Error (404): {"msg":"Tool not found"}
```

### Integration Not Found

```bash
postqueen integrations:trigger invalid-id subreddits -d '{"word":"programming"}'
# ❌ Failed to trigger tool: Request failed: API Error (404): {"msg":"Integration not found"}
```

## Tips

1. **Always check tools first** - Run `integrations:settings` to see available tools
2. **Read dataSchema** - Know what parameters each tool needs
3. **Parse JSON output** - Drop the status line with `tail -n +2`, then use `jq`
4. **Cache results** - Tool results don't change often
5. **For AI agents** - Automate the entire workflow

## Complete Example Script

```bash
#!/bin/bash
export POSTQUEEN_API_KEY=your_key
INTEGRATION_ID="reddit-abc123"
SUBREDDIT="/r/programming"

# 1. Get settings
echo "📋 Getting settings..."
postqueen integrations:settings "$INTEGRATION_ID" | tail -n +2 | jq '.output.tools'

# 2. Get the subreddit's post types and flairs
echo ""
echo "🏷️  Getting flairs..."
RULES=$(postqueen integrations:trigger "$INTEGRATION_ID" restrictions -d "{\"subreddit\":\"$SUBREDDIT\"}" | tail -n +2)
FLAIR_REQUIRED=$(echo "$RULES" | jq '.output.is_flair_required')
FLAIR_ID=$(echo "$RULES" | jq -r '.output.flairs[0].id')
FLAIR_NAME=$(echo "$RULES" | jq -r '.output.flairs[0].name')

echo "Allowed types: $(echo "$RULES" | jq -c '.output.allow')"
echo "Selected flair: $FLAIR_NAME ($FLAIR_ID)"

# 3. Create post
echo ""
echo "📝 Creating post..."
SETTINGS=$(jq -cn \
  --arg subreddit "$SUBREDDIT" \
  --argjson required "$FLAIR_REQUIRED" \
  --arg id "$FLAIR_ID" \
  --arg name "$FLAIR_NAME" \
  '{subreddit: [{value: {subreddit: $subreddit, title: "My Post Title", type: "self", is_flair_required: $required, flair: {id: $id, name: $name}}}]}')

postqueen posts:create \
  -c "My post content" \
  -s "2026-12-31T12:00:00Z" \
  --settings "$SETTINGS" \
  -i "$INTEGRATION_ID"

echo "✅ Done!"
```

## Summary

✅ **Discover available tools** with `integrations:settings`
✅ **Call tools** to fetch required data with `integrations:trigger`
✅ **Use tool results** in post settings
✅ **Complete workflow** from discovery to posting
✅ **Perfect for AI agents** - fully automated
✅ **No guesswork** - know exactly what data you need
