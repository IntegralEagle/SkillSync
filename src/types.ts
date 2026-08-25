export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type AvailabilityRange = '0-5' | '5-10' | '10-20' | '20-30' | '30+';

export interface Candidate {
  id: string;
  name: string;
  role: string;
  skills: string[];
  interests: string[];
  experience: ExperienceLevel;
  availability: AvailabilityRange;
  bio: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  domain: string;
  requiredSkills: string[];
  teamSize: number;
  experience: ExperienceLevel;
  availability: AvailabilityRange;
  createdAt: number;
}

export interface ScoreBreakdown {
  skill: number;
  availability: number;
  interest: number;
  experience: number;
  total: number;
}

export interface MatchExplanation {
  text: string;
  type: 'positive' | 'neutral' | 'negative';
}

export interface MatchResult {
  candidate: Candidate;
  breakdown: ScoreBreakdown;
  explanations: MatchExplanation[];
  matchedSkills: string[];
  missingSkills: string[];
  sharedInterests: string[];
}
