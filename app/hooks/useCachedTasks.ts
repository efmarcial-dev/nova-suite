"use client";

import { useEffect, useState } from "react";
import { getCachedTasksWithMetadata, saveTasksToCache } from "../lib/cache/NovaCacheHelpers";
import { fetchTasksAPI } from "../lib/api/tasks";

const CACHE_EXPIRY_MS = 1000 * 60 * 5; // 5 minutes 

export function useCachedTasks() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [isLoading, setIsLoading] =  useState(true);
    const [fromCache, setFromCache] = useState(false);

    useEffect(()=> {
        let isMounted = true;

        async function load() {
            const {tasks: cached, lastUpdated} = await getCachedTasksWithMetadata();
            const now = Date.now();
            const isStale = now - lastUpdated > CACHE_EXPIRY_MS;

            if (isMounted && cached.length > 0) {
                
                setTasks(cached);
                setFromCache(true);
                setIsLoading(false);
                console.log("Found tasks in cache ")
            }

            if (cached.length === 0 || isStale) {
                try {

                    console.log("Calling Task API and updating cache")
                    const fresh = await fetchTasksAPI();
                    const withTimestamps = fresh.map(task => ({
                        ...task,
                        lastUpdated: Date.now()
                    }));

                    await saveTasksToCache(withTimestamps);

                    if (isMounted) {
                        setTasks(withTimestamps);
                        setFromCache(false);
                        setIsLoading(false);
                    }

                } catch(error){
                    console.log(error)
                }
            }
        }

        load();

        const handleTaskChange = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (!detail) return;

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