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
                    console.log('Fetched projects from API:', fresh);
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

        const handleProjectChange = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (!detail) return;

            if (detail.action === 'create' && detail.project) {
                setProjects(prev => {
                    const exists = prev.some(p => p.id === detail.project.id);
                    if (exists) return prev.map(p => p.id === detail.project.id ? detail.project : p);
                    return [...prev, detail.project];
                });
            } else if (detail.action === 'update' && detail.project) {
                setProjects(prev => prev.map(p => p.id === detail.project.id ? { ...p, ...detail.project } : p));
            } else if (detail.action === 'delete' && detail.projectId) {
                setProjects(prev => prev.filter(p => p.id !== detail.projectId));
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('nova:project-change', handleProjectChange);
        }

        return ()=> {
            isMounted = false;
            if (typeof window !== 'undefined') {
                window.removeEventListener('nova:project-change', handleProjectChange);
            }
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

    // update existing project in cache
    const updateProject = async (updatedProject: any) => {
        const updated = projects.map(project =>
            project.id === updatedProject.id ? { ...project, ...updatedProject, last_updated: Date.now() } : project
        );
        setProjects(updated);
        await saveProjectsToCache(updated);
        console.log(`Project ${updatedProject.id} updated in cache`);
    }

    return {
        projects, 
        isProjectLoading,
        addProjectToCache, 
        updateProject,
        fromCache}
}