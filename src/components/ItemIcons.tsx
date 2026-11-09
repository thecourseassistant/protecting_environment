import React from 'react';

interface ItemIconProps {
  type: string;
  className?: string;
  size?: number;
}

export const ItemIcon: React.FC<ItemIconProps> = ({ type, className = '', size = 48 }) => {
  switch (type) {
    case 'computer':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Monitor body */}
          <rect x="10" y="8" width="44" height="34" rx="4" fill="#E2E8F0" stroke="#334155" strokeWidth="2.5" />
          {/* Glass Screen */}
          <rect x="14" y="12" width="36" height="24" rx="2" fill="#0EA5E9" />
          {/* Screen glare reflection */}
          <path d="M16 14L32 14L20 34L16 34Z" fill="white" fillOpacity="0.35" />
          {/* Stand */}
          <path d="M28 42H36V48H28V42Z" fill="#94A3B8" stroke="#334155" strokeWidth="2" />
          <path d="M20 48H44V52H20V48Z" rx="1" fill="#64748B" stroke="#334155" strokeWidth="2" />
          {/* Keyboard hint */}
          <rect x="12" y="53" width="40" height="5" rx="1.5" fill="#CBD5E1" stroke="#334155" strokeWidth="1.5" />
          {/* Circuit / chip sticker */}
          <circle cx="44" cy="18" r="2" fill="#22C55E" />
        </svg>
      );

    case 'tv':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Antennas */}
          <line x1="22" y1="6" x2="30" y2="16" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="42" y1="6" x2="34" y2="16" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="22" cy="6" r="2" fill="#E2E8F0" />
          <circle cx="42" cy="6" r="2" fill="#E2E8F0" />
          {/* TV Chassis (Plastic/Wood) */}
          <rect x="8" y="16" width="48" height="38" rx="6" fill="#78350F" stroke="#451A03" strokeWidth="2.5" />
          {/* Glass CRT Screen */}
          <rect x="13" y="21" width="30" height="28" rx="4" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
          <path d="M15 23L27 23L17 47L15 47Z" fill="white" fillOpacity="0.4" />
          {/* Control panel & knobs (Metal/plastic) */}
          <rect x="46" y="21" width="7" height="28" rx="2" fill="#D97706" />
          <circle cx="49.5" cy="26" r="2.2" fill="#E2E8F0" stroke="#475569" strokeWidth="1" />
          <circle cx="49.5" cy="33" r="2.2" fill="#E2E8F0" stroke="#475569" strokeWidth="1" />
          <rect x="48" y="40" width="3" height="7" fill="#451A03" />
          {/* Legs */}
          <path d="M14 54L10 60" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M50 54L54 60" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'bottle':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Bottle cap */}
          <rect x="27" y="6" width="10" height="6" rx="1.5" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
          {/* Bottle neck */}
          <rect x="29" y="12" width="6" height="8" fill="#A7F3D0" fillOpacity="0.85" stroke="#059669" strokeWidth="1.5" />
          {/* Bottle body */}
          <path
            d="M29 20C24 24 21 28 21 34V52C21 55 23 57 26 57H38C41 57 43 55 43 52V34C43 28 40 24 35 20Z"
            fill="#34D399"
            fillOpacity="0.8"
            stroke="#059669"
            strokeWidth="2"
          />
          {/* Label */}
          <rect x="21" y="34" width="22" height="12" fill="#F8FAFC" fillOpacity="0.9" stroke="#059669" strokeWidth="1" />
          {/* Water level waves */}
          <path d="M23 48Q28 46 32 48Q36 50 41 48" stroke="#0284C7" strokeWidth="1.5" fill="none" />
          {/* Glare */}
          <path d="M24 26L27 23V54H24Z" fill="white" fillOpacity="0.45" />
        </svg>
      );

    case 'jar':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Jar metal screw lid */}
          <rect x="20" y="8" width="24" height="8" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
          <line x1="24" y1="11" x2="40" y2="11" stroke="#FDE68A" strokeWidth="1.5" />
          {/* Glass rim */}
          <rect x="22" y="16" width="20" height="4" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
          {/* Glass jar container */}
          <rect x="16" y="20" width="32" height="38" rx="7" fill="#BAE6FD" fillOpacity="0.75" stroke="#0284C7" strokeWidth="2.5" />
          {/* Preserves / Jam content inside */}
          <rect x="19" y="30" width="26" height="24" rx="4" fill="#E11D48" fillOpacity="0.8" />
          {/* Jar Paper Label */}
          <rect x="20" y="33" width="24" height="14" rx="2" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
          <line x1="24" y1="38" x2="40" y2="38" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="26" y1="42" x2="38" y2="42" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
          {/* Glass reflection */}
          <path d="M19 23L22 23V53H19Z" fill="white" fillOpacity="0.6" />
        </svg>
      );

    case 'aluminum_foil':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Cardboard tube interior */}
          <ellipse cx="14" cy="32" rx="4" ry="14" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
          {/* Rolled metallic foil cylinder */}
          <path
            d="M14 18H50C54 18 57 24 57 32C57 40 54 46 50 46H14C10 46 7 40 7 32C7 24 10 18 14 18Z"
            fill="url(#foilGradient)"
            stroke="#64748B"
            strokeWidth="2"
          />
          {/* Metallic unrolled sheet corner */}
          <path
            d="M36 44L48 56L60 48L50 38"
            fill="#E2E8F0"
            stroke="#94A3B8"
            strokeWidth="2"
          />
          {/* Crumpled facet lines */}
          <line x1="20" y1="22" x2="24" y2="42" stroke="white" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="32" y1="20" x2="36" y2="44" stroke="#475569" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="42" y1="22" x2="45" y2="42" stroke="white" strokeWidth="1.5" strokeOpacity="0.8" />
          <defs>
            <linearGradient id="foilGradient" x1="14" y1="18" x2="14" y2="46" gradientUnits="userSpaceOnUse">
              <stop stopColor="#CBD5E1" />
              <stop offset="0.3" stopColor="#FFFFFF" />
              <stop offset="0.6" stopColor="#94A3B8" />
              <stop offset="0.8" stopColor="#F1F5F9" />
              <stop offset="1" stopColor="#64748B" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'milk_carton':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Carton top crease */}
          <path d="M22 6H42V12H22V6Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
          {/* Gable top slope */}
          <path d="M22 12L16 22H48L42 12H22Z" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="2" />
          {/* Carton rectangular body */}
          <rect x="16" y="22" width="32" height="36" rx="2" fill="#F8FAFC" stroke="#1E40AF" strokeWidth="2.5" />
          {/* Blue band & "MILK" text representation */}
          <rect x="16" y="32" width="32" height="14" fill="#2563EB" />
          <path d="M22 36H24L26 40L28 36H30V42H28V39L26 42H26L24 39V42H22V36Z" fill="white" />
          <circle cx="36" cy="39" r="3" fill="#FBBF24" />
          {/* Strawberry or cow spot */}
          <path d="M20 50Q24 47 28 50Q32 54 28 56Q22 56 20 50Z" fill="#93C5FD" />
        </svg>
      );

    case 'tin_can':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Top lid rim */}
          <ellipse cx="32" cy="14" rx="16" ry="6" fill="#CBD5E1" stroke="#475569" strokeWidth="2" />
          {/* Ring pull tab */}
          <circle cx="32" cy="14" r="2.5" fill="#64748B" />
          <path d="M32 14L38 12" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
          {/* Can Cylinder body */}
          <path
            d="M16 14V46C16 49.3 23.2 52 32 52C40.8 52 48 49.3 48 46V14"
            fill="#E2E8F0"
            stroke="#475569"
            strokeWidth="2"
          />
          {/* Corrugated ribs */}
          <line x1="16" y1="24" x2="48" y2="24" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="16" y1="28" x2="48" y2="28" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="16" y1="36" x2="48" y2="36" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="16" y1="40" x2="48" y2="40" stroke="#94A3B8" strokeWidth="1.5" />
          {/* Paper label wrap */}
          <rect x="17" y="29" width="30" height="6" fill="#EF4444" />
          {/* Metallic highlight */}
          <line x1="22" y1="16" x2="22" y2="48" stroke="white" strokeWidth="2" strokeOpacity="0.7" />
        </svg>
      );

    case 'cereal_box':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Cardboard 3D side edge */}
          <path d="M46 12L52 8V48L46 54V12Z" fill="#B45309" stroke="#78350F" strokeWidth="2" />
          {/* Front box face */}
          <rect x="12" y="12" width="34" height="44" rx="2" fill="#F59E0B" stroke="#78350F" strokeWidth="2.5" />
          {/* Cereal bowl graphic */}
          <path d="M18 38H40C40 46 18 46 18 38Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
          {/* Cereal flakes / spoon */}
          <circle cx="25" cy="34" r="2.5" fill="#FDE68A" />
          <circle cx="31" cy="33" r="2.5" fill="#FDE68A" />
          <circle cx="36" cy="35" r="2" fill="#FDE68A" />
          <line x1="36" y1="28" x2="43" y2="38" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
          {/* Cardboard box top flaps */}
          <path d="M12 12L18 8H40L46 12" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
          {/* Cereal logo title representation */}
          <rect x="16" y="18" width="26" height="8" rx="2" fill="#DC2626" />
          <line x1="20" y1="22" x2="38" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'magazine':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Magazine pages depth */}
          <rect x="16" y="14" width="34" height="42" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
          {/* Cover page */}
          <rect x="13" y="10" width="35" height="44" rx="2" fill="#EC4899" stroke="#9D174D" strokeWidth="2" />
          {/* Masthead title */}
          <rect x="17" y="14" width="27" height="6" fill="#FDE047" />
          <line x1="19" y1="17" x2="41" y2="17" stroke="#1E293B" strokeWidth="1.5" />
          {/* Photo illustration placeholder */}
          <rect x="17" y="23" width="27" height="16" rx="1.5" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
          <circle cx="23" cy="28" r="2.5" fill="#FBBF24" />
          {/* Headline text lines */}
          <line x1="17" y1="43" x2="38" y2="43" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="17" y1="48" x2="32" y2="48" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          {/* Barcode hint */}
          <rect x="36" y="47" width="8" height="4" fill="white" />
        </svg>
      );

    case 'bag':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Bag handles */}
          <path
            d="M22 24V14C22 10 26 8 30 8H34C38 8 42 10 42 14V24"
            stroke="#10B981"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Plastic shopping bag body */}
          <path
            d="M17 24L14 52C13.5 56 16.5 58 20 58H44C47.5 58 50.5 56 50 52L47 24H17Z"
            fill="#34D399"
            fillOpacity="0.85"
            stroke="#059669"
            strokeWidth="2.5"
          />
          {/* Creases & folds of plastic */}
          <path d="M22 28L24 50" stroke="#047857" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
          <path d="M42 28L40 50" stroke="#047857" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
          {/* Recycling logo on bag */}
          <circle cx="32" cy="38" r="6" fill="white" fillOpacity="0.4" stroke="#047857" strokeWidth="1.5" />
          <path d="M30 36L34 36L32 40Z" fill="#047857" />
        </svg>
      );

    default:
      return (
        <div
          style={{ width: size, height: size }}
          className={`rounded-lg bg-sky-700/60 border border-sky-400 flex items-center justify-center ${className}`}
        >
          <span className="text-xs font-bold uppercase text-white">{type.slice(0, 3)}</span>
        </div>
      );
  }
};
