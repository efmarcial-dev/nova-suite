import { refreshSession } from './refreshSession';

/** Retry a same-origin API request once after refreshing an expired access token. */
export async function fetchWithAuthRefresh(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const response = await fetch(input, init);
  if (response.status !== 401) return response;

  const refreshResponse = await refreshSession();

  if (!refreshResponse.ok) return response;
  return fetch(input, init);
}
