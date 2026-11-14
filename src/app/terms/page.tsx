import React from 'react';
import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbSchema } from '@/lib/seo/structured-data';
import { JsonLd } from '@/components/seo/json-ld';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Heading } from '@/components/ui/heading';

export const metadata: Metadata = constructMetadata({
  title: 'Terms of Service - Loondasol Enterprise SaaS Agreement',
  description:
    'Terms and conditions governing the use of Loondasol workforce software, per-seat licensing, SLA guarantees, and enterprise obligations.',
  pathname: '/terms',
});

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: 'Home', item: '/' },
          { name: 'Terms of Service', item: '/terms' },
        ])}
      />

      <section className="py-16 bg-gradient-to-b from-white to-[#edf4f7]">
        <Container size="narrow" className="text-center space-y-4">
          <Heading
            level={1}
            align="center"
            badge="Customer Agreement"
            subtitle="Last updated: November 2026. Standard enterprise terms for Loondasol workspace subscribers."
          >
            Terms of Service
          </Heading>
        </Container>
      </section>

      <Section bg="surface">
        <Container size="narrow">
          <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-[#344653]/90">
            <div>
              <h2 className="text-xl font-bold text-[#263746]">1. Subscription &amp; Per-Seat Licensing</h2>
              <p>
                Access to Loondasol is billed on a per-user, monthly subscription basis. The number of billable seats corresponds to total active employee records plus the registered workspace owner.
              </p>
              <p>
                Additional seats added midway through a billing cycle are charged only for the newly added seats for the remainder of that billing cycle. Inactive or terminated employee records do not count toward billable seat utilization.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#263746]">2. Service Level Agreement (SLA)</h2>
              <p>
                Loondasol targets a 99.99% monthly availability for its core API services, employee clock-in endpoints, and regional database shards.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#263746]">3. Acceptable Use Policy</h2>
              <p>
                Customers are solely responsible for ensuring that all payroll deductions, biometric tracking rules, and working hour restrictions adhere to relevant labor laws in their operating territories.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#263746]">4. Termination &amp; Data Portability</h2>
              <p>
                Upon cancellation of a subscription, company administrators may export all employee attendance logs, payroll summaries, and audit histories via JSON or CSV formats at any time.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
