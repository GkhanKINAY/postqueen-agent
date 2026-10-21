// Runs the built CLI (dist/index.js) against a local stand-in for the PostQueen
// API, and checks what it prints, how it exits and what it sends.
import { test, before, after, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdtempSync, existsSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const cli = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'index.js')
// An empty home, so credentials stored by a real auth:login are never read
const home = mkdtempSync(join(tmpdir(), 'postqueen-cli-test-'))
const date = '2026-10-01T10:00:00Z'

let server
let apiUrl
let requests = []
// The stand-in serves PostQueen's OAuth routes only when a test turns them on
let oauth = null

before(async () => {
  server = createServer((req, res) => {
    let body = ''
    req.on('data', (chunk) => (body += chunk))
    req.on('end', () => {
      const url = new URL(req.url, 'http://stub')
      requests.push({ method: req.method, path: url.pathname, query: url.searchParams, body })
      res.setHeader('Content-Type', 'application/json')
      if (oauth && req.method === 'GET' && url.pathname === '/.well-known/oauth-authorization-server/mcp-oauth-dynamic') {
        res.end(JSON.stringify({
          issuer: `${apiUrl}/mcp-oauth-dynamic`,
          authorization_endpoint: `${apiUrl}/oauth/authorize`,
          token_endpoint: `${apiUrl}/oauth/token`,
          registration_endpoint: `${apiUrl}/oauth/register`,
          authorization_response_iss_parameter_supported: true,
        }))
      } else if (oauth && req.method === 'POST' && url.pathname === '/oauth/register') {
        oauth.registration = JSON.parse(body)
        res.statusCode = 201
        res.end(JSON.stringify({ client_id: 'pcd_test' }))
      } else if (oauth && req.method === 'POST' && url.pathname === '/oauth/token') {
        const form = new URLSearchParams(body)
        if (oauth.refuseToken) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'invalid_grant', error_description: 'Code has expired' }))
          return
        }
        const challenge = createHash('sha256').update(form.get('code_verifier') || '').digest('base64url')
        const valid =
          form.get('grant_type') === 'authorization_code' &&
          form.get('code') === 'code-1' &&
          form.get('client_id') === 'pcd_test' &&
          form.get('redirect_uri') === oauth.redirectUri &&
          challenge === oauth.challenge
        res.statusCode = valid ? 200 : 400
        res.end(JSON.stringify(valid ? { access_token: 'pos_test', token_type: 'bearer', id: 'org-1' } : { error: 'invalid_grant' }))
      } else if (req.method === 'GET' && url.pathname === '/public/v1/posts') {
        res.end(JSON.stringify({ posts: [] }))
      } else if (req.method === 'POST' && url.pathname === '/public/v1/posts') {
        res.statusCode = 201
        res.end(JSON.stringify([{ postId: 'post-1' }]))
      } else {
        // Like PostQueen's API, which has no /device/* routes
        res.statusCode = 404
        res.end(JSON.stringify({ message: `Cannot ${req.method} ${url.pathname}`, statusCode: 404 }))
      }
    })
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  apiUrl = `http://127.0.0.1:${server.address().port}`
})

after(() => server.close())

beforeEach(() => {
  requests = []
  oauth = null
})

function run(args, extraEnv = {}) {
  const env = {
    PATH: process.env.PATH,
    HOME: home,
    USERPROFILE: home,
    POSTQUEEN_API_URL: apiUrl,
    POSTQUEEN_API_KEY: 'test-key',
    ...extraEnv,
  }
  for (const key of Object.keys(env)) {
    if (env[key] === undefined) delete env[key]
  }
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [cli, ...args], { env })
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (chunk) => (stdout += chunk))
    child.stderr.on('data', (chunk) => (stderr += chunk))
    child.on('close', (code) => resolve({ code, stdout, stderr }))
  })
}

function sentContents() {
  const post = requests.find((r) => r.method === 'POST' && r.path === '/public/v1/posts')
  return JSON.parse(post.body).posts[0].value.map((v) => v.content)
}

