/**
 * components/common/Logo.tsx
 * Simple brand logo for myrwa.ai with a friendly sky→emerald gradient accent.
 */

import React from 'react'

/**
 * Logo
 * Displays the brand name with a small gradient badge. Accepts optional size.
 */
export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const textSize =
    size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl md:text-3xl' : 'text-xl'
  const badgeSize =
    size === 'sm' ? 'h-2 w-2' : size === 'lg' ? 'h-3.5 w-3.5' : 'h-3 w-3'

  return (
    <div className="inline-flex items-center gap-2 select-none">
      <span className={`font-semibold tracking-tight ${textSize}`}>myrwa.ai</span>
      <span
        className={`${badgeSize} rounded-full bg-gradient-to-tr from-sky-500 via-emerald-500 to-teal-500`}
        aria-hidden="true"
      />
    </div>
  )
}
