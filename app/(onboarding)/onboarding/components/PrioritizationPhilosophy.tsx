"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

type Props = {
    data: any;
    onNext: (newData: any) => void;
    onBack: () => void;
}

type SectionKey = "prioritizationPhilosophy" | "urgencyDefinition" | "importanceDefinition";
type SectionData = { choice: string; details: string };
type LocalData = {
    prioritizationPhilosophy: SectionData;
    urgencyDefinition: SectionData;
    importanceDefinition: SectionData;
};

export default function PrioritizationPhilosophyStep({data, onNext, onBack}: Props) {

    const [localData, setLocalData] = useState<LocalData>({
        prioritizationPhilosophy: data.prioritizationPhilosophy || { choice: "", details: "" },
        urgencyDefinition: data.urgencyDefinition || { choice: "", details: "" },
        importanceDefinition: data.importanceDefinition || { choice: "", details: "" },
    });

    const handleChange = (section: SectionKey, field: keyof SectionData, value: string) => {
        setLocalData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const handleNextClick = () => {
        onNext(localData);
    }

    const sections: { key: SectionKey; title: string; options: string[] }[] = [
        { key: 'prioritizationPhilosophy', title: 'Your default approach', options: ['Do urgent tasks first', 'Do important tasks first', 'Balance urgency & importance'] },
        { key: 'urgencyDefinition', title: 'What makes work urgent?', options: ['Deadline within 24h', 'Blocking another person', 'High external pressure'] },
        { key: 'importanceDefinition', title: 'What makes work important?', options: ['High business impact', 'Aligned with long-term goals', 'Requested by leadership'] },
    ];

    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-950">How should Nova prioritize?</h2>
                <p className="mt-1 text-sm text-slate-500">Choose the signals that matter most. Add a little context if you like.</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                {sections.map(({ key, title, options }) => (
                    <fieldset key={key} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                        <legend className="mb-3 text-sm font-semibold text-slate-900">{title}</legend>
                        <div className="space-y-2">
                            {options.map((option) => {
                                const selected = localData[key].choice === option;
                                return (
                                    <label key={option} className={`flex min-h-11 cursor-pointer items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-xs leading-5 transition ${selected ? 'border-indigo-400 bg-indigo-50 text-indigo-950' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}>
                                        <span>{option}</span>
                                        <input className="sr-only" type="radio" name={key} value={option} checked={selected} onChange={(e) => handleChange(key, 'choice', e.target.value)} />
                                        {selected && <Check className="h-4 w-4 shrink-0 text-indigo-600" />}
                                    </label>
                                );
                            })}
                        </div>
                        <label className="mt-3 block">
                            <span className="sr-only">Additional context for {title}</span>
                            <input
                                type="text"
                                placeholder="Add your own context (optional)"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                value={localData[key].details}
                                onChange={(e) => handleChange(key, 'details', e.target.value)}
                            />
                        </label>
                    </fieldset>
                ))}
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 pt-5">
                <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-slate-900"><ArrowLeft className="h-4 w-4" /> Back</button>
                <button type="button" onClick={handleNextClick} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">Continue <ArrowRight className="h-4 w-4" /></button>
            </div>
        </div>
    );
}
