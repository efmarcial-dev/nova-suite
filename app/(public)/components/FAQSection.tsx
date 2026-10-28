'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How does the 3-day free trial work?',
    answer:
      'You get full, unlimited access to every Foxly feature for 3 days — including multiple connected Google & Outlook inboxes, multi-calendar intelligence, 0–100 task prioritization, and 1-click reply drafting. No credit card is required to sign up. You start using Foxly immediately upon registration.',
  },
  {
    question: 'Can I connect both Google and Microsoft Outlook accounts?',
    answer:
      'Yes! Foxly was designed specifically for executives, founders, and professionals who manage multiple accounts. You can connect your Google Workspace Gmail, personal Google accounts, Microsoft 365 Outlook, and Exchange accounts simultaneously without data duplication or missed messages.',
  },
  {
    question: 'Does Foxly send emails or change meetings without my approval?',
    answer:
      'Never. Foxly operates under strict executive oversight. Every draft reply, follow-up, and calendar proposal is prepared for your review. You have complete control to approve, edit, or dismiss each action with one click.',
  },
  {
    question: 'How secure is my data and who has access to it?',
    answer:
      'Foxly follows strict SOC II compliance standards. Your credentials are handled via secure OAuth 2.0 (powered by Nylas Auth) — Foxly never sees or stores your Google or Microsoft password. All communication is encrypted with TLS 1.3 in transit and AES-256 at rest. Your data is isolated per tenant and is never used to train public AI models.',
  },
  {
    question: 'What happens when my 3-day trial ends?',
    answer:
      'When your trial ends, you can unlock Foxly Founder Lifetime Access for a single one-time payment of $49 USD. There are no monthly subscriptions or recurring fees — you pay once and keep access for the life of Foxly. If you choose not to subscribe, your workspace remains safely archived.',
  },
  {
    question: 'Can I disconnect my email or calendar accounts at any time?',
    answer:
      'Yes, absolutely. You can disconnect any Google or Outlook account with a single click in your Settings at any time, which immediately revokes API access and clears your cached workspace data.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 px-6 lg:px-12 bg-white border-b border-slate-100">
      <div className="max-w-4xl mx-auto space-y-14">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F0F9FF] border border-[#BFE7FF] text-[#0088EE] text-xs font-bold uppercase tracking-wider">
            <HelpCircle size={13} />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0D1B2A] tracking-tight">
            Everything you need to know about Foxly
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal">
            Have questions before starting your free trial? Here are quick answers to the most common inquiries.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-colors bg-white hover:border-slate-300"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-base sm:text-lg focus:outline-none"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-[#1EA0FF]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Note */}
        <div className="text-center pt-2">
          <p className="text-sm text-slate-500">
            Have another question? Reach out to our team at{' '}
            <Link href="/contact" className="text-[#1EA0FF] font-semibold hover:underline">
              support@foxly.app
            </Link>
          </p>
        </div>

      </div>
    </section>
  );
}
