import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TrackingScripts from "../components/TrackingScripts";
import ThemeCustomizer from "../components/ThemeCustomizer";
import { db } from "../lib/db";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
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
      metadataBase: new URL('https://masandigital.com'),
      alternates: {
        canonical: '/',
      },
      openGraph: {
        title: `${title} | ${tagline}`,
        description: about.slice(0, 160),
        url: 'https://masandigital.com',
        siteName: title,
        type: 'website',
        locale: 'id_ID',
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
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
      <head>
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-on-background">
        <TrackingScripts />
        {children}
        <ThemeCustomizer />
      </body>
    </html>
  );
}

