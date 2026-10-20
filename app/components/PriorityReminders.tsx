'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Check, Clock3, Flame, RotateCw, Sparkles } from 'lucide-react';
import { rescoreTaskAPI, updateTaskAPI } from '@/app/lib/api/tasks';
import { fetchTasksAPI } from '@/app/lib/api/tasks';
import { replaceTasksInCache, updateTaskInCache } from '@/app/lib/cache/NovaCacheHelpers';
import { emitTaskChangeEvent } from '@/app/lib/events/novaEvents';
import { Task } from '@/app/(dashboard)/dashboard/tasks/components/task';

type ReminderTask = Partial<Task> & Pick<Task, 'id' | 'title'>;

function scoreAsPercent(task: ReminderTask) {
  const raw = task.score ?? task.confidence;
  if (typeof raw !== 'number') return 0;
  return Math.round(raw <= 1 ? raw * 100 : raw);
}

function dueLabel(value?: string | null) {
  if (!value) return 'No deadline';
  const due = new Date(value);
  if (Number.isNaN(due.getTime())) return 'Deadline set';
  if (due.getTime() < Date.now()) return 'Overdue';
  return `Due ${due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
}

export default function PriorityReminders({
  tasks,
  className = '',
}: {
  tasks: ReminderTask[];
  className?: string;
}) {
  const [busyTaskId, setBusyTaskId] = useState<string | number | null>(null);
  const [actionError, setActionError] = useState('');
  const [clock, setClock] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const { reminders, totalReminderCount } = useMemo(() => {
    const candidates = tasks.filter((task) => {
      if (task.status === 'done') return false;
      if (task.snoozed_until && new Date(task.snoozed_until).getTime() > clock) return false;
      const priority = task.priority?.toLowerCase();
      const overdue = Boolean(task.due_date && new Date(task.due_date).getTime() < clock);
      return overdue || priority === 'critical' || priority === 'high' || scoreAsPercent(task) >= 75;
    }).sort((a, b) => {
      const scoreDifference = scoreAsPercent(b) - scoreAsPercent(a);
      if (scoreDifference) return scoreDifference;
      return new Date(a.due_date || '9999-12-31').getTime() - new Date(b.due_date || '9999-12-31').getTime();
    });
    return { reminders: candidates.slice(0, 4), totalReminderCount: candidates.length };
  }, [tasks, clock]);

  const applyAction = async (task: ReminderTask, updates: Partial<Task>) => {
    setBusyTaskId(task.id);
    setActionError('');
    try {
      const saved = await updateTaskAPI(task.id, updates);
      if (!saved) {
        await refreshFromBackend();
        throw new Error('Could not save the reminder. The dashboard was refreshed from Django; please try again.');
      }
      const updated = { ...task, ...saved };
      await updateTaskInCache(updated);
      emitTaskChangeEvent({ action: 'update', task: updated });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not update this reminder.');
    } finally {
      setBusyTaskId(null);
    }
  };

  const rescore = async (task: ReminderTask) => {
    setBusyTaskId(task.id);
    setActionError('');
    try {
      const saved = await rescoreTaskAPI(task.id);
      if (!saved) {
        await refreshFromBackend();
        throw new Error('Could not reanalyze the task. The dashboard was refreshed from Django; please try again.');
      }
      await updateTaskInCache(saved);
      emitTaskChangeEvent({ action: 'update', task: saved });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not reanalyze this task.');
    } finally {
      setBusyTaskId(null);
    }
  };

  const refreshFromBackend = async () => {
    const fresh = await fetchTasksAPI();
    const normalized = fresh.map((item) => ({ ...item, lastUpdated: Date.now() }));
    await replaceTasksInCache(normalized);
    emitTaskChangeEvent({ action: 'refresh', tasks: normalized });
  };

  return (
    <section className={`overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm ${className}`} aria-label="Priority reminders">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-100 bg-gradient-to-r from-rose-50 via-white to-orange-50 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <Flame size={20} />
          </span>
          <div>
            <h2 className="font-semibold text-slate-900">Priority reminders</h2>
            <p className="text-sm text-slate-600">The tasks that need your attention first, based on your priorities.</p>
          </div>
        </div>
        <span className="rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-semibold text-rose-700">
          {totalReminderCount} {totalReminderCount === 1 ? 'needs attention' : 'need attention'}
        </span>
      </div>

      {actionError && <p role="alert" className="px-5 pt-3 text-sm text-rose-700">{actionError}</p>}

      {reminders.length === 0 ? (
        <div className="flex items-center gap-3 px-5 py-6 text-sm text-slate-600">
          <Sparkles size={18} className="text-indigo-500" />
          You’re clear for now. High priority and urgent tasks will show up here.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {reminders.map((task) => {
            const score = scoreAsPercent(task);
            const overdue = Boolean(task.due_date && new Date(task.due_date).getTime() < Date.now());
            const busy = busyTaskId === task.id;
            return (
              <article key={task.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${overdue ? 'bg-rose-100 text-rose-700' : 'bg-orange-100 text-orange-700'}`}>
                      {overdue ? <AlertTriangle size={12} /> : <Sparkles size={12} />}
                      {overdue ? 'Overdue' : task.priority?.toLowerCase() === 'critical' ? 'Critical priority' : 'High priority'}
                    </span>
                    <span className="text-xs font-medium text-slate-500">{dueLabel(task.due_date)}</span>
                    {score > 0 && <span className="text-xs font-semibold text-indigo-600">{score} priority score</span>}
                  </div>
                  <h3 className="truncate font-semibold text-slate-900">{task.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                    {task.scoring_explanation || task.reasoning || task.description || 'Flagged from your task priority and deadline.'}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => rescore(task)}
                    aria-label={`Reanalyze ${task.title}`}
                    title="Reanalyze using your priority profile"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:opacity-50"
                  >
                    <RotateCw size={14} /> Analyze
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => applyAction(task, { snoozed_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() })}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    <Clock3 size={14} /> {busy ? 'Saving…' : 'Snooze 1 day'}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => applyAction(task, { status: 'done' })}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                  >
                    <Check size={14} /> Complete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
