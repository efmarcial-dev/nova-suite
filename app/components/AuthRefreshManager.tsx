'use client';

import { useAuthRefresh } from '@/app/hooks/useAuthRefresh';

export default function AuthRefreshManager() {
  useAuthRefresh();
  return null;
}
