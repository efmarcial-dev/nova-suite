"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock3, Plus, X } from 'lucide-react';

type WorkStyleStep = {
    data: {
        workStyle: string;
        preferredHours: { start: string; end: string; };
        recurringRules: any[]; // Explicitly type as any[]
    };
    onNext: (data: { workStyle: string; preferredHours: {start: string; end: string}, recurringRules: any[]  }) => void;
    onBack?: () => void;
};

export default function WorkStyleStep({data, onNext, onBack}: WorkStyleStep) {
    const [workStyle, setWorkStyle] = useState(data.workStyle || "");
    const [startHour, setStartHour] = useState(data.preferredHours.start || "");
    const [endHour, setEndHour] = useState(data.preferredHours.end || "");
    const [rules, setRules] = useState<any[]>(data.recurringRules || []);
    const [newRule, setNewRule] = useState('');

    const addRule = () => {
      const value = newRule.trim();
      if (value && !rules.includes(value)) setRules([...rules, value]);
      setNewRule('');
  };

    const styles = [
      { title: 'Urgency first', detail: 'Handle time-sensitive work as it comes in.' },
      { title: 'Importance first', detail: 'Protect time for the work with the biggest impact.' },
      { title: 'Balance both', detail: 'Weigh deadlines and impact together.' },
    ];

    return (
      <div className="max-w-3xl space-y-7">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">How do you like to work?</h2>
          <p className="mt-1 text-sm text-slate-500">Set a few defaults. You can change these any time.</p>
        </div>

        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-slate-800">When your task list gets busy, what comes first?</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {styles.map(({ title, detail }) => (
              <label key={title} className={`relative flex cursor-pointer flex-col rounded-2xl border p-4 transition ${workStyle === title ? 'border-[#1EA0FF] bg-[#F0F9FF] ring-2 ring-[#E8F6FF]' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                <input className="sr-only" type="radio" name="work-style" value={title} checked={workStyle === title} onChange={() => setWorkStyle(title)} />
                <span className="flex items-center justify-between text-sm font-semibold text-slate-900">
                  {title}{workStyle === title && <Check className="h-4 w-4 text-[#1EA0FF]" />}
                </span>
                <span className="mt-1.5 text-xs leading-5 text-slate-500">{detail}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className="mb-3 block text-sm font-semibold text-slate-800"><Clock3 className="mr-2 inline h-4 w-4 text-[#1EA0FF]" />Preferred working hours</label>
          <div className="grid max-w-lg grid-cols-2 gap-3">
            <label className="text-xs font-medium text-slate-500">Start
              <input type="time" value={startHour} onChange={(e) => setStartHour(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#1EA0FF] focus:ring-4 focus:ring-[#E8F6FF]" />
            </label>
            <label className="text-xs font-medium text-slate-500">Finish
              <input type="time" value={endHour} onChange={(e) => setEndHour(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#1EA0FF] focus:ring-4 focus:ring-[#E8F6FF]" />
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="recurring-rule" className="mb-1 block text-sm font-semibold text-slate-800">Any personal rules for Nova?</label>
          <p className="mb-3 text-xs text-slate-500">Optional. Add guidance Nova should keep in mind when organizing your work.</p>
          <div className="flex max-w-2xl gap-2">
            <input id="recurring-rule" value={newRule} onChange={(e) => setNewRule(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addRule(); } }} className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-[#1EA0FF] focus:ring-4 focus:ring-[#E8F6FF]" placeholder="e.g. Keep Friday afternoons meeting-free" />
            <button type="button" onClick={addRule} disabled={!newRule.trim()} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"><Plus className="h-4 w-4" /> Add</button>
          </div>
          {rules.length > 0 && <ul className="mt-3 flex flex-wrap gap-2">{rules.map((rule, index) => <li key={`${rule}-${index}`} className="inline-flex items-center gap-2 rounded-full bg-[#F0F9FF] px-3 py-1.5 text-xs font-medium text-[#0088EE]">{rule}<button type="button" aria-label={`Remove ${rule}`} onClick={() => setRules(rules.filter((_, i) => i !== index))} className="text-[#1EA0FF] hover:text-[#0D1B2A]"><X className="h-3.5 w-3.5" /></button></li>)}</ul>}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 pt-5">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-slate-900"><ArrowLeft className="h-4 w-4" /> Back</button>
          <button type="button" onClick={() => onNext({ workStyle, preferredHours: { start: startHour, end: endHour }, recurringRules: rules })} className="inline-flex items-center gap-2 rounded-xl bg-[#1EA0FF] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0088EE] disabled:cursor-not-allowed disabled:opacity-40" disabled={!workStyle}>Continue <ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>
    );

}
