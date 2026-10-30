'use client';

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Mail, Search, BriefcaseBusiness, CheckSquare, X } from 'lucide-react';
import { fetchEmailMessagesAPI, fetchEmailProvidersAPI, EmailMessageItem } from '@/app/lib/api/email';
import { fetchNylasGrantsAPI } from '@/app/lib/api/nylas';
import {
  getCachedProjects,
  getCachedTasks,
} from '@/app/lib/cache/NovaCacheHelpers';
import { ensureProjectsForSession, ensureTasksForSession } from '@/app/lib/cache/dashboardDataSession';

type SearchItem = { id: string | number; label: string; detail: string; href: string };

export default function GlobalSearch() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [tasks, setTasks] = useState<SearchItem[]>([]);
  const [projects, setProjects] = useState<SearchItem[]>([]);
  const [emails, setEmails] = useState<SearchItem[]>([]);
  const [emailSearchDone, setEmailSearchDone] = useState(false);
  const [error, setError] = useState('');

  const loadLocalData = useCallback(async () => {
    setLoadingLocal(true);
    try {
      let cachedTasks: any[] = [];
      let cachedProjects: any[] = [];
      try {
        [cachedTasks, cachedProjects] = await Promise.all([getCachedTasks(), getCachedProjects()]);
      } catch (cacheError) {
        console.warn('Search cache unavailable; using the shared dashboard data load.', cacheError);
      }
      if (cachedTasks.length === 0 || cachedProjects.length === 0) {
        const [freshTasks, freshProjects]: [any[], any[]] = await Promise.all([
          cachedTasks.length === 0 ? ensureTasksForSession().catch(() => []) : Promise.resolve(cachedTasks),
          cachedProjects.length === 0 ? ensureProjectsForSession().catch(() => []) : Promise.resolve(cachedProjects),
        ]);
        if (cachedTasks.length === 0 && freshTasks.length) {
          cachedTasks = freshTasks as any[];
        }
        if (cachedProjects.length === 0 && freshProjects.length) {
          cachedProjects = freshProjects as any[];
        }
      }

      setTasks(cachedTasks.map((task: any) => ({
        id: task.id,
        label: task.title || task.name || 'Untitled task',
        detail: task.description || task.status || 'Task',
        href: `/dashboard/tasks?search=${encodeURIComponent(task.title || task.name || '')}`,
      })));
      setProjects(cachedProjects.map((project: any) => {
        const title = project.title || project.projectName || project.name || 'Untitled project';
        return {
          id: project.id,
          label: title,
          detail: project.description || project.status || 'Project',
          href: `/dashboard/projects?search=${encodeURIComponent(title)}`,
        };
      }));
    } finally {
      setLoadingLocal(false);
    }
  }, []);

  useEffect(() => {
    if (open) void loadLocalData();
  }, [open, loadLocalData]);

  useEffect(() => {
    const onOpenSearch = () => {
      setOpen(true);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
        window.setTimeout(() => inputRef.current?.focus(), 0);
      }
      if (event.key === 'Escape') setOpen(false);
    };
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('nova:open-search', onOpenSearch);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('nova:open-search', onOpenSearch);
    };
  }, []);

  const matching = (items: SearchItem[]) => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return [];
    return items.filter((item) => `${item.label} ${item.detail}`.toLocaleLowerCase().includes(needle)).slice(0, 5);
  };
  const visibleTasks = matching(tasks);
  const visibleProjects = matching(projects);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const normalized = query.trim();
    if (!normalized) return;
    setLoadingEmail(true);
    setEmailSearchDone(true);
    setError('');
    try {
      // Email searches are intentionally submitted only on Enter to avoid
      // sending a provider request for each keystroke.
      const [grants, providers] = await Promise.all([
        fetchNylasGrantsAPI(),
        fetchEmailProvidersAPI().catch(() => []),
      ]);
      const hasNylasEmail = grants.some((grant) => grant.is_connected !== false && grant.scope?.includes('email'));
      const legacyProvider = providers.find((provider) => provider.is_connected)?.provider;
      const provider = hasNylasEmail ? 'nylas' : legacyProvider;
      if (!provider) {
        setEmails([]);
        setError('Connect an email account in Settings to search email.');
        return;
      }
      const results = await fetchEmailMessagesAPI(provider, normalized, 10);
      setEmails(results.map((email: EmailMessageItem) => ({
        id: email.id,
        label: email.subject || '(No subject)',
        detail: `${email.sender || 'Unknown sender'} · ${email.snippet || email.content || ''}`.slice(0, 180),
        href: `/dashboard/inbox?search=${encodeURIComponent(normalized)}&message_id=${encodeURIComponent(email.id)}`,
      })));
    } catch (searchError) {
      setEmails([]);
      setError(searchError instanceof Error ? searchError.message : 'Email search failed.');
    } finally {
      setLoadingEmail(false);
    }
  };

  const choose = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const sections: { title: string; icon: typeof CheckSquare; items: SearchItem[] }[] = [
    { title: 'Tasks', icon: CheckSquare, items: visibleTasks },
    { title: 'Projects', icon: BriefcaseBusiness, items: visibleProjects },
    { title: 'Emails', icon: Mail, items: emailSearchDone ? emails : [] },
  ];

  return (
    <div className={`relative flex-1 max-w-sm ${open ? 'fixed inset-x-3 top-16 z-50 max-w-none md:static md:z-auto md:max-w-sm' : 'hidden md:block'}`} ref={rootRef}>
      <form onSubmit={submit} className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[--muted-foreground] pointer-events-none" />
        <input
          ref={inputRef}
          type="search"
          id="header-search"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setEmailSearchDone(false);
            setEmails([]);
            setError('');
          }}
          placeholder="Search tasks, projects, emails…"
          aria-label="Search tasks, projects, and emails"
          className="w-full pl-9 pr-12 py-2 text-sm bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-[#1EA0FF]/40 focus:border-[#1EA0FF] transition-all placeholder:text-[--muted-foreground]"
        />
        {query ? (
          <button type="button" onClick={() => { setQuery(''); setEmails([]); setEmailSearchDone(false); inputRef.current?.focus(); }} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-[--muted-foreground]">
            <X size={14} />
          </button>
        ) : (
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[--muted-foreground] bg-[--muted] px-1.5 py-0.5 rounded font-mono border border-[--border]">⌘K</kbd>
        )}
      </form>
      {open && query.trim() && (
        <div className="absolute right-0 z-50 mt-2 max-h-[min(70vh,28rem)] w-[min(24rem,calc(100vw-1.5rem))] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
          {loadingLocal && <p className="px-3 py-2 text-xs text-slate-500"><Loader2 size={13} className="mr-2 inline animate-spin" />Searching tasks and projects…</p>}
          {sections.map(({ title, icon: Icon, items }) => items.length > 0 ? (
            <section key={title} className="mb-1 last:mb-0">
              <h3 className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400"><Icon size={13} />{title}</h3>
              {items.map((item) => (
                <button key={`${title}-${item.id}`} type="button" onClick={() => choose(item.href)} className="block w-full rounded-xl px-3 py-2 text-left hover:bg-sky-50">
                  <span className="block truncate text-sm font-semibold text-slate-800">{item.label}</span>
                  <span className="block truncate text-xs text-slate-500">{item.detail}</span>
                </button>
              ))}
            </section>
          ) : null)}
          {error && <p role="alert" className="px-3 py-2 text-xs text-rose-600">{error}</p>}
          {loadingEmail && <p className="px-3 py-2 text-xs text-slate-500"><Loader2 size={13} className="mr-2 inline animate-spin" />Searching emails…</p>}
          {emailSearchDone && !loadingEmail && !error && emails.length === 0 && <p className="px-3 py-2 text-xs text-slate-500">No matching emails.</p>}
          {!loadingEmail && !emailSearchDone && <p className="px-3 pb-2 text-[11px] text-slate-400">Press Enter to search email.</p>}
          {!loadingLocal && !visibleTasks.length && !visibleProjects.length && !emailSearchDone && <p className="px-3 py-1 text-xs text-slate-500">No matching tasks or projects.</p>}
        </div>
      )}
    </div>
  );
}
