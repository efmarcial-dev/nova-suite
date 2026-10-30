'use client';

import { useEffect } from 'react';
import { warmDashboardData } from '@/app/lib/cache/dashboardDataSession';

export default function DashboardDataWarmup() {
  useEffect(() => {
    void warmDashboardData();
  }, []);

  return null;
}
