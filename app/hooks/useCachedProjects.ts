"use client"

import { useEffect, useState } from "react";
import { getCachedProjectsWithMetadata, saveProjectsToCache } from "../lib/cache/NovaCacheHelpers";
import { fetchProjectsAPI } from "../lib/api/projects";

const CACHE_EXPIRY_MS = 1000 * 60 * 5;

export function useCachedProjects() {
    const [projects, setProjects] = useState<any[]>([]);
    const [isProjectLoading, setIsLoading] = useState(true);
    const [fromCache, setFromCache] = useState(true);


    useEffect(()=> {
        let isMounted = true;

        async function load() {
            const {projects: cached, last_updated} = await getCachedProjectsWithMetadata();
            const now = Date.now();
            const isStale = now - last_updated > CACHE_EXPIRY_MS;

            if (isMounted && cached.length > 0){
                setProjects(cached);
                setFromCache(true);
                setIsLoading(false);
                console.log('Found projects in cache');
            }

            if (cached.length === 0 || isStale) {
                try{
                    
                    console.log("Calling Project API and updatiing cahce");
                    const fresh = await fetchProjectsAPI();
                    const withTimestamps = fresh.map(project => ({
                        ...project,
                        last_updated: Date.now()
                    }));

                    await saveProjectsToCache(withTimestamps);

                    if (isMounted) {
                        setProjects(withTimestamps);
                        setFromCache(false);
                        setIsLoading(false);
                    }

                }catch(error){
                    console.log(error);
                }
            }
        }

        load();

        return ()=> {
            isMounted = false;
        }

        
    }, []);

    // add new project to cache
    const addProjectToCache = async (newProject: any) => {
        const alreadyExists = projects.some(project => project.id === newProject.id);
        const updated = alreadyExists
            ? projects.map(project => project.id === newProject.id ? newProject : project)
            : [...projects, newProject];

        setProjects(updated);
        await saveProjectsToCache(updated);
        console.log(`Project ${newProject.id} added to cache`);
    }

    return {
        projects, 
        isProjectLoading,
        addProjectToCache, 
        fromCache}
}