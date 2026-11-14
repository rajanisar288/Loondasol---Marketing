import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/services',
    '/pricing',
    '/why-choose-us',
    '/about',
    '/blog',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/login',
    '/signup',
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: '2026-11-14T00:00:00.000Z',
    changeFrequency: route === '' || route === '/pricing' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/pricing' || route === '/services' ? 0.9 : 0.8,
  }));
}
