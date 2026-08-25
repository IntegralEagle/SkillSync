import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'card p-5',
        hover && 'transition-all duration-200 hover:border-brand-500/40 hover:shadow-glow',
        className,
      )}
    >
      {children}
    </div>
  );
}
