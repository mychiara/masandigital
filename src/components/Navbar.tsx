'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { auth, UserProfile } from '../lib/auth';
import { db } from '../lib/db';
import { LogOut, LayoutDashboard, LogIn, Menu, X, User, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  onSearchChange?: (search: string) => void;
}

export default function Navbar({ activeCategory, onCategoryChange, onSearchChange }: NavbarProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [siteTitle, setSiteTitle] = useState('masandigital.com');
  const [siteLogo, setSiteLogo] = useState('');
  const [categories, setCategories] = useState<string[]>(['All', 'AI', 'Dev', 'Strategy', 'Cloud', 'Hardware']);
  const [trendingArticles, setTrendingArticles] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    function reloadSession() {
      setUser(auth.getCurrentUser());
    }
    reloadSession();
    window.addEventListener('masandigital_session_changed', reloadSession);
    return () => {
      window.removeEventListener('masandigital_session_changed', reloadSession);
    };
  }, []);

  useEffect(() => {
    async function loadCategories() {
      try {
        const settings = await db.getSettings();
        if (settings) {
          if (settings.site_title) setSiteTitle(settings.site_title);
          if (settings.site_logo) setSiteLogo(settings.site_logo);
          if (settings.categories) {
            const list = settings.categories.split(',').map(c => c.trim()).filter(Boolean);
            if (list.length > 0) {
              setCategories(['All', ...list]);
            }
          }
        }
      } catch (err) {
        console.error('Failed to query dynamic categories inside Navbar:', err);
      }
    }
    loadCategories();

    if (typeof window !== 'undefined') {
      window.addEventListener('masandigital_settings_changed', loadCategories);
      return () => window.removeEventListener('masandigital_settings_changed', loadCategories);
    }
  }, []);

  useEffect(() => {
    async function loadTrending() {
      try {
        const articles = await db.getArticles();
        const published = articles
          .filter(a => a.status === 'published')
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 5);
        setTrendingArticles(published);
      } catch (err) {
        console.error('Failed to load trending articles in Navbar:', err);
      }
    }
    loadTrending();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('masandigital_views_incremented', loadTrending);
      return () => window.removeEventListener('masandigital_views_incremented', loadTrending);
    }
  }, []);

  const handleLogout = () => {
    auth.logout();
    setUser(null);
    router.refresh();
  };

  // Split categories into exactly 3 rows
  const chunkSize = Math.ceil(categories.length / 3);
  const rows = [
    categories.slice(0, chunkSize),
    categories.slice(chunkSize, chunkSize * 2),
    categories.slice(chunkSize * 2),
  ].filter(row => row.length > 0);

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50 glassmorphism rounded-2xl shadow-xl shadow-black/30 transition-all duration-300 overflow-hidden">
      {/* Hide Scrollbars for Categories horizontal scroll */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}} />

      {/* Dynamic Trending Ticker Banner */}
      {trendingArticles.length > 0 && (
        <div className="w-full bg-gradient-to-r from-primary/10 via-secondary/10 to-tertiary/10 border-b border-outline-variant/15 py-1.5 px-6 flex items-center gap-3 overflow-hidden text-[10px] md:text-xs font-bold text-on-surface rounded-t-2xl relative animate-fade-in">
          <span className="flex items-center gap-1.5 bg-primary/20 text-primary border border-primary/25 px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 font-extrabold animate-pulse">
            🔥 Trending Now
          </span>
          <div className="flex-grow overflow-hidden relative h-5">
            <div className="flex flex-col animate-ticker absolute left-0 w-full">
              {trendingArticles.map((article, index) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="hover:text-primary transition-colors truncate block h-5 leading-5"
                >
                  <span className="text-secondary mr-1">#{index + 1}</span> {article.title}
                </Link>
              ))}
            </div>
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes ticker {
              0% { transform: translateY(0); }
              15% { transform: translateY(0); }
              20% { transform: translateY(-20px); }
              35% { transform: translateY(-20px); }
              40% { transform: translateY(-40px); }
              55% { transform: translateY(-40px); }
              60% { transform: translateY(-60px); }
              75% { transform: translateY(-60px); }
              80% { transform: translateY(-80px); }
              95% { transform: translateY(-80px); }
              100% { transform: translateY(0); }
            }
            .animate-ticker {
              animation: ticker 15s cubic-bezier(0.25, 1, 0.5, 1) infinite;
            }
          `}} />
        </div>
      )}

      <div className="px-6 lg:px-8 flex justify-between items-center min-h-[6rem] py-3.5 gap-4">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center shrink-0">
          {siteLogo ? (
            <div className="relative h-10 w-52">
              <Image
                src={siteLogo}
                alt={siteTitle}
                fill
                sizes="176px"
                className="object-contain object-left"
              />
            </div>
          ) : (
            <span className="font-extrabold text-2xl tracking-tighter brand-gradient-text hover:opacity-95 transition-opacity">
              {siteTitle}
            </span>
          )}
        </Link>
 
        {/* Desktop Navigation (Flexible Center Categories in 3 Rows) */}
        {onCategoryChange && (
          <div 
            className="hidden md:flex flex-col gap-1.5 items-center justify-center flex-1 max-w-[45%] lg:max-w-[55%] py-1"
          >
            {rows.map((row, rowIndex) => (
              <nav 
                key={rowIndex}
                className="flex gap-4 lg:gap-6 items-center justify-center w-full overflow-x-auto scrollbar-none py-0.5"
                style={{
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                }}
              >
                {row.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => onCategoryChange(cat)}
                    className={`font-bold text-[10px] lg:text-xs uppercase tracking-wider whitespace-nowrap transition-all duration-200 ease-in-out border-b-[1.5px] pb-0.5 cursor-pointer shrink-0 ${
                      (activeCategory || 'All') === cat
                        ? 'text-primary border-primary shadow-sm shadow-primary/10'
                        : 'text-on-surface-variant/80 border-transparent hover:text-primary hover:border-primary/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </nav>
            ))}
          </div>
        )}
 
        {/* Search & Actions */}
        <div className="flex items-center gap-4 shrink-0">
          {onSearchChange && (
            <div className="relative flex items-center">
              {showSearch ? (
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchVal}
                  aria-label="Search articles"
                  onChange={(e) => {
                    setSearchVal(e.target.value);
                    onSearchChange(e.target.value);
                  }}
                  className="bg-surface-container-low border border-outline-variant/30 text-on-surface px-4 py-1.5 rounded-full text-xs w-36 lg:w-48 focus:outline-none focus:border-primary transition-all shadow-inner"
                  autoFocus
                />
              ) : null}
              <button
                onClick={() => setShowSearch(!showSearch)}
                aria-label="Toggle search field"
                className="p-2 hover:bg-surface-container-high rounded-full text-on-surface-variant hover:text-primary transition-all cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          )}
 
          {/* User Session Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link
              href="/tools"
              className="flex items-center gap-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 px-4.5 py-2.5 rounded-full font-bold text-xs transition-all border border-secondary/20 whitespace-nowrap mr-1 hover:scale-[1.03] active:scale-95 duration-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
              Interactive Tools
            </Link>
            {user ? (
              <>
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 bg-gradient-to-r from-primary via-secondary to-tertiary text-white hover:scale-105 active:scale-95 px-4.5 py-2.5 rounded-full font-bold text-xs shadow-lg shadow-primary/20 transition-all duration-300 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                  Write Post
                </Link>
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2.5 rounded-full font-bold text-xs transition-all border border-primary/20 whitespace-nowrap"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-surface-container-high hover:bg-red-500 hover:text-white px-4 py-2.5 rounded-full font-bold text-xs text-on-surface-variant transition-all cursor-pointer border border-outline-variant/20 whitespace-nowrap"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 bg-gradient-to-r from-primary via-secondary to-tertiary text-white hover:scale-105 active:scale-95 px-5 py-2.5 rounded-full font-bold text-xs shadow-lg shadow-primary/20 transition-all duration-300 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                Write Post
              </Link>
            )}
          </div>
 
          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all cursor-pointer"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
 
      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-[6.5rem] left-0 w-full bg-surface-container border border-outline-variant/30 rounded-2xl shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {onCategoryChange && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/45">Categories</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      onCategoryChange(cat);
                      setIsOpen(false);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
                      (activeCategory || 'All') === cat
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-primary hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
 
          <div className="border-t border-outline-variant/10 pt-4 flex flex-col gap-2">
            <Link
              href="/tools"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 bg-secondary text-white py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all mb-2"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              Interactive Tools
            </Link>
            {user ? (
              <>
                <div className="flex items-center gap-2 mb-2 p-2 bg-surface-container-low rounded-xl border border-outline-variant/10">
                  <img src={user.avatar} className="w-8 h-8 rounded-full object-cover" alt={`${user.name}'s avatar`} />
                  <div>
                    <p className="text-xs font-bold text-on-surface">{user.name}</p>
                    <p className="text-[10px] text-on-surface-variant">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary via-secondary to-tertiary text-white py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all mb-2"
                >
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                  Create &amp; Generate Post
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-primary/10 text-primary text-sm font-semibold transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Editor Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-red-500/10 text-red-500 text-sm font-semibold text-left transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary via-secondary to-tertiary text-white py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all"
              >
                <Sparkles className="w-4 h-4 animate-spin-slow" />
                Create &amp; Generate Post
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
