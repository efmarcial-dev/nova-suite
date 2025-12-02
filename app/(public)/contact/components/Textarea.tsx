'use client'
import { motion } from 'motion/react';
import { useState } from 'react';

interface TextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
}

export function Textarea({
  label,
  name,
  value,
  onChange,
  error,
  required,
  rows = 4,
  placeholder,
}: TextareaProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <motion.textarea
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-transparent peer focus:outline-none transition-all resize-none ${
          error
            ? 'border-red-500'
            : isFocused
            ? 'border-[#4E7BFF] shadow-lg shadow-[#4E7BFF]/20'
            : 'border-[#4E7BFF]/20 hover:border-[#4E7BFF]/40'
        }`}
      />
      <label
        htmlFor={name}
        className={`absolute left-4 transition-all pointer-events-none ${
          value || isFocused
            ? '-top-2 text-xs bg-[#0A0F1F] px-2'
            : 'top-3 text-[#A9B3C9]'
        } ${error ? 'text-red-500' : isFocused ? 'text-[#4E7BFF]' : 'text-[#A9B3C9]'}`}
      >
        {label}
        {required && <span className="text-[#4E7BFF] ml-1">*</span>}
      </label>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
