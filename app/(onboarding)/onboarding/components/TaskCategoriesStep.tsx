"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

type TaskCategoriesStep = {
    data: {
        taskCategories: string[];
    };
    onNext: (data: { taskCategories: string[]; }) => void;
    onBack?: () => void;
};

export default function TaskCategoriesStep({data, onNext, onBack}: TaskCategoriesStep) {
    const allCategories = [
        "Work", "Personal", "Health", "Finance", "Education",  
        "Marketing", "Sales", "Development", "Design", "Customer Support", "Project Management",
        "Administration", "Legal", "Research", "Travel", "Events", "Miscellaneous",
        "Financial Planning", "Content Creation", "Networking", "Community Engagement"
    ]

    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        Array.isArray(data.taskCategories) ? data.taskCategories : []
    );

    const toggleCategory = (cat: string) => {
        setSelectedCategories((prev) =>
            prev.includes(cat)
                ? prev.filter((c) => c !== cat)
                : [...prev, cat]
        );
    }
    
    return (
      <div className="max-w-4xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">What kind of work is on your plate?</h2>
            <p className="mt-1 text-sm text-slate-500">Choose all the areas you handle. This helps Nova organize your tasks.</p>
          </div>
          <span className="rounded-full bg-[#F0F9FF] px-3 py-1.5 text-xs font-semibold text-[#0088EE]">{selectedCategories.length} selected</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {allCategories.map((cat) => {
            const selected = selectedCategories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleCategory(cat)}
                className={`flex min-h-12 items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition sm:text-sm ${selected ? 'border-[#1EA0FF] bg-[#F0F9FF] text-[#0D1B2A] shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
              >
                <span>{cat}</span>
                {selected && <Check className="h-4 w-4 shrink-0 text-[#1EA0FF]" />}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-slate-900"><ArrowLeft className="h-4 w-4" /> Back</button>
          <button
            type="button"
            onClick={() => onNext({ taskCategories: selectedCategories })}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1EA0FF] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0088EE] disabled:cursor-not-allowed disabled:opacity-40"
            disabled={selectedCategories.length === 0}
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );



}
