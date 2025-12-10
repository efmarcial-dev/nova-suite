import type { Metadata } from "next";
import '../globals.css';
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { config } from "@fortawesome/fontawesome-svg-core";
import '@fortawesome/fontawesome-svg-core/styles.css';
import Script from "next/script";
config.autoAddCss = false;



export const metadata: Metadata = {
  title: "Nova IT Solutions: AI-Powered Smart Business Operating System ",
  description: "Nova IT Solutions is a Digital Transformation Agency, AI-driven business that combines task automation, analytics, and more."
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
              "name": "Nova IT Solutions",
              "operatingSystem": "Web",
              "applicationCategory": "BusinessApplication",
              "url": "https://www.novadev.solutions",
              "creator": {
                "@type": "Organization",
                "name": "NovaDev",
                "url": "https://www.novadev.solutions"
              },
              "description":
                "Nova IT Solution is an AI-powered smart business platform designed to automate operations, streamline workflows, and adapt to vertical markets.",
              "keywords":
                "SaaS, automation, CRM, workflow management, AI software, ERP, business operations, vertical SaaS, business platform",
              "dateCreated": "2025-05-01"
            }),
          }}
        />
        <Script id="jeeva-script" strategy="beforeInteractive">
          {`
            !function () {
              var jeeva = window.jeeva = window.jeeva || [];
              if (jeeva.invoked) return;
              jeeva.invoked = true;
              jeeva.methods = ['identify', 'collect'];
              jeeva.factory = function (method) {
                return function () {
                  var args = Array.prototype.slice.call(arguments);
                  args.unshift(method);
                  jeeva.push(args);
                  return jeeva;
                };
              };
              for (var i = 0; i < jeeva.methods.length; i++) {
                var key = jeeva.methods[i];
                jeeva[key] = jeeva.factory(key);
              }
              jeeva.load = function (key) {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.async = true;
                script.src = 'https://r2d2-inbound-js-store-production.s3.us-east-1.amazonaws.com/' 
                             + key + '/jeeva.js';
                var first = document.getElementsByTagName('script')[0];
                first.parentNode.insertBefore(script, first);
              };
              jeeva.SNIPPET_VERSION = '1.0.';
              jeeva.load('72ae3458-ea94-4a1b-aca5-cd9e96a698c9');
            }();
          `}
        </Script>
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
