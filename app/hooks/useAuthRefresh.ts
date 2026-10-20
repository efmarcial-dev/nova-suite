"use client";
import { useEffect } from 'react';
import { refreshSession } from '@/app/lib/api/refreshSession';

const REFRESH_EVERY_MS = 45 * 60 * 1000;
const REFRESH_IF_OLDER_THAN_MS = 40 * 60 * 1000;

export function useAuthRefresh() {
  useEffect(() => {
    let lastSuccessfulRefresh = 0;
    let stopped = false;
    let hasSession = false;

    const refresh = async () => {
      if (stopped) return;
      if (!hasSession) {
        try {
          const sessionResponse = await fetch('/api/session', { cache: 'no-store' });
          hasSession = sessionResponse.ok && (await sessionResponse.json()).authenticated === true;
        } catch {
          return;
        }
        if (!hasSession || stopped) return;
      }

      let refreshResponse: Response;
      try {
        refreshResponse = await refreshSession();
      } catch {
        return;
      }

      if (refreshResponse.ok) {
        lastSuccessfulRefresh = Date.now();
      } else {
        hasSession = false;
      }
    };

    // Refresh on entry so a sleeping tab resumes with a fresh access token.
    void refresh();

    const interval = window.setInterval(() => {
      void refresh();
    }, REFRESH_EVERY_MS);

    const refreshIfStale = () => {
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - lastSuccessfulRefresh >= REFRESH_IF_OLDER_THAN_MS) {
        void refresh();
      }
    };

    window.addEventListener('focus', refreshIfStale);
    document.addEventListener('visibilitychange', refreshIfStale);

    return () => {
      stopped = true;
      window.clearInterval(interval);
      window.removeEventListener('focus', refreshIfStale);
      document.removeEventListener('visibilitychange', refreshIfStale);
    };
  }, []);
}
