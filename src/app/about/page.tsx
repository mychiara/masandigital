'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Sparkles, ArrowLeft, Star, Users, Target } from 'lucide-react';
import { db } from '../../lib/db';

export default function AboutUs() {
  const [aboutContent, setAboutContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAbout() {
      try {
        const settings = await db.getSettings();
        setAboutContent(settings.about_content);
      } catch (err) {
        console.error('Failed to load about content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAbout();
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

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 md:p-12 shadow-sm space-y-8">
            {/* Header section */}
            <div className="text-center space-y-3 pb-8 border-b border-outline-variant/10">
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest bg-primary-fixed px-3 py-1 rounded-full">
                Behind the CMS
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-on-surface tracking-tight">About masandigital.com</h1>
              <p className="text-sm text-on-surface-variant max-w-xl mx-auto">
                Empowering content builders and tech strategists with next-generation publishing excellence.
              </p>
            </div>

            {/* Core Story */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Our Editorial Mission
                </h2>
                {loading ? (
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                    {aboutContent || 'About content is currently empty. Please configure it in your Admin settings.'}
                  </p>
                )}
              </div>
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-md border border-outline-variant/20">
                <Image
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop"
                  alt="Tech Strategy Network"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Values Grid */}
            <div className="pt-8 border-t border-outline-variant/10 space-y-6">
              <h3 className="text-lg font-bold text-on-surface text-center">Core Pillars Governing Our Publications</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Pillar 1 */}
                <div className="p-6 bg-surface-container-low border border-outline-variant/20 rounded-2xl space-y-3">
                  <Star className="w-6 h-6 text-primary" />
                  <h4 className="font-extrabold text-sm text-on-surface">Unmatched Depth</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    We steer clear of clickbait. Every article is written with meticulous technical accuracy and research-grounded facts.
                  </p>
                </div>

                {/* Pillar 2 */}
                <div className="p-6 bg-surface-container-low border border-outline-variant/20 rounded-2xl space-y-3">
                  <Users className="w-6 h-6 text-primary" />
                  <h4 className="font-extrabold text-sm text-on-surface">Writer Synergy</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    We foster an inclusive ecosystem where developers and industry veterans publish side-by-side with peer reviews.
                  </p>
                </div>

                {/* Pillar 3 */}
                <div className="p-6 bg-surface-container-low border border-outline-variant/20 rounded-2xl space-y-3">
                  <Target className="w-6 h-6 text-primary" />
                  <h4 className="font-extrabold text-sm text-on-surface">Future Centric</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    From quantum computing paradigms to next-gen AI automation workflows, we curate paths into tomorrow's tech stack.
                  </p>
                </div>

              </div>
            </div>

            {/* Standard Callout */}
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl text-center">
              <p className="text-xs text-primary font-bold">
                Looking to contribute or partner with us? Reach out directly via our Contact Us portal!
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
