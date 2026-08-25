import type { Candidate, Project } from '@/types';

export const SKILL_OPTIONS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'UI/UX', 'Cybersecurity',
  'Data Analysis', 'Machine Learning', 'TensorFlow', 'PostgreSQL', 'MongoDB',
  'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'React Native', 'Swift', 'Kotlin',
  'Go', 'Rust', 'Figma', 'Product Management', 'DevOps', 'Data Engineering',
  'Sustainability', 'Computer Vision', 'NLP', 'Blockchain',
];

export const INTEREST_OPTIONS = [
  'Cybersecurity', 'Applied AI', 'Sustainability', 'Education', 'Healthcare',
  'Fintech', 'Developer Tools', 'Data Visualization', 'Open Source',
  'Climate Tech', 'Robotics', 'Web3', 'Accessibility', 'Social Impact',
];

export const DOMAIN_OPTIONS = [
  'Cybersecurity', 'Sustainability', 'Data', 'AI/ML', 'Web', 'Mobile',
  'Healthcare', 'Fintech', 'Education', 'Developer Tools', 'Other',
];

export const AVAILABILITY_OPTIONS: { value: string; label: string }[] = [
  { value: '0-5', label: '0–5 hours/week' },
  { value: '5-10', label: '5–10 hours/week' },
  { value: '10-20', label: '10–20 hours/week' },
  { value: '20-30', label: '20–30 hours/week' },
  { value: '30+', label: '30+ hours/week' },
];

export const EXPERIENCE_OPTIONS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const DEMO_CANDIDATES: Candidate[] = [
  {
    id: 'c1',
    name: 'Sarah Chen',
    role: 'Full-Stack Engineer',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL'],
    interests: ['Cybersecurity', 'Applied AI', 'Developer Tools'],
    experience: 'Advanced',
    availability: '10-20',
    bio: 'Full-stack engineer who loves building secure, data-heavy products. Shipped two campus safety tools.',
  },
  {
    id: 'c2',
    name: 'Marcus Rivera',
    role: 'Cybersecurity Specialist',
    skills: ['Cybersecurity', 'Python', 'Docker', 'Go', 'PostgreSQL'],
    interests: ['Cybersecurity', 'Open Source'],
    experience: 'Expert',
    availability: '10-20',
    bio: 'Security researcher focused on threat detection and incident response. CTF regular and open-source contributor.',
  },
  {
    id: 'c3',
    name: 'Priya Nair',
    role: 'UI/UX Designer',
    skills: ['UI/UX', 'Figma', 'React', 'Accessibility'],
    interests: ['Accessibility', 'Education', 'Social Impact'],
    experience: 'Intermediate',
    availability: '10-20',
    bio: 'Product designer obsessed with accessible interfaces. Background in edtech and civic tech.',
  },
  {
    id: 'c4',
    name: 'David Okafor',
    role: 'ML Engineer',
    skills: ['Machine Learning', 'TensorFlow', 'Python', 'Data Analysis', 'NLP'],
    interests: ['Applied AI', 'Healthcare', 'Data Visualization'],
    experience: 'Advanced',
    availability: '20-30',
    bio: 'ML engineer building explainable models for high-stakes domains. Published at NeurIPS workshop.',
  },
  {
    id: 'c5',
    name: 'Lena Fischer',
    role: 'Data Engineer',
    skills: ['Data Engineering', 'Python', 'PostgreSQL', 'AWS', 'Data Analysis'],
    interests: ['Sustainability', 'Climate Tech', 'Data Visualization'],
    experience: 'Intermediate',
    availability: '10-20',
    bio: 'Data engineer passionate about climate data pipelines. Built emissions tracking dashboards.',
  },
  {
    id: 'c6',
    name: 'James Carter',
    role: 'Product Manager',
    skills: ['Product Management', 'Data Analysis', 'UI/UX'],
    interests: ['Fintech', 'Developer Tools', 'Education'],
    experience: 'Expert',
    availability: '5-10',
    bio: 'PM who turns ambiguous problems into shipped products. Ex-fintech, now mentoring student teams.',
  },
  {
    id: 'c7',
    name: 'Aisha Khan',
    role: 'Mobile Developer',
    skills: ['React Native', 'Swift', 'Kotlin', 'TypeScript'],
    interests: ['Healthcare', 'Accessibility', 'Social Impact'],
    experience: 'Intermediate',
    availability: '10-20',
    bio: 'Mobile developer focused on health apps. Cross-platform specialist with an eye for detail.',
  },
  {
    id: 'c8',
    name: 'Tom Becker',
    role: 'DevOps Engineer',
    skills: ['DevOps', 'Docker', 'Kubernetes', 'AWS', 'Go'],
    interests: ['Open Source', 'Developer Tools', 'Cybersecurity'],
    experience: 'Advanced',
    availability: '20-30',
    bio: 'DevOps engineer who automates everything. Runs reproducible infra for research labs.',
  },
  {
    id: 'c9',
    name: 'Mia Rossi',
    role: 'Frontend Developer',
    skills: ['React', 'TypeScript', 'GraphQL', 'UI/UX', 'Figma'],
    interests: ['Data Visualization', 'Accessibility', 'Education'],
    experience: 'Beginner',
    availability: '5-10',
    bio: 'Frontend developer building delightful data UIs. Recent bootcamp grad, fast learner.',
  },
  {
    id: 'c10',
    name: 'Kevin Wu',
    role: 'Backend Developer',
    skills: ['Node.js', 'Go', 'PostgreSQL', 'GraphQL', 'Python'],
    interests: ['Developer Tools', 'Fintech', 'Open Source'],
    experience: 'Advanced',
    availability: '10-20',
    bio: 'Backend engineer who likes clean APIs and boring, reliable infrastructure.',
  },
  {
    id: 'c11',
    name: 'Sofia Alvarez',
    role: 'Data Scientist',
    skills: ['Python', 'Data Analysis', 'Machine Learning', 'Data Visualization', 'TensorFlow'],
    interests: ['Sustainability', 'Climate Tech', 'Healthcare'],
    experience: 'Intermediate',
    availability: '10-20',
    bio: 'Data scientist turning messy datasets into decisions. Climate and health focus.',
  },
  {
    id: 'c12',
    name: 'Noah Patel',
    role: 'Security Engineer',
    skills: ['Cybersecurity', 'Python', 'Rust', 'Docker'],
    interests: ['Cybersecurity', 'Open Source', 'Developer Tools'],
    experience: 'Intermediate',
    availability: '10-20',
    bio: 'Security engineer building defensive tooling. Loves threat modeling and secure defaults.',
  },
];

export const DEMO_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'SecureCampus',
    description:
      'A platform for detecting and reporting cybersecurity threats across a university campus.',
    domain: 'Cybersecurity',
    requiredSkills: ['Cybersecurity', 'React', 'Node.js', 'Python', 'UI/UX'],
    teamSize: 4,
    experience: 'Intermediate',
    availability: '10-20',
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'p2',
    name: 'EcoTrack',
    description:
      'A sustainability dashboard that tracks and visualizes carbon emissions data for cities.',
    domain: 'Sustainability',
    requiredSkills: ['React', 'Python', 'Data Analysis', 'Data Visualization', 'UI/UX'],
    teamSize: 4,
    experience: 'Intermediate',
    availability: '10-20',
    createdAt: Date.now() - 43200000,
  },
];
