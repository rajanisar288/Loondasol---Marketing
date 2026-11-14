import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = constructMetadata({
  title: 'Create Your Workspace - 14-Day Free Trial',
  description: 'Create your Loondasol organization workspace in minutes. Set up regional branches, biometric timekeeping, role hierarchies, and cloud payroll.',
  pathname: '/signup',
});

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
