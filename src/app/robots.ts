import { MetadataRoute } from 'next';
import { db } from '../lib/db';

export default async function robots(): Promise<MetadataRoute.Robots> {
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
    console.warn('Failed to dynamic query site_title for robots.txt sitemap, falling back:', err);
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/edit', '/login'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
