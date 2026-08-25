import { cn } from '@/lib/utils';

interface ScoreBarProps {
  label: string;
  value: number;
  max: number;
  color?: string;
}

export function ScoreBar({ label, value, max, color = 'bg-brand-500' }: ScoreBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-xs font-medium text-slate-400">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
        <div
          className={cn('h-full rounded-full transition-all duration-500', color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-12 shrink-0 text-right text-xs font-semibold text-slate-300">
        {Math.round(value)}/{max}
      </span>
    </div>
  );
}
