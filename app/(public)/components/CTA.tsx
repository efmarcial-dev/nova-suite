'use client'
import { useRouter } from "next/navigation";


export default function CTASec() {

    const router = useRouter();

    return (
        <div id="get-started" className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl shadow-md max-w-5xl w-full text-center px-8 py-12 space-y-6 mx-auto mt-10">
        {/* App Icon Box with Logo */}
        <div className="w-20 h-20 bg-white rounded-2xl shadow flex items-center justify-center mx-auto">
          <img
            src="/images/nova_logo.png"
            alt="Nova CRM Logo"
            className="w-12 h-12 object-contain"
          />
        </div>

        {/* SEO Optimized Heading */}
        <h2 className="text-3xl md:text-6xl font-semibold text-white mt-4 mb-4">
        Early Access Offer
        </h2>
        <p className="max-w-2xl mx-auto mt-4 text-white text-md md:text-lg lg:text-xl">
        Join NovaSuite early and receive <strong>lifetime access</strong> at a discounted rate. Limited spots available.
        </p>

      </div>
    )
}