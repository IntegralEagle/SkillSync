/*
# Create SkillSync database schema

## Overview
Creates the full database structure for the SkillSync team-matching platform.
This is a single-tenant, no-auth application — all data is intentionally public/shared
and accessible via the anon key. No user_id columns or auth.uid() checks are used.

## New Tables (7 total)

1. **profiles** — Candidate talent profiles
   - id (uuid, PK, default gen_random_uuid())
   - name (text, not null)
   - role (text, not null) — job title
   - experience (text, not null) — Beginner | Intermediate | Advanced | Expert
   - availability (text, not null) — 0-5 | 5-10 | 10-20 | 20-30 | 30+
   - bio (text, not null)
   - created_at (timestamptz, default now())

2. **profile_skills** — Junction table: profile ↔ skill names
   - id (uuid, PK)
   - profile_id (uuid, FK → profiles.id ON DELETE CASCADE)
   - skill_name (text, not null)

3. **profile_interests** — Junction table: profile ↔ interest names
   - id (uuid, PK)
   - profile_id (uuid, FK → profiles.id ON DELETE CASCADE)
   - interest_name (text, not null)

4. **projects** — User-created projects seeking team members
   - id (uuid, PK)
   - name (text, not null)
   - description (text, not null)
   - domain (text, not null)
   - team_size (integer, not null)
   - experience (text, not null) — required experience level
   - availability (text, not null) — required availability
   - created_at (timestamptz, default now())

5. **project_required_skills** — Junction table: project ↔ required skill names
   - id (uuid, PK)
   - project_id (uuid, FK → projects.id ON DELETE CASCADE)
   - skill_name (text, not null)

6. **teams** — A team grouping for a specific project
   - id (uuid, PK)
   - project_id (uuid, FK → projects.id ON DELETE CASCADE)
   - created_at (timestamptz, default now())

7. **team_members** — Junction table: team ↔ profile (selected candidates)
   - id (uuid, PK)
   - team_id (uuid, FK → teams.id ON DELETE CASCADE)
   - profile_id (uuid, FK → profiles.id ON DELETE CASCADE)
   - added_at (timestamptz, default now())

## Indexes
- profile_skills(profile_id) — speed up profile skill lookups
- profile_interests(profile_id) — speed up interest lookups
- project_required_skills(project_id) — speed up project skill lookups
- team_members(team_id) — speed up team roster queries
- teams(project_id) — speed up "find team for project" lookups

## Security
- RLS enabled on ALL 7 tables.
- All policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)`
  because this is a no-auth, single-tenant demo app where all data is intentionally
  public and shared. There is no sign-in screen; the anon key is the only client.
- 4 policies per table (SELECT, INSERT, UPDATE, DELETE).
*/

-- ============================================================
-- 1. profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  experience text NOT NULL,
  availability text NOT NULL,
  bio text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_profiles" ON profiles;
CREATE POLICY "anon_select_profiles" ON profiles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_profiles" ON profiles;
CREATE POLICY "anon_insert_profiles" ON profiles FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_profiles" ON profiles;
CREATE POLICY "anon_update_profiles" ON profiles FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_profiles" ON profiles;
CREATE POLICY "anon_delete_profiles" ON profiles FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 2. profile_skills
-- ============================================================
CREATE TABLE IF NOT EXISTS profile_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name text NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_profile_skills_profile_id ON profile_skills(profile_id);

ALTER TABLE profile_skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_profile_skills" ON profile_skills;
CREATE POLICY "anon_select_profile_skills" ON profile_skills FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_profile_skills" ON profile_skills;
CREATE POLICY "anon_insert_profile_skills" ON profile_skills FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_profile_skills" ON profile_skills;
CREATE POLICY "anon_update_profile_skills" ON profile_skills FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_profile_skills" ON profile_skills;
CREATE POLICY "anon_delete_profile_skills" ON profile_skills FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 3. profile_interests
-- ============================================================
CREATE TABLE IF NOT EXISTS profile_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  interest_name text NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_profile_interests_profile_id ON profile_interests(profile_id);

ALTER TABLE profile_interests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_profile_interests" ON profile_interests;
CREATE POLICY "anon_select_profile_interests" ON profile_interests FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_profile_interests" ON profile_interests;
CREATE POLICY "anon_insert_profile_interests" ON profile_interests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_profile_interests" ON profile_interests;
CREATE POLICY "anon_update_profile_interests" ON profile_interests FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_profile_interests" ON profile_interests;
CREATE POLICY "anon_delete_profile_interests" ON profile_interests FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 4. projects
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  domain text NOT NULL,
  team_size integer NOT NULL,
  experience text NOT NULL,
  availability text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_projects" ON projects;
CREATE POLICY "anon_select_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_projects" ON projects;
CREATE POLICY "anon_insert_projects" ON projects FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_projects" ON projects;
CREATE POLICY "anon_update_projects" ON projects FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_projects" ON projects;
CREATE POLICY "anon_delete_projects" ON projects FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 5. project_required_skills
-- ============================================================
CREATE TABLE IF NOT EXISTS project_required_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  skill_name text NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_project_required_skills_project_id ON project_required_skills(project_id);

ALTER TABLE project_required_skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_project_required_skills" ON project_required_skills;
CREATE POLICY "anon_select_project_required_skills" ON project_required_skills FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_project_required_skills" ON project_required_skills;
CREATE POLICY "anon_insert_project_required_skills" ON project_required_skills FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_project_required_skills" ON project_required_skills;
CREATE POLICY "anon_update_project_required_skills" ON project_required_skills FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_project_required_skills" ON project_required_skills;
CREATE POLICY "anon_delete_project_required_skills" ON project_required_skills FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 6. teams
-- ============================================================
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teams_project_id ON teams(project_id);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_teams" ON teams;
CREATE POLICY "anon_select_teams" ON teams FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_teams" ON teams;
CREATE POLICY "anon_insert_teams" ON teams FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_teams" ON teams;
CREATE POLICY "anon_update_teams" ON teams FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_teams" ON teams;
CREATE POLICY "anon_delete_teams" ON teams FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 7. team_members
-- ============================================================
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  added_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_profile_id ON team_members(profile_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_team_members_team_profile_unique ON team_members(team_id, profile_id);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_team_members" ON team_members;
CREATE POLICY "anon_select_team_members" ON team_members FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_team_members" ON team_members;
CREATE POLICY "anon_insert_team_members" ON team_members FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_team_members" ON team_members;
CREATE POLICY "anon_update_team_members" ON team_members FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_team_members" ON team_members;
CREATE POLICY "anon_delete_team_members" ON team_members FOR DELETE
  TO anon, authenticated USING (true);
