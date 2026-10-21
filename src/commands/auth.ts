import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync, chmodSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { createServer, Server } from 'http';
import { createHash, randomBytes } from 'crypto';
import fetch from 'node-fetch';

const CREDENTIALS_DIR = join(homedir(), '.postqueen');
const CREDENTIALS_FILE = join(CREDENTIALS_DIR, 'credentials.json');

const DEFAULT_API_URL = 'https://api.postqueen.ai';
// The OAuth server the MCP connectors sign in through; the CLI registers itself
// there the same way Claude Code and Cursor do, with a loopback callback and PKCE.
const OAUTH_METADATA_PATH = '/.well-known/oauth-authorization-server/mcp-oauth-dynamic';
const LOGIN_TIMEOUT_MS = 10 * 60 * 1000;

// Where the API key lives in the PostQueen app, for every message that asks for one.
export const API_KEY_LOCATION = 'PostQueen > Connections > API key, visible to workspace admins only';

interface StoredCredentials {
  accessToken: string;
  apiUrl: string;
  organizationId?: string;
}

export function loadCredentials(): StoredCredentials | null {
  try {
    if (!existsSync(CREDENTIALS_FILE)) return null;
    const data = JSON.parse(readFileSync(CREDENTIALS_FILE, 'utf-8'));
    if (!data.accessToken) return null;
    return data;
  } catch {
    return null;
  }
}

function saveCredentials(credentials: StoredCredentials): void {
  if (!existsSync(CREDENTIALS_DIR)) {
    mkdirSync(CREDENTIALS_DIR, { recursive: true, mode: 0o700 });
  }
  writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2), { encoding: 'utf-8', mode: 0o600 });
  // Ensure permissions even if file already existed
  chmodSync(CREDENTIALS_FILE, 0o600);
}

function deleteCredentials(): void {
  if (existsSync(CREDENTIALS_FILE)) {
    unlinkSync(CREDENTIALS_FILE);
  }
}

