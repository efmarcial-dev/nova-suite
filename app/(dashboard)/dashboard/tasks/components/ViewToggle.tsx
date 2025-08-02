"use client";

import { LayoutGrid, List } from "lucide-react";

type Props = {
  view: 'table' | 'list' | 'matrix';
  setView: (view: 'table' | 'list' | 'matrix') => void;
}

export default function ViewToggle({ view, setView }: Props) {
  return (
    <div className="flex gap-2 bg-gray-100 p-1 rounded-full">
      <button
        onClick={() => setView('table')}
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition ${
          view === 'table' ? 'bg-white text-blue-600 shadow' : 'text-gray-500 hover:bg-white hover:text-gray-700'}`}
      >
        <LayoutGrid className="w-4 h-4" />
        Table
      </button>

      <button
        onClick={() => setView('list')}
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition ${
          view === 'list' ? 'bg-white text-blue-600 shadow' : 'text-gray-500 hover:bg-white hover:text-gray-700'}`}
      >
        <List className="w-4 h-4" />
        List
      </button>

      <button
        onClick={() => setView('matrix')}
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition ${
          view === 'matrix' ? 'bg-white text-blue-600 shadow' : 'text-gray-500 hover:bg-white hover:text-gray-700'}`}
      >
        <LayoutGrid className="w-4 h-4" />
        Matrix
      </button>
    </div>
  );
}