test('a mistyped command fails with one line and exit 1', async () => {
  const { code, stdout, stderr } = await run(['post:create'])
  assert.equal(code, 1)
  assert.equal(stdout, '')
  assert.equal(stderr, '❌ Unknown command: post:create. Run "postqueen --help" for usage.\n')
})

test('an unknown flag fails instead of falling back to a default', async () => {
  const { code, stderr } = await run(['posts:list', '--startdate', '2020-01-01'])
  assert.equal(code, 1)
  assert.equal(stderr, '❌ Unknown argument: startdate. Run "postqueen posts:list --help" for usage.\n')
  assert.equal(requests.length, 0)
})

test('kebab-case and camelCase forms of a flag both still work', async () => {
  for (const flag of ['--start-date', '--startDate']) {
    requests = []
    const { code } = await run(['posts:list', flag, '2020-01-01T00:00:00Z'])
    assert.equal(code, 0, flag)
    assert.equal(requests[0].query.get('startDate'), '2020-01-01T00:00:00Z', flag)
  }
})

test('a validation error prints one line, not the help', async () => {
  const { code, stderr } = await run(['posts:create', '-i', 'int-1', '-s', date])
  assert.equal(code, 1)
  assert.equal(stderr, '❌ Either --content or --json is required. Run "postqueen posts:create --help" for usage.\n')
})

test('repeating a single-value flag fails cleanly', async () => {
  const { code, stderr } = await run(['posts:create', '-c', 'hi', '-s', date, '-i', 'int-1', '-i', 'int-2'])
  assert.equal(code, 1)
  assert.equal(stderr, '❌ --integrations was given more than once, but takes one value. Run "postqueen posts:create --help" for usage.\n')
  assert.equal(requests.length, 0)
})

test('-c and -m still repeat, once per post and comment', async () => {
  const { code } = await run(['posts:create', '-c', 'main', '-m', 'a.png', '-c', 'reply', '-m', 'b.png', '-s', date, '-i', 'int-1'])
  assert.equal(code, 0)
  assert.deepEqual(sentContents(), ['main', 'reply'])
})

test('content that starts with "-" is taken as content', async () => {
  const { code } = await run(['posts:create', '-c', '-hello', '-c', '- item', '-s', date, '-i', 'int-1'])
  assert.equal(code, 0)
  assert.deepEqual(sentContents(), ['-hello', '- item'])
})

test('an empty integration ID is caught before the API call', async () => {
  const { code, stderr } = await run(['posts:create', '-c', 'hi', '-s', date, '-i', 'int-1,'])
  assert.equal(code, 1)
  assert.match(stderr, /^❌ Empty integration ID in --integrations "int-1,"\n/)
  assert.equal(requests.length, 0)
})

// Runs auth:login in its own empty home, answers the consent page the way the
// browser would once the user approves, and returns how the CLI finished.
function signIn(reply) {
  const loginHome = mkdtempSync(join(tmpdir(), 'postqueen-cli-login-'))
  const child = spawn(process.execPath, [cli, 'auth:login', '--no-browser'], {
    env: { PATH: process.env.PATH, HOME: loginHome, USERPROFILE: loginHome, POSTQUEEN_API_URL: apiUrl },
  })
  let stdout = ''
  let stderr = ''
  let replied
  child.stderr.on('data', (chunk) => (stderr += chunk))
  child.stdout.on('data', (chunk) => {
    stdout += chunk
    const link = /(http:\/\/127\.0\.0\.1:\d+\/oauth\/authorize\S+)/.exec(stdout)?.[1]
    if (!link || replied || !stdout.includes('Waiting for approval')) return
    const params = new URL(link).searchParams
    oauth.redirectUri = params.get('redirect_uri')
    oauth.challenge = params.get('code_challenge')
    const callback = new URL(oauth.redirectUri)
    // Like PostQueen, which names itself in every reply unless a test says otherwise
    const answer = { iss: `${apiUrl}/mcp-oauth-dynamic`, ...reply(params) }
    for (const [key, value] of Object.entries(answer)) if (value !== undefined) callback.searchParams.set(key, value)
    replied = fetch(callback).then((response) => (oauth.callbackStatus = response.status))
  })
  const closed = new Promise((resolve) => child.on('close', resolve))
  // Wait for the browser's request too: the CLI can exit before its reply lands
  return closed.then(async (code) => {
    await replied
    const file = join(loginHome, '.postqueen', 'credentials.json')
    return { code, stdout, stderr, credentials: existsSync(file) ? JSON.parse(readFileSync(file, 'utf-8')) : null }
  })
}

