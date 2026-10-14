import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bangla Rail - West Bengal Local Train & Kolkata Metro Timetable',
    short_name: 'Bangla Rail',
    description: 'Instant local train schedules and Kolkata Metro timetables across all 556 West Bengal railway stations.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F5EE',
    theme_color: '#18181B',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
