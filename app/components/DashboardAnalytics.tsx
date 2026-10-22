'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Analytics } from 'firebase/analytics';

export default function DashboardAnalytics() {
  const pathname = usePathname();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    const apiKey = process.env.FIREBASE_API_KEY;
    const appId = process.env.FIREBASE_APP_ID;
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const measurementId = process.env.FIREBASE_MEASUREMENT_ID;

    // Analytics stays optional in local/dev environments without Firebase config.
    if (
      !apiKey ||
      !appId ||
      !projectId ||
      !measurementId
    ) {
      return;
    }

    let active = true;
    let initializedAnalytics: Analytics | undefined;

    void (async () => {
      const [{ getApp, getApps, initializeApp }, { initializeAnalytics, isSupported, setAnalyticsCollectionEnabled }] =
        await Promise.all([import('firebase/app'), import('firebase/analytics')]);

      if (!active || !(await isSupported())) return;

      const app = getApps().length
        ? getApp()
        : initializeApp({
            apiKey,
            appId,
            projectId,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            measurementId,
          });

      initializedAnalytics = initializeAnalytics(app, { config: { send_page_view: false } });
      setAnalyticsCollectionEnabled(initializedAnalytics, true);
      setAnalytics(initializedAnalytics);
    })().catch(() => {
      // Analytics must never interrupt dashboard rendering if unavailable.
    });

    return () => {
      active = false;
      if (initializedAnalytics) {
        void import('firebase/analytics').then(({ setAnalyticsCollectionEnabled }) => {
          setAnalyticsCollectionEnabled(initializedAnalytics!, false);
        });
      }
    };
  }, []);

  useEffect(() => {
    if (!analytics || !pathname) return;

    let active = true;
    void import('firebase/analytics').then(({ logEvent }) => {
      if (active) {
        logEvent(analytics, 'page_view', {
          page_path: pathname,
          page_location: window.location.href,
          page_title: document.title,
        });
      }
    });

    return () => {
      active = false;
    };
  }, [analytics, pathname]);

  return null;
}
