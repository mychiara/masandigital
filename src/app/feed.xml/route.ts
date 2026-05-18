import { NextResponse } from 'next/server';
import { db } from '../../lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const baseUrl = 'https://masandigital.com';
  
  try {
    const articles = await db.getArticles();
    const published = articles
      .filter(a => a.status === 'published')
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, 30); // RSS standard feeds should keep the 30 most recent articles

    const rssItems = published.map(article => {
      const pubDate = new Date(article.published_at || article.created_at).toUTCString();
      const cleanExcerpt = (article.excerpt || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const cleanTitle = article.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      
      return `
    <item>
      <title>${cleanTitle}</title>
      <link>${baseUrl}/article/${article.slug}</link>
      <guid isPermaLink="true">${baseUrl}/article/${article.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${cleanExcerpt}</description>
      <content:encoded><![CDATA[${article.content || ''}]]></content:encoded>
      <dc:creator><![CDATA[${article.author_name}]]></dc:creator>
      <category><![CDATA[${article.category}]]></category>
      <enclosure url="${article.cover_image}" length="1024" type="image/webp" />
    </item>`;
    }).join('\n');

    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
  xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
  xmlns:georss="http://www.georss.org/georss"
  xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>masandigital.com | Portal Teknologi &amp; Solusi Digital Premium</title>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <link>${baseUrl}</link>
    <description>Portal Berita Teknologi Terkini, Tips Coding, Automasi Bisnis, dan Review Gadget Terbaik</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>id-ID</language>
    <sy:updatePeriod>hourly</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>masandigital.com</title>
      <link>${baseUrl}</link>
      <width>32</width>
      <height>32</height>
    </image>
    ${rssItems}
  </channel>
</rss>`;

    return new NextResponse(rssFeed, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    });
  } catch (err) {
    console.error('RSS Feed generation failed:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
