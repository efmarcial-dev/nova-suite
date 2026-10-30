import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, Database, UserCheck, RefreshCw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Foxly',
  description: 'Foxly Application Privacy Policy. Learn how we protect your personal information, email data, calendar events, and payment information.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'October 19, 2026';

  return (
    <div className="min-h-screen bg-slate-50/50 px-4 py-12 text-slate-800 sm:px-6 sm:py-16 lg:px-20 lg:py-24">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-8 lg:p-14 shadow-xs">
        
        {/* Header */}
        <div className="border-b border-slate-100 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0F9FF] border border-[#BFE7FF] text-[#0088EE] text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck size={14} />
            <span>Public Compliance & Security</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Application Privacy Policy
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-mono">
            Effective Date: {lastUpdated} &bull; Version 2.1
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-600">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Eye size={18} className="text-[#1EA0FF]" />
              1. Overview & Commitment
            </h2>
            <p>
              Foxly (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), operated by Nova IT Solutions, is committed to safeguarding your privacy and ensuring transparency in how your personal and corporate information is collected, processed, and safeguarded.
            </p>
            <p>
              This Application Privacy Policy applies to the Foxly operating platform, web applications, and related services (collectively, the &quot;Service&quot;). By creating an account or accessing Foxly, you consent to the data practices described herein.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Database size={18} className="text-[#1EA0FF]" />
              2. Information We Collect
            </h2>
            <p>We collect only the information necessary to provide, optimize, and secure your executive workspace:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-slate-800">Account Credentials & Profile:</strong> Full name, business email address, company or workspace name, encrypted passwords, and profile preferences.
              </li>
              <li>
                <strong className="text-slate-800">Connected Provider Data (Google Workspace & Microsoft 365):</strong> When you explicitly authorize email or calendar integrations via OAuth 2.0, we access email headers, subjects, content snippets, and calendar event metadata solely to deliver automated triage, action item detection, and scheduling intelligence.
              </li>
              <li>
                <strong className="text-slate-800">Billing & Payment Tokens:</strong> Payment processing is handled directly via Square Web Payments SDK. Sensitive card details are tokenized securely directly on Square&apos;s servers. Foxly never stores raw credit card numbers or security CVVs.
              </li>
              <li>
                <strong className="text-slate-800">AI Chat Content:</strong> Chat prompts and responses are saved to your account so you can return to prior conversations. To generate replies, the prompt and relevant conversation history are sent to configured AI providers in this order: Hugging Face, Groq, then OpenRouter when an earlier provider is unavailable.
              </li>
              <li>
                <strong className="text-slate-800">Operational & Telemetry Logs:</strong> Device type, browser user agent, IP address, request timestamps, and system diagnostic logs to prevent fraud and ensure platform uptime.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lock size={18} className="text-[#1EA0FF]" />
              3. Google & Microsoft User Data Handling
            </h2>
            <p>
              Foxly strictly adheres to the <em>Google API Services User Data Policy</em> and <em>Microsoft Identity and Graph API Guidelines</em>, including Limited Use requirements:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Our application access to Google user data and Microsoft user data is utilized strictly to provide user-facing features (executive email triage, meeting synchronization, and task generation).
              </li>
              <li>
                We do not transfer, sell, or disclose your provider data to external third parties or data brokers.
              </li>
              <li>
                We do not use your Google or Microsoft email and calendar content to train generalized public foundational artificial intelligence or machine learning models.
              </li>
              <li>
                Human staff members do not read your raw inbox or calendar messages unless you have provided affirmative explicit consent for technical troubleshooting, or when required by applicable law.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText size={18} className="text-[#1EA0FF]" />
              4. How We Use Information
            </h2>
            <p>Your data is processed to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Deliver executive intelligence: summarize incoming emails, prepare draft responses for your manual review, and organize action items into structured projects.</li>
              <li>Synchronize calendar schedules, detect agenda conflicts, and calculate schedule optimization scores.</li>
              <li>Authenticate your identity, manage tenant workspaces, and enforce subscription access tiers.</li>
              <li>Communicate critical administrative updates, security advisories, and transactional invoices.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserCheck size={18} className="text-[#1EA0FF]" />
              5. Data Retention, Portability & Deletion
            </h2>
            <p>
              You retain full ownership of your data at all times. You can disconnect linked Google or Microsoft accounts at any time from your Workspace Settings.
            </p>
            <p>
              Upon account cancellation or receipt of a formal data erasure request, Foxly will permanently delete your personal profile data, cached messages, event indexes, and associated tokens within thirty (30) days, retaining only minimal records required for statutory tax and legal compliance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <RefreshCw size={18} className="text-[#1EA0FF]" />
              6. Policy Updates & Contact
            </h2>
            <p>
              We may update this Privacy Policy periodically to reflect enhancements to our service or regulatory updates. We will notify users of material modifications through the platform or via registered email.
            </p>
            <p className="pt-2">
              For questions, privacy inquiries, or data subject access requests, please contact our privacy desk:
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-semibold text-slate-900">Nova IT Solutions &ndash; Privacy &amp; Data Protection</p>
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
            <Link href="/terms" className="hover:text-slate-800 underline">
              Terms of Service
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
