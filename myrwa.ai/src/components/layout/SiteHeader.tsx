/**
 * components/layout/SiteHeader.tsx
 * Sticky site header with logo and anchor navigation.
 */

import React from 'react'
import { Logo } from '../common/Logo'

/**
 * SiteHeader
 * Displays a translucent sticky header with brand logo and on-page anchors.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <a href="#" className="hover:opacity-90 transition-opacity" aria-label="返回顶部">
            <Logo size="md" />
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">
              功能亮点
            </a>
            <a href="#regions" className="text-slate-600 hover:text-slate-900 transition-colors">
              地区
            </a>
            <a href="#showcase" className="text-slate-600 hover:text-slate-900 transition-colors">
              预览
            </a>
            <a href="#trading" className="text-slate-600 hover:text-slate-900 transition-colors">
              交易
            </a>
            <a
              href="#waitlist"
              className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700 transition-colors"
            >
              加入候补
            </a>
          </nav>
          <a
            href="#waitlist"
            className="md:hidden inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700 transition-colors text-sm"
          >
            候补
          </a>
        </div>
      </div>
    </header>
  )
}
