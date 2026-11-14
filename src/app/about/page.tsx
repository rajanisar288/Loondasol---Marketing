import React from 'react';
import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbSchema } from '@/lib/seo/structured-data';
import { JsonLd } from '@/components/seo/json-ld';
import { Section } from '@/components/ui/section';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = constructMetadata({
  title: 'About Loondasol - Our Mission & Leadership',
  description:
    'Learn about Loondasol mission to transform global company administration with privacy-first infrastructure, regional data residency, and real-time AI.',
  pathname: '/about',
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: 'Home', item: '/' },
          { name: 'About Us', item: '/about' },
        ])}
      />

      <section className="py-20 bg-gradient-to-b from-white to-[#edf4f7]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <Heading
            level={1}
            align="center"
            badge="About Loondasol"
            subtitle="We are on a mission to free global organizations from fragmented administrative tooling and sovereign compliance headaches."
          >
            Empowering Modern Workforces Worldwide
          </Heading>
        </div>
      </section>

      <Section bg="surface">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="prose prose-slate max-w-none space-y-6 text-[#344653]/90 text-sm sm:text-base leading-relaxed">
            <h2 className="text-2xl font-bold text-[#263746]">Our Story</h2>
            <p>
              Loondasol was created by experienced distributed systems and enterprise software engineers who experienced the friction of managing international teams across differing regulatory requirements. 
            </p>
            <p>
              Traditional HR platforms were built two decades ago as static database front-ends. They do not comprehend modern asynchronous work, multi-region data residency laws (such as GDPR or local Middle Eastern hosting rules), or the productivity leverage offered by modern AI models.
            </p>
            <p>
              We designed Loondasol with an uncompromised multi-tenant modular monolith architecture: isolated MongoDB regional shards, distributed Redis caches, a production Kafka event stream, and real-time WebSocket communication.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            <div className="p-6 rounded-[8px] bg-[#edf4f7] border border-[#dbe7ec] text-center space-y-2">
              <span className="text-3xl font-extrabold text-[#367fa5]">100%</span>
              <span className="text-xs font-bold text-[#263746] block uppercase tracking-wider">Data Sovereignty</span>
              <span className="text-xs text-[#344653]/80 block">Local storage for each jurisdiction</span>
            </div>
            <div className="p-6 rounded-[8px] bg-[#edf4f7] border border-[#dbe7ec] text-center space-y-2">
              <span className="text-3xl font-extrabold text-[#367fa5]">Zero-Loss</span>
              <span className="text-xs font-bold text-[#263746] block uppercase tracking-wider">Event Reliability</span>
              <span className="text-xs text-[#344653]/80 block">Kafka event-driven streaming</span>
            </div>
            <div className="p-6 rounded-[8px] bg-[#edf4f7] border border-[#dbe7ec] text-center space-y-2">
              <span className="text-3xl font-extrabold text-[#367fa5]">Sub-100ms</span>
              <span className="text-xs font-bold text-[#263746] block uppercase tracking-wider">Workspace Latency</span>
              <span className="text-xs text-[#344653]/80 block">Optimized Angular client runtime</span>
            </div>
          </div>

          <div className="p-8 rounded-[8px] bg-[#263746] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold">Want to see Loondasol in action?</h3>
              <p className="text-xs text-[#edf4f7]/80">Join hundreds of forward-thinking businesses using our workspace suite.</p>
            </div>
            <Button href="/signup" variant="primary" size="md">
              Get Started Today
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
