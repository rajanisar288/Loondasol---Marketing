import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface BrandLogoProps {
  /** Visual variant depending on background brightness */
  variant?: 'light' | 'dark' | 'auto';
  /** Preset size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Show the textual brand name alongside the mark */
  showText?: boolean;
  /** Whether the text should be lowercase 'loondasol' or titlecase 'Loondasol' */
  textCase?: 'title' | 'lower';
  /** Optional subtitle below the brand name */
  subtitle?: string;
  /** If true, wraps logo and name in Next.js Link */
  asLink?: boolean;
  /** Link destination (defaults to '/') */
  href?: string;
  /** Additional container classes */
  className?: string;
  /** Image priority loading */
  priority?: boolean;
}

export function BrandLogo({
  variant = 'light',
  size = 'md',
  showText = true,
  textCase = 'title',
  subtitle,
  asLink = true,
  href = '/',
  className = '',
  priority = false,
}: BrandLogoProps) {
  // Dimensions map
  const sizeMap = {
    sm: { img: 28, text: 'text-lg', sub: 'text-[9px]' },
    md: { img: 36, text: 'text-xl', sub: 'text-[10px]' },
    lg: { img: 44, text: 'text-2xl', sub: 'text-xs' },
    xl: { img: 56, text: 'text-3xl', sub: 'text-sm' },
  };

  const dim = sizeMap[size] || sizeMap.md;

  // Color tokens
  // Light variant: for white or soft ice-blue backgrounds
  // Dark variant: for graphite, navy, or slate-blue backgrounds
  const loondaClass =
    variant === 'dark'
      ? 'text-white'
      : variant === 'auto'
      ? 'text-[#012b69] dark:text-white'
      : 'text-[#012b69]';

  const solClass =
    variant === 'dark'
      ? 'text-[#3fbafc]'
      : variant === 'auto'
      ? 'text-[#0284c7] dark:text-[#3fbafc]'
      : 'text-[#0284c7]';

  const loondaText = textCase === 'lower' ? 'loonda' : 'Loonda';
  const solText = textCase === 'lower' ? 'sol' : 'sol';

  const content = (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {/* High-Resolution Brand Mark */}
      <div className="relative flex-shrink-0 transition-transform group-hover:scale-105 duration-200">
        <Image
          src="/images/mainlogo.png"
          alt="Loondasol Logo"
          width={dim.img}
          height={dim.img}
          priority={priority}
          className="object-contain drop-shadow-sm"
        />
      </div>

      {/* Brand Typography with Dual-Color Styling */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${dim.text} font-extrabold tracking-tight font-sans`}>
            <span className={loondaClass}>{loondaText}</span>
            <span className={solClass}>{solText}</span>
          </span>
          {subtitle && (
            <span
              className={`${dim.sub} mt-1 tracking-wider uppercase font-semibold ${
                variant === 'dark' ? 'text-[#82b8ce]' : 'text-[#52636f]'
              }`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
