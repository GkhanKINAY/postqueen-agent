/**
 * The `postqueen` skill body registered on `ctx.skills`.
 *
 * It teaches the agent the order of operations for the PostQueen MCP tools that
 * the sibling `postqueen-mcp` row exposes as `mcp__postqueen__*`. Kept as a
 * plain string so the plugin ships no extra files and needs no filesystem access.
 */

export const SKILL_NAME = 'postqueen'

export const SKILL_DESCRIPTION =
  'Schedule, draft, or publish social media posts through PostQueen (X, LinkedIn, Instagram, Facebook, Threads, TikTok, YouTube, Reddit, Bluesky, Mastodon, Discord, Slack, Telegram and more). Use when the user wants to post to social media, list connected channels, or plan a content calendar.'

export const SKILL_CONTENT = `# PostQueen

PostQueen is a social media scheduler. The \`mcp__postqueen__*\` tools talk to
the user's PostQueen account. Always follow this order:

## 1. Find the channel

Call \`mcp__postqueen__integrationList\` to get connected accounts. Each entry
has an \`id\` (the integration ID), a \`name\`, and a \`platform\` such as \`x\`,
\`linkedin\`, \`instagram\`, \`facebook\`, \`threads\`, \`tiktok\`, \`youtube\`,
\`reddit\`, \`bluesky\`, \`mastodon\`, \`discord\`, \`slack\`, \`telegram\`.
If the account has customer groups, \`mcp__postqueen__groupList\` lists them and
\`integrationList\` accepts a \`group\` filter.

Never guess an integration ID. If the user names a platform that is not in the
list, say so and stop.

## 2. Learn the platform rules

Call \`mcp__postqueen__integrationSchema\` with \`{ platform, isPremium }\` before
composing. It returns \`maxLength\`, \`rules\`, a \`settings\` JSON schema of
required per-platform settings, and helper \`tools\` (for example: list Discord
channels, search subreddits, list LinkedIn pages). Run helpers with
\`mcp__postqueen__triggerTool\` when a setting needs an ID you do not have.

## 3. Compose the content

- Content is HTML. Wrap every line in \`<p>\`. Allowed tags: \`<p>\`, \`<h1>\`,
  \`<h2>\`, \`<h3>\`, \`<strong>\`, \`<u>\`, \`<ul>\`, \`<li>\`. Do not combine
  \`<u>\` and \`<strong>\` in one element.
- Respect \`maxLength\` from the schema.
- \`postsAndComments\` is an array. On thread platforms (X, Threads, Bluesky)
  each item is a new post in the thread; on comment platforms (LinkedIn,
  Facebook) the first item is the post and the rest are comments.
- \`attachments\` are media URLs. To generate media first, use
  \`mcp__postqueen__generateImageTool\` or \`mcp__postqueen__generateVideoTool\`
  (check \`generateVideoOptions\` and \`videoFunctionTool\` for settings). A video
  takes a few minutes: \`generateVideoTool\` returns a \`jobId\`, and
  \`mcp__postqueen__videoStatusTool\` returns the URL once it is ready.

## 4. Schedule or publish

Call \`mcp__postqueen__integrationSchedulePostTool\` with a \`socialPost\` array.
Each item:

\`\`\`json
{
  "integrationId": "<id from integrationList>",
  "isPremium": false,
  "date": "2025-01-15T10:00:00.000Z",
  "shortLink": false,
  "type": "schedule",
  "postsAndComments": [{ "content": "<p>Hello world</p>", "attachments": [] }],
  "settings": [{ "key": "<from integrationSchema>", "value": "..." }]
}
\`\`\`

- \`type\` is \`draft\`, \`schedule\`, or \`now\`. Use \`draft\` when the user
  wants to review first; use \`now\` only when they explicitly ask to publish
  immediately.
- \`date\` is UTC ISO-8601. Convert the user's local time; if no time is given,
  ask or pick a sensible one and state it.
- One item per channel per time slot. Twenty posts across a month is twenty
  items in one call.

## 5. Review and adjust

\`mcp__postqueen__postsListTool\` lists posts between two dates.
\`mcp__postqueen__postSettingsTool\` updates the settings of a post that has not
been published yet.

## Setup

The tools are missing when no API key is configured. The key comes from the
\`POSTQUEEN_API_KEY\` environment variable (PostQueen → Settings → API Keys).
Self-hosted instances set \`baseUrl\` on the \`postqueen\` row in the profile's
\`cordis.patch.yml\`.
`
