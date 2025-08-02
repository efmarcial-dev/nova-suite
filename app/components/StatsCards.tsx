// components/StatsCards.tsx
import StatCard from './StatCard';
import { Briefcase, Clock, CheckCircle ,ListTodo} from 'lucide-react';


interface StatProps {
  projects: any[];
  tasks: any[];
}

export default function StatsCards({projects, tasks}: StatProps) {

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const completedProjects = projects.filter((p) => p.status === 'completed').length;


  return (
    <div className="grid grid-cols-4 gap-6 col-span-4">
      <StatCard title="Total Projects" value={projects.length} icon={<Briefcase size={20} />} />
      <StatCard title="Total Tasks" value={totalTasks} icon={<ListTodo size={20} />} />
      <StatCard title="Pending Tasks" value={pendingTasks} icon={<CheckCircle size={20} />} />
      <StatCard title="Completed Projects" value={completedProjects} icon={<CheckCircle size={20} />} />
    </div>
  )
}