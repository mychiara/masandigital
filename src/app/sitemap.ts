import { MetadataRoute } from 'next';
import { db } from '../lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Extract and clean the domain name dynamically from the site settings
  let baseUrl = 'https://masandigital.com';
  
  try {
    const settings = await db.getSettings();
    if (settings && settings.site_title) {
      const cleanDomain = settings.site_title
        .toLowerCase()
        .replace(/^(https?:\/\/)?(www\.)?/, '')
        .trim();
      baseUrl = `https://${cleanDomain}`;
    }
  } catch (err) {
    console.warn('Failed to dynamic query site_title for sitemap, falling back:', err);
  }
  
  let articleEntries: any[] = [];
  
  try {
    // Fetch all active articles for dynamic sitemap inclusion
    const articles = await db.getArticles();
    const now = new Date();
    const publishedArticles = articles.filter(a => a.status === 'published' && new Date(a.published_at || a.created_at) <= now);
    
    articleEntries = publishedArticles.map((article) => ({
      url: `${baseUrl}/article/${article.slug}`,
      lastModified: new Date(article.published_at || article.created_at),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (err) {
    console.error('Failed to generate dynamic sitemap entries:', err);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...articleEntries,
  ];
}
