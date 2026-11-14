import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = constructMetadata({
  title: 'Accept Team Invitation - Loondasol',
  description: 'Join your organization workspace on Loondasol.',
  pathname: '/accept-invitation',
  noIndex: true,
});

export default function AcceptInvitationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