function openBrowser(url: string): void {
  const { exec, spawn } = require('child_process');
  const platform = process.platform;

  if (platform === 'win32') {
    exec(`start "" "${url}"`);
    return;
  }
  // The URL goes in as one argument, so nothing in it reaches a shell. Detached
  // and unref'd, because xdg-open can run the browser in the foreground, and the
  // CLI must not wait for the browser to close before it exits.
  const child = spawn(platform === 'darwin' ? 'open' : 'xdg-open', [url], { stdio: 'ignore', detached: true });
  child.on('error', () => {});
  child.unref();
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// A configured auth server that does not answer: say how to sign in without it
// instead of printing whatever page the host answered with.
function explainNoAuthServer(authServer: string, detail: string): never {
  console.error(`❌ No auth server is answering at ${authServer} (${detail}).\n`);
  console.error('   Sign in through your browser instead, with no --auth-server:');
  console.error('     postqueen auth:login\n');
  console.error(`   Or set POSTQUEEN_API_KEY yourself to the key from ${API_KEY_LOCATION}.`);
  console.error('   Or check the URL you passed with --auth-server or POSTQUEEN_AUTH_SERVER.');
  process.exit(1);
}

// No browser sign-in at this API URL: a self-hosted server older than the OAuth
// routes, or a URL that is not PostQueen. The API key still works there.
function explainNoBrowserLogin(apiUrl: string, detail: string): never {
  console.error(`❌ ${apiUrl} does not offer browser sign-in (${detail}).`);
  console.error(`   Set POSTQUEEN_API_KEY yourself to the key from ${API_KEY_LOCATION}.`);
  process.exit(1);
}

function base64url(buffer: Buffer): string {
  return buffer.toString('base64url');
}

// The page the browser lands on. Only fixed text goes in, never a query value.
function callbackPage(message: string): string {
  return (
    `<!doctype html><meta charset="utf-8"><title>PostQueen CLI</title>` +
    `<body style="font-family:system-ui,sans-serif;text-align:center;padding:4rem 1rem">` +
    `<p>${message}</p></body>`
  );
}

// Signs in through the browser: registers the CLI as a public OAuth client with
// a loopback redirect, sends the user to PostQueen's consent page, and trades
// the code that comes back for a token. The token goes straight from the API to
// ~/.postqueen/credentials.json, so an agent running this never sees it.
async function browserLogin(apiUrl: string, openInBrowser: boolean) {
  let metadata: any;
  try {
    const response = await fetch(`${apiUrl}${OAUTH_METADATA_PATH}`);
    if (!response.ok) {
      explainNoBrowserLogin(apiUrl, `HTTP ${response.status}`);
    }
    metadata = await response.json();
  } catch (error: any) {
    explainNoBrowserLogin(apiUrl, error.message);
  }
  if (!metadata?.authorization_endpoint || !metadata?.token_endpoint || !metadata?.registration_endpoint) {
    explainNoBrowserLogin(apiUrl, 'unexpected response');
  }

  const server: Server = createServer();
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as { port: number };
  const redirectUri = `http://127.0.0.1:${port}/callback`;

  try {
    const registration = await fetch(metadata.registration_endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_name: 'PostQueen CLI',
        redirect_uris: [redirectUri],
        token_endpoint_auth_method: 'none',
        grant_types: ['authorization_code'],
        response_types: ['code'],
      }),
    });
    const client = (await registration.json()) as any;
    if (!registration.ok || !client?.client_id) {
      throw new Error(`PostQueen did not register the CLI (HTTP ${registration.status}${client?.error_description ? `: ${client.error_description}` : ''})`);
    }

    const verifier = base64url(randomBytes(32));
    const state = base64url(randomBytes(16));
    const authorizeUrl = new URL(metadata.authorization_endpoint);
    authorizeUrl.searchParams.set('response_type', 'code');
    authorizeUrl.searchParams.set('client_id', client.client_id);
    authorizeUrl.searchParams.set('redirect_uri', redirectUri);
    authorizeUrl.searchParams.set('code_challenge', base64url(createHash('sha256').update(verifier).digest()));
    authorizeUrl.searchParams.set('code_challenge_method', 'S256');
    authorizeUrl.searchParams.set('state', state);

    console.log('🔐 Sign in to PostQueen and approve the CLI in your browser.\n');
    console.log('  If the page does not open, visit this link on this computer:');
    console.log(`  ${authorizeUrl.href}\n`);
    console.log('  If PostQueen asks you to sign in first, it brings you back to this page afterwards.\n');
    console.log('  Waiting for approval...\n');
    if (openInBrowser) {
      openBrowser(authorizeUrl.href);
    }

    const code = await new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('no approval came within 10 minutes. Run "postqueen auth:login" again')), LOGIN_TIMEOUT_MS);
      server.on('request', (req, res) => {
        const url = new URL(req.url || '/', redirectUri);
        if (url.pathname !== '/callback') {
          res.statusCode = 404;
          res.end();
          return;
        }
        const fail = (message: string) => {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.setHeader('Connection', 'close');
          res.end(callbackPage('Sign-in failed. Go back to the terminal to see why.'));
          clearTimeout(timer);
          reject(new Error(message));
        };
        if (url.searchParams.get('state') !== state) {
          fail('the reply does not belong to this sign-in');
          return;
        }
        // RFC 9207: the server names itself, so a reply from another server is
        // refused, and so is one without a name from a server that sends it
        const iss = url.searchParams.get('iss');
        const issRequired = metadata.authorization_response_iss_parameter_supported && metadata.issuer;
        if (issRequired ? iss !== metadata.issuer : iss && metadata.issuer && iss !== metadata.issuer) {
          fail('the reply came from another server');
          return;
        }
        const error = url.searchParams.get('error');
        const code = url.searchParams.get('code');
        if (error || !code) {
          fail(error === 'access_denied' ? 'access was denied' : error || 'no code came back');
          return;
        }
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Connection', 'close');
        res.end(callbackPage('Approved. You can close this tab and go back to the terminal.'));
        clearTimeout(timer);
        resolve(code);
      });
    });

    const tokenResponse = await fetch(metadata.token_endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: client.client_id,
        code_verifier: verifier,
        redirect_uri: redirectUri,
      }).toString(),
    });
    const token = (await tokenResponse.json()) as any;
    if (!tokenResponse.ok || !token?.access_token) {
      const reason = token?.error_description || token?.error;
      throw new Error(`PostQueen refused the token exchange (HTTP ${tokenResponse.status}${reason ? `: ${reason}` : ''})`);
    }

    saveCredentials({
      accessToken: token.access_token,
      apiUrl,
      organizationId: token.id,
    });

    console.log('✅ Successfully authenticated!');
    console.log(`📁 Credentials saved to ${CREDENTIALS_FILE}`);
    if (token.id) {
      console.log(`🏢 Organization ID: ${token.id}`);
    }
  } catch (error: any) {
    console.error('❌ Sign-in failed:', error.message);
    process.exit(1);
  } finally {
    // A browser may hold its connection open; drop it so the CLI exits now
    server.closeAllConnections?.();
    server.close();
  }
}

