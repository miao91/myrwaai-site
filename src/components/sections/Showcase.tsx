/**
 * components/sections/Showcase.tsx
 * Visual gallery showing directions like policy map, templates and learning, plus trading (coming soon).
 */

import React from 'react'

/**
 * Showcase
 * Displays a responsive gallery with placeholder images.
 */
export function Showcase() {
  const items = [
    { name: '政策地图', src: 'https://pub-cdn.sider.ai/u/U0JJHRLG54/web-coder/68ceac095375a0a7f3dc1052/resource/b30290ba-e8b4-4c17-858a-920da719c31d.jpg' },
    { name: '项目与流程', src: 'https://pub-cdn.sider.ai/u/U0JJHRLG54/web-coder/68ceac095375a0a7f3dc1052/resource/33570189-4d85-43c9-9d64-2245808748e7.jpg' },
    { name: '合规模板', src: 'https://pub-cdn.sider.ai/u/U0JJHRLG54/web-coder/68ceac095375a0a7f3dc1052/resource/3bc35a3e-fa07-4f21-93f5-ccb66303cf07.jpg' },
    { name: '学习专区', src: 'https://pub-cdn.sider.ai/u/U0JJHRLG54/web-coder/68ceac095375a0a7f3dc1052/resource/0f2c58c0-7ef9-4b33-a9c1-16120486d949.jpg' },
    { name: 'RWA 交易（Coming soon）', src: 'https://pub-cdn.sider.ai/u/U0JJHRLG54/web-coder/68ceac095375a0a7f3dc1052/resource/41588b34-3e1a-47b8-b205-d8c5c50987d0.jpg' },
  ]

  return (
    <section id="showcase" className="bg-slate-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
            即将上线的功能预览
          </h2>
          <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
            紧贴真实需求的模块设计，帮助你快速找到所需信息与行动路径。
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.name} className="relative group">
              <img src={item.src} className="object-cover w-full h-48 rounded-xl border border-slate-200" />
              <div className="absolute inset-0 rounded-xl ring-0 ring-emerald-600/0 group-hover:ring-4 group-hover:ring-emerald-600/10 transition-all" />
              <div className="mt-2 text-sm text-slate-600">{item.name}</div>
              {item.name.includes('Coming soon') && (
                <span className="absolute top-2 right-2 text-[11px] rounded-full bg-emerald-600 text-white px-2 py-0.5 shadow">
                  Soon
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
