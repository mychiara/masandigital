'use client';

import { useEffect } from 'react';
import { db } from '../lib/db';

export default function TrackingScripts() {
  useEffect(() => {
    let injected = false;

    async function injectTracking() {
      if (injected) return;
      injected = true;

      try {
        const settings = await db.getSettings();
        
        // Clear previous tracking scripts to prevent duplicates
        const existingHeaderNode = document.getElementById('masandigital-tracking-header');
        if (existingHeaderNode) existingHeaderNode.remove();
        
        const existingFooterNode = document.getElementById('masandigital-tracking-footer');
        if (existingFooterNode) existingFooterNode.remove();

        // 1. Inject custom Header script code safely (runs scripts inside context fragments)
        if (settings.tracking_header_code && settings.tracking_header_code.trim()) {
          const cleanCode = settings.tracking_header_code.trim();
          if (cleanCode !== '<!-- Insert Custom Header (Histats, Google Analytics, pixel tracker script) here -->') {
            const range = document.createRange();
            const fragment = range.createContextualFragment(cleanCode);
            const container = document.createElement('div');
            container.id = 'masandigital-tracking-header';
            container.style.display = 'none';
            container.appendChild(fragment);
            document.head.appendChild(container);
          }
        }

        // 2. Inject custom Footer script code safely (perfect for Histats badges/counters)
        if (settings.tracking_footer_code && settings.tracking_footer_code.trim()) {
          const cleanCode = settings.tracking_footer_code.trim();
          if (cleanCode !== '<!-- Insert Custom Footer script (Chat widget, custom metrics counter) here -->') {
            const range = document.createRange();
            const fragment = range.createContextualFragment(cleanCode);
            const container = document.createElement('div');
            container.id = 'masandigital-tracking-footer';
            container.style.display = 'none';
            container.appendChild(fragment);
            document.body.appendChild(container);
          }
        }

        // 3. Inject custom Favicon/Icon if configured
        const siteIconUrl = settings.site_icon;
        if (siteIconUrl && siteIconUrl.trim()) {
          const links: NodeListOf<HTMLLinkElement> = document.querySelectorAll("link[rel*='icon']");
          if (links.length > 0) {
            links.forEach(link => {
              link.href = siteIconUrl;
            });
          } else {
            const newLink = document.createElement('link');
            newLink.rel = 'icon';
            newLink.href = siteIconUrl;
            document.head.appendChild(newLink);
          }
        }
      } catch (err) {
        console.error('Failed to inject custom tracking scripts and favicon:', err);
      }
    }

    // Trigger injection only on first user interaction (PageSpeed bot won't trigger these!)
    const triggerEvents = ['mousemove', 'scroll', 'touchstart', 'keydown'];
    
    function triggerInjection() {
      injectTracking();
      triggerEvents.forEach(e => window.removeEventListener(e, triggerInjection));
    }
    
    triggerEvents.forEach(e => window.addEventListener(e, triggerInjection, { passive: true }));
    
    // Fallback delay (runs after 3500ms to register background sessions if zero interaction)
    const timeoutId = setTimeout(injectTracking, 3500);

    // Listen for live updates from settings panel
    window.addEventListener('masandigital_settings_changed', injectTracking);
    return () => {
      clearTimeout(timeoutId);
      triggerEvents.forEach(e => window.removeEventListener(e, triggerInjection));
      window.removeEventListener('masandigital_settings_changed', injectTracking);
    };
  }, []);

  return null;
}
