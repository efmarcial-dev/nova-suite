/**
 * Utility functions for ID normalization and deduplication of Tasks and Projects.
 * Safe for both server (Node.js API routes) and client (React/IndexedDB) usage.
 */

/**
 * Safely compares two IDs (numeric, string, or mixed) for equality.
 */
export function areIdsEqual(a: any, b: any): boolean {
  if (a === undefined || a === null || b === undefined || b === null) return false;
  return String(a).trim() === String(b).trim();
}

/**
 * Normalizes an ID: converts numeric strings to numbers if safe, otherwise trimmed string.
 */
export function normalizeId(id: any): number | string {
  if (id === undefined || id === null) return '';
  if (typeof id === 'number') return id;
  const trimmed = String(id).trim();
  const num = Number(trimmed);
  if (!isNaN(num) && String(num) === trimmed && trimmed !== '') {
    return num;
  }
  return trimmed;
}

/**
 * Deduplicates tasks.
 * - Handles unwrapping if item is wrapped as `{ task: ... }`.
 * - Deduplicates by ID (treating string '1' and number 1 as identical).
 * - Coalesces temporary local tasks ('local-...') into real backend tasks when title & project match.
 * - Merges and preserves the latest timestamps and most complete fields.
 */
export function deduplicateTasks<T extends Record<string, any>>(tasks: T[]): T[] {
  if (!Array.isArray(tasks)) return [];

  const result: T[] = [];
  const idMap = new Map<string, number>(); // normalized string id -> index in result
  const titleProjectMap = new Map<string, number>(); // title::project -> index in result

  for (const raw of tasks) {
    if (!raw) continue;
    // Unwrap if wrapped in { task: ... }
    const task = raw.task ? { ...raw.task, ...raw } : { ...raw };
    if (task.id === undefined || task.id === null) continue;

    const idStr = String(task.id).trim();
    if (!idStr) continue;

    const title = String(task.title || '').trim().toLowerCase();
    const project = String(task.project ?? task.projectId ?? '').trim();
    const titleKey = title ? `${title}::${project}` : '';
    const isLocal = idStr.startsWith('local-') || idStr.startsWith('temp-');

    // 1. Check if ID already exists
    if (idMap.has(idStr)) {
      const idx = idMap.get(idStr)!;
      const existing = result[idx];
      const existingTime = Number(existing.lastUpdated || existing.last_updated || 0);
      const newTime = Number(task.lastUpdated || task.last_updated || 0);
      if (newTime >= existingTime) {
        result[idx] = { ...existing, ...task };
      } else {
        result[idx] = { ...task, ...existing };
      }
      continue;
    }

    // 2. Check if a task with the same title & project exists where one is local
    if (titleKey && titleProjectMap.has(titleKey)) {
      const idx = titleProjectMap.get(titleKey)!;
      const existing = result[idx];
      const existingIdStr = String(existing.id).trim();
      const existingIsLocal = existingIdStr.startsWith('local-') || existingIdStr.startsWith('temp-');

      if (existingIsLocal && !isLocal) {
        // Backend task arrived: replace temporary local task
        idMap.delete(existingIdStr);
        result[idx] = { ...existing, ...task };
        idMap.set(idStr, idx);
        continue;
      } else if (!existingIsLocal && isLocal) {
        // We already have the real backend task: skip adding local placeholder
        continue;
      }
    }

    // Add unique task
    const newIdx = result.length;
    result.push(task as T);
    idMap.set(idStr, newIdx);
    if (titleKey && !titleProjectMap.has(titleKey)) {
      titleProjectMap.set(titleKey, newIdx);
    }
  }

  return result;
}

/**
 * Deduplicates projects.
 * - Handles unwrapping if item is wrapped as `{ project: ... }`.
 * - Deduplicates by ID (treating string '1' and number 1 as identical).
 * - Coalesces temporary local projects ('local-...') into real backend projects when title matches.
 * - Merges and preserves the latest timestamps and most complete fields.
 */
export function deduplicateProjects<T extends Record<string, any>>(projects: T[]): T[] {
  if (!Array.isArray(projects)) return [];

  const result: T[] = [];
  const idMap = new Map<string, number>(); // normalized string id -> index in result
  const titleMap = new Map<string, number>(); // normalized title -> index in result

  for (const raw of projects) {
    if (!raw) continue;
    const project = raw.project ? { ...raw.project, ...raw } : { ...raw };
    if (project.id === undefined || project.id === null) continue;

    const idStr = String(project.id).trim();
    if (!idStr) continue;

    const title = String(project.title || project.projectName || project.name || '').trim().toLowerCase();
    const isLocal = idStr.startsWith('local-') || idStr.startsWith('temp-');

    // 1. Check if ID already exists
    if (idMap.has(idStr)) {
      const idx = idMap.get(idStr)!;
      const existing = result[idx];
      const existingTime = Number(existing.last_updated || existing.lastUpdated || 0);
      const newTime = Number(project.last_updated || project.lastUpdated || 0);
      if (newTime >= existingTime) {
        result[idx] = { ...existing, ...project };
      } else {
        result[idx] = { ...project, ...existing };
      }
      continue;
    }

    // 2. Check if a project with the same title exists where one is local
    if (title && titleMap.has(title)) {
      const idx = titleMap.get(title)!;
      const existing = result[idx];
      const existingIdStr = String(existing.id).trim();
      const existingIsLocal = existingIdStr.startsWith('local-') || existingIdStr.startsWith('temp-');

      if (existingIsLocal && !isLocal) {
        // Backend project arrived: replace temporary local project
        idMap.delete(existingIdStr);
        result[idx] = { ...existing, ...project };
        idMap.set(idStr, idx);
        continue;
      } else if (!existingIsLocal && isLocal) {
        // Real backend project already exists: skip local placeholder
        continue;
      }
    }

    // Add unique project
    const newIdx = result.length;
    result.push(project as T);
    idMap.set(idStr, newIdx);
    if (title && !titleMap.has(title)) {
      titleMap.set(title, newIdx);
    }
  }

  return result;
}

/**
 * Merges existing array of tasks with incoming array and deduplicates.
 */
export function mergeAndDeduplicateTasks<T extends Record<string, any>>(existing: T[], incoming: T[]): T[] {
  return deduplicateTasks([...(existing || []), ...(incoming || [])]);
}

/**
 * Merges existing array of projects with incoming array and deduplicates.
 */
export function mergeAndDeduplicateProjects<T extends Record<string, any>>(existing: T[], incoming: T[]): T[] {
  return deduplicateProjects([...(existing || []), ...(incoming || [])]);
}
