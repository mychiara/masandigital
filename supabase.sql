-- Create the articles table
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    category TEXT DEFAULT 'AI',
    cover_image TEXT,
    author_name TEXT DEFAULT 'Andy Masan',
    author_avatar TEXT,
    reading_time INTEGER DEFAULT 5,
    status TEXT DEFAULT 'published',
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    keywords TEXT DEFAULT '',
    comments_enabled BOOLEAN DEFAULT TRUE
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create the policies for articles (Allows everyone to read, but ONLY authenticated users to perform writes/updates/deletes)
CREATE POLICY "Allow public read-only access" ON public.articles
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users full access" ON public.articles
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert initial sample articles
INSERT INTO public.articles (title, slug, content, excerpt, category, cover_image, author_name, author_avatar, reading_time, status, views)
VALUES 
(
  'The Quantum Leap in Modern Web Development', 
  'the-quantum-leap-in-modern-web-development', 
  'As we stand at the precipice of a new era in computing, the intersection of AI and development is creating ripples across the industry. Quantum computing is no longer a theoretical laboratory exercise; it is becoming the backbone of next-generation digital experiences.\n\nCurrent development paradigms focus heavily on optimization and edge delivery. However, the introduction of AI-driven code generation and quantum-ready algorithms is shifting the focus from ''how we build'' to ''what we can imagine''.\n\nWeb3 and decentralized systems further complicate the landscape, demanding developers to be more than just coders; they must be digital architects of trust and transparency.\n\nThe transition from binary to qubit-based logic in everyday applications will be rapid. We should prepare for automated debugging through large language models specialized in security, shifting the burden of QA from humans to machines.', 
  'How quantum computing and AI are colliding to fundamentally redefine digital architecture, developer productivity, and user experience.', 
  'AI', 
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop', 
  'Marcus Vance', 
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop', 
  12, 
  'published',
  2420
),
(
  'Mastering Next.js 16 with Server Components', 
  'mastering-nextjs-16-with-server-components', 
  'React Server Components (RSC) represent a paradigm shift in how we build user interfaces for the web. By executing components on the server first, we eliminate bundle size overhead and stream content directly to clients for instant renders.\n\nCombined with Next.js App Router, developers gain fine-grained control over static rendering, dynamic data fetching, and partial routing layout retention.\n\nIn this article, we dive deep into advanced caching topologies, streaming with suspense boundaries, and optimistic client state synchronization during database mutations.', 
  'A masterclass on harnessing React Server Components (RSC) and Next.js App Router caching to achieve near-instantaneous page loads.', 
  'Dev', 
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop', 
  'Andy Masan', 
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop', 
  8, 
  'published',
  1205
),
(
  'Why Multi-Cloud is a Myth in 2026', 
  'why-multi-cloud-is-a-myth-in-2026', 
  'Many enterprises advocate for a multi-cloud strategy to avoid vendor lock-in. However, the operational complexity, data egress costs, and developer friction of building for the lowest common denominator often dwarf any pricing leverage gained.\n\nInstead of spreading architectures thinly across AWS, GCP, and Azure, leading teams are choosing a "Single-Cloud, Multi-Edge" model, leveraging CDNs like Vercel and Cloudflare for performance while anchoring their primary databases in highly specialized clouds like Supabase.', 
  'An analytical critique of contemporary enterprise cloud distribution strategies and why single-cloud with edge middleware wins.', 
  'Cloud', 
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop', 
  'Sarah Chen', 
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop', 
  6, 
  'published',
  842
)
ON CONFLICT (slug) DO NOTHING;

-- Create the settings table with all modern features included
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_title TEXT NOT NULL DEFAULT 'masandigital.com',
    site_tagline TEXT DEFAULT 'The Future of Tech & Strategy',
    site_logo TEXT DEFAULT '',
    site_icon TEXT DEFAULT '',
    google_indexing_enabled BOOLEAN DEFAULT FALSE,
    google_indexing_json TEXT DEFAULT '',
    bing_api_key TEXT DEFAULT '',
    google_site_verification TEXT DEFAULT '',
    ads_enabled BOOLEAN DEFAULT TRUE,
    ads_script_code TEXT,
    ads_placements JSONB DEFAULT '{"above_header": true, "below_title": true, "above_comments": true, "sidebar": true}',
    tracking_header_code TEXT,
    tracking_footer_code TEXT,
    about_content TEXT,
    contact_email TEXT DEFAULT 'editorial@masandigital.com',
    contact_phone TEXT DEFAULT '+62 812-3456-7890',
    contact_address TEXT DEFAULT 'Surabaya, East Java, Indonesia',
    contact_hours TEXT DEFAULT 'Office Hours: Monday - Friday, 9:00 AM - 5:00 PM (GMT+7)',
    disclaimer_content TEXT,
    privacy_content TEXT,
    tos_content TEXT,
    categories TEXT DEFAULT 'AI,Dev,Strategy,Cloud,Hardware',
    homepage_limit INTEGER DEFAULT 6,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to settings
CREATE POLICY "Allow public read access to settings" ON public.settings
    FOR SELECT USING (true);

-- Allow ONLY authenticated users full control over settings
CREATE POLICY "Allow authenticated users full access to settings" ON public.settings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
