/**
 * pages/Home.tsx
 * Home landing page for myrwa.ai. Composes the hero, features, regions, showcase, CTA, and footer.
 */

import React from 'react'
import { SiteHeader } from '../components/layout/SiteHeader'
import { SiteFooter } from '../components/layout/SiteFooter'
import { Hero } from '../components/sections/Hero'
import { Features } from '../components/sections/Features'
import { Showcase } from '../components/sections/Showcase'
import { CTA } from '../components/sections/CTA'
import { Regions } from '../components/sections/Regions'
import { TradingSoon } from '../components/sections/TradingSoon'

/**
 * HomePage
 * Renders a beautiful, responsive landing for myrwa.ai with clear entrances and CTAs.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SiteHeader />
      <main>
        <Hero />
        <Features />
        <Regions />
        <Showcase />
        <TradingSoon />
        <CTA />
      </main>
      <SiteFooter />
    </div>
  )
}
