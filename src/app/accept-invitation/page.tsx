'use client';

import React, { Suspense } from 'react';
import { AuthSplitLayout } from '@/features/auth/auth-split-layout';
import { InvitationOnboardingForm } from '@/features/auth/invitation-onboarding-form';

export default function AcceptInvitationPage() {
  return (
    <AuthSplitLayout
      title="Accept Workspace Invitation"
      subtitle="Configure your employee credentials and enter your team workspace."
      footerPrompt="Already have your credentials?"
      footerLinkText="Sign in"
      footerLinkHref="/login"
    >
      <Suspense fallback={<div className="h-48 flex items-center justify-center text-xs text-slate-400">Verifying invitation credentials...</div>}>
        <InvitationOnboardingForm />
      </Suspense>
    </AuthSplitLayout>
  );
}