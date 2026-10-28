import '../../globals.css';
import Image from 'next/image';
import Link from 'next/link';


export default function AuthLayout({ children }: { children: React.ReactNode }) {
    
  return (
    // Optional: custom branding or background

    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top-left logo */}
      <Link href="/" className="absolute top-6 left-6 flex items-center space-x-2.5">
        <Image
          src="/images/foxly_mascot_transparent.png"
          alt="Foxly"
          width={38}
          height={38}
          className="object-contain"
        />
        <div className="flex flex-col">
          <span className="text-2xl font-black text-gray-900 tracking-tight lowercase">foxly</span>
          <span className="text-[10px] text-gray-400 font-semibold tracking-tight -mt-1">Your life. In flow.</span>
        </div>
      </Link>

      {/* Main content area */}
      <div className="flex-grow flex items-center justify-center h-full py-12 px-4">
        <div className="w-full max-w-2xl">{children}</div>
      </div>
    </div>
  );
}