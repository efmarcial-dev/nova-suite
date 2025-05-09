'use client'

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
    <nav className="sticky top-0 z-50 bg-white w-full px-6 py-4 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                <Image src={'/images/nova_logo.png'} alt="Nova Suite" width={34} height={34} />
                <span className="text-2xl font-medium text-gray-900">NovaSuite</span>
            </div>

            {/* Burger Icon */}
            <button
            className="md:hidden flex flex-col justify-center space-y-1.5 z-20"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
            >
            <div
                className={`h-0.5 w-6 bg-black transition-transform duration-300 ${
                menuOpen ? 'rotate-45 translate-y-[6px]' : ''
                }`}
            />
            <div
                className={`h-0.5 w-6 bg-black transition-all duration-300 ${
                menuOpen ? 'opacity-0' : ''
                }`}
            />
            <div
                className={`h-0.5 w-6 bg-black transition-transform duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-[10px]' : ''
                }`}
            />
            </button>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-8">
            <Link href="#about" className="text-sm text-gray-700 hover:text-black transition">
                About
            </Link>
            <Link href="#features" className="text-sm text-gray-700 hover:text-black transition">
                Features
            </Link>
            <Link href="#pricing" className="text-sm text-gray-700 hover:text-black transition">
                Pricing
            </Link>
            <Link href="#process" className="text-sm text-gray-700 hover:text-black transition">
                Process
            </Link>
            <Link
                href="#get-started"
                className="bg-black text-white text-sm font-medium px-4 py-2 rounded-full hover:opacity-90 transition"
            >
                Get Started
            </Link>
            </div>
        </div>

        {/* Mobile Dropdown */}
        <div
            className={`md:hidden absolute left-0 top-full w-full bg-white px-6 overflow-hidden transition-all duration-300 ${
            menuOpen ? 'max-h-[300px] py-6' : 'max-h-0 py-0'
            }`}
        >
            <div className="flex flex-col items-center space-y-4">
            <Link href="#about" onClick={() => setMenuOpen(false)} className="text-gray-700 text-sm">
                About
            </Link>
            <Link href="#features" onClick={() => setMenuOpen(false)} className="text-gray-700 text-sm">
                Features
            </Link>
            <Link href="#pricing" onClick={() => setMenuOpen(false)} className="text-gray-700 text-sm">
                Pricing
            </Link>
            <Link href="#process" onClick={() => setMenuOpen(false)} className="text-gray-700 text-sm">
                Process
            </Link>
            <Link
                href="#get-started"
                onClick={() => setMenuOpen(false)}
                className="bg-black text-white text-sm font-medium px-4 py-2 rounded-full hover:opacity-90 transition"
            >
                Get Started
            </Link>
            </div>
        </div>
    </nav>
    )

}