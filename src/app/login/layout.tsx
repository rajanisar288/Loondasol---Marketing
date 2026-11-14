import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = constructMetadata({
  title: 'Sign In to Workspace',
  description: 'Sign in to your Loondasol organization workspace. Access attendance, multi-region payroll, shift management, and team governance.',
  pathname: '/login',
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
