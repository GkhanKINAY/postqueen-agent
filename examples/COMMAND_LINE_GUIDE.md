# PostQueen CLI - Command Line Guide

## Multiple `-c` and `-m` Flags

Repeat `-c` and `-m` to create a post with comments that have their own media.

## Basic Syntax

```bash
# Each -c (with its -m) is one post or comment, and the pair can repeat
postqueen posts:create \
  -c "content" -m "media" \
  -c "content" -m "media" \
  -s "2024-12-31T12:00:00Z" \
  -i "integration-id"
```

Every post needs a date (`-s`, ISO 8601) and at least one integration ID (`-i`). Every value passed to `-m` must be a path returned by `postqueen upload`, such as `$(postqueen upload photo1.jpg | tail -n +2 | jq -r '.path')`. The file names below stand for those paths.

### How It Works

- **First `-c`**: Main post content
- **Subsequent `-c`**: Comments/replies
- **Each `-m`**: Media for the corresponding `-c`
- `-m` is optional (text-only posts/comments)
- Order matters: `-c` and `-m` are paired in order

## Examples

### 1. Simple Post

```bash
postqueen posts:create \
  -c "Hello World!" \
  -s "2024-12-31T12:00:00Z" \
  -i "twitter-123"
```

### 2. Post with Multiple Images

```bash
postqueen posts:create \
  -c "Check out these photos!" \
  -m "photo1.jpg,photo2.jpg,photo3.jpg" \
  -s "2024-12-31T12:00:00Z" \
  -i "twitter-123"
```

**Result:**
- Main post with 3 images

### 3. Post with Comments, Each Having Their Own Media

```bash
postqueen posts:create \
  -c "Main post 🚀" \
  -m "main-image1.jpg,main-image2.jpg" \
  -c "First comment 📸" \
  -m "comment1-image.jpg" \
  -c "Second comment 🎨" \
  -m "comment2-img1.jpg,comment2-img2.jpg" \
  -s "2024-12-31T12:00:00Z" \
  -i "twitter-123"
```

**Result:**
- Main post with 2 images
- First comment with 1 image
- Second comment with 2 images

Comments follow right away unless you set a delay with `-d`.

### 4. Comments Can Contain Semicolons! 🎉

```bash
postqueen posts:create \
  -c "Main post" \
  -c "First comment; with a semicolon!" \
  -c "Second comment; with multiple; semicolons; works fine!" \
  -s "2024-12-31T12:00:00Z" \
  -i "twitter-123"
```

**No escaping needed!** Each `-c` is a separate argument, so special characters work perfectly.

### 5. Twitter Thread

```bash
postqueen posts:create \
  -c "🧵 Thread about X (1/5)" \
  -m "thread1.jpg" \
  -c "Key point 1 (2/5)" \
  -m "thread2.jpg" \
  -c "Key point 2 (3/5)" \
  -m "thread3.jpg" \
  -c "Key point 3 (4/5)" \
  -m "thread4.jpg" \
  -c "Conclusion 🎉 (5/5)" \
  -m "thread5.jpg" \
  -d 2 \
  -s "2024-12-31T12:00:00Z" \
  -i "twitter-123"
```

**Result:** 5-part thread with 2-minute delays between tweets

### 6. Mix: Some with Media, Some Without

```bash
postqueen posts:create \
  -c "Amazing sunset! 🌅" \
  -m "sunset.jpg" \
  -c "Taken at 6:30 PM" \
  -c "Location: Santa Monica Beach" \
  -c "Camera: iPhone 15 Pro" \
  -s "2024-12-31T12:00:00Z" \
  -i "twitter-123"
```

**Result:**
- Main post with 1 image
- 3 text-only comments

### 7. Multi-Platform with Same Content

```bash
postqueen posts:create \
  -c "Big announcement! 🎉" \
  -m "announcement.jpg" \
  -c "More details coming soon..." \
  -s "2024-12-31T12:00:00Z" \
  -i "twitter-123,linkedin-456,facebook-789"
```

**Result:** Same post + comment posted to all 3 platforms

### 8. Scheduled Post with Follow-ups

```bash
postqueen posts:create \
  -c "Product launching today! 🚀" \
  -m "product-hero.jpg,product-features.jpg" \
  -c "Special launch offer: 50% off!" \
  -m "discount-banner.jpg" \
  -c "Limited to first 100 customers!" \
  -s "2024-12-25T09:00:00Z" \
  -i "twitter-123"
```

**Result:** Scheduled main post with 2 follow-up comments

### 9. Product Tutorial

```bash
postqueen posts:create \
  -c "Tutorial: How to Use Feature X 📖" \
  -m "tutorial-intro.jpg" \
  -c "Step 1: Open the settings menu" \
  -m "step1-screenshot.jpg" \
  -c "Step 2: Toggle the feature on" \
  -m "step2-screenshot.jpg" \
  -c "Step 3: Customize your preferences" \
  -m "step3-screenshot.jpg" \
  -c "That's it! You're all set 🎉" \
  -d 3 \
  -s "2024-12-31T12:00:00Z" \
  -i "twitter-123"
```

## Options Reference

