'use client'

import Link from 'next/link'
import { Plus, FolderPlus, CalendarDays } from 'lucide-react'
import { useState } from 'react'
import ModalPanel from './ModalPanel'

const actions = [
  {
    icon: <Plus size={16} />,
    label: 'New Task',
    description: 'Add a task',
    accent: 'bg-[#E8F6FF] text-[#1EA0FF]',
    href: null as string | null,
  },
  {
    icon: <FolderPlus size={16} />,
    label: 'New Project',
    description: 'Start a project',
    accent: 'bg-violet-100 text-violet-600',
    href: '/dashboard/projects',
  },
  {
    icon: <CalendarDays size={16} />,
    label: 'Calendar',
    description: 'View schedule',
    accent: 'bg-emerald-100 text-emerald-600',
    href: '/dashboard/calendar',
  },
]

export default function QuickActions({ className = '' }: { className?: string }) {
  const [showNewTask, setShowNewTask] = useState(false);

  return (
    <>
      <div className={`bg-white p-5 rounded-2xl shadow-sm border border-[--border] ${className}`}>
        <h2 className="text-base font-semibold text-[--foreground] mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {actions.map((action) =>
            action.href ? (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[--background] transition-colors group border border-[--border]"
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${action.accent}`}>
                  {action.icon}
                </span>
                <div>
                  <p className="text-sm font-medium text-[--foreground] group-hover:text-[#1EA0FF] transition-colors">{action.label}</p>
                  <p className="text-xs text-[--muted-foreground]">{action.description}</p>
                </div>
              </Link>
            ) : (
              <button
                key={action.label}
                onClick={() => setShowNewTask(true)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[--background] transition-colors group border border-[--border] text-left"
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${action.accent}`}>
                  {action.icon}
                </span>
                <div>
                  <p className="text-sm font-medium text-[--foreground] group-hover:text-[#1EA0FF] transition-colors">{action.label}</p>
                  <p className="text-xs text-[--muted-foreground]">{action.description}</p>
                </div>
              </button>
            )
          )}
        </div>
      </div>

      <ModalPanel isOpen={showNewTask} onClose={() => setShowNewTask(false)}>
        <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
      </ModalPanel>
    </>
  )
}
