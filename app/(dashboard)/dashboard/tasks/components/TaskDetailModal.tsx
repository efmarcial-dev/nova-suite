'use client';

import { useState, useEffect } from 'react';
import { Task } from './task';
import { computeTaskAIScore } from '@/app/lib/aiScoring';
import { useCachedProjects } from '@/app/hooks/useCachedProjects';
import ModalPanel from '@/app/components/ModalPanel';
import {
  Sparkles,
  CalendarDays,
  Tag,
  Briefcase,
  X,
  Check,
  Trash2,
  Send,
  Zap,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: Task) => void;
  onDelete?: (taskId: Task['id']) => void;
  onRescore?: (task: Task) => Promise<void>;
}

export default function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onRescore,
}: TaskDetailModalProps) {
  const { projects } = useCachedProjects();

  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<Task['status']>('todo');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState<number | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [delegatedToast, setDelegatedToast] = useState(false);
  const [isRescoring, setIsRescoring] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setStatus(task.status || 'todo');
      setPriority(task.priority || 'medium');
      setDueDate(task.due_date || '');
      setProjectId(task.project);
      setTags(task.tags || []);
    }
  }, [task]);

  if (!task) return null;

  const aiScore = computeTaskAIScore({
    ...task,
    title,
    priority,
    due_date: dueDate,
    status,
  });

  const handleSave = () => {
    setIsSaving(true);
    const updated: Task = {
      ...task,
      title,
      status,
      priority,
      due_date: dueDate,
      project: projectId as any,
      tags,
    };
    onUpdate(updated);
    setIsSaving(false);
    onClose();
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleDelegate = () => {
    setDelegatedToast(true);
    setTimeout(() => setDelegatedToast(false), 3000);
  };

  return (
    <ModalPanel isOpen={isOpen} onClose={onClose}>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[--border] pb-4">
          <div className="space-y-1 pr-6 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-[--muted-foreground]">
                TASK-{task.id}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${aiScore.badgeBg} ${aiScore.badgeBorder} ${aiScore.badgeText}`}>
                {aiScore.badgeLabel}
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg font-bold text-[--foreground] bg-transparent border-b border-transparent hover:border-[--border] focus:border-[#1EA0FF] outline-none transition-colors py-1"
              placeholder="Task Title..."
            />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[--muted-foreground] hover:text-[--foreground] hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* AI Scoring & Diagnostic Card */}
        <div className="rounded-2xl bg-gradient-to-br from-[#F0F9FF] via-white to-violet-50/70 border border-[#BFE7FF] p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#1EA0FF] text-white flex items-center justify-center shadow-xs">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[--foreground]">Executive AI Scoring Diagnostic</h3>
                <p className="text-xs text-[--muted-foreground]">Profile aware priority from your deadlines and task context</p>
              </div>
            </div>
            {/* Score circle */}
            <div className="flex items-baseline gap-1 bg-white px-3 py-1.5 rounded-xl border border-[#BFE7FF] shadow-xs">
              <span className="text-xl font-black text-[#1EA0FF] tracking-tight">{aiScore.score}</span>
              <span className="text-[11px] font-semibold text-[--muted-foreground]">/ 100</span>
            </div>
          </div>

          {/* Reasoning */}
          <div className="bg-white/90 rounded-xl p-3 border border-[#F0F9FF] text-xs text-[--foreground] leading-relaxed">
            <span className="font-semibold text-[#0D1B2A]">AI Reasoning: </span>
            {aiScore.reasonSummary}
          </div>

          <p className="text-[11px] text-[--muted-foreground]">
            The score is refreshed when task details change, when you update your priority profile, or when you choose Analyze again.
          </p>

          {/* Quick delegate action */}
          <div className="pt-1 flex items-center justify-between">
            <button
              type="button"
              disabled={isRescoring || !onRescore}
              onClick={async () => {
                if (!onRescore) return;
                setIsRescoring(true);
                try { await onRescore(task); } finally { setIsRescoring(false); }
              }}
              className="flex items-center gap-1.5 rounded-xl border border-[#BFE7FF] bg-white px-3 py-1.5 text-xs font-semibold text-[#0088EE] transition hover:bg-[#F0F9FF] disabled:opacity-50"
            >
              <Sparkles size={12} /> {isRescoring ? 'Analyzing…' : 'Analyze again'}
            </button>
            <button
              type="button"
              onClick={handleDelegate}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#1EA0FF] hover:text-[#0088EE] bg-white hover:bg-[#F0F9FF] px-3 py-1.5 rounded-xl border border-[#BFE7FF] transition-colors cursor-pointer"
            >
              <Send size={12} /> Ask Assistant to Draft / Delegate Task
            </button>
            {delegatedToast && (
              <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                <Check size={12} /> Dispatched to Assistant!
              </span>
            )}
          </div>
        </div>

        {/* Status Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[--foreground] uppercase tracking-wide">
            Status
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: 'todo' as const, label: 'To Do', dot: 'bg-slate-400' },
              { value: 'in_progress' as const, label: 'In Progress', dot: 'bg-[#1EA0FF]' },
              { value: 'in_review' as const, label: 'In Review', dot: 'bg-amber-400' },
              { value: 'done' as const, label: 'Done', dot: 'bg-emerald-500' },
            ].map((s) => {
              const isSelected = status === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatus(s.value)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-medium border transition-all ${
                    isSelected
                      ? 'border-[#1EA0FF] bg-[#F0F9FF] text-[#0088EE] font-semibold shadow-xs'
                      : 'border-[--border] bg-white text-[--muted-foreground] hover:border-gray-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[--foreground] uppercase tracking-wide">
            Priority Level
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: 'low' as const, label: 'Low', color: 'text-emerald-700 border-emerald-200 bg-emerald-50' },
              { value: 'medium' as const, label: 'Medium', color: 'text-amber-700 border-amber-200 bg-amber-50' },
              { value: 'high' as const, label: 'High', color: 'text-orange-700 border-orange-200 bg-orange-50' },
              { value: 'critical' as const, label: 'Critical', color: 'text-rose-700 border-rose-200 bg-rose-50' },
            ].map((p) => {
              const isSelected = priority === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                    isSelected
                      ? `${p.color} font-semibold ring-2 ring-[#1EA0FF]/30`
                      : 'border-[--border] bg-white text-[--muted-foreground] hover:border-gray-300'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Due Date & Project Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[--foreground] uppercase tracking-wide flex items-center gap-1.5">
              <CalendarDays size={13} className="text-[--muted-foreground]" />
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-[#1EA0FF]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[--foreground] uppercase tracking-wide flex items-center gap-1.5">
              <Briefcase size={13} className="text-[--muted-foreground]" />
              Assigned Project
            </label>
            <select
              value={projectId ?? ''}
              onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 text-xs bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-[#1EA0FF]"
            >
              <option value="">No Project Assigned</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title ?? p.projectName ?? `Project #${p.id}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[--foreground] uppercase tracking-wide flex items-center gap-1.5">
            <Tag size={13} className="text-[--muted-foreground]" />
            Tags
          </label>
          <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[--background] border border-[--border] rounded-xl min-h-[42px]">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-[#F0F9FF] text-[#0088EE] border border-[#BFE7FF]"
              >
                {t}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  className="hover:text-rose-600 transition-colors"
                >
                  <X size={11} />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type tag & press Enter..."
              className="flex-1 min-w-[120px] text-xs bg-transparent outline-none py-1 px-1 placeholder:text-[--muted-foreground]"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[--border]">
          {onDelete ? (
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to delete this task?')) {
                  onDelete(task.id);
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors"
            >
              <Trash2 size={13} /> Delete Task
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[--muted-foreground] hover:text-[--foreground] hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSaving || !title.trim()}
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-medium gradient-brand text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md shadow-blue-500/10"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </ModalPanel>
  );
}
