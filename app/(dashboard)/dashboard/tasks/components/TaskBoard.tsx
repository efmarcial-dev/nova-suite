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
import { rescoreTaskAPI, updateTaskAPI, deleteTaskAPI } from '@/app/lib/api/tasks';
import { emitTaskChangeEvent } from '@/app/lib/events/novaEvents';
import { areIdsEqual, deduplicateTasks } from '@/app/lib/utils/deduplicate';
import { Task } from './task';
import { computeTaskAIScore } from '@/app/lib/aiScoring';

export default function TaskBoard({
  view,
  statusFilter = 'all',
  priorityFilter = 'all',
  searchQuery = '',
}: {
  view: 'table' | 'list' | 'matrix';
  statusFilter?: 'all' | 'pending';
  priorityFilter?: 'all' | 'high' | 'important';
  searchQuery?: string;
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
      setTasks(deduplicateTasks(cacheTasks));
    }
  }, [cacheTasks, isLoading]);

  const dedupedTasks = useMemo(() => deduplicateTasks(tasks), [tasks]);

  const visibleTasks = dedupedTasks.filter((task) => {
    const needle = searchQuery.trim().toLocaleLowerCase();
    if (needle && !`${task.title || ''} ${task.description || ''}`.toLocaleLowerCase().includes(needle)) return false;
    if (statusFilter === 'pending' && task.status === 'done') return false;
    if (priorityFilter === 'high' && !['high', 'critical'].includes(task.priority?.toLowerCase() || '')) return false;
    if (priorityFilter === 'important') {
      if (computeTaskAIScore(task).score < 75) return false;
    }
    return true;
  });

  const grouped = useMemo(() => ({
    todo: visibleTasks.filter((t) => t.status === 'todo'),
    in_progress: visibleTasks.filter((t) => t.status === 'in_progress'),
    in_review: visibleTasks.filter((t) => t.status === 'in_review'),
    done: visibleTasks.filter((t) => t.status === 'done'),
  }), [visibleTasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id;
    const task = tasks.find((t) => areIdsEqual(t.id, taskId));
    if (task) setDraggedTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedTask(null);

    if (!over || active.id === over.id) return;

    const taskId = active.id;
    const newStatus = over.id.toString() as 'todo' | 'in_progress' | 'in_review' | 'done';

    const currentTask = tasks.find((t) => areIdsEqual(t.id, taskId));
    if (!currentTask || currentTask.status === newStatus) return;

    const updatedTask: Task = { ...currentTask, status: newStatus };

    // Pure state updater - NO side effects inside setState!
    setTasks((prev) =>
      prev.map((task) => (areIdsEqual(task.id, taskId) ? updatedTask : task))
    );

    // Side effects safely called outside React's render/state updater
    updateTaskInCache(updatedTask);
    updateTaskAPI(updatedTask.id, { status: newStatus });
    emitTaskChangeEvent({ action: 'update', task: updatedTask });
  };

  const handleUpdateTask = async (updated: Task) => {
    setTasks((prev) =>
      prev.map((t) => (areIdsEqual(t.id, updated.id) ? updated : t))
    );
    await updateTaskInCache(updated);
    emitTaskChangeEvent({ action: 'update', task: updated });
    const saved = await updateTaskAPI(updated.id, updated);
    if (saved) {
      setTasks((prev) => prev.map((task) => areIdsEqual(task.id, saved.id) ? saved : task));
      setSelectedTask(saved);
      await updateTaskInCache(saved);
      emitTaskChangeEvent({ action: 'update', task: saved });

      // If priority, title, description, due_date or tags changed, trigger a
      // background Groq LLM rescore so the AI score reflects the new details.
      const rescoreFields: (keyof Task)[] = ['priority', 'title', 'description', 'due_date', 'tags'];
      const needsRescore = rescoreFields.some(
        (field) => (updated as any)[field] !== (saved as any)[field] ||
                   rescoreFields.includes(field)
      );
      // Always rescore after any edit (backend already does it in serializer.update,
      // but we fire-and-forget the /rescore/ endpoint to ensure the LLM ran).
      if (saved.id && !String(saved.id).startsWith('local-')) {
        rescoreTaskAPI(saved.id).then((rescored) => {
          if (rescored) {
            updateTaskInCache(rescored);
            setTasks((prev) => prev.map((t) => areIdsEqual(t.id, rescored.id) ? rescored : t));
            emitTaskChangeEvent({ action: 'update', task: rescored });
          }
        }).catch(() => {
          // Silent — rescore is best-effort
        });
      }
    }
  };

  const handleDeleteTask = async (taskId: Task['id']) => {
    setTasks((prev) => prev.filter((t) => !areIdsEqual(t.id, taskId)));
    await deleteTaskInCache(taskId);
    emitTaskChangeEvent({ action: 'delete', taskId });
    await deleteTaskAPI(taskId);
  };

  const handleRescoreTask = async (task: Task) => {
    const rescored = await rescoreTaskAPI(task.id);
    if (!rescored) throw new Error('Could not reanalyze this task.');
    setTasks((prev) => prev.map((item) => areIdsEqual(item.id, task.id) ? rescored : item));
    setSelectedTask(rescored);
    await updateTaskInCache(rescored);
    emitTaskChangeEvent({ action: 'update', task: rescored });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-4 xl:grid-cols-4">
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
        {priorityFilter !== 'all'
          ? 'No tasks match this priority filter.'
          : 'No tasks found. Click "+ Create Task" above to add your first deliverable.'}
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
                    <span className="w-2 h-2 rounded-full bg-[#F0F9FF]0" />
                    {status.replace('_', ' ')}
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F0F9FF] text-[#0088EE]">
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
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
        onRescore={handleRescoreTask}
      />
    </>
  );
}
