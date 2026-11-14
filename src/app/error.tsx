'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex-1 flex items-center justify-center py-24">
      <Container size="narrow" className="text-center space-y-6">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
          Unexpected Error
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#263746]">
          Something went wrong
        </h1>
        <p className="text-sm text-[#344653]/80">
          {error?.message || 'An error occurred while rendering this page.'}
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Button onClick={() => reset()} variant="primary">
            Try again
          </Button>
          <Button href="/" variant="outline">
            Home
          </Button>
        </div>
      </Container>
    </div>
  );
}
