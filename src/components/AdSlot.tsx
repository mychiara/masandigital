'use client';

import { useEffect, useState } from 'react';

interface AdSlotProps {
  html: string;
  placement: string;
}

export default function AdSlot({ html, placement }: AdSlotProps) {
  const [dimensions, setDimensions] = useState({ width: '100%', height: 'auto' });

  useEffect(() => {
    if (!html) return;

    // Parse width & height from script configurations (like atOptions or standard attributes)
    const widthMatch = html.match(/(?:'width'|"width"|width)\s*:\s*['"]?(\d+%?|auto)['"]?/i);
    const heightMatch = html.match(/(?:'height'|"height"|height)\s*:\s*['"]?(\d+%?|auto)['"]?/i);

    let parsedWidth = '100%';
    let parsedHeight = '90px'; // Standard default banner height

    if (widthMatch) {
      const w = widthMatch[1];
      parsedWidth = w.includes('%') ? w : `${w}px`;
    } else {
      // Intelligent fallback dimensions based on placement
      if (placement === 'sidebar') {
        parsedWidth = '300px';
      } else if (placement === 'above_header' || placement === 'below_title' || placement === 'above_comments') {
        parsedWidth = '728px';
      }
    }

    if (heightMatch) {
      const h = heightMatch[1];
      parsedHeight = h.includes('%') ? h : `${h}px`;
    } else {
      // Intelligent fallback dimensions based on placement
      if (placement === 'sidebar') {
        parsedHeight = '250px';
      } else if (placement === 'above_header' || placement === 'below_title' || placement === 'above_comments') {
        parsedHeight = '90px';
      }
    }

    setDimensions({ width: parsedWidth, height: parsedHeight });
  }, [html, placement]);

  if (!html) return null;

  // Construct isolated srcDoc container for flawless third-party ad execution (Adsterra, AdSense, etc.)
  // This gives the ad script its own window/document context and allows document.write to function.
  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            background: transparent;
          }
        </style>
      </head>
      <body>
        <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
          ${html}
        </div>
      </body>
    </html>
  `;

  return (
    <div 
      className="ad-slot-wrapper w-full flex justify-center items-center overflow-hidden mx-auto transition-all duration-300"
      style={{ minHeight: dimensions.height === 'auto' ? '90px' : dimensions.height }}
      data-placement={placement}
    >
      <iframe
        srcDoc={srcDoc}
        width={dimensions.width.replace('px', '')}
        height={dimensions.height.replace('px', '')}
        style={{
          border: 'none',
          overflow: 'hidden',
          width: dimensions.width,
          height: dimensions.height,
          maxWidth: '100%',
        }}
        scrolling="no"
        title={`Advertisement Slot - ${placement}`}
      />
    </div>
  );
}

