import { useDroppable } from '@dnd-kit/core'
import TaskCard from './TaskCard'
import { Task } from './task'


export default function TaskColumn({
  id,
  title,
  tasks,
}: {
  id: string
  title: string
  tasks: Task[]
}) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-50 rounded-xl p-2 shadow-sm min-h-[300px]"
    >
      <h3 className="font-semibold text-gray-700 mb-4 flex justify-between items-center">
        {title} <span className="text-sm text-gray-400">({tasks.length})</span>
      </h3>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}
