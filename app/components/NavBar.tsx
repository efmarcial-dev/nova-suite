'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Security & Trust', href: '#security' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 w-full px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <Image
            src="/images/foxly_mascot_transparent.png"
            alt="Foxly"
            width={38}
            height={38}
            className="object-contain transition-transform duration-200 group-hover:scale-105"
            priority
          />
          <div className="flex flex-col">
            <span className="text-2xl font-black text-gray-950 tracking-tight lowercase">foxly</span>
            <span className="text-[10px] text-gray-400 font-semibold tracking-tight -mt-1 hidden sm:inline">
              Your life. In flow.
            </span>
          </div>
        </Link>

        {/* Desktop Product Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-[#1EA0FF] transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop Auth CTAs */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-700 hover:text-[#1EA0FF] transition-colors px-3 py-2"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 bg-[#1EA0FF] hover:bg-[#0088EE] text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-md shadow-blue-500/20 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Start 3-Day Free Trial</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col justify-center space-y-1.5 z-20 p-2 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          <div
            className={`h-0.5 w-6 bg-slate-900 transition-transform duration-300 ${
              menuOpen ? 'rotate-45 translate-y-[8px]' : ''
            }`}
          />
          <div
            className={`h-0.5 w-6 bg-slate-900 transition-opacity duration-300 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <div
            className={`h-0.5 w-6 bg-slate-900 transition-transform duration-300 ${
              menuOpen ? '-rotate-45 -translate-y-[8px]' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden absolute left-0 top-full w-full bg-white border-b border-slate-200 px-6 shadow-xl overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-[400px] py-6' : 'max-h-0 py-0'
        }`}
      >
        <div className="flex flex-col space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-base font-semibold text-slate-800 hover:text-[#1EA0FF] py-1 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-3">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="text-center py-2.5 text-sm font-semibold text-slate-700 hover:text-[#1EA0FF] border border-slate-200 rounded-xl"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-[#1EA0FF] text-white text-sm font-bold py-3 rounded-xl shadow-md shadow-blue-500/20"
            >
              <span>Start 3-Day Free Trial</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
