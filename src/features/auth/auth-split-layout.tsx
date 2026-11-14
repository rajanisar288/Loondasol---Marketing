'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/ui/brand-logo';

interface Testimonial {
  title: string;
  quote: string;
  author: string;
  role: string;
  initials: string;
  stat: string;
  statLabel: string;
}

const testimonials: Testimonial[] = [
  {
    title: 'Game changer for our business',
    quote:
      'The onboarding flow was effortless. We configured our entire workspace, roles, and branch office times in under ten minutes.',
    author: 'Marcus Vance',
    role: 'Co-Founder @ TechPulse',
    initials: 'MV',
    stat: '99.9%',
    statLabel: 'Platform Uptime',
  },
  {
    title: 'Scales across 14 global branches',
    quote:
      'The shard-based multi-region compliance and automated biometric reconciliation cut our payroll processing time by 80%.',
    author: 'Elena Rostova',
    role: 'VP of Operations @ Veloce Global',
    initials: 'ER',
    stat: '80%',
    statLabel: 'Time Saved',
  },
  {
    title: 'Unbeatable role governance',
    quote:
      'Granular permissions and department-level data residency gave our legal and security teams immediate confidence.',
    author: 'David Chen',
    role: 'Chief Security Officer @ NexusFlow',
    initials: 'DC',
    stat: 'SOC 2',
    statLabel: 'Certified Cloud',
  },
  {
    title: 'AI co-pilot revolutionized staffing',
    quote:
      'Predictive shift planning and Kafka-driven instant event delivery ensure zero missed shifts across all enterprise facilities.',
    author: 'Amira Al-Mansoor',
    role: 'Head of People @ Horizon Retail',
    initials: 'AA',
    stat: '10x',
    statLabel: 'Efficiency Boost',
  },
];

interface AuthSplitLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footerPrompt?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
}

export function AuthSplitLayout({
  title,
  subtitle,
  children,
  footerPrompt = "Don't have a company account?",
  footerLinkText = 'Create workspace',
  footerLinkHref = '/signup',
}: AuthSplitLayoutProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeTestimonial = testimonials[currentSlide];

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gradient-to-b from-[#243444] via-[#2d4052] to-[#40586f] text-[#344653] font-sans antialiased overflow-x-hidden">
      {/* Left Form Panel */}
      <div className="w-full md:w-1/2 bg-[#edf4f7] md:rounded-r-[40px] lg:rounded-r-[48px] shadow-2xl z-10 flex flex-col justify-between px-8 sm:px-12 md:px-12 lg:px-16 xl:px-20 py-10 lg:py-14 min-h-screen">
        <div className="w-full max-w-[560px] my-auto py-4">
          {/* Top Brand Logo */}
          <BrandLogo size="lg" />

          {/* Heading */}
          <div className="mt-8 sm:mt-10 mb-7">
            <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-[#1c2c3a]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-xs text-[#52636f] leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Body */}
          {children}

          {/* Divider and Footer Link */}
          {footerLinkHref && (
            <div className="pt-6">
              <div className="border-t border-[#cbd5e1]/80 w-full mb-5" />
              <p className="text-center text-xs text-[#52636f]">
                {footerPrompt}{' '}
                <Link
                  href={footerLinkHref}
                  className="font-semibold text-[#1c2c3a] hover:text-[#367fa5] transition"
                >
                  {footerLinkText}
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Footer Copyright */}
        <div className="pt-4 text-[11px] text-[#788894]">
          © 2026 Loondasol Inc. All rights reserved.
        </div>
      </div>

      {/* Right Hero & Testimonial Panel */}
      <div className="w-full md:w-1/2 flex flex-col justify-between px-8 sm:px-12 md:px-12 lg:px-16 xl:px-20 py-10 lg:py-14 min-h-screen">
        <div className="w-full max-w-[560px] my-auto py-4">
          {/* Main Headline */}
          <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-white tracking-tight leading-[1.18]">
            Streamline Your Business <br />
            Operations
          </h2>

          {/* Subtitle */}
          <p className="mt-3.5 text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-md">
            Manage regional branches, multi-tenant departments, shifts, and team permissions seamlessly from a unified cloud dashboard.
          </p>

          {/* Testimonial Card */}
          <div className="mt-8 rounded-2xl bg-[#395066]/55 border border-white/20 backdrop-blur-md p-6 sm:p-7 shadow-xl text-left transition-all">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-white font-semibold text-sm sm:text-base">
                {activeTestimonial.title}
              </h3>
              <div className="flex items-center text-amber-400 text-xs tracking-widest" aria-label="5 stars">
                ★★★★★
              </div>
            </div>

            <p className="mt-2.5 text-xs sm:text-sm text-slate-200/90 leading-relaxed">
              {activeTestimonial.quote}
            </p>

            <div className="border-t border-white/15 my-4" />

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 border border-white/20 text-white font-medium text-xs flex items-center justify-center">
                  {activeTestimonial.initials}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-white leading-tight">
                    {activeTestimonial.author}
                  </div>
                  <div className="text-[11px] text-slate-300 leading-tight mt-0.5">
                    {activeTestimonial.role}
                  </div>
                </div>
              </div>

              <div className="px-2.5 py-1 rounded bg-white/10 border border-white/15 text-center">
                <div className="text-[10px] sm:text-[11px] font-bold text-white leading-tight">
                  {activeTestimonial.stat}
                </div>
                <div className="text-[8px] sm:text-[9px] text-slate-300 uppercase tracking-wider leading-tight mt-0.5">
                  {activeTestimonial.statLabel}
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="mt-5 flex items-center justify-between">
            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all rounded-full ${
                    idx === currentSlide
                      ? 'w-3.5 h-1.5 bg-white'
                      : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Circular Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevSlide}
                className="w-8 h-8 rounded-full border border-white/30 text-white/70 hover:text-white hover:border-white/50 hover:bg-white/10 flex items-center justify-center transition"
                aria-label="Previous testimonial"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleNextSlide}
                className="w-8 h-8 rounded-full border border-white/30 text-white/70 hover:text-white hover:border-white/50 hover:bg-white/10 flex items-center justify-center transition"
                aria-label="Next testimonial"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal Links */}
        <div className="pt-4 flex items-center justify-end gap-2 text-[11px] text-slate-300/80">
          <Link href="/privacy-policy" className="hover:text-white transition">
            Privacy Policy
          </Link>
          <span>|</span>
          <Link href="/terms" className="hover:text-white transition">
            Terms of Service
          </Link>
          <span>|</span>
          <Link href="/why-choose-us" className="hover:text-white transition">
            Security
          </Link>
        </div>
      </div>
    </div>
  );
}