import { supabase } from '@/lib/supabase';
import type { Candidate, Project } from '@/types';

// ---- Row types from Supabase ----

interface ProfileRow {
  id: string;
  name: string;
  role: string;
  experience: Candidate['experience'];
  availability: Candidate['availability'];
  bio: string;
}

interface ProfileWithRelations extends ProfileRow {
  profile_skills: { skill_name: string }[];
  profile_interests: { interest_name: string }[];
}

interface ProjectRow {
  id: string;
  name: string;
  description: string;
  domain: string;
  team_size: number;
  experience: Project['experience'];
  availability: Project['availability'];
  created_at: string;
}

interface ProjectWithSkills extends ProjectRow {
  project_required_skills: { skill_name: string }[];
}

// ---- Mappers ----

function mapProfile(row: ProfileWithRelations): Candidate {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    skills: row.profile_skills.map((s) => s.skill_name),
    interests: row.profile_interests.map((i) => i.interest_name),
    experience: row.experience,
    availability: row.availability,
    bio: row.bio,
  };
}

function mapProject(row: ProjectWithSkills): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    domain: row.domain,
    requiredSkills: row.project_required_skills.map((s) => s.skill_name),
    teamSize: row.team_size,
    experience: row.experience,
    availability: row.availability,
    createdAt: new Date(row.created_at).getTime(),
  };
}

// ---- Profiles (Candidates) ----

export async function fetchCandidates(): Promise<Candidate[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id, name, role, experience, availability, bio,
      profile_skills ( skill_name ),
      profile_interests ( interest_name )
    `)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data as ProfileWithRelations[]).map(mapProfile);
}

export async function createCandidate(c: Omit<Candidate, 'id'>): Promise<Candidate> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .insert({
      name: c.name,
      role: c.role,
      experience: c.experience,
      availability: c.availability,
      bio: c.bio,
    })
    .select()
    .single();

  if (profileError) throw profileError;

  const profileId = (profile as ProfileRow).id;

  if (c.skills.length > 0) {
    const { error: skillsError } = await supabase
      .from('profile_skills')
      .insert(c.skills.map((skill_name) => ({ profile_id: profileId, skill_name })));
    if (skillsError) throw skillsError;
  }

  if (c.interests.length > 0) {
    const { error: interestsError } = await supabase
      .from('profile_interests')
      .insert(c.interests.map((interest_name) => ({ profile_id: profileId, interest_name })));
    if (interestsError) throw interestsError;
  }

  return { ...c, id: profileId };
}

// ---- Projects ----

export async function createProject(p: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      name: p.name,
      description: p.description,
      domain: p.domain,
      team_size: p.teamSize,
      experience: p.experience,
      availability: p.availability,
    })
    .select()
    .single();

  if (projectError) throw projectError;

  const projectId = (project as ProjectRow).id;

  if (p.requiredSkills.length > 0) {
    const { error: skillsError } = await supabase
      .from('project_required_skills')
      .insert(p.requiredSkills.map((skill_name) => ({ project_id: projectId, skill_name })));
    if (skillsError) throw skillsError;
  }

  return {
    ...p,
    id: projectId,
    createdAt: new Date((project as ProjectRow).created_at).getTime(),
  };
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id, name, description, domain, team_size, experience, availability, created_at,
      project_required_skills ( skill_name )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapProject(data as ProjectWithSkills);
}

// ---- Teams ----

export async function fetchTeamForProject(projectId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('teams')
    .select('id')
    .eq('project_id', projectId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return [];

  const teamId = (data as { id: string }).id;

  const { data: members, error: membersError } = await supabase
    .from('team_members')
    .select('profile_id')
    .eq('team_id', teamId);

  if (membersError) throw membersError;
  return (members as { profile_id: string }[]).map((m) => m.profile_id);
}

export async function addTeamMember(projectId: string, profileId: string): Promise<void> {
  // Find or create a team for this project
  let { data: team, error: teamError } = await supabase
    .from('teams')
    .select('id')
    .eq('project_id', projectId)
    .maybeSingle();

  if (teamError) throw teamError;

  let teamId: string;

  if (!team) {
    const { data: newTeam, error: createError } = await supabase
      .from('teams')
      .insert({ project_id: projectId })
      .select()
      .single();

    if (createError) throw createError;
    teamId = (newTeam as { id: string }).id;
  } else {
    teamId = (team as { id: string }).id;
  }

  const { error: insertError } = await supabase
    .from('team_members')
    .insert({ team_id: teamId, profile_id: profileId });

  if (insertError) {
    // Unique constraint violation means already on team — ignore
    if (insertError.code !== '23505') throw insertError;
  }
}

export async function removeTeamMember(projectId: string, profileId: string): Promise<void> {
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select('id')
    .eq('project_id', projectId)
    .maybeSingle();

  if (teamError) throw teamError;
  if (!team) return;

  const teamId = (team as { id: string }).id;

  const { error: deleteError } = await supabase
    .from('team_members')
    .delete()
    .eq('team_id', teamId)
    .eq('profile_id', profileId);

  if (deleteError) throw deleteError;
}
