import { LogoIcon } from '@/components/Logo';

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-bg-base/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <LogoIcon className="h-8 w-8" />
          <span className="font-display text-sm font-bold text-white">SkillSync</span>
          <span className="text-xs text-slate-500">Smart Team Matching</span>
        </div>
        <p className="text-xs text-slate-500">
          Data-driven, explainable compatibility for project teams.
        </p>
      </div>
    </footer>
  );
}
