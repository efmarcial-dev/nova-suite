import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-12 px-6 border-t border-slate-100 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Brand & Tagline */}
        <div className="flex items-center space-x-3">
          <Image
            src="/images/foxly_mascot_transparent.png"
            alt="Foxly"
            width={32}
            height={32}
            className="object-contain"
          />
          <div className="flex flex-col">
            <span className="font-bold text-gray-950 text-xl tracking-tight lowercase">foxly</span>
            <span className="text-[10px] text-gray-400 font-medium -mt-1">Your life. In flow.</span>
          </div>
        </div>

        {/* Product Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-600 font-medium">
          <a href="#features" className="hover:text-[#1EA0FF] transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-[#1EA0FF] transition-colors">
            How It Works
          </a>
          <a href="#security" className="hover:text-[#1EA0FF] transition-colors">
            Security &amp; Compliance
          </a>
          <a href="#faq" className="hover:text-[#1EA0FF] transition-colors">
            FAQ
          </a>
          <Link href="/privacy" className="hover:text-[#1EA0FF] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-[#1EA0FF] transition-colors">
            Terms of Service
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-xs text-slate-400 text-center lg:text-right">
          &copy; {new Date().getFullYear()} Foxly. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
