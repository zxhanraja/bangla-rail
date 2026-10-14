import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Bangla Rail — West Bengal Local Train & Kolkata Metro Timetable';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #F7F5EE 0%, #EDE8DC 50%, #E8E2D4 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(24,24,27,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(24,24,27,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Logo Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              background: '#18181B',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
            }}
          >
            🚆
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 900, color: '#18181B', letterSpacing: '-0.5px' }}>
              BANGLA RAIL
            </div>
            <div style={{ fontSize: '12px', color: '#71717A', letterSpacing: '2px', textTransform: 'uppercase' }}>
              banglarail.in
            </div>
          </div>
        </div>

        {/* Main Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '64px', fontWeight: 900, color: '#111111', lineHeight: 1.05, letterSpacing: '-2px' }}>
            West Bengal
            <br />
            Train Timetables
          </div>
          <div style={{ fontSize: '22px', color: '#52525B', fontWeight: 500 }}>
            Local EMU · Kolkata Metro · Vande Bharat · All 556 Stations
          </div>
        </div>

        {/* Stat badges */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {[
            { label: '556+ Stations', icon: '📍' },
            { label: '🌊 Underwater Metro', icon: '' },
            { label: 'Eastern & SER', icon: '🛤️' },
            { label: 'Free & Fast', icon: '⚡' },
          ].map(badge => (
            <div
              key={badge.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#18181B',
                color: 'white',
                padding: '10px 18px',
                borderRadius: '100px',
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              {badge.icon && <span>{badge.icon}</span>}
              {badge.label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
