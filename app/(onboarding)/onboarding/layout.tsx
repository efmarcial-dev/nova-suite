import '../../globals.css';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/images/nova_logo.png"
              alt="NovaSuite"
              width={34}
              height={34}
              priority
            />
            <span className="text-lg font-semibold tracking-tight text-slate-950">NovaSuite</span>
          </Link>
          <span className="text-xs font-medium text-slate-500">Workspace setup</span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-7 sm:px-8 sm:pt-10">
        {children}
      </main>
    </div>
  );
}
