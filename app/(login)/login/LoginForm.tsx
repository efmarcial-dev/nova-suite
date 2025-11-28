'use client';
import { useState } from "react";
import { loginUser, setAuthCookies, redirectToTenant } from "@/app/lib/auth";

export default function LoginForm() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setError('')
      setLoading(true)

      try {
        const data = await loginUser(email, password)
        
        // Set access and refresh token cookies
        setAuthCookies(data.access, data.refresh)
        
        // Redirect to tenant subdomain
        redirectToTenant(data.user.tenant_slug)
      } catch (err) {
        setError('Invalid credentials. Please try again.')
        setLoading(false)
      }
    }
return (

    <div className="bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Sign in to your account</h2>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition ${
            loading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <span className="flex items-center space-x-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span>Signing in...</span>
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
    </div>
  )

}