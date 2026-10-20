export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskUrgency = 'critical' | 'high' | 'medium' | 'low';

export type Task = {
  id: number | string;
  title: string;
  description?: string;
  priority: TaskUrgency;
  confidence: number;
  reasoning: string;
  score?: number;
  scoring_explanation?: string;
  snoozed_until?: string | null;
  tags: string[];
  due_date: string;
  status: TaskStatus;
  project: number;
};
