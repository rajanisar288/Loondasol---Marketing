import React from 'react';
import { Container } from '@/components/ui/container';

export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center py-32">
      <Container size="narrow" className="flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-[#367fa5]/20 border-t-[#367fa5] rounded-full animate-spin" />
        <span className="text-xs uppercase tracking-wider font-semibold text-[#82b8ce]">
          Loading Loondasol...
        </span>
      </Container>
    </div>
  );
}
