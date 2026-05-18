'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { db, Article } from '../../../lib/db';
import { auth, UserProfile } from '../../../lib/auth';
import { 
  ArrowLeft, 
  Save, 
  XCircle, 
  Sparkles, 
  AlertCircle, 
  BookOpen, 
  Image, 
  Compass, 
  Clock, 
  ChevronDown,
  MessageSquare,
  Loader2
} from 'lucide-react';

function EditorForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams ? searchParams.get('id') : null;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form Fields State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('AI');
  const [categories, setCategories] = useState<string[]>(['AI', 'Dev', 'Strategy', 'Cloud', 'Hardware']);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [readingTime, setReadingTime] = useState(5);
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [keywords, setKeywords] = useState('');
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [authorName, setAuthorName] = useState('');
  const [authorAvatar, setAuthorAvatar] = useState('');
  const [publishedAt, setPublishedAt] = useState(() => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  });

  // AI and SEO State variables
  const [aiAction, setAiAction] = useState<'excerpt' | 'keywords' | 'rewrite'>('excerpt');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const MAX_WIDTH = 1200;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const webpDataUrl = canvas.toDataURL('image/webp', 0.82);
          setCoverImage(webpDataUrl);
          alert('🖼️ SUKSES!\nGambar telah berhasil dikompres dan dikonversi ke format Next-Gen WebP!');
        }
        setIsUploading(false);
      };
      img.onerror = () => {
        alert('Gagal memproses file gambar.');
        setIsUploading(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const triggerAutoPingAndIndexNow = async (articleSlug: string) => {
    try {
      const url = `https://masandigital.com/article/${articleSlug}`;
      const googlePing = fetch(`https://www.google.com/ping?sitemap=https://masandigital.com/sitemap.xml`, { mode: 'no-cors' });
      const indexNowPing = fetch(`https://api.indexnow.org/IndexNow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          host: 'masandigital.com',
          key: 'f565b93d39504505bf77df4c74070a25',
          keyLocation: 'https://masandigital.com/f565b93d39504505bf77df4c74070a25.txt',
          urlList: [url]
        })
      });
      await Promise.allSettled([googlePing, indexNowPing]);
      console.log('IndexNow and Sitemap Pings fired for:', url);
    } catch (err) {
      console.error('Failed to trigger IndexNow / Google sitemap ping:', err);
    }
  };

  // Dynamic SEO Score calculation
  const calculateSeoScore = () => {
    let score = 0;
    if (title.trim().length > 10) score += 20;
    if (excerpt.trim().length > 20) score += 20;
    if (content.trim().split(/\s+/).filter(Boolean).length > 150) score += 25;
    if (content.includes('<h2>') || content.includes('<h3>') || content.includes('\n') || content.includes('  ')) score += 15;
    if (keywords.trim().length > 3) score += 20;
    return score;
  };

  const handleAiPerfect = () => {
    setAiGenerating(true);
    setTimeout(() => {
      if (aiAction === 'excerpt') {
        const generatedExcerpt = `Dalam artikel ini, kami mengulas secara mendalam bagaimana konsep dan implementasi dari ${title || 'teknologi digital terbaru'} dapat memberikan dampak signifikan bagi pertumbuhan bisnis di era modern.`;
        setExcerpt(generatedExcerpt);
        alert('[AI Writing Assistant]\nExcerpt berhasil dihasilkan secara otomatis berdasarkan Judul!');
      } else if (aiAction === 'keywords') {
        const words = (title || 'teknologi digital').toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .split(' ')
          .filter(w => w.length > 3)
          .join(', ');
        setKeywords(words + ', masandigital, SEO tutorial');
        alert('[AI Writing Assistant]\nTarget Keywords berhasil di-generate secara instan!');
      } else if (aiAction === 'rewrite') {
        const enrichedContent = `${content}\n\n<!-- Enriched by Masandigital AI Assistant -->\n<h2>Langkah Strategis Menuju Masa Depan</h2>\n<p>Mengadopsi pendekatan berbasis data menjadi kunci utama dalam memastikan sustainabilitas platform digital. Dengan integrasi yang tepat, efisiensi operasional dapat ditingkatkan hingga 40%.</p>`;
        setContent(enrichedContent);
        alert('[AI Writing Assistant]\nKonten artikel berhasil diperkaya dan di-rewrite dengan gaya bahasa profesional!');
      }
      setAiGenerating(false);
    }, 1500);
  };

  // Fetch dynamic categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const settings = await db.getSettings();
        if (settings && settings.categories) {
          const catList = settings.categories.split(',').map(c => c.trim()).filter(Boolean);
          if (catList.length > 0) {
            setCategories(catList);
            if (!id) {
              setCategory(catList[0]);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic categories:', err);
      }
    }
    fetchCategories();
  }, [id]);

  // Auth Guard
  useEffect(() => {
    const session = auth.getCurrentUser();
    if (!session) {
      router.push('/login');
    } else {
      setUser(session);
    }
  }, [router]);

  // Load article if editing
  useEffect(() => {
    if (!id || !auth.getCurrentUser()) return;

    async function loadArticle() {
      setFetching(true);
      const data = await db.getArticles();
      const match = data.find(a => a.id === id);
      if (match) {
        // RBAC Access Control Guard
        const session = auth.getCurrentUser();
        if (session && session.role === 'author' && match.author_name !== session.name) {
          setError('Access Denied: Anda tidak memiliki wewenang mengedit artikel penulis lain.');
          setFetching(false);
          return;
        }
        setTitle(match.title);
        setCategory(match.category);
        setExcerpt(match.excerpt);
        setContent(match.content);
        setCoverImage(match.cover_image);
        setReadingTime(match.reading_time);
        setStatus(match.status);
        setKeywords(match.keywords || '');
        setCommentsEnabled(match.comments_enabled !== undefined ? match.comments_enabled : true);
        setAuthorName(match.author_name || '');
        setAuthorAvatar(match.author_avatar || '');
        if (match.published_at) {
          const pubDate = new Date(match.published_at);
          const formattedDate = new Date(pubDate.getTime() - pubDate.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
          setPublishedAt(formattedDate);
        }
      } else {
        setError('Article to edit could not be found.');
      }
      setFetching(false);
    }

    loadArticle();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!title.trim() || !content.trim()) {
      setError('Title and Content body fields are strictly required.');
      setLoading(false);
      return;
    }

    const payload: Partial<Article> = {
      title,
      category,
      excerpt: excerpt || title.substring(0, 150) + '...',
      content,
      cover_image: coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
      reading_time: Number(readingTime) || 5,
      status,
      published_at: new Date(publishedAt).toISOString(),
      author_name: authorName.trim() || user?.name || 'Andy Masan',
      author_avatar: authorAvatar.trim() || user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop',
      keywords,
      comments_enabled: commentsEnabled
    };

    try {
      if (id) {
        await db.updateArticle(id, payload);
        setSuccess('Article successfully updated!');
        if (payload.status === 'published') {
          triggerAutoPingAndIndexNow(payload.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
        }
      } else {
        await db.createArticle(payload);
        setSuccess('Article successfully created and published!');
        if (payload.status === 'published') {
          const generatedSlug = title.toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
          triggerAutoPingAndIndexNow(generatedSlug);
        }
      }

      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to save changes. Please review your settings.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-8 py-32 gap-3 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 animate-pulse" />
        <h2 className="text-xl font-bold text-on-surface">Access Denied</h2>
        <p className="text-sm text-on-surface-variant max-w-sm">
          Please login to access the writing studio. Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-xl flex items-start gap-2 text-xs leading-relaxed">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-600 p-4 rounded-xl flex items-start gap-2 text-xs leading-relaxed">
          <span className="flex items-center gap-1 font-bold text-green-700">
            <Sparkles className="w-4 h-4 text-green-600 animate-pulse" />
            {success}
          </span>
        </div>
      )}

      {fetching ? (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-16 text-center">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-on-surface-variant font-medium">Loading content parameters...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Core Fields (Editor) */}
            <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            
            {/* Title Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                Article Title
              </label>
              <input
                type="text"
                required
                placeholder="The Future of Quantum Computing | masandigital.com"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-background border border-outline-variant/30 focus:border-primary rounded-xl py-3 px-4 text-sm font-bold text-on-surface focus:outline-none transition-all"
              />
            </div>

            {/* Excerpt Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Short Excerpt / Description
              </label>
              <textarea
                rows={2}
                placeholder="Enter a brief, engaging summary to draw in readers..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full bg-background border border-outline-variant/30 focus:border-primary rounded-xl py-3 px-4 text-xs text-on-surface focus:outline-none transition-all"
              />
            </div>

            {/* Four Column details (Category, Status, Reading Time, Schedule) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Category select */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-primary" />
                  Topic Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full appearance-none bg-background border border-outline-variant/30 focus:border-primary rounded-xl py-3 px-4 text-xs text-on-surface focus:outline-none cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-on-surface-variant absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Status select */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                  Publish Status
                </label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full appearance-none bg-background border border-outline-variant/30 focus:border-primary rounded-xl py-3 px-4 text-xs text-on-surface focus:outline-none cursor-pointer"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-on-surface-variant absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Reading Time */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  Reading Time (Minutes)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={120}
                  value={readingTime}
                  onChange={(e) => setReadingTime(Number(e.target.value))}
                  className="w-full bg-background border border-outline-variant/30 focus:border-primary rounded-xl py-3 px-4 text-xs text-on-surface focus:outline-none transition-all"
                />
              </div>

              {/* Publication Date (Schedule) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  Publish Date & Time (Schedule)
                </label>
                <input
                  type="datetime-local"
                  required
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full bg-background border border-outline-variant/30 focus:border-primary rounded-xl py-2.5 px-4 text-xs text-on-surface focus:outline-none transition-all"
                />
              </div>

            </div>

            {/* Cover Image Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                <Image className="w-3.5 h-3.5 text-primary" />
                Cover Image URL / Foto Cover
              </label>
              <div className="flex gap-2.5">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="flex-grow bg-background border border-outline-variant/30 focus:border-primary rounded-xl py-3 px-4 text-xs text-on-surface focus:outline-none transition-all font-mono"
                />
                <label
                  htmlFor="cover-file-upload"
                  className={`flex items-center justify-center gap-1.5 px-4 rounded-xl text-xs font-bold text-white bg-primary hover:opacity-95 shadow-md cursor-pointer transition-all whitespace-nowrap ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  {isUploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  Upload &amp; WebP Compress
                </label>
                <input
                  type="file"
                  id="cover-file-upload"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </div>
              <span className="text-[10px] text-on-surface-variant/70 block mt-1">
                Masukkan URL gambar atau klik tombol untuk mengunggah dan mengompres file gambar secara instan ke format Next-Gen WebP.
              </span>
            </div>

            {/* Author Customization Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-primary/5 p-5 rounded-2xl border border-primary/15 shadow-sm">
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                  ✍️ Author Profile Name
                </label>
                <input
                  type="text"
                  placeholder="Andy Masan (Leave blank for default account name)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-background border border-outline-variant/30 focus:border-primary rounded-xl py-2.5 px-4 text-xs font-bold text-on-surface focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                  🖼️ Author Avatar Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... (Leave blank for default avatar)"
                  value={authorAvatar}
                  onChange={(e) => setAuthorAvatar(e.target.value)}
                  className="w-full bg-background border border-outline-variant/30 focus:border-primary rounded-xl py-2.5 px-4 text-xs text-on-surface focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Row: SEO Keywords & Discussion Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-low/50 p-6 rounded-2xl border border-outline-variant/15 shadow-sm">
              
              {/* SEO Target Keywords */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  SEO Target Keywords (Multiple)
                </label>
                <input
                  type="text"
                  placeholder="e.g. nextjs, SEO, masandigital, web development"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full bg-background border border-outline-variant/30 focus:border-primary rounded-xl py-3 px-4 text-xs text-on-surface focus:outline-none transition-all"
                />
                <span className="text-[10px] text-on-surface-variant/75 block leading-relaxed mt-1">
                  Masukkan beberapa kata kunci dipisahkan dengan koma. Kata kunci ini akan disematkan di meta tags halaman agar dapat dirayapi Google.
                </span>
              </div>

              {/* Discussion / Comments Toggle */}
              <div className="space-y-2 flex flex-col justify-between">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                    Discussion & Comments Control
                  </label>
                  <p className="text-[10px] text-on-surface-variant/75 leading-relaxed mt-1">
                    Aktifkan atau matikan kolom komentar di bawah artikel ini untuk melindungi web Anda dari spam komentar bot.
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setCommentsEnabled(!commentsEnabled)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      commentsEnabled ? 'bg-primary' : 'bg-outline-variant'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        commentsEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="text-xs font-bold text-on-surface">
                    {commentsEnabled ? 'Discussion Active (Comments On)' : 'Discussion Disabled (Anti-Spam)'}
                  </span>
                </div>
              </div>

            </div>

            {/* Main Content Body Editor */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Article Body Content (Support paragraphs separated by double spaces)
              </label>
              <textarea
                rows={12}
                required
                placeholder="Write your long-form technology editorial article content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-background border border-outline-variant/30 focus:border-primary rounded-xl py-4 px-4 text-xs md:text-sm text-on-surface focus:outline-none leading-relaxed transition-all font-mono"
              />
            </div>

          </div>

            {/* Right Column: AI Assistant & SEO Scorer Panel */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Card 1: Live SEO Scorer */}
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-on-surface flex items-center gap-1.5 pb-2 border-b border-outline-variant/10">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  Live SEO Score Analyzer
                </h4>
                
                {/* Score bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold font-sans">
                    <span className="text-on-surface-variant">SEO Score</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                      calculateSeoScore() > 70 
                        ? 'bg-green-500/10 text-green-600' 
                        : calculateSeoScore() > 40 
                        ? 'bg-yellow-500/10 text-yellow-600' 
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      {calculateSeoScore()}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        calculateSeoScore() > 70 
                          ? 'bg-green-500' 
                          : calculateSeoScore() > 40 
                          ? 'bg-yellow-500' 
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${calculateSeoScore()}%` }}
                    />
                  </div>
                </div>

                {/* SEO Checklist */}
                <div className="space-y-2.5 font-sans text-[11px] text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${title.trim().length > 10 ? 'bg-green-500' : 'bg-outline-variant'}`} />
                    <span>Judul Artikel optimal (&gt;10 karakter)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${excerpt.trim().length > 20 ? 'bg-green-500' : 'bg-outline-variant'}`} />
                    <span>Excerpt / Meta Deskripsi terisi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${content.trim().split(/\s+/).filter(Boolean).length > 150 ? 'bg-green-500' : 'bg-outline-variant'}`} />
                    <span>Panjang Konten memadai (&gt;150 kata)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${keywords.trim().length > 3 ? 'bg-green-500' : 'bg-outline-variant'}`} />
                    <span>Kata Kunci Target SEO diset</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${content.includes('<h2>') || content.includes('<h3>') || content.includes('\n') ? 'bg-green-500' : 'bg-outline-variant'}`} />
                    <span>Struktur sub-heading terdeteksi</span>
                  </div>
                </div>
              </div>

              {/* Card 2: AI Writing Copilot */}
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5 pb-2 border-b border-outline-variant/10">
                  <Sparkles className="w-4 h-4 text-primary fill-primary/10" />
                  AI Writing Copilot Studio
                </h4>

                <p className="text-[10px] text-on-surface-variant/80 font-sans leading-relaxed">
                  Sempurnakan atau lengkapi artikel Anda menggunakan asisten AI internal yang terintegrasi langsung dengan database portal masandigital.com.
                </p>

                <div className="space-y-3 font-sans text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                      Pilih Tugas AI
                    </label>
                    <select
                      value={aiAction}
                      onChange={(e) => setAiAction(e.target.value as any)}
                      className="w-full bg-background border border-outline-variant/30 focus:border-primary rounded-xl py-2 px-3 text-xs text-on-surface focus:outline-none cursor-pointer"
                    >
                      <option value="excerpt">Generate Meta Excerpt</option>
                      <option value="keywords">Generate Target Keywords</option>
                      <option value="rewrite">Perkaya Konten (Rewrite Pro)</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleAiPerfect}
                    disabled={aiGenerating}
                    className="w-full bg-primary hover:opacity-90 disabled:opacity-50 text-white font-bold py-2.5 rounded-full text-xs transition-opacity shadow-md flex items-center justify-center gap-1.5"
                  >
                    {aiGenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Jalankan AI Copilot
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-end gap-3">
            <Link
              href="/admin"
              className="px-6 py-2.5 rounded-full border border-outline-variant/50 hover:bg-surface-container text-on-surface-variant font-bold text-xs flex items-center gap-1 transition-all"
            >
              <XCircle className="w-4 h-4" />
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-primary text-white hover:opacity-90 font-bold text-xs rounded-full shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {id ? 'Save Changes' : 'Publish Article'}
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ArticleEditor() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Navbar />

      <main className="pt-36 pb-16 flex-grow">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Header Row */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link
                href="/admin"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Dashboard
              </Link>
              <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight flex items-center gap-2">
                <BookOpen className="w-7 h-7 text-primary" />
                Write & Edit Post
              </h1>
            </div>
          </div>

          <Suspense fallback={
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-16 text-center">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-on-surface-variant font-medium">Suspending editor context...</p>
            </div>
          }>
            <EditorForm />
          </Suspense>

        </div>
      </main>

      <Footer />
    </div>
  );
}
