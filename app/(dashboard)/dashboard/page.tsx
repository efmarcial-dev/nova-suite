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
    <div className="grid grid-cols-4 gap-4 auto-rows-min">
      {/* Row 1: Executive Stats */}
      <StatsCards projects={cacheProjects} tasks={cachedTasks} />

      {/* High urgency items scored against the user's priority profile */}
      <PriorityReminders tasks={cachedTasks} className="col-span-4" />

      {/* Row 2: Assistant Executive Briefing & Omnichannel Stream (spans 3) + Projects list (spans 1, 2 rows) */}
      <AssistantHub className="col-span-3" />
      <ProjectsList
        projects={cacheProjects}
        isLoading={isProjectLoading}
        className="col-span-1 row-span-2"
      />

      {/* Row 3: Quick Directives + Time Tracker */}
      <QuickActions className="col-span-2" />
      <TimeTracker className="col-span-1" />
    </div>
  );
}

