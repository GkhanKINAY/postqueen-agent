import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import * as plugin from '../lib/index.js'
import { SKILL_CONTENT, SKILL_NAME } from '../lib/skill.js'

const here = dirname(fileURLToPath(import.meta.url))

test('named exports only, with a stable plugin name', () => {
  assert.equal(plugin.name, 'dsh-postqueen')
  assert.equal(typeof plugin.apply, 'function')
  assert.equal('default' in plugin, false)
})

test('resolveConnection reads the key from the configured env var', () => {
  const conn = plugin.resolveConnection(
    { apiKeyEnv: 'POSTQUEEN_API_KEY', apiKey: '', baseUrl: 'https://api.postqueen.ai' },
    { POSTQUEEN_API_KEY: 'abc123' },
  )
  assert.equal(conn.url, 'https://api.postqueen.ai/mcp')
  assert.deepEqual(conn.headers, { Authorization: 'Bearer abc123' })
  assert.equal(conn.configured, true)
  assert.equal(conn.source, 'env.POSTQUEEN_API_KEY')
})

test('resolveConnection prefers an inline key and normalizes self-hosted URLs', () => {
  const conn = plugin.resolveConnection(
    { apiKeyEnv: 'POSTQUEEN_API_KEY', apiKey: 'inline', baseUrl: 'https://postqueen.example.com/' },
    { POSTQUEEN_API_KEY: 'ignored' },
  )
  assert.equal(conn.url, 'https://postqueen.example.com/mcp')
  assert.deepEqual(conn.headers, { Authorization: 'Bearer inline' })
  assert.equal(conn.source, 'config.apiKey')
})

test('resolveConnection reports an unconfigured key without headers', () => {
  const conn = plugin.resolveConnection({ apiKeyEnv: 'POSTQUEEN_API_KEY' }, {})
  assert.equal(conn.configured, false)
  assert.deepEqual(conn.headers, {})
})

test('apply provides ctx.postqueen and registers the skill', () => {
  const provided = {}
  const registered = []
  const ctx = {
    logger: { info() {}, warn() {} },
    provide(key, value) { provided[key] = value },
    inject(deps, cb) {
      assert.deepEqual(deps, ['skills'])
      cb({ skills: { register(skill) { registered.push(skill); return () => {} } } })
    },
  }
  plugin.apply(ctx, { apiKey: 'k' })
  assert.equal(provided.postqueen.url, 'https://api.postqueen.ai/mcp')
  assert.equal(provided.postqueen.headers.Authorization, 'Bearer k')
  assert.equal(provided.postqueen.configured, true)
  assert.equal(registered.length, 1)
  assert.equal(registered[0].name, SKILL_NAME)
  assert.equal(registered[0].content, SKILL_CONTENT)
  assert.match(registered[0].content, /mcp__postqueen__integrationSchedulePostTool/)
})

test('apply skips the skill when disabled', () => {
  let injected = false
  const ctx = { logger: { info() {}, warn() {} }, provide() {}, inject() { injected = true } }
  plugin.apply(ctx, { apiKey: 'k', skill: false })
  assert.equal(injected, false)
})

test('bundle manifest points at the patch and the patch wires both rows', () => {
  const pkg = JSON.parse(readFileSync(join(here, '..', 'package.json'), 'utf8'))
  assert.equal(pkg.dsh.bundle.patch, './cordis.patch.yml')
  const patch = readFileSync(join(here, '..', 'cordis.patch.yml'), 'utf8')
  assert.match(patch, /name: dsh-postqueen/)
  assert.match(patch, /name: '@deepseek-ai\/dsh-mcp-client'/)
  assert.match(patch, /serverName: postqueen/)
  assert.match(patch, /url: !!js ctx\.postqueen\.url/)
})
