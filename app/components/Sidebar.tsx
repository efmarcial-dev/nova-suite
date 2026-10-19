'use client'

import { Home, ListTodo, CalendarDays, FolderKanban, Settings, HelpCircle, LogOut, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ModalPanel from './ModalPanel';
import NewTaskForm from './NewTaskForm';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCachedUser } from '../hooks/useCachedUser';
import { useCachedProjects } from '../hooks/useCachedProjects';
import { motion } from 'framer-motion';

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
     <aside className="bg-[--sidebar] w-60 shrink-0 flex flex-col justify-between h-full p-4">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
            <Image src={'/images/nova_logo.png'} alt="Nova Suite" width={20} height={20} />
          </div>
          <span className="text-xl font-semibold text-white tracking-tight">Nova Suite</span>
        </div>

        {/* New Task button */}
        <button
          onClick={() => setShowNewTask(true)}
          className="w-full mb-6 flex items-center justify-center gap-2 py-2 px-4 rounded-xl gradient-brand text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-indigo-900/30"
        >
          <Plus size={15} /> New Task
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
        <div className="mt-8 pt-4 border-t border-[--sidebar-border] space-y-1">
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
      <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-[--sidebar-accent] mt-4">
        <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Loading...'}
          </p>
          <p className="text-xs text-[--sidebar-foreground] truncate opacity-70">
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
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative
        ${isActive
          ? 'bg-[--sidebar-accent] text-white'
          : 'text-[--sidebar-foreground] hover:bg-[--sidebar-accent] hover:text-white'
        }`}
    >
      {isActive && (
        <motion.span
          layoutId="sidebar-active-indicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-indigo-400"
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      )}
      <span className={isActive ? 'text-indigo-400' : ''}>{icon}</span>
      {text}
    </Link>
  )
}
