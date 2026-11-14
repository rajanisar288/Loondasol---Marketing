import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = constructMetadata({
  title: 'Register Company Workspace - Loondasol',
  description: 'Register your company workspace on Loondasol. Scale operations with enterprise workforce management tools.',
  pathname: '/register',
});

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
