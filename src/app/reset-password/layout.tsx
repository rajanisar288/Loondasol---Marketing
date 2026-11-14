import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = constructMetadata({
  title: 'Set New Password - Loondasol Security',
  description: 'Set a new password for your Loondasol corporate account.',
  pathname: '/reset-password',
  noIndex: true,
});

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
