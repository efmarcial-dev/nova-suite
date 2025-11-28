"use client";

import { useState } from "react";

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
    <div>
      <h2 className="text-xl font-bold mb-4">Task Categories</h2>
      <p className="mb-4">Select the types of tasks you typically handle. This helps your AI prioritize better.</p>

      <div className="grid grid-cols-2 gap-2 mb-6">
        {allCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => toggleCategory(cat)}
            className={`border px-3 py-2 rounded ${
              selectedCategories.includes(cat) ? "bg-blue-500 text-white" : ""
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="px-4 py-2 border rounded">Back</button>
        <button
          onClick={() => onNext({ taskCategories: selectedCategories })}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={selectedCategories.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );



}