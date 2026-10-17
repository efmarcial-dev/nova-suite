export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskUrgency = 'critical' | 'high' | 'medium' | 'low';

export type Task = {
  id: number;
  title: string;
  priority: TaskUrgency;
  confidence: number;
  reasoning: string;
  tags: string[];
  due_date: string;
  status: TaskStatus;
  project: number;
}; 