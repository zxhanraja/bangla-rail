/**
 * West Bengal Railway Geographic & Administrative Reference
 * Used for Local SEO, Geo-targeting, and Generative Engine Optimization (GEO)
 */

export interface RailwayDivisionInfo {
  name: string;
  zone: string;
  headquarters: string;
  keyStations: string[];
  description: string;
}

export const WEST_BENGAL_GEO = {
  state: 'West Bengal',
  country: 'India',
  countryCode: 'IN',
  stateCode: 'WB',
  geoRegion: 'IN-WB',
  centroid: {
    lat: 22.5858,
    lng: 88.3426,
    placename: 'Kolkata, West Bengal, India',
  },
  railwayZones: [
    {
      code: 'ER',
      name: 'Eastern Railway',
      hq: 'Fairlie Place, Kolkata',
      divisions: ['Howrah (HWH)', 'Sealdah (SDAH)', 'Asansol (ASN)', 'Malda (MLDT)'],
    },
    {
      code: 'SER',
      name: 'South Eastern Railway',
      hq: 'Garden Reach, Kolkata',
      divisions: ['Kharagpur (KGP)', 'Adra (ADRA)', 'Chakradharpur (CKP)', 'Ranchi (RNC)'],
    },
    {
      code: 'NFR',
      name: 'Northeast Frontier Railway',
      hq: 'Maligaon, Guwahati',
      divisions: ['Katihar (KIR)', 'Alipurduar (APDJ)'],
    },
    {
      code: 'METRO',
      name: 'Metro Railway Kolkata',
      hq: 'Metro Rail Bhavan, Park Street, Kolkata',
      lines: [
        'Blue Line (Dakshineswar - Kavi Subhash)',
        'Green Line (Howrah Maidan - Salt Lake Sector V - Underwater)',
        'Purple Line (Joka - Majerhat)',
        'Orange Line (Kavi Subhash - Hemanta Mukhopadhyay)',
        'Yellow Line (Noapara - NSCBI Airport - under construction)',
      ],
    },
  ],
  divisions: {
    Howrah: {
      zone: 'Eastern Railway (ER)',
      headquarters: 'Howrah Junction (HWH)',
      description: 'Main suburban artery serving Hooghly, Howrah, Purba Bardhaman, and connecting to Katwa and Bolpur.',
      coverage: 'Howrah, Bally, Serampore, Chandannagar, Chinsurah, Bandel, Adisaptagram, Mogra, Barddhaman, Katwa',
    },
    Sealdah: {
      zone: 'Eastern Railway (ER)',
      headquarters: 'Sealdah (SDAH)',
      description: 'One of the busiest commuter rail terminals in the world, bifurcated into North (Ranaghat/Krishnanagar/Bongaon) and South (Canning/Diamond Harbour/Namkhana/Budge Budge) sections.',
      coverage: 'Kolkata, North 24 Parganas, South 24 Parganas, Nadia, Murshidabad',
    },
    Kharagpur: {
      zone: 'South Eastern Railway (SER)',
      headquarters: 'Kharagpur Junction (KGP)',
      description: 'Major South Eastern railway gateway connecting Kolkata to Medinipur, Digha, Haldia, Purulia, and southern India.',
      coverage: 'Paschim Medinipur, Purba Medinipur, Jhargram, Howrah South',
    },
    Asansol: {
      zone: 'Eastern Railway (ER)',
      headquarters: 'Asansol Junction (ASN)',
      description: 'Industrial and coal-belt rail hub connecting Durgapur, Raniganj, Andal, and Chittaranjan.',
      coverage: 'Paschim Bardhaman, Birbhum, Purulia',
    },
    Malda: {
      zone: 'Eastern Railway (ER)',
      headquarters: 'Malda Town (MLDT)',
      description: 'Northern gateway of Eastern Railway linking South Bengal to North Bengal, Murshidabad, and Bihar.',
      coverage: 'Malda, Murshidabad, Uttar Dinajpur',
    },
  } as Record<string, { zone: string; headquarters: string; description: string; coverage: string }>,
  majorCorridors: [
    {
      name: 'Howrah - Bandel Main Line Suburban Corridor',
      slug: 'howrah-to-bandel',
      travelTime: '50-60 mins',
      fare: '₹10 - ₹15',
      frequency: 'Every 10-15 mins during peak hours',
    },
    {
      name: 'Kolkata Underwater Metro (Green Line)',
      slug: 'howrah-maidan-to-salt-lake-sector-v',
      travelTime: '27 mins',
      fare: '₹10 - ₹30',
      frequency: 'Every 8-12 mins',
    },
    {
      name: 'Howrah - Barddhaman Main & Chord Line',
      slug: 'howrah-to-barddhaman',
      travelTime: '1h 45m (Chord) / 2h 10m (Main)',
      fare: '₹20 - ₹25',
      frequency: 'Every 20-30 mins',
    },
    {
      name: 'Sealdah - Ranaghat - Krishnanagar City Corridor',
      slug: 'sealdah-to-ranaghat',
      travelTime: '1h 35m',
      fare: '₹15 - ₹20',
      frequency: 'Every 15-25 mins',
    },
  ],
};
