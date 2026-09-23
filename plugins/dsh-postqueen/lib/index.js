/**
 * dsh-postqueen provider plugin.
 *
 * Provides the `postqueen` service so the bundle's cordis.patch.yml can point one
 * `@deepseek-ai/dsh-mcp-client` row at the PostQueen MCP server without putting
 * the API key in configuration: the mcp-client row injects `postqueen` and reads
 * `ctx.postqueen.url` / `ctx.postqueen.headers` in its `!!js` config.
 *
 * It also registers the `postqueen` skill on `ctx.skills` (when a skills service
 * is mounted) so the agent knows the integrationList → integrationSchema →
 * integrationSchedulePostTool workflow and the HTML content rules.
 *
 * Named exports only (no default export): a stray default export makes the
 * Loader collapse the namespace and drop `inject`/`apply`.
 */
import z from '@deepseek-ai/schemastery'
import { SKILL_CONTENT, SKILL_DESCRIPTION, SKILL_NAME } from './skill.js'

/** Stable Cordis plugin name. */
export const name = 'dsh-postqueen'

/** Service provided by this plugin and injected by the mcp-client row. */
export const POSTQUEEN_SERVICE = 'postqueen'

/** Default PostQueen Cloud API host; self-hosted instances override `baseUrl`. */
export const DEFAULT_BASE_URL = 'https://api.postqueen.ai'

export const Config = z.object({
  /** Environment variable that holds the PostQueen API key. */
  apiKeyEnv: z.string().default('POSTQUEEN_API_KEY'),
  /** Inline API key. Prefer `apiKeyEnv`; this exists for patch-level overrides. */
  apiKey: z.string().role('secret').default(''),
  /** PostQueen API host. The MCP endpoint is `<baseUrl>/mcp`. */
  baseUrl: z.string().default(DEFAULT_BASE_URL),
  /** Register the `postqueen` workflow skill on `ctx.skills`. */
  skill: z.boolean().default(true),
})

/**
 * Resolve the connection values from config and environment.
 *
 * @param {object} config - validated plugin config.
 * @param {Record<string, string | undefined>} env - environment to read the key from.
 * @returns {{ url: string, headers: Record<string, string>, configured: boolean, source: string }}
 */
export function resolveConnection(config, env = process.env) {
  const base = String(config?.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '')
  const url = base.endsWith('/mcp') ? base : `${base}/mcp`
  const envName = String(config?.apiKeyEnv || 'POSTQUEEN_API_KEY')
  const inline = String(config?.apiKey || '').trim()
  const fromEnv = String(env[envName] || '').trim()
  const key = inline || fromEnv
  const source = inline ? 'config.apiKey' : fromEnv ? `env.${envName}` : 'none'
  return {
    url,
    headers: key ? { Authorization: `Bearer ${key}` } : {},
    configured: key.length > 0,
    source,
  }
}

/**
 * @param {object} ctx - plugin context.
 * @param {object} config - validated plugin config.
 */
export function apply(ctx, config) {
  const cfg = Config(config ?? {})
  const conn = resolveConnection(cfg)
  const log = ctx.logger ?? console

  if (conn.configured) {
    log.info?.(`dsh-postqueen: PostQueen MCP endpoint ${conn.url} (key from ${conn.source})`)
  } else {
    log.warn?.(
      `dsh-postqueen: no PostQueen API key found. Set ${cfg.apiKeyEnv} (PostQueen → Settings → API Keys) ` +
        `or \`apiKey\` on the \`postqueen\` row; the postqueen-mcp row will connect to ${conn.url} without credentials and register no tools.`,
    )
  }

  // Plain, unfrozen values on purpose: the mcp-client row validates the
  // interpolated `headers` with schemastery, which rejects frozen objects.
  // The getter hands every evaluation its own copy.
  ctx.provide(POSTQUEEN_SERVICE, {
    url: conn.url,
    get headers() {
      return { ...conn.headers }
    },
    configured: conn.configured,
  })

  if (cfg.skill) {
    ctx.inject(['skills'], (sctx) => {
      if (typeof sctx.skills?.register !== 'function') return
      sctx.skills.register({
        name: SKILL_NAME,
        description: SKILL_DESCRIPTION,
        content: SKILL_CONTENT,
        source: 'runtime',
        invocation: { modelInvocable: true, userInvocable: true },
      })
    })
  }
}
