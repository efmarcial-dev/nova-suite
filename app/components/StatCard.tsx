// components/StatCard.tsx
'use client'

interface StatCardProps {
  title: string
  value: number | string
  icon?: React.ReactNode
  className?: string
}

export default function StatCard({ title, value, icon, className = '' }: StatCardProps) {
  return (
    <div className={`bg-white p-10 rounded-xl shadow-sm flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
        {icon && <div className="text-blue-500">{icon}</div>}
      </div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  )
}
