import { NextResponse } from 'next/server';
import { db } from '../../lib/db';

export async function GET() {
  try {
    const settings = await db.getSettings();
    
    // Attempt to extract AdSense publisher ID from script code
    let pubId = 'pub-1234567890123456'; // Fallback sample ID
    if (settings?.ads_script_code) {
      const match = settings.ads_script_code.match(/pub-\d+/);
      if (match) {
        pubId = match[0];
      }
    }
    
    const adsTxtContent = `# Google AdSense Authorized Sellers list for masandigital.com
# Generated Dynamically via Next.js Core CMS Page
google.com, ${pubId}, DIRECT, f08c47fec0942fa0
`;
    
    return new NextResponse(adsTxtContent, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache at edge for high speed
      },
    });
  } catch (error) {
    console.error('Failed to generate ads.txt dynamically:', error);
    return new NextResponse('google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}
