# PostQueen CLI - Advanced Examples

This directory contains examples demonstrating the full capabilities of the PostQueen CLI, including posts with comments and multiple media.

## Understanding the Post Structure

The PostQueen API supports a rich post structure:

```typescript
{
  type: 'now' | 'schedule' | 'draft' | 'update',
  date: string,              // ISO 8601 date
  shortLink: boolean,        // Use URL shortener
  tags: Tag[],              // Post tags
  posts: [                  // Can post to multiple platforms at once
    {
      integration: { id: string },    // Platform integration ID
      value: [                        // Main post + comments/thread
        {
          content: string,            // Post/comment text
          image: MediaDto[],          // Multiple media attachments
          delay?: number              // Delay in minutes before posting (for comments)
        },
        // ... more comments
      ],
      settings: {}                    // Platform settings; the backend adds __type
    }
  ]
}
```

Every media `path`, and every value passed to `-m`, must be a path returned by `postqueen upload`. The file names and URLs below stand for those paths.

## Simple Usage Examples

### Basic Post

```bash
postqueen posts:create \
  -c "Hello World!" \
  -s "2024-12-31T12:00:00Z" \
  -i "twitter-123"
```

### Post with Multiple Images

```bash
postqueen posts:create \
  -c "Check out these images!" \
  -m "img1.jpg,img2.jpg,img3.jpg" \
  -s "2024-12-31T12:00:00Z" \
  -i "twitter-123"
```

### Post with Comments (Simple)

```bash
postqueen posts:create \
  -c "Main post content" \
  -c "First comment" \
  -c "Second comment" \
  -c "Third comment" \
  -s "2024-12-31T12:00:00Z" \
  -i "twitter-123"
```

### Scheduled Post

```bash
postqueen posts:create \
  -c "Future post" \
  -s "2024-12-31T12:00:00Z" \
  -i "twitter-123,linkedin-456"
```

## Advanced JSON Examples

For complex posts with comments that have their own media, use JSON files:

### 1. Post with Comments and Media

**File:** `post-with-comments.json`

```bash
postqueen posts:create --json examples/post-with-comments.json
```

This creates:
- Main post with 2 images
- First comment with 1 image (5-minute delay)
- Second comment with 2 images (10-minute delay)

### 2. Multi-Platform Campaign

**File:** `multi-platform-post.json`

```bash
postqueen posts:create --json examples/multi-platform-post.json
```

This creates:
- Twitter post with main + comment
- LinkedIn post with single content
- Facebook post with main + comment
All scheduled for the same time with platform-specific content and media!

### 3. Twitter Thread

**File:** `thread-post.json`

```bash
postqueen posts:create --json examples/thread-post.json
```

This creates a 5-part Twitter thread, with each tweet having its own image and a 2-minute delay between tweets.

## JSON File Structure Explained

### Basic Structure

```json
{
  "type": "now",                    // "now", "schedule" or "draft"
  "date": "2024-01-15T12:00:00Z",  // When to post (ISO 8601)
  "shortLink": true,                // Enable URL shortening
  "tags": [],                       // Array of tags
  "posts": [...]                    // Array of posts
}
```

### Post Structure

```json
{
  "integration": {
    "id": "twitter-123"              // Get this from integrations:list
  },
  "value": [                         // Array of content (main + comments)
    {
      "content": "Post text",        // The actual content
      "image": [                     // Array of media
        {
          "id": "unique-id",         // Unique identifier
          "path": "https://..."      // URL to the image
        }
      ],
      "delay": 5                     // Optional delay in minutes
    }
  ],
  "settings": {}                     // Platform-specific settings (no __type: the backend adds it)
}
```

## Use Cases

### 1. Product Launch Campaign

Create a coordinated multi-platform launch:

