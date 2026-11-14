'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigationConfig } from '@/config/navigation';
import { siteConfig, getWorkspaceUrl } from '@/config/site';
import { useAuthStatus } from '@/hooks/use-auth-status';
import { Container } from '@/components/ui/container';
import { BrandLogo } from '@/components/ui/brand-logo';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isLoggedIn, isLoading } = useAuthStatus();

  const isAuthPage =
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/register' ||
    pathname === '/invite' ||
    pathname === '/accept-invitation' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password';

  if (isAuthPage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#ffffff]/90 backdrop-blur-md border-b border-[#dbe7ec] transition-colors">
      <Container size="wide">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <BrandLogo size="md" subtitle="Enterprise Cloud Ops" priority />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
            {navigationConfig.mainNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 text-sm font-medium rounded-[8px] transition-colors ${
                    isActive
                      ? 'text-[#367fa5] bg-[#edf4f7] font-semibold'
                      : 'text-[#344653] hover:text-[#263746] hover:bg-[#edf4f7]/70'
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* CTA & Workspace Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {!isLoading && isLoggedIn ? (
              <a
                href={getWorkspaceUrl('/dashboard')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-[8px] bg-[#367fa5] text-white hover:bg-[#2b6585] shadow-sm transition"
              >
                <span>Go to Workspace</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-[#263746] hover:text-[#367fa5] transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-[8px] bg-[#367fa5] text-white hover:bg-[#2b6585] shadow-sm transition"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 text-[#263746] hover:bg-[#edf4f7] rounded-[8px]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#dbe7ec] flex flex-col gap-2 bg-[#ffffff]">
            {navigationConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm font-medium rounded-[8px] ${
                  pathname === item.href
                    ? 'text-[#367fa5] bg-[#edf4f7] font-semibold'
                    : 'text-[#344653] hover:bg-[#edf4f7]'
                }`}
              >
                {item.title}
              </Link>
            ))}
            <div className="pt-4 border-t border-[#dbe7ec] flex flex-col gap-2">
              {isLoggedIn ? (
                <a
                  href={getWorkspaceUrl('/dashboard')}
                  className="w-full text-center py-2.5 px-4 text-sm font-semibold rounded-[8px] bg-[#367fa5] text-white"
                >
                  Go to Workspace
                </a>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-sm font-semibold text-[#263746] border border-[#dbe7ec] rounded-[8px]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 text-sm font-semibold rounded-[8px] bg-[#367fa5] text-white"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
