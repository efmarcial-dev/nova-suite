import { initNovaCache } from "./NovaCache";
import {
    areIdsEqual,
    deduplicateTasks,
    deduplicateProjects,
    mergeAndDeduplicateTasks,
    mergeAndDeduplicateProjects,
} from "../utils/deduplicate";


{/* User */}
export async function saveUserToCache(user: any[]) {
    if (!Array.isArray(user) || user.length === 0) return;
    const db = await initNovaCache();
    const tx = db.transaction('user', 'readwrite');
    for (const u of user) {
        if (!u) continue;
        const cacheId = u.id ?? u.email;
        if (cacheId === undefined || cacheId === null || !String(cacheId).trim()) continue;
        const validUser = { ...u, id: String(cacheId) };
        await tx.store.put(validUser);
    }
    await tx.done;
}

export async function getCachedUser() {
    const db = await initNovaCache();
    return await db.getAll('user');
}

export async function clearUserCache() {
    const db = await initNovaCache();
    await db.clear('user');
}


{/* Task */}
export async function saveTasksToCache(tasks: any[]) {
    if (!Array.isArray(tasks) || tasks.length === 0) return;
    const db = await initNovaCache();
    const existing = await db.getAll('tasks');
    const merged = mergeAndDeduplicateTasks(existing, tasks);
    const tx = db.transaction('tasks', 'readwrite');
    await tx.store.clear();
    for (const task of merged) {
        if (!task || task.id === undefined || task.id === null) continue;
        await tx.store.put(task);
    }
    await tx.done;
}

export async function replaceTasksInCache(tasks: any[]) {
    const db = await initNovaCache();
    const deduped = deduplicateTasks(tasks);
    const tx = db.transaction('tasks', 'readwrite');
    await tx.store.clear();
    for (const task of deduped) {
        if (!task || task.id === undefined || task.id === null) continue;
        await tx.store.put(task);
    }
    await tx.done;
}

export async function getCachedTasks() {
    const db = await initNovaCache();
    const all = await db.getAll('tasks');
    return deduplicateTasks(all);
} 

export async function clearTaskCache() {
    const db = await initNovaCache();
    await db.clear('tasks');
}

export async function getCachedTasksWithMetadata() {
    const db = await initNovaCache();
    const all = await db.getAll('tasks');
    const deduped = deduplicateTasks(all);

    // If duplicate records were found in cache, self-heal the cache in background
    if (deduped.length !== all.length) {
        replaceTasksInCache(deduped).catch(() => {});
    }

    const lastUpdated = deduped.length > 0
        ? Math.max(...deduped.map((task: any) => task.lastUpdated || task.last_updated || 0))
        : 0;

    return { tasks: deduped, lastUpdated };
}

export async function updateTaskInCache(updatedTask: any) {
    if (!updatedTask || updatedTask.id === undefined || updatedTask.id === null) return;
    const db = await initNovaCache();
    const all = await db.getAll('tasks');
    const tx = db.transaction('tasks', 'readwrite');
    // Delete any key variant (e.g. numeric vs string key)
    for (const t of all) {
        if (areIdsEqual(t.id, updatedTask.id) && t.id !== updatedTask.id) {
            await tx.store.delete(String(t.id) as any);
        }
    }
    await tx.store.put(updatedTask);
    await tx.done;
}

export async function deleteTaskInCache(taskId: any) {
    if (taskId === undefined || taskId === null) return;
    const db = await initNovaCache();
    const all = await db.getAll('tasks');
    const tx = db.transaction('tasks', 'readwrite');
    for (const t of all) {
        if (areIdsEqual(t.id, taskId)) {
            await tx.store.delete(String(t.id) as any);
        }
    }
    await tx.done;
}

{/* Projects */}
export async function saveProjectsToCache(projects: any[]) {
    if (!Array.isArray(projects) || projects.length === 0) return;
    const db = await initNovaCache();
    const existing = await db.getAll('projects');
    const merged = mergeAndDeduplicateProjects(existing, projects);
    const tx = db.transaction('projects', 'readwrite');
    await tx.store.clear();
    for (const project of merged) {
        if (!project || project.id === undefined || project.id === null) continue;
        await tx.store.put(project);
    }
    await tx.done;
}

export async function getCachedProjects() {
    const db = await initNovaCache();
    const all = await db.getAll('projects');
    return deduplicateProjects(all);
}

export async function clearCachedProjects() {
    const db = await initNovaCache();
    return await db.clear('projects');
}

export async function replaceProjectsInCache(projects: any[]) {
    const db = await initNovaCache();
    const deduped = deduplicateProjects(projects);
    const tx = db.transaction('projects', 'readwrite');
    await tx.store.clear();
    for (const project of deduped) {
        if (!project || project.id === undefined || project.id === null) continue;
        await tx.store.put(project);
    }
    await tx.done;
}

export async function updateProjectInCache(updatedProject: any) {
    if (!updatedProject || updatedProject.id === undefined || updatedProject.id === null) return;
    const db = await initNovaCache();
    const all = await db.getAll('projects');
    const tx = db.transaction('projects', 'readwrite');
    // Delete any key variant
    for (const p of all) {
        if (areIdsEqual(p.id, updatedProject.id) && p.id !== updatedProject.id) {
            await tx.store.delete(p.id);
        }
    }
    await tx.store.put(updatedProject);
    await tx.done;
}

export async function getCachedProjectsWithMetadata() {
    const db = await initNovaCache();
    const all = await db.getAll('projects');
    const deduped = deduplicateProjects(all);

    // If duplicate records were found in cache, self-heal the cache in background
    if (deduped.length !== all.length) {
        replaceProjectsInCache(deduped).catch(() => {});
    }

    const last_updated = deduped.length > 0
        ? Math.max(...deduped.map((project: any) => project.last_updated || project.lastUpdated || 0))
        : 0;

    return { projects: deduped, last_updated };
}

{/* Analytis */}
export async function SaveAnalyticsRecord(id: string, data: any){
    const db = await initNovaCache();
    await db.put('analytics', {
        id, 
        data,
        updatedAt: new Date().toISOString(),
    })
}

export async function getAnalyticsRecord(id: string) {
    const db = await initNovaCache();
    return await db.get('analytics', id);
}

export async function getCachedEmailInbox(key: string) {
    const db = await initNovaCache();
    return await db.get('emailInboxes', key);
}

export async function saveCachedEmailInbox(record: {
    key: string;
    userId: string;
    cachedAt: number;
    [key: string]: any;
}) {
    const db = await initNovaCache();
    await db.put('emailInboxes', record);
}

export async function deleteCachedEmailInbox(key: string) {
    const db = await initNovaCache();
    await db.delete('emailInboxes', key);
}

export async function clearCachedEmailInboxes(userId?: string) {
    const db = await initNovaCache();
    if (!userId) {
        await db.clear('emailInboxes');
        return;
    }

    const records = await db.getAll('emailInboxes');
    const tx = db.transaction('emailInboxes', 'readwrite');
    for (const record of records) {
        if (record.userId === String(userId)) await tx.store.delete(record.key);
    }
    await tx.done;
}