```json
{
  "type": "schedule",
  "date": "2024-03-15T09:00:00Z",
  "posts": [
    {
      "integration": { "id": "twitter-id" },
      "value": [
        { "content": "🚀 Launching today!", "image": [...] },
        { "content": "Special features:", "image": [...], "delay": 60 },
        { "content": "Get it now:", "image": [...], "delay": 120 }
      ]
    },
    {
      "integration": { "id": "linkedin-id" },
      "value": [
        { "content": "Professional announcement...", "image": [...] }
      ]
    }
  ]
}
```

### 2. Tutorial Series

Create an educational thread:

```json
{
  "type": "now",
  "date": "2024-03-15T09:00:00Z",
  "posts": [
    {
      "integration": { "id": "twitter-id" },
      "value": [
        { "content": "🧵 How to X (1/5)", "image": [...] },
        { "content": "Step 1: ... (2/5)", "image": [...], "delay": 2 },
        { "content": "Step 2: ... (3/5)", "image": [...], "delay": 2 },
        { "content": "Step 3: ... (4/5)", "image": [...], "delay": 2 },
        { "content": "Conclusion (5/5)", "image": [...], "delay": 2 }
      ]
    }
  ]
}
```

### 3. Event Coverage

Live event updates with media:

```json
{
  "type": "now",
  "date": "2024-03-15T09:00:00Z",
  "posts": [
    {
      "integration": { "id": "twitter-id" },
      "value": [
        {
          "content": "📍 Event starting now!",
          "image": [
            { "id": "1", "path": "venue-photo.jpg" }
          ]
        },
        {
          "content": "First speaker taking stage",
          "image": [
            { "id": "2", "path": "speaker-photo.jpg" }
          ],
          "delay": 30
        }
      ]
    }
  ]
}
```

## Getting Integration IDs

Before creating posts, get your integration IDs:

```bash
postqueen integrations:list
```

Output (after a status line):
```json
[
  { "id": "abc-123-twitter", "identifier": "x", "name": "@myaccount" },
  { "id": "def-456-linkedin", "identifier": "linkedin-page", "name": "My Company" }
]
```

Use these IDs in your `integration.id` fields.

## Tips for AI Agents

1. **Use JSON for complex posts** - If you need comments with media, always use JSON files
2. **Delays are in minutes** - `delay` (and `-d`) is the wait in minutes before each comment
3. **Image IDs** - Generate unique IDs for each image (can use UUIDs or random strings)
4. **Validate before sending** - Check that all integration IDs exist
5. **Test with "draft" type** - Use `"type": "draft"` to create without posting

## Automation Scripts

### Batch Create from Directory

```bash
#!/bin/bash
# Create posts from all JSON files in a directory

for file in posts/*.json; do
  echo "Creating post from $file..."
  postqueen posts:create --json "$file"
  sleep 2
done
```

### Generate JSON Programmatically

```bash
# Generate a thread JSON file
cat > thread.json << 'EOF'
{
  "type": "now",
  "date": "2024-12-31T12:00:00Z",
  "shortLink": true,
  "tags": [],
  "posts": [{
    "integration": { "id": "twitter-123" },
    "value": [
      { "content": "Tweet 1", "image": [] },
      { "content": "Tweet 2", "image": [], "delay": 2 },
      { "content": "Tweet 3", "image": [], "delay": 2 }
    ],
    "settings": {}
  }]
}
EOF

# Post using the JSON file
postqueen posts:create --json thread.json
```

## Error Handling

Common errors and solutions:

1. **Invalid integration ID** - Run `integrations:list` to get valid IDs
2. **Invalid image path** - Every image path must be one that `postqueen upload` returned
3. **Missing required fields** - Check that `type`, `date`, `shortLink`, `tags`, and `posts` are all present
4. **Invalid date format** - Use ISO 8601 format: `YYYY-MM-DDTHH:mm:ssZ`

## Further Reading

- See `SKILL.md` for AI agent patterns
- See `README.md` for installation and setup
- See `QUICK_START.md` for basic usage
