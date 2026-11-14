'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { navigationConfig } from '@/config/navigation';
import { Container } from '@/components/ui/container';
import { BrandLogo } from '@/components/ui/brand-logo';

export function Footer() {
  const pathname = usePathname();
  const currentYear = 2026;

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
    <footer className="bg-[#263746] text-[#edf4f7] border-t border-[#344653]">
      <Container size="wide" className="py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Company Bio */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="dark" size="lg" />
            <p className="text-sm text-[#edf4f7]/80 max-w-sm leading-relaxed">
              Unified enterprise operating system delivering region-isolated workforce operations, 
              biometric attendance compliance, cross-border payroll, and AI co-pilot capabilities.
            </p>
            <div className="pt-2 text-xs text-[#82b8ce]">
              Enterprise HQ: {siteConfig.contact.address}
            </div>
          </div>

          {/* Solution Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#82b8ce]">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-sm">
              {navigationConfig.solutionNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#edf4f7]/80 hover:text-white transition">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#82b8ce]">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              {navigationConfig.companyNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#edf4f7]/80 hover:text-white transition">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Compliance & Legal */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#82b8ce]">
              Legal & Trust
            </h4>
            <ul className="space-y-2.5 text-sm">
              {navigationConfig.legalNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#edf4f7]/80 hover:text-white transition">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#344653]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#edf4f7]/60">
          <p>© {currentYear} {siteConfig.name}, Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/why-choose-us" className="hover:text-white transition">Security Architecture</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
