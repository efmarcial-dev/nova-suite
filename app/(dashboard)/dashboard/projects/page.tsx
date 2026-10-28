"use client";

import { useEffect, useMemo, useState } from "react";
import { useCachedProjects } from "@/app/hooks/useCachedProjects";
import { updateProjectAPI, createProject, clearDemoProjectsAPI } from "@/app/lib/api/projects";
import { Plus, Briefcase, CalendarDays, X, Check, Clock, AlertCircle, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import ModalPanel from "@/app/components/ModalPanel";
import { isDemoProject, isDemoTask } from "@/app/lib/constants/starterWorkspace";
import { replaceProjectsInCache, replaceTasksInCache, getCachedTasks } from "@/app/lib/cache/NovaCacheHelpers";
import { emitProjectChangeEvent, emitTaskChangeEvent } from "@/app/lib/events/novaEvents";
import { deduplicateProjects } from "@/app/lib/utils/deduplicate";

const statusConfig: Record<string, { label: string; classes: string; dot: string }> = {
  completed:   { label: 'Completed',   classes: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  in_progress: { label: 'In Progress', classes: 'bg-[#F0F9FF] text-[#0088EE] border-[#BFE7FF]',   dot: 'bg-[#1EA0FF]' },
  planning:    { label: 'Planning',    classes: 'bg-amber-50 text-amber-700 border-amber-200',       dot: 'bg-amber-500' },
  on_hold:     { label: 'On Hold',     classes: 'bg-gray-100 text-gray-600 border-gray-200',         dot: 'bg-gray-400' },
}

function getStatus(status?: string) {
  const key = status?.toLowerCase().replace(/\s+/g, '_') ?? '';
  return statusConfig[key] ?? { label: status ?? 'Active', classes: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-500' };
}

type FilterType = 'all' | 'in_progress' | 'completed' | 'planning';

export default function ProjectsPage() {
  const { projects, isProjectLoading, updateProject, addProjectToCache } = useCachedProjects();
  const [filter, setFilter] = useState<FilterType>('all');

  // Edit modal state
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] = useState("in_progress");
  const [editDueDate, setEditDueDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newStatus, setNewStatus] = useState("planning");
  const [isCreating, setIsCreating] = useState(false);
  const [isRemovingDemo, setIsRemovingDemo] = useState(false);
  const [demoRemovedSuccess, setDemoRemovedSuccess] = useState(false);

  const hasDemoProjects = projects.some(p => isDemoProject(p));

  const handleRemoveDemoProjects = async () => {
    if (isRemovingDemo) return;
    setIsRemovingDemo(true);
    try {
      await clearDemoProjectsAPI();
      const remainingProjects = projects.filter(p => !isDemoProject(p));
      await replaceProjectsInCache(remainingProjects);

      // Also clean up any demo tasks in cache tied to demo projects
      const allCachedTasks = await getCachedTasks();
      const remainingTasks = allCachedTasks.filter(t => !isDemoTask(t));
      await replaceTasksInCache(remainingTasks);

      if (typeof window !== 'undefined') {
        localStorage.setItem('nova_demo_projects_cleared', 'true');
        localStorage.setItem('nova_demo_tasks_cleared', 'true');
      }

      emitProjectChangeEvent({ action: 'refresh', projects: remainingProjects });
      emitTaskChangeEvent({ action: 'refresh', tasks: remainingTasks });

      setDemoRemovedSuccess(true);
      setTimeout(() => setDemoRemovedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to remove demo projects:', err);
    } finally {
      setIsRemovingDemo(false);
    }
  };

  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get("status");
    if (status === "completed") setFilter("completed");
  }, []);

  const openEditModal = (p: any) => {
    setEditingProject(p);
    setEditTitle(p.title ?? p.projectName ?? p.name ?? "");
    setEditDesc(p.description ?? "");
    setEditStatus(p.status?.toLowerCase().replace(/\s+/g, '_') ?? "in_progress");
    setEditDueDate(p.due_date ?? "");
  };

  const handleSaveProject = async () => {
    if (!editingProject) return;
    setIsSaving(true);

    const updated = {
      ...editingProject,
      title: editTitle,
      projectName: editTitle,
      description: editDesc,
      status: editStatus,
      due_date: editDueDate,
    };

    // 1. Update in local IndexedDB cache immediately
    await updateProject(updated);

    // 2. Sync to Django backend API in background
    if (editingProject.id) {
      await updateProjectAPI(editingProject.id, {
        title: editTitle,
        projectName: editTitle,
        description: editDesc,
        status: editStatus,
        due_date: editDueDate,
      });
    }

    setIsSaving(false);
    setEditingProject(null);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsCreating(true);

    try {
      const res = await createProject({
        projectName: newTitle,
        description: newDesc,
        status: newStatus,
      });

      const unwrapped = (res as any)?.project ?? res;
      const newProj = {
        ...unwrapped,
        id: unwrapped?.id || `local-${Date.now()}`,
        title: unwrapped?.title || unwrapped?.projectName || newTitle.trim(),
        projectName: unwrapped?.projectName || unwrapped?.title || newTitle.trim(),
        description: unwrapped?.description || newDesc,
        status: unwrapped?.status || newStatus,
        last_updated: Date.now(),
      };

      await addProjectToCache(newProj);
      emitProjectChangeEvent({ action: 'create', project: newProj });

      setShowCreateModal(false);
      setNewTitle("");
      setNewDesc("");
      setNewStatus("planning");
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const dedupedProjects = useMemo(() => deduplicateProjects(projects), [projects]);

  const visibleProjects = filter === 'all'
    ? dedupedProjects
    : dedupedProjects.filter((p) => {
        const key = p.status?.toLowerCase().replace(/\s+/g, '_') ?? '';
        return key === filter;
      });

  const tabs: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Planning', value: 'planning' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[--foreground]">Projects</h1>
          <p className="text-sm text-[--muted-foreground] mt-0.5">
            {projects.length} project{projects.length !== 1 ? 's' : ''} total • Click any card to edit details and status
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasDemoProjects && (
            <button
              type="button"
              onClick={handleRemoveDemoProjects}
              disabled={isRemovingDemo}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50/80 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition shadow-sm disabled:opacity-50"
              title="Remove all demo and placeholder projects"
            >
              {isRemovingDemo ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Removing...
                </>
              ) : demoRemovedSuccess ? (
                <>
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  Demo projects removed
                </>
              ) : (
                <>
                  <Trash2 size={13} />
                  Remove demo projects
                </>
              )}
            </button>
          )}

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-brand text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-md shadow-blue-500/20"
          >
            <Plus size={15} /> New Project
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-[--background] rounded-xl p-1 border border-[--border] w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
              filter === tab.value
                ? 'bg-white text-[#1EA0FF] shadow-sm border border-[--border]'
                : 'text-[--muted-foreground] hover:text-[--foreground]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects grid */}
      {isProjectLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-[--border] p-5 space-y-3">
              <div className="skeleton h-9 w-9 rounded-xl" />
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-2/3" />
            </div>
          ))}
        </div>
      ) : visibleProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[--border]">
          <div className="w-16 h-16 rounded-2xl bg-[#F0F9FF] flex items-center justify-center mb-4">
            <Briefcase size={28} className="text-[#1EA0FF]" />
          </div>
          <h3 className="text-base font-semibold text-[--foreground]">No projects found</h3>
          <p className="text-sm text-[--muted-foreground] mt-1">
            {filter !== 'all' ? 'Try a different filter.' : 'Create your first project to get started.'}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl gradient-brand text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={14} /> Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleProjects.map((project, index) => {
            const cfg = getStatus(project.status);
            const title = project.title ?? project.projectName ?? project.name ?? 'Untitled project';
            return (
              <div
                key={project.id ?? index}
                onClick={() => openEditModal(project)}
                className="bg-white rounded-2xl border border-[--border] shadow-sm p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 hover:border-[#BFE7FF] transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#F0F9FF] flex items-center justify-center shrink-0 group-hover:bg-[#E8F6FF] transition-colors">
                    <Briefcase size={16} className="text-[#1EA0FF]" />
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.classes}`}>
                    {cfg.label}
                  </span>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-[--foreground] group-hover:text-[#1EA0FF] transition-colors leading-snug">
                    {title}
                  </h2>
                  {project.description && (
                    <p className="text-xs text-[--muted-foreground] mt-1.5 line-clamp-2">{project.description}</p>
                  )}
                </div>

                <div className="mt-auto pt-3 border-t border-[--border] flex items-center justify-between text-xs text-[--muted-foreground]">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={12} />
                    {project.due_date ? `Due ${project.due_date}` : 'No deadline'}
                  </span>
                  <span className="text-[#1EA0FF] opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    Edit →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Project Modal */}
      <ModalPanel isOpen={!!editingProject} onClose={() => setEditingProject(null)}>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[--border] pb-3">
            <h2 className="text-lg font-semibold text-[--foreground]">Edit Project</h2>
            <button
              onClick={() => setEditingProject(null)}
              className="p-1 rounded-lg text-[--muted-foreground] hover:text-[--foreground] hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-3">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-[--foreground] uppercase tracking-wide mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-[#1EA0FF] focus:border-[#1EA0FF]"
                placeholder="Project title..."
              />
            </div>

            {/* Status Selector */}
            <div>
              <label className="block text-xs font-semibold text-[--foreground] uppercase tracking-wide mb-1.5">
                Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'planning', label: 'Planning', dot: 'bg-amber-400' },
                  { value: 'in_progress', label: 'In Progress', dot: 'bg-[#1EA0FF]' },
                  { value: 'completed', label: 'Completed', dot: 'bg-emerald-500' },
                  { value: 'on_hold', label: 'On Hold', dot: 'bg-gray-400' },
                ].map((s) => {
                  const isSelected = editStatus === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setEditStatus(s.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                        isSelected
                          ? 'border-[#1EA0FF] bg-[#F0F9FF] text-[#0088EE] shadow-xs'
                          : 'border-[--border] bg-white text-[--muted-foreground] hover:border-gray-300'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                      {s.label}
                      {isSelected && <Check size={13} className="ml-auto text-[#1EA0FF]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[--foreground] uppercase tracking-wide mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-[#1EA0FF] focus:border-[#1EA0FF]"
                placeholder="What is this project about?"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-semibold text-[--foreground] uppercase tracking-wide mb-1">
                Target Due Date
              </label>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-[#1EA0FF] focus:border-[#1EA0FF]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[--border]">
            <button
              type="button"
              onClick={() => setEditingProject(null)}
              className="px-4 py-2 text-sm font-medium text-[--muted-foreground] hover:text-[--foreground] rounded-xl hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSaving || !editTitle.trim()}
              onClick={handleSaveProject}
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium gradient-brand text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </ModalPanel>

      {/* Create Project Modal */}
      <ModalPanel isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div className="flex items-center justify-between border-b border-[--border] pb-3">
            <h2 className="text-lg font-semibold text-[--foreground]">New Project</h2>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="p-1 rounded-lg text-[--muted-foreground] hover:text-[--foreground] hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[--foreground] uppercase tracking-wide mb-1">
                Project Name
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-[#1EA0FF] focus:border-[#1EA0FF]"
                placeholder="e.g. Q4 Marketing Campaign"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[--foreground] uppercase tracking-wide mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-[#1EA0FF] focus:border-[#1EA0FF]"
                placeholder="Project summary, objectives, or context..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[--foreground] uppercase tracking-wide mb-1.5">
                Initial Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'planning', label: 'Planning', dot: 'bg-amber-400' },
                  { value: 'in_progress', label: 'In Progress', dot: 'bg-[#1EA0FF]' },
                ].map((s) => {
                  const isSelected = newStatus === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setNewStatus(s.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                        isSelected
                          ? 'border-[#1EA0FF] bg-[#F0F9FF] text-[#0088EE]'
                          : 'border-[--border] bg-white text-[--muted-foreground]'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[--border]">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-sm font-medium text-[--muted-foreground] hover:text-[--foreground] rounded-xl hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !newTitle.trim()}
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium gradient-brand text-white rounded-xl hover:opacity-90 disabled:opacity-50"
            >
              {isCreating ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </ModalPanel>
    </div>
  );
}
