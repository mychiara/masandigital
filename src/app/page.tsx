'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { db, Article } from '../lib/db';
import { Calendar, Clock, Eye, Sparkles, BookOpen, Send, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [settings, setSettings] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch articles on mount and filter changes
  useEffect(() => {
    async function loadArticles() {
      setLoading(true);
      const data = await db.getArticles(activeCategory, searchQuery);
      // Filter out drafts and scheduled articles (future published_at dates)
      const now = new Date();
      setArticles(data.filter(a => a.status === 'published' && new Date(a.published_at || a.created_at) <= now));
      setLoading(false);
      setCurrentPage(1); // Reset page to 1 on filter or search changes!
    }
    loadArticles();
  }, [activeCategory, searchQuery]);

  // Load site settings
  useEffect(() => {
    async function loadSettings() {
      const s = await db.getSettings();
      setSettings(s);
    }
    loadSettings();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      const email = emailInput.trim().toLowerCase();
      // Store to persistent local storage registry
      const existing = localStorage.getItem('masandigital_subscribers');
      const list = existing ? JSON.parse(existing) : [];
      const alreadySubscribed = list.some((item: any) => item.email === email);
      if (!alreadySubscribed) {
        list.push({
          email,
          created_at: new Date().toISOString()
        });
        localStorage.setItem('masandigital_subscribers', JSON.stringify(list));
      }
      setEmailSubscribed(true);
      setEmailInput('');
    }
  };

  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const recentArticles = articles.length > 1 ? articles.slice(1) : [];

  // Seed trending list (sort by views)
  const trendingArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 3);

  // Pagination calculations
  const limit = settings?.homepage_limit || 6;
  const feedArticles = searchQuery || activeCategory !== 'All' ? articles : recentArticles;
  const totalPages = Math.ceil(feedArticles.length / limit);
  
  const paginatedArticles = feedArticles.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      {/* Header Navigation */}
      <Navbar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onSearchChange={setSearchQuery}
      />

      <main className="pt-36 pb-16 flex-grow">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          
          {/* Above Header Ad Placement */}
          {settings?.ads_enabled && settings.ads_placements.above_header && settings.ads_script_code && (
            <div 
              className="w-full mb-8 overflow-hidden"
              dangerouslySetInnerHTML={{ __html: settings.ads_script_code }}
            />
          )}

          {/* Header Ad Slot / Cosmic Brand Welcome Hero */}
          <div className="w-full p-8 md:p-12 rounded-3xl border border-primary/20 relative overflow-hidden group shadow-2xl bg-surface-container-low/40 backdrop-blur-md mb-12">
            {/* Cosmic Aurora Glowing Backgrounds */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-60 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-secondary/15 rounded-full blur-3xl opacity-60 group-hover:scale-110 transition-transform duration-700"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-3">
                <h1 className="text-2xl md:text-4xl font-black tracking-tight text-on-surface leading-tight">
                  Welcome to <span className="brand-gradient-text">{settings?.site_title || 'masandigital.com'}</span>
                </h1>
                <p className="text-sm text-on-surface-variant max-w-xl leading-relaxed">
                  {settings?.site_tagline || 'Experience the future of tech journalism. Real-time fast compilation, automated AI pacing, and maximum SEO indexability.'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Main Content Area */}
            <div className="lg:col-span-8">
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-on-surface-variant font-medium animate-pulse">Loading editorial catalog...</p>
                </div>
              ) : articles.length === 0 ? (
                <div className="bg-surface-container-low/50 border border-outline-variant/30 rounded-3xl p-12 text-center shadow-lg backdrop-blur-sm">
                  <BookOpen className="w-12 h-12 text-primary mx-auto opacity-40 mb-4" />
                  <h3 className="text-lg font-bold text-on-surface">No Articles Found</h3>
                  <p className="text-sm text-on-surface-variant mt-2 max-w-md mx-auto leading-relaxed">
                    We could not find any published articles matching your criteria. Try creating a new post from the Editor Dashboard!
                  </p>
                  <Link
                    href="/admin"
                    className="inline-block mt-6 bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs px-6 py-3 rounded-full shadow-md hover:scale-103 active:scale-97 transition-all"
                  >
                    Go to Admin Portal
                  </Link>
                </div>
              ) : (
                <div className="space-y-12">
                  
                  {/* High-Impact Featured Post (Hero) */}
                  {featuredArticle && currentPage === 1 && !searchQuery && activeCategory === 'All' && (
                    <article className="group relative overflow-hidden bg-surface-container-low/30 border border-outline-variant/25 rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 transform hover:-translate-y-1">
                      <div className="aspect-[21/9] md:aspect-[16/7] relative overflow-hidden w-full">
                        <Image
                          src={featuredArticle.cover_image}
                          alt={featuredArticle.title}
                          fill
                          priority
                          sizes="(max-w-768px) 100vw, 800px"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4 bg-primary/80 backdrop-blur-md text-white font-black text-[10px] tracking-widest px-4 py-1.5 rounded-full shadow-md uppercase z-10 border border-white/10">
                          {featuredArticle.category}
                        </div>
                      </div>
                      
                      <div className="p-8 space-y-4">
                        <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                          <span className="flex items-center gap-1.5 font-bold">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            {new Date(featuredArticle.published_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="flex items-center gap-1.5 font-bold">
                            <Clock className="w-3.5 h-3.5 text-secondary" />
                            {featuredArticle.reading_time} min read
                          </span>
                          <span className="flex items-center gap-1.5 font-bold">
                            <Eye className="w-3.5 h-3.5 text-tertiary" />
                            {featuredArticle.views} views
                          </span>
                        </div>
                        
                        <h2 className="text-2xl md:text-3xl font-black text-on-surface group-hover:text-primary transition-colors tracking-tight leading-tight">
                          <Link href={`/article/${featuredArticle.slug}`}>
                            {featuredArticle.title}
                          </Link>
                        </h2>
                        
                        <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
                          {featuredArticle.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-secondary/50">
                              <Image
                                src={featuredArticle.author_avatar}
                                alt={featuredArticle.author_name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-on-surface">{featuredArticle.author_name}</p>
                              <p className="text-[10px] text-on-surface-variant">Lead Editor</p>
                            </div>
                          </div>
                          <Link
                            href={`/article/${featuredArticle.slug}`}
                            className="text-xs font-bold text-primary flex items-center gap-1.5 hover:underline"
                          >
                            Read Article
                            <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </article>
                  )}

                  {/* Articles Grid list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {paginatedArticles.map((article) => (
                      <article
                        key={article.id}
                        className="group neon-glow-card bg-surface-container-low/30 border border-outline-variant/25 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
                      >
                        <div className="aspect-[16/10] w-full relative overflow-hidden">
                          <Image
                            src={article.cover_image}
                            alt={article.title}
                            fill
                            sizes="(max-w-768px) 100vw, 400px"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <span className="absolute top-3 left-3 bg-secondary/80 backdrop-blur-md text-white font-black text-[9px] tracking-widest px-3 py-1 rounded-full uppercase shadow-md z-10 border border-white/10">
                            {article.category}
                          </span>
                        </div>
                        
                        <div className="p-6 flex flex-col flex-grow space-y-3">
                          <div className="flex items-center gap-3 text-[11px] text-on-surface-variant font-bold">
                            <span>
                              {new Date(article.published_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            <span>•</span>
                            <span>{article.reading_time} min read</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <Eye className="w-3 h-3 text-tertiary" />
                              {article.views}
                            </span>
                          </div>
                          
                          <h3 className="text-base md:text-lg font-bold text-on-surface group-hover:text-primary transition-colors tracking-tight line-clamp-2 leading-snug">
                            <Link href={`/article/${article.slug}`}>
                              {article.title}
                            </Link>
                          </h3>
                          
                          <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed flex-grow">
                            {article.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                            <div className="flex items-center gap-2">
                              <div className="relative w-7 h-7 rounded-full overflow-hidden ring-1 ring-primary/30">
                                <Image
                                  src={article.author_avatar}
                                  alt={article.author_name}
                                  fill
                                  sizes="28px"
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-[11px] font-semibold text-on-surface">{article.author_name}</span>
                            </div>
                            <Link
                              href={`/article/${article.slug}`}
                              className="text-xs font-bold text-primary flex items-center gap-0.5 hover:underline"
                            >
                              Read
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Elegant Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-outline-variant/15">
                      <button
                        onClick={() => {
                          if (currentPage > 1) {
                            setCurrentPage(prev => prev - 1);
                            window.scrollTo({ top: 400, behavior: 'smooth' });
                          }
                        }}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-xl border border-outline-variant/30 text-xs font-bold text-on-surface hover:bg-primary/5 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Prev
                      </button>

                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => {
                              setCurrentPage(page);
                              window.scrollTo({ top: 400, behavior: 'smooth' });
                            }}
                            className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                              currentPage === page
                                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/20 hover:scale-105'
                                : 'border border-outline-variant/30 text-on-surface hover:bg-primary/5 hover:border-primary/30 active:scale-95'
                            }`}
                          >
                            {page}
                          </button>
                         ))}
                      </div>

                      <button
                        onClick={() => {
                          if (currentPage < totalPages) {
                            setCurrentPage(prev => prev + 1);
                            window.scrollTo({ top: 400, behavior: 'smooth' });
                          }
                        }}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-xl border border-outline-variant/30 text-xs font-bold text-on-surface hover:bg-primary/5 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1"
                      >
                        Next
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Sidebar Columns */}
            <aside className="lg:col-span-4 space-y-8">
              
              {/* Sidebar Ad Placement */}
              {settings?.ads_enabled && settings.ads_placements.sidebar && settings.ads_script_code && (
                <div 
                  className="w-full overflow-hidden rounded-2xl border border-outline-variant/20 shadow-md p-4 bg-surface-container-low/30"
                  dangerouslySetInnerHTML={{ __html: settings.ads_script_code }}
                />
              )}

              {/* Trending Posts widget */}
              <div className="p-6 bg-surface-container-low/40 border border-outline-variant/20 rounded-2xl shadow-xl backdrop-blur-sm">
                <h4 className="font-extrabold text-xs uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  Trending Insights
                </h4>
                <div className="space-y-4">
                  {trendingArticles.map((t, idx) => (
                    <Link
                      key={t.id}
                      href={`/article/${t.slug}`}
                      className="group block p-3.5 rounded-xl bg-surface-container-lowest/50 border border-outline-variant/10 hover:border-primary/30 hover:bg-surface-container-high transition-all duration-300"
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[9px] font-black text-secondary bg-secondary/15 px-2 py-0.5 rounded-full uppercase border border-secondary/10">
                          {t.category}
                        </span>
                        <span className="text-[10px] text-on-surface-variant flex items-center gap-1 font-bold">
                          <Eye className="w-3.5 h-3.5 text-tertiary" />
                          {t.views}
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-on-surface group-hover:text-primary transition-colors tracking-tight line-clamp-2 leading-relaxed">
                        {t.title}
                      </h5>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sidebar Newsletter Widget */}
              <div className="p-8 bg-surface-container-low/50 text-white rounded-2xl border border-primary/20 shadow-2xl text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/15 opacity-40"></div>
                <div className="relative z-10 space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h5 className="font-black text-base text-on-surface tracking-tight">
                      Subscribe Free Insights
                    </h5>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed mt-1 max-w-xs mx-auto">
                      Get weekly digital strategies and premium technology insights delivered straight to your inbox.
                    </p>
                  </div>
                  
                  {emailSubscribed ? (
                    <div className="bg-primary/10 border border-primary/30 p-4 rounded-xl flex items-center gap-2 text-left justify-center animate-fade-in">
                      <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                      <p className="text-xs font-bold text-primary-fixed">Subscription active! Thank you.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="space-y-3">
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="Your email address"
                        className="w-full bg-background border border-outline-variant/30 rounded-xl py-3 px-4 text-xs text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:border-primary transition-colors shadow-inner"
                      />
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-bold py-3 rounded-xl text-xs transition-opacity shadow-lg shadow-primary/15 cursor-pointer"
                      >
                        Subscribe Now
                      </button>
                    </form>
                  )}
                </div>
              </div>

            </aside>

          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
