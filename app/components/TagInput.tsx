'use client';
import { useState } from "react";
import { X } from "lucide-react";



type TagInputProps = {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
}

export default function TagInput ({
    value,
    onChange,
    placeholder = "Add tag and press Enter",
    required = false,
    error
}: TagInputProps) {
    const [input, setInput] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            if (!value.includes(input.trim())){
                onChange([...value, input.trim()]);
                setInput("");
            }
        }
    };


    const removeTag = (tagToRemove: string) => {
        onChange(value.filter((tag) => tag !== tagToRemove));
    }

    return (
        <div>
            <label htmlFor="" className="block text-sm font-medium mb-1">Tags</label>
      <div className={`flex flex-wrap items-center gap-2 p-2 border rounded-md ${error ? "border-red-500" : "border-gray-300"}`}>
        {value.map((tag) => (
          <div
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-full"
          >
            {tag}
            <X
              size={14}
              className="cursor-pointer"
              onClick={() => removeTag(tag)}
            />
          </div>
        ))}

        <input
          type="text"
          className="flex-1 min-w-[100px] border-none focus:outline-none"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
    )
}