import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconClassName?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
}

/**
 * SkillSync logo — two interlocking nodes representing skills syncing together.
 */
export function Logo({ className, iconClassName, showWordmark = true, wordmarkClassName }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoIcon className={iconClassName} />
      {showWordmark && (
        <span className={cn('font-display text-lg font-bold text-always-white', wordmarkClassName)}>
          SkillSync
        </span>
      )}
    </span>
  );
}

export function LogoIcon({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-glow',
        className,
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" aria-hidden="true">
        <path
          d="M9 12.5L14.5 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="7" cy="15" r="3" fill="currentColor" />
        <circle cx="16.5" cy="6.5" r="3" fill="currentColor" />
        <path
          d="M9.5 14.5L14 17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
