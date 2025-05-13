import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { config } from "@fortawesome/fontawesome-svg-core";
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;


export const metadata: Metadata = {
  title: "NovaSuite | Modular AI SaaS Industy-Specific Business Automation",
  description: "NovaSuite is a secure, mobile-optimized SaaS platform powered by AI and built for your industry. Customize tools, pay only for what you use, and scale confidently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
