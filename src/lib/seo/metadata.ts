import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export interface MetadataOptions {
  title: string;
  description: string;
  pathname?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  authors?: string[];
  noIndex?: boolean;
}

// constructMetadata: builds full OpenGraph, Twitter, canonical, and robot tags
export function constructMetadata({
  title,
  description,
  pathname = '',
  image = '/og-image.jpg',
  type = 'website',
  publishedTime,
  authors,
  noIndex = false,
}: MetadataOptions): Metadata {
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const canonicalUrl = `${siteConfig.url}${cleanPath}`;
  const fullTitle = title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;
  const imageUrl = image.startsWith('http') ? image : `${siteConfig.url}${image}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/images/mainlogo.png', sizes: '512x512', type: 'image/png' },
      ],
      shortcut: ['/favicon.ico'],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      type,
      ...(publishedTime && { publishedTime }),
      ...(authors && { authors }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: '@loondasol',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    },
  };
}
