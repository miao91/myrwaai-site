/**
 * src/i18n/index.tsx
 * i18n initialization and provider for the app.
 * - Detects language from localStorage or navigator.
 * - Exposes I18nProvider and a small helper hook.
 */

import React, { PropsWithChildren, useMemo } from 'react'
import i18n from 'i18next'
import { I18nextProvider, useTranslation } from 'react-i18next'
import { initReactI18next } from 'react-i18next'

/** Minimal resource set for new components (safe to extend later). */
const resources = {
  en: {
    common: {
      language: { en: 'English', zh: '中文' },
      waitlist: {
        join: 'Join Waitlist',
        title: 'Join the waitlist',
        desc: 'Leave your contact and interests, we will reach out soon.',
        name: 'Name',
        email: 'Email',
        role: 'Role',
        region: 'Region',
        interests: 'Interests',
        submit: 'Submit',
        submitting: 'Submitting...',
        success: 'Thanks! You are on the list.',
        exists: 'This email is already on the list.',
        invalidEmail: 'Please enter a valid email.',
        failure: 'Submission failed, please try again later.',
      },
      roles: { builder: 'Builder', investor: 'Investor', researcher: 'Researcher', other: 'Other' },
      regions: { global: 'Global', us: 'United States', eu: 'European Union', cn: 'China', other: 'Other' },
      interests: { policy: 'Policy updates', compliance: 'Compliance', tools: 'Tools', learning: 'Learning' },
    },
  },
  zh: {
    common: {
      language: { en: 'English', zh: '中文' },
      waitlist: {
        join: '加入候补名单',
        title: '加入候补名单',
        desc: '留下联系方式与关注点，我们会尽快联系你。',
        name: '姓名',
        email: '邮箱',
        role: '角色',
        region: '地区',
        interests: '兴趣',
        submit: '提交',
        submitting: '提交中...',
        success: '已收到，感谢关注！',
        exists: '该邮箱已在候补名单中。',
        invalidEmail: '请输入有效邮箱。',
        failure: '提交失败，请稍后再试。',
      },
      roles: { builder: '建设者', investor: '投资者', researcher: '研究者', other: '其他' },
      regions: { global: '全球', us: '美国', eu: '欧盟', cn: '中国', other: '其他' },
      interests: { policy: '政策追踪', compliance: '合规', tools: '工具', learning: '学习' },
    },
  },
} as const

/** Resolve initial language: localStorage -> navigator -> en. */
function detectLang(): 'en' | 'zh' {
  const saved = (typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : '') as 'en' | 'zh' | null
  if (saved === 'en' || saved === 'zh') return saved
  const nav = (typeof navigator !== 'undefined' ? navigator.language : '') || ''
  return nav.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

let initialized = false
function ensureI18n() {
  if (initialized) return
  i18n.use(initReactI18next).init({
    resources,
    lng: detectLang(),
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  })
  initialized = true
}

/** I18nProvider: wraps children with I18nextProvider. */
export function I18nProvider({ children }: PropsWithChildren) {
  ensureI18n()
  const instance = useMemo(() => i18n, [])
  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>
}

/** Hook: typed translation helper for 'common' namespace. */
export function useI18n() {
  return useTranslation('common')
}

/** Change language and persist. */
export function setLanguage(lng: 'en' | 'zh') {
  ensureI18n()
  i18n.changeLanguage(lng)
  try {
    localStorage.setItem('lang', lng)
  } catch {}
}
