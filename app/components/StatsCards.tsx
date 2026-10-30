// components/StatsCards.tsx
import StatCard from './StatCard';
import { Briefcase, CheckCircle, ListTodo, Clock } from 'lucide-react';

interface StatProps {
  projects: any[];
  tasks: any[];
}

export default function StatsCards({projects, tasks}: StatProps) {
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((task) => task.status !== 'done').length;
  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;

  return (
    <div className="col-span-1 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 md:col-span-2 xl:col-span-4">
      <StatCard
        title="Total Projects"
        value={projects.length}
        href="/dashboard/projects"
        icon={<Briefcase size={18} />}
        accent="bg-[#E8F6FF] text-[#1EA0FF]"
      />
      <StatCard
        title="Total Tasks"
        value={totalTasks}
        href="/dashboard/tasks"
        icon={<ListTodo size={18} />}
        accent="bg-violet-100 text-violet-600"
      />
      <StatCard
        title="In Progress"
        value={inProgressTasks}
        href="/dashboard/tasks?filter=pending"
        icon={<Clock size={18} />}
        accent="bg-amber-100 text-amber-600"
      />
      <StatCard
        title="Completed Projects"
        value={completedProjects}
        href="/dashboard/projects?status=completed"
        icon={<CheckCircle size={18} />}
        accent="bg-emerald-100 text-emerald-600"
      />
    </div>
  )
}
