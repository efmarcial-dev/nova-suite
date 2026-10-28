"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { fetchWithAuthRefresh } from "@/app/lib/api/fetchWithAuthRefresh";

export interface SubscriptionData {
  plan: string;
  planName?: string;
  isLifetime?: boolean;
  status: 'pending' | 'active' | 'paused' | 'canceled' | 'deactivated' | 'none';
  isActive: boolean;
  hasAccess: boolean;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  paidAt?: string;
  lastPaymentDate?: string;
  nextPaymentDate?: string;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: string | null;
  // Trial fields
  isInTrial?: boolean;
  trialEndsAt?: string | null;
  trialDaysRemaining?: number;
  trialStartedAt?: string | null;
  created_at?: string;
  updated_at?: string;
}

export function useSubscription() {
  const pathname = usePathname();
  const lastCheckedPath = useRef<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('nova_has_access') === 'true';
    }
    return false;
  });
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('nova_has_access') === 'true';
    }
    return false;
  });
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('nova_has_access') === 'true') {
      return false;
    }
    return true;
  });
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuthRefresh("/api/subscription", { cache: "no-store" });
      if (res.status === 404) {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('nova_has_access');
        }
        setSubscription(null);
        setHasAccess(false);
        setIsSubscribed(false);
        return { hasAccess: false, isSubscribed: false, subscription: null };
      }
      if (!res.ok) {
        throw new Error(`Failed to load subscription (${res.status})`);
      }
      const data = await res.json();
      const access = Boolean(data.hasAccess);
      const sub = data.subscription || data;
      setSubscription(sub || null);
      setHasAccess(access);
      setIsSubscribed(Boolean(data.isSubscribed ?? data.isActive));
      if (typeof window !== 'undefined') {
        if (access) {
          sessionStorage.setItem('nova_has_access', 'true');
        } else {
          sessionStorage.removeItem('nova_has_access');
        }
      }
      return data;
    } catch (err: any) {
      console.warn("Could not fetch subscription:", err.message);
      setError(err.message);
      return null;
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  useEffect(() => {
    if (!pathname?.startsWith('/dashboard')) return;
    if (lastCheckedPath.current === null) {
      lastCheckedPath.current = pathname;
      return;
    }
    if (lastCheckedPath.current === pathname) return;
    lastCheckedPath.current = pathname;
    void fetchSubscription({ silent: true });
  }, [pathname, fetchSubscription]);

  useEffect(() => {
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') {
        void fetchSubscription({ silent: true });
      }
    };
    window.addEventListener('focus', refreshWhenVisible);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => {
      window.removeEventListener('focus', refreshWhenVisible);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, [fetchSubscription]);

  return {
    subscription,
    hasAccess,
    isSubscribed,
    isLoading,
    error,
    refreshSubscription: fetchSubscription,
  };
}
