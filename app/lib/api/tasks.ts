// lib/api/tasks.ts
import { Task } from "@/app/(dashboard)/dashboard/tasks/components/task";
import { deduplicateTasks } from "../utils/deduplicate";

export async function fetchTasksAPI(): Promise<Task[]> {


  try {

    const res = await fetch('/api/tasks/', {
      method: 'GET',
      headers: {
        'Content-type' : 'application/json',
      },
      credentials: 'include', // Important: send cookies for auth
    })

    if (!res.ok){
      throw new Error(`Internal API error: ${res.status}`);
    }

    const data = await res.json();
    const raw = Array.isArray(data)
      ? data
      : Array.isArray(data?.tasks)
        ? data.tasks
        : Array.isArray(data?.data)
          ? data.data
          : [];
    return deduplicateTasks(raw);

  }catch(error){
    console.log(`Internal Error: ${error}`);
    throw error;
  }
}


export async function createTask(taskData: {
    title: string;
    status: string | null;
    selectedProjectId: number | null;
    tags: string[];
    dueDate: Date | null;
    description: string;
    attachment: File | null;
}): Promise<any> {


    const res = await fetch("/api/tasks/", {
      method: "POST",
      headers: {
        'Content-type' : 'application/json',
      },
      credentials: 'include', // Important: send cookies for auth
      body : JSON.stringify(taskData),
    });

    if (!res.ok) throw new Error("Failed to create task");

    const data = await res.json();
    return data?.task ?? data ?? {};
}

// Fields the Django TaskSerializer accepts as writable on PATCH.
// Read-only fields (score, confidence, reasoning, slug, etc.) must be excluded
// or Django will 400 on certain field validations.
const TASK_WRITABLE_FIELDS: (keyof Task | string)[] = [
    'title',
    'description',
    'status',
    'priority',
    'due_date',
    'dueDate',
    'project',
    'selectedProjectId',
    'tags',
    'snoozed_until',
    'duration_estimate',
    'start_date',
];

export function sanitizeTaskForPatch(updates: Partial<Task> & Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    for (const key of TASK_WRITABLE_FIELDS) {
        if (key in updates) {
            // Send empty string as null for description so Django doesn't reject allow_blank=False
            if (key === 'description' && (updates[key] === '' || updates[key] == null)) {
                sanitized[key] = ' '; // single space satisfies allow_blank=False
            } else {
                sanitized[key] = (updates as any)[key];
            }
        }
    }
    // Always include required fields if present to avoid validation errors
    if (!('description' in sanitized) && !('title' in sanitized)) {
        // No required fields being changed — that's fine for partial=True
    }
    return sanitized;
}

export async function updateTaskAPI(taskId: number | string, updates: Partial<Task>): Promise<any> {
    try {
        const payload = sanitizeTaskForPatch(updates as any);
        const res = await fetch("/api/tasks/", {
            method: "PATCH",
            headers: {
                'Content-type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ id: taskId, ...payload }),
        });
        if (!res.ok) {
            const errText = await res.text().catch(() => '');
            console.warn(`Backend task update returned ${res.status}:`, errText);
            return null;
        }
        return await res.json();
    } catch (e) {
        console.warn("Backend API task update failed, cached locally", e);
        return null;
    }
}

export async function deleteTaskAPI(taskId: number | string): Promise<boolean> {
    try {
        const res = await fetch("/api/tasks/", {
            method: "DELETE",
            headers: {
                'Content-type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ id: taskId }),
        });
        return res.ok;
    } catch (e) {
        console.warn("Backend API task delete failed, deleted locally", e);
        return true;
    }
}

export async function rescoreTaskAPI(taskId: number | string): Promise<Task | null> {
    try {
        const res = await fetch('/api/tasks/', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id: taskId, action: 'rescore' }),
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.warn('Task rescore request failed', error);
        return null;
    }
}

export async function clearDemoTasksAPI(): Promise<{ success: boolean; deletedCount?: number; deletedIds?: string[] }> {
    try {
        const res = await fetch('/api/tasks/clear-demo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (!res.ok) {
            throw new Error(`Failed to clear demo tasks (${res.status})`);
        }
        const data = await res.json();
        return {
            success: true,
            deletedCount: data.deleted_count ?? 0,
            deletedIds: data.deleted_ids ?? [],
        };
    } catch (error) {
        console.warn('Failed to clear demo tasks on backend:', error);
        return { success: false };
    }
}
