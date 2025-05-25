"use client";

import Link from 'next/link';
import { BackgroundGradient } from './background-gradient';
import { cn } from '@/lib/utils';

interface GradientButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export function GradientButton({ 
  href, 
  children, 
  className,
  variant = 'primary'
}: GradientButtonProps) {
  if (variant === 'secondary') {
    return (
      <Link
        href={href}
        className={cn(
          "inline-flex items-center px-8 py-4 bg-card text-card-foreground border border-border rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-accent hover:scale-105 shadow-sm hover:shadow-md",
          className
        )}
      >
        {children}
      </Link>
    );
  }

  return (
    <BackgroundGradient className="rounded-xl">
      <Link
        href={href}
        className={cn(
          "inline-flex items-center px-8 py-4 bg-card text-card-foreground rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105",
          className
        )}
      >
        {children}
      </Link>
    </BackgroundGradient>
  );
} 