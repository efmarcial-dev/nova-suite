import type { Metadata } from "next";
import '../globals.css';
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { config } from "@fortawesome/fontawesome-svg-core";
import '@fortawesome/fontawesome-svg-core/styles.css';
import Script from "next/script";
import AOSInit from "../components/AOSProvider";
config.autoAddCss = false;



export const metadata: Metadata = {
  title: "foxly · Your life. In flow. | AI Executive Assistant & Smart OS",
  description: "Foxly is your AI executive assistant with multiple Google & Outlook inboxes, multi-calendar sync, smart task scoring, and strict SOC II compliance. 3-day free trial."
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
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
        <AOSInit />
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
