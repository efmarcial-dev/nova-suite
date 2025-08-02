// lib/api/tasks.ts
import { Task } from "@/app/(dashboard)/dashboard/tasks/components/task";

const apiTasks = [
  {
    id: '1',
    title: 'Landing Page Fixes',
    urgency: 'high',
    confidence: 92,
    recommendation: 'Fix hero section layout immediately',
    tags: ['Urgent', 'Frontend'],
    dueDate: new Date(Date.now() + 864000000).toISOString(),
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
    dueDate: new Date(Date.now() + 864000000).toISOString(),
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
    dueDate: new Date(Date.now() + 864000000).toISOString(),
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
    dueDate: new Date(Date.now() + 864000000).toISOString(),
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
    dueDate: new Date(Date.now() + 864000000).toISOString(),
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
    dueDate: new Date(Date.now() + 864000000).toISOString(),
    status: 'in_progress',
    assignee: {
      name: 'Fiona',
      avatarUrl: 'https://i.pravatar.cc/100?img=6',
    },
  },
]

export async function fetchTasksAPI(): Promise<Task[]> {


  try {

    const res = await fetch('/api/tasks/', {
      method: 'GET',
      headers: {
        'Content-type' : 'application/json',
      },
      credentials: 'include', // Important: send cookies for auth
    })

    if (!res.ok){
      throw new Error(`Internal API error: ${res.status}`);
    }

    const data = await res.json();
    return data.tasks || []; // Adjust based on backend

  }catch(error){
    console.log(`Internal Error: ${error}`)

    return [];
  }
}


export async function createTask(taskData: {
    title: string;
    selectedAssigneeId: number | null;
    status: string | null;
    selectedProjectId: number | null;
    tags: string[];
    dueDate: Date | null;
    description: string;
    attachment: File | null;
}): Promise<{id: string}> {


    const res = await fetch("/api/tasks/", {
      method: "POST",
      headers: {
        'Content-type' : 'application/json',
      },
      credentials: 'include', // Important: send cookies for auth
      body : JSON.stringify(taskData),
    });

    if (!res.ok) throw new Error("Failed to create task");

    return await res.json() || {}; // This gives you thee created task object


}