import { PostQueenConfig } from './api';
import { loadCredentials, API_KEY_LOCATION } from './commands/auth';

export function getConfig(): PostQueenConfig {
  // Check for stored OAuth credentials first
  const creds = loadCredentials();
  if (creds) {
    return {
      apiKey: creds.accessToken,
      apiUrl: creds.apiUrl,
    };
  }

  // Fall back to environment variable
  const apiKey = process.env.POSTQUEEN_API_KEY;
  const apiUrl = process.env.POSTQUEEN_API_URL;

  if (!apiKey) {
    console.error('❌ Error: No authentication found.');
    console.error('Options:');
    console.error('  1. API Key: export POSTQUEEN_API_KEY=your_api_key');
    console.error(`     Get it from ${API_KEY_LOCATION}.`);
    console.error('  2. Your own auth server: postqueen auth:login --auth-server <url>');
    process.exit(1);
  }

  return {
    apiKey,
    apiUrl,
  };
}
