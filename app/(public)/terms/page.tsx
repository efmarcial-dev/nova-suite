import type { Metadata } from 'next';
import Link from 'next/link';
import { Scale, CheckCircle2, ShieldAlert, CreditCard, RefreshCcw, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | Foxly',
  description: 'Foxly Application Terms of Service. Review the conditions, acceptable use policies, subscription terms, and warranties governing your use of our platform.',
};

export default function TermsOfServicePage() {
  const lastUpdated = 'October 19, 2026';

  return (
    <div className="min-h-screen bg-slate-50/50 py-24 px-6 lg:px-20 text-slate-800">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-14 shadow-xs">
        
        {/* Header */}
        <div className="border-b border-slate-100 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0F9FF] border border-[#BFE7FF] text-[#0088EE] text-xs font-semibold uppercase tracking-wider mb-4">
            <Scale size={14} />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Application Terms of Service
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-mono">
            Effective Date: {lastUpdated} &bull; Version 2.1
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-600">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#1EA0FF]" />
              1. Acceptance of Terms
            </h2>
            <p>
              These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;Customer&quot;, &quot;you&quot;, or &quot;your&quot;) and Nova IT Solutions (&quot;Foxly&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
            </p>
            <p>
              By accessing, browsing, registering for an account, or purchasing a subscription on Foxly, you acknowledge that you have read, understood, and agreed to be bound by these Terms and our Privacy Policy. If you do not agree with any part of these Terms, you must not use or access the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Scale size={18} className="text-[#1EA0FF]" />
              2. Description of the Service
            </h2>
            <p>
              Foxly is an AI-powered smart business operating system designed to enhance executive workflow efficiency. The platform combines:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Meeting Intelligence:</strong> Transcribing agendas, extracting decisions, and scheduling follow-up action items.</li>
              <li><strong>Email Intelligence:</strong> Inbound message classification, urgency prioritization, and automated draft reply preparation for user approval.</li>
              <li><strong>Task &amp; Project Delegation:</strong> Generating structured work tasks from natural language directives and managing project boards.</li>
              <li><strong>Calendar Optimization:</strong> Managing cross-calendar schedule density and conflict resolution.</li>
            </ul>
            <p className="italic text-slate-500 pt-1">
              Guiding Principle: AI features provided by Foxly are intended to assist and empower users in completing high-confidence work; the user maintains final authority and oversight over any dispatched messages, payments, or task assignments.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CreditCard size={18} className="text-[#1EA0FF]" />
              3. Subscriptions, Payments &amp; Lifetime Access
            </h2>
            <p>
              Access to core Foxly intelligence capabilities requires an active subscription or valid lifetime license:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Billing &amp; Processing:</strong> Payments are processed securely via Square Web Payments. By submitting payment details, you authorize our processing partner to charge the specified amount.
              </li>
              <li>
                <strong>Founder Lifetime Access:</strong> The $49 one-time Founder purchase grants uninterrupted access to the standard Foxly platform tiers for the operational lifetime of the product without recurring renewal fees.
              </li>
              <li>
                <strong>Refunds &amp; Cancellations:</strong> Monthly or annual subscription fees can be cancelled at any time from your Workspace Settings. Because digital access credentials and tokens are provisioned immediately, one-time lifetime license purchases are non-refundable after fourteen (14) days from the initial transaction date unless required by law.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert size={18} className="text-[#1EA0FF]" />
              4. Acceptable Use &amp; Account Responsibilities
            </h2>
            <p>You agree to use Foxly solely for legitimate business operations and agree NOT to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Attempt to reverse engineer, decompile, or harvest source code from our software systems or APIs.</li>
              <li>Use the Service to transmit unsolicited commercial emails (spam), malicious code, or defamatory content.</li>
              <li>Misrepresent your identity or impersonate any individual or enterprise.</li>
              <li>Bypass or attempt to circumvent security mechanisms, access controls, or rate limits.</li>
            </ul>
            <p>
              You are solely responsible for maintaining the confidentiality of your workspace password and for all activities that occur under your registered account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <RefreshCcw size={18} className="text-[#1EA0FF]" />
              5. Third-Party Integrations (Google &amp; Microsoft)
            </h2>
            <p>
              Foxly enables optional integrations with third-party service providers, including Google Workspace and Microsoft 365. Your usage of those third-party services is governed by their respective terms of service. Foxly is not responsible for outages, rate limits, or API deprecations imposed by third-party platforms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle size={18} className="text-[#1EA0FF]" />
              6. Disclaimer of Warranties &amp; Limitation of Liability
            </h2>
            <p>
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, whether express, implied, or statutory. Foxly does not guarantee uninterrupted, bug-free, or error-free operation.
            </p>
            <p>
              To the maximum extent permitted by applicable law, in no event shall Nova IT Solutions or its affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, or loss of profits or revenues, arising out of or related to your use of the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">
              7. Governing Law &amp; Contact
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Florida, without regard to conflict of law principles.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1 mt-3">
              <p className="font-semibold text-slate-900">Nova IT Solutions &ndash; Legal Affairs</p>
              <p>Email: <a href="mailto:support@novadev.solutions" className="text-[#1EA0FF] hover:underline">support@novadev.solutions</a></p>
              <p>Website: <a href="https://www.novadev.solutions" className="text-[#1EA0FF] hover:underline" target="_blank" rel="noreferrer">www.novadev.solutions</a></p>
            </div>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <Link href="/" className="text-[#1EA0FF] hover:text-[#0088EE] font-semibold">
            &larr; Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-800 underline">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-slate-800 underline">
              Contact Us
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
