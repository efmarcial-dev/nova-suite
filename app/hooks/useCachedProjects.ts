"use client";

import { useEffect, useState } from "react";
import {
    getCachedProjectsWithMetadata,
    replaceProjectsInCache,
    saveProjectsToCache,
    updateProjectInCache,
} from "../lib/cache/NovaCacheHelpers";
import { fetchProjectsAPI } from "../lib/api/projects";
import { areIdsEqual, deduplicateProjects } from "../lib/utils/deduplicate";
import { isDemoProject } from "../lib/constants/starterWorkspace";

const CACHE_EXPIRY_MS = 1000 * 60 * 5;

export function useCachedProjects() {
    const [projects, setProjects] = useState<any[]>([]);
    const [isProjectLoading, setIsLoading] = useState(true);
    const [fromCache, setFromCache] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function load() {
            const { projects: cached, last_updated } = await getCachedProjectsWithMetadata();
            const now = Date.now();
            const isStale = now - last_updated > CACHE_EXPIRY_MS;

            if (isMounted && cached.length > 0) {
                const dedupedCached = deduplicateProjects(cached);
                setProjects(dedupedCached);
                setFromCache(true);
                setIsLoading(false);
            }

            if (cached.length === 0 || isStale) {
                try {
                    let fresh = await fetchProjectsAPI();

                    // If user has explicitly removed demo projects, filter out any demo projects
                    if (typeof window !== 'undefined' && localStorage.getItem('nova_demo_projects_cleared') === 'true') {
                        fresh = fresh.filter((project) => !isDemoProject(project));
                    }

                    const withTimestamps = fresh.map((project) => ({
                        ...project,
                        last_updated: Date.now(),
                    }));

                    const dedupedFresh = deduplicateProjects(withTimestamps);

                    // Replace in cache so stale/duplicate records are cleanly replaced
                    await replaceProjectsInCache(dedupedFresh);

                    if (isMounted) {
                        setProjects(dedupedFresh);
                        setFromCache(false);
                        setIsLoading(false);
                    }
                } catch (error) {
                    console.log('Error refreshing projects from API:', error);
                }
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

        await updateProjectInCache(proj);
    };

    // Update existing project in cache
    const updateProject = async (updatedProject: any) => {
        const proj = updatedProject?.project ? { ...updatedProject.project, ...updatedProject } : updatedProject;
        if (!proj || proj.id === undefined) return;

        const normalized = { ...proj, last_updated: Date.now() };
        setProjects((prev) =>
            prev.map((p) => (areIdsEqual(p.id, normalized.id) ? { ...p, ...normalized } : p))
        );
        await updateProjectInCache(normalized);
    };

    return {
        projects,
        isProjectLoading,
        addProjectToCache,
        updateProject,
        fromCache,
    };
}