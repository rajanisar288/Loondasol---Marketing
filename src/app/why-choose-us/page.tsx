import React from 'react';
import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbSchema } from '@/lib/seo/structured-data';
import { JsonLd } from '@/components/seo/json-ld';
import { Section } from '@/components/ui/section';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = constructMetadata({
  title: 'Why Choose Loondasol - Performance, Privacy & Compliance',
  description:
    'Compare Loondasol against traditional legacy HR suites. Regional database sharding, zero data-leakage AI, production Kafka streaming, and modern UX.',
  pathname: '/why-choose-us',
});

const comparisonData = [
  {
    feature: 'Data Sovereignty & Sharding',
    loondasol: 'Dedicated regional MongoDB shards (US, EU, UAE, PK, IND)',
    legacy: 'Single shared monolithic database with no regional isolation',
  },
  {
    feature: 'Asynchronous Event Pipeline',
    loondasol: 'Production-ready Kafka event stream with zero lost notifications',
    legacy: 'Synchronous blocking HTTP calls prone to timeouts & email failure',
  },
  {
    feature: 'AI Co-Pilot Integration',
    loondasol: 'Native tenant-isolated generative AI with quota meters',
    legacy: 'Requires expensive third-party external add-on integrations',
  },
  {
    feature: 'Pricing Model',
    loondasol: '$3 - $8 / user per month with incremental seat expansion',
    legacy: 'Rigid annual lock-in contracts with steep hidden implementation fees',
  },
  {
    feature: 'Biometric Attendance & Clock',
    loondasol: 'Geofenced web punch, IP lock, break tracking & shift rota',
    legacy: 'Manual time sheets or proprietary legacy punch clock hardware',
  },
];

export default function WhyChooseUsPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: 'Home', item: '/' },
          { name: 'Why Choose Us', item: '/why-choose-us' },
        ])}
      />

      <section className="py-20 bg-gradient-to-b from-white to-[#edf4f7]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <Heading
            level={1}
            align="center"
            badge="Engineering Excellence"
            subtitle="Why international enterprises and fast-growing organizations choose Loondasol over fragmented, legacy workforce systems."
          >
            Architected for the Modern Distributed Era
          </Heading>
        </div>
      </section>

      <Section bg="surface">
        <div className="max-w-5xl mx-auto space-y-12">
          <Heading
            level={2}
            align="center"
            subtitle="A side-by-side comparison of technical architecture and operational predictability."
          >
            Loondasol vs. Traditional HR Suites
          </Heading>

          <div className="overflow-x-auto rounded-[8px] border border-[#dbe7ec] shadow-sm bg-white">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#263746] text-white">
                <tr>
                  <th className="py-4 px-6 font-semibold">Architectural Capability</th>
                  <th className="py-4 px-6 font-semibold bg-[#367fa5]">Loondasol Enterprise</th>
                  <th className="py-4 px-6 font-semibold text-[#edf4f7]/70">Legacy HRMS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dbe7ec]">
                {comparisonData.map((row) => (
                  <tr key={row.feature} className="hover:bg-[#edf4f7]/50 transition">
                    <td className="py-4 px-6 font-bold text-[#263746]">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 text-[#263746] bg-[#edf4f7]/30 font-medium">
                      <span className="text-[#367fa5] mr-1.5 font-bold">✓</span>
                      {row.loondasol}
                    </td>
                    <td className="py-4 px-6 text-[#344653]/70">
                      <span className="text-red-500 mr-1.5 font-bold">✕</span>
                      {row.legacy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center pt-8">
            <Button href="/signup" variant="primary" size="lg">
              Experience the Loondasol Difference
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
