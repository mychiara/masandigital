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
}

export const DEFAULT_SETTINGS: SiteSettings = {
  site_title: 'masandigital.com',
  site_tagline: 'The Future of Tech & Strategy',
  site_logo: '',
  site_icon: '',
  google_indexing_enabled: false,
  google_indexing_json: '',
  bing_api_key: '',
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
  categories: 'AI,Dev,Strategy,Cloud,Hardware'
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Detect if Supabase is properly configured
const isSupabaseConfigured = SUPABASE_URL.trim() !== '' && SUPABASE_ANON_KEY.trim() !== '';

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Seed articles for localStorage fallback
const SEED_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'The Quantum Leap in Modern Web Development',
    slug: 'the-quantum-leap-in-modern-web-development',
    excerpt: 'How quantum computing and AI are colliding to fundamentally redefine digital architecture, developer productivity, and user experience.',
    content: `As we stand at the precipice of a new era in computing, the intersection of AI and development is creating ripples across the industry. Quantum computing is no longer a theoretical laboratory exercise; it is becoming the backbone of next-generation digital experiences.

Current development paradigms focus heavily on optimization and edge delivery. However, the introduction of AI-driven code generation and quantum-ready algorithms is shifting the focus from 'how we build' to 'what we can imagine'.

Web3 and decentralized systems further complicate the landscape, demanding developers to be more than just coders; they must be digital architects of trust and transparency.

The transition from binary to qubit-based logic in everyday applications will be rapid. We should prepare for automated debugging through large language models specialized in security, shifting the burden of QA from humans to machines.`,
    category: 'AI',
    cover_image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop',
    author_name: 'Marcus Vance',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    reading_time: 12,
    status: 'published',
    views: 2420,
    created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    published_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
  },
  {
    id: '2',
    title: 'Mastering Next.js 16 with Server Components',
    slug: 'mastering-nextjs-16-with-server-components',
    excerpt: 'A masterclass on harnessing React Server Components (RSC) and Next.js App Router caching to achieve near-instantaneous page loads.',
    content: `React Server Components (RSC) represent a paradigm shift in how we build user interfaces for the web. By executing components on the server first, we eliminate bundle size overhead and stream content directly to clients for instant renders.

Combined with Next.js App Router, developers gain fine-grained control over static rendering, dynamic data fetching, and partial routing layout retention.

In this article, we dive deep into advanced caching topologies, streaming with suspense boundaries, and optimistic client state synchronization during database mutations.`,
    category: 'Dev',
    cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
    author_name: 'Andy Masan',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop',
    reading_time: 8,
    status: 'published',
    views: 1205,
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    published_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: '3',
    title: 'Why Multi-Cloud is a Myth in 2026',
    slug: 'why-multi-cloud-is-a-myth-in-2026',
    excerpt: 'An analytical critique of contemporary enterprise cloud distribution strategies and why single-cloud with edge middleware wins.',
    content: `Many enterprises advocate for a multi-cloud strategy to avoid vendor lock-in. However, the operational complexity, data egress costs, and developer friction of building for the lowest common denominator often dwarf any pricing leverage gained.

Instead of spreading architectures thinly across AWS, GCP, and Azure, leading teams are choosing a "Single-Cloud, Multi-Edge" model, leveraging CDNs like Vercel and Cloudflare for performance while anchoring their primary databases in highly specialized clouds like Supabase.`,
    category: 'Cloud',
    cover_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    author_name: 'Sarah Chen',
    author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop',
    reading_time: 6,
    status: 'published',
    views: 842,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    published_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  }
];

// Helper to get local articles
const getLocalArticles = (): Article[] => {
  if (typeof window === 'undefined') return SEED_ARTICLES;
  const stored = localStorage.getItem('masandigital_articles');
  if (!stored) {
    localStorage.setItem('masandigital_articles', JSON.stringify(SEED_ARTICLES));
    return SEED_ARTICLES;
  }
  return JSON.parse(stored);
};

// Helper to save local articles
const saveLocalArticles = (articles: Article[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('masandigital_articles', JSON.stringify(articles));
  }
};

