import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = constructMetadata({
  title: 'Employee Invitation - Loondasol',
  description: 'Join your organization workspace on Loondasol.',
  pathname: '/invite',
  noIndex: true,
});

export default function InviteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
