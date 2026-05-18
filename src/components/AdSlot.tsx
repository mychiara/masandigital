'use client';

import { useEffect, useRef } from 'react';

interface AdSlotProps {
  html: string;
  placement: string;
}

export default function AdSlot({ html, placement }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !html) return;

    // Clear previous ad rendering to avoid duplication/leaks
    containerRef.current.innerHTML = '';

    // Create a temporary DOM parser to read the HTML structure
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const nodes = Array.from(doc.body.childNodes);

    nodes.forEach((node) => {
      if (node.nodeName === 'SCRIPT') {
        const scriptElement = document.createElement('script');
        
        // Copy all script attributes (async, defer, src, key, type, etc.)
        Array.from((node as HTMLScriptElement).attributes).forEach((attr) => {
          scriptElement.setAttribute(attr.name, attr.value);
        });

        // Copy inline script logic (such as Adsterra atOptions parameters)
        if ((node as HTMLScriptElement).innerHTML) {
          scriptElement.innerHTML = (node as HTMLScriptElement).innerHTML;
        }

        containerRef.current?.appendChild(scriptElement);
      } else {
        // Clone standard DOM elements (div, iframe, a, img, styled templates)
        const clonedNode = node.cloneNode(true);
        
        // Recursively handle any script tags nested inside child containers
        if (clonedNode instanceof HTMLElement) {
          const scriptsInside = clonedNode.querySelectorAll('script');
          scriptsInside.forEach((script) => {
            const scriptElement = document.createElement('script');
            Array.from(script.attributes).forEach((attr) => {
              scriptElement.setAttribute(attr.name, attr.value);
            });
            if (script.innerHTML) {
              scriptElement.innerHTML = script.innerHTML;
            }
            script.parentNode?.replaceChild(scriptElement, script);
          });
        }
        
        containerRef.current?.appendChild(clonedNode);
      }
    });
  }, [html]);

  return (
    <div 
      ref={containerRef} 
      className="ad-slot-container w-full h-full flex items-center justify-center overflow-hidden mx-auto"
      data-placement={placement}
    />
  );
}
