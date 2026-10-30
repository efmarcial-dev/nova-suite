import AssistantHub from '@/app/components/AssistantHub';

export default function InboxPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-3 sm:space-y-4">
      <div className="px-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Unified Inbox</h1>
        <p className="mt-1 text-sm text-slate-500">Triage messages and review suggested changes in one place.</p>
      </div>
      <AssistantHub className="w-full" />
    </div>
  );
}
