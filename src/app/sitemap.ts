import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

// Cache sitemap for 24 hours at CDN / edge layer
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://banglarail.in';

  // Base core routes — all key pages indexed
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/plan`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/report`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  // All 556 Stations dynamically indexed
  const stations = await prisma.station.findMany({
    select: { code: true, createdAt: true },
  });

  const stationRoutes: MetadataRoute.Sitemap = stations.map((s) => ({
    url: `${baseUrl}/station/${s.code.toLowerCase()}`,
    lastModified: s.createdAt || new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Top high-intent West Bengal train route pairs (Slugs matching user Google searches)
  const popularRouteSlugs = [
    // --- Adisaptagram, Howrah & Main Line Corridors ---
    'adisaptagram-to-howrah',
    'howrah-to-adisaptagram',
    'adst-to-hwh',
    'hwh-to-adst',
    'howrah-to-bandel',
    'bandel-to-howrah',
    'bdc-to-hwh',
    'hwh-to-bdc',
    'howrah-to-barddhaman',
    'barddhaman-to-howrah',
    'bwn-to-hwh',
    'hwh-to-bwn',
    'adisaptagram-to-barddhaman',
    'barddhaman-to-adisaptagram',
    'adisaptagram-to-bandel',
    'bandel-to-adisaptagram',
    'mogra-to-howrah',
    'howrah-to-mogra',
    'pundooah-to-howrah',
    'howrah-to-pundooah',
    'memari-to-howrah',
    'howrah-to-memari',

    // --- Kolkata Metro Lines (Underwater, North-South, Purple, Orange) ---
    'howrah-maidan-to-salt-lake-sector-v',
    'salt-lake-sector-v-to-howrah-maidan',
    'm-hmd-to-m-scv',
    'm-scv-to-m-hmd',
    'howrah-maidan-to-esplanade',
    'esplanade-to-howrah-maidan',
    'dakshineswar-to-kavi-subhash',
    'kavi-subhash-to-dakshineswar',
    'm-dks-to-m-kvs',
    'm-kvs-to-m-dks',
    'joka-to-majerhat',
    'majerhat-to-joka',
    'm-jok-to-m-mjt',
    'm-mjt-to-m-jok',
    'kavi-subhash-to-hemanta-mukhopadhyay',
    'hemanta-mukhopadhyay-to-kavi-subhash',
    'm-kvs-to-m-hmk',
    'm-hmk-to-m-kvs',

    // --- Sealdah Main & North Lines ---
    'sealdah-to-ranaghat',
    'ranaghat-to-sealdah',
    'sdah-to-rha',
    'rha-to-sdah',
    'sealdah-to-krishnanagar-city',
    'krishnanagar-city-to-sealdah',
    'sdah-to-knj',
    'knj-to-sdah',
    'sealdah-to-shantipur',
    'shantipur-to-sealdah',
    'sealdah-to-gede',
    'gede-to-sealdah',
    'sealdah-to-lalgola',
    'lalgola-to-sealdah',
    'sdah-to-lgl',
    'lgl-to-sdah',
    'sealdah-to-bongaon',
    'bongaon-to-sealdah',
    'sdah-to-bnj',
    'bnj-to-sdah',
    'sealdah-to-hasnabad',
    'hasnabad-to-sealdah',
    'sdah-to-hnb',
    'hnb-to-sdah',

    // --- Sealdah South Lines ---
    'sealdah-to-baruipur',
    'baruipur-to-sealdah',
    'sealdah-to-diamond-harbour',
    'diamond-harbour-to-sealdah',
    'sdah-to-dh',
    'dh-to-sdah',
    'sealdah-to-canning',
    'canning-to-sealdah',
    'sdah-to-cg',
    'cg-to-sdah',
    'sealdah-to-namkhana',
    'namkhana-to-sealdah',
    'sealdah-to-budge-budge',
    'budge-budge-to-sealdah',

    // --- South Eastern Lines ---
    'howrah-to-kharagpur',
    'kharagpur-to-howrah',
    'hwh-to-kgp',
    'kgp-to-hwh',
    'howrah-to-midnapore',
    'midnapore-to-howrah',
    'howrah-to-digha',
    'digha-to-howrah',
    'hwh-to-dgha',
    'dgha-to-hwh',
    'howrah-to-haldia',
    'haldia-to-howrah',
    'howrah-to-purulia',
    'purulia-to-howrah',
    'howrah-to-bankura',
    'bankura-to-howrah',

    // --- Asansol, Durgapur & Bolpur Lines ---
    'howrah-to-asansol',
    'asansol-to-howrah',
    'hwh-to-asn',
    'asn-to-hwh',
    'howrah-to-durgapur',
    'durgapur-to-howrah',
    'howrah-to-bolpur-shantiniketan',
    'bolpur-shantiniketan-to-howrah',
    'hwh-to-bhp',
    'bhp-to-hwh',

    // --- North Bengal & Vande Bharat Corridors ---
    'howrah-to-new-jalpaiguri',
    'new-jalpaiguri-to-howrah',
    'hwh-to-njp',
    'njp-to-hwh',
    'sealdah-to-new-jalpaiguri',
    'new-jalpaiguri-to-sealdah',
    'sdah-to-njp',
    'njp-to-sdah',
    'howrah-to-malda-town',
    'malda-town-to-howrah',
    'howrah-to-puri',
    'puri-to-howrah',
    'howrah-to-patna',
    'patna-to-howrah',
    'howrah-to-ranchi',
    'ranchi-to-howrah',
    // --- Howrah Main Line Local Stations (Belur, Hindmotor, Konnagar, Bansberia, Islampara...) ---
    'hindmotor-to-howrah',
    'howrah-to-hindmotor',
    'belur-to-howrah',
    'howrah-to-belur',
    'liluah-to-howrah',
    'howrah-to-liluah',
    'bally-to-howrah',
    'howrah-to-bally',
    'uttarpara-to-howrah',
    'howrah-to-uttarpara',
    'konnagar-to-howrah',
    'howrah-to-konnagar',
    'rishra-to-howrah',
    'howrah-to-rishra',
    'serampore-to-howrah',
    'howrah-to-serampore',
    'sheoraphuli-to-howrah',
    'howrah-to-sheoraphuli',
    'chandannagar-to-howrah',
    'howrah-to-chandannagar',
    'chinsurah-to-howrah',
    'howrah-to-chinsurah',
    'dankuni-to-howrah',
    'howrah-to-dankuni',
    'kamarkundu-to-howrah',
    'howrah-to-kamarkundu',

    // --- Bandel-Katwa Line (Bansberia, Islampara, Ambika Kalna...) ---
    'bansberia-to-bandel',
    'bandel-to-bansberia',
    'islampara-to-bandel',
    'bandel-to-islampara',
    'kuntighat-to-bandel',
    'bandel-to-kuntighat',
    'jirat-to-bandel',
    'bandel-to-jirat',
    'ambika-kalna-to-bandel',
    'bandel-to-ambika-kalna',
    'nabadwip-dham-to-bandel',
    'bandel-to-nabadwip-dham',
    'bandel-to-katwa',
    'katwa-to-bandel',

    // --- Sealdah Suburban Corridors (Barrackpore, Naihati, Kalyani, Barasat...) ---
    'dum-dum-to-sealdah',
    'sealdah-to-dum-dum',
    'barrackpore-to-sealdah',
    'sealdah-to-barrackpore',
    'naihati-to-sealdah',
    'sealdah-to-naihati',
    'kalyani-to-sealdah',
    'sealdah-to-kalyani',
    'chakdaha-to-sealdah',
    'sealdah-to-chakdaha',
    'barasat-to-sealdah',
    'sealdah-to-barasat',
    'habra-to-sealdah',
    'sealdah-to-habra',
    'ballygunge-to-sealdah',
    'sealdah-to-ballygunge',
    'sonarpur-to-sealdah',
    'sealdah-to-sonarpur',
    'berhampore-court-to-sealdah',
    'sealdah-to-berhampore-court',

    // --- Kharagpur & Medinipur Lines ---
    'midnapore-to-kharagpur',
    'kharagpur-to-midnapore',
    'amta-to-howrah',
    'howrah-to-amta',

    // --- North Bengal Corridors ---
    'siliguri-to-new-jalpaiguri',
    'new-jalpaiguri-to-siliguri',
    'alipurduar-to-new-jalpaiguri',
    'new-jalpaiguri-to-alipurduar',
    'coochbehar-to-new-jalpaiguri',
    'new-jalpaiguri-to-coochbehar',
  ];

  const trainBetweenRoutes: MetadataRoute.Sitemap = popularRouteSlugs.map((slug) => ({
    url: `${baseUrl}/trains-between/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.95,
  }));

  return [...staticRoutes, ...trainBetweenRoutes, ...stationRoutes];
}

