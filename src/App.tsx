import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { CreateProjectPage } from '@/pages/CreateProjectPage';
import { TalentPoolPage } from '@/pages/TalentPoolPage';
import { ResultsPage } from '@/pages/ResultsPage';
import { TeamPage } from '@/pages/TeamPage';
import { AboutPage } from '@/pages/AboutPage';
import { useTheme } from '@/lib/useTheme';
import { useAppData } from '@/lib/useAppData';

function AppContent() {
  const { theme, toggle } = useTheme();
  const {
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
  } = useAppData();

  const handleReset = () => {
    if (!confirm('Reset all data to demo defaults? This clears your active project and team.')) return;
    resetDemoData();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar theme={theme} onToggleTheme={toggle} />
      <main className="flex-1">
        {loading ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-slate-400">Loading profiles…</div>
          </div>
        ) : error ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <p className="text-error-400">Failed to load data from the database.</p>
              <p className="mt-2 text-sm text-slate-500">{error}</p>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/create"
              element={<CreateProjectPage onProjectCreated={setActiveProject} />}
            />
            <Route
              path="/talent"
              element={<TalentPoolPage candidates={candidates} onAddCandidate={addCandidate} />}
            />
            <Route
              path="/results"
              element={
                <ResultsPage
                  projectId={activeProjectId}
                  candidates={candidates}
                  team={teamIds}
                  toggleTeamMember={toggleTeamMember}
                />
              }
            />
            <Route
              path="/team"
              element={
                <TeamPage
                  projectId={activeProjectId}
                  candidates={candidates}
                  teamIds={teamIds}
                  removeMember={removeMember}
                  setSkillFilter={(s) => {
                    sessionStorage.setItem('pm_results_skill_filter', s);
                  }}
                />
              }
            />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        )}
      </main>
      <Footer />
      <ResetButton onReset={handleReset} />
    </div>
  );
}

function ResetButton({ onReset }: { onReset: () => void }) {
  return (
    <button
      onClick={onReset}
      className="fixed bottom-4 right-4 z-30 rounded-full bg-bg-elevated/80 px-3 py-2 text-xs font-medium text-slate-400 ring-1 ring-white/10 backdrop-blur-md transition-colors hover:text-white hover:ring-brand-500/40"
      title="Reset demo data"
    >
      Reset demo data
    </button>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
