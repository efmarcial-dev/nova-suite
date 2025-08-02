"use client";

import StatsCards from '../../components/StatsCards';
import ProductivityChart from '../../components/ProductivityChart';
import ProjectsList from '../../components/ProjectsList';
import ReminderCard from '../../components/ReminderCard';
import TimeTracker from '../../components/TimeTracker';

import { useCachedProjects } from '@/app/hooks/useCachedProjects';
import { useCachedAssigneees } from '@/app/hooks/useCachedAssignees';
import { useCachedTasks } from '@/app/hooks/useCachedTasks';



export default function DashboardPage() {

  const {projects: cacheProjects, isProjectLoading} = useCachedProjects();
  const { isAssigneeLoading} = useCachedAssigneees();
  const {tasks: cachedTasks, isLoading: isTasksLoading} = useCachedTasks();

  

  if (isProjectLoading || isAssigneeLoading || isTasksLoading ){
    console.log('Loading Cached IndexedDB tables.')
  }


  return (
    <div className=" items-center justify-center">
        <div className="grid grid-cols-4 gap-6">
            <StatsCards projects={cacheProjects} tasks={cachedTasks}/>
            {/* Row 2: Chart + Projects List */}
                <ProductivityChart className="col-span-3 h-[300px]" />
                <ProjectsList className="row-span-2 h-full" />

                {/* Row 3: Bottom content */}
                <ReminderCard className="col-span-1 h-[150px]" />
                <TimeTracker className="col-span-1 h-[150px]" />
        </div>
    </div>
  )
}
