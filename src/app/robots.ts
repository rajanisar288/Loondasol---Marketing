import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/callback',
          '/forgot-password',
          '/reset-password',
          '/accept-invitation',
          '/invite',
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
