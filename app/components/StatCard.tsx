'use client'
import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number | string
  href: string
  icon?: React.ReactNode
  accent?: string
  trend?: string
  className?: string
}

export default function StatCard({ title, value, href, icon, accent = 'bg-[#E8F6FF] text-[#1EA0FF]', trend, className = '' }: StatCardProps) {
  return (
    <Link
      href={href}
      className={`group bg-white p-5 rounded-2xl shadow-sm border border-[--border] flex flex-col gap-3 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1EA0FF] ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
          {icon}
        </span>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <TrendingUp size={11} /> {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[--muted-foreground] text-xs font-medium uppercase tracking-wide">{title}</p>
        <p className="text-3xl font-bold text-[--foreground] mt-0.5 group-hover:text-[#1EA0FF] transition-colors">{value}</p>
      </div>
    </Link>
  )
}
