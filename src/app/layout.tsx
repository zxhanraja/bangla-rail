import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  themeColor: '#FACC15',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// ── 6 & 7: Meta Titles + Descriptions + Social Preview ────────────────────
export const metadata: Metadata = {
  metadataBase: new URL('https://banglarail.in'),
  title: {
    default: 'Bangla Rail — West Bengal Local Train & Kolkata Metro Timetable 2026',
    template: '%s | Bangla Rail',
  },
  description: 'Check 2026 West Bengal local train timetables — Howrah, Sealdah, EMU schedules, Kolkata Underwater Metro (Green Line), Vande Bharat & all 556 stations. Fast, free, no account needed.',
  keywords: [
    'Adisaptagram to Howrah train time table',
    'Adisaptagram local train schedule',
    'West Bengal train timetable 2026',
    'Kolkata Metro timetable today',
    'Kolkata underwater metro time table',
    'Howrah to Barddhaman main local train',
    'Howrah to Bandel local train time table',
    'Sealdah suburban local train schedule',
    'Vande Bharat Express West Bengal timings',
    'Eastern Railway train time table',
    'South Eastern Railway time table',
    'Howrah Junction live train schedule',
    'Sealdah to Ranaghat local train timings',
    'Digha to Howrah local trains',
    'EMU local train schedule West Bengal',
  ],
  authors: [{ name: 'Bangla Rail Team', url: 'https://banglarail.in' }],
  creator: 'Bangla Rail',
  publisher: 'Bangla Rail',
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  alternates: {
    canonical: 'https://banglarail.in',
  },
  // ── 8: Favicon suite ────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
  // ── 7: Social Preview Image (OpenGraph + Twitter) ───────────────────────
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://banglarail.in',
    siteName: 'Bangla Rail',
    title: 'Bangla Rail — West Bengal Local Train & Kolkata Metro Timetables',
    description: 'Instant local train and Kolkata Metro schedules across all 556 West Bengal stations. Free timetables, halt sequences & platform info.',
    alternateLocale: ['bn_IN'],
    images: [
      {
        url: 'https://banglarail.in/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Bangla Rail — West Bengal Train & Kolkata Metro Timetable App, 667 Stations',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bangla Rail — West Bengal Train & Kolkata Metro Timetable',
    description: 'Search local train, Kolkata underwater metro, and Vande Bharat schedules across all 667 West Bengal stations. Free, fast, no ads.',
    images: [{ url: 'https://banglarail.in/og-image.png', alt: 'Bangla Rail West Bengal Train Timetable' }],
    creator: '@banglarail',
    site: '@banglarail',
  },
  other: {
    'geo.region': 'IN-WB',
    'geo.placename': 'Kolkata, West Bengal, India',
    'geo.position': '22.5858;88.3426',
    'ICBM': '22.5858, 88.3426',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://banglarail.in/#website',
        'url': 'https://banglarail.in',
        'name': 'Bangla Rail',
        'alternateName': ['BanglaRail', 'West Bengal Train Timetable 2026', 'Kolkata Metro Timetable Today'],
        'description': 'Real-Time West Bengal Railway Network, Local EMU Timetables & Kolkata Metro Schedule 2026',
        'inLanguage': ['en-IN', 'bn-IN'],
        'potentialAction': {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': 'https://banglarail.in/?from={origin_station}&to={destination_station}',
          },
          'query-input': 'required name=origin_station required name=destination_station',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://banglarail.in/#organization',
        'name': 'Bangla Rail',
        'url': 'https://banglarail.in',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://banglarail.in/icon-512.png',
          'width': 512,
          'height': 512,
        },
        'description': 'The authority digital commuter railway timetable and transit schedule portal for the state of West Bengal, India, covering 667 stations across Eastern Railway (ER), South Eastern Railway (SER), and Metro Railway Kolkata.',
        'knowsAbout': [
          'West Bengal Railway Network',
          'Eastern Railway Zone',
          'South Eastern Railway Zone',
          'Metro Railway Kolkata',
          'Kolkata Underwater Metro Green Line',
          'Howrah Railway Division',
          'Sealdah Railway Division',
          'EMU Suburban Local Trains',
          'Indian Railways Timetable 2026',
        ],
        'sameAs': [
          'https://en.wikipedia.org/wiki/Eastern_Railway_zone',
          'https://en.wikipedia.org/wiki/Kolkata_Suburban_Railway',
          'https://en.wikipedia.org/wiki/Kolkata_Metro',
          'https://en.wikipedia.org/wiki/South_Eastern_Railway_zone'
        ],
        'areaServed': {
          '@type': 'AdministrativeArea',
          'name': 'West Bengal, India',
          'containedInPlace': {
            '@type': 'Country',
            'name': 'India',
          },
        },
        'contactPoint': {
          '@type': 'ContactPoint',
          'email': 'support@banglarail.in',
          'contactType': 'customer support',
          'availableLanguage': ['English', 'Bengali'],
        },
      },
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} h-full bg-[#F8F9FA] text-[#0A0A0A]`}>
      <head>
        <link rel="search" type="application/opensearchdescription+xml" title="Bangla Rail" href="/opensearch.xml" />
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLM Context" />
        <link rel="alternate" type="text/markdown" href="/llms-full.txt" title="Full LLM Documentation" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* 16: Privacy-first Analytics (only if NEXT_PUBLIC_GA_ID is set) */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('consent', 'default', {
                    'analytics_storage': 'denied',
                    'ad_storage': 'denied'
                  });
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { anonymize_ip: true });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col antialiased bg-[#F8F9FA] text-[#0A0A0A] selection:bg-yellow-400 selection:text-black">
        <LanguageProvider>
          <Header />
          <main className="flex-1 w-full max-w-[1240px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-7">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
