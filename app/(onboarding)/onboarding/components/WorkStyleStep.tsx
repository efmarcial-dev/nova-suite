"use client";

import { useState } from "react";

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

      const addRule = (rule: any) => {
    if (rule && !rules.includes(rule)) setRules([...rules, rule]);
  };
    
   return (
    <div>
      <h2 className="text-xl font-bold mb-4">Work Style & Preferences</h2>

      <label className="block mb-2">Work Style Preference</label>
      <div className="space-y-2 mb-4">
        {["Do urgent tasks first", "Do important tasks first", "Balance urgency and importance"].map((style) => (
          <label key={style} className="flex items-center gap-2">
            <input
              type="radio"
              value={style}
              checked={workStyle === style}
              onChange={() => setWorkStyle(style)}
            />
            {style}
          </label>
        ))}
      </div>

      <label className="block mb-2">Preferred Working Hours</label>
      <div className="flex gap-2 mb-4">
        <input type="time" value={startHour} onChange={(e) => setStartHour(e.target.value)} className="border p-2 w-full" />
        <input type="time" value={endHour} onChange={(e) => setEndHour(e.target.value)} className="border p-2 w-full" />
      </div>

      <label className="block mb-2">Recurring Rules</label>
      <div className="flex gap-2 mb-2">
        <input id="ruleInput" type="text" className="border p-2 w-full" placeholder="e.g. Always answer client emails first" />
        <button
          type="button"
          onClick={() => {
            const input = document.getElementById("ruleInput") as HTMLInputElement;
            addRule(input.value);
            input.value = "";
          }}
          className="bg-gray-200 px-3 rounded"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {rules.map((r, i) => (
          <span key={i} className="bg-gray-100 px-2 py-1 rounded">{r}</span>
        ))}
      </div>

      <div className="mt-4 flex justify-between">
        <button onClick={onBack} className="px-4 py-2 border rounded">Back</button>
        <button
          onClick={() => onNext({ workStyle, preferredHours: { start: startHour, end: endHour }, recurringRules: rules })}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={!workStyle}
        >
          Next
        </button>
      </div>
    </div>
  );

}