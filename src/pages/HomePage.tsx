import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CalendarClock, GitGraph, Brain, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { WEIGHTS } from '@/lib/matching';

const FEATURES = [
  {
    icon: GitGraph,
    title: 'Skill Compatibility',
    desc: 'Compare required skills with candidate expertise.',
  },
  {
    icon: Sparkles,
    title: 'Interest Alignment',
    desc: 'Find teammates who care about the same problem and domain.',
  },
  {
    icon: CalendarClock,
    title: 'Availability Check',
    desc: 'Match people based on realistic time commitments.',
  },
  {
    icon: Brain,
    title: 'Explainable Matching',
    desc: 'Understand exactly why someone is recommended.',
  },
];

const SCORING = [
  { label: 'Skills', weight: WEIGHTS.skill, color: 'bg-brand-500' },
  { label: 'Availability', weight: WEIGHTS.availability, color: 'bg-accent-500' },
  { label: 'Interests', weight: WEIGHTS.interest, color: 'bg-success-500' },
  { label: 'Experience', weight: WEIGHTS.experience, color: 'bg-warning-500' },
];

export function HomePage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-faint [background-size:40px_40px] opacity-40" />
        <div className="absolute left-1/2 top-0 -z-10 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[120px]" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="brand" className="mb-6 animate-fade-up">
              <Sparkles className="h-3.5 w-3.5" /> SMART TEAM MATCHING
            </Badge>
            <h1 className="animate-fade-up text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl" style={{ animationDelay: '60ms' }}>
              Build your <span className="text-gradient">dream team.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-lg text-slate-400" style={{ animationDelay: '120ms' }}>
              Find the right people for your project based on skills, interests, experience, and availability.
            </p>
            <div className="mt-8 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: '180ms' }}>
              <Link to="/create" className="btn-primary w-full sm:w-auto">
                Find My Team <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/talent" className="btn-secondary w-full sm:w-auto">
                Browse Talent
              </Link>
            </div>
          </div>

          {/* Hero preview card */}
          <div className="mx-auto mt-16 max-w-4xl animate-scale-in" style={{ animationDelay: '240ms' }}>
            <Card className="overflow-hidden p-0">
              <div className="grid gap-0 sm:grid-cols-3">
                <div className="border-b border-white/5 p-5 sm:border-b-0 sm:border-r">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-always-white">SC</div>
                    <div>
                      <p className="text-sm font-semibold text-white">Sarah Chen</p>
                      <p className="text-xs text-slate-400">Full-Stack Engineer</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-end gap-1">
                    <span className="text-3xl font-bold text-success-400">92%</span>
                    <span className="mb-1 text-xs text-slate-500">match</span>
                  </div>
                </div>
                <div className="border-b border-white/5 p-5 sm:border-b-0 sm:border-r">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Why this match</p>
                  <ul className="mt-3 space-y-2 text-xs text-slate-300">
                    <li className="flex gap-2"><CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success-400" /> 4/5 required skills</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success-400" /> Strong interest alignment</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success-400" /> Availability fits requirement</li>
                  </ul>
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Score breakdown</p>
                  <div className="mt-3 space-y-2.5">
                    {[
                      { l: 'Skills', v: 40, m: 45, c: 'bg-brand-500' },
                      { l: 'Availability', v: 18, m: 20, c: 'bg-accent-500' },
                      { l: 'Interests', v: 18, m: 20, c: 'bg-success-500' },
                      { l: 'Experience', v: 15, m: 15, c: 'bg-warning-500' },
                    ].map((s) => (
                      <div key={s.l} className="flex items-center gap-2">
                        <span className="w-20 text-[11px] text-slate-400">{s.l}</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                          <div className={`h-full rounded-full ${s.c}`} style={{ width: `${(s.v / s.m) * 100}%` }} />
                        </div>
                        <span className="w-10 text-right text-[11px] font-semibold text-slate-300">{s.v}/{s.m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem statement */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xl font-medium text-slate-200 sm:text-2xl">
            "Finding the right teammates shouldn't depend on who you already know."
          </p>
          <p className="mt-4 text-slate-400">
            SkillSync evaluates skill compatibility, interest alignment, availability, and experience —
            then explains exactly why each candidate is a fit.
          </p>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Card key={f.title} hover className="animate-fade-up" >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/20">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Scoring section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="p-8 lg:p-10">
              <Badge variant="accent" className="mb-4">Scoring Model</Badge>
              <h2 className="section-title">Compatibility is calculated, not guessed.</h2>
              <p className="mt-3 text-slate-400">
                Every candidate receives a weighted score across four factors. The result is a single
                compatibility percentage you can actually trust — and every point is explainable.
              </p>
              <div className="mt-6 space-y-4">
                {SCORING.map((s) => (
                  <div key={s.label}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-200">{s.label}</span>
                      <span className="font-semibold text-white">{Math.round(s.weight * 100)}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                      <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.weight * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-white/5 bg-white/[0.02] p-8 lg:border-l lg:border-t-0 lg:p-10">
              <h3 className="text-lg font-semibold text-white">How the score is built</h3>
              <div className="mt-4 space-y-3 font-mono text-xs text-slate-300">
                <div className="rounded-lg bg-bg-elevated p-3">
                  <span className="text-slate-500">finalScore =</span>
                </div>
                <div className="rounded-lg bg-bg-elevated p-3 pl-6">
                  skillScore × <span className="text-brand-300">0.45</span> +
                </div>
                <div className="rounded-lg bg-bg-elevated p-3 pl-6">
                  availabilityScore × <span className="text-accent-400">0.20</span> +
                </div>
                <div className="rounded-lg bg-bg-elevated p-3 pl-6">
                  interestScore × <span className="text-success-400">0.20</span> +
                </div>
                <div className="rounded-lg bg-bg-elevated p-3 pl-6">
                  experienceScore × <span className="text-warning-400">0.15</span>
                </div>
              </div>
              <p className="mt-5 text-sm text-slate-400">
                Candidates are ranked from highest to lowest score, and each recommendation comes with a
                plain-language explanation of why it scored that way.
              </p>
              <Link to="/create" className="btn-primary mt-6">
                Try it now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Card>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="relative overflow-hidden p-8 text-center sm:p-12">
          <div className="absolute left-1/2 top-0 -z-10 h-72 w-96 -translate-x-1/2 rounded-full bg-brand-500/15 blur-[100px]" />
          <Sparkles className="mx-auto h-10 w-10 text-brand-300" />
          <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">Ready to find your team?</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Create a project, run the matching engine, and form a balanced team in minutes — no signup required.
          </p>
          <Link to="/create" className="btn-primary mt-6">
            Start matching <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      </section>
    </div>
  );
}
