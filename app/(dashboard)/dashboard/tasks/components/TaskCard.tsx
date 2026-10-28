'use client';

import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/app/lib/utils';
import { Task } from './task';
import { computeTaskAIScore } from '@/app/lib/aiScoring';
import { CalendarDays, AlertTriangle, Sparkles, ChevronRight } from 'lucide-react';

const priorityConfig: Record<string, { border: string; badge: string; label: string }> = {
  critical: { border: 'border-l-rose-500', badge: 'bg-rose-50 text-rose-600 border-rose-100', label: 'Critical' },
  high:     { border: 'border-l-orange-400', badge: 'bg-orange-50 text-orange-600 border-orange-100', label: 'High' },
  medium:   { border: 'border-l-yellow-400', badge: 'bg-yellow-50 text-yellow-600 border-yellow-100', label: 'Medium' },
  low:      { border: 'border-l-emerald-400', badge: 'bg-emerald-50 text-emerald-600 border-emerald-100', label: 'Low' },
};

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 50 }
    : undefined;

  const cfg = priorityConfig[task.priority?.toLowerCase()] ?? priorityConfig.low;
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';

  const aiScore = computeTaskAIScore(task);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        // Only trigger click if not dragged
        if (!isDragging && onClick) {
          onClick();
        }
      }}
      className={cn(
        'group bg-white rounded-xl shadow-xs border border-[--border] border-l-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 cursor-pointer select-none',
        cfg.border,
        isDragging && 'opacity-60 shadow-xl'
      )}
    >
      <div className="p-3.5 space-y-2.5">
        {/* Top row: Priority badge + AI Score Pill */}
        <div className="flex items-center justify-between gap-1.5">
          <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-md border', cfg.badge)}>
            {cfg.label}
          </span>

          {/* AI Score pill */}
          <div
            title={`AI Importance Score: ${aiScore.score}/100 based on deadline and priority`}
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${aiScore.badgeBg} ${aiScore.badgeBorder} ${aiScore.badgeText}`}
          >
            <Sparkles size={10} className="shrink-0" />
            <span>{aiScore.score} AI</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-sm font-semibold text-[--foreground] leading-snug group-hover:text-[#1EA0FF] transition-colors">
          {task.title}
        </h2>

        {/* AI Reasoning / Context */}
        {aiScore.reasonSummary && (
          <p className="text-xs text-[--muted-foreground] line-clamp-2 leading-relaxed bg-[--background] p-1.5 rounded-lg border border-[--border]/60">
            {aiScore.reasonSummary}
          </p>
        )}

        {/* Tags */}
        {task.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F0F9FF] text-[#1EA0FF] border border-[#BFE7FF]">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom row: Due date + Open details indicator */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-[--border]">
          {task.due_date ? (
            <div className={cn('flex items-center gap-1.5 text-[11px] font-medium', isOverdue ? 'text-rose-600 font-semibold' : 'text-[--muted-foreground]')}>
              {isOverdue ? <AlertTriangle size={12} /> : <CalendarDays size={12} />}
              {task.due_date}
            </div>
          ) : (
            <span className="text-[11px] text-[--muted-foreground]">No deadline</span>
          )}

          <span className="text-[11px] text-[#1EA0FF] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
            Inspect <ChevronRight size={12} />
          </span>
        </div>
      </div>
    </div>
  );
}
