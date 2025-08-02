'use client'

import { UserCircle2, Plus } from 'lucide-react'

const projects = [
  { title: 'Nova Website Redesign', manager: 'Eduardo Fajardo' },
  { title: 'Client CRM Integration', manager: 'Maria Gomez' },
  { title: 'Internal Dashboard', manager: 'John Smith' },
  { title: 'Mobile App Revamp', manager: 'Carla Rivera' },
  { title: 'AI Assistant Feature', manager: 'Leo Torres' },
  { title: 'Landing Page A/B Test', manager: 'Anna Silva' },
  { title: 'SEO Optimization', manager: 'Jake Lin' },
  { title: 'Backend Refactor', manager: 'Sofia Hernandez' },
  { title: 'Customer Portal', manager: 'David Lee' },
  { title: 'Analytics Setup', manager: 'Sara Kim' }
]

export default function ProjectsList({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white p-4 rounded-xl shadow-sm flex flex-col h-full ${className}`}>
      {/* Header row: Title + Add button */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Projects</h2>
        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 overflow-auto space-y-4  max-h-[400px] scrollbar-thin">
        {projects.map((project, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <UserCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{project.title}</div>
              <div className="text-xs text-gray-500">{project.manager}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
