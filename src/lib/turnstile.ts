/**
 * src/lib/turnstile.ts
 * Lightweight helper to obtain a Cloudflare Turnstile token (optional).
 * - If window.TURNSTILE_SITE_KEY is missing, resolves to null (feature off).
 * - Loads script on demand and invokes invisible challenge.
 */

declare global {
  interface Window {
    turnstile?: any
    TURNSTILE_SITE_KEY?: string
  }
}

/** Load Turnstile script once. */
function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.turnstile) return resolve()
    const key = window.TURNSTILE_SITE_KEY
    if (!key) return resolve() // Feature disabled.
    const el = document.createElement('script')
    el.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    el.async = true
    el.defer = true
    el.onload = () => resolve()
    el.onerror = () => reject(new Error('Turnstile script failed to load'))
    document.head.appendChild(el)
  })
}

/** Get a token via invisible widget. Returns null if disabled. */
export async function getTurnstileToken(): Promise<string | null> {
  await loadScript()
  if (!window.turnstile || !window.TURNSTILE_SITE_KEY) return null
  return new Promise((resolve) => {
    const container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)
    // @ts-ignore
    window.turnstile.render(container, {
      sitekey: window.TURNSTILE_SITE_KEY,
      size: 'invisible',
      callback: (token: string) => {
        resolve(token)
        container.remove()
      },
      'error-callback': () => {
        resolve(null)
        container.remove()
      },
    })
    // @ts-ignore
    window.turnstile.execute(container)
  })
}
