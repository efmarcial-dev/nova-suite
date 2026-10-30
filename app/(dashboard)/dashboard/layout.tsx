// app/dashboard/layout.tsx

import '../../globals.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

import SubscriptionGuard from '@/app/components/SubscriptionGuard';
import FirstRunTourModal from '@/app/components/FirstRunTourModal';
import DashboardAnalytics from '@/app/components/DashboardAnalytics';
import TrialBanner from '@/app/components/TrialBanner';
import MobileTabBar from '@/app/components/MobileTabBar';
import DashboardDataWarmup from '@/app/components/DashboardDataWarmup';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SubscriptionGuard>
      <DashboardDataWarmup />
      <DashboardAnalytics />
      <div className='h-dvh bg-[--background] flex overflow-hidden'>
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 p-3 sm:p-4 gap-3 sm:gap-4 overflow-hidden pb-[calc(5.75rem+env(safe-area-inset-bottom))] lg:pb-4">
          <Header />
          <TrialBanner />
          <section className="flex-1 min-h-0 overflow-y-auto pr-0 sm:pr-1 pb-5">
            {children}
          </section>
          <FirstRunTourModal />
        </main>
        <MobileTabBar />
      </div>
    </SubscriptionGuard>
  )
}

