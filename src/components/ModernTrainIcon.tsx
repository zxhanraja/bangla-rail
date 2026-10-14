import React from 'react';

interface ModernTrainIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

/**
 * Modern Aerodynamic Train Engine Icon matching Where Is My Train / Transit UI
 * Features aerodynamic front nose, slanted driver cabin, windows, wheels & rail track.
 */
export function ModernTrainIcon({ className = 'w-6 h-6 text-slate-400', size = 24, ...props }: ModernTrainIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Train Locomotive Body with aerodynamic sloping nose */}
      <path d="M4 20V10a3 3 0 0 1 3-3h11.5c3.2 0 6 1.8 7.5 4.6l2 3.6c.7 1.3 1 2.8 1 4.3V20a1 1 0 0 1-1 1H4" />

      {/* Slanted Driver Window */}
      <path d="M19 10h2.2c1.4 0 2.6.8 3.3 2l1.5 2.5a1.5 1.5 0 0 1 .2.8V16h-7.2V10z" strokeWidth="1.8" />

      {/* Passenger Cabin Windows */}
      <rect x="7" y="10" width="4.5" height="6" rx="1" strokeWidth="1.8" />
      <rect x="13" y="10" width="4.5" height="6" rx="1" strokeWidth="1.8" />

      {/* Wheels */}
      <circle cx="9" cy="24" r="1.8" fill="currentColor" />
      <circle cx="21" cy="24" r="1.8" fill="currentColor" />

      {/* Railway Track Line */}
      <line x1="2" y1="26" x2="30" y2="26" strokeWidth="2.2" />
    </svg>
  );
}

export default ModernTrainIcon;
