// app/layout.tsx
import './globals.css'
import Script from 'next/script'
import AuthRefreshManager from './components/AuthRefreshManager'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="h-full">
        <AuthRefreshManager />
        {children}
        <Script src="/javascripts/jeeva.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
