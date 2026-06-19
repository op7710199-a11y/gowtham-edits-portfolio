import type { ReactNode } from 'react';
import { useScrollReveal } from '../hooks';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'li' | 'article';
}

export function Reveal({ children, className = '', delay = 0, as = 'div' }: RevealProps) {
  const Tag = as;
  return (
    <Tag
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

export function RevealScope({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {children}
    </div>
  );
}

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  center?: boolean;
}

export function SectionHeading({ eyebrow, title, subtitle, center = true }: SectionHeadingProps) {
  return (
    <Reveal className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <span className={`eyebrow ${center ? 'justify-center' : ''}`}>
        <span className="h-px w-6 bg-gold-500/60" />
        {eyebrow}
      </span>
      <h2 className="mt-5 font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-stone-400 sm:text-lg">{subtitle}</p>
      )}
      <div className={`mt-6 h-px w-16 bg-gold-gradient ${center ? 'mx-auto' : ''}`} />
    </Reveal>
  );
}
