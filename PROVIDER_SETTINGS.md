# Provider-Specific Settings

The PostQueen CLI supports platform-specific settings for each integration. Different platforms have different options and requirements.

## How to Use Provider Settings

### Method 1: Command Line Flags

```bash
postqueen posts:create \
  -c "Your content" \
  -s "2026-12-31T12:00:00Z" \
  --settings '<json-settings>' \
  -i "integration-id"
```

There is no flag for the platform: the backend reads it from the integration ID and adds the `__type` discriminator itself, so you never send it. The same `--settings` go to every integration in `-i`, so mix only integrations that take the same settings, or use a JSON file.

Every value passed to `-m`, and every `path` in a JSON file's `image` list, must be a path returned by `postqueen upload`. In the examples below, `$IMG1`, `$VIDEO` and so on hold such paths:

```bash
IMG1=$(postqueen upload img1.jpg | tail -n +2 | jq -r '.path')
```

### Method 2: JSON File

```bash
postqueen posts:create --json post-with-settings.json
```

In the JSON file, specify settings per integration:

```json
{
  "type": "now",
  "date": "2024-01-15T12:00:00Z",
  "shortLink": true,
  "tags": [],
  "posts": [{
    "integration": { "id": "reddit-123" },
    "value": [{ "content": "Post content", "image": [] }],
    "settings": {
      "subreddit": [{
        "value": {
          "subreddit": "/r/programming",
          "title": "My Post Title",
          "type": "self",
          "is_flair_required": false
        }
      }]
    }
  }]
}
```

## Supported Platforms & Settings

### Reddit (`reddit`)

