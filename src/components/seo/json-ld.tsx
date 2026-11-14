import React from 'react';

interface JsonLdProps {
  data: Record<string, unknown>;
}

// JsonLd: safe script tag component for SEO structured data
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
