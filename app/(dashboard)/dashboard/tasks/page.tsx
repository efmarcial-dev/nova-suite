"use client";

import ViewToggle from "./components/ViewToggle";
import TasksBoard from "./components/TaskBoard";
import ModalPanel from "@/app/components/ModalPanel";
import NewTaskForm from "@/app/components/NewTaskForm";
import { useEffect, useState } from "react";
import TaskBoard from "./components/TaskBoard";

import { useCachedProjects } from "@/app/hooks/useCachedProjects";


export default function TasksPage() {

  const [view, setView] = useState<'table' | 'list' | 'matrix'>('table');

  const [showNewTask, setShowNewTask] = useState(false);
  const [hasPills, setHasPills] = useState(false);
  const [pendingOnly, setPendingOnly] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'important'>('all');

  const {projects: cachedProjects} = useCachedProjects();

  useEffect(() => {
    setPendingOnly(new URLSearchParams(window.location.search).get('filter') === 'pending');
  }, []);

  
  return (
    <div className="p-1 space-y-2">
      {/* Header row */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[--foreground]">Tasks</h1>
        <div className="flex items-center gap-4">
          <ViewToggle view={view} setView={setView} />
          <label className="sr-only" htmlFor="task-priority-filter">Filter tasks by priority</label>
          <select
            id="task-priority-filter"
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value as typeof priorityFilter)}
            className="rounded-xl border border-[--border] bg-white px-3 py-2 text-sm text-[--foreground] outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="all">All priorities</option>
            <option value="high">High priority</option>
            <option value="important">Important tasks</option>
          </select>
          
          <button
            onClick={() => setShowNewTask(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-brand text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-md shadow-indigo-200">
            + Create Task
          </button>
        </div>
      </div>

      {/* Tasks View */}
      {view === 'table' && <TasksBoard view="table" statusFilter={pendingOnly ? 'pending' : 'all'} priorityFilter={priorityFilter} />}
      {view === 'list' && <TasksBoard view="list" statusFilter={pendingOnly ? 'pending' : 'all'} priorityFilter={priorityFilter} />}
      {view == 'matrix' && <TaskBoard view="matrix" statusFilter={pendingOnly ? 'pending' : 'all'} priorityFilter={priorityFilter} />}

      {/* New Task Modal */}
      <ModalPanel isOpen={showNewTask} onClose={() => setShowNewTask(false)} hasPills={hasPills}>
        <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
        {/* Here you would include your form or component to create a new task */}
        <NewTaskForm projects={cachedProjects} onSubmitSuccess={() => {
          setShowNewTask(false); // close modal
          setHasPills(false); // reset pills state
        }}/>
      </ModalPanel>
    </div>
  );
}
