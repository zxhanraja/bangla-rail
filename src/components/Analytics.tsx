'use client';

import { useEffect } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function Analytics() {
  useEffect(() => {
    // If no Google Analytics Measurement ID is configured, do nothing
    if (!GA_ID) return;

    try {
      // Check user cookie consent
      const stored = localStorage.getItem('bangla_rail_cookie_consent');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.level !== 'all') {
          // User chose Essential only — do not load GA4
          return;
        }
      } else {
        // No consent given yet — do not load until accepted
        return;
      }

      // Avoid duplicate script injection
      if (document.getElementById('ga-gtag-script')) return;

      // Inject Google Analytics gtag.js
      const scriptGtag = document.createElement('script');
      scriptGtag.id = 'ga-gtag-script';
      scriptGtag.async = true;
      scriptGtag.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(scriptGtag);

      // Initialize gtag dataLayer with privacy defaults
      const scriptInit = document.createElement('script');
      scriptInit.id = 'ga-init-script';
      scriptInit.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}', {
          anonymize_ip: true,
          cookie_flags: 'SameSite=None;Secure'
        });
      `;
      document.head.appendChild(scriptInit);
    } catch {
      // Fail silently if localStorage or DOM manipulation is restricted
    }
  }, []);

  // Return null — pure headless client component with 0 hydration footprint
  return null;
}
