// lib/api/tasks.ts
import { Task } from "@/app/(dashboard)/dashboard/tasks/components/task";

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
    return data.tasks || []; // Adjust based on backend

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
}): Promise<{id: string}> {


    const res = await fetch("/api/tasks/", {
      method: "POST",
      headers: {
        'Content-type' : 'application/json',
      },
      credentials: 'include', // Important: send cookies for auth
      body : JSON.stringify(taskData),
    });

    if (!res.ok) throw new Error("Failed to create task");

    return await res.json() || {}; // This gives you the created task object
}

export async function updateTaskAPI(taskId: number | string, updates: Partial<Task>): Promise<any> {
    try {
        const res = await fetch("/api/tasks/", {
            method: "PATCH",
            headers: {
                'Content-type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ id: taskId, ...updates }),
        });
        if (!res.ok) {
            console.warn(`Backend task update returned ${res.status}`);
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
