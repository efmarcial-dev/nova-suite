'use client';

import { Bell, Search, UserCircle } from 'lucide-react'
import { useCachedUser } from '../hooks/useCachedUser';

export default function Header() {
  const { user, isLoading } = useCachedUser();
  const currentUser = user[0];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const initials = currentUser
    ? `${currentUser.first_name?.[0] ?? ''}${currentUser.last_name?.[0] ?? ''}`.toUpperCase()
    : 'U';

  return (
    <div className="flex items-center justify-between px-5 py-3 bg-white rounded-2xl shadow-sm border border-[--border]">
      {/* Greeting + Search */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="hidden lg:block">
          {isLoading ? (
            <div className="skeleton h-5 w-44" />
          ) : (
            <p className="text-sm font-semibold text-[--foreground]">
              {greeting}, {currentUser?.first_name ?? 'there'} 👋
            </p>
          )}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[--muted-foreground] pointer-events-none" />
          <input
            type="text"
            id="header-search"
            placeholder="Search…"
            className="w-full pl-9 pr-12 py-2 text-sm bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 transition-all placeholder:text-[--muted-foreground]"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[--muted-foreground] bg-[--muted] px-1.5 py-0.5 rounded font-mono border border-[--border]">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-4">
        {/* Bell */}
        <button
          id="header-notifications"
          className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[--muted] transition-colors"
        >
          <Bell size={17} className="text-[--muted-foreground]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 border-2 border-white" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold cursor-pointer">
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
