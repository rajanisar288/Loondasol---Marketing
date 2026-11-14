export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  isDevelopment: boolean;
  workspaceDevUrl: string;
  workspaceProdUrl: string;
  apiUrl: string;
  links: {
    twitter: string;
    github: string;
    linkedin: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
}

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd && process.env.NEXT_PUBLIC_IS_DEVELOPMENT === 'true';

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
const defaultProdUrl = 'https://www.loondasol.com';
const resolvedUrl = isDev 
  ? (configuredUrl && !configuredUrl.includes('loondasol.com') ? configuredUrl : 'http://localhost:3000')
  : (configuredUrl && !configuredUrl.includes('localhost') ? configuredUrl : defaultProdUrl);

export const siteConfig: SiteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Loondasol',
  description: 'Enterprise AI-Powered Company Operations, Attendance, Payroll & Workforce Management Platform.',
  url: resolvedUrl,
  isDevelopment: isDev,
  workspaceDevUrl: process.env.NEXT_PUBLIC_WORKSPACE_DEV_URL || 'http://localhost:4200',
  workspaceProdUrl: process.env.NEXT_PUBLIC_WORKSPACE_PROD_URL || 'https://workspace.loondasol.com',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || (isProd ? 'https://workspace.loondasol.com/api/v1' : 'http://localhost:4000/api/v1'),
  links: {
    twitter: 'https://twitter.com/loondasol',
    github: 'https://github.com/loondasol',
    linkedin: 'https://linkedin.com/company/loondasol',
  },
  contact: {
    email: 'support@loondasol.com',
    phone: '+1 (800) 555-LOON',
    address: '100 Innovation Way, Suite 400, San Francisco, CA 94105',
  },
};

// getWorkspaceUrl: resolves the proper destination workspace URL depending on environment
export function getWorkspaceUrl(path = '/'): string {
  const baseUrl = siteConfig.isDevelopment ? siteConfig.workspaceDevUrl : siteConfig.workspaceProdUrl;
  const cleanPath = path === '' || path === '/' ? '' : (path.startsWith('/') ? path : `/${path}`);
  return `${baseUrl}${cleanPath}`;
}

// getApiUrl: resolves API endpoint URL
export function getApiUrl(path = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.apiUrl}${cleanPath}`;
}
