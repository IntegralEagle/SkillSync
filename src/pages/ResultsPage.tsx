import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, AlertTriangle, XCircle, UserPlus, UserCheck,
  Clock, GraduationCap, Sparkles, Search, X,
} from 'lucide-react';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Avatar } from '@/components/Avatar';
import { ScoreRing } from '@/components/ScoreRing';
import { ScoreBar } from '@/components/ScoreBar';
import { runMatching, weightedContribution } from '@/lib/matching';
import { AVAILABILITY_OPTIONS } from '@/data/demoData';
import { fetchProjectById } from '@/lib/db';
import type { Candidate, MatchResult, Project } from '@/types';

interface ResultsPageProps {
  projectId: string | null;
  candidates: Candidate[];
  team: string[];
  toggleTeamMember: (id: string) => void;
}

export function ResultsPage({ projectId, candidates, team, toggleTeamMember }: ResultsPageProps) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<MatchResult | null>(null);
  const [skillFilter, setSkillFilter] = useState<string>(() => sessionStorage.getItem('pm_results_skill_filter') ?? '');
  const [project, setProject] = useState<Project | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);

  // Clear the filter once consumed so it doesn't persist unexpectedly.
  useEffect(() => {
    if (sessionStorage.getItem('pm_results_skill_filter')) {
      sessionStorage.removeItem('pm_results_skill_filter');
    }
  }, []);

  // Load project from Supabase by ID
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

  const results = useMemo(() => {
    if (!project) return [];
    return runMatching(candidates, project);
  }, [candidates, project]);

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
          <p className="text-slate-400">No active project. Create one to see matches.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={() => navigate('/create')}>Create Project</Button>
            <Button variant="secondary" onClick={() => navigate('/talent')}>Browse Talent</Button>
          </div>
        </Card>
      </div>
    );
  }

  const filtered = skillFilter
    ? results.filter((r) => r.candidate.skills.some((s) => s.toLowerCase() === skillFilter.toLowerCase()))
    : results;

  const availLabel = AVAILABILITY_OPTIONS.find((a) => a.value === project.availability)?.label ?? project.availability;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <button onClick={() => navigate('/create')} className="btn-ghost mb-4 -ml-2">
        <ArrowLeft className="h-4 w-4" /> Back to project
      </button>

      <div className="animate-fade-in">
        <Badge variant="brand" className="mb-3">
          <Sparkles className="h-3.5 w-3.5" /> Match Results
        </Badge>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Your Best Matches</h1>
        <p className="mt-2 text-slate-400">Candidates ranked by compatibility with your project requirements.</p>
      </div>

      {/* Project summary */}
      <Card className="mt-6 animate-fade-up">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">{project.name}</h2>
            <p className="mt-1 text-sm text-slate-400">{project.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge variant="accent">{project.domain}</Badge>
              <Badge variant="default" className="gap-1"><GraduationCap className="h-3 w-3" /> {project.experience}</Badge>
              <Badge variant="default" className="gap-1"><Clock className="h-3 w-3" /> {availLabel}</Badge>
              <Badge variant="default">Team size: {project.teamSize}</Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:justify-end">
            {project.requiredSkills.map((s) => (
              <Badge key={s} variant="brand">{s}</Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Skill quick-filter */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Filter by required skill:</span>
        <button
          onClick={() => setSkillFilter('')}
          className={`chip transition-colors ${!skillFilter ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'glass text-slate-300 hover:bg-white/10'}`}
        >
          All
        </button>
        {project.requiredSkills.map((s) => (
          <button
            key={s}
            onClick={() => setSkillFilter(skillFilter === s ? '' : s)}
            className={`chip transition-colors ${skillFilter === s ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'glass text-slate-300 hover:bg-white/10'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <Card className="mt-4 py-16 text-center">
          <p className="text-slate-400">No candidates found for this filter.</p>
        </Card>
      ) : (
        <div className="mt-6 space-y-4">
          {filtered.map((r, idx) => (
            <MatchCard
              key={r.candidate.id}
              result={r}
              rank={idx + 1}
              isOnTeam={team.includes(r.candidate.id)}
              onView={() => setSelected(r)}
              onToggleTeam={() => toggleTeamMember(r.candidate.id)}
              teamFull={team.length >= project.teamSize}
            />
          ))}
        </div>
      )}

      {selected && (
        <ProfileModal result={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function MatchCard({
  result: r,
  rank,
  isOnTeam,
  onView,
  onToggleTeam,
  teamFull,
}: {
  result: MatchResult;
  rank: number;
  isOnTeam: boolean;
  onView: () => void;
  onToggleTeam: () => void;
  teamFull: boolean;
}) {
  const { candidate: c, breakdown: b } = r;
  const wc = weightedContribution(b);
  const availLabel = AVAILABILITY_OPTIONS.find((a) => a.value === c.availability)?.label ?? c.availability;

  return (
    <Card hover className="animate-fade-up">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {/* Left: identity + score */}
        <div className="flex items-center gap-4 lg:w-72 shrink-0">
          <div className="relative">
            <Avatar name={c.name} id={c.id} size="lg" />
            <span className="absolute -bottom-1 -right-1 rounded-full bg-bg-base px-1.5 py-0.5 text-[10px] font-bold text-slate-400 ring-1 ring-white/10">
              #{rank}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-white">{c.name}</h3>
            <p className="text-sm text-brand-300">{c.role}</p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              <Badge variant="default" className="gap-1"><GraduationCap className="h-3 w-3" /> {c.experience}</Badge>
              <Badge variant="default" className="gap-1"><Clock className="h-3 w-3" /> {availLabel}</Badge>
            </div>
          </div>
        </div>

        {/* Middle: explanation */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${b.total >= 80 ? 'text-success-400' : b.total >= 60 ? 'text-brand-300' : b.total >= 40 ? 'text-warning-400' : 'text-error-400'}`}>
              {b.total}%
            </span>
            <span className="text-sm text-slate-500">Match</span>
          </div>

          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Why this person matches</p>
          <ul className="mt-2 space-y-1.5">
            {r.explanations.slice(0, 4).map((e, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                {e.type === 'positive' && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-400" />}
                {e.type === 'neutral' && <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-400" />}
                {e.type === 'negative' && <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-error-400" />}
                <span>{e.text}</span>
              </li>
            ))}
          </ul>

          {/* Score breakdown */}
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            <ScoreBar label="Skills" value={wc.skill} max={45} color="bg-brand-500" />
            <ScoreBar label="Availability" value={wc.availability} max={20} color="bg-accent-500" />
            <ScoreBar label="Interests" value={wc.interest} max={20} color="bg-success-500" />
            <ScoreBar label="Experience" value={wc.experience} max={15} color="bg-warning-500" />
          </div>

          {/* Skills */}
          <div className="mt-4">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {c.skills.map((s) => {
                const matched = r.matchedSkills.some((m) => m.toLowerCase() === s.toLowerCase());
                return (
                  <Badge key={s} variant={matched ? 'success' : 'default'} className={matched ? 'gap-1' : ''}>
                    {matched && <CheckCircle2 className="h-3 w-3" />} {s}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex flex-row gap-2 lg:w-40 lg:flex-col lg:items-stretch">
          <Button variant="secondary" onClick={onView} className="flex-1">
            <Search className="h-4 w-4" /> View Profile
          </Button>
          {isOnTeam ? (
            <Button variant="danger" onClick={onToggleTeam} className="flex-1">
              <UserCheck className="h-4 w-4" /> On Team
            </Button>
          ) : (
            <Button onClick={onToggleTeam} disabled={teamFull} className="flex-1">
              <UserPlus className="h-4 w-4" /> Add to Team
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function ProfileModal({ result: r, onClose }: { result: MatchResult; onClose: () => void }) {
  const { candidate: c, breakdown: b } = r;
  const wc = weightedContribution(b);
  const availLabel = AVAILABILITY_OPTIONS.find((a) => a.value === c.availability)?.label ?? c.availability;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative z-10 w-full max-w-2xl animate-scale-in max-h-[90vh] overflow-y-auto scrollbar-thin">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={c.name} id={c.id} size="lg" />
            <div>
              <h2 className="text-xl font-bold text-white">{c.name}</h2>
              <p className="text-sm text-brand-300">{c.role}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-300">{c.bio}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge variant="default" className="gap-1"><GraduationCap className="h-3 w-3" /> {c.experience}</Badge>
          <Badge variant="default" className="gap-1"><Clock className="h-3 w-3" /> {availLabel}</Badge>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <ScoreRing score={b.total} size={72} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Overall compatibility</p>
            <p className="text-sm text-slate-300">Based on weighted scoring across four factors.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          <ScoreBar label="Skills" value={wc.skill} max={45} color="bg-brand-500" />
          <ScoreBar label="Availability" value={wc.availability} max={20} color="bg-accent-500" />
          <ScoreBar label="Interests" value={wc.interest} max={20} color="bg-success-500" />
          <ScoreBar label="Experience" value={wc.experience} max={15} color="bg-warning-500" />
        </div>

        <div className="mt-5">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {c.skills.map((s) => {
              const matched = r.matchedSkills.some((m) => m.toLowerCase() === s.toLowerCase());
              return (
                <Badge key={s} variant={matched ? 'success' : 'default'} className={matched ? 'gap-1' : ''}>
                  {matched && <CheckCircle2 className="h-3 w-3" />} {s}
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Interests</p>
          <div className="flex flex-wrap gap-1.5">
            {c.interests.map((i) => (
              <Badge key={i} variant="accent">{i}</Badge>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Full explanation</p>
          <ul className="space-y-2">
            {r.explanations.map((e, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                {e.type === 'positive' && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-400" />}
                {e.type === 'neutral' && <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-400" />}
                {e.type === 'negative' && <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-error-400" />}
                <span>{e.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}
