/**
 * components/sections/Features.tsx
 * Feature grid presenting key value propositions tailored to RWA.
 */

import React from 'react'
import { ShieldCheck, BarChart3, FileText, Map, Globe, GraduationCap } from 'lucide-react'

/** Feature descriptor */
interface FeatureItem {
  title: string
  description: string
  icon: React.ElementType
}

/**
 * Features
 * Responsive grid of feature cards using lucide icons.
 */
export function Features() {
  const features: FeatureItem[] = [
    {
      title: '最新政策追踪',
      description: '持续更新各地区 RWA 相关政策与动态，重要变化不再错过。',
      icon: Globe,
    },
    {
      title: '区域法规解读',
      description: '按国家/地区分类梳理关键条款，读得懂、用得上。',
      icon: Map,
    },
    {
      title: '合规提示',
      description: '实践向导与注意事项，降低合规成本与风险。',
      icon: ShieldCheck,
    },
    {
      title: '市场洞察',
      description: '整合报告与数据点，快速把握趋势与机会窗口。',
      icon: BarChart3,
    },
    {
      title: '工具与模板',
      description: '一键使用的材料清单与模板，提升执行效率。',
      icon: FileText,
    },
    {
      title: '社区与学习',
      description: '入门到进阶的学习路径与社区链接，互助共进。',
      icon: GraduationCap,
    },
  ]

  return (
    <section id="features" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
            我们正在为你准备
          </h2>
          <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
            亲切、清晰、可落地的 RWA 信息服务：从政策到合规、从工具到学习，一站式触达。
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <article
              key={f.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-md bg-emerald-600 text-white p-2">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-semibold">{f.title}</h3>
                  <p className="mt-1 text-slate-600">{f.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
