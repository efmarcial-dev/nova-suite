'use client';

import { Bell, Info, UserCircle } from 'lucide-react'
import { useCachedUser } from '../hooks/useCachedUser';

interface Props {
  user: any[];
}

export default function Header() {

  const {user, isLoading} = useCachedUser();
  const currentUser = user[0]

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
          {isLoading ? (
            <>
              <p className="text-sm font-medium text-gray-800">
                loading...
              </p>
              
            </>
          ): currentUser ? (
            <>
              <p className="text-sm font-medium text-gray-800">
                {currentUser.first_name} {currentUser.last_name}
              </p>
              <p className='text-xs text-gray-500'>{currentUser.email}</p>
            </>
          ) : (<>
            <p className="text-sm font-medium text-gray-800">Guest</p>
            <p className="text-sm text-gray-50">No email</p>
          </>)}
        </div>
      </div>
    </div>
  )
}
