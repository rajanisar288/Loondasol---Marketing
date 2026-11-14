import React from 'react';
import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbSchema } from '@/lib/seo/structured-data';
import { JsonLd } from '@/components/seo/json-ld';
import { Section } from '@/components/ui/section';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = constructMetadata({
  title: 'Enterprise Services & Modules - Loondasol Suite',
  description:
    'Comprehensive overview of Loondasol capabilities: Biometric Attendance, Automated Cross-Border Payroll, Task Management, AI Analytics, and Multi-Region Database Sharding.',
  pathname: '/services',
});

const services = [
  {
    id: 'attendance',
    title: 'Biometric Attendance & Geofenced Time Clock',
    tag: 'HR & Compliance',
    description:
      'Eliminate buddy punching and maintain ironclad audit logs. Supports hardware biometric integration, web-based geo-fenced check-ins, IP whitelisting, and strict off-hours login restriction.',
    features: [
      'Configurable late grace periods (minutes or hours)',
      'Break duration calculation and shift rotations',
      'Automated leave balance decrementing',
      'Strict off-hours access enforcement',
    ],
  },
  {
    id: 'payroll',
    title: 'Automated Multi-Currency Payroll Engine',
    tag: 'Finance & Operations',
    description:
      'Run end-to-end payroll across regional subsidiaries with automatic tax deductions, overtime calculations, allowances, and compliant digital payslip delivery.',
    features: [
      'Multi-currency disbursement (USD, EUR, AED, PKR, INR)',
      'Automated bank account validation and IBAN checks',
      'One-click salary approvals and clearance workflows',
      'Exportable financial audits and tax reconciliation reports',
    ],
  },
  {
    id: 'ai',
    title: 'Enterprise AI Co-Pilot & Natural Language Queries',
    tag: 'Productivity & Intelligence',
    description:
      'Built-in secure AI copilot with per-company request quota enforcement (1,000 requests on Starter, 5,000 on Growth Pro, Unlimited on Enterprise).',
    features: [
      'Sprint review summarization and task generation',
      'Automated policy and handbook search',
      'Executive dashboard metrics synthesis',
      'Zero-data-leakage architecture across tenant shards',
    ],
  },
  {
    id: 'security',
    title: 'Role-Based Access Control & Regional Database Sharding',
    tag: 'Infrastructure & Governance',
    description:
      'Store tenant records strictly within local jurisdiction legal boundaries (USA, EU GDPR, UAE, South Asia) while preserving global reporting for leadership.',
    features: [
      'Fine-grained role creation with 40+ granular permissions',
      'Independent MongoDB shard instances per region',
      'Production-ready Kafka event stream for zero dropped notices',
      'Immutable audit logging for super-admin compliance',
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: 'Home', item: '/' },
          { name: 'Services', item: '/services' },
        ])}
      />

      <section className="py-20 bg-gradient-to-b from-white to-[#edf4f7]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <Heading
            level={1}
            align="center"
            badge="Solutions & Architecture"
            subtitle="Explore how Loondasol streamlines company administration, employee self-service, financial reconciliation, and data privacy."
          >
            Built for Scale, Speed, and Compliance
          </Heading>
        </div>
      </section>

      <Section bg="surface">
        <div className="space-y-16 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <div
              key={service.id}
              id={service.id}
              className={`p-8 sm:p-10 rounded-[8px] bg-white border border-[#dbe7ec] shadow-sm flex flex-col md:flex-row gap-8 items-start ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="flex-1 space-y-4">
                <span className="text-xs font-semibold text-[#367fa5] uppercase tracking-wider block">
                  {service.tag}
                </span>
                <h2 className="text-2xl font-bold text-[#263746]">{service.title}</h2>
                <p className="text-sm text-[#344653]/90 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2 pt-2">
                  {service.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5 text-xs text-[#263746] font-medium">
                      <span className="w-4 h-4 rounded-full bg-[#367fa5]/10 text-[#367fa5] flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full md:w-72 p-6 rounded-[8px] bg-[#edf4f7] border border-[#dbe7ec] flex flex-col justify-between self-stretch">
                <div>
                  <span className="text-xs font-semibold text-[#263746] block uppercase tracking-wider mb-2">
                    Module Availability
                  </span>
                  <p className="text-xs text-[#344653]/80">
                    Included with all standard Loondasol tenant licenses. Configurable per role.
                  </p>
                </div>
                <div className="pt-6">
                  <Button href="/signup" variant="primary" size="sm" className="w-full">
                    Deploy Solution
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
