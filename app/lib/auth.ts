// lib/auth.ts
import { getDjangoApiUrl } from "./api/getDjangoApiUrl";

export async function loginUser(email: string, password: string) {
  const response = await fetch('/api/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.detail || data.error || 'Login failed. Please check your credentials.')
  }

  return data // Should include: { access, refresh, user: { tenant_slug, ... } }
}


export async function register(
    email: string, 
    password: string,
    tenantName: string,
    first_name: string,
    last_name : string,
) {
    const response = await fetch('/api/register/', {
        method: "POST",
        headers: {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            email,
            password,
            first_name,
            last_name,
            tenant_name : tenantName
        })
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new Error(data.detail || data.error || "Registration failed")
    }

    return data // Should include : {access, refresh, user: {tenant_slug, ....}}
}


export async function clearAuthCookies() {
  try {
    await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' });
  } catch {
    // Continue to the login page if the logout API is temporarily unavailable.
  }
}

export function redirectToTenant(_tenantSlug?: string) {
  // Single domain: redirect directly to /dashboard on current origin
  window.location.href = '/dashboard';
}

export function redirectToLogin() {
  // Single domain: redirect directly to /login on current origin
  window.location.href = '/login';
}
