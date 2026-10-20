let pendingRefresh: Promise<Response> | null = null;

/** Share one refresh request across API retries and the keep-alive timer. */
export function refreshSession(): Promise<Response> {
  if (!pendingRefresh) {
    const requestRefresh = () => fetch('/api/refresh', {
      method: 'POST',
      cache: 'no-store',
      credentials: 'same-origin',
    });

    const locks = typeof navigator !== 'undefined'
      ? (navigator as Navigator & { locks?: LockManager }).locks
      : undefined;
    const request = locks
      ? locks.request('nova-auth-token-refresh', requestRefresh)
      : requestRefresh();

    pendingRefresh = request.finally(() => {
      pendingRefresh = null;
    });
  }

  return pendingRefresh;
}
