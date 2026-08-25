import { cn } from '@/lib/utils';

interface AvatarProps {
  name: string;
  id: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-14 w-14 text-base',
};

export function Avatar({ name, id, size = 'md', className }: AvatarProps) {
  const gradient = avatarGradientForId(id);
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-always-white ring-1 ring-white/10',
        gradient,
        sizeClasses[size],
        className,
      )}
    >
      {initialsOf(name)}
    </div>
  );
}

function initialsOf(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('');
}

function avatarGradientForId(id: string): string {
  const colors = [
    'from-brand-500 to-accent-500',
    'from-accent-500 to-brand-400',
    'from-brand-400 to-brand-600',
    'from-success-500 to-accent-500',
    'from-brand-600 to-brand-400',
    'from-accent-400 to-brand-500',
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return colors[hash % colors.length];
}
