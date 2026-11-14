import React from 'react';

interface HeadingProps {
  level?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  subtitle?: string;
  badge?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function Heading({
  level = 2,
  children,
  subtitle,
  badge,
  align = 'left',
  className = '',
}: HeadingProps) {
  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  }[align];

  const Tag = (`h${level}` as unknown) as React.ElementType;

  const sizeClasses = {
    1: 'text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#263746] leading-[1.15]',
    2: 'text-3xl sm:text-4xl font-bold tracking-tight text-[#263746]',
    3: 'text-2xl sm:text-3xl font-bold text-[#263746]',
    4: 'text-xl sm:text-2xl font-semibold text-[#263746]',
  }[level];

  return (
    <div className={`flex flex-col gap-3 max-w-3xl ${alignClass} ${className}`}>
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#edf4f7] text-[#367fa5] border border-[#dbe7ec]">
          {badge}
        </span>
      )}
      <Tag className={sizeClasses}>{children}</Tag>
      {subtitle && (
        <p className="text-base sm:text-lg text-[#344653]/90 leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}
