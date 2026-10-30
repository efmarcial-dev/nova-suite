import '../../globals.css';
import Image from 'next/image';
import Link from 'next/link';


export default function AuthLayout({ children }: { children: React.ReactNode }) {
    
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-gray-50">
      <header className="w-full px-4 pt-4 sm:px-6 sm:pt-6">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <Image
            src="/images/foxly_mascot_transparent.png"
            alt="Foxly"
            width={38}
            height={38}
            className="object-contain"
          />
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-gray-900 lowercase">foxly</span>
            <span className="-mt-1 text-[10px] font-semibold tracking-tight text-gray-400">Your life. In flow.</span>
          </div>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
        <div className="w-full max-w-2xl">{children}</div>
      </main>
    </div>
  );
}
