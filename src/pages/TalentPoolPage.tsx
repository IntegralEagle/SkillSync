import { useMemo, useState } from 'react';
import { Plus, Search, SlidersHorizontal, X, Briefcase, Clock, GraduationCap } from 'lucide-react';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Avatar } from '@/components/Avatar';
import { TagInput } from '@/components/TagInput';
import {
  AVAILABILITY_OPTIONS,
  EXPERIENCE_OPTIONS,
  SKILL_OPTIONS,
} from '@/data/demoData';
import type { AvailabilityRange, Candidate, ExperienceLevel } from '@/types';

interface TalentPoolPageProps {
  candidates: Candidate[];
  onAddCandidate: (c: Omit<Candidate, 'id'>) => Promise<Candidate>;
}

const ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full-Stack Engineer',
  'UI/UX Designer',
  'ML Engineer',
  'Cybersecurity Specialist',
  'Security Engineer',
  'Data Engineer',
  'Data Scientist',
  'Product Manager',
  'Mobile Developer',
  'DevOps Engineer',
];

export function TalentPoolPage({ candidates, onAddCandidate }: TalentPoolPageProps) {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [availability, setAvailability] = useState('');
  const [skillFilter, setSkillFilter] = useState<string[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      if (query) {
        const q = query.toLowerCase();
        const inName = c.name.toLowerCase().includes(q);
        const inRole = c.role.toLowerCase().includes(q);
        const inBio = c.bio.toLowerCase().includes(q);
        if (!inName && !inRole && !inBio) return false;
      }
      if (role && c.role !== role) return false;
      if (experience && c.experience !== experience) return false;
      if (availability && c.availability !== availability) return false;
      if (skillFilter.length > 0) {
        const cs = new Set(c.skills.map((s) => s.toLowerCase()));
        const has = skillFilter.some((s) => cs.has(s.toLowerCase()));
        if (!has) return false;
      }
      return true;
    });
  }, [candidates, query, role, experience, availability, skillFilter]);

  const addCandidate = async (c: Omit<Candidate, 'id'>) => {
    await onAddCandidate(c);
    setShowAdd(false);
  };

  const clearFilters = () => {
    setQuery('');
    setRole('');
    setExperience('');
    setAvailability('');
    setSkillFilter([]);
  };

  const hasFilters = query || role || experience || availability || skillFilter.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="animate-fade-in">
          <Badge variant="accent" className="mb-3">
            <Briefcase className="h-3.5 w-3.5" /> Talent Pool
          </Badge>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Browse candidates</h1>
          <p className="mt-2 text-slate-400">{candidates.length} profiles available. Filter by role, skills, experience, or availability.</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4" /> Add Profile
        </Button>
      </div>

      {/* Filters */}
      <Card className="mt-6 animate-fade-up">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <SlidersHorizontal className="h-4 w-4 text-brand-300" /> Filters
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label">Search</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                className="input pl-9"
                placeholder="Name, role, bio…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="label">Role</label>
            <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">All roles</option>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Experience</label>
            <select className="input" value={experience} onChange={(e) => setExperience(e.target.value)}>
              <option value="">Any level</option>
              {EXPERIENCE_OPTIONS.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Availability</label>
            <select className="input" value={availability} onChange={(e) => setAvailability(e.target.value)}>
              <option value="">Any availability</option>
              {AVAILABILITY_OPTIONS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <TagInput value={skillFilter} onChange={setSkillFilter} suggestions={SKILL_OPTIONS} label="Filter by skills" placeholder="Add a skill filter" />
        </div>
        {hasFilters && (
          <div className="mt-4 flex justify-end">
            <Button variant="ghost" onClick={clearFilters}>
              <X className="h-4 w-4" /> Clear filters
            </Button>
          </div>
        )}
      </Card>

      {/* Results count */}
      <p className="mt-6 text-sm text-slate-400">
        Showing <span className="font-semibold text-white">{filtered.length}</span> of {candidates.length} candidates
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <Card className="mt-4 text-center py-16">
          <p className="text-slate-400">No candidates match your filters.</p>
          <Button variant="ghost" onClick={clearFilters} className="mt-4">Clear filters</Button>
        </Card>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CandidateCard key={c.id} candidate={c} />
          ))}
        </div>
      )}

      {showAdd && (
        <AddProfileModal
          onClose={() => setShowAdd(false)}
          onAdd={addCandidate}
        />
      )}
    </div>
  );
}

function CandidateCard({ candidate: c }: { candidate: Candidate }) {
  const availLabel = AVAILABILITY_OPTIONS.find((a) => a.value === c.availability)?.label ?? c.availability;
  return (
    <Card hover className="flex flex-col">
      <div className="flex items-start gap-3">
        <Avatar name={c.name} id={c.id} size="lg" />
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-white">{c.name}</h3>
          <p className="text-sm text-brand-300">{c.role}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Badge variant="default" className="gap-1">
              <GraduationCap className="h-3 w-3" /> {c.experience}
            </Badge>
            <Badge variant="default" className="gap-1">
              <Clock className="h-3 w-3" /> {availLabel}
            </Badge>
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-400 line-clamp-2">{c.bio}</p>
      <div className="mt-3">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Skills</p>
        <div className="flex flex-wrap gap-1.5">
          {c.skills.slice(0, 5).map((s) => (
            <Badge key={s} variant="brand">{s}</Badge>
          ))}
          {c.skills.length > 5 && <Badge variant="default">+{c.skills.length - 5}</Badge>}
        </div>
      </div>
      <div className="mt-3">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Interests</p>
        <div className="flex flex-wrap gap-1.5">
          {c.interests.slice(0, 3).map((i) => (
            <Badge key={i} variant="accent">{i}</Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}

function AddProfileModal({ onClose, onAdd }: { onClose: () => void; onAdd: (c: Omit<Candidate, 'id'>) => void }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState(ROLES[0]);
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [experience, setExperience] = useState<ExperienceLevel>('Intermediate');
  const [availability, setAvailability] = useState<AvailabilityRange>('10-20');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (!name.trim()) return setError('Name is required.');
    if (skills.length === 0) return setError('Add at least one skill.');
    onAdd({
      name: name.trim(),
      role,
      skills,
      interests,
      experience,
      availability,
      bio: bio.trim() || 'No bio provided.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative z-10 w-full max-w-lg animate-scale-in max-h-[90vh] overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Add a new profile</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <label className="label">Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Role</label>
              <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Experience</label>
              <select className="input" value={experience} onChange={(e) => setExperience(e.target.value as ExperienceLevel)}>
                {EXPERIENCE_OPTIONS.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Availability</label>
            <select className="input" value={availability} onChange={(e) => setAvailability(e.target.value as AvailabilityRange)}>
              {AVAILABILITY_OPTIONS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>
          <TagInput label="Skills" value={skills} onChange={setSkills} suggestions={SKILL_OPTIONS} placeholder="Add a skill" />
          <TagInput label="Interests" value={interests} onChange={setInterests} suggestions={[
            'Cybersecurity', 'Applied AI', 'Sustainability', 'Education', 'Healthcare',
            'Fintech', 'Developer Tools', 'Data Visualization', 'Open Source', 'Climate Tech',
          ]} placeholder="Add an interest" />
          <div>
            <label className="label">Short bio</label>
            <textarea className="input min-h-[70px] resize-y" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A sentence or two about this person." />
          </div>
          {error && <p className="text-xs text-error-400">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={submit}>Add Profile</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
