import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbSchema } from '@/lib/seo/structured-data';
import { JsonLd } from '@/components/seo/json-ld';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';

interface BlogPostParams {
  params: Promise<{
    slug: string;
  }>;
}

const postsData: Record<
  string,
  {
    title: string;
    description: string;
    date: string;
    category: string;
    author: string;
    content: string[];
  }
> = {
  'scaling-multi-region-mongodb-sharding': {
    title: 'Scaling Multi-Tenant Workforces with Regional MongoDB Shards',
    description:
      'How Loondasol achieved strict geographic data residency and sub-50ms query responses by sharding databases across regional boundaries.',
    date: 'November 2026',
    category: 'Architecture',
    author: 'Platform Architecture Team',
    content: [
      'Modern enterprise corporations cannot treat data as a single homogenous global store. With jurisdictions enforcing strict sovereign data retention laws (such as GDPR in Europe and localized compliance mandates in the Middle East and South Asia), architecture must isolate regional workloads by design.',
      'In Loondasol, every tenant is provisioned with a regional residency shard pointer upon workspace registration. The master connection gateway dynamically switches MongoDB connection pools at the middleware layer based on the company’s selected sovereign territory.',
      'This guarantees that biometric logs, payroll bank account details, and employee identity documents never cross sovereign borders without explicit customer authorization.',
    ],
  },
  'integrating-kafka-for-mission-critical-hrms': {
    title: 'Zero-Dropped Events: Why We Integrated Production Kafka for HRMS',
    description:
      'Replacing synchronous webhook models with high-throughput persistent Kafka topic streams for payroll disbursements and compliance alerts.',
    date: 'October 2026',
    category: 'DevOps & Reliability',
    author: 'Reliability Engineering',
    content: [
      'In a high-concurrency workforce management application, missing a salary approval notice, an employee clock-out event, or an invitation dispatch is unacceptable.',
      'Traditional architectures rely on synchronous HTTP calls or transient in-memory queues that can lose events during server redeployments or container restarts.',
      'By baking KafkaJS event publishing directly into our NestJS micro-kernel, events are guaranteed persistence across topic partitions with resilient fallback capabilities.',
    ],
  },
  'enterprise-ai-copilot-without-data-leakage': {
    title: 'Deploying AI Co-Pilots in Enterprise Workspaces Without Data Leakage',
    description:
      'Designing tenant-isolated vector boundaries and strict monthly token quota controls across corporate organizations.',
    date: 'October 2026',
    category: 'AI Engineering',
    author: 'AI Applied Research',
    content: [
      'Deploying generative AI within corporate workforce tools introduces a fundamental challenge: ensuring proprietary tenant documentation never bleeds into other organizations.',
      'Loondasol implements a hard isolation boundary around every prompt. Contextual vector queries are strictly scoped to the calling company ID, and AI request meters enforce per-plan monthly quota ceilings with automatic calendar-month refreshes.',
    ],
  },
};

export async function generateMetadata({ params }: BlogPostParams): Promise<Metadata> {
  const { slug } = await params;
  const post = postsData[slug];

  if (!post) {
    return constructMetadata({
      title: 'Article Not Found',
      description: 'The requested blog post was not found.',
      pathname: `/blog/${slug}`,
    });
  }

  return constructMetadata({
    title: `${post.title} | Loondasol Engineering Blog`,
    description: post.description,
    pathname: `/blog/${slug}`,
    type: 'article',
    authors: [post.author],
  });
}

export default async function BlogPostPage({ params }: BlogPostParams) {
  const { slug } = await params;
  const post = postsData[slug];

  if (!post) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: 'Home', item: '/' },
          { name: 'Blog', item: '/blog' },
          { name: post.title, item: `/blog/${slug}` },
        ])}
      />

      <article className="py-20 bg-gradient-to-b from-white to-[#edf4f7]">
        <Container size="narrow" className="space-y-6">
          <div className="space-y-3 text-center">
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#edf4f7] text-[#367fa5] border border-[#dbe7ec]">
              {post.category}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#263746] tracking-tight leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-3 text-xs text-[#344653]/80 pt-2">
              <span>{post.date}</span>
              <span>•</span>
              <span>Written by {post.author}</span>
            </div>
          </div>
        </Container>
      </article>

      <Section bg="surface">
        <Container size="narrow" className="space-y-8">
          <div className="space-y-6 text-base text-[#344653]/90 leading-relaxed">
            {post.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="pt-8 border-t border-[#dbe7ec] flex items-center justify-between">
            <Link
              href="/blog"
              className="text-xs font-semibold text-[#367fa5] hover:underline"
            >
              ← Back to all articles
            </Link>
            <Button href="/signup" variant="primary" size="sm">
              Deploy Loondasol
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
