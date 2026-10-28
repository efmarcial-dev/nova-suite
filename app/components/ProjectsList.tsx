'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface ProjectsListProps {
  projects: any[];
  isLoading: boolean;
  className?: string;
}

const statusConfig: Record<string, { label: string; classes: string }> = {
  completed: { label: 'Completed', classes: 'bg-emerald-50 text-emerald-700' },
  in_progress: { label: 'In Progress', classes: 'bg-[#F0F9FF] text-[#1EA0FF]' },
  planning: { label: 'Planning', classes: 'bg-amber-50 text-amber-700' },
  on_hold: { label: 'On Hold', classes: 'bg-gray-100 text-gray-600' },
}

function getStatusConfig(status?: string) {
  const key = status?.toLowerCase().replace(' ', '_') ?? '';
  return statusConfig[key] ?? { label: status ?? 'Active', classes: 'bg-violet-50 text-violet-700' };
}

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between py-2.5 px-1">
      <div className="flex-1 space-y-1.5">
        <div className="skeleton h-3.5 w-40" />
        <div className="skeleton h-2.5 w-20" />
      </div>
      <div className="skeleton h-5 w-16 rounded-full" />
    </div>
  )
}

export default function ProjectsList({ projects, isLoading, className = '' }: ProjectsListProps) {
  return (
    <div className={`bg-white p-5 rounded-2xl shadow-sm border border-[--border] flex flex-col ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-[--foreground]">Projects</h2>
        <Link
          href="/dashboard/projects"
          className="text-xs font-medium text-[#1EA0FF] hover:text-[#0088EE] flex items-center gap-1 transition-colors"
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>

      <div className="flex-1 overflow-auto divide-y divide-[--border] max-h-[360px]">
        {isLoading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-10 h-10 rounded-full bg-[#F0F9FF] flex items-center justify-center mb-3">
              <span className="text-xl">📁</span>
            </div>
            <p className="text-sm font-medium text-[--foreground]">No projects yet</p>
            <p className="text-xs text-[--muted-foreground] mt-1">Create your first project to get started</p>
          </div>
        ) : (
          projects.map((project, index) => {
            const cfg = getStatusConfig(project.status);
            return (
              <div
                key={project.id ?? index}
                className="group flex items-center justify-between py-2.5 px-1 hover:bg-[--background] transition-colors rounded-lg cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[--foreground] truncate">
                    {project.title ?? project.projectName ?? project.name ?? 'Untitled project'}
                  </p>
                  {project.description && (
                    <p className="text-xs text-[--muted-foreground] truncate mt-0.5">{project.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-3 shrink-0">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.classes}`}>
                    {cfg.label}
                  </span>
                  <ArrowRight size={13} className="text-[--muted-foreground] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
