import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  isExternal?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  isExternal = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-[8px] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variantClasses = {
    primary: 'bg-[#367fa5] text-white hover:bg-[#2b6585] focus-visible:outline-[#367fa5] shadow-sm',
    secondary: 'bg-[#82b8ce] text-[#263746] hover:bg-[#72a7bd] focus-visible:outline-[#82b8ce]',
    outline: 'border border-[#dbe7ec] text-[#263746] bg-white hover:bg-[#edf4f7] focus-visible:outline-[#367fa5]',
    ghost: 'text-[#344653] hover:bg-[#edf4f7] hover:text-[#263746]',
    soft: 'bg-[#edf4f7] text-[#263746] hover:bg-[#dbe7ec]',
  }[variant];

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
    md: 'text-sm px-4 py-2 h-10 gap-2',
    lg: 'text-base px-6 py-3 h-12 gap-2.5',
  }[size];

  const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;

  if (href) {
    if (isExternal || href.startsWith('http')) {
      return (
        <a href={href} className={combinedClasses} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
