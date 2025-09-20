/**
 * functions/api/subscribe.ts
 * Cloudflare Pages Function: Waitlist subscription endpoint.
 * - POST: { name, email, role, region, interests?, turnstileToken? }
 * - Writes to KV (binding: MYRWA_WAITLIST) with email de-duplication.
 * - Optional Turnstile verification (env.TURNSTILE_SECRET_KEY).
 * - Basic IP rate-limit (cooldown ~60s).
 */

export interface Env {
  MYRWA_WAITLIST: KVNamespace
  TURNSTILE_SECRET_KEY?: string
}

type Payload = {
  name: string
  email: string
  role: 'builder' | 'investor' | 'researcher' | 'other'
  region: 'global' | 'us' | 'eu' | 'cn' | 'other'
  interests?: Array<'policy' | 'compliance' | 'tools' | 'learning'>
  turnstileToken?: string
}

const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' }

/** Normalize email key. */
function normEmail(email: string) {
  return email.trim().toLowerCase()
}

/** Basic email regexp for server-side guard. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Respond helper. */
function j(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), { headers: JSON_HEADERS, ...init })
}

/** Verify Turnstile token if secret key and token present. */
async function verifyTurnstile(secret: string | undefined, token: string | undefined, ip?: string) {
  if (!secret || !token) return true
  const resp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret, response: token, remoteip: ip || '' }),
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
  })
  const data = (await resp.json()) as { success: boolean }
  return !!data.success
}

/** POST /api/subscribe */
export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx
  const ip =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('x-forwarded-for') ||
    ''

  let payload: Payload | null = null
  try {
    payload = (await request.json()) as Payload
  } catch {
    return j({ ok: false, message: 'Invalid JSON' }, { status: 400 })
  }

  if (!payload || !EMAIL_RE.test(payload.email || '')) {
    return j({ ok: false, message: 'Invalid email' }, { status: 400 })
  }

  // Simple IP cooldown to reduce abuse
  const cdKey = `cd:${ip}`
  const cooldown = await env.MYRWA_WAITLIST.get(cdKey)
  if (cooldown) {
    return j({ ok: false, message: 'Too many requests' }, { status: 429 })
  }

  // Optional Turnstile verification
  const ok = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, payload.turnstileToken, ip)
  if (!ok) return j({ ok: false, message: 'Turnstile verification failed' }, { status: 400 })

  const emailKey = `email:${normEmail(payload.email)}`
  const exists = await env.MYRWA_WAITLIST.get(emailKey)
  if (exists) {
    return j({ ok: true, message: 'Exists' }, { status: 409 })
  }

  const now = Date.now()
  const rec = {
    ...payload,
    email: normEmail(payload.email),
    ip,
    ua: ctx.request.headers.get('user-agent') || '',
    ts: now,
  }
  await env.MYRWA_WAITLIST.put(emailKey, JSON.stringify(rec))

  // Cooldown 60s
  await env.MYRWA_WAITLIST.put(cdKey, '1', { expirationTtl: 60 })

  return j({ ok: true })
}

/** OPTIONS (CORS preflight for safety; same-origin apps won't need it). */
export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'content-type',
    },
  })
}
