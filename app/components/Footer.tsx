import Image from "next/image"
import Link from "next/link"

export default function Footer() {
    return (
        <footer className="w-full py-8 px-4 border-t border-slate-100 bg-white/60">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Logo and Brand */}
                <div className="flex items-center space-x-2">
                    <Image src={'/images/nova_logo.png'} alt="Nova Suite" width={32} height={32} />
                    <span className="font-semibold text-gray-900 text-xl tracking-tight">NovaSuite</span>
                </div>

                {/* Legal & Policy Links */}
                <div className="flex items-center space-x-6 text-xs text-gray-500 font-medium">
                    <Link 
                        href="/privacy" 
                        className="hover:text-indigo-600 transition-colors"
                        title="Application Privacy Policy"
                    >
                        Privacy Policy
                    </Link>
                    <span className="text-gray-300">&bull;</span>
                    <Link 
                        href="/terms" 
                        className="hover:text-indigo-600 transition-colors"
                        title="Application Terms of Service"
                    >
                        Terms of Service
                    </Link>
                    <span className="text-gray-300">&bull;</span>
                    <Link 
                        href="/contact" 
                        className="hover:text-indigo-600 transition-colors"
                    >
                        Support
                    </Link>
                </div>

                {/* Copyright */}
                <p className="text-xs text-gray-400">
                    &copy;{new Date().getFullYear()} <a href="https://www.novadev.solutions" target="_blank" rel="noreferrer" className="hover:text-gray-600">Nova.</a> All rights reserved.
                </p>
            </div>
        </footer>
    )
}