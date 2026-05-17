import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TrackingScripts from "../components/TrackingScripts";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "masandigital.com | The Future of Tech & Strategy",
  description: "The authoritative source for high-end technology strategy, innovative engineering, and the digital future.",
};

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
