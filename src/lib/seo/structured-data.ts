import { siteConfig } from '@/config/site';

// getOrganizationSchema: returns Organization JSON-LD markup
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    legalName: 'Loondasol Inc.',
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/mainlogo.png`,
    image: `${siteConfig.url}/images/mainlogo.png`,
    description: siteConfig.description,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.contact.address,
      addressCountry: 'US',
    },
    sameAs: [
      siteConfig.links.twitter,
      siteConfig.links.github,
      siteConfig.links.linkedin,
    ],
  };
}

// getWebSiteSchema: returns WebSite JSON-LD with Sitelinks SearchBox
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    alternateName: 'Loondasol Cloud HR & Operations',
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/services?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

// getBreadcrumbSchema: builds BreadcrumbList JSON-LD
export function getBreadcrumbSchema(items: Array<{ name: string; item: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item.startsWith('http') ? item.item : `${siteConfig.url}${item.item}`,
    })),
  };
}

// getSiteNavigationSchema: informs Google Sitelinks algorithm about main site sections
export function getSiteNavigationSchema() {
  const navItems = [
    { name: 'Sign In', path: '/login', description: 'Access your Loondasol organization workspace' },
    { name: 'Create Workspace', path: '/signup', description: 'Start 14-day free trial and set up company operations' },
    { name: 'Services & Modules', path: '/services', description: 'Biometric attendance, shift tracking, and payroll modules' },
    { name: 'Pricing', path: '/pricing', description: 'Transparent per-seat pricing plans for businesses' },
    { name: 'Why Choose Us', path: '/why-choose-us', description: 'Enterprise security, regional sharding, and high availability' },
    { name: 'About Us', path: '/about', description: 'Our company mission, engineering team, and culture' },
    { name: 'Contact', path: '/contact', description: 'Get in touch with Loondasol sales and enterprise support' },
  ];

  return {
    '@context': 'https://schema.org',
    '@graph': navItems.map((item, index) => ({
      '@type': 'SiteNavigationElement',
      '@id': `${siteConfig.url}/#navigation-${index + 1}`,
      name: item.name,
      description: item.description,
      url: `${siteConfig.url}${item.path}`,
    })),
  };
}

// getSoftwareApplicationSchema: returns SoftwareApplication JSON-LD for enterprise SaaS
export function getSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Loondasol Enterprise Operations Suite',
    operatingSystem: 'All modern web browsers',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '3',
      highPrice: '8',
      offerCount: '3',
    },
  };
}
