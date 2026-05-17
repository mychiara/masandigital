'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Globe, Share2, Rss } from 'lucide-react';
import { db } from '../lib/db';

export default function Footer() {
  const [siteTitle, setSiteTitle] = useState('masandigital.com');
  const [siteLogo, setSiteLogo] = useState('');
  
  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await db.getSettings();
        if (settings) {
          if (settings.site_title) setSiteTitle(settings.site_title);
          if (settings.site_logo) setSiteLogo(settings.site_logo);
        }
      } catch (err) {
        console.error('Failed to load settings inside Footer:', err);
      }
    }
    loadSettings();

    if (typeof window !== 'undefined') {
      window.addEventListener('masandigital_settings_changed', loadSettings);
      return () => window.removeEventListener('masandigital_settings_changed', loadSettings);
    }
  }, []);

  return (
    <footer className="w-full bg-gradient-to-r from-[#1d4ed8] via-[#1e40af] to-[#1e3a8a] text-white/80 border-t border-primary/20 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Bio */}
        <div className="col-span-1 md:col-span-2">
          {siteLogo ? (
            <div className="relative h-8 w-44 mb-4">
              <Image
                src={siteLogo}
                alt={siteTitle}
                fill
                sizes="176px"
                className="object-contain object-left filter brightness-0 invert opacity-90"
              />
            </div>
          ) : (
            <h2 className="font-black text-2xl text-white mb-4">{siteTitle}</h2>
          )}
          <p className="text-sm text-white/70 max-w-sm mb-6">
            The authoritative source for high-end technology strategy, innovative engineering, and the digital future.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-white hover:bg-white/20 p-2 bg-white/10 rounded-full transition-all">
              <Globe className="w-4 h-4" />
            </a>
            <a href="#" className="text-white hover:bg-white/20 p-2 bg-white/10 rounded-full transition-all">
              <Share2 className="w-4 h-4" />
            </a>
            <a href="#" className="text-white hover:bg-white/20 p-2 bg-white/10 rounded-full transition-all">
              <Rss className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Links Column 1 */}
        <div>
          <h4 className="font-black text-xs uppercase tracking-wider text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link className="hover:text-white transition-colors" href="/about">About Us</Link></li>
            <li><a className="hover:text-white transition-colors" href="#">Advertise</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Careers</a></li>
            <li><Link className="hover:text-white transition-colors" href="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h4 className="font-black text-xs uppercase tracking-wider text-white mb-4">Legal Policy</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link className="hover:text-white transition-colors" href="/privacy">Privacy Policy</Link></li>
            <li><Link className="hover:text-white transition-colors" href="/terms">Terms of Service</Link></li>
            <li><Link className="hover:text-white transition-colors" href="/disclaimer">Disclaimer</Link></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 pb-8 text-center border-t border-white/10 pt-8">
        <p className="text-xs text-white/50 mb-2">
          © 2026 {siteTitle}. Empowering the next tech wave. All rights reserved.
        </p>
        <p className="text-xs font-bold text-white/80 tracking-wide">
          Developed by Mas Andy - <a href="https://masangidital.com" target="_blank" rel="noopener noreferrer" className="hover:underline text-white font-black">masangidital.com</a> @2026
        </p>
      </div>
    </footer>
  );
}
