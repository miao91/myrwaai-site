/**
 * components/layout/SiteFooter.tsx
 * Simple footer with copyright and minimal links (Chinese).
 */

import React from 'react'
import { Logo } from '../common/Logo'

/**
 * SiteFooter
 * Renders a minimal, accessible footer section.
 */
export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-slate-200 bg-slate-50" id="contact">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="sr-only">myrwa.ai</span>
          </div>
          <div className="text-sm text-slate-600">
            © {year} myrwa.ai. 保留所有权利。
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a
              href="mailto:hello@myrwa.ai?subject=Hello%20from%20myrwa.ai"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              hello@myrwa.ai
            </a>
            <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">
              功能亮点
            </a>
            <a href="#showcase" className="text-slate-600 hover:text-slate-900 transition-colors">
              预览
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
