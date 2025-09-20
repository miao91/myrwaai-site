/**
 * components/sections/TradingSoon.tsx
 * Coming-soon highlight for RWA trading features with a disabled preview panel.
 */

import React from 'react'
import { LineChart, ShieldCheck, CreditCard, Rocket } from 'lucide-react'

/**
 * TradingSoon
 * Announces upcoming RWA trading with feature bullets and a mock trading card.
 */
export function TradingSoon() {
  const bullets = [
    { icon: Rocket, title: '简化上架流程', desc: '面向发行方的友好上架引导与材料清单。' },
    { icon: CreditCard, title: '多样支付', desc: '支持法币/稳定币结算（方案评估中）。' },
    { icon: ShieldCheck, title: '合规风控', desc: 'KYC/AML 与合规提示，降低交易风险。' },
    { icon: LineChart, title: '行情与订单簿', desc: '基础行情、下单与持仓管理（规划中）。' },
  ]

  return (
    <section id="trading" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-tr from-sky-50 to-emerald-50 p-6 md:p-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:items-stretch">
            {/* Left: copy + bullets */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 text-xs">
                即将上线
              </div>
              <h3 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
                RWA 交易（Coming soon）
              </h3>
              <p className="mt-2 text-slate-600 max-w-xl">
                我们正在打磨一套面向大众、亲切易用的 RWA 交易体验。功能完善后将优先开放邀请测试。
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bullets.map((b) => (
                  <div key={b.title} className="flex items-start gap-3">
                    <div className="rounded-md bg-emerald-600 text-white p-2">
                      <b.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{b.title}</div>
                      <div className="text-sm text-slate-600 mt-0.5">{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <a
                  href="#waitlist"
                  className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2.5 text-white hover:bg-emerald-700 transition-colors"
                >
                  加入候补，抢先体验
                </a>
              </div>
            </div>

            {/* Right: mock trading preview */}
            <div className="flex-1">
              <div className="h-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-slate-900">US T-Bill</div>
                  <span className="text-xs rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 border border-slate-200">
                    Demo
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-semibold tracking-tight text-slate-900">100.25</div>
                  <div className="text-xs text-emerald-700">+0.32% 24h</div>
                </div>
                <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
                  <img src="https://pub-cdn.sider.ai/u/U0JJHRLG54/web-coder/68ceac095375a0a7f3dc1052/resource/4ce45267-7b4a-432e-ad7f-5f73e549fec0.jpg" className="object-cover w-full h-40" />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    disabled
                    className="rounded-md bg-emerald-600/70 text-white px-3 py-2 font-medium cursor-not-allowed opacity-60"
                    title="Coming soon"
                  >
                    买入
                  </button>
                  <button
                    disabled
                    className="rounded-md bg-slate-800/80 text-white px-3 py-2 font-medium cursor-not-allowed opacity-60"
                    title="Coming soon"
                  >
                    卖出
                  </button>
                </div>
                <p className="mt-3 text-xs text-slate-600">
                  交易功能尚在建设中，以上为示意图。功能开放后优先邀请候补用户体验。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
