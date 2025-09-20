/**
 * src/components/i18n/LanguageSwitcherFloating.tsx
 * A minimal floating language switcher at the top-right corner.
 * - Uses basic HTML to avoid coupling with any UI lib.
 * - High contrast button; persists selection.
 */

import React, { useEffect, useRef, useState } from 'react'
import { Globe } from 'lucide-react'
import { setLanguage, useI18n } from '../../i18n'

/** LanguageSwitcherFloating: top-right dropdown for language selection. */
export default function LanguageSwitcherFloating() {
  const { i18n, t } = useI18n()
  const [open, setOpen] = useState(false)
  const popRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!popRef.current) return
      if (!popRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  return (
    <div className="fixed right-4 top-4 z-50" ref={popRef}>
      <button
        aria-label="Language"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-black/80 text-white px-3 py-1.5 shadow-lg hover:bg-black transition"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm">{i18n.language === 'zh' ? '中文' : 'EN'}</span>
      </button>
      {open && (
        <div className="mt-2 w-36 rounded-lg border border-black/10 bg-white/95 backdrop-blur p-1 shadow-xl">
          <LangItem code="en" label={t('language.en')} active={i18n.language === 'en'} />
          <LangItem code="zh" label={t('language.zh')} active={i18n.language === 'zh'} />
        </div>
      )}
    </div>
  )
}

/** Item row for language selection. */
function LangItem({ code, label, active }: { code: 'en' | 'zh'; label: string; active: boolean }) {
  return (
    <button
      onClick={() => setLanguage(code)}
      className={`w-full text-left rounded-md px-3 py-2 text-sm ${
        active ? 'bg-black text-white' : 'hover:bg-black/5'
      }`}
    >
      {label}
    </button>
  )
}
