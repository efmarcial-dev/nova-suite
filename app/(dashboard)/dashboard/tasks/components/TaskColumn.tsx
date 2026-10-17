import { useDroppable } from '@dnd-kit/core'
import TaskCard from './TaskCard'
import { Task } from './task'

const columnConfig: Record<string, { header: string; dot: string; bg: string; count: string }> = {
  todo:        { header: 'text-slate-700',  dot: 'bg-slate-400',   bg: 'bg-slate-50',   count: 'bg-slate-100 text-slate-600' },
  in_progress: { header: 'text-indigo-700', dot: 'bg-indigo-500',  bg: 'bg-indigo-50/40', count: 'bg-indigo-100 text-indigo-600' },
  in_review:   { header: 'text-amber-700',  dot: 'bg-amber-400',   bg: 'bg-amber-50/40',  count: 'bg-amber-100 text-amber-600' },
  done:        { header: 'text-emerald-700',dot: 'bg-emerald-500', bg: 'bg-emerald-50/40',count: 'bg-emerald-100 text-emerald-600' },
}

export default function TaskColumn({
  id,
  title,
  tasks,
  onTaskClick,
}: {
  id: string
  title: string
  tasks: Task[]
  onTaskClick?: (task: Task) => void
}) {
  const { setNodeRef } = useDroppable({ id })
  const cfg = columnConfig[id] ?? columnConfig.todo;

  return (
    <div
      ref={setNodeRef}
      className={`${cfg.bg} rounded-2xl p-3 min-h-[400px] border border-[--border]`}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          <h3 className={`text-sm font-semibold ${cfg.header}`}>{title}</h3>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.count}`}>
          {tasks.length}
        </span>
      </div>
      <div className="space-y-2.5">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick?.(task)} />
        ))}
      </div>
    </div>
  )
}

