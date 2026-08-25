import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserMinus, CheckCircle2, AlertTriangle, Search, ArrowRight,
  Target, Layers, Gauge, Sparkles,
} from 'lucide-react';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Avatar } from '@/components/Avatar';
import { ScoreRing } from '@/components/ScoreRing';
import { runMatching, weightedContribution } from '@/lib/matching';
import { AVAILABILITY_OPTIONS } from '@/data/demoData';
import { fetchProjectById } from '@/lib/db';
import type { Candidate, Project } from '@/types';

interface TeamPageProps {
  projectId: string | null;
  candidates: Candidate[];
  teamIds: string[];
  removeMember: (id: string) => void;
  setSkillFilter: (skill: string) => void;
}

export function TeamPage({ projectId, candidates, teamIds, removeMember, setSkillFilter }: TeamPageProps) {
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);

  useEffect(() => {
    if (!projectId) {
      setProject(null);
      setProjectLoading(false);
      return;
    }
    let cancelled = false;
    setProjectLoading(true);
    (async () => {
      try {
        const p = await fetchProjectById(projectId);
        if (!cancelled) {
          setProject(p);
          setProjectLoading(false);
        }
      } catch {
        if (!cancelled) {
          setProject(null);
          setProjectLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const teamMembers = useMemo(
    () => candidates.filter((c) => teamIds.includes(c.id)),
    [candidates, teamIds],
  );

  const matches = useMemo(() => {
    if (!project) return [];
    return runMatching(teamMembers, project);
  }, [teamMembers, project]);

  const teamScore = useMemo(() => {
    if (matches.length === 0) return 0;
    return Math.round(matches.reduce((sum, m) => sum + m.breakdown.total, 0) / matches.length);
  }, [matches]);

  const { covered, missing } = useMemo(() => {
    if (!project) return { covered: [] as string[], missing: [] as string[] };
    const teamSkills = new Set<string>();
    teamMembers.forEach((m) => m.skills.forEach((s) => teamSkills.add(s.toLowerCase())));
    const covered: string[] = [];
    const missing: string[] = [];
    project.requiredSkills.forEach((s) => {
      if (teamSkills.has(s.toLowerCase())) covered.push(s);
      else missing.push(s);
    });
    return { covered, missing };
  }, [teamMembers, project]);

  const gapSummary = useMemo(() => {
    if (!project) return '';
    if (missing.length === 0) {
      return 'Your team covers every required skill for this project.';
    }
    if (missing.length === project.requiredSkills.length) {
      return 'Your team has no skill overlap with the project yet. Add members from the results page.';
    }
    const strong = covered.slice(0, 3).join(', ');
    const gaps = missing.slice(0, 2).join(' and ');
    return `Your team is strong in ${strong}, but could benefit from ${gaps} expertise.`;
  }, [covered, missing, project]);

  if (projectLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-slate-400">Loading project…</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <Card className="py-16">
          <p className="text-slate-400">Create a project first to form a team.</p>
          <Button onClick={() => navigate('/create')} className="mt-6">Create Project</Button>
        </Card>
      </div>
    );
  }

  const availLabel = AVAILABILITY_OPTIONS.find((a) => a.value === project.availability)?.label ?? project.availability;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="animate-fade-in">
        <Badge variant="brand" className="mb-3">
          <Users className="h-3.5 w-3.5" /> My Team
        </Badge>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Your formed team</h1>
        <p className="mt-2 text-slate-400">
          For <span className="font-semibold text-white">{project.name}</span> — target team size {project.teamSize}, {availLabel}.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Users}
          label="Team Size"
          value={`${teamMembers.length} / ${project.teamSize}`}
          accent="brand"
        />
        <StatCard
          icon={Gauge}
          label="Avg. Compatibility"
          value={`${teamScore}%`}
          accent="success"
        />
        <StatCard
          icon={Layers}
          label="Skill Coverage"
          value={`${covered.length} / ${project.requiredSkills.length}`}
          accent="accent"
        />
      </div>

      {teamMembers.length === 0 ? (
        <Card className="mt-6 py-16 text-center">
          <Users className="mx-auto h-10 w-10 text-slate-500" />
          <p className="mt-4 text-slate-400">No team members yet.</p>
          <p className="mt-1 text-sm text-slate-500">Run matching and add candidates to build your team.</p>
          <Button onClick={() => navigate('/create')} className="mt-6">
            Find Teammates <ArrowRight className="h-4 w-4" />
          </Button>
        </Card>
      ) : (
        <>
          {/* Team members */}
          <h2 className="mt-8 text-lg font-semibold text-white">Team Members</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((m) => {
              const wc = weightedContribution(m.breakdown);
              return (
                <Card key={m.candidate.id} hover>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar name={m.candidate.name} id={m.candidate.id} />
                      <div>
                        <h3 className="text-sm font-semibold text-white">{m.candidate.name}</h3>
                        <p className="text-xs text-brand-300">{m.candidate.role}</p>
                      </div>
                    </div>
                    <ScoreRing score={m.breakdown.total} size={48} stroke={4} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {m.candidate.skills.slice(0, 4).map((s) => (
                      <Badge key={s} variant={m.matchedSkills.some((ms) => ms.toLowerCase() === s.toLowerCase()) ? 'success' : 'default'}>
                        {s}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-1 text-center">
                    {[
                      { l: 'Skill', v: wc.skill, m: 45 },
                      { l: 'Avail', v: wc.availability, m: 20 },
                      { l: 'Intr', v: wc.interest, m: 20 },
                      { l: 'Exp', v: wc.experience, m: 15 },
                    ].map((x) => (
                      <div key={x.l} className="rounded-lg bg-white/5 py-1.5">
                        <p className="text-[10px] text-slate-500">{x.l}</p>
                        <p className="text-xs font-semibold text-slate-200">{x.v}/{x.m}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => removeMember(m.candidate.id)}
                    className="btn-danger mt-3 w-full"
                  >
                    <UserMinus className="h-4 w-4" /> Remove
                  </button>
                </Card>
              );
            })}
          </div>

          {/* Skill Gap Analysis */}
          <h2 className="mt-10 text-lg font-semibold text-white">Skill Gap Analysis</h2>
          <Card className="mt-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Target className="h-4 w-4 text-brand-300" /> Comparing team skills against project requirements
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-success-400">Covered Skills</p>
                {covered.length === 0 ? (
                  <p className="text-sm text-slate-500">None yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {covered.map((s) => (
                      <li key={s} className="flex items-center gap-2 text-sm text-slate-200">
                        <CheckCircle2 className="h-4 w-4 text-success-400" /> {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-warning-400">Missing Skills</p>
                {missing.length === 0 ? (
                  <p className="flex items-center gap-2 text-sm text-success-400">
                    <CheckCircle2 className="h-4 w-4" /> All required skills covered.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {missing.map((s) => (
                      <li key={s} className="flex items-center justify-between gap-2 text-sm text-slate-200">
                        <span className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-warning-400" /> {s}
                        </span>
                        <button
                          onClick={() => {
                            setSkillFilter(s);
                            navigate('/results');
                          }}
                          className="chip bg-brand-500/15 text-brand-300 border border-brand-500/30 hover:bg-brand-500/25 transition-colors"
                        >
                          <Search className="h-3 w-3" /> Find Someone
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-brand-500/10 border border-brand-500/20 p-4">
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                <p className="text-sm text-slate-200">{gapSummary}</p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: 'brand' | 'success' | 'accent';
}) {
  const colors = {
    brand: 'text-brand-300 bg-brand-500/15 ring-brand-500/20',
    success: 'text-success-400 bg-success-500/15 ring-success-500/20',
    accent: 'text-accent-400 bg-accent-500/15 ring-accent-500/20',
  };
  return (
    <Card className="flex items-center gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${colors[accent]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </Card>
  );
}
