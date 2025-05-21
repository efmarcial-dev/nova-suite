import Image from "next/image"

export default function Footer() {
    return (
        <footer className="w-full py-6 px-4">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between">
                {/* Logo and Brand */}
                <div className="flex items-center space-x-2">
                    <Image src={'/images/nova_logo.png'} alt="Nova Suite" width={34} height={34} />
                    <span className="font-semibold text-gray-900 text-2xl">NovaSuite</span>
                </div>

                {/* Copyright */}
                <p className="text-sm text-gray-500 mt-4 sm:mt-0">
                    &copy;{new Date().getFullYear()} <a href="https://www.novadev.solutions">Nova.</a> All rights reserved.
                </p>

            </div>
        </footer>
    )
}