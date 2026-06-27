import { createClient } from '@supabase/supabase-js';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  cover_image: string;
  author_name: string;
  author_avatar: string;
  reading_time: number;
  status: 'draft' | 'published';
  views: number;
  created_at: string;
  published_at: string;
  keywords?: string; // Comma separated SEO keywords
  comments_enabled?: boolean; // discussion state
}

export interface SiteSettings {
  site_title: string;
  site_tagline: string;
  site_logo?: string;
  site_icon?: string;
  google_indexing_enabled?: boolean;
  google_indexing_json?: string;
  bing_api_key?: string;
  google_site_verification?: string;
  ads_enabled: boolean;
  ads_script_code: string;
  ads_placements: {
    above_header: boolean;
    below_title: boolean;
    above_comments: boolean;
    sidebar: boolean;
  };
  tracking_header_code: string;
  tracking_footer_code: string;
  // Dynamic page text content
  about_content: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  contact_hours: string;
  disclaimer_content: string;
  privacy_content: string;
  tos_content: string;
  categories: string; // Comma separated values, e.g. "AI,Dev,Strategy,Cloud,Hardware"
  homepage_limit?: number;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  site_title: 'masandigital.com',
  site_tagline: 'The Future of Tech & Strategy',
  site_logo: '',
  site_icon: '',
  google_indexing_enabled: false,
  google_indexing_json: '',
  bing_api_key: '',
  google_site_verification: '',
  ads_enabled: true,
  ads_script_code: `<div class="p-6 bg-primary/5 text-primary border border-primary/20 text-xs font-bold text-center rounded-xl uppercase tracking-widest">[masandigital.com Premium AdSlot Banner]</div>`,
  ads_placements: {
    above_header: true,
    below_title: true,
    above_comments: true,
    sidebar: true
  },
  tracking_header_code: '<!-- Insert Custom Header (Histats, Google Analytics, pixel tracker script) here -->',
  tracking_footer_code: '<!-- Insert Custom Footer script (Chat widget, custom metrics counter) here -->',
  about_content: `Founded in 2026, masandigital.com is a state-of-the-art tech publication platform engineered using high-performance Next.js architectures, CSS Grid fluid layouts, and Supabase cloud architectures.\n\nWe exist to bridge the gap between advanced web engineering, cloud-native deployments, and practical, accessible insights for developers, digital architects, and tech executives globally.`,
  contact_email: 'editorial@masandigital.com',
  contact_phone: '+62 812-3456-7890',
  contact_address: 'Surabaya, East Java, Indonesia',
  contact_hours: 'Office Hours: Monday - Friday, 9:00 AM - 5:00 PM (GMT+7)',
  disclaimer_content: `The information provided by masandigital.com is for general informational purposes only. All information on the site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.\n\nUnder no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.`,
  privacy_content: `At masandigital.com, available from https://masandigital.com, the privacy of our visitors is one of our primary priorities. This Privacy Policy document contains types of information that is collected and recorded by masandigital.com and how we use it.\n\nBy using our website, you hereby consent to our Privacy Policy and agree to its terms. We collect personal information transparently to operate our platform, understand reading analytics, customized newsletter subscriptions, and deliver premium ad integrations safely.`,
  tos_content: `Welcome to masandigital.com! These terms and conditions outline the rules and regulations for the use of masandigital.com's Website, located at https://masandigital.com.\n\nBy accessing this website, we assume you accept these terms and conditions in full. Do not continue to use masandigital.com if you do not agree to all of the terms and conditions stated on this page. Other than content you own, masandigital.com owns all intellectual property rights for materials published in this portal.`,
  categories: 'AI,Dev,Strategy,Cloud,Hardware',
  homepage_limit: 6
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Detect if Supabase is properly configured (filters out placeholder keys)
const isSupabaseConfigured = 
  SUPABASE_URL.trim() !== '' && 
  SUPABASE_ANON_KEY.trim() !== '' && 
  !SUPABASE_ANON_KEY.includes('SILAKAN_PASTE') &&
  !SUPABASE_ANON_KEY.includes('your_supabase');

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Lightweight columns for list views (excludes heavy 'content' field)
const LIGHT_COLUMNS = 'id, title, slug, excerpt, category, cover_image, author_name, author_avatar, reading_time, status, views, created_at, published_at, keywords, comments_enabled';

// ==========================================
// Advanced Sub-Millisecond In-Memory Caching System
// ==========================================
const cache = {
  articles: null as { data: Article[]; timestamp: number } | null,
  articlesLight: null as { data: Article[]; timestamp: number } | null,
  articleBySlug: {} as Record<string, { data: Article | null; timestamp: number }>,
  settings: null as { data: SiteSettings; timestamp: number } | null,
  clear() {
    this.articles = null;
    this.articlesLight = null;
    this.articleBySlug = {};
    this.settings = null;
  }
};

// Active request coalescing registry (prevents parallel identical queries to Supabase)
const pending = {
  articles: null as Promise<Article[] | null> | null,
  articlesLight: null as Promise<Article[] | null> | null,
  settings: null as Promise<SiteSettings | null> | null,
};

const CACHE_TTL = 30000; // 30s for full articles
const CACHE_TTL_LIGHT = 60000; // 60s for lightweight list (no content = safer to cache longer)
const CACHE_TTL_SETTINGS = 120000; // 120s for settings (rarely changes)

export const db = {
  isSupabase: isSupabaseConfigured,

  // Get all articles (supports filtering and search with high-speed in-memory cache)
  async getArticles(category?: string, search?: string): Promise<Article[]> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured. Please paste your valid API keys in .env.local");
    }