**Settings:**
- `subreddit` (required): The subreddit as a `/r/...` path (the `name` that `integrations:trigger <id> subreddits` returns)
- `title` (required): Post title
- `type` (required): `"self"` (text), `"link"` or `"media"` (the post's first image or MP4). `integrations:trigger <id> restrictions` says which ones a subreddit allows
- `url` (required for links): URL if type is "link"
- `is_flair_required` (boolean): Whether flair is required
- `flair` (optional): Flair object with `id` and `name`

**Example:**
```bash
postqueen posts:create \
  -c "Post content here" \
  -s "2026-12-31T12:00:00Z" \
  --settings '{
    "subreddit": [{
      "value": {
        "subreddit": "/r/programming",
        "title": "Check out this cool project",
        "type": "self",
        "is_flair_required": false
      }
    }]
  }' \
  -i "reddit-123"
```

### YouTube (`youtube`)

**Settings:**
- `title` (required): Video title (2-100 characters)
- `type` (required): `"public"`, `"private"`, or `"unlisted"`
- `selfDeclaredMadeForKids` (optional): `"yes"` or `"no"`
- `thumbnail` (optional): Thumbnail MediaDto object
- `tags` (optional): Array of tag objects with `value` and `label`

**Example:**
```bash
postqueen posts:create \
  -c "Video description here" \
  -s "2026-12-31T12:00:00Z" \
  --settings '{
    "title": "My Awesome Video",
    "type": "public",
    "selfDeclaredMadeForKids": "no",
    "tags": [
      {"value": "tech", "label": "Tech"},
      {"value": "tutorial", "label": "Tutorial"}
    ]
  }' \
  -i "youtube-123"
```

### X / Twitter (`x`)

**Settings:**
- `community` (optional): X community URL (format: `https://x.com/i/communities/1234567890`)
- `who_can_reply_post` (required): Who can reply
  - `"everyone"` - Anyone can reply
  - `"following"` - Only people you follow
  - `"mentionedUsers"` - Only mentioned users
  - `"subscribers"` - Only subscribers
  - `"verified"` - Only verified users

**Example:**
```bash
postqueen posts:create \
  -c "Tweet content" \
  -s "2026-12-31T12:00:00Z" \
  --settings '{
    "who_can_reply_post": "everyone"
  }' \
  -i "twitter-123"
```

**With Community:**
```bash
postqueen posts:create \
  -c "Community tweet" \
  -s "2026-12-31T12:00:00Z" \
  --settings '{
    "community": "https://x.com/i/communities/1493446837214187523",
    "who_can_reply_post": "everyone"
  }' \
  -i "twitter-123"
```

### LinkedIn (`linkedin`)

**Settings:**
- `post_as_images_carousel` (boolean): Post as image carousel
- `carousel_name` (optional): Carousel name if posting as carousel

**Example:**
```bash
postqueen posts:create \
  -c "LinkedIn post" \
  -m "$IMG1,$IMG2,$IMG3" \
  -s "2026-12-31T12:00:00Z" \
  --settings '{
    "post_as_images_carousel": true,
    "carousel_name": "Product Showcase"
  }' \
  -i "linkedin-123"
```

### Instagram (`instagram`)

**Settings:**
- `post_type` (required): `"post"`, `"reel"` or `"story"`
- `is_trial_reel` (optional): Boolean
- `graduation_strategy` (optional): `"MANUAL"` or `"SS_PERFORMANCE"`
- `collaborators` (optional): Array of collaborator objects with `label`

**Example:**
```bash
postqueen posts:create \
  -c "Instagram post" \
  -m "$IMG1" \
  -s "2026-12-31T12:00:00Z" \
  --settings '{
    "post_type": "post",
    "is_trial_reel": false
  }' \
  -i "instagram-123"
```

**Story Example:**
```bash
postqueen posts:create \
  -c "Story content" \
  -m "$IMG1" \
  -s "2026-12-31T12:00:00Z" \
  --settings '{
    "post_type": "story"
  }' \
  -i "instagram-123"
```

### TikTok (`tiktok`)

**Settings:**

Two independent axes decide whether a TikTok setting applies. A setting sent on the wrong axis is **silently discarded** — the API still reports success:

1. **Posting method** — every setting below except `title` requires `content_posting_method: "DIRECT_POST"`. With `"UPLOAD"`, TikTok keeps only the title/content and discards everything else.
2. **Media type** — `duet`, `stitch`, and `video_made_with_ai` apply to **video posts only**; `autoAddMusic` applies to **photo posts only**; the rest apply to both.

- `title` (optional): Video title (max 90 characters) — the only setting that survives `"UPLOAD"`
- `privacy_level` (required, DIRECT_POST only, video + photo): Privacy level
  - `"PUBLIC_TO_EVERYONE"`
  - `"MUTUAL_FOLLOW_FRIENDS"`
  - `"FOLLOWER_OF_CREATOR"`
  - `"SELF_ONLY"`
- `duet` (boolean, DIRECT_POST only, **video posts only**): Allow duets
- `stitch` (boolean, DIRECT_POST only, **video posts only**): Allow stitch
- `comment` (boolean, DIRECT_POST only, video + photo): Allow comments
- `autoAddMusic` (required, DIRECT_POST only, **photo posts only**): `"yes"` or `"no"`. Automatically adds music to photo posts. The API still requires it on video posts, where TikTok ignores it, so send `"no"` there
- `brand_content_toggle` (boolean, DIRECT_POST only, video + photo): Brand content toggle
- `brand_organic_toggle` (boolean, DIRECT_POST only, video + photo): Brand organic toggle
- `video_made_with_ai` (optional boolean, DIRECT_POST only, **video posts only**): Label the video as AI-generated
- `content_posting_method` (required): `"DIRECT_POST"` or `"UPLOAD"`
  - **Use `"DIRECT_POST"`.** It publishes the post to TikTok.
  - `"UPLOAD"` does **not** publish. It sends the media to the account's TikTok app inbox, where the user must manually finish and publish it within 24 hours or it is discarded. The PostQueen API still reports the post as successfully published.
  - `"UPLOAD"` also discards every other setting in this list except `title` — TikTok's inbox endpoint accepts no post info.
  - Only use `"UPLOAD"` when the user has **explicitly** asked to review or edit the post inside the TikTok app before publishing. Never infer it from the user saying "upload this video" — that means `"DIRECT_POST"`.

**Example:**
```bash
postqueen posts:create \
  -c "TikTok video description" \
  -m "$VIDEO" \
  -s "2026-12-31T12:00:00Z" \
  --settings '{
    "title": "Check this out!",
    "privacy_level": "PUBLIC_TO_EVERYONE",
    "duet": true,
    "stitch": true,
    "comment": true,
    "autoAddMusic": "no",
    "brand_content_toggle": false,
    "brand_organic_toggle": false,
    "video_made_with_ai": false,
    "content_posting_method": "DIRECT_POST"
  }' \
  -i "tiktok-123"
```

### Other platforms

Facebook, Pinterest, Discord, Slack, Dev.to, Hashnode, WordPress and the rest have their own settings. Pinterest requires a `board`, and Discord and Slack a `channel`, each an ID from `integrations:trigger`. `postqueen integrations:settings <integration-id>` prints any platform's full schema, rules and helper tools.

## Platforms Without Specific Settings

These platforms use the default `EmptySettings`:
- `threads`
- `mastodon`
- `bluesky`
- `telegram`
- `nostr`
- `vk`

For these, leave out `--settings`.

## Using JSON Files for Complex Settings

For complex settings, it's easier to use JSON files:

### Reddit Example

**reddit-post.json:**
```json
{
  "type": "now",
  "date": "2024-01-15T12:00:00Z",
  "shortLink": true,
  "tags": [],
  "posts": [{
    "integration": { "id": "reddit-123" },
    "value": [{
      "content": "Check out this cool project!",
      "image": []
    }],
    "settings": {
      "subreddit": [{
        "value": {
          "subreddit": "/r/programming",
          "title": "My Cool Project - Built with TypeScript",
          "type": "self",
          "is_flair_required": true,
          "flair": {
            "id": "flair-123",
            "name": "Project"
          }
        }
      }]
    }
  }]
}
```

```bash
postqueen posts:create --json reddit-post.json
```

### YouTube Example

**youtube-video.json:**
```json
{
  "type": "schedule",
  "date": "2024-12-25T12:00:00Z",
  "shortLink": true,
  "tags": [],
  "posts": [{
    "integration": { "id": "youtube-123" },
    "value": [{
      "content": "Full video description with timestamps...",
      "image": [{
        "id": "thumb1",
        "path": "https://cdn.example.com/thumbnail.jpg"
      }]
    }],
    "settings": {
      "title": "How to Build a CLI Tool",
      "type": "public",
      "selfDeclaredMadeForKids": "no",
      "tags": [
        { "value": "programming", "label": "Programming" },
        { "value": "typescript", "label": "TypeScript" },
        { "value": "tutorial", "label": "Tutorial" }
      ]
    }
  }]
}
```

```bash
postqueen posts:create --json youtube-video.json
```

### Multi-Platform with Different Settings

**multi-platform-campaign.json:**
```json
{
  "type": "now",
  "date": "2024-01-15T12:00:00Z",
  "shortLink": true,
  "tags": [],
  "posts": [
    {
      "integration": { "id": "reddit-123" },
      "value": [{ "content": "Reddit-specific content", "image": [] }],
      "settings": {
        "subreddit": [{
          "value": {
            "subreddit": "/r/programming",
            "title": "Post Title",
            "type": "self",
            "is_flair_required": false
          }
        }]
      }
    },
    {
      "integration": { "id": "twitter-123" },
      "value": [{ "content": "Twitter-specific content", "image": [] }],
      "settings": {
        "who_can_reply_post": "everyone"
      }
    },
    {
      "integration": { "id": "linkedin-123" },
      "value": [
        {
          "content": "LinkedIn post",
          "image": [
            { "id": "1", "path": "img1.jpg" },
            { "id": "2", "path": "img2.jpg" }
          ]
        }
      ],
      "settings": {
        "post_as_images_carousel": true,
        "carousel_name": "Product Launch"
      }
    }
  ]
}
```

## Tips

1. **Use JSON files for complex settings** - Command-line JSON strings get messy fast
2. **Validate your settings** - The API will return errors if settings are invalid
3. **Check required fields** - Each platform has different required fields
4. **Platform-specific content** - Different platforms may need different content/media
5. **Test with drafts first** - Use `"type": "draft"` to test without posting

## Finding Your Provider Type

To find the correct provider type for your integration:

```bash
postqueen integrations:list
```

Each integration's `identifier` field names its platform, such as `x`, `reddit` or `linkedin-page`. The backend turns it into the settings `__type` for you.

## Common Errors

### Sending `__type`

Leave `__type` out of `settings`. The backend sets it from the integration, so a value you send is replaced.

### Settings for the wrong platform

`--settings` go to every integration in `-i`. Posting X settings to a Reddit integration fails validation, so post to each platform separately, or use a JSON file with settings per integration.

### Invalid Settings for Platform

Each platform validates its own settings. Check the error message and refer to the platform's required fields above.

## See Also

- [examples/EXAMPLES.md](./examples/EXAMPLES.md) - General usage examples
- [examples/COMMAND_LINE_GUIDE.md](./examples/COMMAND_LINE_GUIDE.md) - Command-line syntax
- [SKILL.md](./SKILL.md) - AI agent patterns
- `postqueen integrations:settings <integration-id>` - The live settings schema for one integration
