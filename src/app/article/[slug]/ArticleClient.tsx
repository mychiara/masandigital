'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import AdSlot from '../../../components/AdSlot';
import AICompanion from '../../../components/AICompanion';
import { db, Article } from '../../../lib/db';
import { 
  Calendar, 
  Clock, 
  Eye, 
  ChevronRight, 
  ThumbsUp, 
  MessageSquare, 
  Bookmark, 
  Share2, 
  Send,
  ArrowLeft,
  BookOpen,
  ShieldAlert,
  Loader2,
  Palette,
  Sun,
  Moon,
  Sparkles,
  X,
  Flame
} from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatar: string;
  likes: number;
}

interface ArticleClientProps {
  initialArticle: Article;
}

export default function ArticleClient({ initialArticle }: ArticleClientProps) {
  const [articlesList, setArticlesList] = useState<Article[]>([initialArticle]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [settings, setSettings] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingNext, setLoadingNext] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Theme Personalization Engine State
  const [showThemeDrawer, setShowThemeDrawer] = useState(false);
  const [currentMode, setCurrentMode] = useState('light');
  const [currentScheme, setCurrentScheme] = useState('blue');

  // Smart Exit-Intent State
  const [showExitIntent, setShowExitIntent] = useState(false);
  
  // Smart Floating Ad Banner State
  const [showBottomAd, setShowBottomAd] = useState(false);
  const [isBottomAdDismissed, setIsBottomAdDismissed] = useState(false);

  // Load site settings and persist theme on mount
  useEffect(() => {
    async function loadSettings() {
      const s = await db.getSettings();
      setSettings(s);
    }
    loadSettings();

    // Persist visual theme from local storage
    const savedMode = localStorage.getItem('theme_mode') || 'light';
    const savedScheme = localStorage.getItem('theme_scheme') || 'blue';
    setCurrentMode(savedMode);
    setCurrentScheme(savedScheme);
    document.documentElement.setAttribute('data-mode', savedMode);
    document.documentElement.setAttribute('data-color-scheme', savedScheme);
  }, []);

  // Theme changing trigger
  const changeTheme = (mode: string, scheme: string) => {
    setCurrentMode(mode);
    setCurrentScheme(scheme);
    localStorage.setItem('theme_mode', mode);
    localStorage.setItem('theme_scheme', scheme);
    document.documentElement.setAttribute('data-mode', mode);
    document.documentElement.setAttribute('data-color-scheme', scheme);
  };

  // Exit-Intent Mouse Movement Listener
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Triggers if mouse leaves viewport from top (attempting to close tab)
      if (e.clientY < 20) {
        const hasShown = sessionStorage.getItem('exit_intent_ad_shown');
        if (!hasShown) {
          setShowExitIntent(true);
          sessionStorage.setItem('exit_intent_ad_shown', 'true');
        }
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  // Fetch other published articles to find next articles to load
  useEffect(() => {
    async function loadAllArticles() {
      try {
        const data = await db.getArticles();
        const published = data.filter(
          a => a.status === 'published' && a.id !== initialArticle.id
        );
        setAllArticles(published);
        if (published.length === 0) {
          setHasMore(false);
        }
      } catch (err) {
        console.error('Failed to load articles list for scroll:', err);
        setHasMore(false);
      }
    }
    loadAllArticles();
  }, [initialArticle]);

  // Fetch related articles for the first article's "Baca Juga" slot
  useEffect(() => {
    db.getArticles(initialArticle.category).then(data => {
      const published = data.filter(
        a => a.status === 'published' && a.id !== initialArticle.id
      );
      setRelatedArticles(published.slice(0, 5));
    });
  }, [initialArticle]);

  // Load next article sequentially
  const loadNextArticle = () => {
    if (loadingNext || !hasMore) return;
    setLoadingNext(true);

    const loadedIds = articlesList.map(a => a.id);
    const nextArticle = allArticles.find(a => !loadedIds.includes(a.id));

    if (nextArticle) {
      setTimeout(() => {
        setArticlesList(prev => [...prev, nextArticle]);
        setLoadingNext(false);
      }, 1200);
    } else {
      setHasMore(false);
      setLoadingNext(false);
    }
  };

  // Scroll Progress Bar Tracker & Smart Floating Bottom Ad trigger
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);

        // Show floating bottom ad banner after scrolling past 25% of page
        if (progress > 25 && !isBottomAdDismissed) {
          setShowBottomAd(true);
        } else {
          setShowBottomAd(false);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isBottomAdDismissed]);

  // IntersectionObserver for auto loading next article
  useEffect(() => {
    if (!hasMore || allArticles.length === 0 || loadingNext) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadNextArticle();
        }
      },
      { rootMargin: '150px' }
    );

    const target = loaderRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [hasMore, allArticles, articlesList, loadingNext]);

  // IntersectionObserver for Virtual URL Routing & Document Title update
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slug = entry.target.getAttribute('data-slug');
            const title = entry.target.getAttribute('data-title');
            if (slug && title) {
              window.history.replaceState(null, '', `/article/${slug}`);
              document.title = `${title} | ${settings?.site_title || 'masandigital.com'}`;
            }
          }
        });
      },
      {
        rootMargin: '-20% 0px -65% 0px'
      }
    );

    const containers = document.querySelectorAll('.article-block-container');
    containers.forEach((c) => observer.observe(c));

    return () => observer.disconnect();
  }, [articlesList, settings]);

  const activeArticle = articlesList[articlesList.length - 1] || initialArticle;

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background animate-in fade-in duration-500">
      {/* Interactive reading progress indicator */}
      <div className="reading-progress-container">
        <div className="reading-progress-bar" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      <Navbar />

      <main className="pt-36 pb-16 flex-grow">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          
          {/* Above Header Ad Slot */}
          {(!settings || (settings.ads_enabled && settings.ads_placements.above_header)) && (
            <div className="w-full min-h-[90px] mb-8 overflow-hidden rounded-2xl border border-outline-variant/15 flex items-center justify-center bg-surface-container-low/20">
              {settings?.ads_script_code ? (
                <AdSlot html={settings.ads_script_code} placement="above_header" />
              ) : (
                <div className="p-6 bg-primary/5 text-primary text-xs font-bold text-center rounded-xl uppercase tracking-widest">[masandigital.com Premium AdSlot Banner]</div>
              )}
            </div>
          )}
          
          {/* Breadcrumbs Navigation */}
          <nav className="flex items-center gap-2 mb-8 text-on-surface-variant/80 font-semibold text-xs">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant/40" />
            <span className="bg-primary/5 text-primary px-2.5 py-0.5 rounded-full uppercase text-[10px] tracking-wider font-bold">
              {activeArticle.category}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant/40" />
            <span className="text-on-surface-variant truncate max-w-xs">{activeArticle.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
            
            {/* Left Sidebar Share Drawers & Theme Selector Button */}
            <div className="hidden xl:flex flex-col gap-4 sticky top-28 h-fit col-span-1 -ml-16">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }} 
                className="w-12 h-12 rounded-full bg-surface-container-low border border-outline-variant/30 flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer shadow-md"
                title="Share Article"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  alert('Thank you for liking this article!');
                }} 
                className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center transition-colors bg-surface-container-low hover:bg-primary hover:text-white cursor-pointer shadow-md"
                title="Like Article"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              
              {/* Premium Floating Theme Control Button */}
              <button 
                onClick={() => setShowThemeDrawer(true)} 
                className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center transition-all bg-primary/10 text-primary hover:bg-primary hover:text-white cursor-pointer shadow-lg animate-pulse"
                title="Personalize Theme"
              >
                <Palette className="w-4 h-4" />
              </button>
            </div>

            {/* Middle Main Content Block with dynamic Infinite Scroll */}
            <div className="lg:col-span-8 space-y-16">
              {articlesList.map((art, index) => (
                <div 
                  key={art.id} 
                  data-slug={art.slug} 
                  data-title={art.title} 
                  className="article-block-container"
                >
                  <ArticleBlock 
                    article={art} 
                    settings={settings} 
                    isFirst={index === 0} 
                    relatedArticles={relatedArticles}
                  />
                </div>
              ))}

              {/* Dynamic scroll loading state indicator */}
              {hasMore && (
                <div 
                  ref={loaderRef} 
                  className="py-12 bg-surface-container-low/40 rounded-3xl border border-dashed border-outline-variant/50 text-center flex flex-col justify-center items-center gap-3 animate-pulse"
                >
                  <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-black text-primary uppercase tracking-widest font-sans">
                    Menggulir untuk memuat artikel berikutnya...
                  </p>
                </div>
              )}
            </div>

            {/* Right Sidebar TOC */}
            <aside className="lg:col-span-4 space-y-8">
              
              {/* Sidebar Ad Slot */}
              {(!settings || (settings.ads_enabled && settings.ads_placements.sidebar)) && (
                <div className="w-full min-h-[250px] overflow-hidden rounded-2xl border border-outline-variant/20 shadow-md p-4 bg-surface-container-low/30 flex items-center justify-center">
                  {settings?.ads_script_code ? (
                    <AdSlot html={settings.ads_script_code} placement="sidebar" />
                  ) : (
                    <div className="p-6 bg-primary/5 text-primary text-xs font-bold text-center rounded-xl uppercase tracking-widest">[masandigital.com Premium AdSlot Banner]</div>
                  )}
                </div>
              )}

              {/* Share Card Widget */}
              <div className="p-6 bg-surface-container-low/40 border border-primary/20 rounded-3xl shadow-xl backdrop-blur-md space-y-4 sticky top-28">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/5 opacity-30 rounded-3xl pointer-events-none"></div>
                <div className="relative z-10 space-y-3">
                  <h4 className="font-black text-xs uppercase tracking-wider text-on-surface flex items-center gap-1.5 font-sans">
                    <Share2 className="w-3.5 h-3.5 text-secondary animate-pulse" />
                    Share Insights
                  </h4>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed font-sans">
                    Spread these expert technical summaries and analytical frameworks with your global network.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(activeArticle.title)}`, '_blank');
                      }}
                      className="flex items-center justify-center gap-1.5 bg-black hover:opacity-95 text-white font-black py-3 rounded-xl text-[9px] uppercase tracking-widest transition-all cursor-pointer shadow-md hover:scale-103 active:scale-97"
                    >
                      X / Twitter
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`, '_blank');
                      }}
                      className="flex items-center justify-center gap-1.5 bg-blue-700 hover:opacity-95 text-white font-black py-3 rounded-xl text-[9px] uppercase tracking-widest transition-all cursor-pointer shadow-md hover:scale-103 active:scale-97"
                    >
                      LinkedIn
                    </button>
                  </div>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </main>

      {/* ==========================================
          THEME PERSONALIZATION SLIDE-OUT DRAWER (Ide 1)
          ========================================== */}
      {showThemeDrawer && (
        <div className="fixed inset-0 z-150 flex justify-end font-sans">
          {/* Glassmorphic Backdrop */}
          <div 
            onClick={() => setShowThemeDrawer(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Body */}
          <div className="relative w-80 max-w-full h-full bg-surface-container border-l border-outline-variant/30 p-6 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              
              {/* Drawer Header */}
              <div className="flex justify-between items-center pb-4 border-b border-outline-variant/15">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary animate-bounce-slow" />
                  <div>
                    <h3 className="font-extrabold text-sm text-on-surface">Personalize Theme</h3>
                    <p className="text-[9px] text-on-surface-variant font-medium">Custom visual styles and layouts</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowThemeDrawer(false)}
                  className="w-8 h-8 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-on-surface" />
                </button>
              </div>

              {/* Theme Schemes Options List */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant">Pilih Model &amp; Warna Tema</label>
                
                <div className="space-y-3">
                  {/* Theme Option 1: Nordic Sapphire (Default Light) */}
                  <button
                    onClick={() => changeTheme('light', 'blue')}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                      currentMode === 'light' && currentScheme === 'blue'
                        ? 'bg-primary/10 border-primary shadow-sm scale-102'
                        : 'bg-surface hover:bg-surface-container-high border-outline-variant/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        <Sun className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-extrabold text-xs block text-on-surface">Nordic Sapphire</span>
                        <span className="text-[9px] text-on-surface-variant font-semibold">Cerah, bersih &amp; kontras tinggi</span>
                      </div>
                    </div>
                    {currentMode === 'light' && currentScheme === 'blue' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </button>

                  {/* Theme Option 2: Obsidian Dark */}
                  <button
                    onClick={() => changeTheme('dark', 'blue')}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                      currentMode === 'dark' && currentScheme === 'blue'
                        ? 'bg-primary/10 border-primary shadow-sm scale-102'
                        : 'bg-surface hover:bg-surface-container-high border-outline-variant/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white border border-slate-700">
                        <Moon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-extrabold text-xs block text-on-surface">Obsidian Dark</span>
                        <span className="text-[9px] text-on-surface-variant font-semibold">OLED Pitch Black, hemat daya</span>
                      </div>
                    </div>
                    {currentMode === 'dark' && currentScheme === 'blue' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </button>

                  {/* Theme Option 3: Cyberpunk Neon */}
                  <button
                    onClick={() => changeTheme('dark', 'purple')}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                      currentMode === 'dark' && currentScheme === 'purple'
                        ? 'bg-purple-900/20 border-purple-500 shadow-sm scale-102'
                        : 'bg-surface hover:bg-surface-container-high border-outline-variant/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-extrabold text-xs block text-on-surface text-purple-700 dark:text-purple-400">Cyberpunk Neon</span>
                        <span className="text-[9px] text-on-surface-variant font-semibold">Aksen ungu &amp; cyan futuristik</span>
                      </div>
                    </div>
                    {currentMode === 'dark' && currentScheme === 'purple' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                    )}
                  </button>

                  {/* Theme Option 4: Emerald Glass */}
                  <button
                    onClick={() => changeTheme('dark', 'green')}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                      currentMode === 'dark' && currentScheme === 'green'
                        ? 'bg-emerald-950/20 border-emerald-500 shadow-sm scale-102'
                        : 'bg-surface hover:bg-surface-container-high border-outline-variant/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                        <Flame className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-extrabold text-xs block text-on-surface text-emerald-700 dark:text-emerald-400">Emerald Glass</span>
                        <span className="text-[9px] text-on-surface-variant font-semibold">Glow hijau zamrud mewah</span>
                      </div>
                    </div>
                    {currentMode === 'dark' && currentScheme === 'green' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    )}
                  </button>

                  {/* Theme Option 5: Sunset Amber */}
                  <button
                    onClick={() => changeTheme('light', 'orange')}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                      currentMode === 'light' && currentScheme === 'orange'
                        ? 'bg-orange-900/10 border-orange-500 shadow-sm scale-102'
                        : 'bg-surface hover:bg-surface-container-high border-outline-variant/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                        <Sun className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="font-extrabold text-xs block text-on-surface">Sunset Amber</span>
                        <span className="text-[9px] text-on-surface-variant font-semibold">Warna oranye hangat bersahaja</span>
                      </div>
                    </div>
                    {currentMode === 'light' && currentScheme === 'orange' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    )}
                  </button>
                </div>

              </div>

            </div>

            {/* Drawer Footer Notice */}
            <div className="border-t border-outline-variant/15 pt-4 text-center">
              <p className="text-[9px] text-on-surface-variant/70 leading-relaxed font-semibold">
                Didesain secara khusus menggunakan dynamic CSS variables agar super-fast loading &amp; 100% SEO Friendly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          SMART BOTTOM FLOATING AD BANNER (Ide 3)
          ========================================== */}
      {showBottomAd && !isBottomAdDismissed && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-100 w-full max-w-lg px-4 font-sans animate-in slide-in-from-bottom duration-500">
          <div className="glassmorphism border border-primary/30 p-4 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col items-center">
            
            {/* Banner Floating Title */}
            <div className="flex justify-between items-center w-full mb-2 pb-1 border-b border-outline-variant/15">
              <span className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-primary animate-pulse" />
                Mas Andy Premium Ad Offer
              </span>
              <button 
                onClick={() => {
                  setIsBottomAdDismissed(true);
                  setShowBottomAd(false);
                }}
                className="w-5 h-5 rounded-full bg-surface-container-high border border-outline-variant/30 flex items-center justify-center text-[10px] font-bold text-on-surface hover:bg-primary hover:text-white transition-colors cursor-pointer"
                title="Tutup Iklan"
              >
                ✕
              </button>
            </div>

            {/* Smart Banner Ad Slot */}
            {settings?.ads_script_code ? (
              <AdSlot html={settings.ads_script_code} placement="floating_footer" />
            ) : (
              <div className="w-full bg-primary/5 text-primary text-[10px] font-bold text-center p-4 rounded-2xl uppercase tracking-wider">
                [masandigital.com Premium Bottom AdSlot Banner]
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          SMART EXIT-INTENT MODAL OVERLAY (Ide 3)
          ========================================== */}
      {showExitIntent && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-6 font-sans">
          {/* Backdrop Blur */}
          <div 
            onClick={() => setShowExitIntent(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-xl bg-surface-container border border-primary/25 rounded-3xl p-6 md:p-8 shadow-2xl z-10 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* Close Button */}
            <button 
              onClick={() => setShowExitIntent(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-on-surface" />
            </button>

            {/* Header info */}
            <div className="text-center space-y-2 mb-6">
              <span className="inline-block bg-primary/10 text-primary border border-primary/20 font-black text-[9px] uppercase px-3 py-1 rounded-full tracking-widest animate-pulse">
                Tunggu Sebentar, Pembaca Setia!
              </span>
              <h3 className="font-extrabold text-lg md:text-xl text-on-surface tracking-tight">
                Sebelum Anda Pergi, Jangan Lewatkan Insights Ini!
              </h3>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                Platform kami mendeteksi Anda ingin meninggalkan halaman. Temukan alat interaktif premium kami untuk membantu karir teknologi Anda!
              </p>
            </div>

            {/* Interactive recommendation option */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/30 transition-all text-left">
                <span className="text-[8px] font-black text-primary uppercase tracking-wider block mb-1">Interactive Tool #1</span>
                <h4 className="font-extrabold text-xs text-on-surface block mb-1.5">Kalkulator Gaji IT Indonesia</h4>
                <p className="text-[10px] text-on-surface-variant leading-relaxed mb-3">Simulasi standar kelayakan gaji IT berdasarkan pengalaman &amp; keahlian Anda.</p>
                <Link 
                  href="/tools" 
                  onClick={() => setShowExitIntent(false)}
                  className="inline-block bg-primary text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-sm hover:opacity-90 transition-opacity"
                >
                  Hitung Gaji Sekarang
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/30 transition-all text-left">
                <span className="text-[8px] font-black text-secondary uppercase tracking-wider block mb-1">Interactive Tool #2</span>
                <h4 className="font-extrabold text-xs text-on-surface block mb-1.5">Cloud Cost Estimator</h4>
                <p className="text-[10px] text-on-surface-variant leading-relaxed mb-3">Bandingkan efisiensi biaya server Anda (VPS vs AWS vs Azure) secara real-time.</p>
                <Link 
                  href="/tools" 
                  onClick={() => setShowExitIntent(false)}
                  className="inline-block bg-secondary text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-sm hover:opacity-90 transition-opacity"
                >
                  Bandingkan Server
                </Link>
              </div>
            </div>

            {/* Smart High-CTR Exit Intent Ad Banner */}
            <div className="w-full min-h-[90px] p-3 rounded-2xl border border-outline-variant/20 bg-surface-container-low flex flex-col items-center justify-center overflow-hidden">
              <span className="text-[7px] font-bold text-on-surface-variant/40 uppercase tracking-widest mb-1.5">Sponsored Advertisement</span>
              {settings?.ads_script_code ? (
                <AdSlot html={settings.ads_script_code} placement="exit_intent" />
              ) : (
                <div className="w-full bg-primary/5 text-primary text-[9px] font-bold text-center py-4 rounded-xl uppercase tracking-widest">[masandigital.com Premium Exit AdSlot Banner]</div>
              )}
            </div>

            {/* Bottom button */}
            <div className="text-center mt-6">
              <button 
                onClick={() => setShowExitIntent(false)}
                className="text-[10px] font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                Tetap Lanjut Membaca Artikel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

// ==========================================
// SUB-COMPONENT: ARTICLE BLOCK UNIT FOR INFINITE SCROLL
// ==========================================
interface ArticleBlockProps {
  article: Article;
  settings: any;
  isFirst: boolean;
  relatedArticles: Article[];
}

function ArticleBlock({ article, settings, isFirst, relatedArticles }: ArticleBlockProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  // Initialize and load comments
  useEffect(() => {
    setLikes(Math.floor(article.views / 20) + 5);
    
    const storedComments = localStorage.getItem(`comments_${article.id}`);
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    } else {
      const defaultComments: Comment[] = [
        {
          id: 'c1',
          author: 'Sarah Chen',
          content: 'Fascinating insights into the qubit transition. Do you think legacy systems will be completely obsolete by 2030 or will we see hybrid frameworks?',
          timestamp: '2 hours ago',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop',
          likes: 12
        }
      ];
      setComments(defaultComments);
      localStorage.setItem(`comments_${article.id}`, JSON.stringify(defaultComments));
    }

    // Increment views in DB
    db.incrementViews(article.id);
  }, [article]);

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    } else {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    }
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      author: commentName,
      content: commentText,
      timestamp: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop',
      likes: 0
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem(`comments_${article.id}`, JSON.stringify(updated));
    
    setCommentName('');
    setCommentText('');
  };

  const handleCommentLike = (commentId: string) => {
    const updated = comments.map(c => {
      if (c.id === commentId) {
        return { ...c, likes: c.likes + 1 };
      }
      return c;
    });
    setComments(updated);
    localStorage.setItem(`comments_${article.id}`, JSON.stringify(updated));
  };

  const isHtml = /<[a-z][\s\S]*>/i.test(article.content);
  const tocItems: { id: string; label: string }[] = [];
  let finalContent = article.content;

  if (isHtml) {
    // Parse H2s from HTML
    const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
    let match;
    let idx = 0;
    while ((match = h2Regex.exec(article.content)) !== null) {
      const label = match[1].replace(/<[^>]*>/g, '').trim();
      tocItems.push({ id: `heading-${article.id}-${idx}`, label });
      idx++;
    }

    // Inject IDs into <h2> tags
    let count = 0;
    finalContent = article.content.replace(/<h2([^>]*)>/gi, (m, attrs) => {
      if (/id=/i.test(attrs)) return m;
      return `<h2${attrs} id="heading-${article.id}-${count++}">`;
    });
  } else {
    // Plain text fallback static items
    tocItems.push(
      { id: `sec-intro-${article.id}`, label: 'Introduction' },
      { id: `sec-arch-${article.id}`, label: 'Architecting for Hyper-Speed' },
      { id: `sec-trust-${article.id}`, label: 'Digital Trust Protocols' },
      { id: `sec-future-${article.id}`, label: 'Future Editorial Outlook' }
    );
  }

  return (
    <div className="space-y-8 border-b border-outline-variant/15 pb-16">
      
      {/* Category & Stats Breadcrumbs (for secondary articles) */}
      {!isFirst && (
        <div className="flex items-center gap-2 pt-16 border-t border-outline-variant/10">
          <span className="text-[10px] uppercase font-bold tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 animate-pulse">
            Next Read
          </span>
          <span className="text-on-surface-variant/40 text-xs font-bold">•</span>
          <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold">
            {article.category}
          </span>
        </div>
      )}

      {/* Cover Image */}
      <div className="w-full aspect-[21/10] relative rounded-3xl overflow-hidden shadow-md">
        <Image
          src={article.cover_image}
          alt={article.title}
          fill
          priority={isFirst}
          sizes="(max-w-768px) 100vw, 800px"
          className="object-cover animate-fade-in"
        />
      </div>

      {/* Title & Stats */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight mb-6">
          {article.title}
        </h1>
        
        <div className="flex items-center gap-4 border-b border-outline-variant/20 pb-6">
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <img
              src={article.author_avatar}
              alt={article.author_name}
              className="w-full h-full object-cover ring-2 ring-primary/10"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop'; }}
            />
          </div>
          <div className="flex-grow">
            <p className="text-sm font-bold text-on-surface">{article.author_name}</p>
            <div className="flex items-center gap-3 text-xs text-on-surface-variant">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(article.published_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.reading_time} min read
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {article.views} views
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Below Title Ad Slot */}
      {(!settings || (settings.ads_enabled && settings.ads_placements.below_title)) && (
        <div className="w-full min-h-[90px] overflow-hidden rounded-2xl border border-outline-variant/15 flex items-center justify-center bg-surface-container-low/20">
          {settings?.ads_script_code ? (
            <AdSlot html={settings.ads_script_code} placement={`below_title_${article.id}`} />
          ) : (
            <div className="p-6 bg-primary/5 text-primary text-xs font-bold text-center rounded-xl uppercase tracking-widest">[masandigital.com Premium AdSlot Banner]</div>
          )}
        </div>
      )}

      {/* AI Reader and Summary Companion */}
      <AICompanion
        title={article.title}
        content={article.content}
        excerpt={article.excerpt}
        category={article.category}
        tocItems={tocItems}
      />

      {/* Table of Contents */}
      {tocItems.length > 0 && (
        <div className="p-6 bg-surface-container-low/40 border border-primary/20 rounded-3xl shadow-xl backdrop-blur-md relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-2xl pointer-events-none"></div>
          <h4 className="font-extrabold text-[10px] uppercase tracking-widest text-primary mb-4 flex items-center gap-2 font-sans">
            <BookOpen className="w-4 h-4 text-primary animate-pulse" />
            Daftar Isi Artikel (Table of Contents)
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 font-bold text-xs text-on-surface-variant font-sans">
            {tocItems.map((item) => (
              <li key={item.id} className="flex items-center">
                <a
                  href={`#${item.id}`}
                  className="hover:text-primary transition-all flex items-center gap-2 pl-3 border-l-2 border-primary/25 hover:border-primary py-1.5 w-full hover:translate-x-1 duration-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 flex-shrink-0" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Article Content Body */}
      {isHtml ? (
        <div 
          className="content font-normal text-base md:text-lg text-on-surface-variant leading-relaxed space-y-6 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: finalContent }}
        />
      ) : (
        <div className="content font-normal text-base md:text-lg text-on-surface-variant leading-relaxed space-y-6 prose max-w-none">
          {finalContent.split('\n\n').map((paragraph, idx) => {
            if (idx === 0) {
              return (
                <p 
                  key={idx} 
                  id={`sec-intro-${article.id}`}
                  className="first-letter:text-6xl first-letter:font-extrabold first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:leading-none"
                >
                  {paragraph}
                </p>
              );
            }
            
            if (idx === 1) {
              return (
                <div key={idx} className="space-y-6">
                  <h2 id={`sec-arch-${article.id}`} className="text-xl md:text-2xl font-black text-on-surface tracking-tight mt-8">
                    Architecting for Hyper-Speed
                  </h2>
                  <p>{paragraph}</p>
                </div>
              );
            }

            if (idx === 2) {
              return (
                <div key={idx} className="space-y-6">
                  <h2 id={`sec-trust-${article.id}`} className="text-xl md:text-2xl font-black text-on-surface tracking-tight mt-8">
                    Digital Trust Protocols
                  </h2>
                  <p>{paragraph}</p>
                </div>
              );
            }

            if (idx === 3) {
              return (
                <div key={idx} className="space-y-6">
                  <h2 id={`sec-future-${article.id}`} className="text-xl md:text-2xl font-black text-on-surface tracking-tight mt-8">
                    Future Editorial Outlook
                  </h2>
                  <p>{paragraph}</p>
                </div>
              );
            }

            return <p key={idx}>{paragraph}</p>;
          })}
        </div>
      )}

      {/* Baca Juga - Related Articles */}
      {isFirst && relatedArticles.length > 0 && (
        <div className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-3xl shadow-lg">
          <h3 className="text-base md:text-lg font-black text-on-surface tracking-tight mb-5 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Baca Juga
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/15 ml-1">
              {article.category}
            </span>
          </h3>
          <div className="space-y-3">
            {relatedArticles.map((related) => (
              <Link
                key={related.id}
                href={`/article/${related.slug}`}
                className="group flex items-start gap-3 p-3.5 rounded-2xl bg-surface-container-lowest/60 border border-outline-variant/15 hover:border-primary/30 hover:bg-surface-container-high/50 transition-all duration-300"
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {related.title}
                  </p>
                  <p className="text-[11px] text-on-surface-variant mt-1 flex items-center gap-2">
                    <span>{new Date(related.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>•</span>
                    <span>{related.reading_time} min read</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Author Biography */}
      <div className="p-8 bg-surface-container-low/40 border border-outline-variant/20 rounded-3xl flex flex-col md:flex-row gap-6 items-center shadow-xl backdrop-blur-sm">
        <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/30 shadow-md">
          <img
            src={article.author_avatar}
            alt={article.author_name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop'; }}
          />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-lg font-black text-on-surface">About {article.author_name}</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Senior Lead Writer and Strategist at {settings?.site_title || 'masandigital.com'}. Specialized in advanced technical architecture, 
            AI systems design, and next-generation web platforms.
          </p>
        </div>
      </div>

      {/* Above Comments Ad Slot */}
      {(!settings || (settings.ads_enabled && settings.ads_placements.above_comments)) && (
        <div className="w-full min-h-[90px] overflow-hidden rounded-2xl border border-outline-variant/20 shadow-md p-4 bg-surface-container-low/30 flex items-center justify-center">
          {settings?.ads_script_code ? (
            <AdSlot html={settings.ads_script_code} placement={`above_comments_${article.id}`} />
          ) : (
            <div className="p-6 bg-primary/5 text-primary text-xs font-bold text-center rounded-xl uppercase tracking-widest">[masandigital.com Premium AdSlot Banner]</div>
          )}
        </div>
      )}

      {/* Interactive Comments thread */}
      <section className="border-t border-outline-variant/20 pt-12">
        <h3 className="text-xl md:text-2xl font-extrabold text-on-surface mb-8 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary animate-pulse" />
          Discussion ({comments.length})
        </h3>

        {/* Comment Form */}
        {article.comments_enabled !== false ? (
          <form onSubmit={submitComment} className="bg-surface-container-low/40 border border-outline-variant/30 rounded-2xl p-6 mb-8 flex gap-4 items-start shadow-lg backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-black text-sm shadow-md">
              {commentName ? commentName.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="flex-grow space-y-4">
              <input
                type="text"
                required
                placeholder="Your name"
                value={commentName}
                aria-label="Your name for comment"
                onChange={(e) => setCommentName(e.target.value)}
                className="w-full bg-background border border-outline-variant/30 focus:border-primary rounded-xl px-4 py-3 text-xs text-on-surface focus:outline-none transition-colors shadow-inner"
              />
              <textarea
                required
                rows={3}
                placeholder="Add to the conversation..."
                value={commentText}
                aria-label="Comment content"
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-background border border-outline-variant/30 focus:border-primary rounded-xl px-4 py-3 text-xs text-on-surface focus:outline-none transition-colors shadow-inner"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-primary/10 flex items-center gap-2 transition-opacity cursor-pointer animate-fade-in"
                >
                  <Send className="w-3.5 h-3.5" />
                  Post Comment
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-surface-container-low/40 border border-outline-variant/20 rounded-2xl p-6 mb-8 text-center space-y-2.5 shadow-lg backdrop-blur-sm">
            <ShieldAlert className="w-8 h-8 text-primary mx-auto opacity-75 animate-bounce-slow" />
            <h4 className="font-extrabold text-sm text-on-surface">Discussion Stream Protected</h4>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
              Kolom komentar dinonaktifkan untuk artikel ini guna menghindari spam komentar bot. Portal diskusi aman terlindungi.
            </p>
          </div>
        )}

        {/* List Comments */}
        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-sm text-on-surface-variant italic text-center py-6">No discussions yet. Be the first to share your thoughts!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-4 p-4 hover:bg-surface-container-low rounded-xl transition-colors">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={comment.avatar}
                    alt={comment.author}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-grow pb-4 border-b border-outline-variant/10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-on-surface">{comment.author}</span>
                    <span className="text-[10px] text-on-surface-variant">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <button 
                      onClick={() => handleCommentLike(comment.id)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {comment.likes}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </section>
    </div>
  );
}
