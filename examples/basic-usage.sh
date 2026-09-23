#!/bin/bash

# Basic PostQueen CLI Usage Example
# Make sure to set your API key first: export POSTQUEEN_API_KEY=your_key
# Usage: ./basic-usage.sh <integration-id>   (the IDs are in: postqueen integrations:list)

INTEGRATION_ID="$1"

echo "🚀 PostQueen CLI Example Workflow"
echo ""

# Check if API key is set
if [ -z "$POSTQUEEN_API_KEY" ]; then
    echo "❌ POSTQUEEN_API_KEY is not set!"
    echo "Set it with: export POSTQUEEN_API_KEY=your_api_key"
    exit 1
fi

echo "✅ API key is set"
echo ""

if [ -z "$INTEGRATION_ID" ]; then
    echo "Usage: $0 <integration-id>"
    echo "Pick one from: postqueen integrations:list"
    exit 1
fi

# 1. List integrations
echo "📋 Step 1: Listing connected integrations..."
postqueen integrations:list
echo ""

# 2. Create a draft, dated 1 hour from now (BSD date on macOS, GNU date on Linux)
echo "📝 Step 2: Creating a test draft..."
IN_ONE_HOUR=$(date -u -v+1H +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -d '+1 hour' +%Y-%m-%dT%H:%M:%SZ)
postqueen posts:create \
  -c "Hello from PostQueen CLI! This is an automated test post." \
  -s "$IN_ONE_HOUR" \
  -t draft \
  -i "$INTEGRATION_ID"
echo ""

# 3. List posts
echo "📋 Step 3: Listing posts from 30 days ago to 30 days ahead..."
postqueen posts:list
echo ""

echo "✅ Example workflow completed!"
echo ""
echo "💡 Tips:"
echo "  - Use -t schedule (the default) instead of -t draft to queue the post"
echo "  - Upload images with: postqueen upload ./path/to/image.png"
echo "  - Delete posts with: postqueen posts:delete <post-id>"
echo "  - Get help: postqueen --help"
