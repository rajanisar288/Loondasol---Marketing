import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';
import { getSoftwareApplicationSchema } from '@/lib/seo/structured-data';
import { JsonLd } from '@/components/seo/json-ld';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';

export const metadata: Metadata = constructMetadata({
  title: 'Loondasol - Next-Generation Enterprise Workforce Operating System',
  description:
    'Unify global attendance, regional compliance, automated payroll, task tracking, and AI workplace intelligence into one secure multi-tenant platform.',
  pathname: '/',
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={getSoftwareApplicationSchema()} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32 bg-gradient-to-b from-[#ffffff] via-[#edf4f7] to-[#edf4f7]">
        <Container size="default" className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#edf4f7] text-[#367fa5] border border-[#dbe7ec] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#367fa5] animate-pulse" />
            <span>Loondasol 2.0 Released: Real-time Multi-Region Sharding</span>
          </div>

          <Heading
            level={1}
            align="center"
            subtitle="The all-in-one cloud workspace built for modern enterprises. Biometric time tracking, multi-region payroll processing, dynamic role governance, and AI workplace assistants."
          >
            The Operating System for Modern Global Workforces
          </Heading>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button href="/signup" variant="primary" size="lg">
              Start Free Trial
            </Button>
            <Button href="/pricing" variant="outline" size="lg">
              View Flexible Plans ($3 / User)
            </Button>
          </div>

          {/* Value Highlights Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto text-left">
            <div className="bg-white p-5 rounded-[8px] border border-[#dbe7ec] shadow-xs">
              <span className="text-2xl font-bold text-[#367fa5] block mb-1">99.99%</span>
              <span className="text-xs font-semibold text-[#263746] block uppercase tracking-wider">Uptime SLA</span>
              <span className="text-xs text-[#344653]/80">Regional sharded fault-tolerance</span>
            </div>
            <div className="bg-white p-5 rounded-[8px] border border-[#dbe7ec] shadow-xs">
              <span className="text-2xl font-bold text-[#367fa5] block mb-1">5+ Regions</span>
              <span className="text-xs font-semibold text-[#263746] block uppercase tracking-wider">Data Residency</span>
              <span className="text-xs text-[#344653]/80">US, EU, UAE, PK, &amp; IND compliance</span>
            </div>
            <div className="bg-white p-5 rounded-[8px] border border-[#dbe7ec] shadow-xs">
              <span className="text-2xl font-bold text-[#367fa5] block mb-1">Real-time</span>
              <span className="text-xs font-semibold text-[#263746] block uppercase tracking-wider">AI Co-Pilot</span>
              <span className="text-xs text-[#344653]/80">Summaries, reports &amp; query automation</span>
            </div>
            <div className="bg-white p-5 rounded-[8px] border border-[#dbe7ec] shadow-xs">
              <span className="text-2xl font-bold text-[#367fa5] block mb-1">$3 / mo</span>
              <span className="text-xs font-semibold text-[#263746] block uppercase tracking-wider">Predictable</span>
              <span className="text-xs text-[#344653]/80">Transparent per-seat pricing</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Core Capabilities Section */}
      <Section id="features" bg="surface">
        <div className="space-y-16">
          <Heading
            level={2}
            align="center"
            badge="Enterprise Capabilities"
            subtitle="Engineered from the ground up for high-growth companies that require strict data sovereignty, fast response times, and granular access control."
          >
            Everything Needed to Run High-Performing Teams
          </Heading>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[8px] bg-[#edf4f7] border border-[#dbe7ec] space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-[#263746] text-white flex items-center justify-center font-bold text-xl">
                ⏱️
              </div>
              <h3 className="text-xl font-bold text-[#263746]">
                Attendance &amp; Biometric Tracking
              </h3>
              <p className="text-sm text-[#344653]/90 leading-relaxed">
                Automated clock-in/out, GPS geofencing, IP whitelisting, and strict off-hours login restriction. Eliminates time fraud and syncs directly into payroll.
              </p>
              <Link href="/services#attendance" className="inline-flex items-center text-xs font-semibold text-[#367fa5] hover:underline">
                Explore Attendance Engine →
              </Link>
            </div>

            <div className="p-8 rounded-[8px] bg-[#edf4f7] border border-[#dbe7ec] space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-[#367fa5] text-white flex items-center justify-center font-bold text-xl">
                💵
              </div>
              <h3 className="text-xl font-bold text-[#263746]">
                Automated Multi-Region Payroll
              </h3>
              <p className="text-sm text-[#344653]/90 leading-relaxed">
                One-click payroll disbursement compliant with local tax laws, currency conversions, overtime bonuses, and automated payslip generation.
              </p>
              <Link href="/services#payroll" className="inline-flex items-center text-xs font-semibold text-[#367fa5] hover:underline">
                Explore Payroll Automation →
              </Link>
            </div>

            <div className="p-8 rounded-[8px] bg-[#edf4f7] border border-[#dbe7ec] space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-[#82b8ce] text-[#263746] flex items-center justify-center font-bold text-xl">
                🤖
              </div>
              <h3 className="text-xl font-bold text-[#263746]">
                AI Workforce Intelligence
              </h3>
              <p className="text-sm text-[#344653]/90 leading-relaxed">
                Generative AI co-pilot assists employees with task breakdown, generates automated sprint reviews, writes reports, and answers internal company knowledge queries.
              </p>
              <Link href="/services#ai" className="inline-flex items-center text-xs font-semibold text-[#367fa5] hover:underline">
                Explore AI Co-Pilot →
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Interactive Sitelinks Direct Navigation Section (Optimized for Google Crawlers) */}
      <Section bg="default">
        <div className="space-y-12">
          <Heading
            level={2}
            align="center"
            badge="Website Directory"
            subtitle="Explore our comprehensive resource hub, product guides, and enterprise documentation."
          >
            Quick Access &amp; Core Navigation
          </Heading>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/services"
              className="p-6 rounded-[8px] bg-white border border-[#dbe7ec] hover:border-[#367fa5] transition shadow-xs group block"
            >
              <span className="text-xs font-semibold text-[#367fa5] uppercase tracking-wider block mb-1">
                Directory / 01
              </span>
              <h4 className="text-lg font-bold text-[#263746] group-hover:text-[#367fa5] transition">
                Our Services &amp; Products
              </h4>
              <p className="text-xs text-[#344653]/80 mt-2 leading-relaxed">
                Full technical specification of attendance, payroll, task boards, and regional sharding.
              </p>
            </Link>

            <Link
              href="/pricing"
              className="p-6 rounded-[8px] bg-white border border-[#dbe7ec] hover:border-[#367fa5] transition shadow-xs group block"
            >
              <span className="text-xs font-semibold text-[#367fa5] uppercase tracking-wider block mb-1">
                Directory / 02
              </span>
              <h4 className="text-lg font-bold text-[#263746] group-hover:text-[#367fa5] transition">
                Transparent Pricing
              </h4>
              <p className="text-xs text-[#344653]/80 mt-2 leading-relaxed">
                Review Starter ($3), Growth Pro ($5), and Enterprise ($8) tiers with our live seat calculator.
              </p>
            </Link>

            <Link
              href="/why-choose-us"
              className="p-6 rounded-[8px] bg-white border border-[#dbe7ec] hover:border-[#367fa5] transition shadow-xs group block"
            >
              <span className="text-xs font-semibold text-[#367fa5] uppercase tracking-wider block mb-1">
                Directory / 03
              </span>
              <h4 className="text-lg font-bold text-[#263746] group-hover:text-[#367fa5] transition">
                Why Choose Loondasol
              </h4>
              <p className="text-xs text-[#344653]/80 mt-2 leading-relaxed">
                Comparison matrix against legacy software, data sovereignty guarantees, and speed benchmarks.
              </p>
            </Link>

            <Link
              href="/about"
              className="p-6 rounded-[8px] bg-white border border-[#dbe7ec] hover:border-[#367fa5] transition shadow-xs group block"
            >
              <span className="text-xs font-semibold text-[#367fa5] uppercase tracking-wider block mb-1">
                Directory / 04
              </span>
              <h4 className="text-lg font-bold text-[#263746] group-hover:text-[#367fa5] transition">
                About Our Company
              </h4>
              <p className="text-xs text-[#344653]/80 mt-2 leading-relaxed">
                Meet the engineering leadership team and read our mission to empower global workplaces.
              </p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section bg="graphite">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Streamline Your Company Operations?
          </h2>
          <p className="text-base text-[#edf4f7]/80 leading-relaxed">
            Deploy your dedicated company workspace in under 60 seconds with instant multi-region compliance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Button href="/signup" variant="primary" size="lg">
              Launch Workspace Now
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              Talk to an Enterprise Specialist
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
