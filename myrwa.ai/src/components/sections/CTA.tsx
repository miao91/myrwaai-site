/**
 * components/sections/CTA.tsx
 * Closing call-to-action with an email capture form (mailto based).
 */

import React from 'react'
import { useState } from 'react'
import { Mail } from 'lucide-react'

/**
 * buildMailto
 * Creates a mailto URL for simple waitlist submission without a backend.
 */
function buildMailto(email: string) {
  const target = 'hello@myrwa.ai'
  const subject = encodeURIComponent('myrwa.ai 候补名单')
  const body = encodeURIComponent(`请将我加入候补名单。\n\n邮箱: ${email || '(未填写)'}\n来源: myrwa.ai`)
  return `mailto:${target}?subject=${subject}&body=${body}`
}

/**
 * CTA
 * Provides a simple email field and buttons to join the waitlist or contact directly.
 */
export function CTA() {
  const [email, setEmail] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = buildMailto(email)
  }

  return (
    <section id="waitlist" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="rounded-2xl bg-gradient-to-tr from-emerald-600 to-sky-600 p-8 md:p-12 text-white">
          <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
            订阅更新，第一时间获得上线通知
          </h3>
          <p className="mt-2 text-white/90 max-w-2xl">
            留下你的邮箱，我们会在功能就绪时第一时间通知你。没有垃圾邮件，只有有用的信息。
          </p>

          <form onSubmit={onSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              inputMode="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder:text-white/70 outline-none focus:ring-2 focus:ring-white/50"
              aria-label="你的邮箱"
              required
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-2.5 text-emerald-700 font-medium hover:bg-slate-100 transition-colors"
            >
              <Mail className="h-4 w-4" />
              通知我
            </button>
          </form>

          <div className="mt-4 text-sm text-white/90">
            也可直接邮件联系：{' '}
            <a
              href="mailto:hello@myrwa.ai?subject=Hello%20from%20myrwa.ai"
              className="underline hover:text-white"
            >
              hello@myrwa.ai
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
