// app/layout.tsx
import './globals.css'

import Script from 'next/script'
import AuthRefreshManager from './components/AuthRefreshManager'
import { Analytics } from '@vercel/analytics/next';
import DashboardAnalytics from './components/DashboardAnalytics';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
        <meta name="testmybuild-site-verification" content="tmb-aek25sicztph"></meta>
      </head>
      <body className="h-full">
        <DashboardAnalytics />
        <AuthRefreshManager />
        {children}
        <Analytics />
        <Script src="/javascripts/jeeva.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
