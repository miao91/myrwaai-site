/**
 * src/App.tsx
 * App root router. Uses MemoryRouter to avoid DOM-specific routers while keeping a simple route tree.
 * This fixes runtime blank-page caused by importing HashRouter from 'react-router' (not exported).
 */

import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'
import HomePage from './pages/Home'
import { I18nProvider } from './i18n'
import LanguageSwitcherFloating from './components/i18n/LanguageSwitcherFloating'
import WaitlistFab from './components/waitlist/WaitlistFab'
import { Toaster } from 'sonner'

/**
 * App
 * Root of the application with in-memory router.
 * - Adds I18nProvider for language support.
 * - Adds floating Language switcher and Waitlist FAB globally.
 */
export default function App() {
  return (
    <I18nProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>

        {/* Global overlays */}
        <LanguageSwitcherFloating />
        <WaitlistFab />
        <Toaster richColors position="top-center" />
      </MemoryRouter>
    </I18nProvider>
  )
}
