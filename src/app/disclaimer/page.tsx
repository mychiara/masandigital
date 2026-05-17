'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { db } from '../../lib/db';

export default function Disclaimer() {
  const [disclaimerContent, setDisclaimerContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDisclaimer() {
      try {
        const settings = await db.getSettings();
        setDisclaimerContent(settings.disclaimer_content);
      } catch (err) {
        console.error('Failed to load disclaimer content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDisclaimer();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Navbar />

      <main className="pt-40 pb-16 flex-grow">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Homepage
          </Link>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 md:p-12 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-6 border-b border-outline-variant/10">
              <AlertTriangle className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">Disclaimer</h1>
                <p className="text-xs text-on-surface-variant mt-1">Official Legal Statement</p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <section className="space-y-4 text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                {disclaimerContent || 'Disclaimer content is currently empty. Please configure it in your Admin settings.'}
              </section>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
