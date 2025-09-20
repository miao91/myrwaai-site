/**
 * components/sections/Hero.tsx
 * Hero section with brand headline, description, and primary CTAs.
 */

import React from 'react'
import { Rocket, Sparkles } from 'lucide-react'

/**
 * Hero
 * A light, friendly gradient-backed hero introducing the brand in Chinese with clear actions.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-emerald-50 to-white">
      {/* soft radial accents */}
      <div className="absolute inset-0 opacity-70">
        <div className="pointer-events-none absolute -inset-[15%] rounded-full blur-3xl bg-[radial-gradient(circle_at_25%_20%,rgba(56,189,248,0.25),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(16,185,129,0.20),transparent_50%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 py-24 md:py-32 text-center text-slate-900">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs md:text-sm text-emerald-700">
          <Sparkles className="h-4 w-4" />
          <span>让每个人都可以接触 RWA</span>
        </div>

        <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight">
          myrwa.ai
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-slate-600">
          提供最新的 RWA 地区政策与咨询，帮助所有对 RWA 感兴趣的人快速上手与保持更新。
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href="#waitlist"
            className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-5 py-2.5 text-white font-medium hover:bg-emerald-700 transition-colors"
          >
            <Rocket className="h-4 w-4" />
            加入候补名单
          </a>
          <a
            href="#showcase"
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-5 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            了解预览
          </a>
        </div>

        <div className="mt-14 mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
          <img src="https://pub-cdn.sider.ai/u/U0JJHRLG54/web-coder/68ceac095375a0a7f3dc1052/resource/ee3cfcc0-eec1-4769-888e-e5d5ddbe5d74.jpg" className="object-cover w-full h-48 rounded-xl border border-slate-200" />
          <img src="https://pub-cdn.sider.ai/u/U0JJHRLG54/web-coder/68ceac095375a0a7f3dc1052/resource/9c20b8db-80da-48a5-be2b-21a661a1b830.jpg" className="object-cover w-full h-48 rounded-xl border border-slate-200" />
          <img src="https://pub-cdn.sider.ai/u/U0JJHRLG54/web-coder/68ceac095375a0a7f3dc1052/resource/1e7ef5a5-fd56-430f-bb2a-1478ce08b645.jpg" className="object-cover w-full h-48 rounded-xl border border-slate-200" />
        </div>
      </div>
    </section>
  )
}
