"use client"

import { useState } from "react"

import { saveTasksToCache,
    getCachedTasks,
    clearTaskCache,
    saveAssigneesToCache,
    getCachedAssignees,
    clearCachedAssignees,
    saveProjectsToCache,
    getCachedProjects,
    clearCachedProjects,
 } from "../lib/cache/NovaCacheHelpers";
import { assert } from "console";
 


export default function DebugCachePage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [assignees, setAssignees] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);

    const demoProject = [
      {
        id: 1,
        title: 'NovaSuitee',
        description: 'Test Description',
        assignee: 4
      },
      {
        id: 2,
        title: "Website",
        description: "test",
        assignee: 2
      }
    ]

    const demoAssignee = [
      {
        id: 1,
        name: "John Cache",
        avatarUrl: 'https://i.pravatar.cc/100?img=1'
      }, 
      {
        id: 2,
        name: 'Bob',
        avatarUrl: 'https://i.pravatar.cc/100?img=2',
      },
      {
        id: 3,
        name: 'Carlos',
        avatarUrl: 'https://i.pravatar.cc/100?img=3'
      },
      {
        id: 4,
        name: 'Diana',
        avatarUrl: 'https://i.pravatar.cc/100?img=4'
      },
      {
        id: 5,
        name: 'Evan',
        avatarUrl: 'https://i.pravatar.cc/100?img=5'
      },
      {
        id: 6,
        name: 'Fiona',
        avatarUrl: 'https://i.pravatar.cc/100?img=6'
      }
    ]

    const demoTasks = [
  {
    id: '1',
    title: 'Landing Page Fixes',
    urgency: 'high',
    confidence: 92,
    recommendation: 'Fix hero section layout immediately',
    tags: ['Urgent', 'Frontend'],
    dueDate: 'June 27',
    status: 'todo',
    assignee: {
      name: 'Alice',
      avatarUrl: 'https://i.pravatar.cc/100?img=1',
    },
  },
  {
    id: '2',
    title: 'API Integration',
    urgency: 'medium',
    confidence: 81,
    recommendation: 'Continue working on backend endpoints',
    tags: ['API', 'Backend'],
    dueDate: 'June 28',
    status: 'in_progress',
    assignee: {
      name: 'Bob',
      avatarUrl: 'https://i.pravatar.cc/100?img=2',
    },
  },
  {
    id: '3',
    title: 'UI Review',
    urgency: 'low',
    confidence: 70,
    recommendation: 'Do a design QA once dev is done',
    tags: ['Review'],
    dueDate: 'June 30',
    status: 'in_review',
    assignee: {
      name: 'Carlos',
      avatarUrl: 'https://i.pravatar.cc/100?img=3',
    },
  },
  {
    id: '4',
    title: 'Final Deployment',
    urgency: 'high',
    confidence: 95,
    recommendation: 'Coordinate with ops for final rollout',
    tags: ['Deploy'],
    dueDate: 'June 29',
    status: 'done',
    assignee: {
      name: 'Diana',
      avatarUrl: 'https://i.pravatar.cc/100?img=4',
    },
  },
  {
    id: '5',
    title: 'Dashboard Redesign',
    urgency: 'medium',
    confidence: 75,
    recommendation: 'Update layout with new grid system',
    tags: ['Design', 'UX'],
    dueDate: 'July 1',
    status: 'todo',
    assignee: {
      name: 'Evan',
      avatarUrl: 'https://i.pravatar.cc/100?img=5',
    },
  },
  {
    id: '6',
    title: 'Test Coverage',
    urgency: 'low',
    confidence: 65,
    recommendation: 'Write unit tests for all modules',
    tags: ['Testing'],
    dueDate: 'July 2',
    status: 'in_progress',
    assignee: {
      name: 'Fiona',
      avatarUrl: 'https://i.pravatar.cc/100?img=6',
    },
  },
];

  const handleSave = async () => {

    const normalizedTasks = demoTasks.map(task => ({
      id: task.id,
      title: task.title,
      urgency: task.urgency,
      confidence: task.confidence,
      tags: task.tags,
      status: task.status,
      projectId: '',
      assignee: task.assignee.name,
      assigneeUrl: task.assignee.avatarUrl,
      recommendation: task.recommendation,
      dueDate: task.dueDate,
      lastUpate: Date.now(),
    }))

    await saveTasksToCache(normalizedTasks);
    alert("Tasks saved to cache");
  }

  const handleLoad = async () => {
    const cached = await getCachedTasks();
    setTasks(cached);
  };

  const handleClear = async () => {
    await clearTaskCache();
    setTasks([]);
    alert('Cached Cleared');
  }

  const handleAssigneeSave = async () => {
    await saveAssigneesToCache(demoAssignee);
    alert("Assignee saved to cache.")
  }

  const handleAssigneeLoad = async () => {
    const cached = await getCachedAssignees();
    setAssignees(cached);
  }

  const handleAssigneeClear = async () => {
    await clearCachedAssignees();
    setAssignees([]);
    alert("Cached Cleared")
  }

  const handleProjectSave = async () => {
    await saveProjectsToCache(demoProject);
    alert("Projects Save");

  }

  const handleProjectLoad = async () => {
    const cached = await getCachedProjects();
    setProjects(cached);
  }

  const handleProjectClear = async () => {
    await clearCachedProjects();
    setProjects([]);
    alert('Projects Cached Clearded')
  }



  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">IndexedDB Cache Task Tester</h1>

      <div className="space-x-2">
        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md">Save Demo Tasks</button>
        <button onClick={handleLoad} className="px-4 py-2 bg-green-600 text-white rounded-md">Load Cached Tasks</button>
        <button onClick={handleClear} className="px-4 py-2 bg-red-600 text-white rounded-md">Clear Cache</button>
      </div>

      <div className="pt-4">
        <h2 className="font-semibold">Cached Tasks:</h2>
        <pre className="bg-gray-100 p-3 rounded text-sm">{JSON.stringify(tasks, null, 2)}</pre>
      </div>

      <h1 className="text-xl font-semibold">Assignee Tester</h1>

      <div className="space-x-2">
        <button onClick={handleAssigneeSave} className="px-4 py-2 bg-blue-600 text-white rounded-md">Save Demo Assignees</button>
        <button onClick={handleAssigneeLoad} className="px-4 py-2 bg-green-600 text-white rounded-md">Load Cached Assignees</button>
        <button onClick={handleAssigneeClear} className="px-4 py-2 bg-red-600 text-white rounded-md">Clear Assignees</button>
      </div>

      <div className="pt-4">
        <h2 className="font-semibold">Cached Assignee:</h2>
        <pre className="bg-gray-100 p-3 rounded text-sm">{JSON.stringify(assignees, null, 2)}</pre>
      </div>

      <h1 className="text-xl font-semibold">Project Tester</h1>

      <div className="space-x-2">
        <button onClick={handleProjectSave} className="px-4 py-2 bg-blue-600 text-white rounded-md">Save Demo Projects</button>
        <button onClick={handleProjectLoad} className="px-4 py-2 bg-green-600 text-white rounded-md">Load Cached Projects</button>
        <button onClick={handleProjectClear} className="px-4 py-2 bg-red-600 text-white rounded-md">Clear Projects</button>
      </div>

      <div className="pt-4">
        <h2 className="font-semibold">Cached Projects:</h2>
        <pre className="bg-gray-100 p-3 rounded text-sm">{JSON.stringify(projects, null, 2)}</pre>
      </div>

    </div>
  )
}