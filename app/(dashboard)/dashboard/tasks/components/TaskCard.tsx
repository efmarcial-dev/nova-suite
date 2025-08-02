'use client'

import { useDraggable } from '@dnd-kit/core';
import { UserCircle2 } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { Task } from './task';




export default function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  })

  const style = transform
  ? {
      transform: `translate(${transform.x}px, ${transform.y}px)`,
      zIndex: 50,
    }
  : undefined

  const urgencyColor = {
    critical: 'bg-gradient-to-r from-red-500 to-pink-500',
    high : 'bg-gradient-to-r from-red-500 to-pink-500',
    medium : "bg-gradient-to-r from-yello-400 to-orange-300",
    low : 'bg-gradient-to-r from-green-400 to-emerald-400'
  }[task.priority]

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white p-3 rounded-lg shadow hover:shadow-md transition cursor-pointer"
    >
      
      {/* Urgency Bar */}
      <div className={cn('h-2 w-full', urgencyColor)} />

      {/* Card Content */}
      <div className="p-4 space-y-2">
        {/* Title */}
        <h2 className="text-base font-semibold text-gray-900">{task.title}</h2>

        {/* Subtext */}
        <p className="text-sm text-gray-600">
          AI Confidence: {task.confidence}%
        </p>
        <p className="text-sm text-gray-500">{task.reasoning}</p>

        {/* Tags */}
        <div className="flex flex-wrapp gap-2 mt-2">
          {task.tags.map((tag) =>
            <span key={tag} className="text-xs font-medium py-1 rounded-full bg-gray-100 text-gray-800">
              {tag}
            </span>
          )}
        </div>

        {/* Footer Row */}
        <div className="flex items-center justify-between pt-3">
          {/* Due Date */}
         {task.due_date ? (
            <span className="text-xs text-gray-400">{task.due_date}</span>
          ) : (
            <span />
          )}

          {/* Avatar */}
          {task.assignee?.avatarUrl ? (
            <img
              src={task.assignee.avatarUrl}
              alt={task.assignee.name}
              className="w-6 h-6 rounded-full object-cover border"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <UserCircle2 className="w-4 h-4 text-blue-600" />
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
