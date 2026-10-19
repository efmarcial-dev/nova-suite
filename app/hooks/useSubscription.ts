"use client";

import { useEffect, useState, useCallback } from "react";

export interface SubscriptionData {
  plan: string;
  planName?: string;
  isLifetime?: boolean;
  status: 'pending' | 'active' | 'paused' | 'canceled' | 'deactivated' | 'none';
  isActive: boolean;
  hasAccess: boolean;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: string | null;
  created_at?: string;
  updated_at?: string;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/subscription", { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Failed to load subscription (${res.status})`);
      }
      const data = await res.json();
      setSubscription(data.subscription || null);
      setHasAccess(Boolean(data.hasAccess));
      setIsSubscribed(Boolean(data.isSubscribed));
      return data;
    } catch (err: any) {
      console.warn("Could not fetch subscription:", err.message);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
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
