/**
 * components/sections/Regions.tsx
 * Region grid to show initial coverage areas (excluding Mainland China).
 */

import React from 'react'

/** Region descriptor */
interface RegionItem {
  name: string
  src: string
}

/**
 * Regions
 * Displays a responsive grid of prioritized regions (excluding Mainland China).
 */
export function Regions() {
  const regions: RegionItem[] = [
    { name: 'United States', src: 'https://pub-cdn.sider.ai/u/U0JJHRLG54/web-coder/68ceac095375a0a7f3dc1052/resource/acad31dd-348a-4e60-a4e0-7bae87d01325.jpg' },
    { name: 'European Union', src: 'https://pub-cdn.sider.ai/u/U0JJHRLG54/web-coder/68ceac095375a0a7f3dc1052/resource/dc27e16a-9a53-47df-b3af-56792198489a.jpg' },
    { name: 'United Kingdom', src: 'https://pub-cdn.sider.ai/u/U0JJHRLG54/web-coder/68ceac095375a0a7f3dc1052/resource/694cea21-743a-42b2-b7b4-0031c84ec9d5.jpg' },
    { name: 'Singapore', src: 'https://pub-cdn.sider.ai/u/U0JJHRLG54/web-coder/68ceac095375a0a7f3dc1052/resource/6edd676d-ddc7-4f3f-9bae-a99b56d0df8e.jpg' },
    { name: 'Hong Kong', src: 'https://pub-cdn.sider.ai/u/U0JJHRLG54/web-coder/68ceac095375a0a7f3dc1052/resource/4379cdeb-8964-46cc-9bf9-bddf9377b5ce.jpg' },
    { name: 'United Arab Emirates', src: 'https://pub-cdn.sider.ai/u/U0JJHRLG54/web-coder/68ceac095375a0a7f3dc1052/resource/911e5570-2a15-4586-9a75-ca8628e128a0.jpg' },
    { name: 'Japan', src: 'https://pub-cdn.sider.ai/u/U0JJHRLG54/web-coder/68ceac095375a0a7f3dc1052/resource/dbb70d3d-6d24-4d3a-8e29-41ecf3bcc5ac.jpg' },
    { name: 'South Korea', src: 'https://pub-cdn.sider.ai/u/U0JJHRLG54/web-coder/68ceac095375a0a7f3dc1052/resource/d7a070d3-ca53-4f4b-b70e-d36e522e385d.jpg' },
    { name: 'Australia', src: 'https://pub-cdn.sider.ai/u/U0JJHRLG54/web-coder/68ceac095375a0a7f3dc1052/resource/e248c3be-20cf-4456-8313-c36ca82cb807.jpg' },
    { name: 'Canada', src: 'https://pub-cdn.sider.ai/u/U0JJHRLG54/web-coder/68ceac095375a0a7f3dc1052/resource/53d539b9-4e15-44ef-9524-c9e3b7fde83d.jpg' },
    { name: 'Switzerland', src: 'https://pub-cdn.sider.ai/u/U0JJHRLG54/web-coder/68ceac095375a0a7f3dc1052/resource/cadfc94a-1268-41e2-b4e6-dfb672ab2f95.jpg' },
  ]

  return (
    <section id="regions" className="bg-slate-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
            首批覆盖地区（不含中国大陆）
          </h2>
          <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
            我们将优先提供这些地区的 RWA 政策与咨询内容，确保你能快速了解当地的合规与市场情况。
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {regions.map((r) => (
            <article
              key={r.name}
              className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="overflow-hidden rounded-lg">
                <img src={r.src} className="object-cover w-full h-36 rounded-lg" />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <h3 className="text-slate-900 font-medium">{r.name}</h3>
                <span className="text-xs rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 border border-emerald-200">
                  优先
                </span>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          更多地区将陆续加入，欢迎邮件告诉我们你希望优先支持的地区。
        </p>
      </div>
    </section>
  )
}