export async function authLogin(argv: any) {
  const authServer = argv.authServer || process.env.POSTQUEEN_AUTH_SERVER;

  if (!authServer) {
    const apiUrl = (process.env.POSTQUEEN_API_URL || DEFAULT_API_URL).replace(/\/+$/, '');
    await browserLogin(apiUrl, argv.browser !== false);
    return;
  }

  console.log('🔐 Starting device authorization flow...\n');

  // Step 1: Request a device code from the auth server
  let deviceCode: string;
  let userCode: string;
  let verificationUri: string;
  let expiresIn: number;
  let interval: number;

  try {
    const response = await fetch(`${authServer}/device/code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      explainNoAuthServer(authServer, `HTTP ${response.status}`);
    }

    const data = (await response.json()) as any;
    if (!data?.device_code || !data?.user_code || !data?.verification_uri) {
      explainNoAuthServer(authServer, 'unexpected response');
    }
    deviceCode = data.device_code;
    userCode = data.user_code;
    verificationUri = data.verification_uri;
    expiresIn = data.expires_in;
    interval = data.interval || 5;
  } catch (error: any) {
    explainNoAuthServer(authServer, error.message);
  }

  // Step 2: Show the user code and open browser
  console.log('  Your authorization code:\n');
  console.log(`    ┌─────────────────┐`);
  console.log(`    │    ${userCode}    │`);
  console.log(`    └─────────────────┘\n`);
  console.log(`  Open this URL and enter the code above:`);
  console.log(`  ${verificationUri}\n`);

  if (argv.browser !== false) {
    openBrowser(`${verificationUri}?code=${encodeURIComponent(userCode)}`);
  }

  console.log('  Waiting for authorization...\n');

  // Step 3: Poll for the token
  const deadline = Date.now() + expiresIn * 1000;

  while (Date.now() < deadline) {
    await sleep(interval * 1000);

    try {
      const response = await fetch(`${authServer}/device/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_code: deviceCode }),
      });

      const data = (await response.json()) as any;

      if (response.ok && data.access_token) {
        saveCredentials({
          accessToken: data.access_token,
          apiUrl: data.api_url || 'https://api.postqueen.ai',
          organizationId: data.organization_id,
        });

        console.log('✅ Successfully authenticated!');
        console.log(`📁 Credentials saved to ${CREDENTIALS_FILE}`);
        if (data.organization_id) {
          console.log(`🏢 Organization ID: ${data.organization_id}`);
        }
        return;
      }

      if (data.error === 'authorization_pending') {
        continue;
      }

      if (data.error === 'expired_token') {
        console.error('❌ Authorization expired. Please try again.');
        process.exit(1);
      }

      // Unknown error
      console.error(`❌ Authorization failed: ${data.error}`);
      process.exit(1);
    } catch {
      // Network error during poll: keep trying
      continue;
    }
  }

  console.error('❌ Authorization timed out. Please try again.');
  process.exit(1);
}

export async function authLogout() {
  const creds = loadCredentials();
  if (!creds) {
    console.log('ℹ️  No stored credentials found.');
    return;
  }

  deleteCredentials();
  console.log('✅ Credentials removed from this computer.');
  console.log('   PostQueen still lists the CLI under Connections > Approved Apps until you revoke it there.');
}

export async function authStatus() {
  const envKey = process.env.POSTQUEEN_API_KEY;
  const creds = loadCredentials();

  let apiKey: string | undefined;
  let apiUrl: string;

  if (creds) {
    console.log('🔐 Authentication method: OAuth2');
    console.log(`📡 API URL: ${creds.apiUrl}`);
    console.log(`🔑 Token: ${creds.accessToken.substring(0, 8)}...`);
    if (creds.organizationId) {
      console.log(`🏢 Organization: ${creds.organizationId}`);
    }
    console.log(`📁 Credentials file: ${CREDENTIALS_FILE}`);
    apiKey = creds.accessToken;
    apiUrl = creds.apiUrl;
  } else if (envKey) {
    console.log('🔑 Authentication method: API Key (environment variable)');
    console.log(`🔑 Key: ${envKey.substring(0, 8)}...`);
    apiKey = envKey;
    apiUrl = process.env.POSTQUEEN_API_URL || 'https://api.postqueen.ai';
  } else {
    console.log('❌ Not authenticated.');
    console.log('\nOptions:');
    console.log('  1. Sign in through your browser: postqueen auth:login');
    console.log('  2. API Key: set POSTQUEEN_API_KEY yourself');
    console.log(`     Get it from ${API_KEY_LOCATION}.`);
    process.exit(1);
  }

  // Verify credentials by calling the integrations endpoint
  console.log('\n🔄 Verifying credentials...');
  try {
    const response = await fetch(`${apiUrl}/public/v1/integrations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
    });

    if (response.ok) {
      const integrations = (await response.json()) as any[];
      console.log(`✅ Credentials are valid. ${integrations.length} integration(s) connected.`);
    } else if (response.status === 401 || response.status === 403) {
      console.log('❌ Credentials are expired or invalid. Please re-authenticate.');
      if (creds) {
        console.log('   Run: postqueen auth:login');
      } else {
        console.log('   Update your POSTQUEEN_API_KEY environment variable.');
      }
      process.exit(1);
    } else {
      const error = await response.text();
      console.log(`⚠️  Could not verify credentials (HTTP ${response.status}): ${error}`);
      process.exit(1);
    }
  } catch (error: any) {
    console.log(`⚠️  Could not reach API to verify credentials: ${error.message}`);
    process.exit(1);
  }
}
