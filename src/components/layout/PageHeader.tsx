import { ReactNode } from 'react';
import logoWordmarkWhite from '@/assets/logo-wordmark-white.png';

interface PageHeaderProps {
  eyebrow?: ReactNode;
  title: string;
  subtitle?: ReactNode;
  children?: ReactNode;
  /** When true, removes the negative bottom space so content can sit flush */
  flush?: boolean;
}

/**
 * Curved Deep Blue arched page header (Headspace-inspired, Re-Rooted brand).
 * Pages render this at the very top, then place body content inside a
 * `<div className="max-w-2xl mx-auto px-6 -mt-10 relative">` to overlap the curve.
 */
export const PageHeader = ({
  eyebrow,
  title,
  subtitle,
  children,
}: PageHeaderProps) => (
  <header className="relative bg-primary text-primary-foreground overflow-hidden rounded-b-[3rem] px-6 pt-10 pb-16 lg:pt-14 lg:pb-20">
    <div
      aria-hidden
      className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[180%] h-72 rounded-[50%] bg-primary-foreground/[0.04]"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[140%] h-72 rounded-[50%] bg-primary-foreground/[0.06]"
    />
    <div className="relative max-w-2xl mx-auto">
      {eyebrow !== false && (
        <div className="mb-3">
          {eyebrow || (
            <img
              src={logoWordmarkWhite}
              alt="Re-Rooted®"
              className="h-6 w-auto object-contain opacity-80"
            />
          )}
        </div>
      )}
      <h1 className="text-4xl md:text-5xl font-[900] tracking-tight leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-base text-primary-foreground/80">{subtitle}</p>
      )}
      {children}
    </div>
  </header>
);

export default PageHeader;
