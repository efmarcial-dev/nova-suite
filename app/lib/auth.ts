// lib/auth.ts

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/`, {
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

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register/`, {
        method: "POST",
        headers: {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            email,
            password,
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
  const isProduction = process.env.NODE_ENV === 'production'
  const domain = isProduction ? '.novadev.solutions' : undefined
  
  // Set access token
  document.cookie = `access=${accessToken}; path=/; max-age=86400; SameSite=Lax${
    isProduction ? '; Secure' : ''
  }${domain ? `; Domain=${domain}` : ''}`
  
  // Set refresh token
  if (refreshToken) {
    document.cookie = `refresh=${refreshToken}; path=/; max-age=604800; SameSite=Lax${
      isProduction ? '; Secure' : ''
    }${domain ? `; Domain=${domain}` : ''}`
  }
}

export function clearAuthCookies() {
    document.cookie = 'access=; path=/; max-age=0';
    document.cookie = 'refresh=; path=/; max-age=0';
}

export function redirectToTenant(tenantSlug: string) {
  // Get current hostname to determine if we're in local development
  const currentHost = window.location.hostname
  const isLocalhost = currentHost.includes('localhost') || currentHost === '127.0.0.1'
  
  const protocol = isLocalhost ? 'http' : 'https'
  const baseDomain = isLocalhost ? 'localhost' : (process.env.NEXT_PUBLIC_BASE_DOMAIN || 'novadev.solutions')
  const port = isLocalhost ? ':3000' : ''
  
  const tenantUrl = `${protocol}://${tenantSlug}.${baseDomain}${port}/dashboard`
  
  window.location.href = tenantUrl
}

export function redirectToLogin() {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'novadev.solutions'
  const port = process.env.NODE_ENV === 'production' ? '' : ':3000'
  
  const loginUrl = `${protocol}://${baseDomain}${port}/login`
  
  window.location.href = loginUrl
}