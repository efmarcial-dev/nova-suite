'use client';
import { useState } from 'react';
import Link from 'next/link';
import { setAuthCookies } from '@/app/lib/auth';
import FounderMilestoneCard from '@/app/components/FounderMilestoneCard';
import { Mail, Lock, User, Building, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function RegisterForm() {
    // Multi-step registration flow: 1 = Account Credentials, 2 = Workspace & Identity
    const [step, setStep] = useState<1 | 2>(1);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [tenantName, setTenantName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleContinueToStep2 = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password) {
            setError('Please enter your email and password.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match. Please verify your password.');
            return;
        }

        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!first_name.trim() || !last_name.trim() || !tenantName.trim()) {
            setError('Please complete all required fields.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password,
                    first_name: first_name.trim(),
                    last_name: last_name.trim(),
                    tenant_name: tenantName.trim(),
                    role: 'admin',
                }),
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
                setError(data.error || data.detail || 'Registration failed. Please check your information.');
            }
        } catch (err) {
            console.error('Error during registration:', err);
            setError('An unexpected network error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <FounderMilestoneCard variant="card" showDetails={true} />

            <div className="bg-white p-7 sm:p-9 rounded-3xl shadow-sm border border-gray-200/80">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
                        <Sparkles size={12} />
                        <span>Step {step} of 2 &bull; Founder Access Registration</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        {step === 1 ? 'Create Your Account' : 'Set Up Your Executive Workspace'}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {step === 1
                            ? 'Choose your executive login credentials to begin.'
                            : 'Personalize your workspace and executive identity.'}
                    </p>
                </div>

                {/* Step indicator pills */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                    <div className={`h-1.5 rounded-full transition-all ${
                        step >= 1 ? 'bg-indigo-600' : 'bg-gray-100'
                    }`} />
                    <div className={`h-1.5 rounded-full transition-all ${
                        step === 2 ? 'bg-indigo-600' : 'bg-gray-100'
                    }`} />
                </div>

                {error && (
                    <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    /* Step 1: Email & Passwords */
                    <form onSubmit={handleContinueToStep2} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                                Executive Email Address
                            </label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="you@company.com"
                                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input
                                        id="password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Min. 8 characters"
                                        className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        placeholder="Confirm password"
                                        className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl gradient-brand text-white text-sm font-semibold hover:opacity-90 transition shadow-md shadow-indigo-100 cursor-pointer"
                            >
                                <span>Continue to Workspace Setup</span>
                                <ArrowRight size={15} />
                            </button>
                        </div>
                    </form>
                ) : (
                    /* Step 2: Name & Workspace Name */
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="first_name" className="block text-xs font-semibold text-gray-700 mb-1">
                                    First Name
                                </label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input
                                        id="first_name"
                                        type="text"
                                        autoComplete="given-name"
                                        value={first_name}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                        placeholder="Jane"
                                        className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="last_name" className="block text-xs font-semibold text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input
                                        id="last_name"
                                        type="text"
                                        autoComplete="family-name"
                                        value={last_name}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                        placeholder="Doe"
                                        className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="tenant_name" className="block text-xs font-semibold text-gray-700 mb-1">
                                Workspace / Company Name
                            </label>
                            <div className="relative">
                                <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    id="tenant_name"
                                    type="text"
                                    value={tenantName}
                                    onChange={(e) => setTenantName(e.target.value)}
                                    required
                                    placeholder="Acme Corp or My Studio"
                                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                                />
                            </div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 flex items-center gap-2 text-xs text-gray-600">
                            <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                            <span>Your workspace will be provisioned with isolated, encrypted storage.</span>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="px-4 py-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl gradient-brand text-white text-sm font-semibold hover:opacity-90 transition shadow-md shadow-indigo-100 disabled:opacity-60 cursor-pointer"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                        </svg>
                                        <span>Creating Your Workspace...</span>
                                    </span>
                                ) : (
                                    <span>Create Account &amp; Proceed</span>
                                )}
                            </button>
                        </div>
                    </form>
                )}

                <div className="mt-6 pt-5 border-t border-gray-100 text-center text-xs text-gray-500">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Sign In &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
}