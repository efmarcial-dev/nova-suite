"use client";

import { useEffect, useRef, useState } from "react";
import { getCachedTasksWithMetadata, replaceTasksInCache, saveTasksToCache } from "../lib/cache/NovaCacheHelpers";
import { fetchTasksAPI } from "../lib/api/tasks";

export function useCachedTasks() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [isLoading, setIsLoading] =  useState(true);
    const [fromCache, setFromCache] = useState(false);
    const taskChangeVersion = useRef(0);

    useEffect(()=> {
        let isMounted = true;

        async function load() {
            const {tasks: cached} = await getCachedTasksWithMetadata();

            if (isMounted && cached.length > 0) {
                
                setTasks(cached);
                setFromCache(true);
                setIsLoading(false);
                console.log("Found tasks in cache ")
            }

            try {
                // Render cached tasks quickly, then reconcile with Django on each
                // mount so deleted or out-of-date local records cannot be edited.
                const versionAtFetchStart = taskChangeVersion.current;
                const fresh = await fetchTasksAPI();
                const withTimestamps = fresh.map(task => ({
                    ...task,
                    lastUpdated: Date.now()
                }));

                if (taskChangeVersion.current !== versionAtFetchStart) return;
                await replaceTasksInCache(withTimestamps);

                if (isMounted) {
                    setTasks(withTimestamps);
                    setFromCache(false);
                }
            } catch(error){
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
                setTasks(prev => {
                    const exists = prev.some(t => t.id === detail.task.id);
                    if (exists) return prev.map(t => t.id === detail.task.id ? detail.task : t);
                    return [detail.task, ...prev];
                });
            } else if (detail.action === 'update' && detail.task) {
                setTasks(prev => prev.map(t => t.id === detail.task.id ? { ...t, ...detail.task } : t));
            } else if (detail.action === 'delete' && detail.taskId) {
                setTasks(prev => prev.filter(t => t.id !== detail.taskId));
            } else if (detail.action === 'refresh' && Array.isArray(detail.tasks)) {
                setTasks(detail.tasks);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('nova:task-change', handleTaskChange);
        }

        return ()=> {
            isMounted = false;
            if (typeof window !== 'undefined') {
                window.removeEventListener('nova:task-change', handleTaskChange);
            }
        }
    },[]);

    // Add new task to memory and cache
    const addTaskToCache = async (newTask: any) => {
        const alreadyExists = tasks.some(task => task.id === newTask.id);
        const updated = alreadyExists
            ? tasks.map(task => task.id === newTask.id ? newTask : task)
            : [...tasks, newTask];

        setTasks(updated);
        await saveTasksToCache(updated);
        console.log('Updated the indexedDB new task creation.')
    }

    // Update existing task in memory and cache
    const updateTask = async (updatedTask: any) => {
        const updated = tasks.map(task =>
            task.id === updatedTask.id ? { ...task, ...updatedTask, lastUpdated: Date.now() } : task
        );
        setTasks(updated);
        await saveTasksToCache(updated);
        console.log(`Task ${updatedTask.id} updated in cache`);
    }

    // Delete task from cache
    const deleteTaskFromCache = async (taskId: number | string) => {
        const updated = tasks.filter(task => task.id !== taskId);
        setTasks(updated);
        await saveTasksToCache(updated);
    }

    return {
        tasks,
        setTasks,
        addTaskToCache,
        updateTask,
        deleteTaskFromCache,
        isLoading, 
        fromCache,
    }
}
