import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://banglarail.in';

  return {
    rules: [
      // General crawlers: allow everything public, block admin & private APIs
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/admin/', '/api/corrections/'],
      },
      // Major search engines: explicitly allowed for full crawling
      {
        userAgent: ['Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot', 'Baiduspider', 'YandexBot', 'Applebot'],
        allow: '/',
        disallow: ['/admin/', '/api/admin/', '/api/corrections/'],
      },
      // Generative AI & LLM Crawlers (GEO & AI citations — explicitly welcomed)
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'ClaudeBot',
          'Claude-Web',
          'PerplexityBot',
          'Perplexity-Search',
          'Google-Extended',
          'Applebot-Extended',
          'CCBot',
          'cohere-ai',
          'meta-externalagent',
          'FacebookBot',
          'Bytespider',
          'Amazonbot',
          'Diffbot',
          'YouBot',
        ],
        allow: '/',
        disallow: ['/admin/', '/api/admin/', '/api/corrections/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
