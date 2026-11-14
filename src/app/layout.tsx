import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { JsonLd } from '@/components/seo/json-ld';
import { getOrganizationSchema, getWebSiteSchema } from '@/lib/seo/structured-data';
import { constructMetadata } from '@/lib/seo/metadata';
import './globals.css';

export const metadata: Metadata = constructMetadata({
  title: 'Loondasol - Enterprise Cloud Workforce & Operations Platform',
  description:
    'Modern multi-tenant workforce management platform. Real-time biometric attendance, automated multi-region payroll, AI co-pilot, and enterprise role governance.',
  pathname: '/',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/mainlogo.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <JsonLd data={getOrganizationSchema()} />
        <JsonLd data={getWebSiteSchema()} />
      </head>
      <body className="flex flex-col min-h-screen bg-[#edf4f7] text-[#344653] antialiased">
        <Suspense fallback={<div className="h-20 bg-white border-b border-[#dbe7ec]" />}>
          <Header />
        </Suspense>
        <main className="flex-1 flex flex-col">{children}</main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
