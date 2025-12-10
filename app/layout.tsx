// app/layout.tsx
import './globals.css'
import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" >
      <head>
        <Script src='javascripts/jeeva.js' strategy="beforeInteractive"></Script>
      </head>
      <body className="h-full">{children}</body>
    </html>
  )
}
