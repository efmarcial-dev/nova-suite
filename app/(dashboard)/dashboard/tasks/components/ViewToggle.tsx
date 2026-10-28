"use client";

import { LayoutGrid, List, Grid2x2 } from "lucide-react";

type Props = {
  view: 'table' | 'list' | 'matrix';
  setView: (view: 'table' | 'list' | 'matrix') => void;
}

const tabs = [
  { value: 'table' as const,  label: 'Board',  icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  { value: 'list' as const,   label: 'List',   icon: <List className="w-3.5 h-3.5" /> },
  { value: 'matrix' as const, label: 'Matrix', icon: <Grid2x2 className="w-3.5 h-3.5" /> },
]

export default function ViewToggle({ view, setView }: Props) {
  return (
    <div className="flex items-center gap-1 bg-[--background] p-1 rounded-xl border border-[--border]">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setView(tab.value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            view === tab.value
              ? 'bg-white text-[#1EA0FF] shadow-sm border border-[--border]'
              : 'text-[--muted-foreground] hover:text-[--foreground]'
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
