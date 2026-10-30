import { fetchTasksAPI } from '@/app/lib/api/tasks';
import { fetchProjectsAPI } from '@/app/lib/api/projects';
import {
  getCachedProjects,
  getCachedTasks,
  replaceProjectsInCache,
  replaceTasksInCache,
} from '@/app/lib/cache/NovaCacheHelpers';
import { areIdsEqual, deduplicateProjects, deduplicateTasks } from '@/app/lib/utils/deduplicate';
import { isDemoProject, isDemoTask } from '@/app/lib/constants/starterWorkspace';

let sessionTasks: any[] | null = null;
let tasksRequest: Promise<any[]> | null = null;
let sessionProjects: any[] | null = null;
let projectsRequest: Promise<any[]> | null = null;

export function upsertTaskForSession(task: any) {
  sessionTasks = deduplicateTasks([...(sessionTasks || []).filter((item) => !areIdsEqual(item.id, task.id)), task]);
}

export function updateTaskForSession(task: any) {
  sessionTasks = (sessionTasks || []).map((item) => areIdsEqual(item.id, task.id) ? { ...item, ...task } : item);
}

export function deleteTaskForSession(taskId: string | number) {
  sessionTasks = (sessionTasks || []).filter((item) => !areIdsEqual(item.id, taskId));
}

export function upsertProjectForSession(project: any) {
  sessionProjects = deduplicateProjects([...(sessionProjects || []).filter((item) => !areIdsEqual(item.id, project.id)), project]);
}

export function updateProjectForSession(project: any) {
  sessionProjects = (sessionProjects || []).map((item) => areIdsEqual(item.id, project.id) ? { ...item, ...project } : item);
}

export function ensureTasksForSession(): Promise<any[]> {
  if (sessionTasks) {
    return getCachedTasks().catch(() => sessionTasks || []);
  }
  if (tasksRequest) return tasksRequest;

  tasksRequest = (async () => {
    let fresh = await fetchTasksAPI();
    if (typeof window !== 'undefined' && localStorage.getItem('nova_demo_tasks_cleared') === 'true') {
      fresh = fresh.filter((task) => !isDemoTask(task));
    }
    const normalized = deduplicateTasks(fresh.map((task) => ({ ...task, lastUpdated: Date.now() })));
    sessionTasks = normalized;
    void replaceTasksInCache(normalized).catch((error) => console.warn('Could not save task cache.', error));
    return normalized;
  })().finally(() => {
    tasksRequest = null;
  });
  return tasksRequest;
}

export function ensureProjectsForSession(): Promise<any[]> {
  if (sessionProjects) {
    return getCachedProjects().catch(() => sessionProjects || []);
  }
  if (projectsRequest) return projectsRequest;

  projectsRequest = (async () => {
    let fresh = await fetchProjectsAPI();
    if (typeof window !== 'undefined' && localStorage.getItem('nova_demo_projects_cleared') === 'true') {
      fresh = fresh.filter((project) => !isDemoProject(project));
    }
    const normalized = deduplicateProjects(fresh.map((project) => ({ ...project, last_updated: Date.now() })));
    sessionProjects = normalized;
    void replaceProjectsInCache(normalized).catch((error) => console.warn('Could not save project cache.', error));
    return normalized;
  })().finally(() => {
    projectsRequest = null;
  });
  return projectsRequest;
}

export async function warmDashboardData() {
  await Promise.allSettled([ensureTasksForSession(), ensureProjectsForSession()]);
}
