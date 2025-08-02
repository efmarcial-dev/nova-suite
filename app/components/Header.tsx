'use client'

import { Bell, Info, UserCircle } from 'lucide-react'

export default function Header() {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white rounded-xl shadow mb-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search Project"
        className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Icons + User Info */}
      <div className="flex items-center gap-6">
        <Bell size={18} className="text-gray-500 hover:text-blue-600 cursor-pointer" />
        <Info size={18} className="text-gray-500 hover:text-blue-600 cursor-pointer" />
        <UserCircle size={18} className="text-gray-500 hover:text-blue-600 cursor-pointer" />

        {/* User info */}
        <div className="text-right">
          <p className="text-sm font-medium text-gray-800">Eduardo Fajardo</p>
          <p className="text-xs text-gray-500">test@test.com</p>
        </div>
      </div>
    </div>
  )
}