test('auth:login signs in through the browser and stores the token', async () => {
  oauth = {}
  const { code, stdout, credentials } = await signIn((params) => ({ code: 'code-1', state: params.get('state') }))
  assert.equal(code, 0)
  assert.equal(oauth.callbackStatus, 200)
  assert.deepEqual(oauth.registration.redirect_uris, [oauth.redirectUri])
  assert.equal(oauth.registration.token_endpoint_auth_method, 'none')
  assert.match(oauth.redirectUri, /^http:\/\/127\.0\.0\.1:\d+\/callback$/)
  assert.deepEqual(credentials, { accessToken: 'pos_test', apiUrl, organizationId: 'org-1' })
  assert.match(stdout, /✅ Successfully authenticated!/)
  // The token is written to the file, never printed where an agent reads it
  assert.doesNotMatch(stdout, /pos_test/)
})

test('auth:login refuses a reply that does not belong to its sign-in', async () => {
  oauth = {}
  const { code, stderr, credentials } = await signIn(() => ({ code: 'code-1', state: 'forged' }))
  assert.equal(code, 1)
  assert.equal(oauth.callbackStatus, 400)
  assert.equal(stderr, '❌ Sign-in failed: the reply does not belong to this sign-in\n')
  assert.equal(credentials, null)
})

test('auth:login refuses a reply that names another server', async () => {
  oauth = {}
  const { code, stderr, credentials } = await signIn((params) => ({
    code: 'code-1',
    state: params.get('state'),
    iss: 'https://evil.example/mcp-oauth-dynamic',
  }))
  assert.equal(code, 1)
  assert.equal(stderr, '❌ Sign-in failed: the reply came from another server\n')
  assert.equal(credentials, null)
})

test('auth:login refuses an unnamed reply from a server that names itself', async () => {
  oauth = {}
  const { code, stderr, credentials } = await signIn((params) => ({ code: 'code-1', state: params.get('state'), iss: undefined }))
  assert.equal(code, 1)
  assert.equal(stderr, '❌ Sign-in failed: the reply came from another server\n')
  assert.equal(credentials, null)
})

test('auth:login says so when the user denies access', async () => {
  oauth = {}
  const { code, stderr, credentials } = await signIn((params) => ({ error: 'access_denied', state: params.get('state') }))
  assert.equal(code, 1)
  assert.equal(oauth.callbackStatus, 400)
  assert.equal(stderr, '❌ Sign-in failed: access was denied\n')
  assert.equal(credentials, null)
})

test('auth:login reports a refused token exchange with its reason', async () => {
  oauth = { refuseToken: true }
  const { code, stderr, credentials } = await signIn((params) => ({ code: 'code-1', state: params.get('state') }))
  assert.equal(code, 1)
  assert.equal(stderr, '❌ Sign-in failed: PostQueen refused the token exchange (HTTP 400: Code has expired)\n')
  assert.equal(credentials, null)
})

test('auth:login on a server without browser sign-in points to the API key', async () => {
  const { code, stderr } = await run(['auth:login'])
  assert.equal(code, 1)
  assert.equal(
    stderr,
    `❌ ${apiUrl} does not offer browser sign-in (HTTP 404).\n` +
      '   Set POSTQUEEN_API_KEY yourself to the key from PostQueen > Connections > API key, visible to workspace admins only.\n'
  )
})

test('auth:login --auth-server pointed at the API says no auth server answers', async () => {
  const { code, stderr } = await run(['auth:login', '--auth-server', apiUrl])
  assert.equal(code, 1)
  assert.match(stderr, /No auth server is answering at .* \(HTTP 404\)/)
  assert.match(stderr, /postqueen auth:login\n/)
})
