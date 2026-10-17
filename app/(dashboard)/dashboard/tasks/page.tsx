"use client";

import ViewToggle from "./components/ViewToggle";
import TasksBoard from "./components/TaskBoard";
import ModalPanel from "@/app/components/ModalPanel";
import NewTaskForm from "@/app/components/NewTaskForm";
import PromptPanel from "@/app/components/PromptPanel";
import PromptContent from "@/app/components/PromptContent";
import { Sparkles } from "lucide-react";

import { useEffect, useState } from "react";
import TaskBoard from "./components/TaskBoard";

import { useCachedProjects } from "@/app/hooks/useCachedProjects";


export default function TasksPage() {

  const [view, setView] = useState<'table' | 'list' | 'matrix'>('table');

  const [showNewTask, setShowNewTask] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasPills, setHasPills] = useState(false);
  const [pendingOnly, setPendingOnly] = useState(false);

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

          <button
            onClick={() => setShowPrompt(true)}
            className="group p-2 rounded-xl hover:bg-indigo-50 transition-colors"
          >
            <Sparkles
              size={20}
              className="text-[--muted-foreground] group-hover:text-indigo-600 transition-colors"
            />
          </button>
          
          <button
            onClick={() => setShowNewTask(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-brand text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-md shadow-indigo-200">
            + Create Task
          </button>
        </div>
      </div>

      {/* Tasks View */}
      {view === 'table' && <TasksBoard view="table" statusFilter={pendingOnly ? 'pending' : 'all'} />}
      {view === 'list' && <TasksBoard view="list" statusFilter={pendingOnly ? 'pending' : 'all'} />}
      {view == 'matrix' && <TaskBoard view="matrix" statusFilter={pendingOnly ? 'pending' : 'all'} />}

      {/* New Task Modal */}
      <ModalPanel isOpen={showNewTask} onClose={() => setShowNewTask(false)} hasPills={hasPills}>
        <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
        {/* Here you would include your form or component to create a new task */}
        <NewTaskForm projects={cachedProjects} onSubmitSuccess={() => {
          setShowNewTask(false); // close modal
          setHasPills(false); // reset pills state
        }}/>
      </ModalPanel>

      {/* AI Prompt Modal */}
      <PromptPanel isOpen={showPrompt} onClose={() => setShowPrompt(false)}>
        <PromptContent name="Eduardo" />
      </PromptPanel>
    </div>
  );
}