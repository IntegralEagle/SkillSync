import type {
  Candidate,
  ExperienceLevel,
  MatchExplanation,
  MatchResult,
  Project,
  ScoreBreakdown,
} from '@/types';

export const WEIGHTS = {
  skill: 0.45,
  availability: 0.2,
  interest: 0.2,
  experience: 0.15,
} as const;

const EXPERIENCE_RANK: Record<ExperienceLevel, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4,
};

const AVAILABILITY_MIDPOINT: Record<string, number> = {
  '0-5': 2.5,
  '5-10': 7.5,
  '10-20': 15,
  '20-30': 25,
  '30+': 35,
};

function normalize(str: string): string {
  return str.trim().toLowerCase();
}

function skillScore(candidate: Candidate, project: Project): number {
  if (project.requiredSkills.length === 0) return 100;
  const candidateSkills = new Set(candidate.skills.map(normalize));
  const matched = project.requiredSkills.filter((s) => candidateSkills.has(normalize(s)));
  return (matched.length / project.requiredSkills.length) * 100;
}

function availabilityScore(candidate: Candidate, project: Project): number {
  const candidateMid = AVAILABILITY_MIDPOINT[candidate.availability] ?? 0;
  const projectMid = AVAILABILITY_MIDPOINT[project.availability] ?? 0;
  if (candidateMid === 0 || projectMid === 0) return 0;
  // Candidate must meet at least the project's required hours.
  if (candidateMid < projectMid) {
    const ratio = candidateMid / projectMid;
    // Partial credit scaled — a candidate with half the hours is weak but not zero.
    return Math.max(0, ratio * 70);
  }
  // Meets or exceeds requirement. Slight penalty for huge over-commitment (risk of dropout).
  const overshoot = candidateMid - projectMid;
  if (overshoot > projectMid * 1.5) return 85;
  return 100;
}

function interestScore(candidate: Candidate, project: Project): number {
  const candidateInterests = new Set(candidate.interests.map(normalize));
  // Domain alignment counts as a shared interest.
  const domainAligned = normalize(project.domain) !== '' &&
    (candidateInterests.has(normalize(project.domain)) ||
      candidate.skills.some((s) => normalize(s) === normalize(project.domain)));
  const shared = candidate.interests.filter((i) =>
    candidateInterests.has(normalize(i)) && i !== project.domain,
  );
  // Count domain + shared interests, capped at 3 for scoring stability.
  const alignedCount = (domainAligned ? 1 : 0) + shared.length;
  if (alignedCount === 0) return 0;
  return Math.min(100, (alignedCount / 3) * 100);
}

function experienceScore(candidate: Candidate, project: Project): number {
  const candidateRank = EXPERIENCE_RANK[candidate.experience] ?? 1;
  const projectRank = EXPERIENCE_RANK[project.experience] ?? 1;
  if (candidateRank === projectRank) return 100;
  // Over-qualified is fine but slightly discounted (risk of disengagement).
  if (candidateRank > projectRank) {
    const diff = candidateRank - projectRank;
    return Math.max(70, 100 - diff * 12);
  }
  // Under-qualified — partial credit scaled by gap.
  const diff = projectRank - candidateRank;
  return Math.max(0, 100 - diff * 35);
}

function buildExplanations(
  candidate: Candidate,
  project: Project,
  breakdown: ScoreBreakdown,
  matchedSkills: string[],
  missingSkills: string[],
  sharedInterests: string[],
): MatchExplanation[] {
  const explanations: MatchExplanation[] = [];

  if (project.requiredSkills.length > 0) {
    if (matchedSkills.length > 0) {
      explanations.push({
        text: `Strong ${matchedSkills.slice(0, 3).join(' & ')} skill overlap — covers ${matchedSkills.length}/${project.requiredSkills.length} required skills.`,
        type: 'positive',
      });
    } else {
      explanations.push({
        text: 'No direct overlap with the required skills for this project.',
        type: 'negative',
      });
    }
    if (missingSkills.length > 0) {
      explanations.push({
        text: `Missing: ${missingSkills.slice(0, 3).join(', ')}${missingSkills.length > 3 ? '…' : ''}.`,
        type: missingSkills.length > project.requiredSkills.length / 2 ? 'negative' : 'neutral',
      });
    }
  }

  const availLabel = `${candidate.availability} hours/week`;
  if (breakdown.availability >= 90) {
    explanations.push({
      text: `Available ${availLabel}, which matches your project requirement.`,
      type: 'positive',
    });
  } else if (breakdown.availability >= 50) {
    explanations.push({
      text: `Available ${availLabel} — below the project's target commitment.`,
      type: 'neutral',
    });
  } else {
    explanations.push({
      text: `Available only ${availLabel}, below the project requirement.`,
      type: 'negative',
    });
  }

  if (sharedInterests.length > 0) {
    explanations.push({
      text: `Shares interests in ${sharedInterests.slice(0, 3).join(', ')}.`,
      type: 'positive',
    });
  } else {
    explanations.push({
      text: 'Limited interest alignment with the project domain.',
      type: 'neutral',
    });
  }

  if (breakdown.experience >= 90) {
    explanations.push({
      text: `${candidate.experience} experience matches the project's requirement.`,
      type: 'positive',
    });
  } else if (breakdown.experience >= 50) {
    explanations.push({
      text: `${candidate.experience} experience — slightly below the project's ${project.experience} target.`,
      type: 'neutral',
    });
  } else {
    explanations.push({
      text: `${candidate.experience} experience is below the project's ${project.experience} requirement.`,
      type: 'negative',
    });
  }

  return explanations;
}

export function scoreCandidate(candidate: Candidate, project: Project): MatchResult {
  const candidateSkills = new Set(candidate.skills.map(normalize));
  const matchedSkills = project.requiredSkills.filter((s) =>
    candidateSkills.has(normalize(s)),
  );
  const missingSkills = project.requiredSkills.filter(
    (s) => !candidateSkills.has(normalize(s)),
  );

  const candidateInterests = new Set(candidate.interests.map(normalize));
  const sharedInterests = candidate.interests.filter((i) => {
    if (normalize(i) === normalize(project.domain)) return true;
    return candidateInterests.has(normalize(i));
  });

  const skill = skillScore(candidate, project);
  const availability = availabilityScore(candidate, project);
  const interest = interestScore(candidate, project);
  const experience = experienceScore(candidate, project);

  const total =
    skill * WEIGHTS.skill +
    availability * WEIGHTS.availability +
    interest * WEIGHTS.interest +
    experience * WEIGHTS.experience;

  const breakdown: ScoreBreakdown = {
    skill,
    availability,
    interest,
    experience,
    total: Math.round(total),
  };

  const explanations = buildExplanations(
    candidate,
    project,
    breakdown,
    matchedSkills,
    missingSkills,
    sharedInterests,
  );

  return {
    candidate,
    breakdown,
    explanations,
    matchedSkills,
    missingSkills,
    sharedInterests,
  };
}

export function runMatching(candidates: Candidate[], project: Project): MatchResult[] {
  return candidates
    .map((c) => scoreCandidate(c, project))
    .sort((a, b) => b.breakdown.total - a.breakdown.total);
}

export function weightedContribution(breakdown: ScoreBreakdown): {
  skill: number;
  availability: number;
  interest: number;
  experience: number;
} {
  return {
    skill: Math.round(breakdown.skill * WEIGHTS.skill),
    availability: Math.round(breakdown.availability * WEIGHTS.availability),
    interest: Math.round(breakdown.interest * WEIGHTS.interest),
    experience: Math.round(breakdown.experience * WEIGHTS.experience),
  };
}
