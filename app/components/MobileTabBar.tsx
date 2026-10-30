'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarDays,
  FolderKanban,
  HelpCircle,
  Home,
  ListTodo,
  LogOut,
  Mail,
  MoreHorizontal,
  Settings,
  X,
} from 'lucide-react';

const tabs = [
  { label: 'Overview', href: '/dashboard', icon: Home },
  { label: 'Inbox', href: '/dashboard/inbox', icon: Mail },
  { label: 'Tasks', href: '/dashboard/tasks', icon: ListTodo },
  { label: 'Calendar', href: '/dashboard/calendar', icon: CalendarDays },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreLinks = [
    { label: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    { label: 'Help', href: '/dashboard/help', icon: HelpCircle },
    { label: 'Log out', href: '/logout', icon: LogOut },
  ];

  return (
    <>
      <nav
        aria-label="Main navigation"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-slate-200 bg-white/95 px-1 pt-1.5 pb-[calc(.375rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-lg lg:hidden"
      >
        {tabs.map(({ label, href, icon: Icon }) => {
          const active = href === '/dashboard'
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold transition-colors ${
                active ? 'text-[#0088EE]' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon size={19} strokeWidth={active ? 2.4 : 1.9} />
              <span>{label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isMoreOpen}
          onClick={() => setIsMoreOpen(true)}
          className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold transition-colors ${
            isMoreOpen || moreLinks.some((link) => pathname.startsWith(link.href))
              ? 'text-[#0088EE]'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <MoreHorizontal size={20} />
          <span>More</span>
        </button>
      </nav>

      {isMoreOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden" role="presentation">
          <button
            type="button"
            aria-label="Close more menu"
            onClick={() => setIsMoreOpen(false)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-more-title"
            className="relative w-full rounded-t-3xl border border-slate-200 bg-white px-5 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-300" />
            <div className="mb-3 flex items-center justify-between">
              <h2 id="mobile-more-title" className="text-base font-bold text-slate-900">More</h2>
              <button
                type="button"
                aria-label="Close more menu"
                onClick={() => setIsMoreOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {moreLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMoreOpen(false)}
                  className="flex min-h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
