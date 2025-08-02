'use client'

import { useState } from 'react'
import { Sparkles, Paperclip, Image as ImageIcon, Send } from 'lucide-react'

export default function PromptContent({ name = "Michael" }: { name?: string }) {
  const [input, setInput] = useState("")

  return (
    <div className="text-center space-y-6">
    
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">
          Good Evening, {name}
        </h2>
        <p className="text-gray-500 mt-1">
          Enter a simple prompt to generate anything you want!
        </p>
      </div>

      {/* Input Card */}
      <div className="relative bg-white shadow border border-gray-200 rounded-xl p-4 text-left">
        {/* Input */}
        <div className="flex items-start gap-3">
          <Sparkles className="mt-1 text-blue-600 w-5 h-5 shrink-0" />
          <textarea
            className="w-full border-none resize-none focus:ring-0 text-sm text-gray-800 placeholder:text-gray-400"
            rows={3}
            placeholder="Ask whatever you want"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={1000}
          />
        </div>

        {/* Options below */}
        <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
          <div className="flex gap-4">
            <button className="flex items-center gap-1 hover:text-gray-700">
              <Paperclip className="w-4 h-4" />
              Add Attachment
            </button>
            <button className="flex items-center gap-1 hover:text-gray-700">
              <ImageIcon className="w-4 h-4" />
              Use Image
            </button>
          </div>

          {/* Character counter */}
          <div className="flex items-center gap-2">
            <span>{input.length}/1000</span>

            {/* Send button */}
            <button
              disabled={!input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
