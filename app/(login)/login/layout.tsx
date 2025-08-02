import '../../globals.css';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    // Optional: custom branding or background

    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top-left logo */}
      <Link href="/" className="absolute top-6 left-6 flex items-center space-x-2">
        <Image
          src="/images/nova_logo.png"
          alt="Logo"
          width={40}
          height={40}
        />
        <span className="text-2xl font-medium text-gray-900">NovaSuite</span>
      </Link>

      {/* Main content area */}
      <div className="flex-grow flex items-center justify-center h-full">
        <div className="w-full max-w-md p-6">{children}</div>
      </div>
    </div>
  );
}
