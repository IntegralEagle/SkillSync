import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'brand' | 'accent' | 'success' | 'warning' | 'error';
  className?: string;
}

const variants = {
  default: 'bg-white/5 text-slate-300 border border-white/10',
  brand: 'bg-brand-500/15 text-brand-300 border border-brand-500/30',
  accent: 'bg-accent-500/15 text-accent-400 border border-accent-500/30',
  success: 'bg-success-500/15 text-success-400 border border-success-500/30',
  warning: 'bg-warning-500/15 text-warning-400 border border-warning-500/30',
  error: 'bg-error-500/15 text-error-400 border border-error-500/30',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return <span className={cn('chip', variants[variant], className)}>{children}</span>;
}
