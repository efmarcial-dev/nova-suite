'use client';

import { Bell, Search, Sparkles } from 'lucide-react'
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCachedUser } from '../hooks/useCachedUser';
import GlobalSearch from './GlobalSearch';

export default function Header() {
  const { user, isLoading } = useCachedUser();
  const currentUser = user[0];
  const pathname = usePathname();
  const pageTitle = pathname.startsWith('/dashboard/inbox')
    ? 'Inbox'
    : pathname.startsWith('/dashboard/tasks')
      ? 'Tasks'
      : pathname.startsWith('/dashboard/calendar')
        ? 'Calendar'
        : pathname.startsWith('/dashboard/projects')
          ? 'Projects'
          : pathname.startsWith('/dashboard/settings')
            ? 'Settings'
            : pathname.startsWith('/dashboard/help')
              ? 'Help'
              : 'Today';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const initials = currentUser
    ? `${currentUser.first_name?.[0] ?? ''}${currentUser.last_name?.[0] ?? ''}`.toUpperCase()
    : 'U';

  const handleLaunchTour = () => {
    window.dispatchEvent(new CustomEvent('foxly:open-tour'));
  };

  return (
    <div className="flex min-h-14 items-center justify-between gap-3 px-3 sm:px-5 py-2.5 sm:py-3 bg-white rounded-2xl shadow-sm border border-transparent lg:border-[--border]">
      {/* Greeting + Search */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="flex min-w-0 items-center gap-2 lg:hidden">
          <Image src="/images/foxly_mascot_transparent.png" alt="Foxly" width={28} height={28} className="h-7 w-7 shrink-0 object-contain" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">{pageTitle}</p>
            <p className="truncate text-[10px] font-medium text-slate-400">Foxly workspace</p>
          </div>
        </div>
        <div className="hidden lg:block">
          {isLoading ? (
            <div className="skeleton h-5 w-44" />
          ) : (
            <div>
              <p className="text-sm font-bold text-slate-900">
                {greeting}, {currentUser?.first_name ?? 'there'} 👋
              </p>
              <p className="text-[11px] text-slate-400 font-medium">Here&apos;s what&apos;s happening today.</p>
            </div>
          )}
        </div>

        <GlobalSearch />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5 sm:gap-3 sm:ml-4">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event('nova:open-search'))}
          aria-label="Search tasks, projects, and emails"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[--muted-foreground] hover:bg-[--muted] md:hidden"
        >
          <Search size={18} />
        </button>
        {/* Replay Tour Button */}
        <button
          type="button"
          onClick={handleLaunchTour}
          title="Product Tour & AI Guide"
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1EA0FF] bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-xl transition-all shadow-2xs"
        >
          <Sparkles size={14} className="text-[#1EA0FF] animate-pulse" />
          <span>Product Tour</span>
        </button>

        {/* Bell */}
        <button
          id="header-notifications"
          aria-label="Notifications"
          className="relative w-10 h-10 flex shrink-0 items-center justify-center rounded-xl hover:bg-[--muted] transition-colors"
        >
          <Bell size={17} className="text-[--muted-foreground]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1EA0FF] border-2 border-white" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold cursor-pointer">
            {initials}
          </div>
          <div className="text-right hidden sm:block">
            {isLoading ? (
              <div className="skeleton h-4 w-24" />
            ) : (
              <>
                <p className="text-sm font-semibold text-[--foreground] leading-none">
                  {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Guest'}
                </p>
                <p className="text-xs text-[--muted-foreground] mt-0.5 leading-none">{currentUser?.email ?? ''}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
