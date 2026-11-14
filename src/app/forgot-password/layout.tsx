import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = constructMetadata({
  title: 'Forgot Password - Loondasol Security',
  description: 'Request a one-time verification code to reset your Loondasol account password securely.',
  pathname: '/forgot-password',
  noIndex: true,
});

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
