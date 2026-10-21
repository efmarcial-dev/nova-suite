// app/dashboard/layout.tsx

import '../../globals.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { getCurrentUser, getTenant } from '@/app/lib/getTenant';

import SubscriptionGuard from '@/app/components/SubscriptionGuard';
import FirstRunTourModal from '@/app/components/FirstRunTourModal';
import DashboardAnalytics from '@/app/components/DashboardAnalytics';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  
  const user = await getCurrentUser()
  const tenant = await getTenant()

  return (
      <div className='h-full bg-[--background] flex'>
        <DashboardAnalytics />
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 p-4 gap-4 overflow-hidden">
          <Header />
          <section className="flex-1 overflow-y-auto pr-1 pb-4">
            <SubscriptionGuard>
              {children}
            </SubscriptionGuard>
          </section>
          <FirstRunTourModal />
        </main>
      </div>
  )
}

