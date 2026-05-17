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

  // Generate dynamic JSON-LD structured data for advanced Google Rich Snippet indexing
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      'headline': article.title,
      'image': [
        article.cover_image
      ],
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
        }
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
    }
  ];

  // Render the pre-fetched static article into our client-side interactive component
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleClient initialArticle={article} />
    </>
  );
}
