import { init } from "next/dist/compiled/webpack/webpack";
import { initNovaCache } from "./NovaCache";
import { getCurrentUser, getTenant } from "../getTenant";


{/* User */}
export async function saveUserToCache( user: any[]) {
    const db = await initNovaCache();
    const tx = db.transaction('user', 'readwrite');
    for (const u of user) {
        await tx.store.put(u);
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

export async function getCachedProjectsWithMetadata() {
    const db = await initNovaCache();
    const all = await db.getAll('projects');

    const last_updated = all.length > 0
        ? Math.max(...all.map(project => project.last_updated || 0))
        : 0;

    return {projects: all, last_updated}

}

{/* Assignees */}

export async function saveAssigneesToCache(assignees: any[]) {
    const db = await initNovaCache();
    const tx = db.transaction('assignees', 'readwrite');
    for (const assignee of assignees){
        await tx.store.put(assignee);
    }

    await tx.done;
}

export async function getCachedAssignees(){
    const db = await initNovaCache();
    return await db.getAll('assignees');
}

export async function clearCachedAssignees(){
    const db = await initNovaCache();
    return await db.clear('assignees')
}

export async function getCachedAssigneesWithMetadata() {
    const db = await initNovaCache();
    const all = await db.getAll('assignees');

    const last_updated = all.length > 0
        ? Math.max(...all.map(assignee => assignee.last_updated || 0))
        : 0;

    return {assignees: all, last_updated}
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