'use client'

import { Home, ListTodo, CalendarDays, FolderKanban, Settings, HelpCircle, LogOut, Plus, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ModalPanel from './ModalPanel';
import NewTaskForm from './NewTaskForm';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCachedUser } from '../hooks/useCachedUser';
import { useCachedProjects } from '../hooks/useCachedProjects';

export default function Sidebar() {
  const [showNewTask, setShowNewTask] = useState(false);
  const pathname = usePathname();
  const { user } = useCachedUser();
  const { projects: cachedProjects } = useCachedProjects();
  const currentUser = user?.[0];

  const initials = currentUser
    ? `${currentUser.first_name?.[0] ?? ''}${currentUser.last_name?.[0] ?? ''}`.toUpperCase()
    : 'U';

  const navLinks = [
    { icon: <Home size={17} />, text: 'Dashboard', href: '/dashboard' },
    { icon: <Mail size={17} />, text: 'Inbox', href: '/dashboard/inbox' },
    { icon: <ListTodo size={17} />, text: 'Tasks', href: '/dashboard/tasks' },
    { icon: <FolderKanban size={17} />, text: 'Projects', href: '/dashboard/projects' },
    { icon: <CalendarDays size={17} />, text: 'Calendar', href: '/dashboard/calendar' },
  ];

  const bottomLinks = [
    { icon: <Settings size={17} />, text: 'Settings', href: '/dashboard/settings' },
    { icon: <HelpCircle size={17} />, text: 'Help', href: '/dashboard/help' },
    { icon: <LogOut size={17} />, text: 'Logout', href: '/logout' },
  ];

  return (
    <>
     <aside className="hidden lg:flex bg-[#0D1B2A] w-[76px] xl:w-60 shrink-0 flex-col justify-between h-dvh p-2 xl:p-4 border-r border-[#1E232C]">
      <div>
        {/* Logo */}
        <div className="flex items-center justify-center xl:justify-start gap-2.5 mb-6 xl:mb-8 px-1 xl:px-2">
          <Image src={'/images/foxly_mascot_transparent.png'} alt="Foxly" width={32} height={32} className="object-contain w-8 h-8" />
          <div className="hidden xl:flex flex-col">
            <span className="text-xl font-bold text-white tracking-tight leading-none lowercase">foxly</span>
            <span className="text-[10px] text-slate-400 font-medium tracking-tight mt-0.5">Your life. In flow.</span>
          </div>
        </div>

        {/* New Task button */}
        <button
          onClick={() => setShowNewTask(true)}
          aria-label="Create a new task"
          title="New task"
          className="w-full mb-5 xl:mb-6 flex items-center justify-center gap-2 py-2.5 xl:px-4 rounded-xl bg-[#1EA0FF] text-white text-sm font-semibold hover:bg-[#0088EE] transition shadow-lg shadow-blue-500/20 cursor-pointer"
        >
          <Plus size={17} /> <span className="hidden xl:inline">New Task</span>
        </button>

        {/* Main Nav */}
        <nav className="space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
            return (
              <SidebarLink
                key={link.href}
                icon={link.icon}
                text={link.text}
                href={link.href}
                isActive={isActive}
              />
            );
          })}
        </nav>

        {/* Bottom Nav */}
        <div className="mt-6 xl:mt-8 pt-4 border-t border-white/10 space-y-1">
          {bottomLinks.map((link) => (
            <SidebarLink
              key={link.href}
              icon={link.icon}
              text={link.text}
              href={link.href}
              isActive={pathname === link.href}
            />
          ))}
        </div>
      </div>

      {/* User Avatar */}
      <div className="flex items-center justify-center xl:justify-start gap-3 px-1 xl:px-2 py-2 xl:py-3 rounded-xl bg-white/5 border border-white/10 mt-4">
        <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
          {initials}
        </div>
        <div className="hidden xl:block min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Loading...'}
          </p>
          <p className="text-xs text-slate-300 truncate opacity-80">
            {currentUser?.email ?? ''}
          </p>
        </div>
      </div>
    </aside>

    {/* New Task Modal */}
    <ModalPanel isOpen={showNewTask} onClose={() => setShowNewTask(false)}>
      <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
      <NewTaskForm
        projects={cachedProjects}
        onSubmitSuccess={() => setShowNewTask(false)}
      />
    </ModalPanel>
   </>
  )
}

function SidebarLink({
  icon,
  text,
  href,
  isActive,
}: {
  icon: React.ReactNode
  text: string
  href: string
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      title={text}
      aria-label={text}
      className={`group flex items-center justify-center xl:justify-start gap-3 px-2 xl:px-3 py-3 xl:py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative ${
        isActive
          ? 'bg-white/10 text-white font-semibold'
          : 'text-white hover:bg-white/10 hover:text-white'
      }`}
    >
      <span className={`shrink-0 transition-colors ${isActive ? 'text-[#1EA0FF]' : 'text-white/80 group-hover:text-white'}`}>
        {icon}
      </span>
      <span
        className={`hidden xl:inline transition-all ${
          isActive
            ? 'border-b-2 border-[#1EA0FF] pb-0.5 text-white font-semibold inline-block'
            : 'text-white group-hover:text-white'
        }`}
      >
        {text}
      </span>
    </Link>
  )
}
