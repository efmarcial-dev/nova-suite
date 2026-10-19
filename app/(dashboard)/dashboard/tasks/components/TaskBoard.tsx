'use client';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';

import TaskColumn from './TaskColumn';
import TaskCard from './TaskCard';
import TaskDetailModal from './TaskDetailModal';
import { useEffect, useMemo, useState } from 'react';
import MatrixViewComponent from './MartixViewComponent';
import { useCachedTasks } from '@/app/hooks/useCachedTasks';
import { updateTaskInCache, deleteTaskInCache } from '@/app/lib/cache/NovaCacheHelpers';
import { updateTaskAPI, deleteTaskAPI } from '@/app/lib/api/tasks';
import { emitTaskChangeEvent } from '@/app/lib/events/novaEvents';
import { Task } from './task';

export default function TaskBoard({
  view,
  statusFilter = 'all',
}: {
  view: 'table' | 'list' | 'matrix';
  statusFilter?: 'all' | 'pending';
}) {
  const { tasks: cacheTasks, isLoading } = useCachedTasks();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Require 8px of movement to drag so ordinary clicks open the detail modal cleanly!
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (!isLoading) {
      setTasks(cacheTasks);
    }
  }, [cacheTasks, isLoading]);

  const visibleTasks = statusFilter === 'pending'
    ? tasks.filter((task) => task.status !== 'done')
    : tasks;

  const grouped = useMemo(() => ({
    todo: visibleTasks.filter((t) => t.status === 'todo'),
    in_progress: visibleTasks.filter((t) => t.status === 'in_progress'),
    in_review: visibleTasks.filter((t) => t.status === 'in_review'),
    done: visibleTasks.filter((t) => t.status === 'done'),
  }), [visibleTasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id;
    const task = tasks.find((t) => t.id === taskId);
    if (task) setDraggedTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedTask(null);

    if (!over || active.id === over.id) return;

    const taskId = active.id;
    const newStatus = over.id.toString() as 'todo' | 'in_progress' | 'in_review' | 'done';

    setTasks((prev) => {
      const updatedTasks = prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );

      const updatedTask = updatedTasks.find((t) => t.id === taskId);
      if (updatedTask) {
        updateTaskInCache(updatedTask);
        updateTaskAPI(updatedTask.id, { status: newStatus });
        emitTaskChangeEvent({ action: 'update', task: updatedTask });
      }

      return updatedTasks;
    });
  };

  const handleUpdateTask = async (updated: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
    await updateTaskInCache(updated);
    emitTaskChangeEvent({ action: 'update', task: updated });
    await updateTaskAPI(updated.id, updated);
  };

  const handleDeleteTask = async (taskId: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    await deleteTaskInCache(taskId);
    emitTaskChangeEvent({ action: 'delete', taskId });
    await deleteTaskAPI(taskId);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4 p-4">
        {[1, 2, 3, 4].map((col) => (
          <div key={col} className="bg-slate-50/60 rounded-2xl p-4 min-h-[400px] border border-[--border] space-y-3">
            <div className="skeleton h-5 w-24 rounded-lg" />
            <div className="skeleton h-28 w-full rounded-xl" />
            <div className="skeleton h-28 w-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (visibleTasks.length === 0) {
    return (
      <div className="p-12 text-center text-sm text-[--muted-foreground] bg-white rounded-2xl border border-[--border]">
        No tasks found. Click &quot;+ Create Task&quot; above to add your first deliverable.
      </div>
    );
  }

  return (
    <>
      {view === 'list' && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-6">
            {Object.entries(grouped).map(([status, groupTasks]) => (
              <div key={status} className="bg-white rounded-2xl p-4 border border-[--border] shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[--foreground] capitalize flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    {status.replace('_', ' ')}
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                    {groupTasks.length}
                  </span>
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {groupTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => setSelectedTask(task)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DndContext>
      )}

      {view === 'matrix' && <MatrixViewComponent tasks={visibleTasks} />}

      {view === 'table' && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-4 gap-4">
            <TaskColumn
              id="todo"
              title="To Do"
              tasks={grouped.todo}
              onTaskClick={(t) => setSelectedTask(t)}
            />
            <TaskColumn
              id="in_progress"
              title="In Progress"
              tasks={grouped.in_progress}
              onTaskClick={(t) => setSelectedTask(t)}
            />
            <TaskColumn
              id="in_review"
              title="In Review"
              tasks={grouped.in_review}
              onTaskClick={(t) => setSelectedTask(t)}
            />
            <TaskColumn
              id="done"
              title="Done"
              tasks={grouped.done}
              onTaskClick={(t) => setSelectedTask(t)}
            />
          </div>

          <DragOverlay>
            {draggedTask ? <TaskCard task={draggedTask} /> : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Task Inspection & Edit Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />
    </>
  );
}
