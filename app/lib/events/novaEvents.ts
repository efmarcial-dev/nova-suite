// lib/events/novaEvents.ts
'use client';

type TaskEventDetail = {
  action: 'create' | 'update' | 'delete' | 'refresh';
  task?: any;
  taskId?: number | string;
  tasks?: any[];
};

type ProjectEventDetail = {
  action: 'create' | 'update' | 'delete' | 'refresh';
  project?: any;
  projectId?: number | string;
  projects?: any[];
};

export const NOVA_TASK_EVENT = 'nova:task-change';
export const NOVA_PROJECT_EVENT = 'nova:project-change';

export function emitTaskChangeEvent(detail: TaskEventDetail) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(NOVA_TASK_EVENT, { detail }));
  }
}

export function emitProjectChangeEvent(detail: ProjectEventDetail) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(NOVA_PROJECT_EVENT, { detail }));
  }
}
