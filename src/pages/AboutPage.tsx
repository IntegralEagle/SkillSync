import { Link } from 'react-router-dom';
import { ArrowRight, GitGraph, Sparkles, CalendarClock, Brain, Database, RefreshCw, Target } from 'lucide-react';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { WEIGHTS } from '@/lib/matching';

const PILLARS = [
  { icon: GitGraph, title: 'Skill Compatibility', desc: 'We compare each candidate\'s skills against your project\'s required skills and score the overlap.' },
  { icon: Sparkles, title: 'Interest Alignment', desc: 'Shared interests and domain alignment surface people who actually care about the problem.' },
  { icon: CalendarClock, title: 'Availability Check', desc: 'Realistic time commitments matter. We check whether a candidate can meet your project\'s hours.' },
  { icon: Brain, title: 'Explainable Matching', desc: 'Every score comes with a plain-language explanation of why the candidate ranked where they did.' },
];

export function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="animate-fade-in text-center">
        <Badge variant="accent" className="mb-4">
          <Target className="h-3.5 w-3.5" /> About SkillSync
        </Badge>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Matching built on data, not connections</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
          SkillSync helps people form effective project teams by analyzing skills, interests,
          availability, and experience — then explaining exactly why each candidate is a fit.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {PILLARS.map((p) => (
          <Card key={p.title} hover className="animate-fade-up">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/20">
              <p.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">{p.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{p.desc}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-8 animate-fade-up">
        <h2 className="text-lg font-semibold text-white">The scoring model</h2>
        <p className="mt-2 text-sm text-slate-400">
          Each candidate receives a weighted score across four factors. The weights reflect what matters
          most for forming a balanced, effective team.
        </p>
        <div className="mt-5 space-y-3">
          {[
            { l: 'Skills', w: WEIGHTS.skill, c: 'bg-brand-500' },
            { l: 'Availability', w: WEIGHTS.availability, c: 'bg-accent-500' },
            { l: 'Interests', w: WEIGHTS.interest, c: 'bg-success-500' },
            { l: 'Experience', w: WEIGHTS.experience, c: 'bg-warning-500' },
          ].map((s) => (
            <div key={s.l}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-200">{s.l}</span>
                <span className="font-semibold text-white">{Math.round(s.w * 100)}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                <div className={`h-full rounded-full ${s.c}`} style={{ width: `${s.w * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-lg bg-bg-elevated p-4 font-mono text-xs text-slate-300">
          finalScore = skill×0.45 + availability×0.20 + interest×0.20 + experience×0.15
        </div>
      </Card>

      <Card className="mt-8 animate-fade-up">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Database className="h-4 w-4 text-brand-300" /> How data is stored
        </div>
        <p className="mt-2 text-sm text-slate-400">
          Profiles, projects, and your selected team are saved in your browser's local storage, so your
          data persists across refreshes. No account or backend is required.
        </p>
        <div className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-300">
          <RefreshCw className="h-4 w-4 text-accent-400" /> Reset demo data
        </div>
        <p className="mt-2 text-sm text-slate-400">
          You can reset the app to its original demo state at any time from the button in the top of the
          Talent Pool or by clearing your browser storage.
        </p>
      </Card>

      <div className="mt-10 text-center">
        <Link to="/create" className="btn-primary">
          Start matching <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
