import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbSchema } from '@/lib/seo/structured-data';
import { JsonLd } from '@/components/seo/json-ld';
import { Section } from '@/components/ui/section';
import { Heading } from '@/components/ui/heading';

export const metadata: Metadata = constructMetadata({
  title: 'Engineering & Workforce Insights - Loondasol Blog',
  description:
    'Deep dives on multi-tenant architecture, regional database sharding, automated payroll compliance, and workforce AI from the Loondasol engineering team.',
  pathname: '/blog',
});

const articles = [
  {
    slug: 'scaling-multi-region-mongodb-sharding',
    title: 'Scaling Multi-Tenant Workforces with Regional MongoDB Shards',
    excerpt: 'How we achieve strict data residency across US, EU, and Middle East jurisdictions with zero application code duplication.',
    date: 'November 2026',
    author: 'Platform Architecture Team',
    category: 'Architecture',
  },
  {
    slug: 'integrating-kafka-for-mission-critical-hrms',
    title: 'Zero-Dropped Events: Why We Integrated Production Kafka for HRMS',
    excerpt: 'Replacing fragile HTTP webhook patterns with persistent Kafka topic streams for payroll disbursements and compliance notifications.',
    date: 'October 2026',
    author: 'Reliability Engineering',
    category: 'DevOps & Reliability',
  },
  {
    slug: 'enterprise-ai-copilot-without-data-leakage',
    title: 'Deploying AI Co-Pilots in Enterprise Workspaces Without Data Leakage',
    excerpt: 'Designing tenant-isolated vector boundaries and strict monthly token quota controls across corporate organizations.',
    date: 'October 2026',
    author: 'AI Applied Research',
    category: 'AI Engineering',
  },
];

export default function BlogPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: 'Home', item: '/' },
          { name: 'Blog', item: '/blog' },
        ])}
      />

      <section className="py-20 bg-gradient-to-b from-white to-[#edf4f7]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <Heading
            level={1}
            align="center"
            badge="Engineering &amp; Insights"
            subtitle="Technical articles, compliance breakdowns, and platform architectural updates."
          >
            The Loondasol Engineering Blog
          </Heading>
        </div>
      </section>

      <Section bg="surface">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="grid grid-cols-1 gap-6">
            {articles.map((post) => (
              <article
                key={post.slug}
                className="p-8 rounded-[8px] bg-white border border-[#dbe7ec] hover:border-[#367fa5] transition shadow-xs space-y-4 group"
              >
                <div className="flex items-center gap-3 text-xs">
                  <span className="px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider bg-[#edf4f7] text-[#367fa5]">
                    {post.category}
                  </span>
                  <span className="text-[#344653]/60">•</span>
                  <span className="text-[#344653]/70">{post.date}</span>
                  <span className="text-[#344653]/60">•</span>
                  <span className="text-[#344653]/70">By {post.author}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-[#263746] group-hover:text-[#367fa5] transition">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-sm text-[#344653]/90 leading-relaxed">
                  {post.excerpt}
                </p>

                <div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-xs font-semibold text-[#367fa5] hover:underline"
                  >
                    Read Technical Breakdown →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
