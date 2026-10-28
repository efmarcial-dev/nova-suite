"use client";

import { useEffect, useRef, useState } from "react";
import {
    getCachedTasksWithMetadata,
    replaceTasksInCache,
    saveTasksToCache,
    updateTaskInCache,
    deleteTaskInCache,
} from "../lib/cache/NovaCacheHelpers";
import { fetchTasksAPI } from "../lib/api/tasks";
import { areIdsEqual, deduplicateTasks } from "../lib/utils/deduplicate";
import { isDemoTask } from "../lib/constants/starterWorkspace";

export function useCachedTasks() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fromCache, setFromCache] = useState(false);
    const taskChangeVersion = useRef(0);

    useEffect(() => {
        let isMounted = true;

        async function load() {
            const { tasks: cached } = await getCachedTasksWithMetadata();

            if (isMounted && cached.length > 0) {
                const dedupedCached = deduplicateTasks(cached);
                setTasks(dedupedCached);
                setFromCache(true);
                setIsLoading(false);
            }

            try {
                // Render cached tasks quickly, then reconcile with Django on each
                // mount so deleted or out-of-date local records cannot be edited.
                const versionAtFetchStart = taskChangeVersion.current;
                let fresh = await fetchTasksAPI();

                // If user has explicitly removed demo tasks, filter out any demo tasks
                if (typeof window !== 'undefined' && localStorage.getItem('nova_demo_tasks_cleared') === 'true') {
                    fresh = fresh.filter((task) => !isDemoTask(task));
                }

                const withTimestamps = fresh.map((task) => ({
                    ...task,
                    lastUpdated: Date.now(),
                }));

                const dedupedFresh = deduplicateTasks(withTimestamps);

                if (taskChangeVersion.current !== versionAtFetchStart) return;
                await replaceTasksInCache(dedupedFresh);

                if (isMounted) {
                    setTasks(dedupedFresh);
                    setFromCache(false);
                }
            } catch (error) {
                console.log('Could not refresh tasks from Django; keeping cached tasks.', error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        load();

        const handleTaskChange = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (!detail) return;
            taskChangeVersion.current += 1;

            if (detail.action === 'create' && detail.task) {
                const newTask = detail.task.task ? { ...detail.task.task, ...detail.task } : detail.task;
                if (!newTask || newTask.id === undefined) return;

                setTasks((prev) => {
                    const taskTitle = String(newTask.title || '').trim().toLowerCase();
                    const taskProject = String(newTask.project ?? newTask.projectId ?? '').trim();
                    const isLocal = String(newTask.id).startsWith('local-') || String(newTask.id).startsWith('temp-');

                    const existsIndex = prev.findIndex((t) => {
                        if (areIdsEqual(t.id, newTask.id)) return true;
                        const tTitle = String(t.title || '').trim().toLowerCase();
                        const tProject = String(t.project ?? t.projectId ?? '').trim();
                        const tIsLocal = String(t.id).startsWith('local-') || String(t.id).startsWith('temp-');
                        return tTitle && tTitle === taskTitle && tProject === taskProject && (tIsLocal || isLocal);
                    });

                    if (existsIndex >= 0) {
                        return prev.map((t, idx) => (idx === existsIndex ? { ...t, ...newTask } : t));
                    }
                    return [newTask, ...prev];
                });
            } else if (detail.action === 'update' && detail.task) {
                const updated = detail.task.task ? { ...detail.task.task, ...detail.task } : detail.task;
                if (!updated || updated.id === undefined) return;

                setTasks((prev) =>
                    prev.map((t) => (areIdsEqual(t.id, updated.id) ? { ...t, ...updated } : t))
                );
            } else if (detail.action === 'delete' && detail.taskId !== undefined) {
                setTasks((prev) => prev.filter((t) => !areIdsEqual(t.id, detail.taskId)));
            } else if (detail.action === 'refresh' && Array.isArray(detail.tasks)) {
                setTasks(deduplicateTasks(detail.tasks));
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('nova:task-change', handleTaskChange);
        }

        return () => {
            isMounted = false;
            if (typeof window !== 'undefined') {
                window.removeEventListener('nova:task-change', handleTaskChange);
            }
        };
    }, []);

    // Add new task to memory and cache
    const addTaskToCache = async (newTask: any) => {
        const task = newTask?.task ? { ...newTask.task, ...newTask } : newTask;
        if (!task || task.id === undefined) return;

        setTasks((prev) => {
            const taskTitle = String(task.title || '').trim().toLowerCase();
            const taskProject = String(task.project ?? task.projectId ?? '').trim();
            const isLocal = String(task.id).startsWith('local-') || String(task.id).startsWith('temp-');

            const existsIndex = prev.findIndex((t) => {
                if (areIdsEqual(t.id, task.id)) return true;
                const tTitle = String(t.title || '').trim().toLowerCase();
                const tProject = String(t.project ?? t.projectId ?? '').trim();
                const tIsLocal = String(t.id).startsWith('local-') || String(t.id).startsWith('temp-');
                return tTitle && tTitle === taskTitle && tProject === taskProject && (tIsLocal || isLocal);
            });

            if (existsIndex >= 0) {
                return prev.map((t, idx) => (idx === existsIndex ? { ...t, ...task } : t));
            }
            return [task, ...prev];
        });

        await updateTaskInCache(task);
    };

    // Update existing task in memory and cache
    const updateTask = async (updatedTask: any) => {
        const task = updatedTask?.task ? { ...updatedTask.task, ...updatedTask } : updatedTask;
        if (!task || task.id === undefined) return;

        const normalized = { ...task, lastUpdated: Date.now() };
        setTasks((prev) =>
            prev.map((t) => (areIdsEqual(t.id, normalized.id) ? { ...t, ...normalized } : t))
        );
        await updateTaskInCache(normalized);
    };

    // Delete task from cache
    const deleteTaskFromCache = async (taskId: number | string) => {
        setTasks((prev) => prev.filter((task) => !areIdsEqual(task.id, taskId)));
        await deleteTaskInCache(taskId);
    };

    return {
        tasks,
        setTasks,
        addTaskToCache,
        updateTask,
        deleteTaskFromCache,
        isLoading,
        fromCache,
    };
}