    let allArticles: Article[] = [];
    const nowTime = Date.now();
    
    if (cache.articles && (nowTime - cache.articles.timestamp < CACHE_TTL)) {
      allArticles = cache.articles.data;
    } else {
      if (!pending.articles) {
        pending.articles = (async () => {
          try {
            const { data, error } = await supabase
              .from('articles')
              .select('*')
              .order('created_at', { ascending: false });
            if (error) throw error;
            return (data as Article[]) || [];
          } catch (err) {
            const errorMessage = typeof err === 'object' && err !== null
              ? (err as any).message || JSON.stringify(err)
              : String(err);
            console.error('Supabase getArticles query failed:', errorMessage);
            return []; // Graceful fallback to prevent crash
          }
        })();
      }
      
      try {
        const res = await pending.articles;
        if (res !== null) {
          allArticles = res;
        }
      } finally {
        pending.articles = null; // reset for next request
      }

      cache.articles = { data: allArticles, timestamp: nowTime };
    }
    
    // Filter the cached articles in memory (sub-millisecond instant!)
    let filtered = [...allArticles];
    if (category && category !== 'All') {
      filtered = filtered.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      filtered = filtered.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));
    }
    return filtered;
  },

  // Lightweight article list (WITHOUT content) - for homepage, sidebar, sitemap, related
  // Uses longer TTL + stale-while-revalidate for blazing speed
  async getArticlesLight(category?: string, search?: string): Promise<Article[]> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured.");
    }

    let allArticles: Article[] = [];
    const nowTime = Date.now();

    if (cache.articlesLight && (nowTime - cache.articlesLight.timestamp < CACHE_TTL_LIGHT)) {
      // Fresh cache hit
      allArticles = cache.articlesLight.data;
    } else if (cache.articlesLight) {
      // Stale-while-revalidate: return stale, refresh in background
      allArticles = cache.articlesLight.data;
      if (!pending.articlesLight) {
        pending.articlesLight = (async () => {
          try {
            const { data, error } = await supabase
              .from('articles').select(LIGHT_COLUMNS)
              .order('created_at', { ascending: false });
            if (error) throw error;
            cache.articlesLight = { data: (data as Article[]) || [], timestamp: Date.now() };
            return cache.articlesLight.data;
          } catch { return null; } finally { pending.articlesLight = null; }
        })();
      }
    } else {
      // Cold start
      if (!pending.articlesLight) {
        pending.articlesLight = (async () => {
          try {
            const { data, error } = await supabase
              .from('articles').select(LIGHT_COLUMNS)
              .order('created_at', { ascending: false });
            if (error) throw error;
            return (data as Article[]) || [];
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            console.error('Supabase getArticlesLight query failed:', msg);
            return []; // Graceful fallback to prevent crash
          }
        })();
      }
      try {
        const res = await pending.articlesLight;
        if (res !== null) allArticles = res;
      } finally { pending.articlesLight = null; }
      cache.articlesLight = { data: allArticles, timestamp: nowTime };
    }

    let filtered = [...allArticles];
    if (category && category !== 'All') {
      filtered = filtered.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      filtered = filtered.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));
    }
    return filtered;
  },

  // Get a single article by slug (utilizes in-memory cache)
  async getArticleBySlug(slug: string): Promise<Article | null> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured. Please paste your valid API keys in .env.local");
    }

    const nowTime = Date.now();
    if (cache.articleBySlug[slug] && (nowTime - cache.articleBySlug[slug].timestamp < CACHE_TTL)) {
      return cache.articleBySlug[slug].data;
    }

    let article: Article | null = null;
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      if (error) throw error;
      article = data as Article;
    } catch (err) {
      const errorMessage = typeof err === 'object' && err !== null
        ? (err as any).message || JSON.stringify(err)
        : String(err);
      console.error(`Supabase getArticleBySlug (${slug}) query failed:`, errorMessage);
      return null; // Graceful fallback to prevent crash
    }

    cache.articleBySlug[slug] = { data: article, timestamp: nowTime };
    return article;
  },

  // Create article (invalidates cache)
  async createArticle(articleData: Partial<Article>): Promise<Article> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured. Please paste your valid API keys in .env.local");
    }

    // Clear cache immediately
    cache.clear();

    const slug = articleData.title
      ? articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : 'untitled-' + Math.random().toString(36).substr(2, 5);

    const newArticlePayload: Partial<Article> = {
      title: articleData.title || 'Untitled',
      slug,
      content: articleData.content || '',
      excerpt: articleData.excerpt || '',
      category: articleData.category || 'AI',
      cover_image: articleData.cover_image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
      author_name: articleData.author_name || 'Andy Masan',
      author_avatar: articleData.author_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop',
      reading_time: articleData.reading_time || 5,
      status: articleData.status || 'published',
      views: 0,
      published_at: articleData.published_at || new Date().toISOString(),
      keywords: articleData.keywords || '',
      comments_enabled: articleData.comments_enabled !== undefined ? articleData.comments_enabled : true,
    };

    try {
      const { data, error } = await supabase
        .from('articles')
        .insert([newArticlePayload])
        .select()
        .maybeSingle();
        
      if (error) {
        console.warn('First articles insert failed, retrying without keywords & comments_enabled columns:', error);
        const fallbackRow = { ...newArticlePayload };
        delete fallbackRow.keywords;
        delete fallbackRow.comments_enabled;
        
        const { data: fallbackData, error: retryError } = await supabase
          .from('articles')
          .insert([fallbackRow])
          .select()
          .single();
        if (retryError) throw retryError;
        return fallbackData as Article;
      }
      if (!data) throw new Error("No data returned from article creation");
      return data as Article;
    } catch (err) {
      const errorMessage = typeof err === 'object' && err !== null
        ? (err as any).message || JSON.stringify(err)
        : String(err);
      console.error('Supabase createArticle failed:', errorMessage);
      throw new Error(`Failed to create article in Supabase: ${errorMessage}`);
    }
  },

  // Update article (invalidates cache)
  async updateArticle(id: string, articleData: Partial<Article>): Promise<Article> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured. Please paste your valid API keys in .env.local");
    }

    // Clear cache immediately
    cache.clear();

    try {
      const { data, error } = await supabase
        .from('articles')
        .update(articleData)
        .eq('id', id)
        .select()
        .maybeSingle();
        
      if (error) {
        console.warn('First articles update failed, retrying without keywords & comments_enabled columns:', error);
        const fallbackPayload = { ...articleData };
        delete fallbackPayload.keywords;
        delete fallbackPayload.comments_enabled;
        
        const { data: fallbackData, error: retryError } = await supabase
          .from('articles')
          .update(fallbackPayload)
          .eq('id', id)
          .select()
          .single();
        if (retryError) throw retryError;
        return fallbackData as Article;
      }
      if (!data) throw new Error("No data returned from article update");
      return data as Article;
    } catch (err) {
      const errorMessage = typeof err === 'object' && err !== null
        ? (err as any).message || JSON.stringify(err)
        : String(err);
      console.error(`Supabase updateArticle (${id}) failed:`, errorMessage);
      throw new Error(`Failed to update article in Supabase: ${errorMessage}`);
    }
  },

  // Delete article (invalidates cache)
  async deleteArticle(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured. Please paste your valid API keys in .env.local");
    }

    // Clear cache immediately
    cache.clear();

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      const errorMessage = typeof err === 'object' && err !== null
        ? (err as any).message || JSON.stringify(err)
        : String(err);
      console.error(`Supabase deleteArticle (${id}) failed:`, errorMessage);
      throw new Error(`Failed to delete article in Supabase: ${errorMessage}`);
    }
  },

  // Increment views - optimized: try RPC (1 query), fallback to 2 queries
  // Fire-and-forget: caller should NOT await this for page rendering
  async incrementViews(id: string): Promise<number> {
    if (!isSupabaseConfigured || !supabase) return 0;

    try {
      // Try Supabase RPC function first (single atomic query)
      const { data: rpcResult, error: rpcError } = await supabase
        .rpc('increment_views', { row_id: id });

      let nextViews: number;
      if (!rpcError && rpcResult !== null) {
        nextViews = typeof rpcResult === 'number' ? rpcResult : (rpcResult as any)?.[0]?.views || 0;
      } else {
        // Fallback: 2-query approach
        const { data: current } = await supabase.from('articles').select('views').eq('id', id).single();
        nextViews = (current?.views || 0) + 1;
        await supabase.from('articles').update({ views: nextViews }).eq('id', id);
      }

      // Update both caches silently
      const updateCache = (items: Article[] | undefined) => {
        if (!items) return;
        const item = items.find(a => a.id === id);
        if (item) item.views = nextViews;
      };
      updateCache(cache.articles?.data);
      updateCache(cache.articlesLight?.data);

      return nextViews;
    } catch (err) {
      console.error(`incrementViews (${id}) failed silently:`, err);
      return 0;
    }
  },

  // Get site settings (utilizes cache)
  async getSettings(): Promise<SiteSettings> {
    if (!isSupabaseConfigured || !supabase) {
      return DEFAULT_SETTINGS; // Return defaults if not configured
    }

    const nowTime = Date.now();
    if (cache.settings && (nowTime - cache.settings.timestamp < CACHE_TTL_SETTINGS)) {
      return cache.settings.data;
    }

    let settings: SiteSettings | null = null;
    if (!pending.settings) {
      pending.settings = (async () => {
        try {
          const { data, error } = await supabase.from('settings').select('*').limit(1).maybeSingle();
          if (error) throw error;
          if (data) {
            const parsedPlacements = typeof data.ads_placements === 'string' 
              ? JSON.parse(data.ads_placements) 
              : data.ads_placements;
              
            return {
              ...DEFAULT_SETTINGS,
              ...data,
              ads_placements: parsedPlacements || DEFAULT_SETTINGS.ads_placements,
              homepage_limit: data.homepage_limit !== undefined && data.homepage_limit !== null
                ? Number(data.homepage_limit) 
                : 6
            } as SiteSettings;
          }
          return null; // No settings found in DB
        } catch (err) {
          const errorMessage = typeof err === 'object' && err !== null
            ? (err as any).message || JSON.stringify(err)
            : String(err);
          console.error('Supabase getSettings query failed:', errorMessage);
          return null; // Graceful fallback to DEFAULT_SETTINGS
        }
      })();
    }

    try {
      settings = await pending.settings;
    } finally {
      pending.settings = null; // reset for next request
    }
    
    if (!settings) {
      settings = DEFAULT_SETTINGS;
    }

    cache.settings = { data: settings, timestamp: nowTime };
    return settings;
  },

  // Save site settings (invalidates cache)
  async saveSettings(settings: SiteSettings): Promise<SiteSettings> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured. Please paste your valid API keys in .env.local");
    }

    // Clear cache immediately
    cache.clear();

    try {
      const { data: existing } = await supabase.from('settings').select('id').limit(1).maybeSingle();
      
      const payload: Record<string, unknown> = {
        site_title: settings.site_title,
        site_tagline: settings.site_tagline,
        site_logo: settings.site_logo,
        site_icon: settings.site_icon,
        google_indexing_enabled: settings.google_indexing_enabled,
        google_indexing_json: settings.google_indexing_json,
        bing_api_key: settings.bing_api_key,
        google_site_verification: settings.google_site_verification,
        ads_enabled: settings.ads_enabled,
        ads_script_code: settings.ads_script_code,
        ads_placements: settings.ads_placements,
        tracking_header_code: settings.tracking_header_code,
        tracking_footer_code: settings.tracking_footer_code,
        about_content: settings.about_content,
        contact_email: settings.contact_email,
        contact_phone: settings.contact_phone,
        contact_address: settings.contact_address,
        contact_hours: settings.contact_hours,
        disclaimer_content: settings.disclaimer_content,
        privacy_content: settings.privacy_content,
        tos_content: settings.tos_content,
        categories: settings.categories,
        homepage_limit: settings.homepage_limit !== undefined ? Number(settings.homepage_limit) : 6
      };

      if (existing) {
        const { error } = await supabase.from('settings').update(payload).eq('id', existing.id);
        
        if (error) {
          console.warn('First settings update failed, retrying without site_logo, site_icon, indexing, homepage_limit and categories columns:', error);
          const fallbackPayload = { ...payload };
          delete fallbackPayload.site_logo;
          delete fallbackPayload.site_icon;
          delete fallbackPayload.google_indexing_enabled;
          delete fallbackPayload.google_indexing_json;
          delete fallbackPayload.bing_api_key;
          delete fallbackPayload.google_site_verification;
          delete fallbackPayload.categories;
          delete fallbackPayload.homepage_limit;
          
          const { error: retryError } = await supabase.from('settings').update(fallbackPayload).eq('id', existing.id);
          if (retryError) throw retryError;
        }
      } else {
        const { error } = await supabase.from('settings').insert([payload]);
        
        if (error) {
          console.warn('First settings insert failed, retrying without site_logo, site_icon, indexing, homepage_limit and categories columns:', error);
          const fallbackPayload = { ...payload };
          delete fallbackPayload.site_logo;
          delete fallbackPayload.site_icon;
          delete fallbackPayload.google_indexing_enabled;
          delete fallbackPayload.google_indexing_json;
          delete fallbackPayload.bing_api_key;
          delete fallbackPayload.google_site_verification;
          delete fallbackPayload.categories;
          delete fallbackPayload.homepage_limit;
          
          const { error: retryError } = await supabase.from('settings').insert([fallbackPayload]);
          if (retryError) throw retryError;
        }
      }
      return settings;
    } catch (err) {
      const errorMessage = typeof err === 'object' && err !== null
        ? (err as any).message || JSON.stringify(err)
        : String(err);
      console.error('Supabase settings update failed:', errorMessage);
      throw new Error(`Failed to save settings to Supabase: ${errorMessage}`);
    }
  }
};

// ==========================================
// Cache Warming - Pre-fetch on module load to eliminate cold starts
// ==========================================
export async function warmCache() {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await Promise.all([
      db.getArticlesLight(),
      db.getSettings(),
    ]);
    console.log('[DB Cache] Warm-up complete: articlesLight + settings pre-cached');
  } catch (err) {
    console.error('[DB Cache] Warm-up failed (non-fatal):', err);
  }
}

// Auto-warm cache on server startup (non-blocking)
if (typeof window === 'undefined' && isSupabaseConfigured) {
  warmCache();
}
