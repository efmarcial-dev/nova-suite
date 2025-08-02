"use client";

import ViewToggle from "./components/ViewToggle";
import TasksBoard from "./components/TaskBoard";
import MemberRow from "./components/MemberRow";
import ModalPanel from "@/app/components/ModalPanel";
import NewTaskForm from "@/app/components/NewTaskForm";
import PromptPanel from "@/app/components/PromptPanel";
import PromptContent from "@/app/components/PromptContent";
import { Sparkles } from "lucide-react";

import { useState } from "react";
import TaskBoard from "./components/TaskBoard";

import { useCachedAssigneees } from "@/app/hooks/useCachedAssignees";
import { useCachedProjects } from "@/app/hooks/useCachedProjects";


export default function TasksPage() {

  const [view, setView] = useState<'table' | 'list' | 'matrix'>('table');

  const [showNewTask, setShowNewTask] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasPills, setHasPills] = useState(false);

  const {projects: cachedProjects} = useCachedProjects();
  const {assignees: cachedAssignees} = useCachedAssigneees();

  
  return (
    <div className="p-1 space-y-2">
      {/* Header row */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Tasks</h1>
        <div className="flex items-center gap-4">
          <ViewToggle view={view} setView={setView} />

          <button
            onClick={() => setShowPrompt(true)}
            className="group p-2 rounded-md hover:bg-gray-200 transition"
          >
            <Sparkles
              size={24} // same as h-6 w-6
              className="text-gray-500 group-hover:text-blue-600 transition-all duration-200"
            />
          </button>
          
          <button 
            onClick={() => setShowNewTask(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            + Create Task
          </button>
        </div>
      </div>

      {/* Members row */}
      <MemberRow />

      {/* Tasks View */}
      {view === 'table' && <TasksBoard view="table" />}
      {view === 'list' && <TasksBoard view="list" />}
      {view == 'matrix' && <TaskBoard view="matrix" />}

      {/* New Task Modal */}
      <ModalPanel isOpen={showNewTask} onClose={() => setShowNewTask(false)} hasPills={hasPills}>
        <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
        {/* Here you would include your form or component to create a new task */}
        <NewTaskForm projects={cachedProjects} assignees={cachedAssignees} onSubmitSuccess={() => {
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