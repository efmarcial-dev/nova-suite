"use client";

import StatsCards from '../../components/StatsCards';
import AssistantHub from '../../components/AssistantHub';
import ProjectsList from '../../components/ProjectsList';
import QuickActions from '../../components/ReminderCard';
import TimeTracker from '../../components/TimeTracker';
import PriorityReminders from '../../components/PriorityReminders';

import { useCachedProjects } from '@/app/hooks/useCachedProjects';
import { useCachedTasks } from '@/app/hooks/useCachedTasks';

export default function DashboardPage() {
  const { projects: cacheProjects, isProjectLoading } = useCachedProjects();
  const { tasks: cachedTasks } = useCachedTasks();

  return (
    <div className="grid grid-cols-1 gap-3 auto-rows-min sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
      {/* Put the most actionable information before summary metrics on small screens. */}
      <PriorityReminders tasks={cachedTasks} className="col-span-1 md:col-span-2 xl:col-span-4" />

      <StatsCards projects={cacheProjects} tasks={cachedTasks} />

      <AssistantHub compact className="col-span-1 md:col-span-2 xl:col-span-3" />
      <ProjectsList
        projects={cacheProjects}
        isLoading={isProjectLoading}
        className="col-span-1 md:col-span-1 xl:row-span-2"
      />

      <QuickActions className="col-span-1 md:col-span-2 xl:col-span-2" />
      <TimeTracker className="col-span-1 md:col-span-1" />
    </div>
  );
}

