import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  fetchCandidates,
  createCandidate,
  fetchTeamForProject,
  addTeamMember,
  removeTeamMember,
} from '@/lib/db';
import type { Candidate } from '@/types';

const ACTIVE_PROJECT_KEY = 'pm_active_project_id';

export function useAppData() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamIds, setTeamIds] = useState<string[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(ACTIVE_PROJECT_KEY);
    } catch {
      return null;
    }
  });

  // Load candidates on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchCandidates();
        if (!cancelled) {
          setCandidates(data);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load profiles');
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load team when active project changes
  useEffect(() => {
    if (!activeProjectId) {
      setTeamIds([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const ids = await fetchTeamForProject(activeProjectId);
        if (!cancelled) setTeamIds(ids);
      } catch {
        // ignore — team may not exist yet
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeProjectId]);

  const addCandidate = useCallback(async (c: Omit<Candidate, 'id'>) => {
    const created = await createCandidate(c);
    setCandidates((prev) => [...prev, created]);
    return created;
  }, []);

  const toggleTeamMember = useCallback(
    async (profileId: string) => {
      if (!activeProjectId) return;
      if (teamIds.includes(profileId)) {
        setTeamIds((prev) => prev.filter((x) => x !== profileId));
        try {
          await removeTeamMember(activeProjectId, profileId);
        } catch {
          // revert on failure
          setTeamIds((prev) => [...prev, profileId]);
        }
      } else {
        setTeamIds((prev) => [...prev, profileId]);
        try {
          await addTeamMember(activeProjectId, profileId);
        } catch {
          // revert on failure
          setTeamIds((prev) => prev.filter((x) => x !== profileId));
        }
      }
    },
    [activeProjectId, teamIds],
  );

  const removeMember = useCallback(
    async (profileId: string) => {
      if (!activeProjectId) return;
      setTeamIds((prev) => prev.filter((x) => x !== profileId));
      try {
        await removeTeamMember(activeProjectId, profileId);
      } catch {
        setTeamIds((prev) => [...prev, profileId]);
      }
    },
    [activeProjectId],
  );

  const setActiveProject = useCallback((projectId: string | null) => {
    setActiveProjectId(projectId);
    try {
      if (projectId) {
        sessionStorage.setItem(ACTIVE_PROJECT_KEY, projectId);
      } else {
        sessionStorage.removeItem(ACTIVE_PROJECT_KEY);
      }
    } catch {
      // ignore
    }
  }, []);

  const resetDemoData = useCallback(async () => {
    // Clear all profiles and re-seed by deleting and letting the app reload
    // Actually, just clear local state and reload — the DB seed persists
    // For a true reset, we clear the team and active project
    setActiveProject(null);
    setTeamIds([]);
    // Reload candidates from DB
    try {
      const data = await fetchCandidates();
      setCandidates(data);
    } catch {
      // ignore
    }
  }, [setActiveProject]);

  return {
    candidates,
    loading,
    error,
    teamIds,
    activeProjectId,
    setActiveProject,
    addCandidate,
    toggleTeamMember,
    removeMember,
    resetDemoData,
    supabase,
  };
}
