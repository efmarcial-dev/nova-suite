"use client";

import { useEffect, useState } from "react";
import {
    getCachedProjectsWithMetadata,
    saveProjectsToCache,
    updateProjectInCache,
} from "../lib/cache/NovaCacheHelpers";
import { areIdsEqual, deduplicateProjects } from "../lib/utils/deduplicate";
import {
    ensureProjectsForSession,
    updateProjectForSession,
    upsertProjectForSession,
} from "../lib/cache/dashboardDataSession";

export function useCachedProjects() {
    const [projects, setProjects] = useState<any[]>([]);
    const [isProjectLoading, setIsLoading] = useState(true);
    const [fromCache, setFromCache] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function load() {
            let cached: any[] = [];
            try {
                ({ projects: cached } = await getCachedProjectsWithMetadata());
            } catch (cacheError) {
                console.warn('Could not read the local project cache; loading from the API.', cacheError);
            }

            if (isMounted && cached.length > 0) {
                const dedupedCached = deduplicateProjects(cached);
                setProjects(dedupedCached);
                setFromCache(true);
                setIsLoading(false);
            }

            try {
                const fresh = deduplicateProjects(await ensureProjectsForSession());
                if (isMounted) {
                    setProjects(fresh);
                    setFromCache(false);
                }
            } catch (error) {
                console.log('Error refreshing projects from API:', error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        load();

        const handleProjectChange = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (!detail) return;

            if (detail.action === 'create' && detail.project) {
                const newProj = detail.project.project ? { ...detail.project.project, ...detail.project } : detail.project;
                if (!newProj || newProj.id === undefined) return;

                setProjects((prev) => {
                    const projTitle = String(newProj.title || newProj.projectName || newProj.name || '').trim().toLowerCase();
                    const isLocal = String(newProj.id).startsWith('local-') || String(newProj.id).startsWith('temp-');

                    const existsIndex = prev.findIndex((p) => {
                        if (areIdsEqual(p.id, newProj.id)) return true;
                        const pTitle = String(p.title || p.projectName || p.name || '').trim().toLowerCase();
                        const pIsLocal = String(p.id).startsWith('local-') || String(p.id).startsWith('temp-');
                        return pTitle && pTitle === projTitle && (pIsLocal || isLocal);
                    });

                    if (existsIndex >= 0) {
                        return prev.map((p, idx) => (idx === existsIndex ? { ...p, ...newProj } : p));
                    }
                    return [...prev, newProj];
                });
            } else if (detail.action === 'update' && detail.project) {
                const updated = detail.project.project ? { ...detail.project.project, ...detail.project } : detail.project;
                if (!updated || updated.id === undefined) return;

                setProjects((prev) =>
                    prev.map((p) => (areIdsEqual(p.id, updated.id) ? { ...p, ...updated } : p))
                );
            } else if (detail.action === 'delete' && detail.projectId !== undefined) {
                setProjects((prev) => prev.filter((p) => !areIdsEqual(p.id, detail.projectId)));
            } else if (detail.action === 'refresh' && Array.isArray(detail.projects)) {
                setProjects(deduplicateProjects(detail.projects));
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('nova:project-change', handleProjectChange);
        }

        return () => {
            isMounted = false;
            if (typeof window !== 'undefined') {
                window.removeEventListener('nova:project-change', handleProjectChange);
            }
        };
    }, []);

    // Add new project to cache
    const addProjectToCache = async (newProject: any) => {
        const proj = newProject?.project ? { ...newProject.project, ...newProject } : newProject;
        if (!proj || proj.id === undefined) return;

        setProjects((prev) => {
            const projTitle = String(proj.title || proj.projectName || proj.name || '').trim().toLowerCase();
            const isLocal = String(proj.id).startsWith('local-') || String(proj.id).startsWith('temp-');

            const existsIndex = prev.findIndex((p) => {
                if (areIdsEqual(p.id, proj.id)) return true;
                const pTitle = String(p.title || p.projectName || p.name || '').trim().toLowerCase();
                const pIsLocal = String(p.id).startsWith('local-') || String(p.id).startsWith('temp-');
                return pTitle && pTitle === projTitle && (pIsLocal || isLocal);
            });

            if (existsIndex >= 0) {
                return prev.map((p, idx) => (idx === existsIndex ? { ...p, ...proj } : p));
            }
            return [...prev, proj];
        });

        upsertProjectForSession(proj);
        void updateProjectInCache(proj).catch((error) => {
            console.warn('Project was saved to Django, but the local cache could not be updated.', error);
        });
    };

    // Update existing project in cache
    const updateProject = async (updatedProject: any) => {
        const proj = updatedProject?.project ? { ...updatedProject.project, ...updatedProject } : updatedProject;
        if (!proj || proj.id === undefined) return;

        const normalized = { ...proj, last_updated: Date.now() };
        setProjects((prev) =>
            prev.map((p) => (areIdsEqual(p.id, normalized.id) ? { ...p, ...normalized } : p))
        );
        updateProjectForSession(normalized);
        await updateProjectInCache(normalized).catch((error) => {
            console.warn('Project was updated, but the local cache could not be updated.', error);
        });
    };

    return {
        projects,
        isProjectLoading,
        addProjectToCache,
        updateProject,
        fromCache,
    };
}
