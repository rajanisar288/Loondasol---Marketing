import React from 'react';
import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbSchema } from '@/lib/seo/structured-data';
import { JsonLd } from '@/components/seo/json-ld';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Heading } from '@/components/ui/heading';

export const metadata: Metadata = constructMetadata({
  title: 'Privacy Policy - Loondasol Data Protection',
  description:
    'Comprehensive privacy commitments, regional database residency disclosures, and GDPR compliance policies governing the Loondasol enterprise platform.',
  pathname: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: 'Home', item: '/' },
          { name: 'Privacy Policy', item: '/privacy-policy' },
        ])}
      />

      <section className="py-16 bg-gradient-to-b from-white to-[#edf4f7]">
        <Container size="narrow" className="text-center space-y-4">
          <Heading
            level={1}
            align="center"
            badge="Legal &amp; Trust"
            subtitle="Last updated: November 2026. Review our commitment to customer data sovereignty and biometric privacy."
          >
            Privacy Policy
          </Heading>
        </Container>
      </section>

      <Section bg="surface">
        <Container size="narrow">
          <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-[#344653]/90">
            <div>
              <h2 className="text-xl font-bold text-[#263746]">1. Overview &amp; Data Residency</h2>
              <p>
                Loondasol (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) provides an enterprise-grade workforce operating system. We understand the sensitivity of employee attendance records, biometric timestamps, salary compensation figures, and corporate documents.
              </p>
              <p>
                Unlike legacy systems that pool all multinational tenant data into a singular centralized database, Loondasol provides <strong>sovereign regional database sharding</strong>. Customers choose their designated residency region (such as USA, European Union, United Arab Emirates, Pakistan, or India) upon registration, and employee records remain strictly housed on regional infrastructure located within that jurisdiction.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#263746]">2. Biometric &amp; Attendance Data</h2>
              <p>
                When employers enable biometric or geofenced clock-in modules, Loondasol processes cryptographic mathematical representations of biometric templates or localized IP/GPS coordinates solely to verify shift attendance. We do not sell or monetize personal data under any circumstances.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#263746]">3. AI Co-Pilot Data Isolation</h2>
              <p>
                Queries, task summaries, or report requests submitted to the Loondasol AI Co-Pilot are executed inside isolated tenant contexts. Proprietary company information is never used to train public foundational AI models.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#263746]">4. Contact Our Data Protection Officer</h2>
              <p>
                For GDPR data subject requests, localized data export requests, or security audits, contact our compliance team at <strong>privacy@loondasol.com</strong>.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
