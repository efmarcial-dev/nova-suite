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

        return ()=> {
            isMounted = false;
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

    return {
        tasks,
        setTasks, // optional, may be useful for edits/deletes.
        addTaskToCache, // use this after creation 
        isLoading, 
        fromCache,
    }
}