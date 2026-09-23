import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { createPost, listPosts, deletePost, getMissingContent, connectPost, changePostStatus, updatePostSettings } from './commands/posts';
import { listIntegrations, listGroups, getIntegrationSettings, triggerIntegrationTool } from './commands/integrations';
import { getAnalytics, getPostAnalytics } from './commands/analytics';
import { uploadFile } from './commands/upload';
import { authLogin, authLogout, authStatus, API_KEY_LOCATION } from './commands/auth';
import type { Argv } from 'yargs';

yargs(hideBin(process.argv))
  .scriptName('postqueen')
  .usage('$0 <command> [options]')
  .command(
    'posts:create',
    'Create a new post',
    (yargs: Argv) => {
      return yargs
        .option('content', {
          alias: 'c',
          describe: 'Post/comment content (can be used multiple times)',
          type: 'string',
          // Take the next argument even when it starts with "-", such as "- item" or "-hello"
          nargs: 1,
        })
        .option('media', {
          alias: 'm',
          describe: 'Comma-separated media URLs for the corresponding -c (can be used multiple times)',
          type: 'string',
        })
        .option('integrations', {
          alias: 'i',
          describe: 'Comma-separated list of integration IDs',
          type: 'string',
        })
        .option('date', {
          alias: 's',
          describe: 'Schedule date (ISO 8601 format) - REQUIRED',
          type: 'string',
        })
        .option('type', {
          alias: 't',
          describe: 'Post type: "schedule" or "draft"',
          type: 'string',
          choices: ['schedule', 'draft'],
          default: 'schedule',
        })
        .option('delay', {
          alias: 'd',
          describe: 'Delay in minutes between comments (default: 0)',
          type: 'number',
          default: 0,
        })
        .option('json', {
          alias: 'j',
          describe: 'Path to JSON file with full post structure',
          type: 'string',
        })
        .option('shortLink', {
          describe: 'Use short links',
          type: 'boolean',
          default: true,
        })
        .option('settings', {
          describe: 'Platform-specific settings as JSON string',
          type: 'string',
        })
        .check((argv) => {
          if (!argv.json && !argv.content) {
            throw new Error('Either --content or --json is required');
          }
          if (!argv.json && !argv.integrations) {
            throw new Error('--integrations is required when not using --json');
          }
          if (!argv.json && !argv.date) {
            throw new Error('--date is required when not using --json');
          }
          return true;
        })
        .example(
          '$0 posts:create -c "Hello World!" -s "2024-12-31T12:00:00Z" -i "twitter-123"',
          'Simple scheduled post'
        )
        .example(
          '$0 posts:create -c "Draft post" -s "2024-12-31T12:00:00Z" -t draft -i "twitter-123"',
          'Create draft post'
        )
        .example(
          '$0 posts:create -c "Main post" -m "$IMG1,$IMG2" -s "2024-12-31T12:00:00Z" -i "twitter-123"',
          'Post with two images (each a path returned by postqueen upload)'
        )
        .example(
          '$0 posts:create -c "Main post" -m "$IMG1" -c "First comment" -m "$IMG2" -c "Second comment" -m "$IMG3,$IMG4" -s "2024-12-31T12:00:00Z" -i "twitter-123"',
          'Post with comments, each having their own uploaded media'
        )
        .example(
          '$0 posts:create -c "Main" -c "Comment with semicolon; see?" -c "Another!" -s "2024-12-31T12:00:00Z" -i "twitter-123"',
          'Comments can contain semicolons'
        )
        .example(
          '$0 posts:create -c "Thread 1/3" -c "Thread 2/3" -c "Thread 3/3" -d 5 -s "2024-12-31T12:00:00Z" -i "twitter-123"',
          'Twitter thread with 5 minute delay'
        )
        .example(
          '$0 posts:create --json ./post.json',
          'Complex post from JSON file'
        )
        .example(
          '$0 posts:create -c "Post to subreddit" -s "2024-12-31T12:00:00Z" --settings \'{"subreddit":[{"value":{"subreddit":"/r/programming","title":"My Title","type":"self","is_flair_required":false}}]}\' -i "reddit-123"',
          'Reddit text post (type is self, link or media)'
        )
        .example(
          '$0 posts:create -c "Video description" -m "$VIDEO" -s "2024-12-31T12:00:00Z" --settings \'{"title":"My Video","type":"public","tags":[{"value":"tech","label":"Tech"}]}\' -i "youtube-123"',
          'YouTube video (uploaded first) with title and tags'
        )
        .example(
          '$0 posts:create -c "Tweet content" -s "2024-12-31T12:00:00Z" --settings \'{"who_can_reply_post":"everyone"}\' -i "twitter-123"',
          'X (Twitter) post with reply settings'
        );
    },
    createPost as any
  )
  .command(
    'posts:list',
    'List all posts',
    (yargs: Argv) => {
      return yargs
        .option('startDate', {
          describe: 'Start date (ISO 8601 format). Default: 30 days ago',
          type: 'string',
        })
        .option('endDate', {
          describe: 'End date (ISO 8601 format). Default: 30 days from now',
          type: 'string',
        })
        .option('customer', {
          describe: 'Customer ID (optional)',
          type: 'string',
        })
        .example('$0 posts:list', 'List all posts (last 30 days to next 30 days)')
        .example(
          '$0 posts:list --startDate "2024-01-01T00:00:00Z" --endDate "2024-12-31T23:59:59Z"',
          'List posts for a specific date range'
        )
        .example(
          '$0 posts:list --customer "customer-id"',
          'List posts for a specific customer'
        );
    },
    listPosts as any
  )
  .command(
    'posts:delete <id>',
    'Delete a post',
    (yargs: Argv) => {
      return yargs
        .positional('id', {
          describe: 'Post ID to delete',
          type: 'string',
        })
        .example('$0 posts:delete abc123', 'Delete post with ID abc123');
    },
    deletePost as any
  )
  .command(
    'posts:missing <id>',
    'List available content from the provider for a post with missing release ID',
    (yargs: Argv) => {
      return yargs
        .positional('id', {
          describe: 'Post ID',
          type: 'string',
        })
        .example(
          '$0 posts:missing post-123',
          'Get available content to connect to a post'
        );
    },
    getMissingContent as any
  )
  .command(
    'posts:status <id>',
    'Change a post status between draft and schedule',
    (yargs: Argv) => {
      return yargs
        .positional('id', {
          describe: 'Post ID',
          type: 'string',
        })
        .option('status', {
          alias: 's',
          describe: 'New status: "draft" or "schedule"',
          type: 'string',
          choices: ['draft', 'schedule'],
          demandOption: true,
        })
        .example(
          '$0 posts:status post-123 --status draft',
          'Move a scheduled post back to draft (stops the running workflow)'
        )
        .example(
          '$0 posts:status post-123 --status schedule',
          'Schedule a draft post so it is queued for publishing'
        );
    },
    changePostStatus as any
  )
  .command(
    'posts:settings <id>',
    'Update a post\'s provider-specific settings (merged; only unpublished draft/scheduled posts)',
    (yargs: Argv) => {
      return yargs
        .positional('id', {
          describe: 'Post ID',
          type: 'string',
        })
        .option('settings', {
          describe: 'Partial settings as a JSON string. Only the keys you pass change; do not include __type',
          type: 'string',
          demandOption: true,
        })
        .example(
          '$0 posts:settings post-123 --settings \'{"content_posting_method":"DIRECT_POST"}\'',
          'Switch a TikTok draft to direct publishing'
        )
        .example(
          '$0 posts:settings post-123 --settings \'{"subreddit":[{"value":{"subreddit":"/r/selfhosted","title":"My title","type":"self","is_flair_required":true}}]}\'',
          'Set a Reddit post\'s subreddit'
        );
    },
    updatePostSettings as any
  )
  .command(
    'posts:connect <id>',
    'Connect a post to its published content by updating the release ID',
    (yargs: Argv) => {
      return yargs
        .positional('id', {
          describe: 'Post ID',
          type: 'string',
        })
        .option('release-id', {
          describe: 'The platform-specific content ID to connect',
          type: 'string',
          demandOption: true,
        })
        .example(
          '$0 posts:connect post-123 --release-id "7321456789012345678"',
          'Connect a post to its published content'
        );
    },
    connectPost as any
  )
  .command(
    'integrations:list',
    'List all connected integrations',
    (yargs: Argv) => {
      return yargs
        .option('group', {
          describe: 'Filter integrations by group (customer) ID',
          type: 'string',
        })
        .example('$0 integrations:list', 'List all connected integrations')
        .example(
          '$0 integrations:list --group "customer-id"',
          'List integrations for a specific group'
        );
    },
    listIntegrations as any
  )
  .command(
    'integrations:groups',
    'List all groups (customers)',
    {},
    listGroups as any
  )
  .command(
    'integrations:settings <id>',
    'Get settings schema for a specific integration',
    (yargs: Argv) => {
      return yargs
        .positional('id', {
          describe: 'Integration ID',
          type: 'string',
        })
        .example(
          '$0 integrations:settings reddit-123',
          'Get settings schema for Reddit integration'
        )
        .example(
          '$0 integrations:settings youtube-456',
          'Get settings schema for YouTube integration'
        );
    },
    getIntegrationSettings as any
  )
  .command(
    'integrations:trigger <id> <method>',
    'Trigger an integration tool to fetch additional data',
    (yargs: Argv) => {
      return yargs
        .positional('id', {
          describe: 'Integration ID',
          type: 'string',
        })
        .positional('method', {
          describe: 'Method name from the integration tools',
          type: 'string',
        })
        .option('data', {
          alias: 'd',
          describe: 'Data to pass to the tool as JSON string',
          type: 'string',
        })
        .example(
          '$0 integrations:trigger reddit-123 subreddits -d \'{"word":"programming"}\'',
          'Search for subreddits'
        )
        .example(
          '$0 integrations:trigger reddit-123 restrictions -d \'{"subreddit":"/r/programming"}\'',
          'Get a subreddit\'s allowed post types and flairs'
        )
        .example(
          '$0 integrations:trigger pinterest-123 boards',
          'List Pinterest boards'
        );
    },
    triggerIntegrationTool as any
  )
  .command(
    'analytics:platform <id>',
    'Get analytics for a specific integration/channel',
    (yargs: Argv) => {
      return yargs
        .positional('id', {
          describe: 'Integration ID',
          type: 'string',
        })
        .option('date', {
          alias: 'd',
          describe: 'Number of days to look back (default: 7)',
          type: 'string',
          default: '7',
        })
        .example(
          '$0 analytics:platform integration-123',
          'Get last 7 days of analytics'
        )
        .example(
          '$0 analytics:platform integration-123 -d 30',
          'Get last 30 days of analytics'
        );
    },
    getAnalytics as any
  )
  .command(
    'analytics:post <id>',
    'Get analytics for a specific post',
    (yargs: Argv) => {
      return yargs
        .positional('id', {
          describe: 'Post ID',
          type: 'string',
        })
        .option('date', {
          alias: 'd',
          describe: 'Number of days to look back (default: 7)',
          type: 'string',
          default: '7',
        })
        .example(
          '$0 analytics:post post-123',
          'Get last 7 days of post analytics'
        )
        .example(
          '$0 analytics:post post-123 -d 30',
          'Get last 30 days of post analytics'
        );
    },
    getPostAnalytics as any
  )
  .command(
    'upload <file>',
    'Upload a file',
    (yargs: Argv) => {
      return yargs
        .positional('file', {
          describe: 'File path to upload',
          type: 'string',
        })
        .example('$0 upload ./image.png', 'Upload an image');
    },
    uploadFile as any
  )
  .command(
    'auth:login',
    'Explain API key setup, or log in through your own auth server (device flow)',
    (yargs: Argv) => {
      return yargs
        .option('auth-server', {
          describe: 'URL of a device-flow auth server you run yourself (or set POSTQUEEN_AUTH_SERVER). PostQueen has none: the hosted service signs in with POSTQUEEN_API_KEY',
          type: 'string',
        })
        .example(
          '$0 auth:login',
          'Show how to set up an API key'
        )
        .example(
          '$0 auth:login --auth-server https://auth.example.com',
          'Log in through your own auth server'
        );
    },
    authLogin as any
  )
  .command(
    'auth:logout',
    'Remove credentials stored by auth:login',
    {},
    authLogout as any
  )
  .command(
    'auth:status',
    'Show current authentication status',
    {},
    authStatus as any
  )
  // Options with nargs, such as --content, take the next argument even if it starts with "-"
  .parserConfiguration({ 'nargs-eats-options': true })
  // A mistyped command or flag is an error, not something to ignore
  .strict()
  // -c and -m repeat on purpose, once per post and comment. Every other flag takes
  // one value, and repeating it would hand the command an array.
  .check((argv) => {
    const repeated = Object.keys(argv).find(
      (key) => key.length > 1 && !['content', 'media'].includes(key) && Array.isArray(argv[key])
    );
    if (repeated) {
      throw new Error(`--${repeated} was given more than once, but takes one value`);
    }
    return true;
  })
  // On a usage error, print the reason and where to look instead of the whole help
  .fail((msg, err) => {
    const [first] = hideBin(process.argv);
    const command = first && !first.startsWith('-') ? first : undefined;
    let reason = (msg || err?.message || 'Invalid arguments').replace(/\s*\n\s*/g, ' ');
    let help = command ? `postqueen ${command} --help` : 'postqueen --help';
    // A mistyped command shows up as an unknown argument in the command's place
    const unknown = /^Unknown arguments?: (.*)$/.exec(reason)?.[1].split(', ') || [];
    if (command && unknown.includes(command)) {
      reason = `Unknown command: ${command}`;
      help = 'postqueen --help';
    }
    console.error(`❌ ${reason}. Run "${help}" for usage.`);
    process.exit(1);
  })
  .demandCommand(1, 'You need at least one command')
  .help()
  .alias('h', 'help')
  .version()
  .alias('v', 'version')
  .epilogue(
    `For more information, visit: https://postqueen.ai\n\nAuthentication:\n  API Key: export POSTQUEEN_API_KEY=your_api_key\n    (${API_KEY_LOCATION})\n  Your own auth server: postqueen auth:login --auth-server <url>`
  )
  .parse();
