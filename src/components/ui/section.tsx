import React from 'react';
import { Container } from './container';

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  containerSize?: 'default' | 'narrow' | 'wide';
  bg?: 'default' | 'surface' | 'graphite' | 'soft';
}

export function Section({
  children,
  id,
  className = '',
  containerSize = 'default',
  bg = 'default',
}: SectionProps) {
  const bgClasses = {
    default: 'bg-[#edf4f7]',
    surface: 'bg-[#ffffff] border-y border-[#dbe7ec]',
    graphite: 'bg-[#263746] text-white',
    soft: 'bg-gradient-to-b from-[#edf4f7] to-[#ffffff]',
  }[bg];

  return (
    <section id={id} className={`py-16 sm:py-20 lg:py-24 ${bgClasses} ${className}`}>
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}
