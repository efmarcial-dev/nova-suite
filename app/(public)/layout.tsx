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
  description: "Foxly helps you decide what deserves your attention across inbox, calendar, and tasks. Try Foxly free for 3 days, then choose annual access for $60 per year.",
  verification: {
    google: "bUwM0nGN1XOLiYGx9iTCNlNYfCCWJofBLwj9_nzKHoY",
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
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
      <AOSInit />
      <div className="overflow-x-clip">
        <NavBar />
        {children}
        <Footer />
      </div>
    </>
  );
}
