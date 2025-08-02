'use client'

import { Home, ListTodo, CalendarDays, Settings, HelpCircle, LogOut, Download, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ModalPanel from './ModalPanel';
import { useState } from 'react';

export default function Sidebar() {

  const [showNewTask, setShowNewTask] = useState(false);


  function plus_button() {
    return (
      <button 
        onClick={(e) => {
          e.stopPropagation(); // prevent bubbling
          setShowNewTask(true);
        }}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
    )
  }

  return (
   <>
     <aside className="bg-white rounded-xl shadow-md p-4 w-64 flex flex-col justify-between h-full">
      <div>
        
        <div className="flex items-center space-x-2 mb-6 ">
                        <Image src={'/images/nova_logo.png'} alt="Nova Suite" width={34} height={34} />
                        <span className="text-2xl font-medium text-gray-900">NovaSuite</span>
                    </div>

        <nav className="space-y-4">
          <SidebarLink icon={<Home size={18} />} text="Dashboard" href="/dashboard" />
          <SidebarLink icon={<ListTodo size={18} />} text="Tasks" href="/dashboard/tasks" extra={plus_button()} />
          <SidebarLink icon={<CalendarDays size={18} />} text="Calendar" href="/dashboard/calendar" />
        </nav>

        <div className="mt-8 space-y-4 border-t pt-4 text-sm text-gray-600">
          <SidebarLink icon={<Settings size={18} />} text="Settings" href="/dashboard/settings" />
          <SidebarLink icon={<HelpCircle size={18} />} text="Help" href="/dashboard/help" />
          <SidebarLink icon={<LogOut size={18} />} text="Logout" href="/logout" />
        </div>
      </div>

      <div className="border-t pt-4">
        <p className="text-sm text-gray-600 mb-2">@ Download Mobile App</p>
        <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
          <Download size={16} /> Download
        </button>
      </div>
    </aside>

    {/* New Task Modal */}
    <ModalPanel isOpen={showNewTask} onClose={() => setShowNewTask(false)}>
        <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
        {/* New task form here */}
      </ModalPanel>
   </>
  )
}

function SidebarLink({
  icon,
  text,
  href,
  extra,
}: {
  icon: React.ReactNode
  text: string
  href: string
  extra?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between group">
      <Link
      href={href}
      className="flex items-center justify-between text-gray-800 hover:text-blue-600 transition"
    >
      <span className="flex items-center gap-2">
        {icon}
        {text}
      </span>
      
    </Link>
    {extra && <div className="text-blue-500">{extra}</div>}
    </div>
    
  )
}
