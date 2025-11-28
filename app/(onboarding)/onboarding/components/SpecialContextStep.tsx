"use client";

import { Task } from "@/app/(dashboard)/dashboard/tasks/components/task";
import { useState } from "react";

type SpecialContextStep = {
    data: {
        calendarIntergration: File | null;
        projects: any[];
        glossary: string;
    };
    onNext: (data: { calendarIntergration:File | null; projects: any[]; glossary: string }) => void;
    onBack?: () => void;
};

export default function SpecialContextStep({data, onNext, onBack}: SpecialContextStep) {
    const [calendarIntergration, setCalendarFile] = useState(data.calendarIntergration || null);
    const [newProject, setNewProject] = useState("");
    const [projects, setProjects] = useState(data.projects || []);
    const [glossary, setGlossary] = useState(data.glossary || "");

    const addProject = () => {
        if (newProject && !projects.includes(newProject)) {
            setProjects((prev) => [...prev, newProject]);
            setNewProject("");
        }
    }

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Special Context (Optional)</h1>
            <p className="mb-4">Provide additional context to help your AI understand your work better.</p>

            <label className="block mb-2">Upload Calendar</label>
            <input
                type="file"
                accept=".ics"
                onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        setCalendarFile(e.target.files[0]);
                    }
                }}
                className="border p-2 mb-4 w-full"
            />

            <label className="block mb-2">Project Names</label>
            <div className="flex gap-2 mb-2">
                <input
                    id="projectInput"
                    type="text"
                    className="border p-2 w-full"
                    placeholder="e.g. Project Alpha"
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addProject();
                        }
                    }}
                />
                <button
                    type="button"
                    onClick= {addProject}
                    className="bg-gray-200 px-3 rounded"
                >
                    Add
                </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
                {projects.map((project, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {project}
                    </span>
                ))}
            </div>

            <label className="block mb-2">Glossary of Term</label>
            <textarea 
                value={glossary}
                onChange={(e) => setGlossary(e.target.value)}
                className="border p-2 mb-4 w-full"
                placeholder="Define terms, acronyms used in your work, any custom jargon or phrases your AI should understand."
            />

            <div className="flex justify-between">
                <button onClick={onBack} className="px-4 py-2 border rounded">back</button>
                <button 
                    onClick={() => onNext({calendarIntergration, projects, glossary })}
                    className="bg-green-500 text-white px-4 py-2 rounded">Finish</button>
            </div>
        </div>
    )

}