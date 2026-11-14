'use client';

import React, { useState, useEffect } from 'react';
import { SignupSplitStepper } from '@/features/auth/signup-split-stepper';
import { AuthSplitLayout } from '@/features/auth/auth-split-layout';
import { InvitationOnboardingForm } from '@/features/auth/invitation-onboarding-form';

export default function SignupPage() {
  const [invitationToken, setInvitationToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      if (token) {
        setInvitationToken(token);
      }
    }
  }, []);

  if (isClient && invitationToken) {
    return (
      <AuthSplitLayout
        title="Accept Workspace Invitation"
        subtitle="Configure your credentials and employee details to enter the workspace."
        footerPrompt="Already have your credentials?"
        footerLinkText="Sign in"
        footerLinkHref="/login"
      >
        <InvitationOnboardingForm />
      </AuthSplitLayout>
    );
  }

  return <SignupSplitStepper />;
}