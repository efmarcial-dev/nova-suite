'use client';

import TaskCard from "./TaskCard";
import {Task} from "./task";


export default function MatrixViewComponent({ tasks }: { tasks: Task[] }) {
  const quadrants = {
    do_now: tasks.filter((t) => t.priority === 'high' && t.confidence >= 80),
    schedule: tasks.filter((t) => t.priority === 'low' && t.confidence >= 80),
    delegate: tasks.filter((t) => t.priority === 'high' && t.confidence < 80),
    ignore: tasks.filter((t) => t.priority === 'low' && t.confidence < 80),
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <MatrixCell title="Do Now" color="red" tasks={quadrants.do_now} />
      <MatrixCell title="Schedule" color="yellow" tasks={quadrants.schedule} />
      <MatrixCell title="Delegate" color="green" tasks={quadrants.delegate} />
      <MatrixCell title="Ignore" color="gray" tasks={quadrants.ignore} />
    </div>
  )
}

function MatrixCell({
  title,
  tasks,
}: {
  title: string
  color: string
  tasks: Task[]
}) {
  return (
    <div
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
