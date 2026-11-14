import React from 'react';
import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbSchema } from '@/lib/seo/structured-data';
import { JsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/config/site';
import { Section } from '@/components/ui/section';
import { Heading } from '@/components/ui/heading';
import { ContactForm } from '@/features/contact/contact-form';

export const metadata: Metadata = constructMetadata({
  title: 'Contact Loondasol - Enterprise Solutions & Support',
  description:
    'Connect with our enterprise solutions architects for customized demonstrations, data sovereignty guidance, or procurement questions.',
  pathname: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: 'Home', item: '/' },
          { name: 'Contact', item: '/contact' },
        ])}
      />

      <section className="py-20 bg-gradient-to-b from-white to-[#edf4f7]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <Heading
            level={1}
            align="center"
            badge="Sales &amp; Partnerships"
            subtitle="Our solution architects are ready to assist with multi-region deployment planning, data compliance analysis, and pilot provisioning."
          >
            Connect with Our Enterprise Team
          </Heading>
        </div>
      </section>

      <Section bg="surface">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-3">
            <ContactForm />
          </div>

          <div className="md:col-span-2 space-y-6 p-8 rounded-[8px] bg-[#edf4f7] border border-[#dbe7ec]">
            <div>
              <h3 className="text-lg font-bold text-[#263746]">Direct Inquiries</h3>
              <p className="text-xs text-[#344653]/80 mt-1">
                Reach our team through corporate channels.
              </p>
            </div>

            <div className="space-y-3 text-xs text-[#263746]">
              <div>
                <span className="font-semibold block uppercase tracking-wider text-[#367fa5]">
                  Corporate Headquarters
                </span>
                <span className="text-[#344653]/90">{siteConfig.contact.address}</span>
              </div>

              <div>
                <span className="font-semibold block uppercase tracking-wider text-[#367fa5]">
                  Email Support
                </span>
                <a href={`mailto:${siteConfig.contact.email}`} className="text-[#367fa5] hover:underline">
                  {siteConfig.contact.email}
                </a>
              </div>

              <div>
                <span className="font-semibold block uppercase tracking-wider text-[#367fa5]">
                  Phone Assistance
                </span>
                <span>{siteConfig.contact.phone}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#dbe7ec] text-[11px] text-[#344653]/70">
              Enterprise customer support is available 24/7/365 with 15-minute guaranteed SLA response for severity-1 tickets.
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
