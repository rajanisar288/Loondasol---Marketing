import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'soft' | 'graphite' | 'outline';
  className?: string;
}

export function Badge({ children, variant = 'soft', className = '' }: BadgeProps) {
  const variantClasses = {
    primary: 'bg-[#367fa5] text-white',
    soft: 'bg-[#edf4f7] text-[#367fa5] border border-[#dbe7ec]',
    graphite: 'bg-[#263746] text-white',
    outline: 'border border-[#82b8ce] text-[#263746] bg-white',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
}
