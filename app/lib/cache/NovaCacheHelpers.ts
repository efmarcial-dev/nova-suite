import { initNovaCache } from "./NovaCache";


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

    const db = await initNovaCache();
    const tx = db.transaction('tasks', 'readwrite');
    for (const task of tasks) {
        await tx.store.put(task);
    }

    await tx.done;
}

export async function replaceTasksInCache(tasks: any[]) {
    const db = await initNovaCache();
    const tx = db.transaction('tasks', 'readwrite');
    await tx.store.clear();
    for (const task of tasks) {
        if (!task?.id) continue;
        await tx.store.put(task);
    }
    await tx.done;
}


export async function getCachedTasks() {
    const db = await initNovaCache();
    return await db.getAll('tasks');
} 

export async function clearTaskCache() {
    const db = await initNovaCache();
    await db.clear('tasks');
}

export async function getCachedTasksWithMetadata() {
    const db = await initNovaCache();
    const all = await db.getAll('tasks');

    const lastUpdated = all.length > 0
        ? Math.max(...all.map(task => task.lastUpdated || 0))
        : 0;

    return {tasks: all, lastUpdated}

}

export async function updateTaskInCache(updatedTask: any) {
    const db = await initNovaCache();
    await db.put('tasks', updatedTask); // 'put' will update by key
}

export async function deleteTaskInCache(taskId: any) {
    const db = await initNovaCache();
    await db.delete('tasks', taskId);
}

{/* Projects */}
export async function saveProjectsToCache(projects: any[]) {
  const db = await initNovaCache();
  const tx = db.transaction('projects', 'readwrite');
  for (const project of projects) {
    await tx.store.put(project);
  }
  await tx.done;
}

export async function getCachedProjects() {
  const db = await initNovaCache();
  return await db.getAll('projects');
}

export async function clearCachedProjects() {
    const db = await initNovaCache();
    return await db.clear('projects');
}

export async function updateProjectInCache(updatedProject: any) {
    const db = await initNovaCache();
    await db.put('projects', updatedProject);
}

export async function getCachedProjectsWithMetadata() {
    const db = await initNovaCache();
    const all = await db.getAll('projects');

    const last_updated = all.length > 0
        ? Math.max(...all.map(project => project.last_updated || 0))
        : 0;

    return {projects: all, last_updated}

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
