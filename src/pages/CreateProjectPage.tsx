import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, RotateCcw, AlertCircle, FileText } from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { TagInput } from '@/components/TagInput';
import {
  AVAILABILITY_OPTIONS,
  DEMO_PROJECTS,
  DOMAIN_OPTIONS,
  EXPERIENCE_OPTIONS,
  SKILL_OPTIONS,
} from '@/data/demoData';
import type { AvailabilityRange, ExperienceLevel, Project } from '@/types';
import { createProject } from '@/lib/db';

interface FormState {
  name: string;
  description: string;
  domain: string;
  requiredSkills: string[];
  teamSize: string;
  experience: ExperienceLevel;
  availability: AvailabilityRange;
}

const EMPTY: FormState = {
  name: '',
  description: '',
  domain: '',
  requiredSkills: [],
  teamSize: '4',
  experience: 'Intermediate',
  availability: '10-20',
};

interface CreateProjectPageProps {
  onProjectCreated: (projectId: string) => void;
}

export function CreateProjectPage({ onProjectCreated }: CreateProjectPageProps) {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Project name is required.';
    if (!form.description.trim()) e.description = 'Add a short description.';
    if (!form.domain) e.domain = 'Select a domain.';
    if (form.requiredSkills.length === 0) e.requiredSkills = 'Add at least one required skill.';
    const size = parseInt(form.teamSize, 10);
    if (!size || size < 2 || size > 12) e.teamSize = 'Team size must be 2–12.';
    if (!form.availability) e.availability = 'Select an availability requirement.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const project = await createProject({
        name: form.name.trim(),
        description: form.description.trim(),
        domain: form.domain,
        requiredSkills: form.requiredSkills,
        teamSize: parseInt(form.teamSize, 10),
        experience: form.experience,
        availability: form.availability,
      });
      onProjectCreated(project.id);
      navigate('/results');
    } catch (e) {
      setErrors({ submit: e instanceof Error ? e.message : 'Failed to create project.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(EMPTY);
    setErrors({});
  };

  const loadDemo = (demo: Project) => {
    setForm({
      name: demo.name,
      description: demo.description,
      domain: demo.domain,
      requiredSkills: demo.requiredSkills,
      teamSize: String(demo.teamSize),
      experience: demo.experience,
      availability: demo.availability,
    });
    setErrors({});
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="animate-fade-in">
        <Badge variant="brand" className="mb-4">
          <FileText className="h-3.5 w-3.5" /> Create Project
        </Badge>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Define your project</h1>
        <p className="mt-2 text-slate-400">
          Tell us what you're building. We'll match candidates against these requirements.
        </p>
      </div>

      {/* Demo projects */}
      <div className="mt-6 animate-fade-up">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Quick start with a demo project</p>
        <div className="flex flex-wrap gap-2">
          {DEMO_PROJECTS.map((p) => (
            <button
              key={p.id}
              onClick={() => loadDemo(p)}
              className="chip glass text-slate-200 hover:bg-brand-500/15 hover:text-brand-300 hover:border-brand-500/30 transition-colors"
            >
              <Rocket className="h-3.5 w-3.5" /> {p.name}
            </button>
          ))}
        </div>
      </div>

      <Card className="mt-6 animate-fade-up">
        <div className="space-y-5">
          <div>
            <label className="label">Project Name</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="e.g. SecureCampus"
            />
            {errors.name && <FieldError msg={errors.name} />}
          </div>

          <div>
            <label className="label">Project Description</label>
            <textarea
              className="input min-h-[90px] resize-y"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Describe what the project does and its goals."
            />
            {errors.description && <FieldError msg={errors.description} />}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label">Project Domain</label>
              <select className="input" value={form.domain} onChange={(e) => update('domain', e.target.value)}>
                <option value="">Select a domain…</option>
                {DOMAIN_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.domain && <FieldError msg={errors.domain} />}
            </div>
            <div>
              <label className="label">Preferred Team Size</label>
              <input
                type="number"
                min={2}
                max={12}
                className="input"
                value={form.teamSize}
                onChange={(e) => update('teamSize', e.target.value)}
              />
              {errors.teamSize && <FieldError msg={errors.teamSize} />}
            </div>
          </div>

          <div>
            <TagInput
              label="Required Skills"
              value={form.requiredSkills}
              onChange={(tags) => update('requiredSkills', tags)}
              suggestions={SKILL_OPTIONS}
              placeholder="Type a skill and press Enter"
            />
            {errors.requiredSkills && <FieldError msg={errors.requiredSkills} />}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label">Required Experience Level</label>
              <select
                className="input"
                value={form.experience}
                onChange={(e) => update('experience', e.target.value as ExperienceLevel)}
              >
                {EXPERIENCE_OPTIONS.map((x) => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Availability Requirement</label>
              <select
                className="input"
                value={form.availability}
                onChange={(e) => update('availability', e.target.value as AvailabilityRange)}
              >
                {AVAILABILITY_OPTIONS.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
              {errors.availability && <FieldError msg={errors.availability} />}
            </div>
          </div>

          {errors.submit && <FieldError msg={errors.submit} />}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button onClick={handleSubmit} disabled={submitting} className="flex-1">
              <Rocket className="h-4 w-4" /> {submitting ? 'Finding matches…' : 'Find Matching Teammates'}
            </Button>
            <Button variant="secondary" onClick={handleReset} disabled={submitting}>
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function FieldError({ msg }: { msg: string }) {
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-error-400">
      <AlertCircle className="h-3 w-3" /> {msg}
    </p>
  );
}
