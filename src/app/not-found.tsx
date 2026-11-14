import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-24 sm:py-32">
      <Container size="narrow" className="text-center space-y-6">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#edf4f7] text-[#367fa5] border border-[#dbe7ec]">
          404 Not Found
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#263746]">
          Page does not exist
        </h1>
        <p className="text-base sm:text-lg text-[#344653]/80 max-w-md mx-auto">
          The page you are looking for has been moved or does not exist. Explore our solutions or return to the home page.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button href="/" variant="primary">
            Return to Home
          </Button>
          <Button href="/services" variant="outline">
            Browse Solutions
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default NotFound;
