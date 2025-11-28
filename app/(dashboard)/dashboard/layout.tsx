// app/dashboard/layout.tsx

import '../../globals.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { getCurrentUser, getTenant } from '@/app/lib/getTenant';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  
  const user = await getCurrentUser()
  const tenant = await getTenant()

  // This shouldnet happen due to middelware, but just in case
  if (!user || !tenant){
    console.error('This should not happen in dashboard layout. Should happen in middleware')
    redirect('/login')
  }
 

  return (

    
      <div className='h-full bg-gray-100 p-4'>

        <div className="flex h-full gap-4">
          <Sidebar />
          <main className="flex-1 flex flex-col">
            <Header/>
            <section className="flex-1 overflow-auto p-6 bg-white rounded-xl shadow-sm">
              {children}
            </section>
          </main>
        </div>
        
      </div>
  )
}
