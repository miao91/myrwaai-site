/**
 * src/components/waitlist/WaitlistFab.tsx
 * Floating "Join Waitlist" action button that opens the form dialog.
 * - Placed at bottom-right to avoid touching existing headers.
 */

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { useI18n } from '../../i18n'
import WaitlistDialog from './WaitlistDialog'

export default function WaitlistFab() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-emerald-600 text-white px-4 py-2 shadow-lg hover:bg-emerald-700 transition"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">{t('waitlist.join')}</span>
      </button>
      {open && <WaitlistDialog onClose={() => setOpen(false)} />}
    </>
  )
}
