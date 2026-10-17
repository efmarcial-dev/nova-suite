// lib/auth.ts
import { getDjangoApiUrl } from "./api/getDjangoApiUrl";

export async function loginUser(email: string, password: string) {
  const response = await fetch(getDjangoApiUrl("auth/login/"), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error('Login failed')
  }

  const data = await response.json()
  return data // Should include: { access, refresh, user: { tenant_slug, ... } }
}


export async function register(
    email: string, 
    password: string,
    tenantName: string,
    first_name: string,
    last_name : string,
) {

    const response = await fetch(getDjangoApiUrl("auth/register/"), {
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

    if(!response.ok){
        throw new Error("Signup failedd")
    }

    const data = await response.json()

    return data // Should include : {access, refresh, user: {tenant_slug, ....}}

}


export function setAuthCookies(accessToken: string, refreshToken?: string) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Set access token on current domain
  document.cookie = `access=${accessToken}; path=/; max-age=86400; SameSite=Lax${
    isProduction ? '; Secure' : ''
  }`;
  
  // Set refresh token on current domain
  if (refreshToken) {
    document.cookie = `refresh=${refreshToken}; path=/; max-age=604800; SameSite=Lax${
      isProduction ? '; Secure' : ''
    }`;
  }
}

export function clearAuthCookies() {
  document.cookie = 'access=; path=/; max-age=0';
  document.cookie = 'refresh=; path=/; max-age=0';
}

export function redirectToTenant(_tenantSlug?: string) {
  // Single domain: redirect directly to /dashboard on current origin
  window.location.href = '/dashboard';
}

export function redirectToLogin() {
  // Single domain: redirect directly to /login on current origin
  window.location.href = '/login';
}