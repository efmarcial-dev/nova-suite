export const DEMO_PROJECT_TITLES = [
  "Set Up Your Workspace",
  "Plan Your Week",
  "Personal Goals",
];

export const DEMO_TASK_TITLES = [
  "Choose your first focus area",
  "Add a task that matters to you",
  "Pick your top three priorities",
  "Add due dates to upcoming work",
  "Write down one longer-term goal",
  "Choose the next small step",
];

export function isDemoProject(project: { title?: string; name?: string; projectName?: string }): boolean {
  if (!project) return false;
  const title = (project.title || project.name || project.projectName || '').trim().toLowerCase();
  return DEMO_PROJECT_TITLES.some(dt => dt.toLowerCase() === title);
}

export function isDemoTask(task: { title?: string; project?: any; tags?: string[] }): boolean {
  if (!task) return false;
  const title = (task.title || '').trim().toLowerCase();
  if (DEMO_TASK_TITLES.some(dt => dt.toLowerCase() === title)) return true;

  if (typeof task.project === 'object' && task.project?.title) {
    if (DEMO_PROJECT_TITLES.some(dp => dp.toLowerCase() === String(task.project.title).toLowerCase())) {
      return true;
    }
  }

  if (Array.isArray(task.tags)) {
    if (task.tags.some(tag => ['getting-started', 'planning', 'goals'].includes(String(tag).toLowerCase()))) {
      return true;
    }
  }

  return false;
}
