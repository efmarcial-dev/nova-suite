import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { config } from "@fortawesome/fontawesome-svg-core";
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;


export const metadata: Metadata = {
  title: "NovaSuite: AI-Powered Smart Business Operating System | Early Access Available",
  description: "NovaSuite is a modular, AI-driven business platform combining CRM, task automation, analytics, and more. Join the early access program for lifetime access."
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
