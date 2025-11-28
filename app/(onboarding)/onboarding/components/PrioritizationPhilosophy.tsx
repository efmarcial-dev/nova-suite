"use client";

import { useState } from "react";

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
        prioritizationPhilosophy: data.prioritizatoinPhilosophy || { choice: "", details: "" },
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

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">How do you prioritize work?</h2>

            {/* Prioritization Philosophy */}
            <div>
                <p className="font-medium mb-2">Your prioritization philosophy:</p>
                <div className="space-y-2">
                    {["Do urgent tasks first", "Do important tasks first", "Balance urgency & importance"].map(opt => (
                        <label key={opt} className="block">
                            <input
                                type="radio"
                                name="philosophy"
                                value={opt}
                                checked={localData.prioritizationPhilosophy.choice === opt}
                                onChange={(e) => handleChange("prioritizationPhilosophy", "choice", e.target.value)}
                            />
                            <span className="ml-2">{opt}</span>
                        </label>
                    ))}
                    <input
                        type="text"
                        placeholder="Other (please specify)"
                        className="border rounded px-2 py-1 mt-2 w-full"
                        value={localData.prioritizationPhilosophy.details}
                        onChange={(e) => handleChange("prioritizationPhilosophy", "details", e.target.value)}
                    />
                </div>
            </div>

            {/* Urgency Definition */}
            <div>
                <p className="font-medium mb-2">What makes a task urgent?</p>
                <div className="space-y-2">
                    {["Deadline within 24h", "Blocking another person", "High external pressure"].map(opt => (
                        <label key={opt} className="block">
                            <input
                                type="radio"
                                name="urgency"
                                value={opt}
                                checked={localData.urgencyDefinition.choice === opt}
                                onChange={(e) => handleChange("urgencyDefinition", "choice", e.target.value)}
                            />
                            <span className="ml-2">{opt}</span>
                        </label>
                    ))}
                    <input
                        type="text"
                        placeholder="Other (please specify)"
                        className="border rounded px-2 py-1 mt-2 w-full"
                        value={localData.urgencyDefinition.details}
                        onChange={(e) => handleChange("urgencyDefinition", "details", e.target.value)}
                    />
                </div>
            </div>

            {/* Importance Definition */}
            <div>
                <p className="font-medium mb-2">What makes a task important?</p>
                <div className="space-y-2">
                    {["High business impact", "Aligned with long-term goals", "Requested by leadership"].map(opt => (
                        <label key={opt} className="block">
                            <input
                                type="radio"
                                name="importance"
                                value={opt}
                                checked={localData.importanceDefinition.choice === opt}
                                onChange={(e) => handleChange("importanceDefinition", "choice", e.target.value)}
                            />
                            <span className="ml-2">{opt}</span>
                        </label>
                    ))}
                    <input
                        type="text"
                        placeholder="Other (please specify)"
                        className="border rounded px-2 py-1 mt-2 w-full"
                        value={localData.importanceDefinition.details}
                        onChange={(e) => handleChange("importanceDefinition", "details", e.target.value)}
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
                <button
                    onClick={onBack}
                    className="px-4 py-2 bg-gray-200 rounded"
                >
                    Back
                </button>
                <button
                    onClick={handleNextClick}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Next
                </button>
            </div>
        </div>
    )
}