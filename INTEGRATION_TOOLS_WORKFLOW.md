# Integration Tools Workflow

Some integrations need data that only the network knows (a Lemmy community, a Pinterest board, a Discord channel) before you can post. The CLI supports a complete workflow to discover and use these tools.

Most commands print one status line before their JSON, so the examples below drop it with `tail -n +2` before `jq`.

## The Complete Workflow

### Step 1: List Integrations

```bash
postqueen integrations:list
```

Get your integration IDs. Each entry also has an `identifier`, such as `lemmy` or `pinterest`.

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

## Real-World Example: Lemmy Communities

### 1. Get Lemmy Integration Settings

```bash
postqueen integrations:settings lemmy-abc123
```

**The `tools` part of the output:**
```json
{
  "output": {
    "tools": [
      {
        "methodName": "subreddits",
        "description": "Search for Lemmy communities by keyword",
        "dataSchema": [
          {
            "key": "word",
            "type": "string",
            "description": "Keyword to search for"
          }
        ]
      }
    ]
  }
}
```

The tool is called `subreddits` and the setting it fills is called `subreddit`. Both hold Lemmy communities.

### 2. Find the Community

```bash
postqueen integrations:trigger lemmy-abc123 subreddits -d '{"word":"selfhosted"}'
```

**Output shape:**
```json
{
  "output": [
    { "title": "<community name>", "name": "<community name>", "id": 12345 }
  ]
}
```

The `name` goes into the setting's `subreddit` field, and the `id` into its `id` field. The tool returns the `id` as a number, and the setting takes it as a string.

### 3. Create the Post

```bash
postqueen posts:create \
  -c "Check out my project!" \
  -s "2026-12-31T12:00:00Z" \
  --settings '{
    "subreddit": [{
      "value": {
        "id": "12345",
        "subreddit": "<community name>",
        "title": "My Cool Project"
      }
    }]
  }' \
  -i "lemmy-abc123"
```

`title` is required and takes 3 to 200 characters. `url` is optional and adds a link to the post. `subreddit` is a list, so add one item per community to post to several at once, each with its own `title`.

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
  "methodName": "experiences",
  "description": "Experiences",
  "dataSchema": [
    {
      "key": "id",
      "type": "string",
      "description": "Whop company id, from the companies tool"
    }
  ]
}
```

This is Whop's `experiences` tool, which lists a company's forums. Its input is an ID that another tool, `companies`, returns, so run that one first.

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
| Pinterest (`pinterest`) | `boards` | none | `board` |
| Discord (`discord`) | `channels` | none | `channel` |
| Slack (`slack`) | `channels` | none | `channel` |
| Lemmy (`lemmy`) | `subreddits` (communities) | `{"word":"..."}` | `subreddit[].value` (`id` and `subreddit`) |
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
postqueen integrations:trigger pinterest-123 invalidMethod
# ❌ Failed to trigger tool: Request failed: API Error (404): {"msg":"Tool not found"}
```

### Integration Not Found

```bash
postqueen integrations:trigger invalid-id boards
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
INTEGRATION_ID="lemmy-abc123"

# 1. Get settings
echo "📋 Getting settings..."
postqueen integrations:settings "$INTEGRATION_ID" | tail -n +2 | jq '.output.tools'

# 2. Find a community
echo ""
echo "🔎 Searching communities..."
COMMUNITY=$(postqueen integrations:trigger "$INTEGRATION_ID" subreddits -d '{"word":"selfhosted"}' | tail -n +2 | jq -c '.output[0]')
COMMUNITY_ID=$(echo "$COMMUNITY" | jq -r '.id')
COMMUNITY_NAME=$(echo "$COMMUNITY" | jq -r '.name')

echo "Selected community: $COMMUNITY_NAME ($COMMUNITY_ID)"

# 3. Create post (--arg passes the ID as the string the setting needs)
echo ""
echo "📝 Creating post..."
SETTINGS=$(jq -cn \
  --arg id "$COMMUNITY_ID" \
  --arg name "$COMMUNITY_NAME" \
  '{subreddit: [{value: {id: $id, subreddit: $name, title: "My Post Title"}}]}')

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
