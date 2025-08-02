import type { Metadata } from "next";
import '../globals.css';
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { config } from "@fortawesome/fontawesome-svg-core";
import '@fortawesome/fontawesome-svg-core/styles.css';
import Script from "next/script";
config.autoAddCss = false;



export const metadata: Metadata = {
  title: "NovaSuite: AI-Powered Smart Business Operating System | Early Access Available",
  description: "NovaSuite is a modular, AI-driven business platform combining CRM, task automation, analytics, and more. Join the early access program for lifetime access."
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="bUwM0nGN1XOLiYGx9iTCNlNYfCCWJofBLwj9_nzKHoY" />
        
      {/* Structured Data for AEO */}
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "NovaSuite",
              "operatingSystem": "Web",
              "applicationCategory": "BusinessApplication",
              "url": "https://novasuite.novadev.solutions",
              "creator": {
                "@type": "Organization",
                "name": "NovaDev",
                "url": "https://www.novadev.solutions"
              },
              "description":
                "NovaSuite is an AI-powered smart business platform designed to automate operations, streamline workflows, and adapt to vertical markets.",
              "keywords":
                "SaaS, automation, CRM, workflow management, AI software, ERP, business operations, vertical SaaS, business platform",
              "dateCreated": "2025-05-01"
            }),
          }}
        />
      </head>
      {/* Google tag (gtag.js)  */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-5WN9CP1ND8"
  strategy="afterInteractive"
  async />
      <Script id="google-analytics" strategy="afterInteractive">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-5WN9CP1ND8');
        `}
      </Script>
      <body >
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
