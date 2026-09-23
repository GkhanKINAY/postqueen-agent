// Runs the built CLI (dist/index.js) against a local stand-in for the PostQueen
// API, and checks what it prints, how it exits and what it sends.
import { test, before, after, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
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

before(async () => {
  server = createServer((req, res) => {
    let body = ''
    req.on('data', (chunk) => (body += chunk))
    req.on('end', () => {
      const url = new URL(req.url, 'http://stub')
      requests.push({ method: req.method, path: url.pathname, query: url.searchParams, body })
      res.setHeader('Content-Type', 'application/json')
      if (req.method === 'GET' && url.pathname === '/public/v1/posts') {
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

test('auth:login points to the API key and exits 1 without calling out', async () => {
  const withoutKey = await run(['auth:login'], { POSTQUEEN_API_KEY: undefined })
  assert.equal(withoutKey.code, 1)
  assert.equal(
    withoutKey.stderr,
    '❌ PostQueen uses an API key: set POSTQUEEN_API_KEY to the key from PostQueen > Connections > API Keys, visible to workspace admins only.\n'
  )

  const withKey = await run(['auth:login'])
  assert.equal(withKey.code, 1)
  assert.equal(
    withKey.stderr,
    '❌ PostQueen uses an API key, and POSTQUEEN_API_KEY is already set: run "postqueen auth:status" to check it.\n'
  )
  assert.equal(requests.length, 0)
})

test('auth:login --auth-server pointed at the API says no auth server answers', async () => {
  const { code, stderr } = await run(['auth:login', '--auth-server', apiUrl])
  assert.equal(code, 1)
  assert.match(stderr, /No auth server is answering at .* \(HTTP 404\)/)
  assert.match(stderr, /export POSTQUEEN_API_KEY=/)
})
