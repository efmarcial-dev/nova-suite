// app/dashboard/layout.tsx

import '../../globals.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

  return (

    
      <div className='h-full bg-gray-100 p-4'>

        <div className="flex h-full gap-4">
          <Sidebar />
          <main className="flex-1 flex flex-col">
            <Header />
            <section className="flex-1 overflow-auto p-6 bg-white rounded-xl shadow-sm">
              {children}
            </section>
          </main>
        </div>
        
      </div>
  )
}