export const db = {
  isSupabase: isSupabaseConfigured,

  // Get all articles (supports filtering and search)
  async getArticles(category?: string, search?: string): Promise<Article[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('articles').select('*').order('created_at', { ascending: false });
        
        if (category && category !== 'All') {
          query = query.eq('category', category);
        }
        
        if (search) {
          query = query.ilike('title', `%${search}%`);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data as Article[];
      } catch (err) {
        console.error('Supabase query failed, falling back to local database:', err);
      }
    }

    // Local Storage Fallback
    let articles = getLocalArticles();
    if (category && category !== 'All') {
      articles = articles.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      articles = articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));
    }
    return articles;
  },

  // Get a single article by slug
  async getArticleBySlug(slug: string): Promise<Article | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
        if (error) throw error;
        if (data) return data as Article;
      } catch (err) {
        console.error('Supabase query failed, falling back to local:', err);
      }
    }

    // Local Storage Fallback
    const articles = getLocalArticles();
    return articles.find(a => a.slug === slug) || null;
  },

  // Create article
  async createArticle(articleData: Partial<Article>): Promise<Article> {
    const slug = articleData.title
      ? articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : 'untitled-' + Math.random().toString(36).substr(2, 5);

    const newArticle: Article = {
      id: Math.random().toString(36).substr(2, 9),
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
      created_at: new Date().toISOString(),
      published_at: articleData.published_at || new Date().toISOString(),
      keywords: articleData.keywords || '',
      comments_enabled: articleData.comments_enabled !== undefined ? articleData.comments_enabled : true,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        // Prepare DB row, omit mock ID so gen_random_uuid triggers
        const { id, ...dbRow } = newArticle;
        let { data, error } = await supabase
          .from('articles')
          .insert([dbRow])
          .select()
          .maybeSingle();
          
        if (error) {
          console.warn('First articles insert failed, retrying without keywords & comments_enabled columns:', error);
          const { keywords, comments_enabled, ...fallbackRow } = dbRow;
          const { data: fallbackData, error: retryError } = await supabase
            .from('articles')
            .insert([fallbackRow])
            .select()
            .single();
          if (retryError) throw retryError;
          return fallbackData as Article;
        }
        return data as Article;
      } catch (err) {
        console.error('Supabase insert failed, inserting to local database:', err);
      }
    }

    // Local Storage Fallback
    const articles = getLocalArticles();
    articles.unshift(newArticle);
    saveLocalArticles(articles);
    return newArticle;
  },

  // Update article
  async updateArticle(id: string, articleData: Partial<Article>): Promise<Article> {
    if (isSupabaseConfigured && supabase) {
      try {
        let { data, error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', id)
          .select()
          .maybeSingle();
          
        if (error) {
          console.warn('First articles update failed, retrying without keywords & comments_enabled columns:', error);
          const { keywords, comments_enabled, ...fallbackPayload } = articleData;
          const { data: fallbackData, error: retryError } = await supabase
            .from('articles')
            .update(fallbackPayload)
            .eq('id', id)
            .select()
            .single();
          if (retryError) throw retryError;
          return fallbackData as Article;
        }
        return data as Article;
      } catch (err) {
        console.error('Supabase update failed, updating locally:', err);
      }
    }

    // Local Storage Fallback
    const articles = getLocalArticles();
    const index = articles.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Article not found');
    
    const updatedArticle = {
      ...articles[index],
      ...articleData,
    };
    
    articles[index] = updatedArticle;
    saveLocalArticles(articles);
    return updatedArticle;
  },

  // Delete article
  async deleteArticle(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('articles')
          .delete()
          .eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase delete failed, deleting locally:', err);
      }
    }

    // Local Storage Fallback
    const articles = getLocalArticles();
    const filtered = articles.filter(a => a.id !== id);
    saveLocalArticles(filtered);
    return true;
  },

  // Increment views
  async incrementViews(id: string): Promise<number> {
    if (isSupabaseConfigured && supabase) {
      try {
        // Try incrementing views using Supabase RPC or read-and-write
        const { data: current } = await supabase.from('articles').select('views').eq('id', id).single();
        const nextViews = (current?.views || 0) + 1;
        await supabase.from('articles').update({ views: nextViews }).eq('id', id);
        return nextViews;
      } catch (err) {
        console.error('Supabase increment views failed:', err);
      }
    }

    // Local Storage Fallback
    const articles = getLocalArticles();
    const index = articles.findIndex(a => a.id === id);
    if (index !== -1) {
      articles[index].views += 1;
      saveLocalArticles(articles);
      return articles[index].views;
    }
    return 0;
  },

  // Get site settings
  async getSettings(): Promise<SiteSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('settings').select('*').limit(1).maybeSingle();
        if (!error && data) {
          const parsedPlacements = typeof data.ads_placements === 'string' 
            ? JSON.parse(data.ads_placements) 
            : data.ads_placements;
          return {
            ...DEFAULT_SETTINGS,
            ...data,
            ads_placements: parsedPlacements || DEFAULT_SETTINGS.ads_placements
          } as SiteSettings;
        }
      } catch (err) {
        console.warn('Supabase settings query failed, using local settings:', err);
      }
    }
    
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    const stored = localStorage.getItem('masandigital_settings');
    if (!stored) {
      localStorage.setItem('masandigital_settings', JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return JSON.parse(stored);
  },

  // Save site settings
  async saveSettings(settings: SiteSettings): Promise<SiteSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: existing } = await supabase.from('settings').select('id').limit(1).maybeSingle();
        
        const payload: any = {
          site_title: settings.site_title,
          site_tagline: settings.site_tagline,
          site_logo: settings.site_logo,
          site_icon: settings.site_icon,
          google_indexing_enabled: settings.google_indexing_enabled,
          google_indexing_json: settings.google_indexing_json,
          bing_api_key: settings.bing_api_key,
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
          categories: settings.categories
        };

        if (existing) {
          const { error } = await supabase.from('settings').update(payload).eq('id', existing.id);
          
          if (error) {
            console.warn('First settings update failed, retrying without site_logo, site_icon, indexing and categories columns:', error);
            const { site_logo, site_icon, google_indexing_enabled, google_indexing_json, bing_api_key, categories, ...fallbackPayload } = payload;
            const { error: retryError } = await supabase.from('settings').update(fallbackPayload).eq('id', existing.id);
            if (!retryError) return settings;
          } else {
            return settings;
          }
        } else {
          const { error } = await supabase.from('settings').insert([payload]);
          
          if (error) {
            console.warn('First settings insert failed, retrying without site_logo, site_icon, indexing and categories columns:', error);
            const { site_logo, site_icon, google_indexing_enabled, google_indexing_json, bing_api_key, categories, ...fallbackPayload } = payload;
            const { error: retryError } = await supabase.from('settings').insert([fallbackPayload]);
            if (!retryError) return settings;
          } else {
            return settings;
          }
        }
      } catch (err) {
        console.error('Supabase settings update failed, falling back to local:', err);
      }
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('masandigital_settings', JSON.stringify(settings));
    }
    return settings;
  }
};
