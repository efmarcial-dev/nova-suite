'use client';
import { useState } from 'react';
import Link from 'next/link';
import { setAuthCookies } from '@/app/lib/auth';
import FounderMilestoneCard from '@/app/components/FounderMilestoneCard';

export default function RegisterForm() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [tenantName, setTenantName] = useState('');
    const [role, setRole] = useState('admin'); // Default role
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            setRole('admin'); // Ensure role is set to 'admin' for registration
            const res = await fetch('/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, first_name, last_name, tenant_name: tenantName, role }),
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                if (data.access) {
                    setAuthCookies(data.access, data.refresh);
                    window.location.href = '/onboarding';
                } else {
                    window.location.href = '/login';
                }
            } else {
                console.error('Registration failed:', data);
                setError(data.error || data.detail || 'Registration failed');
            }

        } catch (error) {
            console.error('Error during registration:', error);
            setError('An unexpected error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <FounderMilestoneCard variant="card" showDetails={true} />

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-center mb-6">
                    <h2 className='text-2xl font-bold text-gray-900'>Claim Your Founder Account</h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Register below to secure your Member #100 lifetime access.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                        First Name
                    </label>
                    <input
                        id="first_name"
                        type="text"
                        value={first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                        Last Name  
                    </label>

                    <input
                        id="last_name"
                        type="text"
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />

                </div>
                <div>
                    <label htmlFor="tenant_name" className="block text-sm font-medium text-gray-700">
                        Workspace Name
                    </label>
                    <input
                        id="tenant_name"
                        type="text"
                        value={tenantName}
                        onChange={(e) => setTenantName(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <button
                    type="submit"
                    disabled = {loading}
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
              <span>Creating Account...</span>
            </span>
          ) : (
            'Create Account'
          )}
                </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign In
        </Link>
      </div>
    </div>
    </div>
  )
}