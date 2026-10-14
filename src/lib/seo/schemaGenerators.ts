/**
 * Schema.org JSON-LD Structured Data Generators
 * Compliant with Google Search Rich Results guidelines and AI Crawlers (GEO)
 */

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

/**
 * Root WebSite Schema with internal SearchAction
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://banglarail.in/#website',
        'url': 'https://banglarail.in',
        'name': 'Bangla Rail',
        'alternateName': ['BanglaRail', 'West Bengal Train Timetable', 'Kolkata Metro Timetable'],
        'description': 'Real-Time West Bengal Railway Network, Local EMU Timetables & Kolkata Metro Schedule 2026',
        'inLanguage': 'en-IN',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': 'https://banglarail.in/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://banglarail.in/#organization',
        'name': 'Bangla Rail',
        'url': 'https://banglarail.in',
        'logo': 'https://banglarail.in/icon.png',
        'description': 'Comprehensive West Bengal commuter rail transit portal with live timetable schedules, halt sequences, and Kolkata metro integration.',
        'areaServed': {
          '@type': 'AdministrativeArea',
          'name': 'West Bengal, India',
        },
      },
    ],
  };
}

/**
 * TrainStation Schema for Station detail pages
 */
export function generateStationSchema(station: {
  name: string;
  code: string;
  division?: string;
  zone?: string;
  district?: string | null;
  lat?: number | null;
  lng?: number | null;
}) {
  const division = station.division || 'Sealdah';
  const zone = station.zone || 'ER';

  return {
    '@context': 'https://schema.org',
    '@type': 'TrainStation',
    'name': `${station.name} Railway Station`,
    'alternateName': [`${station.name} (${station.code})`, station.code],
    'identifier': station.code,
    'address': {
      '@type': 'PostalAddress',
      'addressRegion': 'West Bengal',
      'addressCountry': 'IN',
      'addressLocality': station.district || division,
    },
    ...(station.lat && station.lng
      ? {
          'geo': {
            '@type': 'GeoCoordinates',
            'latitude': station.lat,
            'longitude': station.lng,
          },
        }
      : {}),
    'containedInPlace': {
      '@type': 'AdministrativeArea',
      'name': `${division} Division, ${zone} Zone, West Bengal, India`,
    },
  };
}

/**
 * TrainTrip Schema for Train detail pages
 */
export function generateTrainTripSchema(train: {
  number: string;
  name: string;
  type?: string;
  runningDays?: string;
  firstStop?: { name: string; code: string; departureTime?: string | null };
  lastStop?: { name: string; code: string; arrivalTime?: string | null };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TrainTrip',
    'trainName': `${train.number} ${train.name}`,
    'trainNumber': train.number,
    'description': `${train.type || 'EMU Local'} operating on ${train.runningDays || 'Daily'} across West Bengal.`,
    'departureStation': {
      '@type': 'TrainStation',
      'name': train.firstStop?.name || 'Origin Station',
      'identifier': train.firstStop?.code || '',
    },
    'arrivalStation': {
      '@type': 'TrainStation',
      'name': train.lastStop?.name || 'Destination Station',
      'identifier': train.lastStop?.code || '',
    },
    'departureTime': train.firstStop?.departureTime || undefined,
    'arrivalTime': train.lastStop?.arrivalTime || undefined,
    'provider': {
      '@type': 'Organization',
      'name': 'Eastern Railway / South Eastern Railway / Indian Railways',
      'url': 'https://banglarail.in',
    },
  };
}

/**
 * Route Pair Structured Data: BreadcrumbList + FAQPage + TransitLine
 */
export function generateRouteTripSchema(params: {
  fromStation: { name: string; code: string };
  toStation: { name: string; code: string };
  slug: string;
  totalTrains: number;
  faqList: FAQItem[];
}) {
  const { fromStation, toStation, slug, totalTrains, faqList } = params;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://banglarail.in',
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': `${fromStation.name} Station`,
            'item': `https://banglarail.in/station/${fromStation.code.toLowerCase()}`,
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': `${fromStation.name} to ${toStation.name} Train Schedule`,
            'item': `https://banglarail.in/trains-between/${slug}`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        'mainEntity': faqList.map((faq) => ({
          '@type': 'Question',
          'name': faq.q,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.a,
          },
        })),
      },
      {
        '@type': 'TransitLine',
        'name': `${fromStation.name} to ${toStation.name} Railway Route`,
        'description': `Daily EMU local timetable and express trains operating between ${fromStation.name} (${fromStation.code}) and ${toStation.name} (${toStation.code}) with ${totalTrains} scheduled services daily.`,
        'provider': {
          '@type': 'Organization',
          'name': 'Indian Railways (Eastern Railway / South Eastern Railway)',
        },
      },
    ],
  };
}

/**
 * Generic BreadcrumbList Schema generator
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url,
    })),
  };
}
