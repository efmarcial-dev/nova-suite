'use client'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core'

import TaskColumn from './TaskColumn';
import TaskCard from './TaskCard';
import { useEffect, useMemo, useState } from 'react';
import MatrixViewComponent from './MartixViewComponent';
import { useCachedTasks, } from '@/app/hooks/useCachedTasks';
import { updateTaskInCache } from '@/app/lib/cache/NovaCacheHelpers';
import { Task } from './task';





export default function TaskBoard({ view }: { view: 'table' | 'list' | 'matrix'}) { 
  const {tasks: cacheTasks, isLoading} = useCachedTasks();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  const sensors = useSensors(useSensor(PointerSensor))

  // Sync hook data to local state when it changes

  useEffect(() => {
    try {
    if (!isLoading && cacheTasks.length > 0) {
      setTasks(cacheTasks);
      console.log('All tasks are set')
    }
  }catch(error) {
    console.log(error);
  }
  }, [cacheTasks, isLoading])

  const grouped = useMemo(() => (
          {
          todo: tasks.filter((t) => t.status === 'todo'),
          in_progress: tasks.filter((t) => t.status === 'in_progress'),
          in_review: tasks.filter((t) => t.status === 'in_review'),
          done: tasks.filter((t) => t.status === 'done'),
        }
        ), [tasks])

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id
    const task = tasks.find((t) => t.id === taskId)
    if (task) setDraggedTask(task)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setDraggedTask(null)

    if (!over || active.id === over.id) return

    const taskId = active.id
    const newStatus = over.id.toString() as 'todo' | 'in_progress' | 'in_review' | 'done'

    setTasks((prev) => {
      const updatedTasks = prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );

      // Update cache
      const updatedTask = updatedTasks.find((t) => t.id === taskId);
      if (updatedTask) {
        updateTaskInCache(updatedTask); // call the helper
      }

      return updatedTasks;
    });
  }

  if(isLoading || tasks.length ===0) {
    return <div className='p-6 text-center text-gray-500'>
      Loading tasks ...
    </div>
  }

  if (view === 'list') {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-6">
          {Object.entries(grouped).map(([status, tasks]) => (
            <div key={status}>
              <h3 className="text-md font-semibold text-gray-700 capitalize mb-2">
                {status.replace('_', ' ')}
              </h3>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </DndContext>
    )
  }

  if (view === 'matrix'){
    return <MatrixViewComponent tasks={tasks} />
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-4 gap-4">
        <TaskColumn id="todo" title="To Do" tasks={grouped.todo} />
        <TaskColumn id="in_progress" title="In Progress" tasks={grouped.in_progress} />
        <TaskColumn id="in_review" title="In Review" tasks={grouped.in_review} />
        <TaskColumn id="done" title="Done" tasks={grouped.done} />
      </div>

      <DragOverlay>
        {draggedTask ? <TaskCard task={draggedTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
