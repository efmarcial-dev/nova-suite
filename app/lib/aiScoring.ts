import { Task } from '@/app/(dashboard)/dashboard/tasks/components/task';

export interface AIScoreResult {
  score: number; // 0 - 100
  tier: 'critical' | 'high' | 'medium' | 'low';
  badgeLabel: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  reasonSummary: string;
  breakdown: {
    priorityScore: number;
    urgencyScore: number;
    confidenceScore: number;
  };
}

export function computeTaskAIScore(task: Partial<Task>): AIScoreResult {
  const priority = (task.priority || 'medium').toLowerCase();
  const confidence = task.confidence ?? 80;
  const dueDateStr = task.due_date;

  // 1. Priority Base Score (up to 45 pts)
  let priorityScore = 25;
  if (priority === 'critical') priorityScore = 45;
  else if (priority === 'high') priorityScore = 38;
  else if (priority === 'medium') priorityScore = 24;
  else if (priority === 'low') priorityScore = 12;

  // 2. Urgency & Proximity Score (up to 35 pts)
  let urgencyScore = 15;
  let isOverdue = false;
  let isDueSoon = false;

  if (dueDateStr) {
    try {
      const now = new Date();
      const due = new Date(dueDateStr);
      const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (diffHours < 0 && task.status !== 'done') {
        urgencyScore = 35; // Overdue
        isOverdue = true;
      } else if (diffHours <= 24) {
        urgencyScore = 30; // Due within 24h
        isDueSoon = true;
      } else if (diffHours <= 72) {
        urgencyScore = 24; // Due within 3 days
      } else if (diffHours <= 168) {
        urgencyScore = 18; // Due this week
      } else {
        urgencyScore = 10;
      }
    } catch {
      urgencyScore = 15;
    }
  }

  // 3. AI Backend Confidence factor (up to 20 pts)
  const confidenceScore = Math.round((Math.min(100, Math.max(0, confidence)) / 100) * 20);

  // Prefer the persisted Django score when available. The API stores this as 0–1;
  // confidence is its legacy alias and may also contain that normalized value.
  const rawScore = priorityScore + urgencyScore + confidenceScore;
  const storedScore = typeof task.score === 'number' ? task.score : task.confidence;
  const score = typeof storedScore === 'number'
    ? Math.min(100, Math.max(0, Math.round(storedScore <= 1 ? storedScore * 100 : storedScore)))
    : Math.min(100, Math.max(5, rawScore));

  // Determine Tier & Styling
  let tier: 'critical' | 'high' | 'medium' | 'low' = 'medium';
  let badgeLabel = 'Moderate';
  let badgeBg = 'bg-[#F0F9FF]';
  let badgeBorder = 'border-[#BFE7FF]';
  let badgeText = 'text-[#0088EE]';

  if (score >= 88 || isOverdue) {
    tier = 'critical';
    badgeLabel = isOverdue ? 'Overdue • Action Needed' : 'Critical Priority';
    badgeBg = 'bg-rose-50';
    badgeBorder = 'border-rose-200';
    badgeText = 'text-rose-700';
  } else if (score >= 72) {
    tier = 'high';
    badgeLabel = isDueSoon ? 'Due Soon • High Impact' : 'High Priority';
    badgeBg = 'bg-orange-50';
    badgeBorder = 'border-orange-200';
    badgeText = 'text-orange-700';
  } else if (score >= 48) {
    tier = 'medium';
    badgeLabel = 'Standard Pace';
    badgeBg = 'bg-[#F0F9FF]';
    badgeBorder = 'border-[#BFE7FF]';
    badgeText = 'text-[#0088EE]';
  } else {
    tier = 'low';
    badgeLabel = 'Low Urgency';
    badgeBg = 'bg-slate-100';
    badgeBorder = 'border-slate-200';
    badgeText = 'text-slate-600';
  }

  // Reasoning summary
  let reasonSummary = task.scoring_explanation || task.reasoning || '';
  if (!reasonSummary) {
    if (isOverdue) reasonSummary = 'Task passed its deadline. Elevated to top of assistant queue.';
    else if (isDueSoon) reasonSummary = 'Due within 24 hours with high impact on active project.';
    else if (priority === 'high' || priority === 'critical') reasonSummary = 'High priority deliverable flagged by executive planner.';
    else reasonSummary = 'Scheduled standard priority item for upcoming milestones.';
  }

  return {
    score,
    tier,
    badgeLabel,
    badgeBg,
    badgeBorder,
    badgeText,
    reasonSummary,
    breakdown: {
      priorityScore,
      urgencyScore,
      confidenceScore,
    },
  };
}
