import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TrackingScripts from "../components/TrackingScripts";
import { db } from "../lib/db";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Dynamic metadata generation (Runs entirely on server-side for GSC & SEO verification)
export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await db.getSettings();
    const title = settings.site_title || "masandigital.com";
    const tagline = settings.site_tagline || "The Future of Tech & Strategy";
    const about = settings.about_content || "The authoritative source for high-end technology strategy, innovative engineering, and the digital future.";
    
    const meta: Metadata = {
      title: `${title} | ${tagline}`,
      description: about.slice(0, 160),
    };

    if (settings.google_site_verification && settings.google_site_verification.trim()) {
      meta.verification = {
        google: settings.google_site_verification.trim(),
      };
    }

    return meta;
  } catch (e) {
    return {
      title: "masandigital.com | The Future of Tech & Strategy",
      description: "The authoritative source for high-end technology strategy, innovative engineering, and the digital future.",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-background text-on-background">
        <TrackingScripts />
        {children}
      </body>
    </html>
  );
}
