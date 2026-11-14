import React from 'react';
import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbSchema } from '@/lib/seo/structured-data';
import { JsonLd } from '@/components/seo/json-ld';
import { Section } from '@/components/ui/section';
import { Heading } from '@/components/ui/heading';
import { PricingCalculator } from '@/features/pricing/pricing-calculator';

export const metadata: Metadata = constructMetadata({
  title: 'Transparent Per-Seat Pricing - Loondasol',
  description:
    'Straightforward seat pricing: Starter at $3/user, Growth Pro at $5/user, Enterprise at $8/user. Includes AI allowances and multi-region database residency.',
  pathname: '/pricing',
});

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: 'Home', item: '/' },
          { name: 'Pricing', item: '/pricing' },
        ])}
      />

      <section className="py-20 bg-gradient-to-b from-white to-[#edf4f7]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <Heading
            level={1}
            align="center"
            badge="Simple &amp; Predictable"
            subtitle="Transparent per-user licensing modeled after Slack and Jira. Add or remove seats dynamically as your workforce expands."
          >
            Invest Only in Active Users
          </Heading>
        </div>
      </section>

      <Section bg="default">
        <PricingCalculator />
      </Section>

      {/* FAQ Section */}
      <Section bg="surface">
        <div className="max-w-4xl mx-auto space-y-12">
          <Heading
            level={2}
            align="center"
            subtitle="Common questions about our per-seat subscription billing, seat expansions, and AI limits."
          >
            Frequently Asked Questions
          </Heading>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-[8px] bg-white border border-[#dbe7ec] space-y-2">
              <h3 className="text-base font-bold text-[#263746]">
                How does seat expansion work?
              </h3>
              <p className="text-xs text-[#344653]/90 leading-relaxed">
                If you purchase 10 seats and later need 2 more, you are charged <strong>only for the 2 newly added seats</strong> ($5 × 2 = $10 on Pro). You are never re-billed for seats you already own.
              </p>
            </div>

            <div className="p-6 rounded-[8px] bg-white border border-[#dbe7ec] space-y-2">
              <h3 className="text-base font-bold text-[#263746]">
                What happens if an employee departs?
              </h3>
              <p className="text-xs text-[#344653]/90 leading-relaxed">
                Deactivating or deleting an employee immediately frees up that seat slot. You can invite a replacement team member at zero additional cost.
              </p>
            </div>

            <div className="p-6 rounded-[8px] bg-white border border-[#dbe7ec] space-y-2">
              <h3 className="text-base font-bold text-[#263746]">
                How are AI requests calculated?
              </h3>
              <p className="text-xs text-[#344653]/90 leading-relaxed">
                Every prompt, sprint summarization, or automated policy query consumes 1 request against your monthly tenant pool. Quotas automatically refresh on the first day of each calendar month.
              </p>
            </div>

            <div className="p-6 rounded-[8px] bg-white border border-[#dbe7ec] space-y-2">
              <h3 className="text-base font-bold text-[#263746]">
                Can we switch regions later?
              </h3>
              <p className="text-xs text-[#344653]/90 leading-relaxed">
                Yes. Our superadmin migration tools enable zero-downtime database shard re-allocation if your corporate entity relocates its compliance base.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
