/**
 * src/components/waitlist/WaitlistDialog.tsx
 * Accessible modal dialog containing the waitlist form.
 * - Uses react-hook-form + zod for validation.
 * - On submit, POSTs to /api/subscribe (Pages Function).
 * - If Turnstile is configured, attaches token automatically.
 */

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useI18n } from '../../i18n'
import { getTurnstileToken } from '../../lib/turnstile'

/** Form schema for basic validation. */
const WaitlistFormSchema = z.object({
  name: z.string().min(1).max(60),
  email: z.string().email(),
  role: z.enum(['builder', 'investor', 'researcher', 'other']),
  region: z.enum(['global', 'us', 'eu', 'cn', 'other']),
  interests: z.array(z.enum(['policy', 'compliance', 'tools', 'learning'])).optional().default([]),
})
type WaitlistForm = z.infer<typeof WaitlistFormSchema>

/** Props for dialog control. */
export default function WaitlistDialog({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [onClose])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WaitlistForm>({
    resolver: zodResolver(WaitlistFormSchema),
    defaultValues: { role: 'builder', region: 'global', interests: [] },
  })

  async function onSubmit(values: WaitlistForm) {
    try {
      const token = await getTurnstileToken()
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...values, turnstileToken: token ?? undefined }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.status === 409) {
        toast.info(t('waitlist.exists'))
        onClose()
        return
      }
      if (!res.ok) throw new Error((data && data.message) || 'Request failed')
      toast.success(t('waitlist.success'))
      onClose()
    } catch (err) {
      console.error(err)
      toast.error(t('waitlist.failure'))
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{t('waitlist.title')}</h2>
          <p className="text-sm text-gray-600 mt-1">{t('waitlist.desc')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('waitlist.name')}</label>
            <input
              {...register('name')}
              type="text"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('waitlist.email')}</label>
            <input
              {...register('email')}
              type="email"
              inputMode="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {t('waitlist.invalidEmail')}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('waitlist.role')}</label>
              <select
                {...register('role')}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="builder">{t('roles.builder')}</option>
                <option value="investor">{t('roles.investor')}</option>
                <option value="researcher">{t('roles.researcher')}</option>
                <option value="other">{t('roles.other')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t('waitlist.region')}</label>
              <select
                {...register('region')}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="global">{t('regions.global')}</option>
                <option value="us">{t('regions.us')}</option>
                <option value="eu">{t('regions.eu')}</option>
                <option value="cn">{t('regions.cn')}</option>
                <option value="other">{t('regions.other')}</option>
              </select>
            </div>
          </div>

          <fieldset>
            <legend className="block text-sm font-medium mb-1">{t('waitlist.interests')}</legend>
            <div className="flex flex-wrap gap-3">
              {(['policy', 'compliance', 'tools', 'learning'] as const).map((k) => (
                <label key={k} className="inline-flex items-center gap-2">
                  <input type="checkbox" value={k} {...register('interests')} />
                  <span className="text-sm">
                    {k === 'policy'
                      ? t('interests.policy')
                      : k === 'compliance'
                      ? t('interests.compliance')
                      : k === 'tools'
                      ? t('interests.tools')
                      : t('interests.learning')}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {isSubmitting ? t('waitlist.submitting') : t('waitlist.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
