import React from 'react';
import { Metadata } from 'next';
import { db } from '../../../lib/db';
import ArticleClient from './ArticleClient';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate Static Params for SSG pre-rendering at build time
export async function generateStaticParams() {
  try {
    const articles = await db.getArticles();
    const published = articles.filter(a => a.status === 'published');
    return published.map((article) => ({
      slug: article.slug,
    }));
  } catch (e) {
    console.error('Failed to generate static params:', e);
    return [];
  }
}

// Dynamic SEO Metadata Generation for a perfect 100 SEO Score
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await db.getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found | masandigital.com',
      description: 'The requested technology editorial article could not be found.',
    };
  }

  return {
    title: `${article.title} | masandigital.com`,
    description: article.excerpt || article.title,
    keywords: article.keywords ? article.keywords.split(',').map(k => k.trim()).filter(Boolean) : undefined,
    alternates: {
      canonical: `/article/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.cover_image, width: 1200, height: 630 }],
      type: 'article',
      publishedTime: new Date(article.published_at || article.created_at).toISOString(),
      authors: [article.author_name],
      section: article.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.cover_image],
    },
  };
}

// Main Server Component Page
export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const article = await db.getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-background">
        <Navbar />
        <div className="flex-grow max-w-lg mx-auto flex flex-col items-center justify-center text-center p-8 py-32">
          <BookOpen className="w-16 h-16 text-primary mb-4 opacity-40" />
          <h2 className="text-2xl font-black text-on-surface">Article Not Found</h2>
          <p className="text-sm text-on-surface-variant mt-2">
            The article page you are looking for does not exist or may have been deleted by the authors.
          </p>
          <Link href="/" className="mt-6 bg-primary text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-md">
            Return to Homepage
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Dynamic SEO Internal Link Auto-Linker Engine (Steps 1-5 & SEO Traffic Multiplier)
  let linkedContent = article.content || '';
  try {
    const allArticles = await db.getArticles();
    const otherArticles = allArticles.filter(a => a.id !== article.id && a.status === 'published');
    
    // Sort other articles by title length in descending order to match longer phrases first
    const sortedOthers = [...otherArticles].sort((a, b) => b.title.length - a.title.length);
    
    // Take the top 15 candidates to avoid excessive linking (Google-friendly white-hat limits)
    const candidates = sortedOthers.slice(0, 15);
    
    candidates.forEach((other) => {
      const keyword = other.title.trim();
      if (keyword.length < 5) return;
      
      // Escape regex special characters safely
      const escapedKeyword = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      
      // Matches the keyword on word boundaries, making sure it isn't inside HTML tags or markdown brackets
      const regex = new RegExp(`\\b(${escapedKeyword})\\b(?![^<]*>)(?![^[]*\\])`, 'gi');
      
      let matchCount = 0;
      linkedContent = linkedContent.replace(regex, (match) => {
        if (matchCount < 1) {
          matchCount++;
          return `<a href="/article/${other.slug}" class="font-extrabold text-primary hover:underline">${match}</a>`;
        }
        return match;
      });
    });
  } catch (err) {
    console.error('SEO Dynamic Auto-Linker error:', err);
  }

  // Create article copy with dynamic internal links
  const articleWithLinkedContent = {
    ...article,
    content: linkedContent
  };

  // Helper to dynamically extract FAQ items from article content for Google Rich Snippets
  const faqItems: { question: string; answer: string }[] = [];
  try {
    const content = article.content || '';
    // Match "Q1: What is..." or "Pertanyaan 1: What is..."
    const qMatches = Array.from(content.matchAll(/(?:Q\d*|Pertanyaan\d*)\s*:\s*([^<]+)/gi));
    // Match "A: It is..." or "Jawaban: It is..."
    const aMatches = Array.from(content.matchAll(/(?:A|Jawaban)\s*:\s*([^<]+)/gi));
    
    const count = Math.min(qMatches.length, aMatches.length);
    for (let i = 0; i < count; i++) {
      const question = qMatches[i][1].replace(/^<strong>|<\/strong>$/g, '').trim();
      const answer = aMatches[i][1].replace(/^<strong>|<\/strong>$/g, '').trim();
      if (question && answer) {
        faqItems.push({ question, answer });
      }
    }
  } catch (err) {
    console.error('Failed to parse dynamic FAQs for Schema markup:', err);
  }

  // Generate dynamic JSON-LD structured data for advanced Google Rich Snippet indexing
  const jsonLd: any[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      'headline': article.title,
      'image': [article.cover_image],
      'datePublished': new Date(article.published_at || article.created_at).toISOString(),
      'dateModified': new Date(article.published_at || article.created_at).toISOString(),
      'author': [{
        '@type': 'Person',
        'name': article.author_name,
        'url': 'https://masandigital.com/about'
      }],
      'publisher': {
        '@type': 'Organization',
        'name': 'masandigital.com',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://masandigital.com/logo.png'
        },
        'sameAs': [
          'https://www.facebook.com/masandigital',
          'https://www.twitter.com/masandigital',
          'https://www.linkedin.com/company/masandigital'
        ]
      },
      'description': article.excerpt || article.title
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': 'https://masandigital.com'
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': article.category,
          'item': `https://masandigital.com/?category=${encodeURIComponent(article.category)}`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': article.title,
          'item': `https://masandigital.com/article/${article.slug}`
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://masandigital.com/#organization',
      'name': 'masandigital.com',
      'url': 'https://masandigital.com',
      'logo': 'https://masandigital.com/logo.png',
      'sameAs': [
        'https://www.facebook.com/masandigital',
        'https://www.twitter.com/masandigital',
        'https://www.linkedin.com/company/masandigital'
      ]
    }
  ];

  if (faqItems.length > 0) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqItems.map(item => ({
        '@type': 'Question',
        'name': item.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': item.answer
        }
      }))
    });
  }

  // Render the pre-fetched static article into our client-side interactive component
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleClient initialArticle={articleWithLinkedContent} />
    </>
  );
}