| Flag | Alias | Description | Multiple? |
|------|-------|-------------|-----------|
| `--content` | `-c` | Post/comment content | ✅ Yes |
| `--media` | `-m` | Comma-separated media paths from `postqueen upload` | ✅ Yes |
| `--integrations` | `-i` | Comma-separated integration IDs (required) | ❌ No |
| `--date` | `-s` | ISO 8601 date (required) | ❌ No |
| `--type` | `-t` | `schedule` (default) or `draft` | ❌ No |
| `--delay` | `-d` | Delay between comments (minutes) | ❌ No |
| `--settings` | - | Platform settings as a JSON string | ❌ No |
| `--shortLink` | - | Use URL shortener (default: true; `--no-shortLink` turns it off) | ❌ No |
| `--json` | `-j` | Load from JSON file | ❌ No |

A flag marked ❌ No fails if you give it twice.

## How `-c` and `-m` Pair Together

```bash
# Pair 1 → Main post, Pair 2 → Comment 1, Pair 3 → Comment 2
postqueen posts:create \
  -c "First content"  -m "first-media.jpg" \
  -c "Second content" -m "second-media.jpg" \
  -c "Third content"  -m "third-media.jpg" \
  -s "2024-12-31T12:00:00Z" \
  -i "twitter-123"
```

**Pairing logic:**
- 1st `-c` pairs with 1st `-m` (if provided)
- 2nd `-c` pairs with 2nd `-m` (if provided)
- 3rd `-c` pairs with 3rd `-m` (if provided)
- A `-c` with no `-m` left to pair with is text-only

## Delay Between Comments

Use `-d` or `--delay` to set the delay (in minutes) between comments:

```bash
# -d 10: 10 minutes between each
postqueen posts:create \
  -c "Main post" \
  -c "Comment 1" \
  -c "Comment 2" \
  -d 10 \
  -s "2024-12-31T12:00:00Z" \
  -i "twitter-123"
```

**Default:** 0 (no delay)

## When to Use JSON vs Command Line

### Use Command Line (`-c` and `-m`) When:
- ✅ Same content for all integrations
- ✅ Simple, straightforward posts
- ✅ Quick one-off posts
- ✅ Scripting with dynamic content

### Use JSON (`--json`) When:
- ✅ Different content per platform
- ✅ Complex settings or metadata
- ✅ Reusable post templates
- ✅ Very long or formatted content

## Tips for AI Agents

### Generate Commands Programmatically

```bash
# Generate a thread command with multiple tweets
postqueen posts:create \
  -c "Tweet 1/3" \
  -m "img1.jpg" \
  -c "Tweet 2/3" \
  -m "img2.jpg" \
  -c "Tweet 3/3" \
  -m "img3.jpg" \
  -s "2024-12-31T12:00:00Z" \
  -i "twitter-123"
```

### Escape Special Characters

In bash, you may need to escape some characters:

```bash
# Single quotes prevent interpolation
postqueen posts:create \
  -c 'Message with $variables and "quotes"' \
  -s "2024-12-31T12:00:00Z" \
  -i "twitter-123"

# Or use backslashes
postqueen posts:create \
  -c "Message with \$variables and \"quotes\"" \
  -s "2024-12-31T12:00:00Z" \
  -i "twitter-123"
```

## Error Handling

### Missing Integration

```bash
postqueen posts:create -c "Post" -m "img.jpg"
# ❌ --integrations is required when not using --json. Run "postqueen posts:create --help" for usage.
```

**Fix:** Add `-i` flag

### No Content

```bash
postqueen posts:create -i "twitter-123"
# ❌ Either --content or --json is required. Run "postqueen posts:create --help" for usage.
```

**Fix:** Add at least one `-c` flag

### Mismatched Count

`-m` pairs with `-c` by count, not by where you write it:

```bash
postqueen posts:create \
  -c "Post 1" -m "img1.jpg" \
  -c "Post 2" \
  -c "Post 3" -m "img3.jpg" \
  -s "2024-12-31T12:00:00Z" \
  -i "twitter-123"

# Result:
# - Post 1 with img1.jpg
# - Post 2 with img3.jpg (the second -m)
# - Post 3 with no media
```

To give a later comment media while an earlier one has none, use `--json`.

### Content That Starts with "-"

`-c` takes the next argument as content even when it starts with `-`, so `-c "- first point"` works. `--content="- first point"` works too.

## Full Example: Product Launch

```bash
#!/bin/bash

export POSTQUEEN_API_KEY=your_key

postqueen posts:create \
  -c "🚀 Launching ProductX today!" \
  -m "https://cdn.example.com/hero.jpg,https://cdn.example.com/features.jpg" \
  -c $'🎯 Key Features:\n• AI-powered\n• Cloud-native\n• Open source' \
  -m "https://cdn.example.com/features-detail.jpg" \
  -c "💰 Special launch pricing: 50% off for early adopters!" \
  -m "https://cdn.example.com/pricing.jpg" \
  -c "🔗 Get started: https://example.com/productx" \
  -s "2024-12-25T09:00:00Z" \
  -d 60 \
  -i "twitter-123,linkedin-456,facebook-789"

echo "✅ Product launch scheduled!"
```

## See Also

- [EXAMPLES.md](./EXAMPLES.md) - JSON file examples
- [SKILL.md](../SKILL.md) - AI agent patterns
- [README.md](../README.md) - Full documentation
- `examples/*.json` - Template files
